import { useEffect, useRef } from "react";
import type React from "react";
import { loadCollection, spriteLevel } from "../game/collection";
import { allSprites } from "../game/rarityEngine";
import config from "../data/config.json";
import type { HuntVariant } from "../game/types";
import { speech } from "../audio/speech";
import { ambientAudio } from "../audio/ambient";
import SpriteArt from "./SpriteSvg";
import TeaserSprite from "./TeaserSprite";

interface SessionStartProps {
  onBegin: (variant: HuntVariant) => void;
}

const RARITY_BORDER: Record<string, string> = {
  common: "#C8D4E8",
  uncommon: "#3FBF6F",
  rare: "#3D8FE8",
  epic: "#6B3FA0",
  legendary: "#E8A020",
};

const RARITY_LABEL_BG: Record<string, string> = {
  common: "#6b7a8d",
  uncommon: "#2d8a4e",
  rare: "#2a6cc4",
  epic: "#5a2d8a",
  legendary: "#b37a14",
};

const FLOAT_DELAYS = allSprites.map((_, i) => `-${((i * 1.7) % 3.2).toFixed(1)}s`);

export default function SessionStart({ onBegin }: SessionStartProps) {
  const variants = config.huntVariants as HuntVariant[];
  const collection = loadCollection();
  const introFired = useRef(false);

  useEffect(() => {
    if (introFired.current) return;
    introFired.current = true;

    // Pre-load the audio buffer before gesture so it's ready to play instantly
    ambientAudio.prefetch();

    speech.onFirstGesture(() => {
      // speakNow fires speak() immediately — no 50ms delay — maximises chance
      // Chrome honours it as a direct gesture response
      speech.speakNow(
        "Sprite Hunters, let's go. Choose your mode — Forest Hunt, or Storm Hunt.",
      );
      // Start ambient 200ms later so AudioContext creation doesn't race speech
      setTimeout(() => { ambientAudio.play(); }, 200);
    });
  }, []);

  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center overflow-y-auto px-4 py-8 sm:px-6">
      <TeaserSprite />

      <div className="flex flex-col items-center gap-2 pt-4 text-center">
        <h1 className="font-display animate-glow-breathe text-3xl font-black tracking-[0.14em] text-white sm:text-4xl lg:text-5xl">
          SPRITE HUNTER
        </h1>
        <p className="font-heading text-base font-semibold tracking-[0.28em] text-amber-glow sm:text-lg">
          COLLECTION
        </p>
      </div>

      {/* Collection grid */}
      <div className="mt-6 grid w-full max-w-3xl grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
        {allSprites.map((sprite, i) => {
          const level = spriteLevel(sprite.id, collection);
          const owned = level > 0;
          const border = RARITY_BORDER[sprite.rarity] ?? "#444";
          const labelBg = RARITY_LABEL_BG[sprite.rarity] ?? "#444";
          const glowIntensity = Math.min(level, 5);

          return (
            <div
              key={sprite.id}
              className="relative flex flex-col items-center rounded-xl border bg-[#101828]/80 pb-2 pt-3"
              style={{
                borderColor: owned ? `${border}88` : "#1e2838",
                boxShadow: owned
                  ? `0 0 ${8 + glowIntensity * 4}px ${border}${(20 + glowIntensity * 10).toString(16)}`
                  : "none",
              }}
            >
              <div
                className={`transition-all ${owned ? "animate-sprite-float" : "opacity-30 grayscale"}`}
                style={owned ? { animationDelay: FLOAT_DELAYS[i] } : undefined}
              >
                <SpriteArt spriteId={sprite.id} size={52} />
              </div>
              <span
                className="font-heading mt-1 text-center text-[10px] font-bold tracking-wider text-white sm:text-xs"
                style={{ opacity: owned ? 1 : 0.4 }}
              >
                {sprite.name.toUpperCase()}
              </span>
              <span
                className="mt-0.5 rounded px-1.5 py-px text-[8px] font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: labelBg, opacity: owned ? 1 : 0.4 }}
              >
                {sprite.rarity}
              </span>
              {owned && (
                <span className="font-display mt-0.5 text-[9px] font-bold text-amber-glow">
                  Lv.{level}
                </span>
              )}
              {!owned && (
                <span className="font-body mt-0.5 text-[8px] text-[#3d5068]">
                  Not owned
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Hunt variant buttons */}
      <div className="mt-6 flex flex-col gap-4 pb-6 sm:flex-row">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            data-testid={`variant-${v.id}`}
            onClick={() => onBegin(v)}
            className="animate-btn-pulse group relative w-56 cursor-pointer rounded-2xl border-2 bg-[#101828]/80 px-6 py-6 text-center hover:scale-[1.04] active:scale-[0.98] sm:w-64"
            style={{ borderColor: `${v.accent}66`, "--btn-accent": `${v.accent}55` } as React.CSSProperties}
          >
            <span
              className="animate-ambient-pulse pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${v.accent}22 0%, transparent 65%)`,
              }}
            />
            <span
              className="font-display relative block text-xl font-bold tracking-[0.12em] text-white sm:text-2xl"
              style={{ textShadow: `0 0 18px ${v.accent}` }}
            >
              {v.name.toUpperCase()}
            </span>
            <span className="font-heading relative mt-2 block text-sm font-semibold tracking-[0.3em] text-[#8fa3bf]">
              TAP TO BEGIN
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
