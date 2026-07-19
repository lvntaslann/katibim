"use client";

/**
 * This hook intentionally mutates DOM-element refs imperatively outside
 * React's render cycle (keydown handlers, low-frequency effects) to keep
 * per-keystroke work off the render path — see the file docblock below.
 * The react-hooks/immutability rule flags that pattern broadly (it's tuned
 * for React Compiler's auto-memoization assumptions, which this file does
 * not opt into), so it's disabled for this file rather than peppered with
 * per-line suppressions.
 */
/* eslint-disable react-hooks/immutability */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
 */
export function useTypingEngine({ text, layout, config, active, onFinish, onKeyDown }: UseTypingEngineOptions) {
  const engineRef = useRef<TypingEngine | null>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const caretElRef = useRef<HTMLSpanElement | null>(null);
  const [metrics, setMetrics] = useState<EngineMetrics | null>(null);
  const [finished, setFinished] = useState(false);

  const engine = useMemo(() => new TypingEngine(text, layout, config), [text, layout, config]);

  // Syncs local refs/state to the (possibly new) engine instance. This is
  // the documented "adjust state from a prop/value change" effect pattern,
  // not a self-triggered cascade: it only runs when `engine` itself changes.
  useEffect(() => {
    spanRefs.current = new Array(text.length).fill(null);
    caretElRef.current = null;
    engineRef.current = engine;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initializing from a new engine instance, not a self-cascade
    setFinished(false);
    setMetrics(engine.getMetrics());
  }, [engine, text.length]);

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
      const eng = engineRef.current;
      if (!eng || eng.isFinished()) return;

      const result = eng.handleKeyDown({
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
        setMetrics(eng.getMetrics());
        onFinish?.(eng);
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [active, moveCaret, onFinish, onKeyDown]);

  useEffect(() => {
    if (!active || finished) return;
    moveCaret(engineRef.current?.getCaretIndex() ?? 0);
    const id = setInterval(() => {
      setMetrics(engineRef.current?.getMetrics() ?? null);
    }, 200);
    return () => clearInterval(id);
  }, [active, finished, moveCaret]);

  const reset = useCallback(() => {
    const e = new TypingEngine(text, layout, config);
    engineRef.current = e;
    for (const el of spanRefs.current) {
      if (el) {
        delete el.dataset.state;
        delete el.dataset.caret;
      }
    }
    caretElRef.current = null;
    setFinished(false);
    setMetrics(e.getMetrics());
  }, [text, layout, config]);

  return { engine, metrics, finished, registerSpan, reset };
}
