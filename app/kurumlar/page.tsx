"use client";

import { useMemo, useState } from "react";
import { INSTITUTIONS } from "@/data/institutions";
import type { InstitutionCategory } from "@/types";

const CATEGORY_LABELS: Record<InstitutionCategory, string> = {
  "adalet-bakanligi": "Adalet Bakanlığı",
  "yuksek-yargi": "Yüksek Yargı Organları",
  universite: "Üniversiteler",
  "belediye-bakanlik-kit": "Belediye / Bakanlık / KİT",
};

function formatValue(v: unknown): string {
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (v === "ilana göre değişir") return "İlana göre değişir";
  return String(v);
}

export default function KurumlarPage() {
  const [category, setCategory] = useState<InstitutionCategory | "all">("all");

  const filtered = useMemo(
    () => (category === "all" ? INSTITUTIONS : INSTITUTIONS.filter((i) => i.category === category)),
    [category]
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Kurum Rehberi</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Kamu kurumlarının uygulamalı klavye sınavı kuralları.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        Kesin bilgi için ilgili kurumun güncel ilan metnini kontrol ediniz. Bu sayfadaki rakamlar genel
        uygulamaları yansıtır ve her ilanla değişebilir.
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            category === "all"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
          }`}
        >
          Tümü
        </button>
        {(Object.keys(CATEGORY_LABELS) as InstitutionCategory[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              category === c
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((inst) => (
          <div
            key={inst.id}
            className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{inst.name}</h2>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{inst.roleTitle}</span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              {[
                ["Kabul edilen klavye", inst.acceptedLayouts],
                ["Süre", typeof inst.durationSec === "number" ? `${inst.durationSec} sn` : inst.durationSec],
                ["Asgari NKS", inst.minNetWordsPerMin],
                ["Hata katsayısı", inst.penaltyPerError],
                ["Metin şekli", inst.textDelivery === "dikte" ? "Dikte" : "Yazılı metin"],
                ["Geri silme", inst.allowBackspace],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-xs uppercase tracking-wide text-neutral-400">{label}</dt>
                  <dd className="font-medium text-neutral-800 dark:text-neutral-200">{formatValue(value)}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">{inst.sourceNote}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
