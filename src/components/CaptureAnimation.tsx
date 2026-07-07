import { useMemo } from "react";
import type { RarityConfig } from "../game/types";

interface CaptureAnimationProps {
  rarity: RarityConfig;
  cosmic: boolean;
  /** Changes per capture so the burst re-randomises each time. */
  burstKey: number;
}

interface BurstParticle {
  dx: number;
  dy: number;
  size: number;
  delay: number;
  color: string;
}

/**
 * The capture moment: a radial spray of glowing particles from the Sprite
 * plus one soft gold screen bloom (a single cued pulse — never a strobe).
 * Zero Point gets the extended cosmic treatment.
 */
export default function CaptureAnimation({ rarity, cosmic, burstKey }: CaptureAnimationProps) {
  const particles = useMemo<BurstParticle[]>(() => {
    const colors = [rarity.glowColor, rarity.coreColor, "#ffd87a", "#ffffff"];
    const count = cosmic ? 34 : 22;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = (cosmic ? 130 : 95) + Math.random() * (cosmic ? 110 : 75);
      return {
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: 4 + Math.random() * 5,
        delay: Math.random() * 0.12,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burstKey]);

  const duration = cosmic ? "1.6s" : "0.85s";

  return (
    <>
      {/* screen bloom */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 ${
          cosmic ? "animate-cosmic-flash" : "animate-capture-flash"
        }`}
        style={{
          background: cosmic
            ? "radial-gradient(circle at 50% 45%, rgba(232,160,32,0.5) 0%, rgba(107,63,160,0.35) 40%, transparent 70%)"
            : "radial-gradient(circle at 50% 45%, rgba(232,160,32,0.55) 0%, transparent 60%)",
        }}
      />

      {/* particle spray from the sprite */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        {particles.map((p, i) => (
          <span
            key={`${burstKey}-${i}`}
            className="animate-burst-fly absolute rounded-full"
            style={
              {
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 ${p.size * 1.6}px ${p.color}`,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animationDuration: duration,
                animationDelay: `${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* cosmic vignette for the Zero Point moment */}
      {cosmic && (
        <div
          className="animate-cosmic-veil pointer-events-none fixed inset-0 z-10"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, transparent 25%, rgba(4,2,10,0.85) 75%)",
          }}
        />
      )}
    </>
  );
}
