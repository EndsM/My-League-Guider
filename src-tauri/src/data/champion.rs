use crate::data::Image;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Represent the data package we will get from API
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChampionData {
    #[serde(rename = "type")]
    pub data_type: String,
    pub format: String,
    pub version: String,
    pub data: HashMap<String, Champion>,
}

// Let's use datadragon as the way to get data
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Champion {
    pub id: String,
    pub key: String,
    pub name: String,
    pub title: String,

    pub version: String,

    pub blurb: String,
    pub info: ChampionInfo,
    pub image: Image,
    pub tags: Vec<String>,
    pub partype: String,
    pub stats: ChampionStats,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChampionInfo {
    pub attack: u8,
    pub defense: u8,
    pub magic: u8,
    pub difficulty: u8,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChampionImage {
    pub full: String,
    pub sprite: String,
    pub group: String,
    pub x: i32,
    pub y: i32,
    pub w: i32,
    pub h: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChampionStats {
    pub hp: f64,
    #[serde(rename = "hpperlevel")]
    pub hp_per_level: f64,

    pub mp: f64,

    #[serde(rename = "mpperlevel")]
    pub mp_per_level: f64,

    #[serde(rename = "movespeed")]
    pub move_speed: f64,

    pub armor: f64,

    #[serde(rename = "armorperlevel")]
    pub armor_per_level: f64,

    #[serde(rename = "spellblock")]
    pub spell_block: f64,

    #[serde(rename = "spellblockperlevel")]
    pub spell_block_per_level: f64,

    #[serde(rename = "attackrange")]
    pub attack_range: f64,

    #[serde(rename = "hpregen")]
    pub hp_regen: f64,

    #[serde(rename = "hpregenperlevel")]
    pub hp_regen_per_level: f64,

    #[serde(rename = "mpregen")]
    pub mp_regen: f64,

    #[serde(rename = "mpregenperlevel")]
    pub mp_regen_per_level: f64,

    pub crit: f64,

    #[serde(rename = "critperlevel")]
    pub crit_per_level: f64,

    #[serde(rename = "attackdamage")]
    pub attack_damage: f64,

    #[serde(rename = "attackdamageperlevel")]
    pub attack_damage_per_level: f64,

    #[serde(rename = "attackspeedperlevel")]
    pub attack_speed_per_level: f64,

    #[serde(rename = "attackspeed")]
    pub attack_speed: f64,
}
