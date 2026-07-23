import { clampTier, pickSpriteForTier, wordTiers } from "./rarityEngine";
import type { HuntEntry } from "./types";

const ENCOURAGEMENTS = [
  "Think about it — you can do it!",
  "Almost — give it another shot!",
  "The Sprite is still there — try again!",
  "So close — one more time!",
  "You've got this — try again!",
];

const PRAISE = [
  "YOU GOT IT!",
  "SPRITE CAPTURED!",
  "NAILED IT!",
  "THAT'S THE ONE!",
  "LEGENDARY!",
  "NICE WORK!",
  "GOT EM!",
  "YOU'RE ON FIRE!",
  "UNSTOPPABLE!",
  "WHAT A CATCH!",
];

function makeShuffledPicker(pool: string[]): () => string {
  let remaining: string[] = [];
  return () => {
    if (remaining.length === 0) {
      remaining = [...pool];
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
    }
    return remaining.pop()!;
  };
}

const nextEncouragement = makeShuffledPicker(ENCOURAGEMENTS);
const nextPraise = makeShuffledPicker(PRAISE);

export function pickEncouragement(): string {
  return nextEncouragement();
}

export function pickPraise(): string {
  return nextPraise();
}

/**
 * Roll a word tier (1–5) for one hunt slot from explicit per-tier weights.
 * `weights[0]` is tier 1 (Common) … `weights[4]` is tier 5 (Legendary).
 * This is what keeps all five rarities reachable in a single blended
 * session — Common appears most often, Legendary rarely but possibly.
 */
function rollWeightedTier(weights: number[], rng: () => number): number {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll < 0) return clampTier(i + 1);
  }
  return clampTier(weights.length);
}

/**
 * Build a full hunt: `count` word/sprite pairs. Each slot's tier — and thus
 * the sprite rarity bound to it — is drawn from `weights` (one entry per
 * tier). Words are drawn without repeats while a tier's pool lasts.
 */
export function buildHunt(
  count: number,
  weights: number[],
  rng: () => number = Math.random,
): HuntEntry[] {
  const used = new Set<string>();
  const entries: HuntEntry[] = [];

  for (let i = 0; i < count; i++) {
    const tier = rollWeightedTier(weights, rng);
    const pool = wordTiers[tier];
    const fresh = pool.filter((w) => !used.has(w));
    const source = fresh.length > 0 ? fresh : pool;
    const word = source[Math.floor(rng() * source.length)];
    used.add(word);
    entries.push({ word, tier, sprite: pickSpriteForTier(tier, rng) });
  }

  return entries;
}

/** XP awarded per capture — rarer sprites are worth more, silently. */
export function xpForTier(tier: number): number {
  return tier * 10;
}

export function totalXp(hunt: HuntEntry[]): number {
  return hunt.reduce((sum, e) => sum + xpForTier(e.tier), 0);
}

/**
 * A dart: the Sprite jumps 20–40px in a random direction on a wrong
 * attempt (brief §2), clamped so it never wanders far from centre.
 */
export function nextDartOffset(
  current: { x: number; y: number },
  rng: () => number = Math.random,
): { x: number; y: number } {
  const angle = rng() * Math.PI * 2;
  const distance = 20 + rng() * 20;
  const clamp = (v: number) => Math.min(60, Math.max(-60, v));
  return {
    x: clamp(current.x + Math.cos(angle) * distance),
    y: clamp(current.y + Math.sin(angle) * distance),
  };
}

/** Typed capture check: forgiving on case and stray whitespace. */
export function matchesWord(input: string, word: string): boolean {
  return input.trim().toLowerCase() === word.trim().toLowerCase();
}
