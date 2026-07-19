# فرحة Farha — Production Blueprint
### From finished prototype → deployed product with real database & backend

---

## 1. Where we are today

The hard part is done. You have a complete, tested front-end: the customer site (`farha-invitations.html`, ~295 KB, trilingual, 12 designs, ultra tier, AI cinema, event-site studio, interactive date flow) and the admin dashboard (`farha-admin.html`) with a working control panel. Everything below **keeps this code** — we are adding persistence and identity underneath it, not rewriting it.

What the prototype cannot do, by nature of static files: remember anything across devices. Orders, RSVPs and wishes typed on a customer's phone live only in that phone's browser. The WhatsApp bridge covers ordering today; the backend below makes everything else real.

---

## 2. Deploy TODAY — 10 minutes, free

You can be live before the backend exists. Go to **app.netlify.com/drop** in a browser, create a free account, and drag a folder containing your two HTML files (plus `farha-config.js` whenever you export settings from the dashboard). Netlify gives you a link like `farha.netlify.app` immediately — HTTPS included, no server, no cost. When you buy a domain (about 30–60 TND/year for `.tn` or `.com` from a registrar like Namecheap or a Tunisian one like Elb.tn), you attach it in Netlify's *Domain settings* in five minutes. Cloudflare Pages works identically if you prefer it.

Rename the files when you upload: `farha-invitations.html → index.html` so the bare domain opens the site, and keep `farha-admin.html` as-is so your dashboard lives at `/farha-admin.html` (Phase 1 adds a login to it).

---

## 3. Recommended architecture

```
                    ┌──────────────────────────────┐
   Customers        │  Netlify / Cloudflare Pages  │   Owner (you)
  ────────────►     │  index.html   (the site)     │   ◄────────────
                    │  admin.html   (dashboard)    │
                    └──────────┬───────────────────┘
                               │  supabase-js (HTTPS)
                    ┌──────────▼───────────────────┐
                    │         SUPABASE (free)      │
                    │  Postgres DB  ·  Auth        │
                    │  Storage (photos/music/mp4)  │
                    │  Realtime  ·  Row-Level Sec. │
                    └──────────────────────────────┘
```

**Why Supabase and not a custom Node/Express server:** it gives you a real Postgres database, an auto-generated secure API, login, and file storage with **zero servers to maintain and zero backend code to write** — your existing HTML files just call it with `fetch`/`supabase-js`. A custom Node server (Express + Postgres on Railway/Render) is the right move later only if you need heavy custom logic (PDF generation, WhatsApp automation bots). Start with Supabase; nothing prevents adding a small Node service beside it in Phase 3.

The front-end **stays as your two files** for now. A later, optional refactor (Phase 4) splits them into a Vite project with modules — same code, easier to maintain — but it is genuinely optional.

---

## 4. Database schema (run in Supabase → SQL Editor)

Seven tables cover the whole product. This SQL is ready to paste.

```sql
-- yours (the owner) — Supabase Auth handles the actual login
create table profiles (
  id uuid primary key references auth.users(id),
  name text, role text default 'owner'
);

-- one-row site configuration = replaces farha-config.js
create table site_config (
  id int primary key default 1,
  cfg jsonb not null default '{}'::jsonb,   -- sections, prices, wa, banner, designs
  updated_at timestamptz default now()
);
insert into site_config (id) values (1);

-- every «اطلبوا» click, from ANY device
create table orders (
  id bigint generated always as identity primary key,
  item text not null, price numeric not null,
  customer_name text, phone text,
  status text default 'جديد',               -- جديد/مدفوع/مكتمل/ملغى
  note text, created_at timestamptz default now()
);

-- each sold invitation gets its own link: farha.tn/?i=nour-mehdi
create table invitations (
  id bigint generated always as identity primary key,
  slug text unique not null,
  order_id bigint references orders(id),
  design_id int not null,
  config jsonb not null,                    -- names, date, texts, colors, anim…
  music_url text, video_url text,
  published boolean default false,
  created_at timestamptz default now()
);

-- the ultra-tier RSVP form, per invitation
create table rsvps (
  id bigint generated always as identity primary key,
  invitation_id bigint references invitations(id),
  attending boolean, guests int default 1,
  allergies jsonb default '[]'::jsonb, other text, message text,
  created_at timestamptz default now()
);

-- congratulations wall, with moderation
create table wishes (
  id bigint generated always as identity primary key,
  invitation_id bigint references invitations(id),
  name text, body text not null,
  approved boolean default false,
  created_at timestamptz default now()
);

-- lightweight analytics: opens, reveals, rsvp submits
create table events (
  id bigint generated always as identity primary key,
  invitation_id bigint references invitations(id),
  kind text not null,                       -- open / reveal / rsvp / order_click
  created_at timestamptz default now()
);
```

**Row-Level Security** — the part that makes it safe to call the database directly from the browser. Visitors may write RSVPs/wishes/events and read only published content; only you (authenticated) may read orders or change anything:

```sql
alter table orders enable row level security;
alter table invitations enable row level security;
alter table rsvps enable row level security;
alter table wishes enable row level security;
alter table events enable row level security;
alter table site_config enable row level security;

create policy pub_read_cfg  on site_config for select using (true);
create policy pub_read_inv  on invitations for select using (published = true);
create policy pub_ins_order on orders  for insert with check (true);
create policy pub_ins_rsvp  on rsvps   for insert with check (true);
create policy pub_ins_wish  on wishes  for insert with check (char_length(body) <= 200);
create policy pub_ins_evt   on events  for insert with check (true);
create policy pub_read_wish on wishes  for select using (approved = true);

create policy own_all_orders on orders      for all using (auth.uid() is not null);
create policy own_all_inv    on invitations for all using (auth.uid() is not null);
create policy own_all_rsvps  on rsvps       for select using (auth.uid() is not null);
create policy own_mod_wishes on wishes      for update using (auth.uid() is not null);
create policy own_cfg        on site_config for update using (auth.uid() is not null);
```

Create three **Storage buckets** in the Supabase UI — `photos`, `music`, `videos` — public-read, authenticated-write, so uploaded memories and AI films get permanent URLs instead of temporary in-browser ones.

---

## 5. Backend mapping — what replaces what

Every bridge we built maps one-to-one onto a table, which is why the migration is small. `placeOrder()` stops writing to localStorage and instead inserts into `orders` (and still opens WhatsApp — keep both). `ultraSend()` inserts into `rsvps`. `sendWish()` inserts into `wishes` with `approved=false`. The dashboard's `saveCFG()` updates `site_config.cfg`, and the site's `loadCFG()` fetches that row on boot — the exported-file trick becomes a fallback for offline demos. The dashboard's orders/wishes views switch from `lsGet()` to `select … order by created_at desc`, and Supabase **Realtime** subscriptions make new orders pop into the dashboard live, from any customer device — the limitation we flagged disappears.

The connection code is about ten lines added to each file:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
const sb = supabase.createClient('https://YOURPROJECT.supabase.co','ANON_KEY');
// example: record an order
async function dbOrder(item, price){
  await sb.from('orders').insert({ item, price });
}
</script>
```

The `ANON_KEY` is designed to be public — RLS above is what protects the data.

---

## 6. UI changes required

Small and surgical. The **dashboard** gets a login screen (Supabase email magic-link — six lines of code) shown before `render()`; everything else it already does. The **site** gets per-invitation links: on boot it reads `?i=slug` from the URL, fetches that row from `invitations`, and feeds its `config` into the existing `S.c` — the whole ceremony engine you built runs unchanged. The dashboard gains one new view, **«إنشاء دعوة»**: pick a design, fill the couple's data in a form mirroring the editor, save → it inserts the row and shows the shareable link and QR. Uploads (music, memory video, AI films) switch from `URL.createObjectURL` to `sb.storage.from('videos').upload(...)` and store the returned public URL.

---

## 7. Real project structure (Phase 4, optional)

When the single files feel heavy, we split without rewriting:

```
farha/
  site/            → index.html, /src/{i18n,designs,ceremony,shows,ultra,ai,studio}.js
  admin/           → admin.html, /src/{views,control,db}.js
  shared/          → supabase.js, config.js
  supabase/        → schema.sql, policies.sql (versioned)
  netlify.toml
```

Built with Vite, deployed by connecting the GitHub repo to Netlify (every push auto-deploys). This is maintenance comfort, not new capability — do it when the project earns it.

---

## 8. Payments (Tunisia)

Phase 1 keeps the honest manual loop: WhatsApp order → you confirm → client pays by **D17 / Flouci transfer or bank** → you mark the order «مدفوع» in the dashboard and send their invitation link. Phase 3 automates it with a Tunisian gateway — **Konnect** (konnect.network) or **Paymee** — both offer payment links/APIs that work with dinars and local cards; a Supabase Edge Function receives their webhook and flips the order to paid automatically. Stripe is not available for Tunisian merchants, so plan around the local gateways.

---

## 9. Roadmap & effort

**Phase 0 — today (10 min):** Netlify Drop, live link, share it.
**Phase 1 — the weekend build (I can scaffold this next):** Supabase project + schema above; wire orders/RSVPs/wishes/config to the database; dashboard login + live inboxes. Result: real cross-device business data.
**Phase 2 — sellable invitations (a few evenings):** per-client slugs + creation form + storage uploads + guest analytics (`events`).
**Phase 3 — money & automation:** Konnect payment links + webhook, optional WhatsApp notification on new order.
**Phase 4 — comfort:** repo + Vite split + auto-deploys.

---

## 10. Costs

Everything in Phases 0–2 runs on **0 TND/month**: Netlify free tier for the front-end, Supabase free tier (500 MB database, 1 GB storage, 50k monthly auth users) for the backend. The only real cost is the domain (~30–60 TND/year). You outgrow free tiers only with success — at which point Supabase Pro is $25/month.

---

## 11. Security checklist

RLS enabled on every table (done in §4) · length limits on public inserts (wish ≤ 200 chars — extend the same pattern to rsvps.message) · dashboard behind Supabase Auth, never a hardcoded password · the anon key is public by design, the `service_role` key must never appear in front-end code · add Cloudflare Turnstile (free captcha) on wish/RSVP forms if spam appears · keep the exported `farha-config.js` fallback so the site still renders if the database is unreachable.

---

## 12. Next step

Say **«ابدأ Phase 1»** and I will scaffold it end-to-end in this environment: the exact SQL applied-and-tested, both HTML files patched to talk to Supabase (with the localStorage bridge kept as offline fallback), the dashboard login, and a simulated integration test — you would only paste your project URL + anon key and upload.
