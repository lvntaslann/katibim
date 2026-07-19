"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TypingSession } from "@/components/typing/TypingSession";
import { PRACTICE_TEXTS } from "@/data/practice-texts";
import type { KeyboardLayout, PracticeText, Session } from "@/types";

const DEFAULT_PENALTY_PER_ERROR = 2;
const DRILL_STORAGE_KEY = "katibim:drillText";

function AntrenmanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [layout, setLayout] = useState<KeyboardLayout>("F");
  const [textId, setTextId] = useState(PRACTICE_TEXTS[0].id);
  const [drillText, setDrillText] = useState<PracticeText | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

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

  const text = drillText ?? PRACTICE_TEXTS.find((t) => t.id === textId) ?? PRACTICE_TEXTS[0];

  function handleComplete(session: Session) {
    router.push(`/sonuc/${session.id}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Antrenman</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          {drillText
            ? "Zayıf tuşlarınıza özel oluşturulan alıştırma."
            : "Serbest pratik yapın; süre sınırı yok, geri silme açık."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700">
          {(["F", "Q"] as KeyboardLayout[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLayout(l);
                setSessionKey((k) => k + 1);
              }}
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

        {!drillText && (
          <select
            value={textId}
            onChange={(e) => {
              setTextId(e.target.value);
              setSessionKey((k) => k + 1);
            }}
            className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {PRACTICE_TEXTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.category})
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => {
            setDrillText(null);
            setSessionKey((k) => k + 1);
          }}
          className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Yeniden başlat
        </button>
      </div>

      <TypingSession
        key={sessionKey}
        mode="antrenman"
        layout={layout}
        text={text}
        config={{ allowBackspace: true, stopOnError: false, penaltyPerError: DEFAULT_PENALTY_PER_ERROR }}
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
