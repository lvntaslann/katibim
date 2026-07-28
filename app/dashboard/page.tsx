"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { getRepository } from "@/lib/repository";
import { toFingerLoad, toKeyStatRows, topProblemKeys, generateWeaknessDrill } from "@/lib/analytics";
import { DEFAULT_MIN_NET_WORDS_PER_MIN } from "@/lib/institution-resolve";
import dynamic from "next/dynamic";
import { KeyboardHeatmap } from "@/components/analytics/KeyboardHeatmap";
import { ProblemKeyTable } from "@/components/analytics/ProblemKeyTable";
import { SubstitutionTable } from "@/components/analytics/SubstitutionTable";
import { CyberPulse3D } from "@/components/ui/CyberPulse3D";
import { KineticCounter } from "@/components/ui/KineticCounter";
import { GlassCard } from "@/components/ui/GlassCard";
import type { KeyboardLayout, KeyStat, Session, SubstitutionStat } from "@/types";

const ProgressChart = dynamic(() => import("@/components/analytics/ProgressChart").then((m) => m.ProgressChart), {
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-surface/40 border border-ink/5" />,
  ssr: false,
});

const FingerLoadChart = dynamic(() => import("@/components/analytics/FingerLoadChart").then((m) => m.FingerLoadChart), {
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-surface/40 border border-ink/5" />,
  ssr: false,
});

const DRILL_STORAGE_KEY = "katibim:drillText";

function computeStreak(sessions: Session[]): number {
  const days = new Set(sessions.map((s) => new Date(s.startedAt).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function DashboardPage() {
  const router = useRouter();
  const [layout, setLayout] = useLayout("F");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [keyStats, setKeyStats] = useState<KeyStat[]>([]);
  const [substitutionStats, setSubstitutionStats] = useState<SubstitutionStat[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const repo = getRepository();
    Promise.all([repo.listSessions(), repo.listKeyStats(layout), repo.listSubstitutionStats(layout)]).then(
      ([s, k, sub]) => {
        setSessions(s);
        setKeyStats(k);
        setSubstitutionStats(sub);
        setLoaded(true);
      }
    );
  }, [layout]);

  const keyStatRows = useMemo(() => toKeyStatRows(keyStats, layout), [keyStats, layout]);

  const totalPracticeMin = Math.round(sessions.reduce((sum, s) => sum + s.durationSec, 0) / 60);
  const bestNetWpm = sessions.length > 0 ? Math.max(...sessions.map((s) => s.netWpm)) : 0;
  const avgAccuracy =
    sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length : 0;
  const streak = computeStreak(sessions);
  const completedLessons = new Set(
    sessions.filter((s) => s.mode === "ders" && s.passed).map((s) => s.lessonId)
  ).size;
  const recentSessions = sessions.slice(-5);
  const recentAvgNetWpm =
    recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + s.netWpm, 0) / recentSessions.length
      : 0;
  const examReadiness = Math.min(100, Math.round((recentAvgNetWpm / DEFAULT_MIN_NET_WORDS_PER_MIN) * 100));

  function practiceWeakKeys() {
    const drill = generateWeaknessDrill(keyStats, layout);
    sessionStorage.setItem(DRILL_STORAGE_KEY, JSON.stringify(drill));
    router.push("/antrenman?drill=1");
  }

  const summaryStats = [
    { label: "En iyi NKS", num: Math.round(bestNetWpm), prefix: "", suffix: "", dec: 0 },
    { label: "Ortalama doğruluk", num: avgAccuracy, prefix: "%", suffix: "", dec: 1 },
    { label: "Günlük seri", num: streak, prefix: "", suffix: " gün", dec: 0 },
    { label: "Toplam pratik", num: totalPracticeMin, prefix: "", suffix: " dk", dec: 0 },
    { label: "Tamamlanan ders", num: completedLessons, prefix: "", suffix: "", dec: 0 },
    { label: "Sınav hazırlığı", num: examReadiness, prefix: "%", suffix: "", dec: 0 },
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-hairline/80 bg-surface/40 p-6 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#1c1b19]/40">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Performans Paneli</h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Yapay Zeka Destekli Tuş Hızı, Parmak Yükü ve Hata Katsayısı Analizi
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold text-accent dark:bg-accent/20 dark:text-accent-strong">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Canlı İstatistik Akışı
          </div>
        </div>
        <div className="mt-4">
          <CyberPulse3D speed={bestNetWpm || 60} heightClassName="h-36" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {summaryStats.map((s) => (
          <GlassCard
            key={s.label}
            glowOnHover={true}
            className="flex flex-col items-center justify-center gap-1.5 !p-4 text-center"
          >
            <KineticCounter
              value={s.num}
              decimals={s.dec}
              prefix={s.prefix}
              suffix={s.suffix}
              className="text-xl font-bold text-neutral-900 dark:text-neutral-100"
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {s.label}
            </span>
          </GlassCard>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700">
          {(["F", "Q"] as KeyboardLayout[]).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-4 py-1.5 text-sm font-medium transition ${
                layout === l
                  ? "bg-accent text-base"
                  : "bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              {l} Klavye
            </button>
          ))}
        </div>
        <button
          onClick={practiceWeakKeys}
          disabled={!loaded || keyStatRows.length === 0}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-base shadow hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          Zayıf tuşlarımla pratik yap
        </button>
      </div>

      <ProgressChart sessions={sessions} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FingerLoadChart data={toFingerLoad(keyStatRows)} />
        <SubstitutionTable stats={substitutionStats} />
        <div className="lg:col-span-2">
          <KeyboardHeatmap keyStats={keyStats} layout={layout} />
        </div>
        <div className="lg:col-span-2">
          <ProblemKeyTable rows={topProblemKeys(keyStatRows)} />
        </div>
      </div>
    </main>
  );
}
