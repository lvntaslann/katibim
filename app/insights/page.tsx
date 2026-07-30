import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getOverviewStats } from "@/lib/insights/queries";
import { GlassCard } from "@/components/ui/GlassCard";
import { KineticCounter } from "@/components/ui/KineticCounter";
import { OverviewCharts } from "@/components/insights/OverviewCharts";

export default async function PanelOverviewPage() {
  const supabase = await createClient();
  const stats = await getOverviewStats(supabase);

  const tiles = [
    { label: "Ziyaretçi (30g)", num: stats.totalVisitors, suffix: "" },
    { label: "Sayfa görüntüleme (30g)", num: stats.totalPageviews, suffix: "" },
    { label: "Ort. kalış süresi", num: stats.avgDurationSec, suffix: " sn" },
    { label: "Tamamlanan sınav", num: stats.examCompletions, suffix: "" },
    { label: "Tamamlanan ders", num: stats.lessonCompletions, suffix: "" },
  ];

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Site İstatistikleri</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Son 30 günün ziyaretçi ve etkileşim özeti.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((t) => (
          <GlassCard key={t.label} glowOnHover className="flex flex-col items-center justify-center gap-1.5 !p-4 text-center">
            <KineticCounter
              value={t.num}
              suffix={t.suffix}
              className="text-xl font-bold text-neutral-900 dark:text-neutral-100"
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {t.label}
            </span>
          </GlassCard>
        ))}
      </div>

      <OverviewCharts dailyVisitors={stats.dailyVisitors} topPaths={stats.topPaths} />

      <Link href="/insights/visitors" className="text-sm text-accent underline decoration-hairline underline-offset-4">
        Tüm ziyaretçileri gör →
      </Link>
    </>
  );
}
