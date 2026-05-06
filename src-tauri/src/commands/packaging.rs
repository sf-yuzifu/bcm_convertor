use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::{Read, Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::mpsc;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Emitter, Manager};

const RESULT_MARKER: &str = "__BCM_BUILDER_RESULT__=";
const PROGRESS_MARKER: &str = "__BCM_BUILDER_PROGRESS__=";
const BUILDER_STATUS_EVENT: &str = "builder-status";
const BUILDER_LOG_EVENT: &str = "builder-log";

#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;
#[cfg(target_os = "windows")]
const ELEVATED_BUILDER_FLAG: &str = "--elevated-builder";

#[derive(Debug, Deserialize)]
struct BuilderScriptResult {
    #[serde(rename = "artifactPath")]
    artifact_path: String,
}

#[cfg(target_os = "windows")]
#[derive(Debug)]
struct ElevatedBuilderCliArgs {
    context_path: String,
    resource_dir: String,
    working_dir: String,
    cache_root: String,
    stdout_path: String,
    stderr_path: String,
    result_path: String,
}

#[cfg(target_os = "windows")]
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ElevatedBuilderResultPayload {
    status_code: Option<i32>,
    error: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct BuilderExecutionResult {
    #[serde(rename = "artifactPath")]
    artifact_path: String,
    stdout: String,
    stderr: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct BuilderStatusPayload {
    stage: String,
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    percent: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    detail: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct BuilderLogPayload {
    stream: String,
    line: String,
}

#[derive(Debug)]
struct BuilderCommandOutput {
    status_code: Option<i32>,
    stdout: String,
    stderr: String,
}

#[derive(Debug, Clone, Copy)]
enum OutputStream {
    Stdout,
    Stderr,
}

#[derive(Debug)]
struct OutputMessage {
    stream: OutputStream,
    line: String,
}

#[derive(Debug, Default)]
struct OutputTailState {
    offset: u64,
    encoding: OutputEncoding,
    pending: Vec<u8>,
}

#[derive(Debug, Clone, Copy, Default)]
enum OutputEncoding {
    #[default]
    Unknown,
    Utf8,
    Utf16Le,
}

#[derive(Debug, Default)]
struct BuilderStatusTracker {
    last_stage: String,
    last_message: String,
    last_payload_percent_tenths: Option<i32>,
    max_percent_tenths: Option<i32>,
}

fn command_error(output: &BuilderCommandOutput) -> String {
    let status = output
        .status_code
        .map(|it| it.to_string())
        .unwrap_or_else(|| "unknown".to_string());
    let stderr = output.stderr.trim();
    let stdout = output.stdout.trim();

    format!(
        "命令执行失败: status={} stdout={} stderr={}",
        status, stdout, stderr
    )
}

fn parse_builder_result(stdout: &str) -> Result<BuilderScriptResult, String> {
    for line in stdout.lines().rev() {
        if let Some(payload) = line.strip_prefix(RESULT_MARKER) {
            return serde_json::from_str(payload).map_err(|e| e.to_string());
        }
    }

    Err("找不到 electron-builder 结果输出".to_string())
}

fn normalize_percent(percent: f64) -> Option<f64> {
    if !percent.is_finite() {
        return None;
    }

    Some(percent.clamp(0.0, 100.0))
}

fn map_percent_to_range(percent: f64, start: f64, end: f64) -> f64 {
    let normalized = percent.clamp(0.0, 100.0) / 100.0;
    start + (end - start) * normalized
}

fn map_stage_percent(stage: &str, percent: f64) -> f64 {
    match stage {
        "start" => percent.clamp(0.0, 10.0),
        "prepare" => map_percent_to_range(percent, 10.0, 24.0),
        "build" => map_percent_to_range(percent, 24.0, 30.0),
        "download" => map_percent_to_range(percent, 30.0, 45.0),
        "package" => map_percent_to_range(percent, 45.0, 88.0),
        "finalize" => map_percent_to_range(percent, 88.0, 90.0),
        "success" => 100.0,
        _ => percent.clamp(0.0, 100.0),
    }
}

fn emit_builder_status_payload(
    app: &AppHandle,
    tracker: &mut BuilderStatusTracker,
    mut payload: BuilderStatusPayload,
) {
    if let Some(percent) = payload.percent.and_then(normalize_percent) {
        let mut mapped = map_stage_percent(&payload.stage, percent);
        if let Some(previous_max) = tracker.max_percent_tenths {
            let previous_max = previous_max as f64 / 10.0;
            if mapped < previous_max {
                mapped = previous_max;
            }
        }
        payload.percent = Some(mapped);
    }

    let percent_tenths = payload.percent.map(|value| (value * 10.0).round() as i32);
    if tracker.last_stage == payload.stage
        && tracker.last_message == payload.message
        && tracker.last_payload_percent_tenths == percent_tenths
    {
        return;
    }

    tracker.last_stage = payload.stage.clone();
    tracker.last_message = payload.message.clone();
    tracker.last_payload_percent_tenths = percent_tenths;
    if let Some(current) = percent_tenths {
        tracker.max_percent_tenths = Some(tracker.max_percent_tenths.unwrap_or(0).max(current));
    }

    let _ = app.emit(BUILDER_STATUS_EVENT, payload);
}

fn emit_builder_status(
    app: &AppHandle,
    tracker: &mut BuilderStatusTracker,
    stage: &str,
    message: &str,
    percent: Option<f64>,
    detail: Option<String>,
) {
    emit_builder_status_payload(
        app,
        tracker,
        BuilderStatusPayload {
            stage: stage.to_string(),
            message: message.to_string(),
            percent: percent.and_then(normalize_percent),
            detail,
        },
    );
}

fn emit_builder_log(app: &AppHandle, stream: OutputStream, line: &str) {
    if line.starts_with(PROGRESS_MARKER) || line.starts_with(RESULT_MARKER) {
        return;
    }

    let payload = BuilderLogPayload {
        stream: match stream {
            OutputStream::Stdout => "stdout".to_string(),
            OutputStream::Stderr => "stderr".to_string(),
        },
        line: line.to_string(),
    };

    let _ = app.emit(BUILDER_LOG_EVENT, payload);
}

fn format_command_arg(value: &Path) -> String {
    let text = value.to_string_lossy();

    if text.contains(' ') || text.contains('"') {
        format!("\"{}\"", text.replace('"', "\\\""))
    } else {
        text.into_owned()
    }
}

fn create_elevated_session_dir(cache_root: &Path) -> Result<PathBuf, String> {
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis();
    let session_dir = cache_root.join("elevated-session").join(stamp.to_string());
    fs::create_dir_all(&session_dir).map_err(|e| e.to_string())?;
    Ok(session_dir)
}

fn is_windows_elevation_retry_candidate(output: &BuilderCommandOutput) -> bool {
    let combined = format!("{}\n{}", output.stdout, output.stderr).to_ascii_lowercase();
    let mentions_builder_tool = combined.contains("wincodesign")
        || combined.contains("rcedit")
        || combined.contains("7z")
        || combined.contains("7-zip")
        || combined.contains("signtool");
    let mentions_privilege_issue = combined.contains("symbolic link")
        || combined.contains("symlink")
        || combined.contains("a required privilege is not held by the client")
        || combined.contains("requested operation requires elevation")
        || combined.contains("elevation required")
        || combined.contains("error code 1314")
        || combined.contains("1314")
        || combined.contains("access is denied");

    mentions_builder_tool && mentions_privilege_issue
}

#[cfg(target_os = "windows")]
fn parse_elevated_builder_cli_args() -> Result<Option<ElevatedBuilderCliArgs>, String> {
    let mut args = std::env::args();
    let _program = args.next();

    match args.next() {
        Some(flag) if flag == ELEVATED_BUILDER_FLAG => {}
        Some(_) | None => return Ok(None),
    }

    let mut context_path = None;
    let mut resource_dir = None;
    let mut working_dir = None;
    let mut cache_root = None;
    let mut stdout_path = None;
    let mut stderr_path = None;
    let mut result_path = None;

    while let Some(flag) = args.next() {
        let value = args
            .next()
            .ok_or_else(|| format!("缺少参数值: {}", flag))?;

        match flag.as_str() {
            "--context-path" => context_path = Some(value),
            "--resource-dir" => resource_dir = Some(value),
            "--working-dir" => working_dir = Some(value),
            "--cache-root" => cache_root = Some(value),
            "--stdout-log" => stdout_path = Some(value),
            "--stderr-log" => stderr_path = Some(value),
            "--result-path" => result_path = Some(value),
            _ => return Err(format!("未知参数: {}", flag)),
        }
    }

    Ok(Some(ElevatedBuilderCliArgs {
        context_path: context_path.ok_or_else(|| "缺少 context-path 参数".to_string())?,
        resource_dir: resource_dir.ok_or_else(|| "缺少 resource-dir 参数".to_string())?,
        working_dir: working_dir.ok_or_else(|| "缺少 working-dir 参数".to_string())?,
        cache_root: cache_root.ok_or_else(|| "缺少 cache-root 参数".to_string())?,
        stdout_path: stdout_path.ok_or_else(|| "缺少 stdout-log 参数".to_string())?,
        stderr_path: stderr_path.ok_or_else(|| "缺少 stderr-log 参数".to_string())?,
        result_path: result_path.ok_or_else(|| "缺少 result-path 参数".to_string())?,
    }))
}

#[cfg(target_os = "windows")]
fn write_elevated_builder_result(path: &Path, payload: &ElevatedBuilderResultPayload) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let content = serde_json::to_string(payload).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())
}

fn parse_progress_payload(line: &str) -> Option<BuilderStatusPayload> {
    let payload = line.strip_prefix(PROGRESS_MARKER)?;
    serde_json::from_str::<BuilderStatusPayload>(payload)
        .ok()
        .map(|mut progress| {
            progress.percent = progress.percent.and_then(normalize_percent);
            progress
        })
}

fn extract_percent(line: &str) -> Option<f64> {
    let bytes = line.as_bytes();
    for (index, byte) in bytes.iter().enumerate() {
        if *byte != b'%' {
            continue;
        }

        let mut start = index;
        while start > 0 {
            let candidate = bytes[start - 1];
            if candidate.is_ascii_digit() || candidate == b'.' {
                start -= 1;
            } else {
                break;
            }
        }

        if start == index {
            continue;
        }

        if let Ok(value) = line[start..index].parse::<f64>() {
            if (0.0..=100.0).contains(&value) {
                return Some(value);
            }
        }
    }

    None
}

fn parse_output_progress(line: &str) -> Option<BuilderStatusPayload> {
    let trimmed = line.trim();
    if trimmed.is_empty() || trimmed.starts_with(RESULT_MARKER) {
        return None;
    }

    if let Some(progress) = parse_progress_payload(trimmed) {
        return Some(progress);
    }

    let lower = trimmed.to_ascii_lowercase();
    if trimmed.starts_with("[bcm-builder] 检测到 Windows PNG 图标")
        || trimmed.starts_with("[bcm-builder] 图标转换:")
        || trimmed.starts_with("[bcm-builder] 使用自定义图标:")
    {
        return Some(BuilderStatusPayload {
            stage: "prepare".to_string(),
            message: "正在处理应用图标".to_string(),
            percent: Some(55.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if trimmed.starts_with("[bcm-builder] 图标转换完成:") {
        return Some(BuilderStatusPayload {
            stage: "prepare".to_string(),
            message: "正在处理应用图标".to_string(),
            percent: Some(72.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if trimmed.starts_with("[bcm-builder] electron-builder 配置摘要:")
        || trimmed.starts_with("[bcm-builder] 等效命令:")
    {
        return Some(BuilderStatusPayload {
            stage: "prepare".to_string(),
            message: "正在生成打包配置".to_string(),
            percent: Some(85.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if trimmed.starts_with("[bcm-builder] 开始执行 electron-builder") {
        return Some(BuilderStatusPayload {
            stage: "build".to_string(),
            message: "正在启动打包引擎".to_string(),
            percent: Some(10.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("found existing") {
        if lower.contains("wincodesign") {
            return Some(BuilderStatusPayload {
                stage: "package".to_string(),
                message: "正在复用已缓存的签名工具".to_string(),
                percent: Some(42.0),
                detail: Some(trimmed.to_string()),
            });
        }

        if lower.contains("nsis") {
            return Some(BuilderStatusPayload {
                stage: "package".to_string(),
                message: "正在复用已缓存的安装包工具".to_string(),
                percent: Some(80.0),
                detail: Some(trimmed.to_string()),
            });
        }

        if lower.contains("electron-builder") || lower.contains("electron") {
            return Some(BuilderStatusPayload {
                stage: "download".to_string(),
                message: "正在复用已缓存的打包依赖".to_string(),
                percent: Some(100.0),
                detail: Some(trimmed.to_string()),
            });
        }
    }

    let has_download_percent = extract_percent(trimmed).is_some();
    if lower.contains("downloading")
        || (has_download_percent
            && (lower.contains(" download ") || lower.starts_with("download ")))
    {
        let percent = extract_percent(trimmed);
        let message = percent
            .map(|value| format!("正在下载打包依赖 {:.0}%", value.round()))
            .unwrap_or_else(|| "正在下载打包依赖".to_string());

        return Some(BuilderStatusPayload {
            stage: "download".to_string(),
            message,
            percent,
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("packaging") {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在封装应用文件".to_string(),
            percent: Some(12.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("execute command") && lower.contains("rcedit") {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在写入程序图标和版本信息".to_string(),
            percent: Some(45.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("command executed") && lower.contains("rcedit") {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在校验应用可执行文件".to_string(),
            percent: Some(58.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("building") && lower.contains("target=portable") {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在生成便携版程序".to_string(),
            percent: Some(78.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("building") && (lower.contains("target=nsis") || lower.contains("makensis")) {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在生成安装包".to_string(),
            percent: Some(82.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("building") && lower.contains("target=appimage") {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在生成 AppImage 包".to_string(),
            percent: Some(82.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("building") && lower.contains("target=dir") {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在生成应用目录".to_string(),
            percent: Some(82.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("makensis") || lower.contains("nsis") {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在生成安装包".to_string(),
            percent: Some(86.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("artifact")
        || lower.contains("building block map")
        || lower.contains("blockmap")
    {
        return Some(BuilderStatusPayload {
            stage: "finalize".to_string(),
            message: "正在整理打包产物".to_string(),
            percent: Some(85.0),
            detail: Some(trimmed.to_string()),
        });
    }

    None
}

fn push_output(buffer: &mut String, line: &str) {
    if !buffer.is_empty() {
        buffer.push('\n');
    }
    buffer.push_str(line);
}

fn emit_output_line(
    app: &AppHandle,
    tracker: &mut BuilderStatusTracker,
    buffer: &mut String,
    stream: OutputStream,
    line: &str,
) {
    emit_builder_log(app, stream, line);
    push_output(buffer, line);

    if let Some(progress) = parse_output_progress(line) {
        emit_builder_status_payload(app, tracker, progress);
    }
}

fn drain_tail_lines<F: FnMut(&str)>(pending: &mut Vec<u8>, mut on_line: F) {
    let mut start = 0usize;
    let mut index = 0usize;

    while index < pending.len() {
        let current = pending[index];
        if current == b'\n' || current == b'\r' {
            let line = String::from_utf8_lossy(&pending[start..index])
                .trim()
                .to_string();
            if !line.is_empty() {
                on_line(&line);
            }

            if current == b'\r' && pending.get(index + 1) == Some(&b'\n') {
                index += 1;
            }
            start = index + 1;
        }
        index += 1;
    }

    if start > 0 {
        pending.drain(..start);
    }
}

fn looks_like_utf16le(bytes: &[u8]) -> bool {
    let mut ascii_pairs = 0usize;
    let mut total_pairs = 0usize;

    for pair in bytes.chunks_exact(2).take(32) {
        total_pairs += 1;
        if pair[0].is_ascii() && pair[0] != 0 && pair[1] == 0 {
            ascii_pairs += 1;
        }
    }

    total_pairs >= 4 && ascii_pairs >= (total_pairs / 2).max(3)
}

fn decode_utf16le_lossy(bytes: &[u8]) -> String {
    let units = bytes
        .chunks_exact(2)
        .map(|pair| u16::from_le_bytes([pair[0], pair[1]]))
        .collect::<Vec<_>>();
    String::from_utf16_lossy(&units)
}

fn detect_output_encoding(state: &mut OutputTailState) {
    if !matches!(state.encoding, OutputEncoding::Unknown) {
        return;
    }

    if state.pending.starts_with(&[0xFF, 0xFE]) {
        state.encoding = OutputEncoding::Utf16Le;
        state.pending.drain(..2);
        return;
    }

    if state.pending.len() >= 8 {
        state.encoding = if looks_like_utf16le(&state.pending) {
            OutputEncoding::Utf16Le
        } else {
            OutputEncoding::Utf8
        };
    }
}

fn drain_tail_lines_utf16le<F: FnMut(&str)>(pending: &mut Vec<u8>, mut on_line: F) {
    let available = pending.len() - (pending.len() % 2);
    if available == 0 {
        return;
    }

    let mut start = 0usize;
    let mut index = 0usize;

    while index + 1 < available {
        let code = u16::from_le_bytes([pending[index], pending[index + 1]]);

        if code == 0xFEFF && index == start {
            start += 2;
            index += 2;
            continue;
        }

        if code == b'\n' as u16 || code == b'\r' as u16 {
            let line = decode_utf16le_lossy(&pending[start..index]).trim().to_string();
            if !line.is_empty() {
                on_line(&line);
            }

            index += 2;
            if code == b'\r' as u16
                && index + 1 < available
                && u16::from_le_bytes([pending[index], pending[index + 1]]) == b'\n' as u16
            {
                index += 2;
            }
            start = index;
            continue;
        }

        index += 2;
    }

    if start > 0 {
        pending.drain(..start);
    }
}

fn poll_output_file(
    path: &Path,
    stream: OutputStream,
    state: &mut OutputTailState,
    app: &AppHandle,
    tracker: &mut BuilderStatusTracker,
    buffer: &mut String,
) -> Result<(), String> {
    if !path.exists() {
        return Ok(());
    }

    let mut file = File::open(path).map_err(|e| e.to_string())?;
    file.seek(SeekFrom::Start(state.offset))
        .map_err(|e| e.to_string())?;

    let mut chunk = Vec::new();
    file.read_to_end(&mut chunk).map_err(|e| e.to_string())?;
    state.offset += chunk.len() as u64;
    state.pending.extend_from_slice(&chunk);
    detect_output_encoding(state);

    match state.encoding {
        OutputEncoding::Utf16Le => {
            drain_tail_lines_utf16le(&mut state.pending, |line| {
                emit_output_line(app, tracker, buffer, stream, line);
            });
        }
        OutputEncoding::Utf8 | OutputEncoding::Unknown => {
            drain_tail_lines(&mut state.pending, |line| {
                emit_output_line(app, tracker, buffer, stream, line);
            });
        }
    }

    Ok(())
}

fn flush_output_tail(
    stream: OutputStream,
    state: &mut OutputTailState,
    app: &AppHandle,
    tracker: &mut BuilderStatusTracker,
    buffer: &mut String,
) {
    detect_output_encoding(state);
    let remaining = match state.encoding {
        OutputEncoding::Utf16Le => {
            let available = state.pending.len() - (state.pending.len() % 2);
            decode_utf16le_lossy(&state.pending[..available]).trim().to_string()
        }
        OutputEncoding::Utf8 | OutputEncoding::Unknown => {
            String::from_utf8_lossy(&state.pending).trim().to_string()
        }
    };
    state.pending.clear();

    if !remaining.is_empty() {
        emit_output_line(app, tracker, buffer, stream, &remaining);
    }
}

fn drain_lines(
    pending: &mut Vec<u8>,
    stream: OutputStream,
    sender: &mpsc::Sender<OutputMessage>,
) {
    let mut start = 0usize;
    let mut index = 0usize;

    while index < pending.len() {
        let current = pending[index];
        if current == b'\n' || current == b'\r' {
            let line = String::from_utf8_lossy(&pending[start..index])
                .trim()
                .to_string();
            if !line.is_empty() {
                let _ = sender.send(OutputMessage { stream, line });
            }

            if current == b'\r' && pending.get(index + 1) == Some(&b'\n') {
                index += 1;
            }
            start = index + 1;
        }
        index += 1;
    }

    if start > 0 {
        pending.drain(..start);
    }
}

fn spawn_output_reader<R: Read + Send + 'static>(
    reader: R,
    stream: OutputStream,
    sender: mpsc::Sender<OutputMessage>,
) -> thread::JoinHandle<()> {
    thread::spawn(move || {
        let mut reader = reader;
        let mut pending = Vec::new();
        let mut chunk = [0u8; 4096];

        loop {
            match reader.read(&mut chunk) {
                Ok(0) => break,
                Ok(size) => {
                    pending.extend_from_slice(&chunk[..size]);
                    drain_lines(&mut pending, stream, &sender);
                }
                Err(_) => break,
            }
        }

        let remaining = String::from_utf8_lossy(&pending).trim().to_string();
        if !remaining.is_empty() {
            let _ = sender.send(OutputMessage {
                stream,
                line: remaining,
            });
        }
    })
}

#[cfg(target_os = "windows")]
fn bundled_node_candidates(resource_dir: &Path) -> Vec<PathBuf> {
    vec![resource_dir
        .join("builder")
        .join("runtimes")
        .join("windows-x64")
        .join("node.exe")]
}

#[cfg(target_os = "linux")]
fn bundled_node_candidates(resource_dir: &Path) -> Vec<PathBuf> {
    vec![resource_dir
        .join("builder")
        .join("runtimes")
        .join("linux-x64")
        .join("node")]
}

#[cfg(target_os = "macos")]
fn bundled_node_candidates(resource_dir: &Path) -> Vec<PathBuf> {
    vec![
        resource_dir
            .join("builder")
            .join("runtimes")
            .join("macos-arm64")
            .join("node"),
        resource_dir
            .join("builder")
            .join("runtimes")
            .join("macos-x64")
            .join("node"),
    ]
}

fn resolve_bundled_node_command(resource_dir: &Path) -> Option<PathBuf> {
    bundled_node_candidates(resource_dir)
        .into_iter()
        .find(|candidate| candidate.exists())
}

fn resolve_node_command(resource_dir: &Path) -> Result<PathBuf, String> {
    if let Some(bundled_node) = resolve_bundled_node_command(resource_dir) {
        return Ok(bundled_node);
    }

    if cfg!(debug_assertions) {
        return Ok(PathBuf::from("node"));
    }

    Err("找不到内置 Node.js 运行时，请确认 builder/runtimes 已正确随应用发布".to_string())
}

fn run_builder_process(
    app: AppHandle,
    resource_dir: &Path,
    working_dir: &Path,
    context_path: &str,
    cache_root: &Path,
) -> Result<BuilderCommandOutput, String> {
    let script_path = resource_dir.join("builder").join("scripts").join("build.mjs");
    let node_command = resolve_node_command(resource_dir)?;
    let mut command = Command::new(node_command);

    command
        .arg(&script_path)
        .arg(context_path)
        .current_dir(working_dir)
        .env("BCM_RESOURCE_DIR", resource_dir)
        .env("BCM_BUILDER_CACHE_ROOT", cache_root)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(CREATE_NO_WINDOW);
    }

    emit_builder_log(
        &app,
        OutputStream::Stdout,
        &format!(
            "[runner] 执行命令: {} {} {}",
            format_command_arg(command.get_program().as_ref()),
            format_command_arg(&script_path),
            format_command_arg(Path::new(context_path))
        ),
    );
    emit_builder_log(
        &app,
        OutputStream::Stdout,
        &format!("[runner] 工作目录: {}", working_dir.display()),
    );
    emit_builder_log(
        &app,
        OutputStream::Stdout,
        &format!("[runner] 资源目录: {}", resource_dir.display()),
    );
    emit_builder_log(
        &app,
        OutputStream::Stdout,
        &format!("[runner] 缓存目录: {}", cache_root.display()),
    );

    let mut child = command.spawn().map_err(|e| e.to_string())?;
    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| "无法获取构建命令标准输出".to_string())?;
    let stderr = child
        .stderr
        .take()
        .ok_or_else(|| "无法获取构建命令错误输出".to_string())?;

    let (sender, receiver) = mpsc::channel();
    let stdout_handle = spawn_output_reader(stdout, OutputStream::Stdout, sender.clone());
    let stderr_handle = spawn_output_reader(stderr, OutputStream::Stderr, sender.clone());
    drop(sender);

    let mut stdout_text = String::new();
    let mut stderr_text = String::new();
    let mut tracker = BuilderStatusTracker::default();

    for message in receiver {
        emit_builder_log(&app, message.stream, &message.line);

        match message.stream {
            OutputStream::Stdout => push_output(&mut stdout_text, &message.line),
            OutputStream::Stderr => push_output(&mut stderr_text, &message.line),
        }

        if let Some(progress) = parse_output_progress(&message.line) {
            emit_builder_status_payload(&app, &mut tracker, progress);
        }
    }

    let status = child.wait().map_err(|e| e.to_string())?;
    let _ = stdout_handle.join();
    let _ = stderr_handle.join();

    Ok(BuilderCommandOutput {
        status_code: status.code(),
        stdout: stdout_text,
        stderr: stderr_text,
    })
}

#[cfg(target_os = "windows")]
fn append_log_line(path: &Path, line: &str) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .map_err(|e| e.to_string())?;
    file.write_all(line.as_bytes()).map_err(|e| e.to_string())?;
    file.write_all(b"\n").map_err(|e| e.to_string())
}

#[cfg(target_os = "windows")]
fn run_builder_process_to_log_files(
    resource_dir: &Path,
    working_dir: &Path,
    context_path: &str,
    cache_root: &Path,
    stdout_path: &Path,
    stderr_path: &Path,
) -> Result<BuilderCommandOutput, String> {
    let script_path = resource_dir.join("builder").join("scripts").join("build.mjs");
    let node_command = resolve_node_command(resource_dir)?;

    if let Some(parent) = stdout_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    if let Some(parent) = stderr_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let stdout_file = File::create(stdout_path).map_err(|e| e.to_string())?;
    let stderr_file = File::create(stderr_path).map_err(|e| e.to_string())?;
    let mut command = Command::new(node_command);
    command
        .arg(&script_path)
        .arg(context_path)
        .current_dir(working_dir)
        .env("BCM_RESOURCE_DIR", resource_dir)
        .env("BCM_BUILDER_CACHE_ROOT", cache_root)
        .stdout(Stdio::from(stdout_file))
        .stderr(Stdio::from(stderr_file));

    use std::os::windows::process::CommandExt;
    command.creation_flags(CREATE_NO_WINDOW);

    let status = command.status().map_err(|e| e.to_string())?;
    Ok(BuilderCommandOutput {
        status_code: status.code(),
        stdout: String::new(),
        stderr: String::new(),
    })
}

#[cfg(target_os = "windows")]
fn quote_windows_arg(value: &str) -> String {
    let escaped = value.replace('"', "\\\"");
    format!("\"{}\"", escaped)
}

#[cfg(target_os = "windows")]
fn launch_self_elevated(exe_path: &Path, params: &str, working_dir: &Path) -> Result<(), String> {
    use std::ffi::OsStr;
    use std::os::windows::ffi::OsStrExt;
    use windows_sys::Win32::UI::Shell::ShellExecuteW;
    use windows_sys::Win32::UI::WindowsAndMessaging::SW_HIDE;

    let to_wide = |value: &OsStr| -> Vec<u16> { value.encode_wide().chain(std::iter::once(0)).collect() };
    let operation = to_wide(OsStr::new("runas"));
    let file = to_wide(exe_path.as_os_str());
    let parameters = to_wide(OsStr::new(params));
    let directory = to_wide(working_dir.as_os_str());

    let result = unsafe {
        ShellExecuteW(
            std::ptr::null_mut(),
            operation.as_ptr(),
            file.as_ptr(),
            parameters.as_ptr(),
            directory.as_ptr(),
            SW_HIDE,
        )
    } as isize;

    if result <= 32 {
        if result == 5 {
            return Err("管理员授权已取消，无法继续完成 Windows 可执行文件处理".to_string());
        }

        return Err(format!("启动管理员进程失败，错误码: {}", result));
    }

    Ok(())
}

#[cfg(target_os = "windows")]
fn read_elevated_builder_result(path: &Path) -> Result<Option<ElevatedBuilderResultPayload>, String> {
    if !path.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let payload = serde_json::from_str::<ElevatedBuilderResultPayload>(&content).map_err(|e| e.to_string())?;
    Ok(Some(payload))
}

#[cfg(target_os = "windows")]
pub fn try_handle_elevated_builder_cli() {
    let Some(args) = parse_elevated_builder_cli_args().unwrap_or_else(|error| {
        eprintln!("{}", error);
        std::process::exit(1);
    }) else {
        return;
    };

    let stdout_path = PathBuf::from(&args.stdout_path);
    let stderr_path = PathBuf::from(&args.stderr_path);
    let result_path = PathBuf::from(&args.result_path);

    let result = run_builder_process_to_log_files(
        Path::new(&args.resource_dir),
        Path::new(&args.working_dir),
        &args.context_path,
        Path::new(&args.cache_root),
        &stdout_path,
        &stderr_path,
    );

    let payload = match result {
        Ok(output) => ElevatedBuilderResultPayload {
            status_code: output.status_code,
            error: None,
        },
        Err(error) => {
            let _ = append_log_line(&stderr_path, &error);
            ElevatedBuilderResultPayload {
                status_code: Some(1),
                error: Some(error),
            }
        }
    };

    if let Err(error) = write_elevated_builder_result(&result_path, &payload) {
        eprintln!("{}", error);
        std::process::exit(1);
    }

    std::process::exit(payload.status_code.unwrap_or(1));
}

#[cfg(target_os = "windows")]
fn run_builder_process_elevated(
    app: AppHandle,
    resource_dir: &Path,
    working_dir: &Path,
    context_path: &str,
    cache_root: &Path,
) -> Result<BuilderCommandOutput, String> {
    let session_dir = create_elevated_session_dir(cache_root)?;
    let stdout_path = session_dir.join("builder.stdout.log");
    let stderr_path = session_dir.join("builder.stderr.log");
    let result_path = session_dir.join("builder.result.json");
    let current_exe = std::env::current_exe().map_err(|e| e.to_string())?;
    let params = [
        ELEVATED_BUILDER_FLAG.to_string(),
        "--context-path".to_string(),
        quote_windows_arg(context_path),
        "--resource-dir".to_string(),
        quote_windows_arg(&resource_dir.display().to_string()),
        "--working-dir".to_string(),
        quote_windows_arg(&working_dir.display().to_string()),
        "--cache-root".to_string(),
        quote_windows_arg(&cache_root.display().to_string()),
        "--stdout-log".to_string(),
        quote_windows_arg(&stdout_path.display().to_string()),
        "--stderr-log".to_string(),
        quote_windows_arg(&stderr_path.display().to_string()),
        "--result-path".to_string(),
        quote_windows_arg(&result_path.display().to_string()),
    ]
    .join(" ");

    emit_builder_log(
        &app,
        OutputStream::Stdout,
        "[runner] 检测到权限受限，准备请求管理员权限继续打包",
    );
    emit_builder_log(
        &app,
        OutputStream::Stdout,
        &format!("[runner] 提权输出目录: {}", session_dir.display()),
    );
    emit_builder_log(
        &app,
        OutputStream::Stdout,
        &format!("[runner] 提权执行文件: {}", current_exe.display()),
    );

    launch_self_elevated(&current_exe, &params, working_dir)?;
    let mut stdout_tail = OutputTailState::default();
    let mut stderr_tail = OutputTailState::default();
    let mut stdout_text = String::new();
    let mut stderr_text = String::new();
    let mut tracker = BuilderStatusTracker::default();
    let result_payload;

    loop {
        poll_output_file(
            &stdout_path,
            OutputStream::Stdout,
            &mut stdout_tail,
            &app,
            &mut tracker,
            &mut stdout_text,
        )?;
        poll_output_file(
            &stderr_path,
            OutputStream::Stderr,
            &mut stderr_tail,
            &app,
            &mut tracker,
            &mut stderr_text,
        )?;

        if let Some(payload) = read_elevated_builder_result(&result_path)? {
            result_payload = payload;
            break;
        }

        thread::sleep(Duration::from_millis(180));
    }

    poll_output_file(
        &stdout_path,
        OutputStream::Stdout,
        &mut stdout_tail,
        &app,
        &mut tracker,
        &mut stdout_text,
    )?;
    poll_output_file(
        &stderr_path,
        OutputStream::Stderr,
        &mut stderr_tail,
        &app,
        &mut tracker,
        &mut stderr_text,
    )?;
    flush_output_tail(
        OutputStream::Stdout,
        &mut stdout_tail,
        &app,
        &mut tracker,
        &mut stdout_text,
    );
    flush_output_tail(
        OutputStream::Stderr,
        &mut stderr_tail,
        &app,
        &mut tracker,
        &mut stderr_text,
    );

    if let Some(error) = result_payload.error.clone() {
        return Err(error);
    }

    let status_code = result_payload.status_code;
    Ok(BuilderCommandOutput {
        status_code,
        stdout: stdout_text,
        stderr: stderr_text,
    })
}

#[tauri::command]
pub async fn run_electron_builder(
    app: AppHandle,
    context_path: String,
) -> Result<BuilderExecutionResult, String> {
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let script_path = resource_dir.join("builder").join("scripts").join("build.mjs");
    let cache_root = app
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("builder-downloads");

    if !script_path.exists() {
        return Err(format!(
            "找不到内置 builder 脚本: {}",
            script_path.display()
        ));
    }

    let context_file = PathBuf::from(&context_path);
    let working_dir = context_file
        .parent()
        .ok_or_else(|| format!("无法获取构建上下文目录: {}", context_file.display()))?;

    let mut tracker = BuilderStatusTracker::default();
    emit_builder_status(
        &app,
        &mut tracker,
        "start",
        "正在启动打包任务",
        Some(0.0),
        None,
    );

    let app_for_task = app.clone();
    let resource_dir_for_task = resource_dir.clone();
    let working_dir_for_task = working_dir.to_path_buf();
    let context_path_for_task = context_path.clone();
    let cache_root_for_task = cache_root.clone();
    let output = tauri::async_runtime::spawn_blocking(move || {
        run_builder_process(
            app_for_task,
            &resource_dir_for_task,
            &working_dir_for_task,
            &context_path_for_task,
            &cache_root_for_task,
        )
    })
    .await
    .map_err(|e| e.to_string())??;

    let output = if output.status_code.unwrap_or_default() != 0 {
        #[cfg(target_os = "windows")]
        {
            if is_windows_elevation_retry_candidate(&output) {
                emit_builder_status(
                    &app,
                    &mut tracker,
                    "package",
                    "检测到系统权限限制，正在申请管理员权限继续打包",
                    Some(58.0),
                    None,
                );
                emit_builder_log(
                    &app,
                    OutputStream::Stdout,
                    "[runner] 普通权限打包失败，正在尝试以管理员权限继续执行 electron-builder",
                );

                let app_for_retry = app.clone();
                let resource_dir_for_retry = resource_dir.clone();
                let working_dir_for_retry = working_dir.to_path_buf();
                let context_path_for_retry = context_path.clone();
                let cache_root_for_retry = cache_root.clone();
                tauri::async_runtime::spawn_blocking(move || {
                    run_builder_process_elevated(
                        app_for_retry,
                        &resource_dir_for_retry,
                        &working_dir_for_retry,
                        &context_path_for_retry,
                        &cache_root_for_retry,
                    )
                })
                .await
                .map_err(|e| e.to_string())??
            } else {
                output
            }
        }

        #[cfg(not(target_os = "windows"))]
        {
            output
        }
    } else {
        output
    };

    if output.status_code.unwrap_or_default() != 0 {
        emit_builder_status(
            &app,
            &mut tracker,
            "error",
            "打包任务执行失败",
            None,
            None,
        );
        return Err(command_error(&output));
    }

    let stdout = output.stdout.trim().to_string();
    let stderr = output.stderr.trim().to_string();
    let builder_result = parse_builder_result(&stdout)?;
    emit_builder_status(
        &app,
        &mut tracker,
        "success",
        "打包任务已完成",
        Some(100.0),
        None,
    );

    Ok(BuilderExecutionResult {
        artifact_path: builder_result.artifact_path,
        stdout,
        stderr,
    })
}

// Android APK Packaging

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
struct AndroidBuildContext {
    workspace_dir: String,
    output_dir: String,
    #[allow(dead_code)]
    export_dir: String,
    #[allow(dead_code)]
    product_name: String,
    artifact_base_name: String,
    package_name: String,
    app_name: String,
    version_code: i32,
    version_name: String,
    #[allow(dead_code)]
    author: String,
    #[allow(dead_code)]
    icon_path: Option<String>,
    work_type: String,
    work_id: String,
    asset_entries: Vec<String>,
    work_files_dir: String,
}

#[cfg(target_os = "windows")]
fn get_java_binary_name() -> &'static str {
    "java.exe"
}

#[cfg(not(target_os = "windows"))]
fn get_java_binary_name() -> &'static str {
    "java"
}

fn find_bundled_java(resource_dir: &Path) -> Result<PathBuf, String> {
    let java_name = get_java_binary_name();
    let jre_java = resource_dir
        .join("builder")
        .join("android")
        .join("jre")
        .join("bin")
        .join(java_name);

    if jre_java.exists() {
        return Ok(jre_java);
    }

    Err(format!(
        "找不到内置 JRE，请运行 yarn prepare:android 下载。\n期望路径: {}",
        jre_java.display()
    ))
}

fn run_apktool_command(
    app: &AppHandle,
    java_path: &Path,
    apktool_path: &Path,
    args: &[&str],
    working_dir: &Path,
) -> Result<BuilderCommandOutput, String> {
    let mut command = Command::new(java_path);
    command
        .arg("-jar")
        .arg(apktool_path)
        .args(args)
        .current_dir(working_dir)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(CREATE_NO_WINDOW);
    }

    emit_builder_log(
        app,
        OutputStream::Stdout,
        &format!(
            "[android-runner] 执行: {} -jar {} {}",
            java_path.display(),
            apktool_path.display(),
            args.join(" ")
        ),
    );

    let mut child = command.spawn().map_err(|e| e.to_string())?;
    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| "无法获取 apktool 标准输出".to_string())?;
    let stderr = child
        .stderr
        .take()
        .ok_or_else(|| "无法获取 apktool 错误输出".to_string())?;

    let (sender, receiver) = mpsc::channel();
    let stdout_handle = spawn_output_reader(stdout, OutputStream::Stdout, sender.clone());
    let stderr_handle = spawn_output_reader(stderr, OutputStream::Stderr, sender);

    let mut stdout_text = String::new();
    let mut stderr_text = String::new();
    let mut tracker = BuilderStatusTracker::default();

    for message in receiver {
        emit_builder_log(app, message.stream, &message.line);

        match message.stream {
            OutputStream::Stdout => push_output(&mut stdout_text, &message.line),
            OutputStream::Stderr => push_output(&mut stderr_text, &message.line),
        }

        // Parse Android-specific progress
        if let Some(progress) = parse_android_progress(&message.line) {
            emit_builder_status_payload(app, &mut tracker, progress);
        }
    }

    let status = child.wait().map_err(|e| e.to_string())?;
    let _ = stdout_handle.join();
    let _ = stderr_handle.join();

    Ok(BuilderCommandOutput {
        status_code: status.code(),
        stdout: stdout_text,
        stderr: stderr_text,
    })
}

fn parse_android_progress(line: &str) -> Option<BuilderStatusPayload> {
    let trimmed = line.trim();
    let lower = trimmed.to_lowercase();

    if lower.contains("using apktool") {
        return Some(BuilderStatusPayload {
            stage: "decompile".to_string(),
            message: "正在初始化 Apktool".to_string(),
            percent: Some(5.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("loading resource table") {
        return Some(BuilderStatusPayload {
            stage: "decompile".to_string(),
            message: "正在加载资源表".to_string(),
            percent: Some(10.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("decoding") && lower.contains("resources") {
        return Some(BuilderStatusPayload {
            stage: "decompile".to_string(),
            message: "正在解码资源文件".to_string(),
            percent: Some(20.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("decoding") && lower.contains("manifest") {
        return Some(BuilderStatusPayload {
            stage: "decompile".to_string(),
            message: "正在解码清单文件".to_string(),
            percent: Some(30.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("copying assets") || lower.contains("copying libs") {
        return Some(BuilderStatusPayload {
            stage: "decompile".to_string(),
            message: "正在复制资源文件".to_string(),
            percent: Some(40.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("checking whether sources has changed") {
        return Some(BuilderStatusPayload {
            stage: "build".to_string(),
            message: "正在检查源代码变更".to_string(),
            percent: Some(50.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("smaling") {
        return Some(BuilderStatusPayload {
            stage: "build".to_string(),
            message: "正在编译 Smali 代码".to_string(),
            percent: Some(55.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("building resources") {
        return Some(BuilderStatusPayload {
            stage: "build".to_string(),
            message: "正在构建资源文件".to_string(),
            percent: Some(60.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("building apk file") {
        return Some(BuilderStatusPayload {
            stage: "build".to_string(),
            message: "正在构建 APK 文件".to_string(),
            percent: Some(70.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("built apk") {
        return Some(BuilderStatusPayload {
            stage: "build".to_string(),
            message: "APK 构建完成".to_string(),
            percent: Some(75.0),
            detail: Some(trimmed.to_string()),
        });
    }

    None
}

fn run_apksigner_command(
    app: &AppHandle,
    java_path: &Path,
    apksigner_path: &Path,
    keystore_path: &Path,
    unsigned_apk_path: &Path,
    signed_apk_path: &Path,
) -> Result<BuilderCommandOutput, String> {
    let mut command = Command::new(java_path);
    command
        .arg("-jar")
        .arg(apksigner_path)
        .arg("sign")
        .arg("--ks")
        .arg(keystore_path)
        .arg("--ks-pass")
        .arg("pass:bcmconvertor")
        .arg("--ks-key-alias")
        .arg("bcmkey")
        .arg("--key-pass")
        .arg("pass:bcmconvertor")
        .arg("--out")
        .arg(signed_apk_path)
        .arg(unsigned_apk_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(CREATE_NO_WINDOW);
    }

    emit_builder_log(
        app,
        OutputStream::Stdout,
        &format!(
            "[android-runner] 正在签名 APK: {} -> {}",
            unsigned_apk_path.display(),
            signed_apk_path.display()
        ),
    );

    let output = command.output().map_err(|e| e.to_string())?;

    Ok(BuilderCommandOutput {
        status_code: if output.status.success() { Some(0) } else { Some(1) },
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
    })
}

fn modify_android_manifest(
    manifest_path: &Path,
    package_name: &str,
    app_name: &str,
    version_code: i32,
    version_name: &str,
) -> Result<(), String> {
    let content = fs::read_to_string(manifest_path).map_err(|e| e.to_string())?;

    // Replace package name
    let modified = content
        .replace(
            r#"package="moe.yuzifu.bcmshell""#,
            &format!(r#"package="{}""#, package_name),
        )
        .replace(
            r#"android:versionCode="1""#,
            &format!(r#"android:versionCode="{}""#, version_code),
        )
        .replace(
            r#"android:versionName="1.0.0""#,
            &format!(r#"android:versionName="{}""#, version_name),
        );

    fs::write(manifest_path, modified).map_err(|e| e.to_string())?;

    // Update strings.xml for app name
    let strings_path = manifest_path
        .parent()
        .unwrap()
        .join("res")
        .join("values")
        .join("strings.xml");

    if strings_path.exists() {
        let strings_content = fs::read_to_string(&strings_path).map_err(|e| e.to_string())?;
        let modified_strings = strings_content.replace(
            "<string name=\"app_name\">BCM Shell</string>",
            &format!("<string name=\"app_name\">{}</string>", app_name),
        );
        fs::write(&strings_path, modified_strings).map_err(|e| e.to_string())?;
    }

    Ok(())
}

fn copy_dir_recursive(src: &Path, dst: &Path) -> Result<(), String> {
    fs::create_dir_all(dst).map_err(|e| e.to_string())?;
    
    for entry in fs::read_dir(src).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());
        
        if src_path.is_dir() {
            copy_dir_recursive(&src_path, &dst_path)?;
        } else {
            fs::copy(&src_path, &dst_path).map_err(|e| {
                format!("Failed to copy {} to {}: {}", src_path.display(), dst_path.display(), e)
            })?;
        }
    }
    
    Ok(())
}

fn copy_work_files(
    asset_entries: &[String],
    work_files_dir: &Path,
    assets_dir: &Path,
) -> Result<(), String> {
    // Copy asset entries from work_files_dir to assets_dir
    for entry in asset_entries {
        let src_path = work_files_dir.join(entry);
        let dst_path = assets_dir.join(entry);
        
        if src_path.is_dir() {
            copy_dir_recursive(&src_path, &dst_path)?;
        } else if src_path.is_file() {
            if let Some(parent) = dst_path.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            fs::copy(&src_path, &dst_path).map_err(|e| {
                format!("Failed to copy {} to {}: {}", src_path.display(), dst_path.display(), e)
            })?;
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn run_android_packaging(
    app: AppHandle,
    context_path: String,
) -> Result<BuilderExecutionResult, String> {
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let android_builder_dir = resource_dir.join("builder").join("android");
    let source_apktool_path = android_builder_dir.join("apktool.jar");
    let source_base_apk_path = resource_dir.join("convert").join("android").join("base.apk");
    let source_keystore_path = android_builder_dir.join("release.keystore");
    let source_apksigner_path = android_builder_dir.join("apksigner.jar");

    if !source_apktool_path.exists() {
        return Err(format!(
            "找不到 apktool: {}",
            source_apktool_path.display()
        ));
    }

    if !source_base_apk_path.exists() {
        return Err(format!(
            "找不到基础 APK 模板: {}",
            source_base_apk_path.display()
        ));
    }

    if !source_apksigner_path.exists() {
        return Err(format!(
            "找不到 apksigner: {}\n请将 apksigner.jar (来自 Android SDK build-tools) 放入此目录",
            source_apksigner_path.display()
        ));
    }

    if !source_keystore_path.exists() {
        return Err(format!(
            "找不到 release keystore: {}\n请运行 yarn prepare:android 自动生成",
            source_keystore_path.display()
        ));
    }

    let java_path = find_bundled_java(&resource_dir)?;

    // Read build context
    let context_content = fs::read_to_string(&context_path).map_err(|e| e.to_string())?;
    let context: AndroidBuildContext =
        serde_json::from_str(&context_content).map_err(|e| e.to_string())?;

    let workspace_dir = PathBuf::from(&context.workspace_dir);
    let output_dir = PathBuf::from(&context.output_dir);
    let tools_dir = workspace_dir.join("android-tools");
    let decompiled_dir = output_dir.join("decompiled");
    let unsigned_apk_path = output_dir.join(format!("{}-unsigned.apk", context.artifact_base_name));
    let signed_apk_path = output_dir.join(format!("{}.apk", context.artifact_base_name));

    fs::create_dir_all(&output_dir).map_err(|e| e.to_string())?;
    fs::create_dir_all(&tools_dir).map_err(|e| e.to_string())?;

    // Copy tools to workspace to avoid UNC path issues
    let apktool_path = tools_dir.join("apktool.jar");
    let apksigner_path = tools_dir.join("apksigner.jar");
    let base_apk_path = tools_dir.join("base.apk");
    let keystore_path = tools_dir.join("release.keystore");
    
    fs::copy(&source_apktool_path, &apktool_path).map_err(|e| format!("复制 apktool 失败: {}", e))?;
    fs::copy(&source_apksigner_path, &apksigner_path).map_err(|e| format!("复制 apksigner 失败: {}", e))?;
    fs::copy(&source_base_apk_path, &base_apk_path).map_err(|e| format!("复制 base.apk 失败: {}", e))?;
    if source_keystore_path.exists() {
        fs::copy(&source_keystore_path, &keystore_path).map_err(|e| format!("复制 keystore 失败: {}", e))?;
    }

    let mut tracker = BuilderStatusTracker::default();

    // Step 1: Decompile base APK
    emit_builder_status(
        &app,
        &mut tracker,
        "decompile",
        "正在反编译壳 APK",
        Some(10.0),
        None,
    );

    if decompiled_dir.exists() {
        fs::remove_dir_all(&decompiled_dir).map_err(|e| e.to_string())?;
    }

    let decompile_output = run_apktool_command(
        &app,
        &java_path,
        &apktool_path,
        &[
            "d",
            &base_apk_path.display().to_string(),
            "-o",
            &decompiled_dir.display().to_string(),
            "-f",
        ],
        &workspace_dir,
    )?;

    if decompile_output.status_code.unwrap_or_default() != 0 {
        return Err(format!(
            "反编译失败: {}",
            decompile_output.stderr
        ));
    }

    // Step 2: Modify AndroidManifest.xml
    emit_builder_status(
        &app,
        &mut tracker,
        "configure",
        "正在修改应用配置",
        Some(40.0),
        None,
    );

    let manifest_path = decompiled_dir.join("AndroidManifest.xml");
    modify_android_manifest(
        &manifest_path,
        &context.package_name,
        &context.app_name,
        context.version_code,
        &context.version_name,
    )?;

    // Step 3: Copy work files
    emit_builder_status(
        &app,
        &mut tracker,
        "assets",
        "正在复制作品资源",
        Some(50.0),
        None,
    );

    let assets_dir = decompiled_dir.join("assets");
    let work_files_dir = PathBuf::from(&context.work_files_dir);
    copy_work_files(&context.asset_entries, &work_files_dir, &assets_dir)?;

    // Step 4: Rebuild APK
    emit_builder_status(
        &app,
        &mut tracker,
        "build",
        "正在重打包 APK",
        Some(60.0),
        None,
    );

    let build_output = run_apktool_command(
        &app,
        &java_path,
        &apktool_path,
        &[
            "b",
            &decompiled_dir.display().to_string(),
            "-o",
            &unsigned_apk_path.display().to_string(),
        ],
        &workspace_dir,
    )?;

    if build_output.status_code.unwrap_or_default() != 0 {
        return Err(format!(
            "重打包失败: {}",
            build_output.stderr
        ));
    }

    // Step 5: Sign APK
    emit_builder_status(
        &app,
        &mut tracker,
        "sign",
        "正在签名 APK",
        Some(85.0),
        None,
    );

    let sign_output = run_apksigner_command(
        &app,
        &java_path,
        &apksigner_path,
        &keystore_path,
        &unsigned_apk_path,
        &signed_apk_path,
    )?;

    if sign_output.status_code.unwrap_or_default() != 0 {
        return Err(format!(
            "签名失败: {}",
            sign_output.stderr
        ));
    }

    // Cleanup
    let _ = fs::remove_dir_all(&decompiled_dir);
    let _ = fs::remove_file(&unsigned_apk_path);

    emit_builder_status(
        &app,
        &mut tracker,
        "success",
        "APK 打包完成",
        Some(100.0),
        None,
    );

    Ok(BuilderExecutionResult {
        artifact_path: signed_apk_path.display().to_string(),
        stdout: build_output.stdout,
        stderr: build_output.stderr,
    })
}
