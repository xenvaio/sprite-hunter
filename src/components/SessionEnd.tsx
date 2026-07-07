import { useEffect } from "react";
import { speech } from "../audio/speech";
import { rarityConfigFor } from "../game/rarityEngine";
import type { HuntEntry } from "../game/types";
import SpriteArt from "./SpriteSvg";

interface SessionEndProps {
  captures: HuntEntry[];
  onAgain: () => void;
}

/**
 * Collection reveal — caught Sprites appear one at a time with name and
 * rarity glow, then the shared total and a warm message (also spoken aloud).
 * No score, no grade.
 */
export default function SessionEnd({ captures, onAgain }: SessionEndProps) {
  useEffect(() => {
    const n = captures.length;
    const message = `Hunt complete! ${n} ${n === 1 ? "sprite" : "sprites"} captured. Well done — the Island's sprites are in good hands.`;
    const t = setTimeout(() => speech.guidance(message), 800);
    return () => clearTimeout(t);
  }, [captures.length]);

  return (
    <div
      data-testid="session-end"
      className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-5 sm:gap-8 overflow-y-auto px-4 py-8 sm:px-6 sm:py-12"
    >
      <h1 className="font-display animate-glow-breathe text-3xl font-black tracking-[0.14em] text-amber-glow sm:text-4xl lg:text-5xl">
        HUNT COMPLETE
      </h1>

      <div className="flex max-w-3xl flex-wrap items-center justify-center gap-4">
        {captures.map((c, i) => {
          const rarity = rarityConfigFor(c.sprite);
          return (
            <div
              key={`${c.sprite.id}-${i}`}
              className="animate-reveal-in flex w-28 sm:w-32 flex-col items-center gap-1 rounded-xl border bg-[#101828]/80 px-2 sm:px-3 pb-2 sm:pb-3 pt-3 sm:pt-4"
              style={{
                animationDelay: `${0.5 + i * 0.55}s`,
                borderColor: `${rarity.glowColor}55`,
                boxShadow: `0 0 18px ${rarity.auraColor}`,
              }}
            >
              <div className="animate-sprite-float" style={{ animationDelay: `${-(i % 4) * 0.8}s` }}>
                <SpriteArt spriteId={c.sprite.id} size={62} />
              </div>
              <span
                className="font-display text-center text-xs font-bold tracking-[0.12em]"
                style={{ color: c.sprite.cosmic ? rarity.glowColor : "#eaf0f8" }}
              >
                {c.sprite.name.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className="animate-reveal-in flex flex-col items-center gap-2 text-center"
        style={{ animationDelay: `${0.5 + captures.length * 0.55 + 0.4}s` }}
      >
        <p
          data-testid="end-total"
          className="font-heading text-2xl font-bold tracking-[0.25em] text-white"
        >
          {captures.length} {captures.length === 1 ? "SPRITE" : "SPRITES"} CAPTURED
        </p>
        <p className="font-body text-base text-[#8fa3bf]">
          Well done — the Island's Sprites are in good hands.
        </p>
      </div>

      <button
        type="button"
        data-testid="hunt-again"
        onClick={onAgain}
        className="animate-reveal-in font-display cursor-pointer rounded-xl border-2 border-teal-chrome/60 bg-[#101828]/80 px-10 py-4 text-lg font-bold tracking-[0.2em] text-white transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
        style={{
          animationDelay: `${0.5 + captures.length * 0.55 + 0.9}s`,
          boxShadow: "0 0 20px rgba(45, 125, 154, 0.35)",
        }}
      >
        HUNT AGAIN
      </button>
    </div>
  );
}
