use tauri::{Manager, Runtime};
use window_shadows::set_shadow;

pub fn set_window_shadow<R: Runtime>(app: &tauri::App<R>) {
    if cfg!(not(target_os = "linux")) {
        let window = app.get_window("bcm_convertor").unwrap();
        set_shadow(&window, true).expect("Unsupported platform!");
    }   
}
