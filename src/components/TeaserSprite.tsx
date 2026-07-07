import { useEffect, useRef, useState } from "react";
import { allSprites } from "../game/rarityEngine";
import type { SpriteDef } from "../game/types";
import { playSwoosh } from "../audio/swoosh";
import SpriteArt from "./SpriteSvg";

const RARE_OR_ABOVE = allSprites.filter(
  (s) => s.rarity === "rare" || s.rarity === "epic" || s.rarity === "legendary",
);

function pickTeaser(): SpriteDef {
  return RARE_OR_ABOVE[Math.floor(Math.random() * RARE_OR_ABOVE.length)];
}

interface Trail {
  id: number;
  x: number;
  y: number;
}

export default function TeaserSprite() {
  const [flying, setFlying] = useState<{
    sprite: SpriteDef;
    key: number;
    fromRight: boolean;
    startY: number;
    angleDeg: number;
  } | null>(null);

  const [trails, setTrails] = useState<Trail[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyRef = useRef(0);
  const trailIdRef = useRef(0);

  const launch = () => {
    const sprite = pickTeaser();
    const fromRight = Math.random() > 0.5;
    const startY = 10 + Math.random() * 50;
    const angleDeg = (Math.random() - 0.5) * 40;
    keyRef.current++;
    setFlying({ sprite, key: keyRef.current, fromRight, startY, angleDeg });
    playSwoosh();

    setTimeout(() => setFlying(null), 1200);
    setTimeout(() => setTrails([]), 2200);
  };

  const scheduleNext = () => {
    const delay = 8000 + Math.random() * 7000;
    timerRef.current = setTimeout(() => {
      launch();
      scheduleNext();
    }, delay);
  };

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      launch();
      scheduleNext();
    }, 3000);

    return () => {
      clearTimeout(initialDelay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!flying) return;

    const interval = setInterval(() => {
      const el = document.getElementById(`teaser-sprite-${flying.key}`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (cx < -50 || cx > window.innerWidth + 50) return;

      const batch: Trail[] = [];
      for (let i = 0; i < 6; i++) {
        trailIdRef.current++;
        batch.push({
          id: trailIdRef.current,
          x: cx + (Math.random() - 0.5) * 50,
          y: cy + (Math.random() - 0.5) * 50,
        });
      }
      setTrails((prev) => {
        const next = [...prev, ...batch];
        if (next.length > 120) return next.slice(-120);
        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [flying?.key]);

  return (
    <>
      {trails.map((t) => (
        <span
          key={t.id}
          className="pointer-events-none fixed z-10"
          style={{
            left: t.x,
            top: t.y,
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            borderRadius: "50%",
            background: `hsl(${40 + Math.random() * 30}, 100%, ${70 + Math.random() * 25}%)`,
            boxShadow: `0 0 6px hsl(${40 + Math.random() * 30}, 100%, 75%)`,
            animation: "teaser-trail-fade 0.8s ease-out forwards",
          }}
        />
      ))}

      {flying && (
        <div
          id={`teaser-sprite-${flying.key}`}
          key={flying.key}
          className="pointer-events-none fixed z-20"
          style={{
            top: `${flying.startY}%`,
            left: 0,
            animation: "teaser-zip 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
            ["--teaser-start" as string]: flying.fromRight ? "calc(100vw + 40px)" : "-120px",
            ["--teaser-end" as string]: flying.fromRight ? "-120px" : "calc(100vw + 40px)",
            ["--teaser-y-drift" as string]: `${Math.tan((flying.angleDeg * Math.PI) / 180) * 100}vh`,
          }}
        >
          <div
            style={{
              transform: flying.fromRight ? "scaleX(-1)" : "none",
              animation: "teaser-blur 1s ease-in-out forwards",
            }}
          >
            <SpriteArt spriteId={flying.sprite.id} size={70} />
          </div>
        </div>
      )}
    </>
  );
}
