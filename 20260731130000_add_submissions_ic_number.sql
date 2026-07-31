
-- Disambiguates students who share the same name and school.
alter table public.submissions add column ic_number text not null default '';
