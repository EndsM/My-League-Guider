use reqwest::Client;
use serde::{Deserialize, Serialize};

const SERVICE_NAME: &str = "my-league-guider";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AiProfile {
    // UUID
    pub id: String,
    pub name: String,
    pub endpoint: String,
    pub model: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Serialize, Debug)]
pub struct ChatCompletionRequest {
    pub model: String,
    pub messages: Vec<ChatMessage>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_tokens: Option<u32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChatCompletionChoice {
    pub index: i32,
    pub message: ChatMessage,
    pub finish_reason: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChatCompletionResponse {
    pub id: String,
    pub object: String,
    pub created: i64,
    pub choices: Vec<ChatCompletionChoice>,
}

#[tauri::command]
pub async fn send_chat_request(
    endpoint: String,
    api_key: String,
    model: String,
    messages: Vec<ChatMessage>,
    temperature: Option<f32>,
) -> Result<ChatCompletionResponse, String> {
    let client = Client::new();

    let request_body = ChatCompletionRequest {
        model,
        messages,
        temperature,
        max_tokens: None,
    };

    let response = client
        .post(&endpoint)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("API Error: {}", error_text));
    }

    let completion_response = response
        .json::<ChatCompletionResponse>()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;
    Ok(completion_response)
}
