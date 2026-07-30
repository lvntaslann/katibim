"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DailyVisitorsChartProps {
  data: { date: string; visitors: number }[];
}

export function DailyVisitorsChart({ data }: DailyVisitorsChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60">
        Son 30 günde veri yok.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/70 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">Günlük Ziyaretçi (30 gün)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
            <XAxis dataKey="date" className="text-xs text-neutral-500" />
            <YAxis allowDecimals={false} className="text-xs text-neutral-500" />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" name="Ziyaretçi" stroke="var(--color-accent)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
