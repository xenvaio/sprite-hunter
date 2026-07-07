import { useEffect, useRef, useState } from "react";

interface WordPromptProps {
  word: string;
  disabled: boolean;
  onAttempt: (value: string) => void;
}

/**
 * The word beneath the Sprite — large Orbitron, minimum 48px (brief §2).
 * Typing the word is the only capture mechanism: a matching submission
 * captures the Sprite, anything else makes it dart away (handled upstream).
 */
export default function WordPrompt({ word, disabled, onAttempt }: WordPromptProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    if (!disabled) inputRef.current?.focus();
  }, [word, disabled]);

  return (
    <div className="flex flex-col items-center gap-7">
      <p
        data-testid="word"
        className="font-display text-center font-bold tracking-[0.08em] text-white"
        style={{
          fontSize: "clamp(48px, 9vw, 88px)",
          textShadow: "0 0 26px rgba(45, 125, 154, 0.6)",
        }}
      >
        {word.replace(/\b\w/g, (c) => c.toUpperCase())}
      </p>

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
          className="font-heading w-80 rounded-xl border-2 border-teal-chrome/50 bg-[#101828]/90 px-6 py-4 text-center text-3xl font-semibold tracking-widest text-white outline-none transition-all focus:border-teal-chrome focus:shadow-[0_0_24px_rgba(45,125,154,0.35)] placeholder:text-lg placeholder:text-[#3d5068]"
        />
      </form>
    </div>
  );
}
