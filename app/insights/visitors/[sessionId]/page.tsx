import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/utils/supabase/service";
import { getSessionDetail } from "@/lib/insights/queries";
import { GlassCard } from "@/components/ui/GlassCard";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const EVENT_LABELS: Record<string, string> = {
  pageview: "Sayfa görüntüleme",
  exam_complete: "Sınav tamamlandı",
  lesson_complete: "Ders tamamlandı",
};

export default async function PanelVisitorDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = createServiceClient();
  const { session, events } = await getSessionDetail(supabase, sessionId);

  if (!session) notFound();

  const info = [
    { label: "Konum", value: [session.city, session.region, session.country].filter(Boolean).join(", ") || "Bilinmiyor" },
    { label: "Cihaz", value: session.device_type ?? "-" },
    { label: "Tarayıcı / İşletim sistemi", value: [session.browser, session.os].filter(Boolean).join(" / ") || "-" },
    { label: "Giriş sayfası", value: session.landing_path ?? "-" },
    { label: "Yönlendiren (referrer)", value: session.referrer ?? "Doğrudan" },
    { label: "Sayfa görüntüleme", value: String(session.page_view_count) },
    { label: "Toplam süre", value: `${session.total_duration_sec} sn` },
    { label: "Kullanıcı", value: session.user_email ?? (session.user_id ? "Üye" : "Anonim") },
  ];

  return (
    <>
      <div className="flex flex-col gap-1">
        <Link href="/insights/visitors" className="text-sm text-accent underline decoration-hairline underline-offset-4">
          ← Ziyaretçilere dön
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Ziyaretçi Detayı</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatDateTime(session.first_seen_at)} – {formatDateTime(session.last_seen_at)}
        </p>
      </div>

      <GlassCard glowOnHover={false} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {info.map((i) => (
          <div key={i.label} className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {i.label}
            </span>
            <span className="text-sm text-neutral-900 dark:text-neutral-100">{i.value}</span>
          </div>
        ))}
      </GlassCard>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Aktivite Zaman Çizelgesi</h2>
        <ol className="flex flex-col gap-2">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {EVENT_LABELS[e.event_type] ?? e.event_type}
                </span>
                {e.path && <span className="text-neutral-500 dark:text-neutral-400">{e.path}</span>}
              </div>
              <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
                {e.duration_sec != null && <span>{e.duration_sec} sn</span>}
                <span>{formatDateTime(e.occurred_at)}</span>
              </div>
            </li>
          ))}
          {events.length === 0 && (
            <li className="rounded-xl border border-neutral-200 bg-white/70 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60">
              Aktivite kaydı yok.
            </li>
          )}
        </ol>
      </div>
    </>
  );
}
