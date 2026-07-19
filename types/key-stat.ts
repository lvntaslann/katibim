import type { KeyboardLayout } from "./institution";

/**
 * Aggregated statistics for one physical key within one layout, accumulated
 * across all sessions. Keyed by (layout, keyCode) in the repository.
 */
export interface KeyStat {
  layout: KeyboardLayout;
  keyCode: string;
  pressCount: number;
  errorCount: number;
  totalLatencyMs: number;
  lastUpdated: string;
}

export interface SubstitutionStat {
  layout: KeyboardLayout;
  /** Character that should have been typed. */
  expectedChar: string;
  /** Character that was typed instead. */
  typedChar: string;
  count: number;
}
