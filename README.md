# فرحة Farha — v2 (Vite + Supabase)

Luxury digital-invitation platform: trilingual customer site + owner dashboard,
wired to Supabase (project `wgcalcphfitvtzsihjpn`).

## Quickstart

```bash
npm install
npm run dev        # site: http://localhost:5173  ·  dashboard: /admin.html
npm run build      # production build → dist/
npm run preview    # serve the built dist locally
```

> `dist/` uses ES modules, so open it through a server (`npm run preview`,
> Netlify, …) — not by double-clicking the file.

## Deploy (Netlify)

Drag the **`dist/`** folder into https://app.netlify.com/drop — done.
Updating later: your site → *Deploys* tab → drag the new `dist/`.
Or connect this folder as a Git repo: build command `npm run build`,
publish directory `dist` — every push auto-deploys.

## Supabase — done & to-do

Already done ✓ : the schema (`supabase/schema.sql`) ran successfully — tables,
Row-Level Security and Realtime are live.

Still yours to do (2 minutes, in the Supabase dashboard):
1. **Authentication → Users → Add user** → your email + a strong password.
   That account is the dashboard login (`admin.html` shows the gate).
2. **Storage → New bucket** ×3, all *public*: `photos`, `music`, `videos`
   (used by Phase 2 uploads).

Keys live in `src/shared/supabase.js`. The publishable key is public by
design; **never** put the `service_role` key in front-end code.

## How the data flows

The site fires `dbHook('order'|'wish'|'rsvp', …)` at the four integration
points; `src/site/backend.js` inserts the rows (silently skipped when
offline — the localStorage demo bridge still works). The dashboard, once
logged in, reads cloud inboxes (orders + RSVPs + wishes, live via Realtime),
updates statuses/moderation, and «💾 حفظ» writes `site_config` — which every
visitor's site loads on boot. Config precedence in a browser:
**database → `farha-config.js` (offline fallback) → localStorage (your own
live preview overrides, in your browser only).**

## Where to edit what

| File | Contents |
|---|---|
| `public/js/site/01-i18n-…` | all AR/FR/EN strings |
| `…/02-data` | designs, palettes, openings, films data |
| `…/05-landing` `06-editor` | landing sections, invitation editor |
| `…/07-event-site-show` | event-site studio + photo shows |
| `…/08-ai-…` `09-ultra-…` `10-…date-flow` | AI cinema · wax-seal tier · date flow |
| `…/11-actions` | payments sheet (D17/WhatsApp), orders, QR |
| `…/12-dashboard-control-bridge` | config/localStorage bridge |
| `…/13-cinematic-ceremony` `14-music` | guest ceremony engine, music |
| `public/js/admin/*` | dashboard views & control panel |
| `src/site/backend.js` · `src/admin/backend.js` | all Supabase logic |
| `public/css/*` | all styles |

## Verified

Built output tested headlessly: payments 9/9 · dashboard-control 14/14 ·
animation stress 0 errors · simulated-cloud loop 13/13 (config, inserts,
login, inboxes, moderation, publish) — zero page errors.
