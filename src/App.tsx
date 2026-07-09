import { useEffect, useReducer, useState } from "react";
import { audioPlayer } from "./audio/audioPlayer";
import { ambientAudio } from "./audio/ambient";
import CaptureAnimation from "./components/CaptureAnimation";
import HUD from "./components/HUD";
import HuntBackground from "./components/HuntBackground";
import LobbyBackground from "./components/LobbyBackground";
import ParticleBackground from "./components/ParticleBackground";
import SessionEnd from "./components/SessionEnd";
import SessionStart from "./components/SessionStart";
import TapToBegin from "./components/TapToBegin";
import SpriteDisplay from "./components/SpriteDisplay";
import WordPrompt from "./components/WordPrompt";
import config from "./data/config.json";
import { recordCapture } from "./game/collection";
import { rarityConfigFor } from "./game/rarityEngine";
import {
  buildHunt,
  matchesWord,
  nextDartOffset,
  pickEncouragement,
  pickPraise,
  totalXp,
  xpForTier,
} from "./game/sessionEngine";
import type { HuntEntry, HuntVariant, PlayerConfig } from "./game/types";

interface GameState {
  screen: "start" | "hunt" | "end";
  variant: HuntVariant | null;
  hunt: HuntEntry[];
  index: number;
  captures: HuntEntry[];
  celebrating: boolean;
  dart: { x: number; y: number };
  prompt: string | null;
  promptSeq: number;
  praise: string | null;
  xp: number;
}

type GameAction =
  | { type: "begin"; variant: HuntVariant; hunt: HuntEntry[] }
  | { type: "capture"; praise: string }
  | { type: "advance" }
  | { type: "dodge"; dart: { x: number; y: number }; prompt: string }
  | { type: "clearPrompt" }
  | { type: "timeUp" }
  | { type: "reset" };

const initialState: GameState = {
  screen: "start",
  variant: null,
  hunt: [],
  index: 0,
  captures: [],
  celebrating: false,
  dart: { x: 0, y: 0 },
  prompt: null,
  promptSeq: 0,
  praise: null,
  xp: 0,
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "begin":
      return {
        ...initialState,
        screen: "hunt",
        variant: action.variant,
        hunt: action.hunt,
      };
    case "capture": {
      if (state.celebrating || state.screen !== "hunt") return state;
      const entry = state.hunt[state.index];
      return {
        ...state,
        celebrating: true,
        praise: action.praise,
        prompt: null,
        captures: [...state.captures, entry],
        xp: state.xp + xpForTier(entry.tier),
      };
    }
    case "advance": {
      const nextIndex = state.index + 1;
      if (nextIndex >= state.hunt.length) {
        return { ...state, screen: "end", celebrating: false, praise: null };
      }
      return {
        ...state,
        index: nextIndex,
        celebrating: false,
        praise: null,
        dart: { x: 0, y: 0 },
      };
    }
    case "dodge":
      if (state.celebrating || state.screen !== "hunt") return state;
      return {
        ...state,
        dart: action.dart,
        prompt: action.prompt,
        promptSeq: state.promptSeq + 1,
      };
    case "clearPrompt":
      return { ...state, prompt: null };
    case "timeUp":
      return state.screen === "hunt" ? { ...state, screen: "end", celebrating: false } : state;
    case "reset":
      return initialState;
    default:
      return state;
  }
}

const activePlayer = (config.players as PlayerConfig[])[0];
const { spritesPerSession, maxSessionMinutes, tierVariance } = config.session;

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const current: HuntEntry | undefined = state.hunt[state.index];

  useEffect(() => {
    if (!state.celebrating || !current) return;
    const t = setTimeout(
      () => dispatch({ type: "advance" }),
      rarityConfigFor(current.sprite).captureDurationMs,
    );
    return () => clearTimeout(t);
  }, [state.celebrating, current]);

  useEffect(() => {
    if (state.screen !== "hunt" || !current || state.celebrating) return;
    const t = setTimeout(() => audioPlayer.playWord(current.word), 400);
    return () => clearTimeout(t);
  }, [state.screen, state.index, state.celebrating]);

  useEffect(() => {
    if (state.prompt === null) return;
    const t = setTimeout(() => dispatch({ type: "clearPrompt" }), 2200);
    return () => clearTimeout(t);
  }, [state.prompt, state.promptSeq]);

  useEffect(() => {
    if (state.screen !== "hunt") return;
    const t = setTimeout(() => dispatch({ type: "timeUp" }), maxSessionMinutes * 60_000);
    return () => clearTimeout(t);
  }, [state.screen]);

  const handleBegin = (variant: HuntVariant) => {
    ambientAudio.fadeOut();
    audioPlayer.playHuntStart(variant.id);
    dispatch({
      type: "begin",
      variant,
      hunt: buildHunt(activePlayer.wordTier, spritesPerSession, tierVariance),
    });
  };

  const handleAttempt = (value: string) => {
    if (!current) return;
    if (matchesWord(value, current.word)) {
      const isCosmic = current.sprite.cosmic === true;
      const praise = isCosmic ? "ZERO POINT CAPTURED" : pickPraise();
      recordCapture(current.sprite.id);
      dispatch({ type: "capture", praise });
      if (isCosmic) audioPlayer.playCosmicCapture();
      else audioPlayer.playPraise(praise);
    } else {
      const prompt = pickEncouragement();
      dispatch({ type: "dodge", dart: nextDartOffset(state.dart), prompt });
      audioPlayer.playEncouragement(prompt);
    }
  };

  const variantId = state.variant?.id as "forest" | "storm" | undefined;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-void">
      {/* Background layers */}
      {state.screen === "start" && <LobbyBackground />}

      {state.screen === "hunt" && variantId && <HuntBackground variant={variantId} />}

      {state.screen === "end" && <ParticleBackground />}

      {state.screen === "start" && <SessionStart onBegin={handleBegin} />}

      {state.screen === "start" && !audioUnlocked && (
        <TapToBegin onComplete={() => setAudioUnlocked(true)} />
      )}

      {state.screen === "hunt" && current && (
        <>
          <HUD
            caught={state.captures.length}
            total={state.hunt.length}
            xp={state.xp}
            xpMax={totalXp(state.hunt)}
          />

          {state.celebrating && (
            <CaptureAnimation
              rarity={rarityConfigFor(current.sprite)}
              cosmic={current.sprite.cosmic === true}
              burstKey={state.index}
            />
          )}

          <div
            data-testid="arena"
            className="relative z-10 flex h-full w-full flex-col items-center justify-center pt-14 sm:pt-16"
          >
            <div
              className="relative w-full max-w-sm flex flex-col items-center gap-5 sm:gap-8 rounded-3xl px-4 sm:px-10 py-6 sm:py-8 mx-3"
              style={{
                background: "rgba(6, 8, 18, 0.5)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 0 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="relative flex h-48 sm:h-64 items-center justify-center">
                <SpriteDisplay sprite={current.sprite} celebrating={state.celebrating} dart={state.dart} />

                {state.praise && (
                  <p
                    data-testid="praise"
                    className="animate-praise-pop font-display pointer-events-none absolute -top-8 z-30 whitespace-nowrap text-3xl font-black tracking-[0.15em] text-amber-glow"
                    style={{ textShadow: "0 0 22px rgba(232, 160, 32, 0.8)" }}
                  >
                    {state.praise}
                  </p>
                )}

                {state.prompt && (
                  <p
                    key={state.promptSeq}
                    data-testid="encouragement"
                    className="animate-prompt-float font-heading pointer-events-none absolute -bottom-10 whitespace-nowrap text-xl font-semibold tracking-wide text-[#8fc4f5]"
                  >
                    {state.prompt}
                  </p>
                )}
              </div>

              <WordPrompt
                word={current.word}
                disabled={state.celebrating}
                onAttempt={handleAttempt}
                onReplay={() => audioPlayer.playWord(current.word)}
              />
            </div>
          </div>
        </>
      )}

      {state.screen === "end" && (
        <SessionEnd
          captures={state.captures}
          onAgain={() => {
            audioPlayer.stop();
            ambientAudio.play();
            dispatch({ type: "reset" });
          }}
        />
      )}
    </div>
  );
}
