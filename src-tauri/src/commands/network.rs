use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ORIGIN, REFERER, USER_AGENT};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct OnlineInfo {
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
pub async fn fetch_online_info(workid: u64) -> Result<OnlineInfo, String> {
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
        .and_then(|arr| arr.first())
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
