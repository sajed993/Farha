// ═══ FARHA — per-invitation WhatsApp/social link preview ═══
// Runs at the edge for the homepage. When the URL carries ?i=slug it fetches
// that invitation and rewrites the OG/Twitter tags, so a link pasted into
// WhatsApp unfurls with the couple's names and their own film rather than a
// bare URL. Humans still get the normal SPA — only crawlers read the tags.

const SUPABASE_URL = 'https://fsxmplaxaczcbtswtupi.supabase.co'
const SUPABASE_KEY = 'sb_publishable_InZlwlIkmaxQFB-b7b_3Dg_XO4XPpWv'

function esc (s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// The poster of whichever film the invitation was built on. config.films.venue
// already holds it for a ready-made film; a customer's own video keeps its
// poster beside it under the same name.
function posterFrom (cfg, origin) {
  try {
    const f = cfg && cfg.films
    let p = (f && (f.venue || f.poster)) || ''
    if (!p && f && f.hero) p = String(f.hero).replace(/\.(mp4|webm|mov)$/i, '.jpg')
    if (!p) return ''
    if (/^https?:\/\//i.test(p)) return p
    return origin + (p.startsWith('/') ? '' : '/') + p
  } catch (e) { return '' }
}

export default async function handler (request, context) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('i')

  const res = await context.next()

  // The guest list is a private page. It must never be unfurled into a chat
  // with the couple's names on it, and it must never be indexed.
  if (url.searchParams.get('guests')) {
    let h = await res.text()
    h = h.replace(/<!-- OG:START[\s\S]*?OG:END -->/,
      '<meta name="robots" content="noindex,nofollow">')
    return new Response(h, { headers: { 'content-type': 'text/html; charset=utf-8' } })
  }

  // The homepage's own tags are rewritten too, not just an invitation's: the
  // image in the HTML is a root-relative path, and WhatsApp will not resolve
  // one. It needs the whole URL, which only the edge knows.
  let title = 'فرحة — دعوات رقمية تُفتح كفيلم'
  let desc = 'أعراس، حنّة، أعياد ميلاد ومواليد — دعوة تُفتح بلمسة على الهاتف 💛'
  let image = url.origin + '/og-default.png'

  if (slug) try {
    // through the same function the site uses; the table itself is no longer
    // readable without a slug (see supabase/schema-10-locks.sql)
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/invite_get`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ p_slug: slug })
    })
    if (r.ok) {
      const rows = await r.json()
      const cfg = rows && rows[0] && rows[0].config
      if (cfg && cfg.c && cfg.c.n) {
        title = String(cfg.c.n) + ' — دعوتكم 💛'
        desc = (cfg.c.t ? String(cfg.c.t) + ' · ' : '') + 'المسوا الختم لفتح الدعوة ✨'
        const p = posterFrom(cfg, url.origin)
        if (p) image = p
      }
    }
  } catch (e) { /* fall back to the defaults above */ }

  const block = `<!-- OG:START -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="فرحة · Farha">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url.href)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="720">
<meta property="og:image:height" content="1280">
<meta property="og:locale" content="ar_AR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(image)}">
<!-- OG:END -->`

  let html = await res.text()
  /* The marker in index.html carries a note inside the comment, so an exact
     match on "<!-- OG:START -->" never fired and every shared link fell back
     to the page's own tags. Match the marker, not the whole comment. */
  html = html.replace(/<!-- OG:START[\s\S]*?OG:END -->/, block)
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  })
}
