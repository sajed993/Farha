// ═══ فرحة — site backend (Supabase wiring) ═══
// Loads AFTER the classic app scripts. Everything here is fire-and-forget:
// if the database is unreachable, the site keeps working in local mode.
import { sb } from '../shared/supabase.js'

const TABLE = { order: 'orders', wish: 'wishes', rsvp: 'rsvps', event: 'events' }

function rowFor(kind, d) {
  d = d || {}
  if (kind === 'order')
    return { item: String(d.item || '').slice(0, 120), price: +d.price || 0, phone: d.phone ? String(d.phone).slice(0, 20) : null, ref: d.ref ? String(d.ref).slice(0,12) : null, method: d.method ? String(d.method).slice(0,10) : 'd17', payload: d.payload || null }
  if (kind === 'wish')
    return { name: String(d.name || 'ضيف').slice(0, 40), body: String(d.body || '').slice(0, 200) }
  if (kind === 'rsvp')
    return {
      inv_slug: d.inv_slug ? String(d.inv_slug).slice(0, 64) : (window.__inviteSlug || null),
      attending: !!d.attending,
      guests: Math.max(1, +d.guests || 1),
      allergies: Array.isArray(d.allergies) ? d.allergies.slice(0, 10) : [],
      other: String(d.other || '').slice(0, 120),
      message: String(d.message || '').slice(0, 300),
    }
  if (kind === 'event')
    return { kind: String(d.kind || 'open').slice(0, 30) }
  return null
}

async function send(kind, d) {
  if (!sb) return
  const table = TABLE[kind]
  const row = rowFor(kind, d)
  if (!table || !row) return
  try {
    const { error } = await sb.from(table).insert(row)
    if (error) console.warn('[farha db]', table, error.message)
  } catch (e) {
    console.warn('[farha db]', e && e.message)
  }
}

// replace the app's stub hook, then flush anything queued before we loaded
function hookUp() {
  window.__dbHook = (k, d) => { send(k, d) }
  try {
    const q = (window.dbHookQ || []).splice(0)
    q.forEach(([k, d]) => send(k, d))
  } catch (e) {}
}

// site_config row = the dashboard's «حفظ» applied to every visitor
async function loadCloudConfig() {
  if (!sb) return
  try {
    const { data, error } = await sb.from('site_config').select('cfg').eq('id', 1).single()
    if (!error && data && data.cfg && Object.keys(data.cfg).length) {
      window.FARHA_CFG = Object.assign({}, window.FARHA_CFG || {}, data.cfg)
      if (typeof window.loadCFG === 'function' && typeof window.render === 'function') {
        window.loadCFG()
        window.render()
      }
    }
  } catch (e) {}
}

// approved wishes appear on every guest's congratulations wall
async function loadCloudWishes() {
  if (!sb) return
  try {
    const { data, error } = await sb
      .from('wishes')
      .select('name,body')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(12)
    if (!error && Array.isArray(data)) window.__dbWishes = data
  } catch (e) {}
}

/* guest invitation link: ?i=slug (&g=guest name for a personal greeting) */
async function loadInvite () {
  try {
    if (!sb) return
    const q = new URLSearchParams(location.search)
    const slug = q.get('i')
    if (!slug) return
    const { data, error } = await sb.from('invitations').select('*').eq('slug', slug).eq('published', true).maybeSingle()
    if (error || !data) return
    window.__inviteSlug = slug
    if (typeof window.__applyInvite === 'function') window.__applyInvite(data.config || {}, q.get('g') || '')
  } catch (e) {}
}


/* ═══ P1#2: upload customer event media to storage, return public URLs ═══ */
function _dataURLtoBlob (dataUrl) {
  try {
    const [head, b64] = dataUrl.split(',')
    const mime = (head.match(/data:([^;]+)/) || [])[1] || 'application/octet-stream'
    const bin = atob(b64); const arr = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
    return new Blob([arr], { type: mime })
  } catch (e) { return null }
}
async function _uploadOne (srcUrl, bucket, ext) {
  try {
    if (!sb || !srcUrl) return null
    if (srcUrl.startsWith('http')) return srcUrl // already remote
    let blob = null
    if (srcUrl.startsWith('data:')) blob = _dataURLtoBlob(srcUrl)
    else if (srcUrl.startsWith('blob:')) { const r = await fetch(srcUrl); blob = await r.blob() }
    if (!blob) return null
    if (blob.size > 25 * 1024 * 1024) return null // 25MB guard
    const path = 'orders/' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.' + (ext || 'bin')
    const { error } = await sb.storage.from(bucket).upload(path, blob, { upsert: true, contentType: blob.type })
    if (error) return null
    const { data } = sb.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  } catch (e) { return null }
}
// Exposed for the checkout flow: turn S.st media into permanent URLs.
window.__uploadEventMedia = async function (st) {
  if (!st || !sb) return st
  try {
    const out = JSON.parse(JSON.stringify({ ...st, photos: [], video: null, track: null }))
    // photos (data-URLs) → photos bucket
    if (Array.isArray(st.photos) && st.photos.length) {
      const ups = await Promise.all(st.photos.slice(0, 8).map((p) => _uploadOne(p, 'photos', 'jpg')))
      out.photos = ups.filter(Boolean)
    }
    // uploaded music track (blob) → music bucket
    if (st.track && st.track.url) {
      const u = await _uploadOne(st.track.url, 'music', 'mp3')
      if (u) out.track = { name: String(st.track.name || 'music').slice(0, 40), url: u }
    }
    // event video (blob) → videos bucket
    if (st.video && st.video.url) {
      const u = await _uploadOne(st.video.url, 'videos', 'mp4')
      if (u) out.video = { name: String(st.video.name || 'video').slice(0, 40), url: u }
    }
    return out
  } catch (e) { return st }
}

hookUp()
loadCloudConfig()
loadCloudWishes()
setTimeout(loadInvite, 900)
