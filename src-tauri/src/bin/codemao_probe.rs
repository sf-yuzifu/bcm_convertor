use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ORIGIN, REFERER, USER_AGENT};

#[tokio::main]
async fn main() {
    let url = "https://api-creation.codemao.cn/kitten/r2/work/player/load/6654365";

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

    let client = reqwest::Client::builder()
        .default_headers(headers)
        .build()
        .unwrap();

    let res = client.get(url).send().await.unwrap();
    let status = res.status();
    let body = res.text().await.unwrap();
    println!("status={}", status);
    println!("body_prefix={}", body.chars().take(200).collect::<String>());
}

