export interface AiProfile {
  id: string;
  name: string;
  endpoint: string;
  model: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface DataStatus {
  current_version: string | null;
  latest_version: string;
  is_up_to_date: boolean;
}

export interface Image {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

export interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  version: string;
  blurb: string;
  info: ChampionInfo;
  image: Image;
  tags: string[];
  partype: string;
  stats: ChampionStats;
}
