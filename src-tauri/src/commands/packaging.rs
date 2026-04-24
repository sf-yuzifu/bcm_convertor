use std::env;
#[cfg(target_family = "unix")]
use std::fs;
use std::path::Path;
use std::process::Command;

fn command_error(output: std::process::Output) -> Result<(), String> {
    if output.status.success() {
        return Ok(());
    }

    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    Err(format!(
        "命令执行失败: status={} stdout={} stderr={}",
        output.status, stdout, stderr
    ))
}

#[cfg(target_family = "unix")]
fn remove_existing_path(path: &Path) -> Result<(), String> {
    if let Ok(metadata) = fs::symlink_metadata(path) {
        if metadata.file_type().is_dir() && !metadata.file_type().is_symlink() {
            fs::remove_dir_all(path).map_err(|e| e.to_string())?;
        } else {
            fs::remove_file(path).map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

#[cfg(target_family = "unix")]
fn recreate_symlink(target: &Path, link: &Path) -> Result<(), String> {
    use std::os::unix::fs::symlink;

    remove_existing_path(link)?;
    symlink(target, link).map_err(|e| e.to_string())
}

#[cfg(not(target_family = "unix"))]
fn recreate_symlink(_target: &Path, _link: &Path) -> Result<(), String> {
    Err("当前平台不支持 AppImage 符号链接创建".to_string())
}

#[tauri::command]
pub fn appimage_packager(home: String) -> Result<(), String> {
    let app_dir = Path::new(&home).join("linux").join("AppDir");
    recreate_symlink(Path::new("usr/bin/bcm"), &app_dir.join("AppRun"))?;
    recreate_symlink(
        Path::new("usr/share/applications/bcm.desktop"),
        &app_dir.join("bcm.desktop"),
    )?;
    recreate_symlink(
        Path::new("usr/share/icons/hicolor/256x256/apps/bcm.png"),
        &app_dir.join("bcm.png"),
    )?;

    println!(
        "ARCH=x86_64 {}{}{}{}{}{}",
        home.clone(),
        "/linux/appimagetool-x86_64.AppImage ",
        home.clone(),
        "/linux/AppDir ",
        home.clone(),
        "/bcm.AppImage"
    );
    let output = Command::new(format!(
        "{}/linux/appimagetool-x86_64.AppImage",
        home.clone()
    ))
    .arg(app_dir)
    .arg(Path::new(&home).join("bcm.AppImage"))
    .env("ARCH", "x86_64")
    .output()
    .map_err(|e| e.to_string())?;

    command_error(output)
}

#[tauri::command]
pub fn winrar_packager(home: String) -> Result<(), String> {
    let binding = home.clone() + "\\convert_tmp2";
    let root = Path::new(&binding);
    let output = Command::new("WinRAR.exe")
        .arg("a")
        .arg("-r")
        .arg("bcm.exe")
        .arg(".\\bcm_file\\*")
        .arg("c")
        .arg("-zinfo")
        .arg("-iiconplayer_icon")
        .arg("-ibck")
        .env("PATH", home.clone() + "\\convert_tmp2")
        .current_dir(root)
        .output()
        .map_err(|e| e.to_string())?;

    let _ = env::current_dir();
    command_error(output)
}
