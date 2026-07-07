import { getCtx } from "./audioContext";

export function playSwoosh(): void {
  try {
    const ctx = getCtx();
    if (ctx.state !== "running") return;

    const now = ctx.currentTime;
    const duration = 0.35;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(2000, now);
    bandpass.frequency.exponentialRampToValueAtTime(400, now + duration);
    bandpass.Q.setValueAtTime(1.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.04);
    gain.gain.setValueAtTime(0.05, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration + 0.05);
  } catch {
    // Audio not available
  }
}
