"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLessonsForLayout } from "@/data/lessons";
import { getRepository } from "@/lib/repository";
import type { KeyboardLayout, Session } from "@/types";

export default function DersPage() {
  const [layout, setLayout] = useState<KeyboardLayout>("F");
  const [sessions, setSessions] = useState<Session[]>([]);
  const lessons = useMemo(() => getLessonsForLayout(layout), [layout]);

  useEffect(() => {
    getRepository()
      .listSessions()
      .then(setSessions);
  }, []);

  const passedStepIds = new Set(sessions.filter((s) => s.mode === "ders" && s.passed).map((s) => s.textId));
  const passedLessonIds = new Set(
    lessons.filter((lesson) => lesson.steps.every((st) => passedStepIds.has(st.id))).map((l) => l.id)
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Ders Sistemi</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Esas sıradan başlayıp adım adım tüm klavyeyi öğrenin.
        </p>
      </div>

      <div className="flex overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700">
        {(["F", "Q"] as KeyboardLayout[]).map((l) => (
          <button
            key={l}
            onClick={() => setLayout(l)}
            className={`px-5 py-1.5 text-sm font-medium transition ${
              layout === l
                ? "bg-blue-600 text-white"
                : "bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            {l} Klavye
          </button>
        ))}
      </div>

      <ol className="flex w-full flex-col gap-3">
        {lessons.map((lesson, i) => {
          const passed = passedLessonIds.has(lesson.id);
          const prevPassed = i === 0 || passedLessonIds.has(lessons[i - 1].id);
          const locked = !prevPassed && !passed;
          return (
            <li key={lesson.id}>
              <Link
                href={locked ? "#" : `/ders/${layout}/${lesson.id}`}
                aria-disabled={locked}
                className={`flex items-center justify-between rounded-2xl border p-5 transition ${
                  locked
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/40"
                    : "border-neutral-200 bg-white/70 hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
                }`}
              >
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Seviye {lesson.level}: {lesson.title}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">{lesson.description}</div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    passed
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : locked
                        ? "bg-neutral-200 text-neutral-500 dark:bg-neutral-800"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                  }`}
                >
                  {passed ? "Tamamlandı" : locked ? "Kilitli" : "Başla"}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
