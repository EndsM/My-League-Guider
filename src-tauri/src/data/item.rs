use std::collections::HashMap;

use serde::{Deserialize, Serialize};

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
}
