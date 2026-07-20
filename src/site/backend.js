// ═══ فرحة — site backend (Supabase wiring) ═══
// Loads AFTER the classic app scripts. Everything here is fire-and-forget:
// if the database is unreachable, the site keeps working in local mode.
import { sb } from '../shared/supabase.js'

const TABLE = { order: 'orders', wish: 'wishes', rsvp: 'rsvps', event: 'events' }

function rowFor(kind, d) {
  d = d || {}
  if (kind === 'order')
    return { item: String(d.item || '').slice(0, 120), price: +d.price || 0, phone: d.phone ? String(d.phone).slice(0, 20) : null, customer_name: d.customer_name ? String(d.customer_name).slice(0, 60) : null, ref: d.ref ? String(d.ref).slice(0,12) : null, method: d.method ? String(d.method).slice(0,10) : 'd17', payload: d.payload || null }
  if (kind === 'wish')
    return { name: String(d.name || 'ضيف').slice(0, 40), body: String(d.body || '').slice(0, 200) }
  if (kind === 'rsvp')
    return {
      inv_slug: d.inv_slug ? String(d.inv_slug).slice(0, 64) : (window.__inviteSlug || null),
      attending: !!d.attending,
      guests: Math.min(50, Math.max(1, Math.floor(+d.guests) || 1)),
      allergies: Array.isArray(d.allergies) ? d.allergies.slice(0, 10) : [],
      other: String(d.other || '').slice(0, 120),
      message: String(d.message || '').slice(0, 300),
    }
  if (kind === 'event')
    return {
      kind: String(d.kind || 'open').slice(0, 30),
      inv_slug: d.inv_slug ? String(d.inv_slug).slice(0, 64) : (window.__inviteSlug || null),
      device: d.device || _device(),
      path: (location.pathname + location.search).slice(0, 120),
    }
  return null
}

// core columns guaranteed to exist even on a fresh base schema
const CORE = {
  order: (r) => ({ item: r.item, price: r.price, phone: r.phone, customer_name: r.customer_name }),
  wish: (r) => ({ name: r.name, body: r.body }),
  rsvp: (r) => ({ attending: r.attending, guests: r.guests, message: r.message }),
  event: (r) => ({ kind: r.kind }),
}
async function send(kind, d) {
  if (!sb) return
  const table = TABLE[kind]
  const row = rowFor(kind, d)
  if (!table || !row) return
  try {
    const { error } = await sb.from(table).insert(row)
    if (!error) { if (kind === "order") _notifyOwner(row); return }
    // A missing column (schema not fully migrated) rejects the whole row.
    // Never lose the order: retry with the core columns that always exist.
    console.warn('[farha db] full insert failed, retrying core:', error.message)
    const core = (CORE[kind] || ((r) => r))(row)
    const { error: e2 } = await sb.from(table).insert(core)
    if (e2) console.warn('[farha db] core insert failed:', e2.message)
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
    track('open', { inv_slug: slug })
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


/* ═══ owner order-editing: load ?edit=slug into the editor, save back ═══ */
async function loadForEdit () {
  try {
    if (!sb) return
    const q = new URLSearchParams(location.search)
    const slug = q.get('edit')
    if (!slug) return
    const { data: sess } = await sb.auth.getSession()
    if (!sess || !sess.session) { // must be the owner
      alert('هذه الصفحة للمالك فقط — سجّلوا الدخول من لوحة التحكم.')
      return
    }
    const { data, error } = await sb.from('invitations').select('config,slug').eq('slug', slug).maybeSingle()
    if (error || !data) { alert('لم يُعثر على الدعوة'); return }
    if (typeof window.__loadForEdit === 'function') window.__loadForEdit(data.config || {}, data.slug)
  } catch (e) { console.warn('loadForEdit', e && e.message) }
}
window.__sbSaveInvite = async function (slug, config) {
  try {
    if (!sb || !slug) return false
    const { error } = await sb.from('invitations').update({ config }).eq('slug', slug)
    return !error
  } catch (e) { return false }
}
window.__sbSaveTemplate = async function (name, config) {
  try {
    if (!sb) return false
    const { error } = await sb.from('templates').insert({ name: String(name).slice(0, 60), config })
    return !error
  } catch (e) { return false }
}


/* ═══ real analytics: device + event tracking + live presence ═══ */
function _device () {
  try { const w = window.innerWidth; if (w <= 640) return 'phone'; if (w <= 1024) return 'tablet'; return 'desktop' } catch (e) { return 'phone' }
}
let _tracked = {}
function track (kind, extra) {
  try {
    const key = kind + ((extra && extra.inv_slug) || '')
    if (_tracked[key]) return
    _tracked[key] = 1
    if (window.__dbHook) window.__dbHook('event', Object.assign({ kind }, extra || {}))
  } catch (e) {}
}
window.__track = track
let _presence = null
async function startPresence () {
  try {
    if (!sb || _presence) return
    _presence = sb.channel('presence-site', { config: { presence: { key: 'v-' + Math.random().toString(36).slice(2) } } })
    await _presence.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') await _presence.track({ at: Date.now(), device: _device(), slug: window.__inviteSlug || null })
    })
  } catch (e) {}
}


function _notifyOwner (row) {
  try {
    fetch("/.netlify/functions/notify-order", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: row.item, price: row.price, phone: row.phone, name: row.customer_name, method: row.method, ref: row.ref }),
      keepalive: true,
    }).catch(function () {})
  } catch (e) {}
}

hookUp()
loadCloudConfig()
loadCloudWishes()
setTimeout(loadInvite, 900)
setTimeout(function () { track('view'); startPresence() }, 1200)
setTimeout(loadForEdit, 1000)
