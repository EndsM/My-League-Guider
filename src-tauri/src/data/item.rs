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

    // Metadata
    #[serde(default)]
    pub groups: Vec<ItemGroup>,
    #[serde(default)]
    pub tree: Vec<ItemTree>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItemGroup {
    pub id: String,
    #[serde(rename = "MaxGroupOwnable")]
    pub max_group_ownable: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItemTree {
    pub header: String,
    #[serde(default)]
    pub tags: Vec<String>,
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
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub maps: HashMap<String, bool>,
    #[serde(default)]
    pub stats: HashMap<String, f64>,

    #[serde(default)]
    pub effect: Option<HashMap<String, String>>,

    // Metadata / Mechanics
    pub depth: Option<u32>,
    #[serde(default)]
    pub consumed: bool,
    #[serde(default)]
    pub stacks: u32,
    #[serde(rename = "consumeOnFull", default)]
    pub consume_on_full: bool,
    #[serde(rename = "specialRecipe")]
    pub special_recipe: Option<u32>,
    #[serde(rename = "inStore")]
    pub in_store: Option<bool>,
    #[serde(rename = "hideFromAll", default)]
    pub hide_from_all: bool,
    #[serde(rename = "requiredChampion")]
    pub required_champion: Option<String>,
    #[serde(rename = "requiredAlly")]
    pub required_ally: Option<String>,

    // ?
    pub rune: Option<ItemRune>,
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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItemRune {
    #[serde(default)]
    pub isrune: bool,
    #[serde(default)]
    pub tier: u32,
    #[serde(rename = "type")]
    pub rune_type: Option<String>,
}
