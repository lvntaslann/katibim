"use client";

import dynamic from "next/dynamic";

const DailyVisitorsChart = dynamic(
  () => import("@/components/insights/DailyVisitorsChart").then((m) => m.DailyVisitorsChart),
  { loading: () => <div className="h-64 animate-pulse rounded-2xl bg-surface/40 border border-ink/5" />, ssr: false }
);

const TopPathsChart = dynamic(() => import("@/components/insights/TopPathsChart").then((m) => m.TopPathsChart), {
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-surface/40 border border-ink/5" />,
  ssr: false,
});

interface OverviewChartsProps {
  dailyVisitors: { date: string; visitors: number }[];
  topPaths: { path: string; count: number }[];
}

export function OverviewCharts({ dailyVisitors, topPaths }: OverviewChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DailyVisitorsChart data={dailyVisitors} />
      <TopPathsChart data={topPaths} />
    </div>
  );
}
