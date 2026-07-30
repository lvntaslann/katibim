import type { SupabaseClient } from "@supabase/supabase-js";

export interface VisitorSessionRow {
  id: string;
  first_seen_at: string;
  last_seen_at: string;
  country: string | null;
  region: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  landing_path: string | null;
  page_view_count: number;
  total_duration_sec: number;
  user_id: string | null;
  user_email: string | null;
  user_display_name: string | null;
}

/**
 * visitor_sessions.user_id references auth.users, not public.profiles, so
 * PostgREST can't auto-embed a profiles join — fetch profiles for the
 * referenced ids separately and merge in JS. Requires the service-role
 * client: profiles.email is column-revoked from `authenticated` (0002), so
 * this only works with a client that bypasses that grant.
 */
async function attachUserInfo<T extends { user_id: string | null }>(
  supabase: SupabaseClient,
  rows: T[]
): Promise<(T & { user_email: string | null; user_display_name: string | null })[]> {
  const userIds = Array.from(new Set(rows.map((r) => r.user_id).filter((id): id is string => !!id)));

  const profileById = new Map<string, { email: string | null; display_name: string | null }>();
  if (userIds.length > 0) {
    const { data } = await supabase.from("profiles").select("id, email, display_name").in("id", userIds);
    for (const p of data ?? []) {
      profileById.set(p.id, { email: p.email ?? null, display_name: p.display_name ?? null });
    }
  }

  return rows.map((r) => {
    const profile = r.user_id ? profileById.get(r.user_id) : undefined;
    return { ...r, user_email: profile?.email ?? null, user_display_name: profile?.display_name ?? null };
  });
}

export interface ActivityEventRow {
  id: number;
  event_type: string;
  path: string | null;
  duration_sec: number | null;
  metadata: Record<string, unknown> | null;
  occurred_at: string;
}

const WINDOW_DAYS = 30;

export interface OverviewStats {
  totalVisitors: number;
  totalPageviews: number;
  avgDurationSec: number;
  examCompletions: number;
  lessonCompletions: number;
  dailyVisitors: { date: string; visitors: number }[];
  topPaths: { path: string; count: number }[];
}

export async function getOverviewStats(supabase: SupabaseClient): Promise<OverviewStats> {
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: sessions }, { data: events }] = await Promise.all([
    supabase
      .from("visitor_sessions")
      .select("first_seen_at, total_duration_sec")
      .gte("first_seen_at", since),
    supabase
      .from("activity_events")
      .select("event_type, path, occurred_at")
      .gte("occurred_at", since),
  ]);

  const sessionRows = sessions ?? [];
  const eventRows = events ?? [];

  const totalVisitors = sessionRows.length;
  const avgDurationSec =
    totalVisitors > 0
      ? Math.round(sessionRows.reduce((sum, s) => sum + (s.total_duration_sec ?? 0), 0) / totalVisitors)
      : 0;

  const pageviews = eventRows.filter((e) => e.event_type === "pageview");
  const examCompletions = eventRows.filter((e) => e.event_type === "exam_complete").length;
  const lessonCompletions = eventRows.filter((e) => e.event_type === "lesson_complete").length;

  const dailyCounts = new Map<string, number>();
  for (const s of sessionRows) {
    const day = s.first_seen_at.slice(0, 10);
    dailyCounts.set(day, (dailyCounts.get(day) ?? 0) + 1);
  }
  const dailyVisitors = Array.from(dailyCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, visitors]) => ({ date, visitors }));

  const pathCounts = new Map<string, number>();
  for (const e of pageviews) {
    if (!e.path) continue;
    pathCounts.set(e.path, (pathCounts.get(e.path) ?? 0) + 1);
  }
  const topPaths = Array.from(pathCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([path, count]) => ({ path, count }));

  return {
    totalVisitors,
    totalPageviews: pageviews.length,
    avgDurationSec,
    examCompletions,
    lessonCompletions,
    dailyVisitors,
    topPaths,
  };
}

const PAGE_SIZE = 25;

export async function getVisitorSessionsPage(supabase: SupabaseClient, page: number) {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count } = await supabase
    .from("visitor_sessions")
    .select(
      "id, first_seen_at, last_seen_at, country, region, city, device_type, browser, os, referrer, landing_path, page_view_count, total_duration_sec, user_id",
      { count: "exact" }
    )
    .order("last_seen_at", { ascending: false })
    .range(from, to);

  const sessions = await attachUserInfo(supabase, data ?? []);

  return {
    sessions: sessions as VisitorSessionRow[],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getSessionDetail(supabase: SupabaseClient, sessionId: string) {
  const [{ data: session }, { data: events }] = await Promise.all([
    supabase
      .from("visitor_sessions")
      .select(
        "id, first_seen_at, last_seen_at, country, region, city, device_type, browser, os, referrer, landing_path, page_view_count, total_duration_sec, user_id"
      )
      .eq("id", sessionId)
      .maybeSingle(),
    supabase
      .from("activity_events")
      .select("id, event_type, path, duration_sec, metadata, occurred_at")
      .eq("session_id", sessionId)
      .order("occurred_at", { ascending: true }),
  ]);

  const [enrichedSession] = session ? await attachUserInfo(supabase, [session]) : [null];

  return {
    session: enrichedSession as VisitorSessionRow | null,
    events: (events ?? []) as ActivityEventRow[],
  };
}
