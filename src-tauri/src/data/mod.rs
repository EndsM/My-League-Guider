mod champion;
mod item;
mod manager;

use std::sync::Mutex;

use serde::{Deserialize, Serialize};

use crate::data::{champion::ChampionData, item::ItemData};

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
