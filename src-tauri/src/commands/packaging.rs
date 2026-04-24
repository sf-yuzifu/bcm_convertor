use std::env;
use std::path::Path;
use std::process::Command;

#[tauri::command]
pub fn appimage_packager(home: String) {
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
    println!(
        "ARCH=x86_64 {}{}{}{}{}{}",
        home.clone(),
        "/linux/appimagetool-x86_64.AppImage ",
        home.clone(),
        "/linux/AppDir ",
        home.clone(),
        "/bcm.AppImage"
    );
    Command::new(format!("{}/linux/appimagetool-x86_64.AppImage", home.clone()))
        .arg(format!("{}/linux/AppDir", home.clone()))
        .arg(format!("{}/bcm.AppImage", home.clone()))
        .env("ARCH", "x86_64")
        .output()
        .expect("命令执行异常错误提示");
}

#[tauri::command]
pub fn winrar_packager(home: String) {
    let binding = home.clone() + "\\convert_tmp2";
    let root = Path::new(&binding);
    assert!(env::set_current_dir(root).is_ok());
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
    assert!(env::set_current_dir(root).is_ok());
}
