import type { KeyboardLayout } from "./institution";

export type SessionMode = "antrenman" | "sinav" | "ders" | "gorev";

/**
 * One recorded keystroke, captured for replay and per-key analytics.
 * `code` is the physical key (event.code); `expectedChar`/`typedChar` are
 * the characters being compared (layout-independent target text vs. what
 * the OS/layout actually produced).
 */
export interface KeyEvent {
  /** Milliseconds since session start. */
  t: number;
  code: string;
  expectedChar: string;
  typedChar: string;
  correct: boolean;
  /** Milliseconds since the previous keystroke (dwell/latency proxy). */
  latencyMs: number;
  charIndex: number;
}

export interface Session {
  id: string;
  mode: SessionMode;
  layout: KeyboardLayout;
  institutionId?: string;
  lessonId?: string;
  textId: string;
  startedAt: string;
  durationSec: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  errorCount: number;
  keystrokeCount: number;
  keyEvents: KeyEvent[];
  /** Whether the session met the pass threshold (exam mode / lesson mode). */
  passed?: boolean;
}
