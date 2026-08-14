-- ═══ FARHA — a wish belongs to an invitation ═══
-- The wishes table had no notion of which invitation a message was for, so a
-- congratulations wall would have shown every couple every other couple's
-- messages. Mirrors exactly what schema-4-guests.sql did for rsvps.
-- Safe to re-run.
alter table wishes add column if not exists inv_slug text;
create index if not exists wishes_slug_idx on wishes (inv_slug, approved, created_at desc);

-- anonymous guests may leave a wish; the length guard stays as it was
drop policy if exists pub_ins_wish on wishes;
create policy pub_ins_wish on wishes for insert
  with check (char_length(body) <= 200 and char_length(coalesce(name,'')) <= 40);

-- and may read only approved wishes, only for the invitation they are looking at
drop policy if exists "public read approved wishes" on wishes;
create policy "public read approved wishes" on wishes
  for select using (approved = true and inv_slug is not null);
