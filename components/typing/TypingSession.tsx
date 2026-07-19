"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { deriveKeyStats, deriveSubstitutionStats, type EngineConfig, type TypingEngine } from "@/lib/typing-engine";
import { getRepository } from "@/lib/repository";
import type { KeyboardLayout, PracticeText, Session, SessionMode } from "@/types";
import { TextDisplay } from "./TextDisplay";
import { MetricsBar } from "./MetricsBar";
import { KeyboardOverlay } from "./KeyboardOverlay";

interface TypingSessionProps {
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

export function TypingSession({
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
}: TypingSessionProps) {
  const [started, setStarted] = useState(!requireStart);
  const [preCountdown, setPreCountdown] = useState<number | null>(null);
  const completedRef = useRef(false);

  const handleFinish = useCallback(
    async (engine: TypingEngine) => {
      if (completedRef.current) return;
      completedRef.current = true;
      const built = engine.buildSession(mode, text.id, institutionId, lessonId);
      const session: Session = { id: uuid(), ...built };

      const repo = getRepository();
      await repo.addSession(session);
      await repo.upsertKeyStats(deriveKeyStats(session.keyEvents, layout));
      await repo.upsertSubstitutionStats(deriveSubstitutionStats(session.keyEvents, layout));

      onComplete(session);
    },
    [mode, text.id, institutionId, lessonId, layout, onComplete]
  );

  const { engine, metrics, finished, registerSpan } = useTypingEngine({
    text: text.body,
    layout,
    config,
    active: started,
    onFinish: handleFinish,
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

  const remainingSec = config.durationSec
    ? config.durationSec - (metrics?.elapsedSec ?? 0)
    : undefined;

  return (
    <div className="flex flex-col items-center gap-6">
      <MetricsBar metrics={metrics} remainingSec={remainingSec} />

      <div className="relative w-full max-w-4xl rounded-3xl border border-neutral-200 bg-white/70 p-8 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
        {!started && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/90 dark:bg-neutral-950/90">
            {preCountdown ? (
              <span className="text-6xl font-bold tabular-nums text-blue-600">{preCountdown}</span>
            ) : (
              <button
                type="button"
                onClick={requireStart ? beginCountdown : () => setStarted(true)}
                className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                Başla
              </button>
            )}
          </div>
        )}
        <TextDisplay text={text.body} registerSpan={registerSpan} blindMode={blindMode} />
      </div>

      {overlayEnabled && (
        <KeyboardOverlay engine={engine} layout={layout} active={started && !finished} />
      )}
    </div>
  );
}
