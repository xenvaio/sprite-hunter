import { rarityConfigFor } from "../game/rarityEngine";
import type { Rarity, SpriteDef } from "../game/types";
import SpriteArt from "./SpriteSvg";

interface SpriteDisplayProps {
  sprite: SpriteDef;
  celebrating: boolean;
  dart: { x: number; y: number };
}

function RarityAura({ rarity, cosmic }: { rarity: Rarity; cosmic: boolean }) {
  if (cosmic) {
    return (
      <>
        <span
          className="animate-ambient-pulse absolute -inset-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,160,32,0.5) 0%, rgba(255,63,216,0.28) 42%, transparent 72%)",
          }}
        />
        <span
          className="animate-orbit-spin absolute -inset-12 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(232,160,32,0.2), transparent, rgba(255,63,216,0.15), transparent)",
          }}
        />
      </>
    );
  }

  switch (rarity) {
    case "common":
      return (
        <span
          className="animate-ambient-pulse absolute -inset-8 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,212,232,0.35) 0%, transparent 65%)",
          }}
        />
      );
    case "uncommon":
      return (
        <span
          className="animate-rarity-pulse-green absolute -inset-9 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(63,191,111,0.4) 0%, transparent 65%)",
          }}
        />
      );
    case "rare":
      return (
        <span
          className="animate-rarity-shimmer-blue absolute -inset-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(61,143,232,0.4) 0%, transparent 65%)",
          }}
        />
      );
    case "epic":
      return (
        <>
          <span
            className="animate-ambient-pulse absolute -inset-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(107,63,160,0.45) 0%, transparent 65%)",
            }}
          />
          <span className="animate-orbit-spin absolute -inset-8 block">
            <span
              className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
              style={{ background: "#b48fe8", boxShadow: "0 0 8px #6b3fa0" }}
            />
            <span
              className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full"
              style={{ background: "#d0a8ff", boxShadow: "0 0 6px #6b3fa0" }}
            />
            <span
              className="absolute right-0 top-1/3 h-1.5 w-1.5 rounded-full"
              style={{ background: "#c088e0", boxShadow: "0 0 6px #6b3fa0" }}
            />
          </span>
        </>
      );
    case "legendary":
      return (
        <>
          <span
            className="animate-ambient-pulse absolute -inset-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(232,160,32,0.45) 0%, transparent 65%)",
            }}
          />
          <span
            className="animate-orbit-spin absolute -inset-10 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(232,160,32,0.2), transparent, rgba(255,216,122,0.15), transparent)",
            }}
          />
        </>
      );
  }
}

export default function SpriteDisplay({ sprite, celebrating, dart }: SpriteDisplayProps) {
  const rarity = rarityConfigFor(sprite);

  return (
    <div
      className="pointer-events-none relative transition-transform duration-300 ease-out"
      style={{ transform: `translate(${dart.x}px, ${dart.y}px)` }}
      data-testid="sprite"
    >
      <div className={celebrating ? "animate-capture-pop" : "animate-sprite-float"}>
        <div
          className="animate-glow-breathe relative"
          style={{ "--glow": rarity.glowColor } as React.CSSProperties}
        >
          <RarityAura rarity={sprite.rarity} cosmic={sprite.cosmic === true} />

          {sprite.cosmic && (
            <span className="animate-orbit-spin absolute -inset-8 block">
              <span
                className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                style={{ background: "#ffd87a", boxShadow: "0 0 10px #e8a020" }}
              />
              <span
                className="absolute bottom-2 left-2 h-2 w-2 rounded-full"
                style={{ background: "#ff5fe0", boxShadow: "0 0 8px #ff3fd8" }}
              />
              <span
                className="absolute right-1 top-1/3 h-1.5 w-1.5 rounded-full"
                style={{ background: "#c8d4e8", boxShadow: "0 0 6px #ffffff" }}
              />
            </span>
          )}

          <SpriteArt spriteId={sprite.id} size={sprite.cosmic ? 185 : 165} className="relative" />
        </div>
      </div>
    </div>
  );
}
