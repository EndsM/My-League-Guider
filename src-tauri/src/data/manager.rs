use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::{path::PathBuf, str};
use tauri::{AppHandle, Manager, Runtime};

const VERSIONS_URL: &str = "https://ddragon.leagueoflegends.com/api/versions.json";
const BASE_CDN_URL: &str = "https://ddragon.leagueoflegends.com/cdn";

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
}
