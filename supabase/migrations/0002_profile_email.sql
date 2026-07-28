-- Katibim: store each user's email on their profile row (visible to you in
-- Table Editor / SQL Editor) without ever exposing it through the public API.
-- Run this once in Supabase Dashboard -> SQL Editor.

alter table public.profiles add column email text;

-- profiles_select_public grants `using (true)` row visibility to anon and
-- authenticated for the whole table. Without this, adding the column would
-- make every user's email publicly readable through the REST API. Revoking
-- column-level SELECT here still lets Postgres's table owner (you, via
-- Table Editor / SQL Editor, which run as postgres and bypass RLS + grants
-- entirely) see it.
revoke select (email) on public.profiles from anon, authenticated;

-- Backfill the one profile that already exists.
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1),
      'Kullanıcı'
    ),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    new.email
  );
  return new;
end;
$$;

-- Clean up a diagnostic row inserted while debugging the leaderboard submit
-- path (safe to no-op if it's already gone).
delete from public.test_results where id = '9587d1d2-5fea-4fc7-9cb4-c3516b700ee5';
