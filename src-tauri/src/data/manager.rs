use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{fs, path::PathBuf, str};
use tauri::{AppHandle, Manager, Runtime};

use crate::data::{champion::ChampionData, item::ItemData};

const VERSIONS_URL: &str = "https://ddragon.leagueoflegends.com/api/versions.json";
const BASE_CDN_URL: &str = "https://ddragon.leagueoflegends.com/cdn";
const LANG_CODE: &str = "en_US";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DataStatus {
    pub current_version: Option<String>,
    pub latest_version: String,
    pub is_up_to_date: bool,
}

pub struct DataManager<R: Runtime> {
    app: AppHandle<R>,
    client: Client,
}

impl<R: Runtime> DataManager<R> {
    pub fn new(app: AppHandle<R>) -> Self {
        Self {
            app,
            client: Client::new(),
        }
    }

    fn get_data_dir(&self) -> PathBuf {
        let path = self.app.path().app_data_dir().unwrap();
        path.join("league-data")
    }

    fn get_version_dir(&self, version: &str) -> PathBuf {
        self.get_data_dir().join("versions").join(version)
    }

    pub async fn fetch_latest_version(&self) -> Result<String, String> {
        let versions: Vec<String> = self
            .client
            .get(VERSIONS_URL)
            .send()
            .await
            .map_err(|e| e.to_string())?
            .json()
            .await
            .map_err(|e| e.to_string())?;

        versions
            .first()
            .cloned()
            .ok_or_else(|| "No versions found".to_string())
    }

    pub fn get_local_version(&self) -> Option<String> {
        let metadata_path = self.get_data_dir().join("metadata.json");
        if metadata_path.exists() {
            let content = fs::read_to_string(metadata_path).ok()?;
            let metadata: Value = serde_json::from_str(&content).ok()?;
            metadata["version"].as_str().map(|s| s.to_string())
        } else {
            None
        }
    }

    pub async fn check_status(&self) -> Result<DataStatus, String> {
        let latest = self.fetch_latest_version().await?;
        let current = self.get_local_version();
        Ok(DataStatus {
            is_up_to_date: current.as_deref() == Some(&latest),
            current_version: current,
            latest_version: latest,
        })
    }

    // Downloads champion.json and item.json for the specific version
    pub async fn update_data(&self, version: String) -> Result<(), String> {
        let version_dir = self.get_version_dir(&version);
        if !version_dir.exists() {
            fs::create_dir_all(&version_dir).map_err(|e| e.to_string())?;
        }

        let champ_url = format!(
            "{}/{}/data/{}/champion.json",
            BASE_CDN_URL, version, LANG_CODE
        );
        let champ_data = self
            .client
            .get(&champ_url)
            .send()
            .await
            .map_err(|e| format!("Failed to fetch champions: {}", e))?
            .text()
            .await
            .map_err(|e| e.to_string())?;

        fs::write(version_dir.join("champion.json"), &champ_data).map_err(|e| e.to_string())?;

        let item_url = format!("{}/{}/data/{}/item.json", BASE_CDN_URL, version, LANG_CODE);
        let item_data = self
            .client
            .get(&item_url)
            .send()
            .await
            .map_err(|e| format!("Failed to fetch items: {}", e))?
            .text()
            .await
            .map_err(|e| e.to_string())?;

        fs::write(version_dir.join("item.json"), &item_data).map_err(|e| e.to_string())?;

        let metadata = serde_json::json!({ "version": version });
        fs::write(
            self.get_data_dir().join("metadata.json"),
            serde_json::to_string_pretty(&metadata).unwrap(),
        )
        .map_err(|e| e.to_string())?;

        Ok(())
    }

    pub fn load_data(&self) -> Result<(ChampionData, ItemData), String> {
        let version = self
            .get_local_version()
            .ok_or("No local data found. Please update.")?;
        let dir = self.get_version_dir(&version);

        let champ_content =
            fs::read_to_string(dir.join("champion.json")).map_err(|e| e.to_string())?;
        let champ_data: ChampionData =
            serde_json::from_str(&champ_content).map_err(|e| format!("Champ Parse: {}", e))?;

        let item_content = fs::read_to_string(dir.join("item.json")).map_err(|e| e.to_string())?;
        let item_data: ItemData =
            serde_json::from_str(&item_content).map_err(|e| format!("Item Parse: {}", e))?;

        Ok((champ_data, item_data))
    }
}
