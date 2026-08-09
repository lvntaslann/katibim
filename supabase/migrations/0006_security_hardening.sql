-- Security hardening: remove public PII and replace broad table privileges
-- with the minimum column grants the application needs.

-- `REVOKE SELECT (email)` and `REVOKE UPDATE (role)` do not override a
-- table-level grant in PostgreSQL. Remove the PII column entirely and then
-- explicitly grant only the safe profile fields.
alter table public.profiles drop column if exists email;

create or replace function public.handle_new_user()
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
      'KullanÄ±cÄ±'
    ),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  );
  return new;
end;
$$;

revoke all privileges on table public.profiles from public, anon, authenticated;
grant select (id, display_name, avatar_url, created_at) on table public.profiles to anon, authenticated;
grant insert (id, display_name, avatar_url) on table public.profiles to authenticated;
grant update (display_name, avatar_url) on table public.profiles to authenticated;

-- Results are public only through the narrow leaderboard view. Direct table
-- reads are limited to a signed-in user's own contribution data.
drop policy if exists "test_results_select_public" on public.test_results;
create policy "test_results_select_own" on public.test_results
  for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all privileges on table public.test_results from public, anon, authenticated;
grant insert (
  user_id, anonymous_name, anonymous_client_id, client_session_id,
  mode, layout, net_wpm, gross_wpm, accuracy, duration_sec,
  institution_id, lesson_id, passed
) on table public.test_results to anon, authenticated;
grant select (user_id, created_at, mode, net_wpm) on table public.test_results to authenticated;

-- This view deliberately runs with its owner's access, so public leaderboard
-- reads cannot be used to enumerate the underlying test_results records.
create or replace view public.leaderboard_best_v
with (security_invoker = false, security_barrier = true) as
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

grant select on public.leaderboard_best_v to anon, authenticated;
