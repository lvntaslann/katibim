"use client";

import { memo, useMemo } from "react";

interface TextDisplayProps {
  text: string;
  registerSpan: (index: number) => (el: HTMLSpanElement | null) => void;
  blindMode?: boolean;
}

/**
 * Renders every character as its own memoized span up front. After mount,
 * correctness/caret state is mutated imperatively via refs (see
 * useTypingEngine) — this component never re-renders on keystrokes.
 *
 * Correct/incorrect state is never color-only: incorrect characters also
 * get an underline and heavier weight so the feedback reads for red-green
 * color blindness (see docs/design-system.md).
 */
function TextDisplayImpl({ text, registerSpan, blindMode }: TextDisplayProps) {
  const chars = useMemo(() => text.split(""), [text]);

  return (
    <div
      className={`select-none whitespace-pre-wrap break-words font-mono text-xl leading-loose tracking-wide sm:text-2xl ${
        blindMode ? "blur-sm" : ""
      }`}
      aria-hidden="true"
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={registerSpan(i)}
          data-state="pending"
          className="text-ink-muted transition-colors duration-75 data-[caret=true]:border-b-2 data-[caret=true]:border-accent data-[state=correct]:text-ink data-[state=incorrect]:font-semibold data-[state=incorrect]:text-danger data-[state=incorrect]:underline data-[state=incorrect]:decoration-2 data-[state=incorrect]:underline-offset-4"
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </div>
  );
}

export const TextDisplay = memo(TextDisplayImpl);
