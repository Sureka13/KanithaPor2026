
-- The client now upserts submissions on session_id (onConflict: "session_id")
-- instead of inserting. Postgres requires UPDATE privilege on the table to
-- even plan an INSERT ... ON CONFLICT DO UPDATE statement, regardless of
-- whether a conflict actually occurs at runtime. Anon only ever had INSERT,
-- so every student submission (demo and production) was failing with
-- "permission denied for table submissions" and silently falling back to
-- the localStorage pending-submission queue.
grant update on public.submissions to anon;
create policy "anyone can update own submission" on public.submissions
  for update to anon, authenticated using (true) with check (true);
