use std::process::Command;

#[tauri::command]
pub fn open_file(path: String) {
    let mut code: &str = "open";
    if cfg!(target_os = "windows") {
        code = "explorer"
    } else if cfg!(target_os = "linux") {
        code = "xdg-open"
    }

    Command::new(code)
        .arg(path)
        .spawn()
        .unwrap();
}

#[tauri::command]
pub fn copy_dict(from: String, to: String) {
    if cfg!(not(target_os = "windows")) {
        Command::new("cp")
            .arg("-RP")
            .arg(from)
            .arg(to)
            .output()
            .expect("命令执行异常错误提示");
    } else {
        Command::new("xcopy")
            .arg(from)
            .arg(to)
            .arg("/s")
            .arg("/e")
            .arg("/y")
            .output()
            .expect("命令执行异常错误提示");
    }
}
