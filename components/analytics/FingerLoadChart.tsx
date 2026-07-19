"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FINGER_LABELS_TR } from "@/lib/keyboard-layouts";
import type { FingerLoad } from "@/lib/analytics";

interface FingerLoadChartProps {
  data: FingerLoad[];
}

export function FingerLoadChart({ data }: FingerLoadChartProps) {
  const chartData = data
    .map((d) => ({
      finger: FINGER_LABELS_TR[d.finger],
      Basış: d.pressCount,
      Hata: d.errorCount,
    }))
    .sort((a, b) => b.Basış - a.Basış);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/70 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">Parmak Yükü Dağılımı</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
            <XAxis type="number" stroke="currentColor" className="text-xs text-neutral-500" />
            <YAxis type="category" dataKey="finger" width={90} stroke="currentColor" className="text-xs text-neutral-500" />
            <Tooltip />
            <Bar dataKey="Basış" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Hata" fill="#ef4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
