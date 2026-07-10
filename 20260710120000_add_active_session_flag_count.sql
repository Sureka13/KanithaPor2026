
-- Live flag count on active_sessions, so the monitor can surface
-- possible cheating (tab switches / fullscreen exits) without an
-- extra per-tile query against proctor_events.
alter table public.active_sessions add column flag_count int not null default 0;

create or replace function public.increment_active_session_flags(p_session_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.active_sessions set flag_count = flag_count + 1 where session_id = p_session_id;
$$;

grant execute on function public.increment_active_session_flags(text) to anon, authenticated;
