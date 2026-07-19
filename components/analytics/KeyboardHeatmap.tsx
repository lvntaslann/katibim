"use client";

import { useMemo, useState } from "react";
import { KEYBOARD_GEOMETRY, getLayoutMap } from "@/lib/keyboard-layouts";
import type { KeyStat, KeyboardLayout } from "@/types";

interface KeyboardHeatmapProps {
  keyStats: KeyStat[];
  layout: KeyboardLayout;
}

const KEY_UNIT_REM = 2.5;

function intensityColor(ratio: number, hue: number): string {
  // ratio 0..1 -> low alpha to high alpha of the given hue.
  const alpha = 0.08 + ratio * 0.72;
  return `hsl(${hue} 85% 55% / ${alpha})`;
}

export function KeyboardHeatmap({ keyStats, layout }: KeyboardHeatmapProps) {
  const [mode, setMode] = useState<"press" | "error">("press");
  const layoutMap = getLayoutMap(layout);

  const byCode = useMemo(() => {
    const m = new Map<string, KeyStat>();
    for (const s of keyStats) m.set(s.keyCode, s);
    return m;
  }, [keyStats]);

  const maxPress = Math.max(1, ...keyStats.map((s) => s.pressCount));
  const rows = useMemo(() => {
    const byRow = new Map<number, typeof KEYBOARD_GEOMETRY>();
    for (const k of KEYBOARD_GEOMETRY) {
      const arr = byRow.get(k.row) ?? [];
      arr.push(k);
      byRow.set(k.row, arr);
    }
    return Array.from(byRow.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, keys]) => keys);
  }, []);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/70 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Tuş Isı Haritası</h3>
        <div className="flex overflow-hidden rounded-full border border-neutral-300 text-xs dark:border-neutral-700">
          {(["press", "error"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 font-medium transition ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              {m === "press" ? "Basış sıklığı" : "Hata oranı"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((k) => {
              const chars = layoutMap[k.code];
              if (!chars) {
                return <div key={k.code} style={{ width: `${k.width * KEY_UNIT_REM}rem` }} />;
              }
              const stat = byCode.get(k.code);
              const ratio =
                mode === "press"
                  ? stat
                    ? stat.pressCount / maxPress
                    : 0
                  : stat && stat.pressCount > 0
                    ? stat.errorCount / stat.pressCount
                    : 0;
              return (
                <div
                  key={k.code}
                  style={{
                    width: `${k.width * KEY_UNIT_REM}rem`,
                    backgroundColor: intensityColor(ratio, mode === "press" ? 210 : 0),
                  }}
                  title={stat ? `${chars.base}: ${stat.pressCount} basış, ${stat.errorCount} hata` : chars.base}
                  className="flex h-9 items-center justify-center rounded-md border border-neutral-300/50 text-xs font-medium text-neutral-700 dark:border-neutral-600/50 dark:text-neutral-200"
                >
                  {chars.base}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
