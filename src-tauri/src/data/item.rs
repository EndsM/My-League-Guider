use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::data::Image;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItemData {
    #[serde(rename = "type")]
    pub data_type: String,
    pub version: String,
    pub basic: Item,
    pub data: HashMap<String, Item>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Item {
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub colloq: String,
    #[serde(default)]
    pub plaintext: String,

    // Crafting Hierarchy
    #[serde(default)]
    pub into: Vec<String>,
    #[serde(default)]
    pub from: Vec<String>,

    // Data
    pub image: Option<Image>,
    #[serde(default)]
    pub gold: ItemGold,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ItemGold {
    #[serde(default)]
    pub base: u32,
    #[serde(default)]
    pub total: u32,
    #[serde(default)]
    pub sell: u32,
    #[serde(default)]
    pub purchasable: bool,
}
