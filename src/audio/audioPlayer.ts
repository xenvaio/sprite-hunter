import { speech } from "./speech";
import { getCtx } from "./audioContext";

const AUDIO_BASE = "/audio/";
const preloadCache = new Map<string, HTMLAudioElement>();

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

// Attempt to play an audio file; if the file is absent or fails, call fallback.
// Dynamic — new files dropped in /audio/ are picked up without code changes.
// onEnd (optional) fires once when playback finishes, so callers can chain the
// next utterance without overlapping (e.g. the first word after the hunt intro).
function playFile(filename: string, fallback: () => void, onEnd?: () => void): void {
  const cached = preloadCache.get(filename);
  const audio = cached ?? new Audio(`${AUDIO_BASE}${filename}`);
  if (cached) audio.currentTime = 0;

  // A missing file fires BOTH audio.onerror AND a rejected play() promise —
  // guard so the fallback (and onEnd) runs exactly once, not twice.
  let done = false;
  const end = () => {
    if (done) return;
    done = true;
    onEnd?.();
  };
  const fail = () => {
    if (done) return;
    done = true;
    fallback();
    // Give the spoken fallback room to finish before any chained utterance.
    if (onEnd) setTimeout(onEnd, 1600);
  };

  audio.onerror = fail;
  audio.onended = end;
  audio.play().catch(fail);

  // Safety: if 'ended' never fires, release the chain anyway.
  if (onEnd) setTimeout(() => { if (!done) end(); }, 4000);
}

export const audioPlayer = {
  // Call from within first user gesture to unlock HTML5 audio on iOS
  // and warm the cache for the critical-path files.
  preload(): void {
    for (const name of ["sys-intro.mp3", "sys-hunt-forest.mp3", "sys-hunt-storm.mp3"]) {
      if (preloadCache.has(name)) continue;
      const a = new Audio(`${AUDIO_BASE}${name}`);
      a.preload = "auto";
      preloadCache.set(name, a);
    }
  },

  playIntro(): void {
    playFile("sys-intro.mp3", () =>
      speech.speakNow(
        "Sprite Hunters, let's go — choose your mode, Forest Hunt or Storm Hunt.",
      ),
    );
  },

  // onEnd fires when the announcement finishes — used to speak the first word
  // only after "<Variant>! Let's go!" has fully played (no overlap).
  playHuntStart(variantId: string, onEnd?: () => void): void {
    const name = variantId === "forest" ? "Forest Hunt" : "Storm Hunt";
    playFile(
      `sys-hunt-${variantId}.mp3`,
      () => speech.guidance(`${name}! Let's go!`),
      onEnd,
    );
  },

  playPraise(praiseText: string): void {
    const lower = praiseText.toLowerCase();
    const slug = PRAISE_FILE[lower];
    if (slug) {
      playFile(`${slug}.mp3`, () => speech.guidance(lower));
    } else {
      speech.guidance(lower);
    }
  },

  playCosmicCapture(): void {
    playFile("sys-cosmic-capture.mp3", () =>
      speech.guidance("Zero Point captured! Incredible!"),
    );
  },

  playEncouragement(text: string): void {
    const slug = ENCOURAGE_FILE[text];
    if (slug) {
      playFile(`${slug}.mp3`, () => speech.guidance(text));
    } else {
      speech.guidance(text);
    }
  },

  playWord(word: string): void {
    playFile(`word-${word.trim().toLowerCase()}.mp3`, () => speech.word(word));
  },

  playSessionEnd(count: number): void {
    const n = Math.min(Math.max(count, 0), 10);
    const noun = n === 1 ? "sprite" : "sprites";
    playFile(`sys-end-${n}.mp3`, () =>
      speech.guidance(
        `Hunt complete! ${n} ${noun} captured. Well done — the Island's sprites are in good hands.`,
      ),
    );
  },

  // Task 3 — plays sprite name audio on collection tap
  playSpriteName(spriteId: string): void {
    const base = SPRITE_FILENAME[spriteId] ?? `sprite-${spriteId}`;
    playFile(`${base}.mp3`, () => {});
  },

  // Task 3 — locked/mystery sound for unowned sprites
  playLockedSound(): void {
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

  stop(): void {
    speech.stop();
  },
};
