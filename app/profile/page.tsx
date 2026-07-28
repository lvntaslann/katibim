"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthProvider";
import { getContributionData, getContributionDataForYear } from "@/lib/leaderboard/queries";
import { withTimeout } from "@/lib/with-timeout";
import { toLocalDateKey } from "@/lib/date-key";
import { ContributionCalendar } from "@/components/profile/ContributionCalendar";
import { createClient } from "@/utils/supabase/client";
import type { ContributionDay } from "@/types/leaderboard";

type LoadState = "loading" | "error" | "ready";

const MODE_LABELS: Record<string, string> = {
  "speed-test": "Hız Testi",
  exam: "Sınav",
  practice: "Antrenman",
  lesson: "Ders",
};

interface BestScore {
  mode: string;
  netWpm: number;
}

const inputClass =
  "flex-1 rounded-lg border border-hairline bg-surface px-3.5 py-2 text-sm text-ink focus:border-accent focus:outline-none dark:border-white/10 dark:bg-white/5";

const CURRENT_YEAR = new Date().getFullYear();

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [yearDays, setYearDays] = useState<ContributionDay[]>([]);
  const [yearStatus, setYearStatus] = useState<LoadState>("loading");
  const [bestScores, setBestScores] = useState<BestScore[] | null>(null);
  const [streak, setStreak] = useState(0);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  const availableYears = useMemo(() => {
    const startYear = user ? new Date(user.created_at).getFullYear() : CURRENT_YEAR;
    const years: number[] = [];
    for (let y = CURRENT_YEAR; y >= startYear; y--) years.push(y);
    return years;
  }, [user]);

  useEffect(() => {
    if (user === null) router.push("/login?next=/profile");
  }, [user, router]);

  // Activity calendar: scoped to whichever calendar year is selected.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setYearStatus("loading");
    withTimeout(getContributionDataForYear(user.id, selectedYear)).then((data) => {
      if (cancelled) return;
      if (data === null) {
        setYearStatus("error");
        return;
      }
      setYearDays(data);
      setYearStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [user, selectedYear, retryToken]);

  // Streak: always "today backwards", independent of which year the
  // calendar above is currently showing.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const since = new Date();
    since.setDate(since.getDate() - 60);
    getContributionData(user.id, since.toISOString()).then((data) => {
      if (cancelled) return;
      const activeDates = new Set(data.filter((d) => d.count > 0).map((d) => d.date));
      let count = 0;
      const cursor = new Date();
      cursor.setHours(0, 0, 0, 0);
      while (activeDates.has(toLocalDateKey(cursor))) {
        count += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
      setStreak(count);
    });
    return () => {
      cancelled = true;
    };
  }, [user, retryToken]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase
          .from("test_results")
          .select("mode, net_wpm")
          .eq("user_id", user.id)
          .order("net_wpm", { ascending: false });
        if (cancelled || !data) return;
        const bestByMode = new Map<string, number>();
        for (const row of data as { mode: string; net_wpm: number }[]) {
          if (!bestByMode.has(row.mode)) bestByMode.set(row.mode, row.net_wpm);
        }
        setBestScores(Array.from(bestByMode.entries()).map(([mode, netWpm]) => ({ mode, netWpm })));
      } catch (err) {
        console.error("best scores fetch failed:", err instanceof Error ? err.message : err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, retryToken]);

  useEffect(() => {
    if (profile) setNameDraft(profile.display_name);
  }, [profile]);

  async function saveName() {
    if (!user || !nameDraft.trim()) return;
    setSavingName(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ display_name: nameDraft.trim() }).eq("id", user.id);
    await refreshProfile();
    setSavingName(false);
    setEditing(false);
  }

  if (!user) {
    return <main className="p-12 text-center text-sm text-ink-muted">Yönlendiriliyor...</main>;
  }

  const label = profile?.display_name ?? user.email ?? "Kullanıcı";
  const initial = label.trim().charAt(0).toUpperCase() || "?";

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline/80 bg-accent/15 font-mono text-xl font-bold text-accent dark:border-white/10 dark:bg-accent/20 dark:text-accent-strong">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- external OAuth-provided avatar URL, not a local asset.
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </span>
        <div className="flex flex-1 flex-col gap-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                maxLength={60}
                className={inputClass}
              />
              <button
                type="button"
                disabled={savingName}
                onClick={saveName}
                className="rounded-lg bg-accent px-3.5 py-2 text-xs font-bold text-base disabled:opacity-50"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs text-ink-muted hover:text-ink"
              >
                Vazgeç
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-ink">{label}</h1>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-xs text-ink-muted underline decoration-hairline underline-offset-4 hover:text-ink"
              >
                Düzenle
              </button>
            </div>
          )}
          <p className="text-sm text-ink-muted">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1 border-y border-hairline px-4 py-3 text-center">
          <span className="font-mono text-2xl tabular-figures text-ink">{streak}</span>
          <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">Gün seri</span>
        </div>
        {bestScores?.slice(0, 3).map((s) => (
          <div key={s.mode} className="flex flex-col gap-1 border-y border-hairline px-4 py-3 text-center">
            <span className="font-mono text-2xl tabular-figures text-ink">{Math.round(s.netWpm)}</span>
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
              En iyi {MODE_LABELS[s.mode] ?? s.mode}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink">Aktivite</h2>
        {yearStatus === "loading" ? (
          <p className="text-sm text-ink-muted">Yükleniyor...</p>
        ) : yearStatus === "error" ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm font-semibold text-danger">
              Bağlantı kurulamadı. İnternet bağlantını kontrol edip tekrar dene.
            </p>
            <button
              type="button"
              onClick={() => setRetryToken((k) => k + 1)}
              className="text-sm text-accent underline decoration-hairline underline-offset-4 hover:text-accent-strong"
            >
              Tekrar dene
            </button>
          </div>
        ) : (
          <ContributionCalendar
            days={yearDays}
            year={selectedYear}
            availableYears={availableYears}
            onYearChange={setSelectedYear}
          />
        )}
      </div>
    </main>
  );
}
