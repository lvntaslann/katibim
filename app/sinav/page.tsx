"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TypingSession } from "@/components/typing/TypingSession";
import { INSTITUTIONS } from "@/data/institutions";
import { buildExamText } from "@/data/practice-texts";
import { useLayout } from "@/hooks/useLayout";
import { resolveInstitutionExamConfig } from "@/lib/institution-resolve";
import { getRepository } from "@/lib/repository";
import type { KeyboardLayout, Session } from "@/types";

export default function SinavPage() {
  const router = useRouter();
  const [institutionId, setInstitutionId] = useState(INSTITUTIONS[0].id);
  const [layout, setLayout] = useLayout("F");
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
    <main
      className={`mx-auto flex flex-col gap-8 px-6 py-14 ${examStarted ? "max-w-7xl" : "max-w-5xl"}`}
    >
      <div className="flex flex-col gap-2 text-left">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">Sınav Modülü</span>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Sınav Simülasyonu</h1>
        <p className="max-w-xl text-sm text-ink-muted">
          Kuruma özgü süre ve puanlama kuralları ile gerçek sınav ortamını deneyimleyin.
        </p>
      </div>

      {!examStarted ? (
        <div className="flex w-full max-w-xl flex-col gap-6">
          <label className="flex items-center gap-4">
            <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-muted">Kurum</span>
            <select
              value={institutionId}
              onChange={(e) => {
                setInstitutionId(e.target.value);
                const inst = INSTITUTIONS.find((i) => i.id === e.target.value);
                if (inst && inst.acceptedLayouts !== "both") setLayout(inst.acceptedLayouts);
              }}
              className="flex-1 border-b border-hairline bg-transparent py-1 text-sm text-ink focus:border-accent dark:bg-transparent"
            >
              {INSTITUTIONS.map((i) => (
                <option key={i.id} value={i.id} className="bg-base text-ink font-normal dark:bg-[#141413] dark:text-[#edeae3]">
                  {i.name} — {i.roleTitle}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-4">
            <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-muted">Klavye</span>
            <div className="flex gap-4">
              {availableLayouts.map((l) => (
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

          <div className="border-l-2 border-hairline py-1 pl-4 text-sm">
            <p className="font-medium text-ink">{institution.disclaimer}</p>
            <p className="mt-1 text-ink-muted">{institution.sourceNote}</p>
            {examConfig.usedDefaults.length > 0 && (
              <p className="mt-2 text-xs text-ink-muted">
                Şu değerler için genel varsayılan kullanılıyor: {examConfig.usedDefaults.join(", ")}.
              </p>
            )}
          </div>

          <div className="flex divide-x divide-hairline border-y border-hairline text-center">
            <div className="flex flex-1 flex-col gap-1 px-4 py-3">
              <span className="font-mono text-2xl tabular-figures text-ink">{examConfig.durationSec}s</span>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">Süre</span>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-4 py-3">
              <span className="font-mono text-2xl tabular-figures text-ink">{examConfig.minNetWordsPerMin}</span>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
                Asgari NKS
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-4 py-3">
              <span className="font-mono text-2xl tabular-figures text-ink">
                {examConfig.allowBackspace ? "Var" : "Yok"}
              </span>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
                Geri silme
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExamStarted(true)}
            className="self-start border border-accent px-8 py-3 text-lg font-medium text-accent transition-colors hover:bg-accent hover:text-base"
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
