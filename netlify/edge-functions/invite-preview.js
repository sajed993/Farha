// ═══ FARHA — per-invitation WhatsApp/social link preview ═══
// Runs at the edge for the homepage. When the URL has ?i=slug, it fetches the
// invitation from Supabase and rewrites the OG/Twitter meta tags so the shared
// link shows the couple's names + a gold preview card. Humans still get the
// normal SPA (the HTML body is unchanged); only crawlers really need the tags.

const SUPABASE_URL = 'https://fsxmplaxaczcbtswtupi.supabase.co'
const SUPABASE_KEY = 'sb_publishable_InZlwlIkmaxQFB-b7b_3Dg_XO4XPpWv'

function esc (s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler (request, context) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('i')

  // No invitation slug → serve the page untouched (homepage keeps its defaults)
  const res = await context.next()
  if (!slug) return res

  let names = ''
  let title = 'فرحة — دعوة خاصة لكم'
  let desc = 'افتحوا الدعوة وشاركوا الفرحة 💛'
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/invitations?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=config`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    if (r.ok) {
      const rows = await r.json()
      const cfg = rows && rows[0] && rows[0].config
      if (cfg && cfg.c && cfg.c.n) {
        names = String(cfg.c.n)
        title = names + ' — دعوتكم 💛'
        desc = (cfg.c.t ? String(cfg.c.t) + ' · ' : '') + 'المسوا الختم لفتح الدعوة ✨'
      }
    }
  } catch (e) { /* fall back to defaults */ }

  const imgFallback = `${url.origin}/og-default.png`

  let html = await res.text()
  const block = `<!-- OG:START -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="فرحة · Farha">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(imgFallback)}">
<meta property="og:locale" content="ar_AR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(imgFallback)}">
<!-- OG:END -->`

  html = html.replace(/<!-- OG:START -->[\s\S]*?<!-- OG:END -->/, block)
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  })
}
