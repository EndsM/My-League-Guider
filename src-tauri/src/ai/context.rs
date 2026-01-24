use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct ChampionContext {
    pub name: String,
    pub title: String,
    pub roles: Vec<String>,
    pub resource_type: String,
}
