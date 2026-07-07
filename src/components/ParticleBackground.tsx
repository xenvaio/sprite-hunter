import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  phase: number;
  twinkleSpeed: number;
  color: string;
}

const PALETTE = [
  "255, 255, 255",
  "200, 224, 255",
  "45, 125, 154",
  "45, 125, 154",
  "232, 160, 32",
];

/**
 * Ambient drifting star/mote field — the screen is never still (Pillar C).
 * Slow drift and gentle twinkle only: no strobing, no flashing (OT
 * requirement — sensory load stays low).
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.floor((width * height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(0.02 + Math.random() * 0.1),
        baseAlpha: 0.15 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.3 + Math.random() * 0.5,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const seconds = t / 1000;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const alpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(seconds * p.twinkleSpeed + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha.toFixed(3)})`;
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
