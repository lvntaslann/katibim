import type { SubstitutionStat } from "@/types";

interface SubstitutionTableProps {
  stats: SubstitutionStat[];
  limit?: number;
}

export function SubstitutionTable({ stats, limit = 10 }: SubstitutionTableProps) {
  const rows = [...stats].sort((a, b) => b.count - a.count).slice(0, limit);

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60">
        Henüz karıştırma verisi yok.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/70 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">Sık Karıştırılan Harfler</h3>
      <ul className="flex flex-col divide-y divide-neutral-100 text-sm dark:divide-neutral-800">
        {rows.map((r) => (
          <li key={`${r.expectedChar}-${r.typedChar}`} className="flex items-center justify-between py-2">
            <span className="text-neutral-700 dark:text-neutral-300">
              <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                {r.expectedChar}
              </span>{" "}
              yerine{" "}
              <span className="font-mono font-semibold text-red-600 dark:text-red-400">{r.typedChar}</span>{" "}
              yazıldı
            </span>
            <span className="tabular-nums text-neutral-500 dark:text-neutral-400">{r.count}×</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
