-- ═══ FARHA — Phase 2: pay-first delivery ═══
-- Paste in Supabase → SQL Editor → Run.
alter table orders add column if not exists payload jsonb;
alter table orders add column if not exists inv_slug text;

drop policy if exists "public read published invitations" on invitations;
create policy "public read published invitations" on invitations
 for select using (published = true);
drop policy if exists "owner writes invitations" on invitations;
create policy "owner writes invitations" on invitations
 for insert to authenticated with check (true);
drop policy if exists "owner updates invitations" on invitations;
create policy "owner updates invitations" on invitations
 for update to authenticated using (true);

-- owner can read ALL their invitations (for dashboard + backup)
drop policy if exists "owner reads invitations" on invitations;
create policy "owner reads invitations" on invitations
 for select to authenticated using (true);
