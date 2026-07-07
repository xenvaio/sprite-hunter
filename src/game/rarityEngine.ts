import spritesData from "../data/sprites.json";
import wordsData from "../data/words.json";
import type { Rarity, RarityConfig, SpriteDef } from "./types";

export const rarities = spritesData.rarities as Record<Rarity, RarityConfig>;
export const allSprites = spritesData.sprites as SpriteDef[];

export const wordTiers: Record<number, string[]> = {
  1: wordsData.tier1,
  2: wordsData.tier2,
  3: wordsData.tier3,
  4: wordsData.tier4,
  5: wordsData.tier5,
};

export const MIN_TIER = 1;
export const MAX_TIER = 5;

const tierToRarityMap: Record<number, Rarity> = Object.fromEntries(
  (Object.entries(rarities) as [Rarity, RarityConfig][]).map(([name, cfg]) => [
    cfg.tier,
    name,
  ]),
);

export function tierToRarity(tier: number): Rarity {
  return tierToRarityMap[clampTier(tier)];
}

export function rarityConfigFor(sprite: SpriteDef): RarityConfig {
  return rarities[sprite.rarity];
}

export function clampTier(tier: number): number {
  return Math.min(MAX_TIER, Math.max(MIN_TIER, tier));
}

export function spritesForTier(tier: number): SpriteDef[] {
  const rarity = tierToRarity(tier);
  return allSprites.filter((s) => s.rarity === rarity);
}

export function pickSpriteForTier(tier: number, rng: () => number = Math.random): SpriteDef {
  const pool = spritesForTier(tier);
  return pool[Math.floor(rng() * pool.length)];
}
