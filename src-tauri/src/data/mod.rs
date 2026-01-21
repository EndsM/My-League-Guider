mod champion;
mod item;
mod manager;

use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Runtime, State};

use crate::data::{champion::ChampionData, item::ItemData, manager::DataManager};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Image {
    pub full: String,
    pub sprite: String,
    pub group: String,
    pub x: i32,
    pub y: i32,
    pub w: i32,
    pub h: i32,
}

// In-memory state storage
pub struct LeagueDataState {
    pub champions: Option<ChampionData>,
    pub items: Option<ItemData>,
}

pub struct AppState(pub Mutex<LeagueDataState>);

impl Default for AppState {
    fn default() -> Self {
        Self(Mutex::new(LeagueDataState {
            champions: None,
            items: None,
        }))
    }
}

#[tauri::command]
pub async fn get_data_status<R: Runtime>(app: AppHandle<R>) -> Result<manager::DataStatus, String> {
    let manager = DataManager::new(app);
    manager.check_status().await
}

#[tauri::command]
pub async fn update_data<R: Runtime>(
    app: AppHandle<R>,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let manager = DataManager::new(app.clone());

    // Fetch latest version again to ensure we download the right one
    let latest_version = manager.fetch_latest_version().await?;

    // Download files to disk
    manager.update_data(latest_version.clone()).await?;

    // Load from disk into memory immediately
    let (champs, items) = manager.load_data()?;

    let mut data = state.0.lock().map_err(|_| "Failed to lock state")?;
    data.champions = Some(champs);
    data.items = Some(items);

    Ok(latest_version)
}

#[tauri::command]
pub async fn load_local_data<R: Runtime>(
    app: AppHandle<R>,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let manager = DataManager::new(app);

    if manager.get_local_version().is_some() {
        let (champs, items) = manager.load_data()?;
        let mut data = state.0.lock().map_err(|_| "Failed to lock state")?;
        data.champions = Some(champs);
        data.items = Some(items);
        Ok("Loaded successfully".to_string())
    } else {
        Ok("No local data found".to_string())
    }
}
