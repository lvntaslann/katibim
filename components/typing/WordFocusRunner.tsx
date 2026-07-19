"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWordFocusEngine, type WordBoundary } from "@/hooks/useWordFocusEngine";
import { persistSession, type EngineConfig, type EngineMetrics, type TypingEngine } from "@/lib/typing-engine";
import type { KeyboardLayout, PracticeText, Session, SessionMode } from "@/types";
import { KeyboardOverlay } from "./KeyboardOverlay";
import { MetricsBar } from "./MetricsBar";

const CHAR_CLASS =
  "font-mono text-2xl text-ink-muted transition-colors duration-75 data-[caret=true]:border-b-2 data-[caret=true]:border-accent data-[state=correct]:text-ink data-[state=incorrect]:font-semibold data-[state=incorrect]:text-danger data-[state=incorrect]:underline data-[state=incorrect]:decoration-2 data-[state=incorrect]:underline-offset-4";

interface WordFocusRunnerProps {
  mode: SessionMode;
  layout: KeyboardLayout;
  text: PracticeText;
  config: EngineConfig;
  institutionId?: string;
  lessonId?: string;
  requireStart?: boolean;
  onlyActiveWordMode?: boolean;
  overlayEnabled?: boolean;
  visibleLines?: number;
  onComplete: (session: Session) => void;
  /** Low-frequency passthrough (~5Hz) so a page-level control bar can show its own prominent timer. */
  onMetricsChange?: (metrics: EngineMetrics | null) => void;
}

const LINE_HEIGHT_PX = 56;

type Segment =
  | { type: "word"; wordIndex: number; start: number; end: number }
  | { type: "space"; charIndex: number };

function buildSegments(text: string, wordBoundaries: WordBoundary[]): Segment[] {
  const segments: Segment[] = [];
  let wi = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      segments.push({ type: "space", charIndex: i });
      continue;
    }
    while (wi < wordBoundaries.length && wordBoundaries[wi].end <= i) wi += 1;
    const w = wordBoundaries[wi];
    if (w && i === w.start) {
      segments.push({ type: "word", wordIndex: wi, start: w.start, end: w.end });
    }
  }
  return segments;
}

export function WordFocusRunner({
  mode,
  layout,
  text,
  config,
  institutionId,
  lessonId,
  requireStart = false,
  onlyActiveWordMode = false,
  overlayEnabled = true,
  visibleLines = 3,
  onComplete,
  onMetricsChange,
}: WordFocusRunnerProps) {
  const [started, setStarted] = useState(!requireStart);
  const [preCountdown, setPreCountdown] = useState<number | null>(null);
  const completedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const handleFinish = useCallback(
    async (engine: TypingEngine) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const session = await persistSession(engine, mode, text.id, layout, institutionId, lessonId);
      onComplete(session);
    },
    [mode, text.id, layout, institutionId, lessonId, onComplete]
  );

  const onActiveWordChange = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const wordEl = scrollEl.querySelector<HTMLElement>('[data-active="true"]');
    if (!wordEl) return;
    const line = Math.round(wordEl.offsetTop / LINE_HEIGHT_PX);
    const centerLine = Math.floor(visibleLines / 2);
    const targetY = -(line - centerLine) * LINE_HEIGHT_PX;
    scrollEl.style.transform = `translateY(${Math.min(0, targetY)}px)`;
  }, [visibleLines]);

  const onBackspaceBlocked = useCallback(() => {
    const el = inputRef.current?.parentElement;
    if (!el) return;
    el.classList.remove("signal-blocked");
    // Force reflow so the animation can restart if triggered twice quickly.
    void el.offsetWidth;
    el.classList.add("signal-blocked");
  }, []);

  const { engine, metrics, finished, wordBoundaries, registerChar, registerWord, handleKeyDown } =
    useWordFocusEngine({
      text: text.body,
      layout,
      config,
      active: started,
      onFinish: handleFinish,
      onActiveWordChange,
      onBackspaceBlocked,
    });

  const segments = useMemo(() => buildSegments(text.body, wordBoundaries), [text.body, wordBoundaries]);

  useEffect(() => {
    if (started) inputRef.current?.focus();
  }, [started]);

  useEffect(() => {
    onMetricsChange?.(metrics);
  }, [metrics, onMetricsChange]);

  function beginCountdown() {
    setPreCountdown(3);
    const id = setInterval(() => {
      setPreCountdown((v) => {
        if (v === null) return null;
        if (v <= 1) {
          clearInterval(id);
          setStarted(true);
          return null;
        }
        return v - 1;
      });
    }, 800);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const result = handleKeyDown({
      code: e.code,
      key: e.key,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      altKey: e.altKey,
    });
    if (result.shouldPreventDefault) e.preventDefault();
  }

  const remainingSec = config.durationSec ? config.durationSec - (metrics?.elapsedSec ?? 0) : undefined;

  // Hard duration cutoff for timed modes.
  useEffect(() => {
    if (!started || !config.durationSec || finished) return;
    const id = setInterval(() => {
      const m = engine.getMetrics();
      if (m.elapsedSec >= config.durationSec!) {
        engine.finish();
        handleFinish(engine);
      }
    }, 200);
    return () => clearInterval(id);
  }, [started, finished, config.durationSec, engine, handleFinish]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        ref={viewportRef}
        onClick={() => inputRef.current?.focus()}
        className={`word-focus-panel relative w-full cursor-text overflow-hidden bg-surface ${
          onlyActiveWordMode ? "only-active-word" : ""
        }`}
        style={{ height: visibleLines * LINE_HEIGHT_PX }}
      >
        {!started && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-base">
            {preCountdown ? (
              <span className="font-mono text-6xl tabular-figures text-accent">{preCountdown}</span>
            ) : (
              <button
                type="button"
                onClick={requireStart ? beginCountdown : () => setStarted(true)}
                className="border border-accent px-8 py-3 text-lg font-medium text-accent transition-colors hover:bg-accent hover:text-base"
              >
                Başla
              </button>
            )}
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex flex-wrap content-start gap-x-1 px-6 py-2 transition-transform duration-150 ease-out"
          style={{ lineHeight: `${LINE_HEIGHT_PX}px` }}
        >
          {segments.map((seg) =>
            seg.type === "word" ? (
              <span
                key={`w-${seg.wordIndex}`}
                ref={registerWord(seg.wordIndex)}
                data-active="false"
                className="word-focus-word px-0.5"
              >
                {Array.from({ length: seg.end - seg.start }, (_, k) => {
                  const ci = seg.start + k;
                  return (
                    <span key={ci} ref={registerChar(ci)} data-state="pending" className={CHAR_CLASS}>
                      {text.body[ci]}
                    </span>
                  );
                })}
              </span>
            ) : (
              <span key={`s-${seg.charIndex}`} ref={registerChar(seg.charIndex)} data-state="pending" className={CHAR_CLASS}>
                &nbsp;
              </span>
            )
          )}
        </div>

        <input
          ref={inputRef}
          value=""
          onChange={() => {}}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Yazma alanı"
          disabled={!started || finished}
          className="absolute h-0 w-0 opacity-0"
        />
      </div>

      <MetricsBar metrics={metrics} remainingSec={remainingSec} />

      {overlayEnabled && <KeyboardOverlay engine={engine} layout={layout} active={started && !finished} />}
    </div>
  );
}
