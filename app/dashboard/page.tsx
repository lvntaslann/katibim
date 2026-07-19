"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getRepository } from "@/lib/repository";
import { toFingerLoad, toKeyStatRows, topProblemKeys, generateWeaknessDrill } from "@/lib/analytics";
import { DEFAULT_MIN_NET_WORDS_PER_MIN } from "@/lib/institution-resolve";
import { ProgressChart } from "@/components/analytics/ProgressChart";
import { KeyboardHeatmap } from "@/components/analytics/KeyboardHeatmap";
import { ProblemKeyTable } from "@/components/analytics/ProblemKeyTable";
import { FingerLoadChart } from "@/components/analytics/FingerLoadChart";
import { SubstitutionTable } from "@/components/analytics/SubstitutionTable";
import type { KeyboardLayout, KeyStat, Session, SubstitutionStat } from "@/types";

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
  const [layout, setLayout] = useState<KeyboardLayout>("F");
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
    { label: "En iyi NKS", value: Math.round(bestNetWpm) },
    { label: "Ortalama doğruluk", value: `%${avgAccuracy.toFixed(1)}` },
    { label: "Günlük seri", value: `${streak} gün` },
    { label: "Toplam pratik", value: `${totalPracticeMin} dk` },
    { label: "Tamamlanan ders", value: completedLessons },
    { label: "Sınav hazırlığı", value: `%${examReadiness}` },
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Panel</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">İlerlemenizi ve zayıf noktalarınızı takip edin.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {summaryStats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 bg-white/70 p-4 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <span className="text-xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
              {s.value}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {s.label}
            </span>
          </div>
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
                  ? "bg-blue-600 text-white"
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
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-40"
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
