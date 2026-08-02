"use client";

import { KineticCounter } from "@/components/ui/KineticCounter";
import { INSTITUTIONS } from "@/data/institutions";
import { LESSONS } from "@/data/lessons";

export function HeroStats() {
  const stats = [
    { label: "Kurum Profili", value: INSTITUTIONS.length, suffix: "+" },
    { label: "Ders Adımı", value: LESSONS.length * 4, suffix: "+" },
  ];

  return (
    <div className="mt-2 flex w-full max-w-xl items-center justify-center gap-8 border-t border-hairline/60 pt-4 dark:border-white/5">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <KineticCounter
            value={s.value}
            suffix={s.suffix}
            className="text-3xl font-bold text-ink sm:text-4xl"
          />
          <div className="mt-1 font-mono text-[11px] font-semibold tracking-wider text-ink-muted uppercase">{s.label}</div>
        </div>
      ))}
      <div className="text-center">
        <div className="font-mono text-2xl font-bold text-ink sm:text-3xl">F &amp; Q</div>
        <div className="mt-1 font-mono text-[11px] font-semibold tracking-wider text-ink-muted uppercase">Klavye Düzeni</div>
      </div>
    </div>
  );
}
