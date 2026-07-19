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
    <div className="flex flex-col gap-1 px-5 py-3 first:pl-0">
      <span className="font-mono text-3xl tabular-figures text-ink">{value}</span>
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">{label}</span>
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
    <div className="flex flex-wrap divide-x divide-hairline border-y border-hairline">
      <Stat label="NKS · net kelime/dk" value={String(netWpm)} />
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
