// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod utils;

fn main() {
    #[cfg(target_os = "windows")]
    commands::packaging::try_handle_elevated_builder_cli();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            utils::set_window_shadow(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::files::open_file,
            commands::files::read_bcm_project,
            commands::files::copy_dict,
            commands::packaging::run_electron_builder,
            commands::network::fetch_online_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
