-- ═══════════════════════════════════════════════════════════════
--  FARHA — Phase 1 schema  ·  paste ALL of this into:
--  Supabase Dashboard → SQL Editor → New query → Run
--  Project: wgcalcphfitvtzsihjpn
-- ═══════════════════════════════════════════════════════════════

-- one-row site configuration (replaces farha-config.js as source of truth)
create table if not exists site_config (
  id int primary key default 1,
  cfg jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
insert into site_config (id) values (1) on conflict do nothing;

-- every «اطلبوا» click, from ANY device
create table if not exists orders (
  id bigint generated always as identity primary key,
  item text not null,
  price numeric not null,
  customer_name text,
  phone text,
  status text not null default 'جديد',
  note text,
  created_at timestamptz not null default now()
);
create index if not exists orders_created_idx on orders (created_at desc);

-- each sold invitation gets its own link: yoursite.netlify.app/?i=slug
create table if not exists invitations (
  id bigint generated always as identity primary key,
  slug text unique not null,
  order_id bigint references orders(id),
  design_id int not null,
  config jsonb not null default '{}'::jsonb,
  music_url text,
  video_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ultra-tier RSVP form
create table if not exists rsvps (
  id bigint generated always as identity primary key,
  invitation_id bigint references invitations(id),
  attending boolean,
  guests int default 1,
  allergies jsonb default '[]'::jsonb,
  other text,
  message text,
  created_at timestamptz not null default now()
);

-- congratulations wall with moderation
create table if not exists wishes (
  id bigint generated always as identity primary key,
  invitation_id bigint references invitations(id),
  name text,
  body text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- lightweight analytics
create table if not exists events (
  id bigint generated always as identity primary key,
  invitation_id bigint references invitations(id),
  kind text not null,
  created_at timestamptz not null default now()
);

-- ─────────────── Row-Level Security ───────────────
alter table site_config enable row level security;
alter table orders      enable row level security;
alter table invitations enable row level security;
alter table rsvps       enable row level security;
alter table wishes      enable row level security;
alter table events      enable row level security;

-- public (visitors)
create policy pub_read_cfg  on site_config for select using (true);
create policy pub_read_inv  on invitations for select using (published = true);
create policy pub_ins_order on orders  for insert with check (char_length(item) <= 120);
create policy pub_ins_rsvp  on rsvps   for insert with check (coalesce(char_length(message),0) <= 300);
create policy pub_ins_wish  on wishes  for insert with check (char_length(body) <= 200);
create policy pub_ins_evt   on events  for insert with check (true);
create policy pub_read_wish on wishes  for select using (approved = true);

-- owner (you, logged in to the dashboard)
create policy own_orders_r  on orders      for select using (auth.uid() is not null);
create policy own_orders_u  on orders      for update using (auth.uid() is not null);
create policy own_inv_all   on invitations for all    using (auth.uid() is not null);
create policy own_rsvps_r   on rsvps       for select using (auth.uid() is not null);
create policy own_wishes_u  on wishes      for update using (auth.uid() is not null);
create policy own_wishes_d  on wishes      for delete using (auth.uid() is not null);
create policy own_cfg_u     on site_config for update using (auth.uid() is not null);

-- ─────────────── Realtime (live dashboard inbox) ───────────────
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table wishes;
alter publication supabase_realtime add table rsvps;

-- ─────────────── After running this ───────────────
-- 1) Storage → create 3 PUBLIC buckets:  photos · music · videos
-- 2) Authentication → Users → Add user → your email + a strong password
--    (this account = dashboard login)
