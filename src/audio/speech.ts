import config from "../data/config.json";

interface SpeechSettings {
  enabled: boolean;
  speakWordOnAppear: boolean;
  rate: number;
  volume: number;
  preferredLangs: string[];
}

const settings = config.speech as SpeechSettings;
const supported = typeof window !== "undefined" && "speechSynthesis" in window;

let chosenVoice: SpeechSynthesisVoice | null = null;
let gestureReceived = false;
let pendingTimer: ReturnType<typeof setTimeout> | null = null;

let onGestureCallbacks: (() => void)[] = [];

// Gate all speech on a confirmed user gesture. Fires once on first tap/key.
if (typeof document !== "undefined") {
  const markGesture = () => {
    console.log('GESTURE FIRED');
    gestureReceived = true;
    for (const cb of onGestureCallbacks) cb();
    onGestureCallbacks = [];
  };
  document.addEventListener("pointerdown", markGesture, { once: true });
  document.addEventListener("keydown", markGesture, { once: true });
}

function resolveVoice(): void {
  if (!supported) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;

  // Preferred voices by name — female Australian first, UK fallback.
  const preferredNames = ["Microsoft Catherine", "Google UK English Female"];
  for (const name of preferredNames) {
    const match = voices.find((v) => v.name.toLowerCase().includes(name.toLowerCase()));
    if (match) {
      chosenVoice = match;
      return;
    }
  }
  // Language fallback
  for (const lang of settings.preferredLangs) {
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    if (match) {
      chosenVoice = match;
      return;
    }
  }
  chosenVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en")) ?? voices[0];
}

if (supported) {
  // Voices may already be available (Firefox) or arrive async (Chrome).
  resolveVoice();
  window.speechSynthesis.addEventListener("voiceschanged", resolveVoice);
}

function makeUtterance(text: string, rate: number): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  if (chosenVoice) u.voice = chosenVoice;
  u.rate = rate;
  u.pitch = 1;
  u.volume = settings.volume;
  return u;
}

// Cancel current speech then speak after 50ms.
// Chrome silently drops speak() called in the same tick as cancel() — the
// delay lets the browser process the cancel before the new utterance queues.
// pendingTimer ensures only the latest interrupt call survives if two arrive
// within the 50ms window.
function speakInterrupt(text: string, rate: number): void {
  if (pendingTimer !== null) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  window.speechSynthesis.cancel();
  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    try {
      console.log('SPEAKING:', text);
      window.speechSynthesis.speak(makeUtterance(text, rate));
    } catch {
      // ignore
    }
  }, 50);
}

// Queue behind whatever is currently speaking — no cancel.
function speakQueue(text: string, rate: number): void {
  try {
    console.log('SPEAKING:', text);
    window.speechSynthesis.speak(makeUtterance(text, rate));
  } catch {
    // ignore
  }
}

export const speech = {
  guidance(text: string): void {
    if (!supported || !settings.enabled || !gestureReceived) return;
    speakInterrupt(text, settings.rate);
  },

  guidanceQueued(text: string): void {
    if (!supported || !settings.enabled || !gestureReceived) return;
    speakQueue(text, settings.rate);
  },

  word(text: string): void {
    if (!supported || !settings.enabled || !gestureReceived) return;
    if (!settings.speakWordOnAppear) return;
    speakQueue(text, Math.min(settings.rate, 0.85));
  },

  stop(): void {
    if (!supported) return;
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  },

  // Speaks immediately without the cancel+50ms delay — use for first-ever utterance
  // so the speak() call stays as close to the user gesture as possible.
  speakNow(text: string): void {
    if (!supported || !settings.enabled || !gestureReceived) return;
    if (pendingTimer !== null) { clearTimeout(pendingTimer); pendingTimer = null; }
    try {
      window.speechSynthesis.cancel();
      console.log('SPEAKING:', text);
      window.speechSynthesis.speak(makeUtterance(text, settings.rate));
    } catch { /* ignore */ }
  },

  onFirstGesture(cb: () => void): void {
    if (gestureReceived) {
      cb();
    } else {
      onGestureCallbacks.push(cb);
    }
  },

  get hasGesture(): boolean {
    return gestureReceived;
  },
};
