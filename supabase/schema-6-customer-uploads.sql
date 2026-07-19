-- ═══ FARHA — P1#2: allow customers (anon) to upload their event media ═══
-- Customers aren't logged in, so we allow anonymous INSERT — but ONLY into
-- the orders/ sub-folder of each bucket. Owner policies stay as they were.
-- Paste in Supabase → SQL Editor → Run. Safe to re-run.

drop policy if exists "farha_customer_insert" on storage.objects;
create policy "farha_customer_insert" on storage.objects
  for insert to anon
  with check (
    bucket_id in ('photos','music','videos')
    and (storage.foldername(name))[1] = 'orders'
  );
