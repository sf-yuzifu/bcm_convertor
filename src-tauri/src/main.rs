// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use crate::utils::set_window_shadow;
use std::process::Command;
use std::env;
use std::path::Path;
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ORIGIN, REFERER, USER_AGENT};
use serde::{Deserialize, Serialize};

mod utils;

#[derive(Debug, Serialize, Deserialize)]
struct OnlineInfo {
    name: String,
    id: u64,
    data: serde_json::Value,
}

fn codemao_client() -> reqwest::Client {
    let mut headers = HeaderMap::new();
    headers.insert(ACCEPT, HeaderValue::from_static("application/json, text/plain, */*"));
    headers.insert(
        USER_AGENT,
        HeaderValue::from_static(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        ),
    );
    headers.insert(REFERER, HeaderValue::from_static("https://player.codemao.cn/"));
    headers.insert(ORIGIN, HeaderValue::from_static("https://player.codemao.cn"));

    reqwest::Client::builder()
        .default_headers(headers)
        .build()
        .unwrap()
}

#[tauri::command]
async fn fetch_online_info(workid: u64) -> Result<OnlineInfo, String> {
    let client = codemao_client();
    let meta_url = format!(
        "https://api-creation.codemao.cn/kitten/r2/work/player/load/{}",
        workid
    );

    let meta_res = client
        .get(meta_url)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let meta_status = meta_res.status();
    let meta_json: serde_json::Value = meta_res.json().await.map_err(|e| e.to_string())?;
    if !meta_status.is_success() {
        return Err(format!("meta status={} body={}", meta_status, meta_json));
    }

    let name = meta_json
        .get("name")
        .and_then(|v| v.as_str())
        .ok_or_else(|| "missing name".to_string())?
        .to_string();

    let source_url = meta_json
        .get("source_urls")
        .and_then(|v| v.as_array())
        .and_then(|arr| arr.get(0))
        .and_then(|v| v.as_str())
        .ok_or_else(|| "missing source_urls[0]".to_string())?
        .to_string();

    let data_res = client
        .get(source_url)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let data_status = data_res.status();
    let data_json: serde_json::Value = data_res.json().await.map_err(|e| e.to_string())?;
    if !data_status.is_success() {
        return Err(format!("data status={} body={}", data_status, data_json));
    }

    Ok(OnlineInfo {
        name,
        id: workid,
        data: data_json,
    })
}

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
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            set_window_shadow(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_file,
            copy_dict,
            appimage_packager,
            winrar_packager,
            fetch_online_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
