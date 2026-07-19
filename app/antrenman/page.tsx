"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TypingSession } from "@/components/typing/TypingSession";
import { PRACTICE_TEXTS, buildExamText } from "@/data/practice-texts";
import { getRepository } from "@/lib/repository";
import type { EngineMetrics } from "@/lib/typing-engine";
import type { KeyboardLayout, PracticeText, Session } from "@/types";

const DEFAULT_PENALTY_PER_ERROR = 2;
const DRILL_STORAGE_KEY = "katibim:drillText";

const DURATIONS = [
  { label: "Serbest", value: undefined },
  { label: "30 sn", value: 30 },
  { label: "60 sn", value: 60 },
  { label: "120 sn", value: 120 },
] as const;

const TEXT_GROUPS: { label: string; category: PracticeText["category"] }[] = [
  { label: "Genel Metin", category: "genel" },
  { label: "Hukuki Metin", category: "hukuki" },
  { label: "Resmî Yazışma", category: "resmi" },
];

function formatCountdown(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AntrenmanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [layout, setLayout] = useState<KeyboardLayout>("F");
  const [textId, setTextId] = useState(PRACTICE_TEXTS[0].id);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [drillText, setDrillText] = useState<PracticeText | null>(null);
  const [onlyActiveWordMode, setOnlyActiveWordMode] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [metrics, setMetrics] = useState<EngineMetrics | null>(null);

  useEffect(() => {
    getRepository()
      .getSettings()
      .then((s) => setOnlyActiveWordMode(s.onlyActiveWordMode));
  }, []);

  // One-time read of a handoff value from another page (sessionStorage),
  // not state derived from props — this is the documented external-system
  // sync case, not a self-triggered render cascade.
  useEffect(() => {
    if (searchParams.get("drill") !== "1") return;
    const raw = sessionStorage.getItem(DRILL_STORAGE_KEY);
    if (raw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDrillText(JSON.parse(raw) as PracticeText);
      sessionStorage.removeItem(DRILL_STORAGE_KEY);
    }
  }, [searchParams]);

  const text = useMemo(() => {
    if (drillText) return drillText;
    const base = PRACTICE_TEXTS.find((t) => t.id === textId) ?? PRACTICE_TEXTS[0];
    // A fixed duration needs enough words to not run out before time's up.
    return duration ? buildExamText(`antrenman-${base.id}-${duration}`, base.category) : base;
  }, [drillText, textId, duration]);

  // Stable identity: TypingSession remounts (key={sessionKey}) whenever a
  // control here actually changes the session, so this only needs to be
  // referentially stable across the unrelated re-renders in between (e.g.
  // the metrics tick below) — see the contract documented in
  // hooks/useWordFocusEngine.ts.
  const config = useMemo(
    () => ({
      allowBackspace: true,
      stopOnError: false,
      penaltyPerError: DEFAULT_PENALTY_PER_ERROR,
      durationSec: duration,
    }),
    [duration]
  );

  async function toggleOnlyActiveWord() {
    const next = !onlyActiveWordMode;
    setOnlyActiveWordMode(next);
    const repo = getRepository();
    const settings = await repo.getSettings();
    await repo.saveSettings({ ...settings, onlyActiveWordMode: next });
  }

  function restart() {
    setDrillText(null);
    setMetrics(null);
    setSessionKey((k) => k + 1);
  }

  const handleMetricsChange = useCallback((m: EngineMetrics | null) => setMetrics(m), []);

  function handleComplete(session: Session) {
    router.push(`/sonuc/${session.id}`);
  }

  const remainingSec = duration !== undefined ? duration - (metrics?.elapsedSec ?? 0) : undefined;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-14">
      <div className="flex flex-col gap-2 text-left">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Pratik Modülü</span>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Antrenman</h1>
        <p className="max-w-xl text-sm text-ink-muted">
          {drillText
            ? "Zayıf tuşlarınıza özel oluşturulan alıştırma."
            : "Aktif kelimeye odaklanın; boşluk tuşu bir sonraki kelimeye geçer."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-hairline pb-6">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Klavye</span>
          <div className="flex gap-4">
            {(["F", "Q"] as KeyboardLayout[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLayout(l);
                  restart();
                }}
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

        {!drillText && (
          <label className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Metin</span>
            <select
              value={textId}
              onChange={(e) => {
                setTextId(e.target.value);
                restart();
              }}
              className="border-b border-hairline bg-transparent py-1 text-sm text-ink focus:border-accent"
            >
              {TEXT_GROUPS.map((group) => (
                <optgroup key={group.category} label={group.label}>
                  {PRACTICE_TEXTS.filter((t) => t.category === group.category).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        )}

        <label className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Süre</span>
          <div className="flex gap-3">
            {DURATIONS.map((d) => (
              <button
                key={d.label}
                onClick={() => {
                  setDuration(d.value);
                  restart();
                }}
                className={`border-b-2 pb-0.5 text-sm transition-colors ${
                  duration === d.value
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-muted hover:border-hairline hover:text-ink"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </label>

        <button
          onClick={toggleOnlyActiveWord}
          aria-pressed={onlyActiveWordMode}
          className={`text-sm underline decoration-hairline underline-offset-4 ${
            onlyActiveWordMode ? "text-accent decoration-accent" : "text-ink-muted hover:text-ink"
          }`}
        >
          Sadece aktif kelime
        </button>

        <button onClick={restart} className="text-sm text-ink-muted underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-accent">
          Yeniden başlat
        </button>

        <span className="ml-auto font-mono text-2xl tabular-figures text-ink">
          {remainingSec !== undefined ? formatCountdown(Math.max(0, remainingSec)) : formatCountdown(metrics?.elapsedSec ?? 0)}
        </span>
      </div>

      <TypingSession
        key={sessionKey}
        mode="antrenman"
        layout={layout}
        text={text}
        wordFocusMode
        onlyActiveWordMode={onlyActiveWordMode}
        config={config}
        onMetricsChange={handleMetricsChange}
        onComplete={handleComplete}
      />
    </main>
  );
}

export default function AntrenmanPage() {
  return (
    <Suspense fallback={null}>
      <AntrenmanContent />
    </Suspense>
  );
}
