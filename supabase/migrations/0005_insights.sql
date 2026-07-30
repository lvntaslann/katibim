-- Katibim: internal site-insights panel — visitor sessions, page/activity
-- log, and the operator role needed to view them.
-- Run this once in Supabase Dashboard -> SQL Editor (no CLI is linked to
-- this project).

-- ============================================================
-- profiles.role
-- ============================================================

alter table public.profiles
  add column role text not null default 'user' check (role in ('user', 'admin'));

-- profiles_update_own only checks id = auth.uid() — it does not stop a user
-- from setting role='admin' on their own row via the public REST API. RLS
-- and column privileges are enforced independently, so revoke separately
-- (same pattern as the email column in 0002).
revoke update (role) on public.profiles from authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ============================================================
-- visitor_sessions: one row per browser visit
-- ============================================================

create table public.visitor_sessions (
  id uuid primary key default gen_random_uuid(),
  client_session_id uuid not null unique,
  anonymous_client_id uuid,
  user_id uuid references auth.users (id) on delete set null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  country text,
  region text,
  city text,
  device_type text check (device_type in ('desktop', 'mobile', 'tablet', 'other')),
  browser text,
  os text,
  referrer text,
  landing_path text,
  page_view_count integer not null default 0,
  total_duration_sec integer not null default 0,
  created_at timestamptz not null default now()
);

create index visitor_sessions_last_seen_idx on public.visitor_sessions (last_seen_at desc);
create index visitor_sessions_user_idx on public.visitor_sessions (user_id) where user_id is not null;
create index visitor_sessions_anon_idx on public.visitor_sessions (anonymous_client_id) where anonymous_client_id is not null;

-- ============================================================
-- activity_events: page views + a small set of custom events, one table
-- ============================================================

create table public.activity_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.visitor_sessions (id) on delete cascade,
  event_type text not null check (
    event_type in ('pageview', 'exam_complete', 'lesson_complete')
  ),
  path text,
  duration_sec integer check (duration_sec is null or duration_sec between 0 and 86400),
  metadata jsonb,
  occurred_at timestamptz not null default now()
);

create index activity_events_session_idx on public.activity_events (session_id, occurred_at);
create index activity_events_occurred_idx on public.activity_events (occurred_at desc);

-- ============================================================
-- Ingestion RPCs — called from app/api/track via the service-role client.
-- Encapsulated here (rather than plain upserts from the route) so
-- page_view_count/total_duration_sec increments and "keep the first
-- landing_path/referrer" semantics stay atomic and race-safe.
-- ============================================================

create function public.track_pageview(
  p_client_session_id uuid,
  p_anonymous_client_id uuid,
  p_user_id uuid,
  p_path text,
  p_referrer text,
  p_country text,
  p_region text,
  p_city text,
  p_device_type text,
  p_browser text,
  p_os text
)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session_id uuid;
  v_event_id bigint;
begin
  insert into public.visitor_sessions (
    client_session_id, anonymous_client_id, user_id,
    country, region, city, device_type, browser, os,
    referrer, landing_path
  )
  values (
    p_client_session_id, p_anonymous_client_id, p_user_id,
    p_country, p_region, p_city, p_device_type, p_browser, p_os,
    p_referrer, p_path
  )
  on conflict (client_session_id) do update set
    last_seen_at = now(),
    page_view_count = visitor_sessions.page_view_count + 1,
    user_id = coalesce(visitor_sessions.user_id, excluded.user_id),
    country = excluded.country,
    region = excluded.region,
    city = excluded.city,
    device_type = excluded.device_type,
    browser = excluded.browser,
    os = excluded.os
  returning id into v_session_id;

  insert into public.activity_events (session_id, event_type, path)
  values (v_session_id, 'pageview', p_path)
  returning id into v_event_id;

  return v_event_id;
end;
$$;

create function public.track_patch_duration(
  p_client_session_id uuid,
  p_event_id bigint,
  p_duration_sec integer
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session_id uuid;
  v_patched boolean;
begin
  select id into v_session_id from public.visitor_sessions
  where client_session_id = p_client_session_id;

  if v_session_id is null then
    return;
  end if;

  update public.activity_events
  set duration_sec = p_duration_sec
  where id = p_event_id and session_id = v_session_id and duration_sec is null;

  get diagnostics v_patched = row_count;

  if v_patched then
    update public.visitor_sessions
    set total_duration_sec = total_duration_sec + p_duration_sec
    where id = v_session_id;
  end if;
end;
$$;

create function public.track_custom_event(
  p_client_session_id uuid,
  p_event_type text,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session_id uuid;
begin
  select id into v_session_id from public.visitor_sessions
  where client_session_id = p_client_session_id;

  if v_session_id is null then
    return;
  end if;

  insert into public.activity_events (session_id, event_type, metadata)
  values (v_session_id, p_event_type, p_metadata);
end;
$$;

revoke all on function public.track_pageview(uuid, uuid, uuid, text, text, text, text, text, text, text, text) from public;
revoke all on function public.track_patch_duration(uuid, bigint, integer) from public;
revoke all on function public.track_custom_event(uuid, text, jsonb) from public;

-- Only the service-role client (used exclusively by app/api/track) calls
-- these — deliberately not granted to anon/authenticated so they can't be
-- invoked directly via the publishable key.
grant execute on function public.track_pageview(uuid, uuid, uuid, text, text, text, text, text, text, text, text) to service_role;
grant execute on function public.track_patch_duration(uuid, bigint, integer) to service_role;
grant execute on function public.track_custom_event(uuid, text, jsonb) to service_role;

-- ============================================================
-- RLS: default-deny, admin-only reads. All writes go through the
-- service-role ingestion endpoint (app/api/track), which bypasses RLS —
-- no client role (anon/authenticated) is ever granted insert/update/delete.
-- ============================================================

alter table public.visitor_sessions enable row level security;
alter table public.activity_events enable row level security;

create policy "visitor_sessions_select_admin" on public.visitor_sessions
  for select to authenticated
  using ((select public.is_admin()));

create policy "activity_events_select_admin" on public.activity_events
  for select to authenticated
  using ((select public.is_admin()));

-- ============================================================
-- Retention: keep the tables from growing without bound.
-- ============================================================

create extension if not exists pg_cron with schema extensions;

select cron.schedule(
  'katibim_activity_retention',
  '17 3 * * *',
  $$
    delete from public.activity_events where occurred_at < now() - interval '90 days';
    delete from public.visitor_sessions where last_seen_at < now() - interval '180 days';
  $$
);

-- ============================================================
-- Manual step (not doable from SQL editor as a migration since it needs
-- your own user id):
--
-- 1. Sign in at least once so your profiles row exists, then run:
--      update public.profiles set role = 'admin' where email = 'you@example.com';
--
-- 2. If pg_cron isn't available on this project's plan (Database ->
--    Extensions), the `create extension`/`cron.schedule` calls above will
--    error — in that case, drop them and instead schedule a host-side
--    crontab entry that hits a CRON_SECRET-protected cleanup endpoint.
-- ============================================================
