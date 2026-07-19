"use client";

import type { EngineMetrics } from "@/lib/typing-engine";

interface MetricsBarProps {
  metrics: EngineMetrics | null;
  /** Countdown remaining seconds for timed modes; omit for untimed antrenman. */
  remainingSec?: number;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-white/60 px-4 py-3 shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-white/5 dark:ring-white/10">
      <span className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{value}</span>
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
    </div>
  );
}

export function MetricsBar({ metrics, remainingSec }: MetricsBarProps) {
  const netWpm = metrics ? Math.round(metrics.netWpm) : 0;
  const grossWpm = metrics ? Math.round(metrics.grossWpm) : 0;
  const accuracy = metrics ? metrics.accuracy.toFixed(1) : "100.0";
  const errorCount = metrics?.errorCount ?? 0;
  const timeLabel =
    remainingSec !== undefined ? formatTime(Math.max(0, remainingSec)) : formatTime(metrics?.elapsedSec ?? 0);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Stat label="NKS (net kelime/dk)" value={String(netWpm)} />
      <Stat label="Brüt hız" value={String(grossWpm)} />
      <Stat label="Doğruluk" value={`%${accuracy}`} />
      <Stat label="Hata" value={String(errorCount)} />
      <Stat label={remainingSec !== undefined ? "Kalan süre" : "Geçen süre"} value={timeLabel} />
      <p className="sr-only" role="status" aria-live="polite">
        {`Net hız ${netWpm} kelime dakika, doğruluk yüzde ${accuracy}, hata sayısı ${errorCount}.`}
      </p>
    </div>
  );
}
