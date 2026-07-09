import { useState } from "react";
import { getResumedCtx } from "../audio/audioContext";
import { ambientAudio } from "../audio/ambient";
import { audioPlayer } from "../audio/audioPlayer";

interface Props {
  onComplete: () => void;
}

export default function TapToBegin({ onComplete }: Props) {
  const [fading, setFading] = useState(false);

  const handleTap = async () => {
    if (fading) return;
    setFading(true);
    // Preload critical files inside gesture so iOS HTML5 Audio is unlocked
    audioPlayer.preload();
    // Resume Web Audio context (needed for ambient music)
    try { await getResumedCtx(); } catch { /* ignore */ }
    audioPlayer.playIntro();
    void ambientAudio.play();
    setTimeout(onComplete, 650);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
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

      {/* Tap hand indicator */}
      <div className="animate-tap-hand flex flex-col items-center" aria-hidden="true">
        <svg viewBox="0 0 28 36" width="26" height="33" fill="#e8a020" opacity="0.72">
          {/* Index finger */}
          <rect x="9" y="0" width="10" height="20" rx="5" />
          {/* Palm body */}
          <rect x="0" y="14" width="28" height="22" rx="11" />
        </svg>
      </div>
    </div>
  );
}
