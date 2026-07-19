"use client";

/**
 * This hook intentionally mutates DOM-element refs imperatively outside
 * React's render cycle (keydown handlers, low-frequency effects) to keep
 * per-keystroke work off the render path — see the file docblock below. It
 * also uses the React-documented lazy-ref-init-during-render idiom
 * (https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents,
 * `if (ref.current === null) { ref.current = ... }`) to size the span-ref
 * array once per mount without an extra effect. Both react-hooks/immutability
 * and react-hooks/refs are tuned for React Compiler's auto-memoization
 * assumptions, which this file does not opt into, so they're disabled here
 * rather than peppered with per-line suppressions.
 */
/* eslint-disable react-hooks/immutability, react-hooks/refs */

import { useCallback, useEffect, useRef, useState } from "react";
import { TypingEngine, type EngineConfig, type EngineMetrics, type KeyDownResult } from "@/lib/typing-engine";
import type { KeyboardLayout } from "@/types";

export interface UseTypingEngineOptions {
  text: string;
  layout: KeyboardLayout;
  config: EngineConfig;
  /** Only listens for keystrokes while true (e.g. session started & not finished). */
  active: boolean;
  onFinish?: (engine: TypingEngine) => void;
  onKeyDown?: (result: KeyDownResult) => void;
}

/**
 * Wires a TypingEngine to the DOM: keystrokes mutate character spans and the
 * caret marker directly via refs (no React state on the hot path). Metrics
 * are surfaced through a low-frequency (200ms) state tick, kept separate
 * from the per-keystroke DOM updates so live WPM/accuracy never forces a
 * full text re-render.
 *
 * The engine is constructed exactly once per mount (`useState` initializer,
 * not `useMemo`) and never rebuilt afterwards — `text`/`layout`/`config` are
 * only read at that first construction. Callers that need a fresh session
 * must remount by changing the `key` on the owning component (see e.g.
 * app/sinav/page.tsx's `key={institution.id}`) rather than relying on prop
 * changes to reset state. This is deliberate: an EngineConfig object literal
 * recreated on every parent render must never be able to trigger engine
 * reconstruction, or a setState-in-effect keyed on the engine's identity
 * turns into an infinite render loop (recreate engine -> reset effect ->
 * setState -> re-render -> new config object -> recreate engine -> ...).
 */
export function useTypingEngine({ text, layout, config, active, onFinish, onKeyDown }: UseTypingEngineOptions) {
  const [engine] = useState(() => new TypingEngine(text, layout, config));

  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  if (spanRefs.current.length !== text.length) {
    spanRefs.current = new Array(text.length).fill(null);
  }

  const caretElRef = useRef<HTMLSpanElement | null>(null);
  const [metrics, setMetrics] = useState<EngineMetrics | null>(() => engine.getMetrics());
  const [finished, setFinished] = useState(false);

  const registerSpan = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      spanRefs.current[index] = el;
    },
    []
  );

  const moveCaret = useCallback((index: number) => {
    if (caretElRef.current) delete caretElRef.current.dataset.caret;
    const el = spanRefs.current[index] ?? null;
    if (el) el.dataset.caret = "true";
    caretElRef.current = el;
  }, []);

  useEffect(() => {
    if (!active) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (engine.isFinished()) return;

      const result = engine.handleKeyDown({
        code: e.code,
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
      });

      if (result.shouldPreventDefault) e.preventDefault();

      if (result.changedIndex !== null) {
        const el = spanRefs.current[result.changedIndex];
        if (el && result.newState) el.dataset.state = result.newState;
      }
      moveCaret(result.caretIndex);

      onKeyDown?.(result);

      if (result.finished) {
        setFinished(true);
        setMetrics(engine.getMetrics());
        onFinish?.(engine);
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [engine, active, moveCaret, onFinish, onKeyDown]);

  useEffect(() => {
    if (!active || finished) return;
    moveCaret(engine.getCaretIndex());
    const id = setInterval(() => {
      setMetrics(engine.getMetrics());
    }, 200);
    return () => clearInterval(id);
  }, [engine, active, finished, moveCaret]);

  return { engine, metrics, finished, registerSpan };
}
