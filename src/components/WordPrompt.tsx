import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface WordPromptProps {
  word: string;
  disabled: boolean;
  onAttempt: (value: string) => void;
  onReplay?: () => void;
}

const MAX_FONT = 88; // px — upper bound; long words scale down to fit the card
const MIN_FONT = 34; // px — never smaller than this

export default function WordPrompt({ word, disabled, onAttempt, onReplay }: WordPromptProps) {
  const [value, setValue] = useState("");
  const [fontPx, setFontPx] = useState(MAX_FONT);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setValue("");
    if (!disabled) inputRef.current?.focus();
  }, [word, disabled]);

  // Reset to the max size whenever the word changes, then measure below.
  useLayoutEffect(() => {
    setFontPx(MAX_FONT);
  }, [word]);

  // Shrink the word until it fits the available row width (minus space reserved
  // for the replay button so the word stays centred and never overflows the card).
  useLayoutEffect(() => {
    const el = wordRef.current;
    const row = rowRef.current;
    if (!el || !row) return;
    const avail = row.clientWidth - 92;
    if (el.scrollWidth > avail && avail > 0) {
      setFontPx((f) => Math.max(MIN_FONT, Math.floor((f * avail) / el.scrollWidth)));
    }
  });

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:gap-7">
      <div ref={rowRef} className="relative flex w-full items-center justify-center">
        <p
          ref={wordRef}
          data-testid="word"
          className="font-display text-center font-bold tracking-[0.08em] text-white"
          style={{
            fontSize: `${fontPx}px`,
            lineHeight: 1.05,
            whiteSpace: "nowrap",
            textShadow: "0 0 26px rgba(45, 125, 154, 0.6)",
          }}
        >
          {word.replace(/\b\w/g, (c) => c.toUpperCase())}
        </p>

        {onReplay && !disabled && (
          <button
            type="button"
            aria-label="Hear the word again"
            onClick={onReplay}
            className="absolute right-0 rounded-lg p-2 transition-opacity hover:opacity-80 active:scale-95"
            style={{
              color: "rgba(45, 125, 154, 0.85)",
              background: "transparent",
              border: "none",
              outline: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <svg viewBox="0 0 20 20" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z"/>
              <path d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
            </svg>
          </button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim().length === 0 || disabled) return;
          onAttempt(value);
          setValue("");
        }}
      >
        <input
          ref={inputRef}
          data-testid="word-input"
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          placeholder="type it to catch it…"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          className="font-heading w-full max-w-xs rounded-xl border-2 border-teal-chrome/50 bg-[#101828]/90 px-4 sm:px-6 py-3 sm:py-4 text-center text-2xl sm:text-3xl font-semibold tracking-widest text-white outline-none transition-all focus:border-teal-chrome focus:shadow-[0_0_24px_rgba(45,125,154,0.35)] placeholder:text-base sm:placeholder:text-lg placeholder:text-[#3d5068]"
        />
      </form>
    </div>
  );
}
