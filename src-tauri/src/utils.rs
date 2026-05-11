use tauri::menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem, SubmenuBuilder};
use tauri::{Emitter, Manager, Runtime};

pub fn set_window_shadow<R: Runtime>(app: &tauri::App<R>) {
    if cfg!(not(target_os = "linux")) {
        let window = app.get_webview_window("bcm_convertor").unwrap();
        let _ = window.set_shadow(true);
    }
}

pub fn apply_platform_window_effects<R: Runtime>(app: &tauri::App<R>) {
    if let Some(window) = app.get_webview_window("bcm_convertor") {
        #[cfg(target_os = "windows")]
        {
            use tauri::LogicalSize;
            let _ = window.set_decorations(false);
            let _ = window.set_size(LogicalSize::new(640.0, 440.0));
        }
    }
}

#[cfg(target_os = "macos")]
pub fn setup_macos_menu<R: Runtime>(app: &tauri::App<R>) {
    let about_item = MenuItemBuilder::new("关于 编程猫格式工厂")
        .id("show_about")
        .build(app)
        .expect("failed to create about menu item");

    let quit_item = MenuItemBuilder::new("退出 编程猫格式工厂")
        .id("quit")
        .accelerator("CmdOrCtrl+Q")
        .build(app)
        .expect("failed to create quit menu item");

    let app_submenu = SubmenuBuilder::new(app, "编程猫格式工厂")
        .item(&about_item)
        .separator()
        .item(&quit_item)
        .build()
        .expect("failed to build app submenu");

    let select_bcm_item = MenuItemBuilder::new("选择 BCM 文件")
        .id("select_bcm")
        .accelerator("CmdOrCtrl+O")
        .build(app)
        .expect("failed to create select bcm menu item");

    let file_submenu = SubmenuBuilder::new(app, "文件")
        .item(&select_bcm_item)
        .build()
        .expect("failed to build file submenu");

    let edit_submenu = SubmenuBuilder::new(app, "编辑")
        .item(&PredefinedMenuItem::undo(app, Some("撤销")).expect("failed to create undo"))
        .item(&PredefinedMenuItem::redo(app, Some("重做")).expect("failed to create redo"))
        .separator()
        .item(&PredefinedMenuItem::cut(app, Some("剪切")).expect("failed to create cut"))
        .item(&PredefinedMenuItem::copy(app, Some("复制")).expect("failed to create copy"))
        .item(&PredefinedMenuItem::paste(app, Some("粘贴")).expect("failed to create paste"))
        .separator()
        .item(&PredefinedMenuItem::select_all(app, Some("全选")).expect("failed to create select_all"))
        .build()
        .expect("failed to build edit submenu");

    let menu = MenuBuilder::new(app)
        .item(&app_submenu)
        .item(&file_submenu)
        .item(&edit_submenu)
        .build()
        .expect("failed to build menu");

    app.set_menu(menu).expect("failed to set menu");

    let app_handle = app.handle().clone();
    app.on_menu_event(move |_app, event| {
        match event.id().0.as_str() {
            "show_about" => {
                let _ = app_handle.emit("show-about", ());
            }
            "select_bcm" => {
                let _ = app_handle.emit("select-bcm", ());
            }
            "quit" => {
                app_handle.exit(0);
            }
            _ => {}
        }
    });
}
