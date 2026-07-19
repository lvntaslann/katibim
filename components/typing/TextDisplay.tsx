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
 */
function TextDisplayImpl({ text, registerSpan, blindMode }: TextDisplayProps) {
  const chars = useMemo(() => text.split(""), [text]);

  return (
    <div
      className={`select-none whitespace-pre-wrap break-words font-mono text-xl leading-relaxed tracking-wide sm:text-2xl ${
        blindMode ? "blur-sm" : ""
      }`}
      aria-hidden="true"
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={registerSpan(i)}
          data-state="pending"
          className="text-neutral-400 transition-colors duration-75 data-[caret=true]:rounded-sm data-[caret=true]:bg-blue-500/20 data-[caret=true]:outline data-[caret=true]:outline-2 data-[caret=true]:outline-blue-500 data-[state=correct]:text-neutral-900 dark:data-[state=correct]:text-neutral-100 data-[state=incorrect]:rounded-sm data-[state=incorrect]:bg-red-500/20 data-[state=incorrect]:text-red-600 dark:data-[state=incorrect]:text-red-400"
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </div>
  );
}

export const TextDisplay = memo(TextDisplayImpl);
