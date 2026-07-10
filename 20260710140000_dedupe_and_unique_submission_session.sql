
-- Clean up duplicate submissions caused by a retry-without-idempotency bug
-- (a transient client-side error after the insert had already landed
-- server-side caused the retry to insert the same attempt twice). Keeps the
-- earliest row per session_id, tie-broken by id.
delete from public.submissions a
using public.submissions b
where a.session_id = b.session_id
  and (a.submitted_at, a.id) > (b.submitted_at, b.id);

-- Enforce one submission per quiz attempt going forward. The app now
-- upserts on session_id instead of inserting, so retries update the same
-- row instead of creating a duplicate.
alter table public.submissions add constraint submissions_session_id_key unique (session_id);
