export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface RarityConfig {
  tier: number;
  glowColor: string;
  coreColor: string;
  auraColor: string;
  captureDurationMs: number;
}

export interface SpriteDef {
  id: string;
  name: string;
  rarity: Rarity;
  hue: number;
  cosmic?: boolean;
}

export interface HuntEntry {
  word: string;
  tier: number;
  sprite: SpriteDef;
}

export interface PlayerConfig {
  id: string;
  name: string;
  wordTier: number;
}

export interface HuntVariant {
  id: string;
  name: string;
  accent: string;
}
