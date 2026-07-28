"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { persistSession, type EngineConfig, type TypingEngine } from "@/lib/typing-engine";
import type { KeyboardLayout, PracticeText, Session, SessionMode } from "@/types";
import { TextDisplay } from "./TextDisplay";
import { MetricsBar } from "./MetricsBar";
import { KeyboardOverlay } from "./KeyboardOverlay";

interface ClassicRunnerProps {
  mode: SessionMode;
  layout: KeyboardLayout;
  text: PracticeText;
  config: EngineConfig;
  institutionId?: string;
  lessonId?: string;
  /** Show a "Başla" button + 3-2-1 countdown before input is accepted. */
  requireStart?: boolean;
  blindMode?: boolean;
  overlayEnabled?: boolean;
  onComplete: (session: Session) => void;
}

/**
 * Continuous-paragraph runner (word-focus off): types directly into the
 * passage via a window-level keydown listener. Used by Sınav Simülasyonu
 * (faithful to real exam conditions) and anywhere word-focus is disabled.
 */

const WINDOW_HEIGHT_PX = 320;

export function ClassicRunner({
  mode,
  layout,
  text,
  config,
  institutionId,
  lessonId,
  requireStart = false,
  blindMode = false,
  overlayEnabled = true,
  onComplete,
}: ClassicRunnerProps) {
  const [started, setStarted] = useState(!requireStart);
  const [preCountdown, setPreCountdown] = useState<number | null>(null);
  const completedRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Sınav Simülasyonu and the 10-parmak hız testi show text and keyboard
  // side by side (text left, keyboard right) and reveal the passage through
  // a fixed-height scrolling window that follows the caret (like karaoke
  // lyrics) instead of the full, ever-growing paragraph — both use the same
  // long, duplicated buildExamText() corpus, which is unreadable rendered in
  // full. Other modes (antrenman/ders use shorter, purpose-picked texts)
  // keep the plain stacked paragraph.
  const windowed = mode === "exam" || mode === "speed-test";

  const handleFinish = useCallback(
    async (engine: TypingEngine) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const session = await persistSession(engine, mode, text.id, layout, institutionId, lessonId);
      onComplete(session);
    },
    [mode, text.id, layout, institutionId, lessonId, onComplete]
  );

  const onCaretMove = useCallback(
    (el: HTMLSpanElement | null) => {
      if (!windowed || !el) return;
      const viewportEl = viewportRef.current;
      const scrollEl = scrollRef.current;
      if (!viewportEl || !scrollEl) return;
      const target = -(el.offsetTop - viewportEl.clientHeight / 2 + el.offsetHeight / 2);
      scrollEl.style.transform = `translateY(${Math.min(0, target)}px)`;
    },
    [windowed]
  );

  const { engine, metrics, finished, registerSpan } = useTypingEngine({
    text: text.body,
    layout,
    config,
    active: started,
    onFinish: handleFinish,
    onCaretMove,
  });

  // Hard duration cutoff for timed modes (sınav simülasyonu).
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

  const remainingSec = config.durationSec ? config.durationSec - (metrics?.elapsedSec ?? 0) : undefined;

  return (
    <div className="flex w-full flex-col gap-6">
      <MetricsBar metrics={metrics} remainingSec={remainingSec} />

      <div className={windowed ? "flex flex-col gap-6 xl:flex-row xl:items-start" : "flex flex-col gap-6"}>
        <div
          ref={viewportRef}
          className={`relative min-w-0 flex-1 bg-surface ${windowed ? "overflow-hidden" : "p-8"}`}
          style={windowed ? { height: WINDOW_HEIGHT_PX } : undefined}
        >
          {!started && (
            <div className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-base">
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
          {windowed ? (
            <div ref={scrollRef} className="px-8 py-8 transition-transform duration-150 ease-out">
              <TextDisplay text={text.body} registerSpan={registerSpan} blindMode={blindMode} />
            </div>
          ) : (
            <TextDisplay text={text.body} registerSpan={registerSpan} blindMode={blindMode} />
          )}
        </div>

        {overlayEnabled && (
          <div className={windowed ? "shrink-0 overflow-x-auto xl:sticky xl:top-24" : undefined}>
            <KeyboardOverlay engine={engine} layout={layout} active={started && !finished} />
          </div>
        )}
      </div>
    </div>
  );
}
