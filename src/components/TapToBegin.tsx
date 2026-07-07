import { useState } from "react";
import { getResumedCtx } from "../audio/audioContext";
import { ambientAudio } from "../audio/ambient";
import { speech } from "../audio/speech";

interface Props {
  onComplete: () => void;
}

export default function TapToBegin({ onComplete }: Props) {
  const [fading, setFading] = useState(false);

  const handleTap = async () => {
    if (fading) return;
    setFading(true);
    // Resume Web Audio on this gesture tick
    try { await getResumedCtx(); } catch { /* ignore */ }
    // pointerdown already fired markGesture so gestureReceived is true
    speech.speakNow(
      "Sprite Hunters, let's go — choose your mode, Forest Hunt or Storm Hunt.",
    );
    // Slight delay so the speech utterance claim lands before AudioContext buffers start
    setTimeout(() => { void ambientAudio.play(); }, 150);
    // Unmount after the CSS fade completes
    setTimeout(onComplete, 650);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(10,14,26,0.58) 0%, rgba(10,14,26,0.90) 100%)",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease-out",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <button
        type="button"
        onClick={handleTap}
        className="animate-tap-glow-pulse font-display cursor-pointer select-none"
        style={{
          color: "#e8a020",
          fontSize: "clamp(1.1rem, 4.5vw, 1.75rem)",
          fontWeight: 900,
          letterSpacing: "0.25em",
          background: "transparent",
          border: "none",
          outline: "none",
          padding: "clamp(0.75rem, 3vw, 1.5rem) clamp(1.5rem, 6vw, 2.5rem)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        TAP TO BEGIN
      </button>
    </div>
  );
}
