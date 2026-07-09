import { speech } from "./speech";
import { getCtx, getResumedCtx } from "./audioContext";

// ── Centralised audio manager ────────────────────────────────────────────────
// Every play / stop / cancel for voice clips and spoken words goes through here.
// Components never touch the Web Audio API or `speechSynthesis` directly.
//
// Voice clips play through the SAME shared AudioContext as the ambient music
// (Web Audio buffers, not <audio> elements). On iOS, mixing <audio> elements
// with Web Audio makes the OS kill one when the other stops — using one system
// keeps the ambient alive and makes every clip reliable with no per-element
// unlock. It also lets us hard-stop everything instantly (no bleed between
// hunts) and cancel on background (no queued iOS replays).

const AUDIO_BASE = "/audio/";

// Flip to true to trace audio routing in the console (each clip / word / stop).
const DEBUG_AUDIO = false;
function trace(...args: unknown[]): void {
  if (DEBUG_AUDIO) console.log("[audio]", ...args);
}

// Sprite IDs whose filenames diverge from sprite-{id}.mp3
const SPRITE_FILENAME: Record<string, string> = {
  peanut: "sprite-burnt-peanut",
  zeropoint: "sprite-zero-point",
};

// Praise text (lowercase from PRAISE array) → audio slug
const PRAISE_FILE: Record<string, string> = {
  "you got it!": "praise-you-got-it",
  "sprite captured!": "praise-sprite-captured",
  "nailed it!": "praise-nailed-it",
  "that's the one!": "praise-thats-the-one",
  "legendary!": "praise-legendary",
  "nice work!": "praise-nice-work",
  "got em!": "praise-got-em",
  "you're on fire!": "praise-youre-on-fire",
  "unstoppable!": "praise-unstoppable",
  "what a catch!": "praise-what-a-catch",
};

// Encouragement text → audio slug
const ENCOURAGE_FILE: Record<string, string> = {
  "Think about it — you can do it!": "encourage-think-about-it",
  "Almost — give it another shot!": "encourage-almost",
  "The Sprite is still there — try again!": "encourage-still-there",
  "So close — one more time!": "encourage-so-close",
  "You've got this — try again!": "encourage-youve-got-this",
};

// ── Pending-timer tracking (so every delayed play can be flushed) ─────────────
const timers = new Set<ReturnType<typeof setTimeout>>();
function later(fn: () => void, ms: number): void {
  const t = setTimeout(() => {
    timers.delete(t);
    fn();
  }, ms);
  timers.add(t);
}
function clearTimers(): void {
  for (const t of timers) clearTimeout(t);
  timers.clear();
}

// ── Web Audio voice playback (shares the ambient AudioContext) ────────────────
// null cached = file known-missing → use spoken fallback without re-fetching.
const bufferCache = new Map<string, AudioBuffer | null>();
let voiceGain: GainNode | null = null;
const activeSources = new Set<AudioBufferSourceNode>();

function isHidden(): boolean {
  return typeof document !== "undefined" && document.hidden;
}

async function loadBuffer(filename: string): Promise<AudioBuffer | null> {
  const cached = bufferCache.get(filename);
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(`${AUDIO_BASE}${filename}`);
    if (!res.ok) {
      bufferCache.set(filename, null);
      return null;
    }
    const data = await res.arrayBuffer();
    const ctx = getCtx();
    const buf = await ctx.decodeAudioData(data);
    bufferCache.set(filename, buf);
    return buf;
  } catch {
    // Missing file (Vite serves index.html → decode fails) or decode error.
    bufferCache.set(filename, null);
    return null;
  }
}

// Stop every currently-playing voice source without firing their onended chains.
function stopVoices(): void {
  for (const src of activeSources) {
    try {
      src.onended = null;
      src.stop();
    } catch { /* already stopped */ }
  }
  activeSources.clear();
}

// Play a clip. If the file is missing/unplayable, run the spoken fallback.
// onEnd fires once when playback finishes (used to chain the first word after
// the hunt intro). Starting a clip takes over from any previous one, so voice
// never overlaps.
function playClip(filename: string, fallback: () => void, onEnd?: () => void): void {
  if (isHidden()) return;
  void (async () => {
    const ctx = await getResumedCtx();
    const buf = await loadBuffer(filename);
    if (isHidden()) return; // backgrounded while loading — don't play

    if (!buf) {
      trace("miss → fallback", filename);
      fallback();
      if (onEnd) later(onEnd, 1600); // let the spoken fallback finish before chaining
      return;
    }

    stopVoices();
    if (!voiceGain) {
      voiceGain = ctx.createGain();
      voiceGain.gain.value = 1;
      voiceGain.connect(ctx.destination);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(voiceGain);
    let ended = false;
    src.onended = () => {
      if (ended) return;
      ended = true;
      activeSources.delete(src);
      onEnd?.();
    };
    activeSources.add(src);
    trace("play", filename);
    src.start();
  })();
}

// ── Background handling ──────────────────────────────────────────────────────
// When the tab is hidden, immediately cancel everything so iOS can't queue
// utterances that fire on return. Nothing re-triggers on return — audio only
// resumes on the next fresh user interaction.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      trace("backgrounded → flush");
      clearTimers();
      speech.stop();
      stopVoices();
    }
  });
}

export const audioPlayer = {
  // Call from within the first user gesture: unlocks Web Speech and resumes the
  // shared AudioContext while user activation is fresh (needed on iOS).
  unlock(): void {
    speech.unlock();
    void getResumedCtx();
  },

  // Warm the buffer cache for the critical-path clips so they start instantly.
  preload(): void {
    for (const name of ["sys-intro.mp3", "sys-hunt-forest.mp3", "sys-hunt-storm.mp3"]) {
      void loadBuffer(name);
    }
  },

  // Hard stop + queue flush. Call on hunt start, hunt end, and return to lobby
  // so no audio from a previous session ever bleeds into a new one.
  stopAll(): void {
    trace("stopAll");
    clearTimers();
    speech.stop();
    stopVoices();
  },

  playIntro(): void {
    playClip("sys-intro.mp3", () =>
      speech.speakNow(
        "Sprite Hunters, let's go — choose your mode, Forest Hunt or Storm Hunt.",
      ),
    );
  },

  // onEnd fires when the announcement finishes — lets the caller speak the first
  // word only after "<Variant>! Let's go!" has fully played (no overlap).
  playHuntStart(variantId: string, onEnd?: () => void): void {
    const name = variantId === "forest" ? "Forest Hunt" : "Storm Hunt";
    playClip(`sys-hunt-${variantId}.mp3`, () => speech.guidance(`${name}! Let's go!`), onEnd);
  },

  playPraise(praiseText: string): void {
    const lower = praiseText.toLowerCase();
    const slug = PRAISE_FILE[lower];
    if (slug) playClip(`${slug}.mp3`, () => speech.guidance(lower));
    else if (!isHidden()) speech.guidance(lower);
  },

  playCosmicCapture(): void {
    playClip("sys-cosmic-capture.mp3", () =>
      speech.guidance("Zero Point captured! Incredible!"),
    );
  },

  playEncouragement(text: string): void {
    const slug = ENCOURAGE_FILE[text];
    if (slug) playClip(`${slug}.mp3`, () => speech.guidance(text));
    else if (!isHidden()) speech.guidance(text);
  },

  playWord(word: string): void {
    const clean = word.trim().toLowerCase();
    trace("playWord", clean, "hidden:", isHidden());
    playClip(`word-${clean}.mp3`, () => speech.word(word));
  },

  playSessionEnd(count: number): void {
    const n = Math.min(Math.max(count, 0), 10);
    const noun = n === 1 ? "sprite" : "sprites";
    playClip(`sys-end-${n}.mp3`, () =>
      speech.guidance(
        `Hunt complete! ${n} ${noun} captured. Well done — the Island's sprites are in good hands.`,
      ),
    );
  },

  // Collection tap — plays the sprite's name (owned).
  playSpriteName(spriteId: string): void {
    const base = SPRITE_FILENAME[spriteId] ?? `sprite-${spriteId}`;
    playClip(`${base}.mp3`, () => { /* no spoken fallback for names */ });
  },

  // Collection tap — locked/mystery tone for unowned sprites (Web Audio).
  playLockedSound(): void {
    if (isHidden()) return;
    try {
      const ctx = getCtx();
      if (ctx.state !== "running") return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.28);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch { /* ignore */ }
  },

  // Back-compat alias — prefer stopAll().
  stop(): void {
    this.stopAll();
  },
};
