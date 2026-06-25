
create policy "anyone upload snapshot" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'snapshots');
create policy "anyone update own snapshot" on storage.objects for update to anon, authenticated
  using (bucket_id = 'snapshots');
create policy "admins read snapshots" on storage.objects for select to authenticated
  using (bucket_id = 'snapshots' and public.has_role(auth.uid(),'admin'));
create policy "admins delete snapshots" on storage.objects for delete to authenticated
  using (bucket_id = 'snapshots' and public.has_role(auth.uid(),'admin'));
