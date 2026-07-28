-- Katibim: switch test_results.mode to English identifiers, matching the
-- app-side SessionMode rename (sinav->exam, antrenman->practice, ders->lesson,
-- hiz-testi->speed-test). Run this once in Supabase Dashboard -> SQL Editor.

-- test_results is being cleared as part of this same cleanup (requested
-- separately) — no existing rows to migrate, just swap the constraint.
delete from public.test_results;

alter table public.test_results drop constraint test_results_mode_check;
alter table public.test_results add constraint test_results_mode_check
  check (mode in ('exam', 'practice', 'lesson', 'speed-test'));

-- If the drop errors because the auto-generated constraint name differs on
-- your instance, look it up first:
--   select conname from pg_constraint
--   where conrelid = 'public.test_results'::regclass and contype = 'c';
