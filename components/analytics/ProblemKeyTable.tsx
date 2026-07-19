import type { KeyStatRow } from "@/lib/analytics";

interface ProblemKeyTableProps {
  rows: KeyStatRow[];
}

export function ProblemKeyTable({ rows }: ProblemKeyTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60">
        Henüz hata verisi yok.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white/70 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          <tr>
            <th className="px-4 py-3">Tuş</th>
            <th className="px-4 py-3">Basış</th>
            <th className="px-4 py-3">Hata</th>
            <th className="px-4 py-3">Hata %</th>
            <th className="px-4 py-3">Ort. gecikme</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {rows.map((r) => (
            <tr key={r.keyCode}>
              <td className="px-4 py-2.5 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                {r.label}
              </td>
              <td className="px-4 py-2.5 tabular-nums text-neutral-600 dark:text-neutral-300">{r.pressCount}</td>
              <td className="px-4 py-2.5 tabular-nums text-neutral-600 dark:text-neutral-300">{r.errorCount}</td>
              <td className="px-4 py-2.5 tabular-nums text-red-600 dark:text-red-400">
                %{r.errorRate.toFixed(1)}
              </td>
              <td className="px-4 py-2.5 tabular-nums text-neutral-600 dark:text-neutral-300">
                {Math.round(r.avgLatencyMs)} ms
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
