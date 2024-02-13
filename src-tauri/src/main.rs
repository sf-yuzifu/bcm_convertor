// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use crate::utils::set_window_shadow;
use std::process::Command;
use std::env;
use std::path::Path;

mod utils;

#[tauri::command]
fn open_file(path: String) {
    let mut code: &str = "open";
    if cfg!(target_os = "windows") {
        code = "explorer"
    } else if cfg!(target_os = "linux") {
        code = "xdg-open"
    }
    Command::new(code)
        .arg(path) // <- Specify the directory you'd like to open.
        .spawn()
        .unwrap();
}
#[tauri::command]
fn copy_dict(from: String, to: String) {
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

#[tauri::command]
fn appimage_packager(home: String) {
    Command::new("ln")
        .arg("-s")
        .arg("-f")
        .arg("usr/bin/bcm")
        .arg(home.clone() + "/linux/AppDir/AppRun")
        .output()
        .expect("命令执行异常错误提示");
    Command::new("ln")
        .arg("-s")
        .arg("-f")
        .arg("usr/share/applications/bcm.desktop")
        .arg(home.clone() + "/linux/AppDir/bcm.desktop")
        .output()
        .expect("命令执行异常错误提示");
    Command::new("ln")
        .arg("-s")
        .arg("-f")
        .arg("usr/share/icons/hicolor/256x256/apps/bcm.png")
        .arg(home.clone() + "/linux/AppDir/bcm.png")
        .output()
        .expect("命令执行异常错误提示");
    println!("ARCH=x86_64 {}{}{}{}{}{}",home.clone() , "/linux/appimagetool-x86_64.AppImage ",home.clone() , "/linux/AppDir ",home.clone() ,"/bcm.AppImage");
    Command::new(format!("{}/linux/appimagetool-x86_64.AppImage",home.clone()))
        .arg(format!("{}/linux/AppDir",home.clone()))
        .arg(format!("{}/bcm.AppImage",home.clone()))
        .env("ARCH","x86_64")
        .output()
        .expect("命令执行异常错误提示");
}

#[tauri::command]
fn winrar_packager(home: String) {
    let binding = home.clone() + "\\convert_tmp2";
    let root = Path::new(&binding);
    assert!(env::set_current_dir(&root).is_ok());
    Command::new("WinRAR.exe")
        .arg("a")
        .arg("-r")
        .arg("bcm.exe")
        .arg(".\\bcm_file\\*")
        .arg("c")
        .arg("-zinfo")
        .arg("-iiconplayer_icon")
        .arg("-ibck")
        .env("PATH", home.clone() + "\\convert_tmp2")
        .output()
        .expect("命令执行异常错误提示");
    let root = Path::new("\\");
    assert!(env::set_current_dir(&root).is_ok());
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            set_window_shadow(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_file,
            copy_dict,
            appimage_packager,
            winrar_packager
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
