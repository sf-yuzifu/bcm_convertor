use serde::{Deserialize, Serialize};
use std::io::Read;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::mpsc;
use std::thread;
use tauri::{AppHandle, Emitter, Manager};

const RESULT_MARKER: &str = "__BCM_BUILDER_RESULT__=";
const PROGRESS_MARKER: &str = "__BCM_BUILDER_PROGRESS__=";
const BUILDER_STATUS_EVENT: &str = "builder-status";

#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Debug, Deserialize)]
struct BuilderScriptResult {
    #[serde(rename = "artifactPath")]
    artifact_path: String,
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
        "start" => 0.0,
        "prepare" => percent.clamp(0.0, 12.0),
        "build" => percent.clamp(12.0, 20.0),
        // 下载阶段使用真实日志百分比，但映射到整体进度区间，避免后续阶段出现倒退。
        "download" => map_percent_to_range(percent, 20.0, 72.0),
        "package" => percent.clamp(78.0, 92.0),
        "finalize" => percent.clamp(94.0, 98.0),
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
    if lower.contains("download") || lower.contains("downloading") {
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
            message: "正在封装应用".to_string(),
            percent: Some(78.0),
            detail: Some(trimmed.to_string()),
        });
    }

    if lower.contains("makensis") || lower.contains("nsis") {
        return Some(BuilderStatusPayload {
            stage: "package".to_string(),
            message: "正在生成安装包".to_string(),
            percent: Some(90.0),
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
            percent: Some(96.0),
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
