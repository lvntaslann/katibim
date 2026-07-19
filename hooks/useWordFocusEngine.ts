"use client";

/**
 * Like hooks/useTypingEngine.ts, this hook intentionally mutates DOM-element
 * refs imperatively outside React's render cycle (keydown handler, low-freq
 * effects) to keep per-keystroke work off the render path. It also uses the
 * React-documented lazy-ref-init-during-render idiom
 * (https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents,
 * `if (ref.current === null) { ref.current = ... }`) to size the char/word
 * ref arrays once per mount without an extra effect. Both
 * react-hooks/immutability and react-hooks/refs are tuned for React
 * Compiler's auto-memoization assumptions, which this file does not opt
 * into, so they're disabled here rather than peppered with per-line
 * suppressions.
 */
/* eslint-disable react-hooks/immutability, react-hooks/refs */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TypingEngine, type EngineConfig, type EngineMetrics } from "@/lib/typing-engine";
import type { KeyboardLayout } from "@/types";

export interface WordBoundary {
  start: number;
  end: number;
}

export interface UseWordFocusEngineOptions {
  text: string;
  layout: KeyboardLayout;
  config: EngineConfig;
  /** Only listens for keystrokes while true (e.g. session started & not finished). */
  active: boolean;
  onFinish?: (engine: TypingEngine) => void;
  /** Called imperatively (no re-render) whenever the active word changes. */
  onActiveWordChange?: (wordIndex: number, boundary: WordBoundary) => void;
  /** Called when Backspace is pressed but correction isn't allowed — for a brief non-jarring signal. */
  onBackspaceBlocked?: () => void;
}

function computeWordBoundaries(text: string): WordBoundary[] {
  const words: WordBoundary[] = [];
  let start = 0;
  for (let i = 0; i <= text.length; i++) {
    if (i === text.length || text[i] === " ") {
      if (i > start) words.push({ start, end: i });
      start = i + 1;
    }
  }
  return words;
}

/**
 * Word-focus variant of hooks/useTypingEngine.ts: same TypingEngine core and
 * the same imperative-refs-only hot path (see that file's docblock), but
 * keystrokes are captured on a specific <input> element instead of window,
 * and DOM updates additionally promote whichever word contains the caret —
 * scoring, key-event logging and per-key analytics are entirely unchanged,
 * this only adds a presentation-layer notion of "the active word".
 *
 * The engine is constructed exactly once per mount (`useState` initializer,
 * not `useMemo`) and never rebuilt afterwards. `text`/`layout`/`config` are
 * only read at that first construction. Callers that need a fresh session
 * (new text, new duration, …) must remount this hook by changing the `key`
 * on the component that owns it — see app/antrenman/page.tsx's
 * `key={sessionKey}` — rather than relying on prop changes to reset state.
 * This is deliberate: an EngineConfig object literal recreated on every
 * parent render must never be able to trigger engine reconstruction, or a
 * setState-in-effect keyed on the engine's identity turns into an infinite
 * render loop (recreate engine -> reset effect -> setState -> re-render ->
 * new config object -> recreate engine -> ...).
 */
export function useWordFocusEngine({
  text,
  layout,
  config,
  active,
  onFinish,
  onActiveWordChange,
  onBackspaceBlocked,
}: UseWordFocusEngineOptions) {
  const [engine] = useState(() => new TypingEngine(text, layout, config));

  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  if (charRefs.current.length !== text.length) {
    charRefs.current = new Array(text.length).fill(null);
  }

  const wordBoundaries = useMemo(() => computeWordBoundaries(text), [text]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  if (wordRefs.current.length !== wordBoundaries.length) {
    wordRefs.current = new Array(wordBoundaries.length).fill(null);
  }

  const charToWord = useMemo(() => {
    const map = new Array<number>(text.length).fill(0);
    wordBoundaries.forEach((w, wi) => {
      for (let i = w.start; i < w.end; i++) map[i] = wi;
    });
    return map;
  }, [text, wordBoundaries]);

  const caretElRef = useRef<HTMLSpanElement | null>(null);
  const activeWordIndexRef = useRef(0);
  const [metrics, setMetrics] = useState<EngineMetrics | null>(() => engine.getMetrics());
  const [finished, setFinished] = useState(false);

  const registerChar = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      charRefs.current[index] = el;
    },
    []
  );

  const registerWord = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      wordRefs.current[index] = el;
    },
    []
  );

  const moveCaret = useCallback((index: number) => {
    if (caretElRef.current) delete caretElRef.current.dataset.caret;
    const el = charRefs.current[index] ?? null;
    if (el) el.dataset.caret = "true";
    caretElRef.current = el;
  }, []);

  const updateActiveWord = useCallback(() => {
    if (wordBoundaries.length === 0) return;
    const idx = Math.min(engine.getCaretIndex(), text.length - 1);
    const wordIndex = charToWord[idx] ?? wordBoundaries.length - 1;
    if (wordIndex === activeWordIndexRef.current && wordRefs.current[wordIndex]?.dataset.active === "true") return;

    const prevEl = wordRefs.current[activeWordIndexRef.current];
    if (prevEl) prevEl.dataset.active = "false";
    const nextEl = wordRefs.current[wordIndex];
    if (nextEl) nextEl.dataset.active = "true";

    // "Sadece aktif kelime" preview target — the word right after the active one.
    const prevPreviewEl = wordRefs.current[activeWordIndexRef.current + 1];
    if (prevPreviewEl) prevPreviewEl.dataset.next = "false";
    const nextPreviewEl = wordRefs.current[wordIndex + 1];
    if (nextPreviewEl) nextPreviewEl.dataset.next = "true";

    activeWordIndexRef.current = wordIndex;
    onActiveWordChange?.(wordIndex, wordBoundaries[wordIndex]);
  }, [engine, charToWord, text.length, wordBoundaries, onActiveWordChange]);

  const applyCharResult = useCallback((index: number, state: "correct" | "incorrect" | "pending") => {
    const el = charRefs.current[index];
    if (el) el.dataset.state = state;
  }, []);

  const handleKeyDown = useCallback(
    (event: { code: string; key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean }) => {
      if (engine.isFinished()) return { shouldPreventDefault: false };

      if (event.code === "Backspace" && !config.allowBackspace) {
        onBackspaceBlocked?.();
      }

      if (event.code === "Space") {
        const skipped = engine.advanceToWordBoundary();
        if (skipped) {
          for (let i = skipped.from; i < skipped.to; i++) applyCharResult(i, "incorrect");
        }
      }

      const result = engine.handleKeyDown(event);
      if (result.changedIndex !== null && result.newState) {
        applyCharResult(result.changedIndex, result.newState);
      }
      moveCaret(result.caretIndex);
      updateActiveWord();

      if (result.finished) {
        setFinished(true);
        setMetrics(engine.getMetrics());
        onFinish?.(engine);
      }
      return result;
    },
    [engine, config.allowBackspace, applyCharResult, moveCaret, updateActiveWord, onFinish, onBackspaceBlocked]
  );

  useEffect(() => {
    if (!active || finished) return;
    moveCaret(engine.getCaretIndex());
    updateActiveWord();
    const id = setInterval(() => {
      setMetrics(engine.getMetrics());
    }, 200);
    return () => clearInterval(id);
  }, [engine, active, finished, moveCaret, updateActiveWord]);

  return {
    engine,
    metrics,
    finished,
    wordBoundaries,
    registerChar,
    registerWord,
    handleKeyDown,
  };
}
