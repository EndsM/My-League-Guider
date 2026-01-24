use crate::data::champion::Champion;
use crate::data::item::Item;
use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug, Serialize, Clone)]
pub struct ChampionContext {
    pub name: String,
    pub title: String,
    pub lore_snippet: String,
    pub roles: Vec<String>,
    pub resource_type: String,
    pub role_info: RoleInfo,
    pub stats: ChampionStatsContext,
}

#[derive(Debug, Serialize, Clone)]
pub struct RoleInfo {
    pub attack: u8,
    pub defense: u8,
    pub magic: u8,
    pub difficulty: u8,
}

#[derive(Debug, Serialize, Clone)]
pub struct ChampionStatsContext {
    pub hp: f64,
    pub hp_per_level: f64,
    pub mp: f64,
    pub mp_per_level: f64,
    pub move_speed: f64,
    pub armor: f64,
    pub armor_per_level: f64,
    pub spell_block: f64,
    pub spell_block_per_level: f64,
    pub attack_range: f64,
    pub hp_regen: f64,
    pub hp_regen_per_level: f64,
    pub mp_regen: f64,
    pub mp_regen_per_level: f64,
    pub crit: f64,
    pub crit_per_level: f64,
    pub attack_damage: f64,
    pub attack_damage_per_level: f64,
    pub attack_speed: f64,
    pub attack_speed_per_level: f64,
}

impl From<Champion> for ChampionContext {
    fn from(c: Champion) -> Self {
        Self {
            name: c.name,
            title: c.title,
            lore_snippet: c.blurb,
            roles: c.tags,
            resource_type: c.partype,
            role_info: RoleInfo {
                attack: c.info.attack,
                defense: c.info.defense,
                magic: c.info.magic,
                difficulty: c.info.difficulty,
            },
            stats: ChampionStatsContext {
                hp: c.stats.hp,
                hp_per_level: c.stats.hp_per_level,
                mp: c.stats.mp,
                mp_per_level: c.stats.mp_per_level,
                move_speed: c.stats.move_speed,
                armor: c.stats.armor,
                armor_per_level: c.stats.armor_per_level,
                spell_block: c.stats.spell_block,
                spell_block_per_level: c.stats.spell_block_per_level,
                attack_range: c.stats.attack_range,
                hp_regen: c.stats.hp_regen,
                hp_regen_per_level: c.stats.hp_regen_per_level,
                mp_regen: c.stats.mp_regen,
                mp_regen_per_level: c.stats.mp_regen_per_level,
                crit: c.stats.crit,
                crit_per_level: c.stats.crit_per_level,
                attack_damage: c.stats.attack_damage,
                attack_damage_per_level: c.stats.attack_damage_per_level,
                attack_speed: c.stats.attack_speed,
                attack_speed_per_level: c.stats.attack_speed_per_level,
            },
        }
    }
}

#[derive(Debug, Serialize, Clone)]
pub struct ItemContext {
    pub name: String,
    pub description: String,
    pub gold_cost: u32,
    pub stats: HashMap<String, f64>,
    pub tags: Vec<String>,
    pub builds_from: Vec<String>,
    pub builds_into: Vec<String>,
    pub required_champion: Option<String>,
}

impl From<Item> for ItemContext {
    fn from(i: Item) -> Self {
        // Prefer description (often contains HTML but has details) over plaintext
        // If description is empty, fallback to plaintext
        let description = if !i.description.is_empty() {
            i.description
        } else {
            i.plaintext
        };

        Self {
            name: i.name,
            description,
            gold_cost: i.gold.total,
            stats: i.stats,
            tags: i.tags,
            builds_from: i.from,
            builds_into: i.into,
            required_champion: i.required_champion,
        }
    }
}
