interface HUDProps {
  caught: number;
  total: number;
  xp: number;
  xpMax: number;
}

/**
 * Top bar only (brief §2): session title, Sprite counter, XP bar.
 * No timer. No score. No level label. The bar pulses when XP lands.
 */
export default function HUD({ caught, total, xp, xpMax }: HUDProps) {
  const fill = xpMax > 0 ? Math.min(1, xp / xpMax) : 0;

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b border-teal-chrome/25 bg-[#0a0e1a]/70 px-5 py-3 backdrop-blur-sm sm:px-8">
      <span className="font-heading text-lg font-bold tracking-[0.25em] text-teal-chrome sm:text-xl">
        SPRITE HUNT
      </span>

      <span
        data-testid="hud-counter"
        className="font-display text-lg font-bold tracking-[0.2em] text-white sm:text-xl"
      >
        {caught} / {total}
      </span>

      <div className="flex w-32 items-center gap-2 sm:w-48">
        <span className="font-heading text-sm font-bold tracking-widest text-amber-glow">XP</span>
        {/* keyed by xp so the pulse re-fires on every gain */}
        <div
          key={xp}
          className={`h-3 flex-1 overflow-hidden rounded-full border border-amber-glow/40 bg-[#141a2e] ${
            xp > 0 ? "animate-xp-pulse" : ""
          }`}
        >
          <div
            data-testid="xp-fill"
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${fill * 100}%`,
              background: "linear-gradient(90deg, #a86a10, #e8a020, #ffd87a)",
              boxShadow: "0 0 10px rgba(232, 160, 32, 0.7)",
            }}
          />
        </div>
      </div>
    </header>
  );
}
