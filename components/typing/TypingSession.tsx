"use client";

import type { EngineConfig, EngineMetrics } from "@/lib/typing-engine";
import type { KeyboardLayout, PracticeText, Session, SessionMode } from "@/types";
import { ClassicRunner } from "./ClassicRunner";
import { WordFocusRunner } from "./WordFocusRunner";

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
  /**
   * Antrenman/Ders always render word-focus; Sınav Simülasyonu defaults to
   * false to stay faithful to real exam conditions (continuous text) but
   * may enable it from its own controls.
   */
  wordFocusMode?: boolean;
  onlyActiveWordMode?: boolean;
  /** Word-focus only — low-frequency passthrough for a page-level control bar timer. */
  onMetricsChange?: (metrics: EngineMetrics | null) => void;
}

/**
 * Picks the paragraph runner or the word-focus runner. Both share the same
 * TypingEngine core and session-completion path (lib/typing-engine/persist-session.ts) —
 * this component only decides which presentation to render.
 */
export function TypingSession({ wordFocusMode = false, onlyActiveWordMode = false, ...props }: TypingSessionProps) {
  if (wordFocusMode) {
    return <WordFocusRunner {...props} onlyActiveWordMode={onlyActiveWordMode} />;
  }
  return <ClassicRunner {...props} />;
}
