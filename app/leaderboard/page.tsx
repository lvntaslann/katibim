"use client";

import { useEffect, useState } from "react";
import { CustomSelect, type SelectOption } from "@/components/ui/CustomSelect";
import { getLeaderboard } from "@/lib/leaderboard/queries";
import { withTimeout } from "@/lib/with-timeout";
import type { KeyboardLayout } from "@/types";
import type { LeaderboardMode, LeaderboardRow } from "@/types/leaderboard";

type LoadState = "loading" | "error" | "ready";

const MODE_OPTIONS: SelectOption[] = [
  { value: "speed-test", label: "10 Parmak Hız Testi" },
  { value: "exam", label: "Sınav Simülasyonu" },
  { value: "practice", label: "Antrenman" },
  { value: "lesson", label: "Ders" },
];

const MODE_NOTES: Record<LeaderboardMode, string> = {
  "speed-test": "Herkese aynı sabit metin ve süre — en adil karşılaştırma.",
  exam: "Kurumdan kuruma süre ve puanlama kuralları farklı olabilir — gayri resmi sıralama.",
  practice: "Serbest pratik sonuçları — metin ve süre kişiden kişiye değişir, gayri resmi sıralama.",
  lesson: "Kısa ders adımları — en yüksek NKS'li adım gösterilir, gayri resmi sıralama.",
};

export default function LeaderboardPage() {
  const [mode, setMode] = useState<LeaderboardMode>("speed-test");
  const [layout, setLayout] = useState<KeyboardLayout>("F");
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    withTimeout(getLeaderboard(mode, layout)).then((data) => {
      if (cancelled) return;
      if (data === null) {
        setStatus("error");
        return;
      }
      setRows(data);
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [mode, layout, retryToken]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-14">
      <div className="flex flex-col gap-2 text-left">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Topluluk</span>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Liderlik Tablosu</h1>
        <p className="max-w-xl text-sm text-ink-muted">{MODE_NOTES[mode]}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-hairline pb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Mod</span>
          <CustomSelect value={mode} onChange={(v) => setMode(v as LeaderboardMode)} options={MODE_OPTIONS} />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Klavye</span>
          <div className="flex gap-4">
            {(["F", "Q"] as KeyboardLayout[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayout(l)}
                className={`border-b-2 pb-0.5 text-sm transition-colors ${
                  layout === l
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-muted hover:border-hairline hover:text-ink"
                }`}
              >
                {l} Klavye
              </button>
            ))}
          </div>
        </div>
      </div>

      {status === "loading" ? (
        <p className="text-sm text-ink-muted">Yükleniyor...</p>
      ) : status === "error" ? (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold text-danger">
            Bağlantı kurulamadı. İnternet bağlantını kontrol edip tekrar dene.
          </p>
          <button
            type="button"
            onClick={() => setRetryToken((k) => k + 1)}
            className="text-sm text-accent underline decoration-hairline underline-offset-4 hover:text-accent-strong"
          >
            Tekrar dene
          </button>
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-ink-muted">Bu mod ve klavye için henüz sonuç yok. İlk sen ol.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-hairline border-y border-hairline">
          {rows.map((row, index) => (
            <li key={row.identityKey} className="flex items-center gap-4 py-3">
              <span
                className={`w-8 shrink-0 text-center font-mono text-sm font-bold tabular-figures ${
                  index < 3 ? "text-accent" : "text-ink-muted"
                }`}
              >
                {index + 1}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline/80 bg-accent/15 font-mono text-xs font-bold text-accent dark:border-white/10 dark:bg-accent/20 dark:text-accent-strong">
                {row.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external OAuth-provided avatar URL, not a local asset.
                  <img src={row.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  row.displayName.trim().charAt(0).toUpperCase() || "?"
                )}
              </span>
              <span className="flex-1 truncate text-sm font-medium text-ink">{row.displayName}</span>
              <span className="font-mono text-sm tabular-figures text-ink-muted">%{row.accuracy.toFixed(1)}</span>
              <span className="w-16 shrink-0 text-right font-mono text-base font-semibold tabular-figures text-ink">
                {Math.round(row.netWpm)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
