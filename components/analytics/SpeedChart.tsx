"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SpeedPoint } from "@/lib/analytics";

interface SpeedChartProps {
  data: SpeedPoint[];
}

export function SpeedChart({ data }: SpeedChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60">
        Bu oturum için hız verisi yok.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/70 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">Oturum İçi Hız</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
            <XAxis dataKey="tSec" tickFormatter={(v) => `${v}s`} className="text-xs text-neutral-500" />
            <YAxis yAxisId="wpm" className="text-xs text-neutral-500" />
            <YAxis yAxisId="acc" orientation="right" domain={[0, 100]} className="text-xs text-neutral-500" />
            <Tooltip />
            <Line yAxisId="wpm" type="monotone" dataKey="grossWpm" name="Brüt hız" stroke="#3b82f6" dot={false} strokeWidth={2} />
            <Line yAxisId="acc" type="monotone" dataKey="accuracy" name="Doğruluk %" stroke="#10b981" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
