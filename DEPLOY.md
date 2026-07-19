# 🚀 Farha — How to deploy (important: two paths)

Your app now has an **Edge Function** for WhatsApp link previews (P1 #3).
Edge functions ONLY run when Netlify builds your site — **not** with drag-and-drop.
So pick ONE of these:

## Path A — Git deploy (recommended, unlocks link previews)
1. Put this whole `Farha/` folder in a GitHub repo (git init → commit → push).
2. In Netlify: **Add new site → Import from Git → pick the repo**.
3. Build settings (Netlify usually auto-detects from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. From now on every `git push` auto-deploys, and the WhatsApp
   preview edge function runs automatically.

## Path B — Drag & drop (fast, but NO link previews)
1. Run `npm run build` locally.
2. Drag the **`dist`** folder into Netlify → Deploys.
3. Everything works EXCEPT the fancy per-invitation WhatsApp preview
   (links still work; they just show the default Farha card, which is fine).

## What shows in WhatsApp when a link is shared
- Homepage / any link → the gold "فرحة" card (`og-default.png`).
- An invitation link `?i=slug` (Git deploy only) → the couple's names + card.

## Files that make previews work (already in place)
- `netlify.toml` — wires the edge function + SPA fallback
- `netlify/edge-functions/invite-preview.js` — injects per-invitation tags
- `public/og-default.png` — the default preview card
- OG/Twitter meta tags in `index.html`
