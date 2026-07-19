"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TypingSession } from "@/components/typing/TypingSession";
import { INSTITUTIONS } from "@/data/institutions";
import { buildExamText } from "@/data/practice-texts";
import { resolveInstitutionExamConfig } from "@/lib/institution-resolve";
import { getRepository } from "@/lib/repository";
import type { KeyboardLayout, Session } from "@/types";

export default function SinavPage() {
  const router = useRouter();
  const [institutionId, setInstitutionId] = useState(INSTITUTIONS[0].id);
  const [layout, setLayout] = useState<KeyboardLayout>("F");
  const [examStarted, setExamStarted] = useState(false);

  const institution = INSTITUTIONS.find((i) => i.id === institutionId) ?? INSTITUTIONS[0];
  const examConfig = useMemo(() => resolveInstitutionExamConfig(institution), [institution]);
  const examText = useMemo(
    () => buildExamText(`sinav-${institution.id}`, institution.textDelivery === "dikte" ? "hukuki" : "resmi"),
    [institution]
  );

  const availableLayouts: KeyboardLayout[] =
    institution.acceptedLayouts === "both" ? ["F", "Q"] : [institution.acceptedLayouts];

  async function handleComplete(session: Session) {
    const passed = session.netWpm >= examConfig.minNetWordsPerMin;
    await getRepository().addSession({ ...session, passed });
    router.push(`/sonuc/${session.id}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Sınav Simülasyonu</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Kuruma özgü süre ve puanlama kuralları ile gerçek sınav ortamını deneyimleyin.
        </p>
      </div>

      {!examStarted ? (
        <div className="flex w-full max-w-xl flex-col gap-5">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Kurum
            <select
              value={institutionId}
              onChange={(e) => {
                setInstitutionId(e.target.value);
                const inst = INSTITUTIONS.find((i) => i.id === e.target.value);
                if (inst && inst.acceptedLayouts !== "both") setLayout(inst.acceptedLayouts);
              }}
              className="rounded-xl border border-neutral-300 bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              {INSTITUTIONS.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} — {i.roleTitle}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Klavye Düzeni
            <div className="flex overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700">
              {availableLayouts.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLayout(l)}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                    layout === l
                      ? "bg-blue-600 text-white"
                      : "bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`}
                >
                  {l} Klavye
                </button>
              ))}
            </div>
          </label>

          <div className="rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <p className="font-semibold">{institution.disclaimer}</p>
            <p className="mt-1 text-amber-800/90 dark:text-amber-200/80">{institution.sourceNote}</p>
            {examConfig.usedDefaults.length > 0 && (
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                Şu değerler için genel varsayılan kullanılıyor: {examConfig.usedDefaults.join(", ")}.
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800">
              <div className="text-lg font-semibold">{examConfig.durationSec}s</div>
              <div className="text-neutral-500 dark:text-neutral-400">Süre</div>
            </div>
            <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800">
              <div className="text-lg font-semibold">{examConfig.minNetWordsPerMin}</div>
              <div className="text-neutral-500 dark:text-neutral-400">Asgari NKS</div>
            </div>
            <div className="rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800">
              <div className="text-lg font-semibold">{examConfig.allowBackspace ? "Var" : "Yok"}</div>
              <div className="text-neutral-500 dark:text-neutral-400">Geri silme</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExamStarted(true)}
            className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            Sınava Hazırım
          </button>
        </div>
      ) : (
        <TypingSession
          key={institution.id}
          mode="sinav"
          layout={layout}
          text={examText}
          institutionId={institution.id}
          requireStart
          config={{
            allowBackspace: examConfig.allowBackspace,
            stopOnError: false,
            penaltyPerError: examConfig.penaltyPerError,
            durationSec: examConfig.durationSec,
          }}
          onComplete={handleComplete}
        />
      )}
    </main>
  );
}
