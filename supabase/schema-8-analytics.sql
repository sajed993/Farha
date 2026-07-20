-- ═══ FARHA — real analytics: richer events + anon insert + owner read ═══
-- Safe to re-run.
alter table events add column if not exists inv_slug text;
alter table events add column if not exists device text;
alter table events add column if not exists path text;

-- visitors (anon) can log events; owner can read them
drop policy if exists pub_ins_evt on events;
create policy pub_ins_evt on events for insert with check (char_length(kind) <= 30);
drop policy if exists own_evt_r on events;
create policy own_evt_r on events for select using (auth.uid() is not null);

-- realtime for live visitor feel (optional; presence is separate)
do $$ begin
  begin alter publication supabase_realtime add table events; exception when duplicate_object then null; end;
end $$;
