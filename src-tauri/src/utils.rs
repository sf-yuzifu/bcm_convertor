use tauri::{Manager, Runtime};

pub fn set_window_shadow<R: Runtime>(app: &tauri::App<R>) {
    if cfg!(not(target_os = "linux")) {
        let window = app.get_webview_window("bcm_convertor").unwrap();
        let _ = window.set_shadow(true);
    }
}

#[cfg(target_os = "windows")]
pub fn apply_windows_window_effects<R: Runtime>(app: &tauri::App<R>) {
    if let Some(window) = app.get_webview_window("bcm_convertor") {
        let _ = window.set_decorations(false);
    }
}
