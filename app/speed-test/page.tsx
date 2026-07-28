"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TypingSession } from "@/components/typing/TypingSession";
import { buildExamText } from "@/data/practice-texts";
import { useLayout } from "@/hooks/useLayout";
import type { KeyboardLayout, Session } from "@/types";

/**
 * Fixed and versioned: every visitor gets the same text/duration, which is
 * what makes net WPM comparable across the leaderboard. Bump the corpus id
 * (not the params below) if the text ever needs to change.
 */
const SPEED_TEST_CONFIG = {
  allowBackspace: true,
  stopOnError: false,
  penaltyPerError: 2,
  durationSec: 60,
};

const SPEED_TEST_TEXT = buildExamText("hiz-testi-corpus-v1", "genel");

export default function SpeedTestPage() {
  const router = useRouter();
  const [layout, setLayout] = useLayout("F");
  const [started, setStarted] = useState(false);

  function handleComplete(session: Session) {
    router.push(`/results/${session.id}`);
  }

  return (
    <main className={`mx-auto flex flex-col gap-8 px-6 py-14 ${started ? "max-w-7xl" : "max-w-5xl"}`}>
      <div className="flex flex-col gap-2 text-left">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Hız Testi</span>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">10 Parmak Klavye Hız Testi</h1>
        <p className="max-w-xl text-sm text-ink-muted">
          Herkese aynı sabit metin ve süre — sonucun liderlik tablosunda karşılaştırılabilir olması için.
        </p>
      </div>

      {!started ? (
        <div className="flex w-full max-w-xl flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-muted">Klavye</span>
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

          <div className="flex divide-x divide-hairline border-y border-hairline text-center">
            <div className="flex flex-1 flex-col gap-1 px-4 py-3">
              <span className="font-mono text-2xl tabular-figures text-ink">{SPEED_TEST_CONFIG.durationSec}s</span>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">Süre</span>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-4 py-3">
              <span className="font-mono text-2xl tabular-figures text-ink">Sabit</span>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">Metin</span>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-4 py-3">
              <span className="font-mono text-2xl tabular-figures text-ink">Var</span>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
                Geri silme
              </span>
            </div>
          </div>

          <p className="text-xs text-ink-muted">
            Sonucun liderlik tablosuna gönderilmesini istersen, testin sonunda bir isim belirleyebilirsin — hesap
            açman şart değil.
          </p>

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="self-start border border-accent px-8 py-3 text-lg font-medium text-accent transition-colors hover:bg-accent hover:text-base"
          >
            Teste Başla
          </button>
        </div>
      ) : (
        <TypingSession
          key="speed-test"
          mode="speed-test"
          layout={layout}
          text={SPEED_TEST_TEXT}
          requireStart
          config={SPEED_TEST_CONFIG}
          onComplete={handleComplete}
        />
      )}
    </main>
  );
}
