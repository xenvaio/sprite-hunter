import { getResumedCtx } from "./audioContext";

let gainNode: GainNode | null = null;
let sourceNode: AudioBufferSourceNode | null = null;
let buffer: AudioBuffer | null = null;
let prefetchedData: ArrayBuffer | null = null;
let playing = false;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;

const TARGET_VOLUME = 0.12;
const FADE_DURATION = 1.5;
const CROSSFADE_DURATION = 0.8;

async function loadBuffer(): Promise<AudioBuffer | null> {
  if (buffer) return buffer;
  try {
    let data: ArrayBuffer;
    if (prefetchedData) {
      data = prefetchedData;
      prefetchedData = null;
    } else {
      const res = await fetch("/sprite%20audio.mp3");
      if (!res.ok) return null;
      data = await res.arrayBuffer();
    }
    const ctx = await getResumedCtx();
    buffer = await ctx.decodeAudioData(data);
    return buffer;
  } catch {
    return null;
  }
}

function startSource(ctx: AudioContext, buf: AudioBuffer, fadeIn: boolean): void {
  if (!gainNode) return;

  sourceNode = ctx.createBufferSource();
  sourceNode.buffer = buf;
  sourceNode.connect(gainNode);

  sourceNode.onended = () => {
    if (!playing) return;
    const nextSource = ctx.createBufferSource();
    nextSource.buffer = buf;
    nextSource.connect(gainNode!);

    const now = ctx.currentTime;
    gainNode!.gain.setValueAtTime(gainNode!.gain.value, now);
    gainNode!.gain.linearRampToValueAtTime(TARGET_VOLUME * 0.3, now + CROSSFADE_DURATION * 0.3);
    gainNode!.gain.linearRampToValueAtTime(TARGET_VOLUME, now + CROSSFADE_DURATION);

    nextSource.start(0);
    nextSource.onended = sourceNode!.onended;
    sourceNode = nextSource;
  };

  if (fadeIn) {
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(TARGET_VOLUME, ctx.currentTime + 0.5);
  } else {
    gainNode.gain.setValueAtTime(TARGET_VOLUME, ctx.currentTime);
  }

  sourceNode.start(0);
}

export const ambientAudio = {
  async play(): Promise<void> {
    if (playing) return;

    const ctx = await getResumedCtx();

    if (!gainNode) {
      gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
    }

    const buf = await loadBuffer();
    if (!buf) return;

    playing = true;
    startSource(ctx, buf, true);
  },

  fadeOut(): void {
    if (!playing || !gainNode) return;
    playing = false;

    const ctx = gainNode.context as AudioContext;
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + FADE_DURATION);

    if (fadeTimer) clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      try { sourceNode?.stop(); } catch { /* already stopped */ }
      sourceNode = null;
      fadeTimer = null;
    }, FADE_DURATION * 1000 + 100);
  },

  prefetch(): void {
    if (buffer || prefetchedData) return;
    fetch("/sprite%20audio.mp3")
      .then(r => r.ok ? r.arrayBuffer() : Promise.reject())
      .then(data => { prefetchedData = data; })
      .catch(() => {});
  },

  stop(): void {
    playing = false;
    try { sourceNode?.stop(); } catch { /* already stopped */ }
    sourceNode = null;
    if (gainNode) {
      try { gainNode.gain.setValueAtTime(0, gainNode.context.currentTime); } catch { /* ignore */ }
    }
    if (fadeTimer) {
      clearTimeout(fadeTimer);
      fadeTimer = null;
    }
  },
};
