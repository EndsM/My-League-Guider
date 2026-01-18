use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Serialize, Debug)]
pub struct ChatCompletionRequest {
    pub model: String,
    pub messages: Vec<ChatMessage>,
    pub temperature: f32,
}

#[derive(Deserialize, Debug)]
pub struct ChatCompletionChoice {
    pub index: i32,
    pub message: ChatMessage,
    pub finish_reason: Option<String>,
}

#[derive(Deserialize, Debug)]
pub struct ChatCompletionResponse {
    pub id: String,
    pub object: String,
    pub created: i64,
    pub choices: Vec<ChatCompletionChoice>,
}

pub async fn send_chat_request() {
    let client = Client::new();
}
