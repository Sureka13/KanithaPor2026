
-- Distinguishes real competition submissions from demo-site test runs.
-- Both sites currently share this Supabase project, so this is the only
-- way the admin dashboard can tell them apart. Existing rows (all real,
-- pre-dating the demo site) default to 'production'.
alter table public.submissions add column site text not null default 'production';
