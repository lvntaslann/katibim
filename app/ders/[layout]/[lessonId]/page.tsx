"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TypingSession } from "@/components/typing/TypingSession";
import { getLessonById } from "@/data/lessons";
import { getRepository } from "@/lib/repository";
import type { KeyboardLayout, PracticeText, Session } from "@/types";

const STEP_KIND_LABELS: Record<string, string> = {
  "harf-cifti": "Harf Çiftleri",
  hece: "Heceler",
  kelime: "Kelimeler",
  cumle: "Cümle",
  paragraf: "Paragraf",
};

export default function DersRunnerPage({
  params,
}: {
  params: Promise<{ layout: KeyboardLayout; lessonId: string }>;
}) {
  const { layout, lessonId } = use(params);
  const router = useRouter();
  const lesson = getLessonById(lessonId);

  const [stepIndex, setStepIndex] = useState(0);
  const [lastResult, setLastResult] = useState<{ passed: boolean; accuracy: number } | null>(null);
  const [attemptKey, setAttemptKey] = useState(0);

  if (!lesson) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="text-neutral-500">Ders bulunamadı.</p>
        <Link href="/ders" className="text-blue-600 hover:underline">
          Derslere dön
        </Link>
      </main>
    );
  }

  const step = lesson.steps[stepIndex];
  const stepText: PracticeText = {
    id: step.id,
    category: "genel",
    difficulty: "baslangic",
    title: `${lesson.title} — ${STEP_KIND_LABELS[step.kind] ?? step.kind}`,
    body: step.prompt,
  };

  async function handleComplete(session: Session) {
    const passed = session.accuracy >= step.minAccuracy;
    await getRepository().addSession({ ...session, passed });
    setLastResult({ passed, accuracy: session.accuracy });
  }

  function retry() {
    setLastResult(null);
    setAttemptKey((k) => k + 1);
  }

  function next() {
    if (!lesson) return;
    setLastResult(null);
    if (stepIndex + 1 < lesson.steps.length) {
      setStepIndex((i) => i + 1);
    } else {
      router.push("/ders");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center gap-6 px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Seviye {lesson.level}: {lesson.title}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Adım {stepIndex + 1} / {lesson.steps.length} — {STEP_KIND_LABELS[step.kind] ?? step.kind} (asgari
          doğruluk %{step.minAccuracy})
        </p>
      </div>

      {lastResult ? (
        <div
          className={`flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl border p-8 text-center ${
            lastResult.passed
              ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
              : "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
          }`}
        >
          <p className="text-xl font-semibold">
            {lastResult.passed ? "Bu adımı geçtiniz!" : "Asgari doğruluğa ulaşamadınız"}
          </p>
          <p className="text-neutral-600 dark:text-neutral-300">Doğruluk: %{lastResult.accuracy.toFixed(1)}</p>
          <div className="flex gap-3">
            <button
              onClick={retry}
              className="rounded-full border border-neutral-300 px-5 py-2 font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Tekrar dene
            </button>
            {lastResult.passed && (
              <button
                onClick={next}
                className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
              >
                {stepIndex + 1 < lesson.steps.length ? "Sonraki adım" : "Dersi tamamla"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <TypingSession
          key={`${step.id}-${attemptKey}`}
          mode="ders"
          layout={layout}
          text={stepText}
          lessonId={lesson.id}
          config={{ allowBackspace: true, stopOnError: false, penaltyPerError: 0 }}
          onComplete={handleComplete}
        />
      )}
    </main>
  );
}
