-- Katibim: accounts, leaderboard, contribution calendar
-- Run this once in Supabase Dashboard -> SQL Editor (no CLI is linked to this project).

-- ============================================================
-- profiles
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_public" on public.profiles
  for select to public
  using (true);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ============================================================
-- test_results
-- ============================================================

create table public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  anonymous_name text,
  anonymous_client_id uuid,
  client_session_id uuid unique,
  mode text not null check (mode in ('sinav', 'antrenman', 'ders', 'hiz-testi')),
  layout text not null check (layout in ('F', 'Q')),
  net_wpm numeric not null check (net_wpm between 0 and 400),
  gross_wpm numeric not null check (gross_wpm between 0 and 400),
  accuracy numeric not null check (accuracy between 0 and 100),
  duration_sec integer not null check (duration_sec between 5 and 3600),
  institution_id text,
  lesson_id text,
  passed boolean,
  created_at timestamptz not null default now(),
  constraint test_results_identity_check check (user_id is not null or anonymous_name is not null)
);

create index test_results_mode_layout_wpm_idx on public.test_results (mode, layout, net_wpm desc);
create index test_results_user_created_idx on public.test_results (user_id, created_at);

alter table public.test_results enable row level security;

create policy "test_results_insert_own" on public.test_results
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "test_results_insert_anon" on public.test_results
  for insert to anon
  with check (
    user_id is null
    and anonymous_name is not null
    and anonymous_client_id is not null
  );

create policy "test_results_select_public" on public.test_results
  for select to public
  using (true);

-- ============================================================
-- leaderboard_best_v: each identity's personal best per (mode, layout)
-- ============================================================

create view public.leaderboard_best_v
with (security_invoker = true) as
select distinct on (coalesce(user_id::text, anonymous_client_id::text), mode, layout)
  coalesce(user_id::text, anonymous_client_id::text) as identity_key,
  user_id,
  anonymous_name,
  mode,
  layout,
  net_wpm,
  gross_wpm,
  accuracy,
  institution_id,
  created_at
from public.test_results
order by
  coalesce(user_id::text, anonymous_client_id::text),
  mode,
  layout,
  net_wpm desc,
  created_at asc;

-- ============================================================
-- handle_new_user: auto-create a profile row on signup
-- ============================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1),
      'Kullanıcı'
    ),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- claim_anonymous_results: merge a browser's anonymous history into
-- the calling authenticated user's account.
-- ============================================================

create function public.claim_anonymous_results(client_id uuid)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  updated_count integer;
begin
  if auth.uid() is null then
    raise exception 'claim_anonymous_results requires an authenticated caller';
  end if;

  update public.test_results
  set user_id = auth.uid(),
      anonymous_name = null,
      anonymous_client_id = null
  where anonymous_client_id = client_id
    and user_id is null;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

revoke all on function public.claim_anonymous_results(uuid) from public;
grant execute on function public.claim_anonymous_results(uuid) to authenticated;

-- ============================================================
-- Manual dashboard steps (not doable from SQL):
--
-- 1. Authentication -> Providers -> enable Google, with a Client ID/Secret
--    obtained from Google Cloud Console.
-- 2. Authentication -> Settings -> "Confirm email" toggle. Turning this OFF
--    makes the anonymous-results claim flow work seamlessly right after
--    signup, since a session exists immediately. Leaving it ON is safer
--    but the claim only completes on the same browser once the user clicks
--    the confirmation link and returns.
-- ============================================================
