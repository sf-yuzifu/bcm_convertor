use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use tauri::{AppHandle, Emitter, Manager};

const RESULT_MARKER: &str = "__BCM_BUILDER_RESULT__=";
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

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct BuilderStatusPayload {
    stage: String,
    message: String,
}

fn command_error(output: &Output) -> String {
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();

    format!(
        "命令执行失败: status={} stdout={} stderr={}",
        output.status, stdout, stderr
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

fn emit_builder_status(app: &AppHandle, stage: &str, message: &str) {
    let _ = app.emit(
        BUILDER_STATUS_EVENT,
        BuilderStatusPayload {
            stage: stage.to_string(),
            message: message.to_string(),
        },
    );
}

fn run_builder_process(
    resource_dir: &Path,
    working_dir: &Path,
    context_path: &str,
    cache_root: &Path,
) -> Result<Output, String> {
    let script_path = resource_dir.join("builder").join("scripts").join("build.mjs");
    let node_command = resolve_node_command(resource_dir)?;
    let mut command = Command::new(node_command);

    command
        .arg(&script_path)
        .arg(context_path)
        .current_dir(working_dir)
        .env("BCM_RESOURCE_DIR", resource_dir)
        .env("BCM_BUILDER_CACHE_ROOT", cache_root);

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(CREATE_NO_WINDOW);
    }

    command.output().map_err(|e| e.to_string())
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

    emit_builder_status(&app, "start", "正在启动打包任务");

    let resource_dir_for_task = resource_dir.clone();
    let working_dir_for_task = working_dir.to_path_buf();
    let context_path_for_task = context_path.clone();
    let cache_root_for_task = cache_root.clone();
    let output = tauri::async_runtime::spawn_blocking(move || {
        run_builder_process(
            &resource_dir_for_task,
            &working_dir_for_task,
            &context_path_for_task,
            &cache_root_for_task,
        )
    })
    .await
    .map_err(|e| e.to_string())??;

    if !output.status.success() {
        emit_builder_status(&app, "error", "打包任务执行失败");
        return Err(command_error(&output));
    }

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    let builder_result = parse_builder_result(&stdout)?;
    emit_builder_status(&app, "success", "打包任务已完成");

    Ok(BuilderExecutionResult {
        artifact_path: builder_result.artifact_path,
        stdout,
        stderr,
    })
}
