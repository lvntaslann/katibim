import type { Finger } from "@/lib/keyboard-layouts";
import { FINGER_MAP, getLayoutMap } from "@/lib/keyboard-layouts";
import type { KeyStat, KeyboardLayout } from "@/types";

export interface KeyStatRow {
  keyCode: string;
  label: string;
  pressCount: number;
  errorCount: number;
  errorRate: number;
  avgLatencyMs: number;
  finger?: Finger;
}

export function toKeyStatRows(keyStats: KeyStat[], layout: KeyboardLayout): KeyStatRow[] {
  const layoutMap = getLayoutMap(layout);
  return keyStats
    .filter((s) => layoutMap[s.keyCode] && s.pressCount > 0)
    .map((s) => ({
      keyCode: s.keyCode,
      label: layoutMap[s.keyCode].base,
      pressCount: s.pressCount,
      errorCount: s.errorCount,
      errorRate: (s.errorCount / s.pressCount) * 100,
      avgLatencyMs: s.totalLatencyMs / s.pressCount,
      finger: FINGER_MAP[s.keyCode],
    }));
}

export function topProblemKeys(rows: KeyStatRow[], limit = 10): KeyStatRow[] {
  return [...rows]
    .filter((r) => r.errorCount > 0)
    .sort((a, b) => b.errorRate - a.errorRate || b.errorCount - a.errorCount)
    .slice(0, limit);
}

export interface FingerLoad {
  finger: Finger;
  pressCount: number;
  errorCount: number;
}

export function toFingerLoad(rows: KeyStatRow[]): FingerLoad[] {
  const byFinger = new Map<Finger, FingerLoad>();
  for (const r of rows) {
    if (!r.finger) continue;
    const entry = byFinger.get(r.finger) ?? { finger: r.finger, pressCount: 0, errorCount: 0 };
    entry.pressCount += r.pressCount;
    entry.errorCount += r.errorCount;
    byFinger.set(r.finger, entry);
  }
  return Array.from(byFinger.values());
}
