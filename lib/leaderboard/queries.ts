import { createClient } from "@/utils/supabase/client";
import { toLocalDateKey } from "@/lib/date-key";
import type { KeyboardLayout } from "@/types";
import type { ContributionDay, LeaderboardMode, LeaderboardRow } from "@/types/leaderboard";

export async function getLeaderboard(
  mode: LeaderboardMode,
  layout: KeyboardLayout,
  limit = 50
): Promise<LeaderboardRow[]> {
  const supabase = createClient();
  try {
    const { data: rows, error } = await supabase
      .from("leaderboard_best_v")
      .select(
        "identity_key, user_id, anonymous_name, mode, layout, net_wpm, gross_wpm, accuracy, institution_id, created_at"
      )
      .eq("mode", mode)
      .eq("layout", layout)
      .order("net_wpm", { ascending: false })
      .limit(limit);

    if (error || !rows) {
      console.error("getLeaderboard failed:", error?.message);
      return [];
    }

    const userIds = [...new Set(rows.map((r) => r.user_id).filter((id): id is string => Boolean(id)))];
    const profilesById = new Map<string, { display_name: string; avatar_url: string | null }>();

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);
      for (const p of profiles ?? []) {
        profilesById.set(p.id, { display_name: p.display_name, avatar_url: p.avatar_url });
      }
    }

    return rows.map((row) => {
      const profile = row.user_id ? profilesById.get(row.user_id) : undefined;
      return {
        identityKey: row.identity_key,
        userId: row.user_id,
        displayName: profile?.display_name ?? row.anonymous_name ?? "Anonim",
        avatarUrl: profile?.avatar_url ?? null,
        mode: row.mode as LeaderboardMode,
        layout: row.layout as KeyboardLayout,
        netWpm: row.net_wpm,
        grossWpm: row.gross_wpm,
        accuracy: row.accuracy,
        institutionId: row.institution_id,
        createdAt: row.created_at,
      };
    });
  } catch (err) {
    // A rejected fetch (network hiccup, blocked request) must still resolve
    // to an empty list — otherwise the caller's promise never settles and
    // the UI is stuck on its loading state forever.
    console.error("getLeaderboard failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

async function fetchContributionDays(
  userId: string,
  gte: string,
  lt?: string
): Promise<ContributionDay[]> {
  const supabase = createClient();
  try {
    let query = supabase.from("test_results").select("created_at").eq("user_id", userId).gte("created_at", gte);
    if (lt) query = query.lt("created_at", lt);
    const { data, error } = await query;

    if (error || !data) {
      console.error("getContributionData failed:", error?.message);
      return [];
    }

    const counts = new Map<string, number>();
    for (const row of data) {
      const date = toLocalDateKey(new Date(row.created_at));
      counts.set(date, (counts.get(date) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error("getContributionData failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

/** Rolling window from `sinceDate` to now — used for the streak stat, which
 * always reflects "today" regardless of which calendar year the activity
 * calendar is currently displaying. */
export async function getContributionData(userId: string, sinceDate: string): Promise<ContributionDay[]> {
  return fetchContributionDays(userId, sinceDate);
}

/** One full calendar year (Jan 1 - Dec 31) — used by the activity calendar's
 * year switcher, matching GitHub's "pick a year" behavior. */
export async function getContributionDataForYear(userId: string, year: number): Promise<ContributionDay[]> {
  return fetchContributionDays(userId, `${year}-01-01`, `${year + 1}-01-01`);
}
