use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

use serde::Serialize;
use serde_json::Value;

#[derive(Serialize)]
pub struct OfflineBcmProjectPayload {
    name: String,
    path: String,
}

#[cfg(target_family = "windows")]
fn ensure_writable(path: &Path) -> Result<(), String> {
    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    let mut permissions = metadata.permissions();
    if permissions.readonly() {
        permissions.set_readonly(false);
        fs::set_permissions(path, permissions).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg(not(target_family = "windows"))]
fn ensure_writable(_path: &Path) -> Result<(), String> {
    Ok(())
}

#[cfg(target_family = "unix")]
fn sync_permissions(source: &Path, destination: &Path) -> Result<(), String> {
    let permissions = fs::metadata(source)
        .map_err(|e| e.to_string())?
        .permissions();
    fs::set_permissions(destination, permissions).map_err(|e| e.to_string())
}

#[cfg(not(target_family = "unix"))]
fn sync_permissions(_source: &Path, destination: &Path) -> Result<(), String> {
    ensure_writable(destination)
}

#[cfg(target_family = "windows")]
fn notify_shell_path_changed(path: &Path, is_directory: bool) {
    use std::os::windows::ffi::OsStrExt;
    use windows_sys::Win32::UI::Shell::{
        SHChangeNotify, SHCNF_PATHW, SHCNE_UPDATEDIR, SHCNE_UPDATEITEM,
    };

    let wide_path = path
        .as_os_str()
        .encode_wide()
        .chain(std::iter::once(0))
        .collect::<Vec<u16>>();
    let event_id = if is_directory {
        SHCNE_UPDATEDIR
    } else {
        SHCNE_UPDATEITEM
    } as i32;

    unsafe {
        SHChangeNotify(
            event_id,
            SHCNF_PATHW,
            wide_path.as_ptr() as *const _,
            std::ptr::null(),
        );
    }
}

#[cfg(not(target_family = "windows"))]
fn notify_shell_path_changed(_path: &Path, _is_directory: bool) {}

fn copy_file(source: &Path, destination: &Path) -> Result<(), String> {
    let target = if destination.is_dir() {
        destination.join(
            source
                .file_name()
                .ok_or_else(|| format!("无法获取文件名: {}", source.display()))?,
        )
    } else {
        destination.to_path_buf()
    };

    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    if target.exists() {
        if target.is_dir() {
            return Err(format!("目标路径是目录，无法覆盖文件: {}", target.display()));
        }

        ensure_writable(&target)?;
        fs::remove_file(&target)
            .map_err(|e| format!("删除已存在目标文件失败: {} ({})", target.display(), e))?;
    }

    fs::copy(source, &target).map_err(|e| {
        format!(
            "复制文件失败: {} -> {} ({})",
            source.display(),
            target.display(),
            e
        )
    })?;
    sync_permissions(source, &target)?;
    notify_shell_path_changed(&target, false);
    if let Some(parent) = target.parent() {
        notify_shell_path_changed(parent, true);
    }
    Ok(())
}

fn copy_dir_recursive(source: &Path, destination: &Path) -> Result<(), String> {
    if destination.exists() {
        fs::remove_dir_all(destination).map_err(|e| e.to_string())?;
    }

    fs::create_dir_all(destination).map_err(|e| e.to_string())?;
    sync_permissions(source, destination)?;

    for entry in fs::read_dir(source).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        let target_path = destination.join(entry.file_name());
        let file_type = entry.file_type().map_err(|e| e.to_string())?;

        if file_type.is_dir() {
            copy_dir_recursive(&entry_path, &target_path)?;
        } else if file_type.is_file() {
            copy_file(&entry_path, &target_path)?;
        } else if file_type.is_symlink() {
            let linked_path = fs::read_link(&entry_path).map_err(|e| e.to_string())?;
            recreate_symlink(&linked_path, &target_path)?;
        }
    }

    notify_shell_path_changed(destination, true);
    Ok(())
}

fn recreate_path(source: &Path, destination: &Path) -> Result<(), String> {
    if source.is_dir() {
        copy_dir_recursive(source, destination)
    } else {
        copy_file(source, destination)
    }
}

#[cfg(target_family = "unix")]
fn recreate_symlink(target: &Path, link: &Path) -> Result<(), String> {
    use std::os::unix::fs::symlink;

    if let Ok(metadata) = fs::symlink_metadata(link) {
        if metadata.file_type().is_dir() && !metadata.file_type().is_symlink() {
            fs::remove_dir_all(link).map_err(|e| e.to_string())?;
        } else {
            fs::remove_file(link).map_err(|e| e.to_string())?;
        }
    }

    symlink(target, link).map_err(|e| e.to_string())
}

#[cfg(target_family = "windows")]
fn recreate_symlink(target: &Path, link: &Path) -> Result<(), String> {
    use std::os::windows::fs::{symlink_dir, symlink_file};

    if let Ok(metadata) = fs::symlink_metadata(link) {
        if metadata.file_type().is_dir() && !metadata.file_type().is_symlink() {
            fs::remove_dir_all(link).map_err(|e| e.to_string())?;
        } else {
            fs::remove_file(link).map_err(|e| e.to_string())?;
        }
    }

    let absolute_target = if target.is_absolute() {
        target.to_path_buf()
    } else {
        let parent = link
            .parent()
            .ok_or_else(|| format!("无法获取链接父目录: {}", link.display()))?;
        parent.join(target)
    };

    if absolute_target.is_dir() {
        symlink_dir(target, link).map_err(|e| e.to_string())
    } else {
        symlink_file(target, link).map_err(|e| e.to_string())
    }
}

#[tauri::command]
pub fn open_file(path: String) -> Result<(), String> {
    open::that(path).map_err(|e| e.to_string())
}

#[cfg(target_family = "windows")]
fn reveal_path_in_system(path: &Path) -> Result<(), String> {
    Command::new("explorer")
        .arg(format!("/select,{}", path.display()))
        .spawn()
        .map(|_| ())
        .map_err(|e| format!("打开资源管理器失败: {} ({})", path.display(), e))
}

#[cfg(not(target_family = "windows"))]
fn reveal_path_in_system(path: &Path) -> Result<(), String> {
    let target = if path.is_dir() {
        path.to_path_buf()
    } else {
        path.parent()
            .map(Path::to_path_buf)
            .unwrap_or_else(|| path.to_path_buf())
    };

    open::that(target).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn reveal_path(path: String) -> Result<(), String> {
    let target = PathBuf::from(&path);
    if !target.exists() {
        return Err(format!("路径不存在: {}", target.display()));
    }

    reveal_path_in_system(&target)
}

#[tauri::command]
pub fn read_bcm_project(path: String) -> Result<OfflineBcmProjectPayload, String> {
    let source = PathBuf::from(&path);

    if !source.exists() {
        return Err(format!("文件不存在: {}", source.display()));
    }

    if !source.is_file() {
        return Err(format!("拖入的不是文件: {}", source.display()));
    }

    let is_bcm = source
        .extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| extension.eq_ignore_ascii_case("bcm"))
        .unwrap_or(false);
    if !is_bcm {
        return Err(format!("仅支持导入 .bcm 文件: {}", source.display()));
    }

    let content = fs::read_to_string(&source)
        .map_err(|e| format!("读取 bcm 文件失败: {} ({})", source.display(), e))?;
    let data: Value = serde_json::from_str(&content)
        .map_err(|e| format!("解析 bcm 文件失败: {} ({})", source.display(), e))?;

    let name = data
        .get("project_name")
        .and_then(|value| value.as_str())
        .filter(|value| !value.trim().is_empty())
        .map(|value| value.to_string())
        .or_else(|| {
            source
                .file_stem()
                .and_then(|value| value.to_str())
                .map(|value| value.to_string())
        })
        .unwrap_or_else(|| "未命名作品".to_string());

    Ok(OfflineBcmProjectPayload {
        name,
        path: source.display().to_string(),
    })
}

#[tauri::command]
pub fn copy_dict(from: String, to: String) -> Result<(), String> {
    let source = PathBuf::from(from);
    let destination = PathBuf::from(to);

    if !source.exists() {
        return Err(format!("源路径不存在: {}", source.display()));
    }

    let target = if source.is_dir() {
        if destination.exists() {
            if destination.is_dir() {
                let directory_name = source
                    .file_name()
                    .ok_or_else(|| format!("无法获取目录名: {}", source.display()))?;
                destination.join(directory_name)
            } else {
                return Err(format!("目标不是目录: {}", destination.display()));
            }
        } else {
            destination
        }
    } else {
        destination
    };

    recreate_path(&source, &target)
}
