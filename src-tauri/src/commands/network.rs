use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ORIGIN, REFERER, USER_AGENT};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize)]
pub struct OnlineInfo {
    name: String,
    id: u64,
    preview: Option<String>,
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

fn kitten_n_client() -> reqwest::Client {
    let mut headers = HeaderMap::new();
    headers.insert(ACCEPT, HeaderValue::from_static("application/json, text/plain, */*"));
    headers.insert(
        USER_AGENT,
        HeaderValue::from_static(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        ),
    );
    headers.insert(REFERER, HeaderValue::from_static("https://kn.codemao.cn/"));
    headers.insert(ORIGIN, HeaderValue::from_static("https://kn.codemao.cn"));

    reqwest::Client::builder()
        .default_headers(headers)
        .build()
        .unwrap()
}

fn generate_kitten_n_auth_header() -> String {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let client_id = "3e64dd36";
    let secret = "pBlYqXbJDu";

    let sign_str = format!("{}{}{}", secret, timestamp, client_id);
    let mut hasher = Sha256::new();
    hasher.update(sign_str.as_bytes());
    let sign = format!("{:x}", hasher.finalize()).to_uppercase();

    let auth = serde_json::json!({
        "sign": sign,
        "timestamp": timestamp,
        "client_id": client_id
    });

    auth.to_string()
}

fn parse_json_with_unbounded_depth(text: &str) -> Result<serde_json::Value, String> {
    let mut deserializer = serde_json::Deserializer::from_str(text);
    deserializer.disable_recursion_limit();
    serde_json::Value::deserialize(&mut deserializer).map_err(|e| e.to_string())
}

fn generate_aes_key(salt: &[u8]) -> [u8; 32] {
    let mut hasher = Sha256::new();
    hasher.update(salt);
    hasher.finalize().into()
}

fn decrypt_bcmkn_data(encrypted_content: &str) -> Result<serde_json::Value, String> {
    const SALT: &[u8] = &[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    const AES_IV_LENGTH: usize = 12;
    const MIN_DATA_LENGTH: usize = 13;

    if encrypted_content.len() < MIN_DATA_LENGTH {
        return Err("数据太短".to_string());
    }

    let reversed_data: String = encrypted_content.chars().rev().collect();

    let decoded_data = BASE64
        .decode(reversed_data)
        .map_err(|e| format!("Base64解码错误: {}", e))?;

    if decoded_data.len() < MIN_DATA_LENGTH {
        return Err("解码后数据太短".to_string());
    }

    let iv = &decoded_data[..AES_IV_LENGTH];
    let ciphertext = &decoded_data[AES_IV_LENGTH..];

    let key = generate_aes_key(SALT);
    let cipher = Aes256Gcm::new_from_slice(&key)
        .map_err(|e| format!("密钥初始化错误: {:?}", e))?;

    let nonce = Nonce::from_slice(iv);
    let decrypted_bytes = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| format!("AES解密错误: {:?}", e))?;

    let text_content = String::from_utf8_lossy(&decrypted_bytes);

    let valid_end = find_valid_json_end(&text_content);
    let valid_json = &text_content[..valid_end];

    match parse_json_with_unbounded_depth(valid_json) {
        Ok(json) => Ok(json),
        Err(_) => {
            let repaired = repair_json(valid_json);
            parse_json_with_unbounded_depth(&repaired)
        }
    }
}

fn find_valid_json_end(text: &str) -> usize {
    let mut stack: Vec<char> = Vec::new();
    let mut in_string = false;
    let mut escape = false;
    let mut last_valid_end = 0;

    for (i, char) in text.char_indices() {
        if escape {
            escape = false;
            continue;
        }
        if char == '\\' {
            escape = true;
            continue;
        }
        if char == '"' {
            in_string = !in_string;
            continue;
        }
        if in_string {
            continue;
        }
        if char == '{' || char == '[' {
            stack.push(char);
        } else if char == '}' || char == ']' {
            if stack.is_empty() {
                return i;
            }
            let opening = stack.pop().unwrap();
            if (opening == '{' && char != '}') || (opening == '[' && char != ']') {
                return i;
            }
            if stack.is_empty() {
                last_valid_end = i + char.len_utf8();
            }
        }
    }

    if !stack.is_empty() {
        for i in (0..text.len()).rev() {
            if let Some(char) = text.chars().nth(i) {
                if char == '}' || char == ']' {
                    let substring = &text[..i + char.len_utf8()];
                    if parse_json_with_unbounded_depth(substring).is_ok() {
                        return i + char.len_utf8();
                    }
                }
            }
        }
    }

    if last_valid_end > 0 {
        return last_valid_end;
    }

    text.len()
}

fn repair_json(text: &str) -> String {
    let mut result = text.trim_end().to_string();
    
    while !result.is_empty() && result.ends_with(|c: char| c == ',' || c.is_whitespace()) {
        result.pop();
    }
    
    if !result.ends_with('}') && !result.ends_with(']') {
        let last_brace = result.rfind('}');
        let last_bracket = result.rfind(']');
        let last_valid = match (last_brace, last_bracket) {
            (Some(b), Some(k)) => b.max(k),
            (Some(b), None) => b,
            (None, Some(k)) => k,
            (None, None) => result.len(),
        };
        if last_valid > 0 {
            result.truncate(last_valid + 1);
        }
    }
    
    result
}

fn try_parse_data(data_text: &str) -> Result<serde_json::Value, String> {
    if let Ok(json) = parse_json_with_unbounded_depth(data_text) {
        return Ok(json);
    }

    decrypt_bcmkn_data(data_text)
}

#[tauri::command]
pub async fn fetch_online_info(workid: u64) -> Result<OnlineInfo, String> {
    let client = codemao_client();
    let meta_url = format!(
        "https://api-creation.codemao.cn/kitten/r2/work/player/load/{}",
        workid
    );
    let works_url = format!("https://api.codemao.cn/creation-tools/v1/works/{}", workid);

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

    let (works_preview, author_nickname) = match client.get(works_url).send().await {
        Ok(response) if response.status().is_success() => {
            let works_json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;
            let preview = ["preview", "screenshot_cover_url", "cover_url", "cover", "thumbnail"]
                .iter()
                .find_map(|key| works_json.get(key).and_then(|v| v.as_str()))
                .map(str::to_string);
            let author = works_json
                .get("user_info")
                .and_then(|u| u.get("nickname"))
                .and_then(|v| v.as_str())
                .map(str::to_string);
            (preview, author)
        }
        Ok(_) | Err(_) => (None, None),
    };

    let preview = works_preview.or_else(|| {
        [
            "preview",
            "preview_url",
            "cover_url",
            "cover",
            "thumbnail",
            "work_pic",
        ]
        .iter()
        .find_map(|key| meta_json.get(key).and_then(|v| v.as_str()))
        .map(str::to_string)
    });

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
    let data_text = data_res.text().await.map_err(|e| e.to_string())?;
    let mut data_json = parse_json_with_unbounded_depth(&data_text)?;
    if !data_status.is_success() {
        return Err(format!("data status={} body={}", data_status, data_text));
    }

    if let Some(author) = author_nickname {
        if let Some(obj) = data_json.as_object_mut() {
            obj.insert("author_nickname".to_string(), serde_json::Value::String(author));
        }
    }

    Ok(OnlineInfo {
        name,
        id: workid,
        preview,
        data: data_json,
    })
}

#[tauri::command]
pub async fn fetch_kitten_n_info(workid: u64) -> Result<OnlineInfo, String> {
    let client = kitten_n_client();
    let auth_header = generate_kitten_n_auth_header();

    let meta_url = format!(
        "https://api-creation.codemao.cn/neko/community/player/published-work-detail/{}",
        workid
    );
    let works_url = format!("https://api.codemao.cn/creation-tools/v1/works/{}", workid);

    let meta_res = client
        .get(&meta_url)
        .header("x-creation-tools-device-auth", &auth_header)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let meta_status = meta_res.status();
    let meta_json: serde_json::Value = meta_res.json().await.map_err(|e| e.to_string())?;
    if !meta_status.is_success() {
        return Err(format!("meta status={} body={}", meta_status, meta_json));
    }

    let error_code = meta_json.get("error_code").and_then(|v| v.as_str());
    if let Some(code) = error_code {
        return Err(format!(
            "api error: code={} message={}",
            code,
            meta_json
                .get("error_message")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown")
        ));
    }

    let name = meta_json
        .get("workName")
        .and_then(|v| v.as_str())
        .or_else(|| meta_json.get("name").and_then(|v| v.as_str()))
        .ok_or_else(|| "missing name".to_string())?
        .to_string();

    let (works_preview, author_nickname) = match client.get(&works_url).send().await {
        Ok(response) if response.status().is_success() => {
            let works_json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;
            let preview = ["preview", "screenshot_cover_url", "cover_url", "cover", "thumbnail"]
                .iter()
                .find_map(|key| works_json.get(key).and_then(|v| v.as_str()))
                .map(str::to_string);
            let author = works_json
                .get("user_info")
                .and_then(|u| u.get("nickname"))
                .and_then(|v| v.as_str())
                .map(str::to_string);
            (preview, author)
        }
        Ok(_) | Err(_) => (None, None),
    };

    let preview = works_preview.or_else(|| {
        [
            "preview",
            "preview_url",
            "cover_url",
            "cover",
            "thumbnail",
            "work_pic",
        ]
        .iter()
        .find_map(|key| meta_json.get(key).and_then(|v| v.as_str()))
        .map(str::to_string)
    });

    let bcm_url = meta_json
        .get("bcm_url")
        .and_then(|v| v.as_str())
        .filter(|s| !s.is_empty());

    let source_url = meta_json
        .get("source_urls")
        .and_then(|v| v.as_array())
        .and_then(|arr| arr.first())
        .and_then(|v| v.as_str());

    let data_url = bcm_url.or(source_url)
        .ok_or_else(|| "missing bcm_url and source_urls".to_string())?
        .to_string();

    let data_res = client
        .get(&data_url)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let data_status = data_res.status();
    let data_text = data_res.text().await.map_err(|e| e.to_string())?;

    if !data_status.is_success() {
        return Err(format!("data status={} body={}", data_status, data_text));
    }

    let mut data_json = if bcm_url.is_some() {
        parse_json_with_unbounded_depth(&data_text)?
    } else {
        try_parse_data(&data_text)?
    };

    // 将作者信息添加到data中
    if let Some(author) = author_nickname {
        if let Some(obj) = data_json.as_object_mut() {
            obj.insert("author_nickname".to_string(), serde_json::Value::String(author));
        }
    }

    Ok(OnlineInfo {
        name,
        id: workid,
        preview,
        data: data_json,
    })
}
