-- ═══ FARHA — Phase 1.5: storage buckets + policies ═══
-- Paste in Supabase → SQL Editor → Run. Creates the 3 public buckets
-- (no manual clicking needed) and lets the logged-in owner upload.
insert into storage.buckets (id,name,public) values
 ('photos','photos',true),('music','music',true),('videos','videos',true)
on conflict (id) do nothing;

create policy "farha_public_read" on storage.objects
 for select using (bucket_id in ('photos','music','videos'));
create policy "farha_owner_insert" on storage.objects
 for insert to authenticated with check (bucket_id in ('photos','music','videos'));
create policy "farha_owner_update" on storage.objects
 for update to authenticated using (bucket_id in ('photos','music','videos'));
create policy "farha_owner_delete" on storage.objects
 for delete to authenticated using (bucket_id in ('photos','music','videos'));
