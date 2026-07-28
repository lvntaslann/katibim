-- Katibim: backfill any auth.users that ended up without a profiles row
-- (e.g. an accidental delete in Table Editor) using the same name/avatar
-- logic as handle_new_user(). Safe to re-run — only inserts what's missing.
-- Run this once in Supabase Dashboard -> SQL Editor.

insert into public.profiles (id, display_name, avatar_url, email)
select
  u.id,
  coalesce(
    u.raw_user_meta_data ->> 'display_name',
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name',
    split_part(u.email, '@', 1),
    'Kullanıcı'
  ),
  coalesce(u.raw_user_meta_data ->> 'avatar_url', u.raw_user_meta_data ->> 'picture'),
  u.email
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
