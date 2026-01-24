mod context;

use keyring::Entry;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::{AppHandle, Manager, Runtime};

const SERVICE_NAME: &str = "my-league-guider";
const PROFILES_FILENAME: &str = "ai_profiles.json";

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

fn get_profiles_path<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf, String> {
    let path = app.path().app_config_dir().map_err(|e| e.to_string())?;
    if !path.exists() {
        fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }
    Ok(path.join(PROFILES_FILENAME))
}

#[tauri::command]
pub async fn save_ai_profile<R: Runtime>(
    app: AppHandle<R>,
    profile: AiProfile,
    api_key: String,
) -> Result<(), String> {
    let mut profiles = get_ai_profiles(app.clone()).await.unwrap_or_default();
    let is_new_profile = !profiles.iter().any(|p| p.id == profile.id);

    // Trim whitespace to prevent copy-paste errors
    let clean_key = api_key.trim();

    // 1. Handle Keyring Operations
    if !clean_key.is_empty() {
        // Attempt to save
        let entry = Entry::new(SERVICE_NAME, &profile.id)
            .map_err(|e| format!("Keyring init failed: {}", e))?;

        entry
            .set_password(clean_key)
            .map_err(|e| format!("Failed to write to secure storage: {}", e))?;

        // Verify the save worked by reading it back immediately
        match entry.get_password() {
            Ok(stored) if stored == clean_key => {
                // Verification successful
                println!("Key saved and verified for profile {}", profile.id);
            }
            Ok(_) => return Err("Secure storage data mismatch (saved vs read).".to_string()),
            Err(e) => {
                return Err(format!(
                    "Secure storage verification failed. The OS did not persist the key: {}",
                    e
                ))
            }
        }
    } else if is_new_profile {
        println!(
            "Warning: Saving new profile {} without an API key.",
            profile.name
        );
    }

    // 2. Update or Add new profile metadata
    if let Some(idx) = profiles.iter().position(|p| p.id == profile.id) {
        profiles[idx] = profile;
    } else {
        profiles.push(profile);
    }

    // 3. Save metadata to JSON file
    let path = get_profiles_path(&app)?;
    let json = serde_json::to_string_pretty(&profiles).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn get_ai_profiles<R: Runtime>(app: AppHandle<R>) -> Result<Vec<AiProfile>, String> {
    let path = get_profiles_path(&app)?;
    if !path.exists() {
        return Ok(Vec::new());
    }

    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let profiles: Vec<AiProfile> = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    Ok(profiles)
}

#[tauri::command]
pub async fn delete_ai_profile<R: Runtime>(app: AppHandle<R>, id: String) -> Result<(), String> {
    // 1. Remove from Keyring
    let entry = Entry::new(SERVICE_NAME, &id).map_err(|e| e.to_string())?;
    let _ = entry.delete_credential(); // Ignore error if key doesn't exist

    // 2. Remove from JSON file
    let mut profiles = get_ai_profiles(app.clone()).await?;
    profiles.retain(|p| p.id != id);

    let path = get_profiles_path(&app)?;
    let json = serde_json::to_string_pretty(&profiles).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn send_chat_request(
    profile: AiProfile,
    messages: Vec<ChatMessage>,
    temperature: Option<f32>,
) -> Result<ChatCompletionResponse, String> {
    let client = Client::new();

    println!(
        "Fetching key for Profile ID: '{}' (Service: '{}')",
        profile.id, SERVICE_NAME
    );

    let entry =
        Entry::new(SERVICE_NAME, &profile.id).map_err(|e| format!("Keyring init error: {}", e))?;

    let api_key = match entry.get_password() {
        Ok(key) => key,
        Err(keyring::Error::NoEntry) => {
            return Err(
                "API Key not found in storage. Please Edit the profile and re-enter the key."
                    .to_string(),
            );
        }
        Err(keyring::Error::Ambiguous(_)) => {
            return Err("Multiple keys found for this ID. Storage is ambiguous.".to_string());
        }
        Err(e) => {
            println!("CRITICAL KEYRING ERROR: {:?}", e);
            return Err(format!("OS Secure Storage Error: {}", e));
        }
    };

    let request_body = ChatCompletionRequest {
        model: profile.model,
        messages,
        temperature,
        max_tokens: None,
    };

    let response = client
        .post(&profile.endpoint)
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
