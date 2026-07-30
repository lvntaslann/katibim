"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getRepository } from "@/lib/repository";
import { deriveKeyStats, deriveSubstitutionStats } from "@/lib/typing-engine";
import { toFingerLoad, toKeyStatRows, topProblemKeys, computeSpeedSeries } from "@/lib/analytics";
import dynamic from "next/dynamic";
import { KeyboardHeatmap } from "@/components/analytics/KeyboardHeatmap";
import { ProblemKeyTable } from "@/components/analytics/ProblemKeyTable";
import { SubstitutionTable } from "@/components/analytics/SubstitutionTable";
import { ResultsReveal } from "@/components/analytics/ResultsReveal";
import { AnonymousOptIn } from "@/components/leaderboard/AnonymousOptIn";
import { useAuth } from "@/components/layout/AuthProvider";
import { submitResult } from "@/lib/leaderboard/submit-result";
import { dismissAnonPrompt, getAnonymousName, setAnonymousName, wasAnonPromptDismissed } from "@/lib/anonymous-identity";
import { trackEvent } from "@/lib/tracking/track";
import type { LeaderboardMode, TestResultInput } from "@/types/leaderboard";
import type { Session } from "@/types";

const LEADERBOARD_MODES: LeaderboardMode[] = ["exam", "practice", "speed-test"];
const PROMPTABLE_MODES: LeaderboardMode[] = ["exam", "speed-test"];

function toResultInput(session: Session): TestResultInput {
  return {
    mode: session.mode as LeaderboardMode,
    layout: session.layout,
    netWpm: session.netWpm,
    grossWpm: session.grossWpm,
    accuracy: session.accuracy,
    durationSec: session.durationSec,
    institutionId: session.institutionId,
    passed: session.passed,
    clientSessionId: session.id,
  };
}

const FingerLoadChart = dynamic(() => import("@/components/analytics/FingerLoadChart").then((m) => m.FingerLoadChart), {
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-surface/40 border border-ink/5" />,
  ssr: false,
});

const SpeedChart = dynamic(() => import("@/components/analytics/SpeedChart").then((m) => m.SpeedChart), {
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-surface/40 border border-ink/5" />,
  ssr: false,
});

export default function ResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [leaderboardState, setLeaderboardState] = useState<"idle" | "prompt" | "submitted">("idle");

  useEffect(() => {
    getRepository()
      .getSession(sessionId)
      .then((s) => setSession(s ?? null));
  }, [sessionId]);

  useEffect(() => {
    if (!session) return;
    if (!LEADERBOARD_MODES.includes(session.mode as LeaderboardMode)) return;

    if (user || getAnonymousName()) {
      void submitResult(toResultInput(session), user?.id ?? null);
      setLeaderboardState("submitted");
      return;
    }

    if (PROMPTABLE_MODES.includes(session.mode as LeaderboardMode) && !wasAnonPromptDismissed()) {
      setLeaderboardState("prompt");
    }
    // Only re-run when the loaded session or auth state actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, user]);

  useEffect(() => {
    if (!session) return;
    if (session.mode === "exam") {
      trackEvent("exam_complete", {
        layout: session.layout,
        netWpm: Math.round(session.netWpm),
        passed: session.passed ?? null,
      });
    } else if (session.mode === "lesson") {
      trackEvent("lesson_complete", { layout: session.layout, lessonId: session.lessonId ?? null });
    }
    // Fires once per loaded session, regardless of leaderboard eligibility.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const keyStats = useMemo(
    () => (session ? deriveKeyStats(session.keyEvents, session.layout) : []),
    [session]
  );
  const substitutionStats = useMemo(
    () => (session ? deriveSubstitutionStats(session.keyEvents, session.layout) : []),
    [session]
  );
  const keyStatRows = useMemo(
    () => (session ? toKeyStatRows(keyStats, session.layout) : []),
    [keyStats, session]
  );
  const speedSeries = useMemo(() => (session ? computeSpeedSeries(session.keyEvents) : []), [session]);

  if (session === undefined) {
    return <main className="p-12 text-center text-neutral-500">Yükleniyor...</main>;
  }

  if (session === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="text-neutral-500">Bu sonuç bulunamadı.</p>
        <Link href="/practice" className="text-accent hover:underline">
          Antrenmana dön
        </Link>
      </main>
    );
  }

  const stats = [
    { label: "NKS (net kelime/dk)", value: Math.round(session.netWpm) },
    { label: "Brüt hız", value: Math.round(session.grossWpm) },
    { label: "Doğruluk", value: `%${session.accuracy.toFixed(1)}` },
    { label: "Hata sayısı", value: session.errorCount },
    { label: "Tuş vuruşu", value: session.keystrokeCount },
    { label: "Süre (sn)", value: Math.round(session.durationSec) },
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center gap-8 px-4 py-16">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Sonuç</h1>
      <ResultsReveal revealKey={session.id}>
        {session.mode === "exam" && session.passed !== undefined && (
          <span
            data-reveal
            className={`mb-4 inline-block rounded-full px-5 py-1.5 text-sm font-semibold ${
              session.passed
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
            }`}
          >
            {session.passed ? "BAŞARILI" : "BAŞARISIZ"}
          </span>
        )}
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              data-reveal
              className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 bg-white/70 p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <span className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                {s.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </ResultsReveal>

      {leaderboardState === "prompt" && (
        <AnonymousOptIn
          onSubmit={(name) => {
            setAnonymousName(name);
            void submitResult(toResultInput(session), null);
            setLeaderboardState("submitted");
          }}
          onSkip={() => {
            dismissAnonPrompt();
            setLeaderboardState("idle");
          }}
        />
      )}

      {leaderboardState === "submitted" && PROMPTABLE_MODES.includes(session.mode as LeaderboardMode) && (
        <p className="text-sm text-ink-muted">
          Liderlik tablosuna gönderildi.{" "}
          <Link href="/leaderboard" className="text-accent underline decoration-hairline underline-offset-4">
            Tabloyu gör
          </Link>
        </p>
      )}

      <div className="flex gap-3">
        <Link
          href="/practice"
          className="rounded-full bg-accent px-6 py-2 font-medium text-base hover:bg-accent-strong"
        >
          Tekrar dene
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-neutral-300 px-6 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Panele git
        </Link>
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-2">
        <SpeedChart data={speedSeries} />
        <FingerLoadChart data={toFingerLoad(keyStatRows)} />
        <div className="lg:col-span-2">
          <KeyboardHeatmap keyStats={keyStats} layout={session.layout} />
        </div>
        <ProblemKeyTable rows={topProblemKeys(keyStatRows)} />
        <SubstitutionTable stats={substitutionStats} />
      </div>
    </main>
  );
}
