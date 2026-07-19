import type { KeyboardLayout, KeyEvent, SessionMode } from "@/types";
import { computeScoring } from "@/lib/scoring";

export type CharState = "pending" | "correct" | "incorrect";

export interface EngineConfig {
  allowBackspace: boolean;
  stopOnError: boolean;
  penaltyPerError: number;
  /** Optional hard time limit; engine marks itself finished when reached. */
  durationSec?: number;
}

export interface KeyDownResult {
  /** Character index whose visual state changed, if any. */
  changedIndex: number | null;
  newState: CharState | null;
  /** Index the caret moved to after processing this key. */
  caretIndex: number;
  finished: boolean;
  /** True if this keydown should call event.preventDefault(). */
  shouldPreventDefault: boolean;
}

export interface EngineMetrics {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  elapsedSec: number;
  errorCount: number;
  keystrokeCount: number;
  caretIndex: number;
  textLength: number;
}

const IGNORED_CODES = new Set([
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
  "CapsLock",
  "Escape",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
]);

/**
 * Framework-agnostic typing session core. Holds all hot-path state in plain
 * fields (no React) so a keydown can be processed in well under 16ms with
 * zero re-renders; the owning hook applies `KeyDownResult` to the DOM
 * imperatively and only surfaces low-frequency metrics snapshots.
 */
export class TypingEngine {
  readonly text: string;
  readonly layout: KeyboardLayout;
  private config: EngineConfig;

  private caretIndex = 0;
  private correctChars = 0;
  private incorrectChars = 0;
  private errorCount = 0;
  private keystrokeCount = 0;
  private startTime: number | null = null;
  private lastKeyTime: number | null = null;
  private finished = false;
  private keyEvents: KeyEvent[] = [];
  private charStates: CharState[];

  constructor(text: string, layout: KeyboardLayout, config: EngineConfig) {
    this.text = text;
    this.layout = layout;
    this.config = config;
    this.charStates = new Array(text.length).fill("pending");
  }

  getCharStates(): readonly CharState[] {
    return this.charStates;
  }

  isFinished(): boolean {
    return this.finished;
  }

  getCaretIndex(): number {
    return this.caretIndex;
  }

  /** Processes one physical keydown. Returns what the DOM layer should update. */
  handleKeyDown(event: {
    code: string;
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
  }): KeyDownResult {
    const noop: KeyDownResult = {
      changedIndex: null,
      newState: null,
      caretIndex: this.caretIndex,
      finished: this.finished,
      shouldPreventDefault: false,
    };

    if (this.finished) return noop;
    if (event.ctrlKey || event.metaKey || event.altKey) return noop;
    if (IGNORED_CODES.has(event.code)) return noop;

    const now = performance.now();
    if (this.startTime === null) this.startTime = now;

    if (event.code === "Backspace") {
      if (!this.config.allowBackspace || this.caretIndex === 0) {
        return { ...noop, shouldPreventDefault: true };
      }
      this.caretIndex -= 1;
      const prevState = this.charStates[this.caretIndex];
      if (prevState === "correct") this.correctChars -= 1;
      if (prevState === "incorrect") this.incorrectChars -= 1;
      this.charStates[this.caretIndex] = "pending";
      this.lastKeyTime = now;
      return {
        changedIndex: this.caretIndex,
        newState: "pending",
        caretIndex: this.caretIndex,
        finished: false,
        shouldPreventDefault: true,
      };
    }

    if (event.code === "Tab") {
      return { ...noop, shouldPreventDefault: true };
    }

    // Only single printable characters advance the session.
    if (event.key.length !== 1) return noop;
    if (this.caretIndex >= this.text.length) return noop;

    const expectedChar = this.text[this.caretIndex];
    const typedChar = event.key;
    const correct = typedChar === expectedChar;
    const latencyMs = this.lastKeyTime === null ? 0 : now - this.lastKeyTime;
    this.lastKeyTime = now;
    this.keystrokeCount += 1;

    this.keyEvents.push({
      t: now - this.startTime,
      code: event.code,
      expectedChar,
      typedChar,
      correct,
      latencyMs,
      charIndex: this.caretIndex,
    });

    if (this.config.stopOnError && !correct) {
      // Flash red but do not advance; caller re-flashes on the same index.
      return {
        changedIndex: this.caretIndex,
        newState: "incorrect",
        caretIndex: this.caretIndex,
        finished: false,
        shouldPreventDefault: true,
      };
    }

    if (correct) {
      this.correctChars += 1;
    } else {
      this.incorrectChars += 1;
      this.errorCount += 1;
    }
    const changedIndex = this.caretIndex;
    this.charStates[changedIndex] = correct ? "correct" : "incorrect";
    this.caretIndex += 1;

    if (this.caretIndex >= this.text.length) {
      this.finished = true;
    }

    return {
      changedIndex,
      newState: this.charStates[changedIndex],
      caretIndex: this.caretIndex,
      finished: this.finished,
      shouldPreventDefault: true,
    };
  }

  /**
   * Word-focus mode only: called when Space is pressed but the caret hasn't
   * reached the passage's next space yet (the typed word was shorter than
   * the target word). Marks the remaining characters of the current word as
   * missed, using the exact same fields a wrong keystroke would touch
   * (charStates/incorrectChars/errorCount) — no second error model. Does not
   * touch the space character itself, and does not count as a keystroke
   * since no physical key was pressed for the skipped positions; call
   * handleKeyDown for the actual Space press separately.
   * Returns the [from, to) index range that changed, or null if the caret
   * was already at a word boundary, so the caller can update those DOM spans.
   */
  advanceToWordBoundary(): { from: number; to: number } | null {
    if (this.finished) return null;
    if (this.caretIndex >= this.text.length || this.text[this.caretIndex] === " ") return null;

    const now = performance.now();
    if (this.startTime === null) this.startTime = now;

    const from = this.caretIndex;
    while (this.caretIndex < this.text.length && this.text[this.caretIndex] !== " ") {
      this.charStates[this.caretIndex] = "incorrect";
      this.incorrectChars += 1;
      this.errorCount += 1;
      this.caretIndex += 1;
    }
    const to = this.caretIndex;

    if (this.caretIndex >= this.text.length) this.finished = true;
    return { from, to };
  }

  /** Call from a low-frequency timer (rAF/interval), never per-keystroke. */
  getMetrics(): EngineMetrics {
    const elapsedMs = this.startTime === null ? 0 : performance.now() - this.startTime;
    const { grossWpm, netWpm, accuracy } = computeScoring({
      correctChars: this.correctChars,
      incorrectChars: this.incorrectChars,
      errorCount: this.errorCount,
      elapsedMs,
      penaltyPerError: this.config.penaltyPerError,
    });
    return {
      grossWpm,
      netWpm,
      accuracy,
      elapsedSec: elapsedMs / 1000,
      errorCount: this.errorCount,
      keystrokeCount: this.keystrokeCount,
      caretIndex: this.caretIndex,
      textLength: this.text.length,
    };
  }

  /** Force-finish, e.g. when an exam's timer runs out. */
  finish(): void {
    this.finished = true;
  }

  buildSession(mode: SessionMode, textId: string, institutionId?: string, lessonId?: string) {
    const metrics = this.getMetrics();
    return {
      mode,
      layout: this.layout,
      institutionId,
      lessonId,
      textId,
      startedAt: new Date(Date.now() - metrics.elapsedSec * 1000).toISOString(),
      durationSec: metrics.elapsedSec,
      grossWpm: metrics.grossWpm,
      netWpm: metrics.netWpm,
      accuracy: metrics.accuracy,
      errorCount: metrics.errorCount,
      keystrokeCount: metrics.keystrokeCount,
      keyEvents: this.keyEvents,
    };
  }
}
