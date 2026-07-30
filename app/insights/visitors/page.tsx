import Link from "next/link";
import { createServiceClient } from "@/utils/supabase/service";
import { getVisitorSessionsPage } from "@/lib/insights/queries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function formatLocation(country: string | null, city: string | null) {
  if (!country) return "Bilinmiyor";
  return city ? `${city}, ${country}` : country;
}

function formatDuration(sec: number) {
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  return min > 0 ? `${min}dk ${rem}sn` : `${rem}sn`;
}

export default async function PanelVisitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, parseInt(pageParam ?? "0", 10) || 0);

  const supabase = createServiceClient();
  const { sessions, total, pageSize } = await getVisitorSessionsPage(supabase, page);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Ziyaretçiler</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{total} kayıt, en son görülen üstte.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:bg-neutral-900/60 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3">İlk görülme</th>
              <th className="px-4 py-3">Son görülme</th>
              <th className="px-4 py-3">Konum</th>
              <th className="px-4 py-3">Cihaz</th>
              <th className="px-4 py-3">Tarayıcı</th>
              <th className="px-4 py-3">Sayfa</th>
              <th className="px-4 py-3">Süre</th>
              <th className="px-4 py-3">Kullanıcı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {sessions.map((s) => (
              <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link href={`/insights/visitors/${s.id}`} className="text-accent underline decoration-hairline underline-offset-4">
                    {formatDate(s.first_seen_at)}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">
                  {formatDate(s.last_seen_at)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">
                  {formatLocation(s.country, s.city)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">
                  {s.device_type ?? "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">
                  {[s.browser, s.os].filter(Boolean).join(" / ") || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">{s.page_view_count}</td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">
                  {formatDuration(s.total_duration_sec)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-600 dark:text-neutral-300">
                  {s.user_email ?? (s.user_id ? "Üye" : "Anonim")}
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                  Kayıt yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link
          href={`/insights/visitors?page=${Math.max(0, page - 1)}`}
          aria-disabled={page === 0}
          className={`rounded-full border border-neutral-300 px-4 py-1.5 dark:border-neutral-700 ${
            page === 0 ? "pointer-events-none opacity-40" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          ← Önceki
        </Link>
        <span className="text-neutral-500 dark:text-neutral-400">
          Sayfa {page + 1} / {totalPages}
        </span>
        <Link
          href={`/insights/visitors?page=${Math.min(totalPages - 1, page + 1)}`}
          aria-disabled={page >= totalPages - 1}
          className={`rounded-full border border-neutral-300 px-4 py-1.5 dark:border-neutral-700 ${
            page >= totalPages - 1 ? "pointer-events-none opacity-40" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          Sonraki →
        </Link>
      </div>
    </>
  );
}
