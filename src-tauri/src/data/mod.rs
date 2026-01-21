mod champion;
mod item;

use serde::{Deserialize, Serialize};

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
