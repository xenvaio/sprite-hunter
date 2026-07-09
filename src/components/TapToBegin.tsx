import { useState } from "react";
import { getResumedCtx } from "../audio/audioContext";
import { ambientAudio } from "../audio/ambient";
import { audioPlayer } from "../audio/audioPlayer";
import { speech } from "../audio/speech";

interface Props {
  onComplete: () => void;
}

export default function TapToBegin({ onComplete }: Props) {
  const [fading, setFading] = useState(false);

  const handleTap = async () => {
    if (fading) return;
    // Unlock Web Speech synchronously in the gesture (before any await) so the
    // spoken-word fallback works later — iOS Safari blocks it otherwise.
    speech.unlock();
    setFading(true);
    audioPlayer.preload();
    try { await getResumedCtx(); } catch { /* ignore */ }
    audioPlayer.playIntro();
    void ambientAudio.play();
    setTimeout(onComplete, 650);
  };

  return (
    <div
      onClick={handleTap}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-1 cursor-pointer select-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(10,14,26,0.58) 0%, rgba(10,14,26,0.90) 100%)",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease-out",
        pointerEvents: fading ? "none" : "auto",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Neon tap graphic — bottom 20% cropped to hide the image's own "tap to begin" text.
          Presses down + glows in sync with the label below. */}
      <div
        className="animate-tap-hand"
        aria-hidden="true"
        style={{
          width: "clamp(150px, 44vw, 210px)",
          aspectRatio: "5 / 4",
          overflow: "hidden",
        }}
      >
        <img
          src="/tap%20to%20begin%20image.png"
          alt=""
          draggable={false}
          style={{
            width: "100%",
            display: "block",
            pointerEvents: "none",
            // Subtle amber glow to lift the thin neon strokes a touch — light
            // opacity so it never reads heavy against the label.
            filter:
              "drop-shadow(0 0 1px rgba(232,160,32,0.6)) drop-shadow(0 0 4px rgba(232,160,32,0.35))",
          }}
        />
      </div>

      {/* Label — glows in sync with the tap graphic */}
      <span
        className="animate-tap-glow-pulse font-display"
        style={{
          color: "#e8a020",
          fontSize: "clamp(1.1rem, 4.5vw, 1.75rem)",
          fontWeight: 900,
          letterSpacing: "0.25em",
        }}
      >
        TAP TO BEGIN
      </span>
    </div>
  );
}
