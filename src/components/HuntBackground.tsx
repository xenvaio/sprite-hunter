import { useEffect, useRef } from "react";

interface HuntBackgroundProps {
  variant: "forest" | "storm";
}

function StormParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Mote {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      phase: number;
      color: string;
    }

    let motes: Mote[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const palette = ["180, 100, 255", "255, 95, 224", "140, 180, 255", "200, 160, 255"];

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.floor((w * h) / 20000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.05 + Math.random() * 0.2),
        alpha: 0.1 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const s = t / 1000;
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -4) {
          m.y = h + 4;
          m.x = Math.random() * w;
        }
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;
        const a = m.alpha * (0.6 + 0.4 * Math.sin(s * 0.8 + m.phase));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${m.color}, ${a.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    seed();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", seed);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", seed);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function ForestParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Mote {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      phase: number;
      color: string;
    }

    let motes: Mote[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const palette = ["255, 216, 122", "255, 200, 80", "255, 240, 180", "200, 160, 80"];

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(50, Math.floor((w * h) / 25000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: h * 0.4 + Math.random() * h * 0.5,
        r: 0.8 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.06,
        vy: -(0.01 + Math.random() * 0.06),
        alpha: 0.08 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const s = t / 1000;
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < h * 0.3) {
          m.y = h + 4;
          m.x = Math.random() * w;
        }
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;
        const a = m.alpha * (0.6 + 0.4 * Math.sin(s * 0.4 + m.phase));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${m.color}, ${a.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    seed();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", seed);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", seed);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function HuntBackground({ variant }: HuntBackgroundProps) {
  const src = variant === "forest" ? "/forest background.jpg" : "/storm background.jpg";
  const brightness = variant === "forest" ? "brightness(0.45) saturate(0.9)" : "brightness(0.5) saturate(1.1)";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: brightness }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 15%, rgba(10,14,26,0.55) 85%)",
        }}
      />
      {variant === "forest" ? <ForestParticles /> : <StormParticles />}
    </div>
  );
}
