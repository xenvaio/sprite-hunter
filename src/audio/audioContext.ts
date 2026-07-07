// Single shared AudioContext for all Web Audio work in this app.
// Ambient resumes it on first gesture; swoosh reuses the already-running ctx.
let _ctx: AudioContext | null = null;

export function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  return _ctx;
}

export async function getResumedCtx(): Promise<AudioContext> {
  const ctx = getCtx();
  if (ctx.state === "suspended") await ctx.resume();
  return ctx;
}
