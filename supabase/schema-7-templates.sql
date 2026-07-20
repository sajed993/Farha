-- ═══ FARHA — ready-to-sell templates (from customer orders you like) ═══
create table if not exists templates (
  id bigint generated always as identity primary key,
  name text not null,
  config jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table templates enable row level security;
drop policy if exists "public read active templates" on templates;
create policy "public read active templates" on templates
  for select using (active = true);
drop policy if exists "owner writes templates" on templates;
create policy "owner writes templates" on templates
  for all to authenticated using (true) with check (true);
