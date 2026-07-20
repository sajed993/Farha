// ═══ فرحة — dashboard backend (Supabase auth + cloud inboxes) ═══
// Loads AFTER the classic dashboard scripts. With a session: cloud mode
// (orders/wishes/RSVPs from every device, «حفظ» publishes to all visitors).
// Without: the login gate, or local demo mode.
import { sb } from '../shared/supabase.js'

let dbOrders = [], dbWishes = [], dbRsvps = [], dbInvitations = []
const $ = (id) => document.getElementById(id)
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]))
const E = (s) => (window.escA ? window.escA(s) : esc(s))
const STS = ['جديد', 'مدفوع', 'مكتمل', 'ملغى']

/* ---------- login gate ---------- */
function showLogin() {
  if ($('dblogin')) return
  const d = document.createElement('form')
  d.id = 'dblogin'
  d.innerHTML = `<style>
  #dblogin{position:fixed;inset:0;z-index:999;background:linear-gradient(160deg,#FBF7EF,#F0E5CF);display:grid;place-items:center;font-family:inherit}
  #dblogin .card{background:#fff;border:1px solid #EDE4D2;border-radius:20px;padding:30px 26px;width:min(360px,90vw);box-shadow:0 30px 80px -30px rgba(90,70,40,.35);text-align:center}
  #dblogin h2{color:#8A6A2B;margin:0 0 4px;font-size:1.25rem}
  #dblogin p{color:#8A7A63;font-size:.78rem;margin:0 0 16px;line-height:1.8}
  #dblogin input{width:100%;border:1.5px solid #E5D9C2;border-radius:11px;padding:12px;margin-bottom:10px;font-size:.9rem;font-family:inherit;box-sizing:border-box}
  #dblogin .go{width:100%;background:linear-gradient(120deg,#D3AC55,#B98A2F);color:#241800;border:none;border-radius:12px;padding:13px;font-weight:800;cursor:pointer;font-size:.95rem}
  #dblogin .err{color:#A33;font-size:.78rem;min-height:1.2em;margin:8px 0 0}
  #dblogin .loc{display:block;margin:12px auto 0;color:#8A7A63;font-size:.74rem;background:none;border:none;cursor:pointer;text-decoration:underline}
  </style>
  <div class="card">
    <h2>فرحة ✦ لوحة التحكم</h2>
    <p>سجّلوا الدخول بحساب المالك الذي أنشأتموه في<br>Supabase → Authentication → Users</p>
    <input id="dbem" type="email" placeholder="البريد الإلكتروني" autocomplete="username" dir="ltr">
    <input id="dbpw" type="password" placeholder="كلمة المرور" autocomplete="current-password" dir="ltr">
    <button class="go" id="dbgo">دخول ☁️</button>
    <div class="err" id="dberr"></div>
    <button class="loc" id="dbloc">متابعة محليًا بدون خادم (وضع تجريبي)</button>
  </div>`
  document.body.appendChild(d)
  d.onsubmit = (e)=>{e.preventDefault();doLogin();}
  $('dbgo').onclick = doLogin
  $('dbpw').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin() })
  $('dbloc').onclick = () => d.remove()
}

async function doLogin() {
  const email = ($('dbem').value || '').trim()
  const password = $('dbpw').value || ''
  $('dberr').textContent = ''
  if (!email || !password) { $('dberr').textContent = 'أدخلوا البريد وكلمة المرور'; return }
  try {
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) { $('dberr').textContent = 'فشل الدخول: ' + error.message; return }
    const d = $('dblogin'); if (d) d.remove()
    enterDb()
  } catch (e) {
    $('dberr').textContent = 'تعذّر الاتصال بالخادم — تحققوا من الإنترنت'
  }
}

/* ---------- cloud mode ---------- */
let __fetching = false
async function fetchAll() {
  if (__fetching) return
  __fetching = true
  try {
    // All four queries fire in PARALLEL (one round-trip instead of four).
    const [o, w, r, iv] = await Promise.all([
      sb.from('orders').select('*').order('created_at', { ascending: false }).limit(200),
      sb.from('wishes').select('*').order('created_at', { ascending: false }).limit(200),
      sb.from('rsvps').select('*').order('created_at', { ascending: false }).limit(500),
      sb.from('invitations').select('*').order('created_at', { ascending: false }).limit(300),
    ])
    if (o && !o.error && Array.isArray(o.data)) dbOrders = o.data
    if (w && !w.error && Array.isArray(w.data)) dbWishes = w.data
    if (r && !r.error && Array.isArray(r.data)) dbRsvps = r.data
    if (iv && !iv.error && Array.isArray(iv.data)) dbInvitations = iv.data
  } catch (e) { console.warn('[farha db] fetchAll', e && e.message) }
  __fetching = false
  window.__dbRows = { orders: dbOrders, rsvps: dbRsvps, wishes: dbWishes, invitations: dbInvitations }
  try { if (typeof window.renderContent === 'function') window.renderContent() } catch (e) {}
}
// realtime bursts can call fetchAll many times/sec — coalesce to one call / 800ms
let __fetchTimer = null
function fetchAllDebounced () {
  if (__fetchTimer) return
  __fetchTimer = setTimeout(() => { __fetchTimer = null; fetchAll() }, 800)
}

function gk(o){const t=String(o.item||'')
  if(/ملكية|ultra/i.test(t))return 'ultra'
  if(/موقع|site/i.test(t))return 'site'
  if(/فيلم|سينما|AI|قبلة|فراشة|القصر|القمر|البندقية|سماء/i.test(t))return 'ai'
  return 'design'}
let __ordQ = '', __ordF = 'all'
window.dbOrdSearch = (v) => { __ordQ = String(v || '').trim().toLowerCase(); const el = document.getElementById('ordListWrap'); if (el) el.innerHTML = ordersListHTML() }
window.dbOrdFilter = (f) => { __ordF = f; try { window.renderContent() } catch (e) {} }
function ordersFiltered () {
  return dbOrders.filter((o) => {
    if (__ordF === 'new' && !(o.status === 'جديد' || !o.status)) return false
    if (__ordF === 'paid' && o.status !== 'مدفوع') return false
    if (__ordF === 'delivered' && !o.inv_slug) return false
    if (__ordF === 'undelivered' && o.inv_slug) return false
    if (!__ordQ) return true
    const hay = [o.id, o.item, o.phone, o.ref, (o.payload && o.payload.c && o.payload.c.n)].join(' ').toLowerCase()
    return hay.includes(__ordQ)
  })
}
function ordersListHTML () {
  const list = ordersFiltered()
  if (!list.length) return `<p class="cmut">لا نتائج مطابقة.</p>`
  return list.slice(0, 80).map((o) => `<div class="ctlrow" style="align-items:flex-start">
      <span><b>#${o.id}</b> · ${E(o.item)} — ${o.price} د.ت<br>
      <small style="color:#8A7A63">${new Date(o.created_at).toLocaleString('ar-TN')}${o.phone ? ' · 📱 ' + E(o.phone) : ''}${o.method ? ' · ' + ({d17:'💳 D17',flouci:'📱 Flouci',rib:'🏦 تحويل بنكي'}[o.method] || o.method) : ''}${o.ref ? ' · 🧾 <b style="color:#8A6210">' + E(o.ref) + '</b>' : ''}</small><br>
      ${o.inv_slug
        ? `<small style="color:#2F6B3A">🎁 دعوة جاهزة: ?i=${E(o.inv_slug)} · 👥 ${dbRsvps.filter(r => r.inv_slug === o.inv_slug).length} ردًا</small><br>
           <button class="cmini" onclick="dbCopyLink('${E(o.inv_slug)}')">🔗 نسخ الرابط</button>
           <button class="cmini" onclick="dbSendLink(${o.id})">📲 إرسالها للزبون</button>
           <button class="cmini" onclick="dbGuestWa(${o.id})">📊 ملخص الردود له</button>
           <button class="cmini" onclick="dbGuestCsv('${E(o.inv_slug)}')">⬇️ CSV</button>
           <button class="cmini" onclick="dbEditNames(${o.id})">✏️ الأسماء</button>
           <button class="cmini" onclick="dbEditFull('${E(o.inv_slug)}')">🎨 فتح وتعديل كامل</button>`
        : `<select class="csel" id="dk${o.id}" style="margin:4px 6px 4px 0;font-size:.72rem">
             <option value="design" ${gk(o)==='design'?'selected':''}>🎴 دعوة تصميم</option>
             <option value="ultra" ${gk(o)==='ultra'?'selected':''}>👑 الباقة الملكية</option>
             <option value="site" ${gk(o)==='site'?'selected':''}>🌐 موقع مناسبة</option>
             <option value="ai" ${gk(o)==='ai'?'selected':''}>🎬 فيلم AI</option></select>
           <button class="cmini" style="background:#B98A2F;border-color:#B98A2F;color:#fff" onclick="dbDeliver(${o.id})">🎁 تأكيد الدفع وتسليم</button>
           <label class="cmini" id="aiup${o.id}" style="display:none;background:#20222A;color:#F3E3B8">📤 اختيار ملف الفيلم<input type="file" accept="video/*" style="display:none" onchange="dbDeliverAi(${o.id},event)"></label>`}
      </span>
      <select class="csel" onchange="dbSetStatus(${o.id},this.value)">
        ${STS.map((s) => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select></div>`).join('')
}
function ordersHTML () {
  const sum = dbOrders.reduce((s, o) => s + (+o.price || 0), 0)
  const nNew = dbOrders.filter((o) => o.status === 'جديد' || !o.status).length
  let h = `<div class="ctlcard" style="margin-bottom:16px"><h3>☁️ طلبات من كل الأجهزة (${dbOrders.length}) — ${sum} د.ت${nNew ? ` · <span style="color:#A33">🔔 ${nNew} جديد</span>` : ''}
    <button class="cmini" onclick="dbRefresh()">تحديث ↻</button></h3>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">
     <input class="cinp" style="flex:1;min-width:150px" placeholder="🔎 ابحثوا بالاسم أو الهاتف أو المرجع أو #الطلب" oninput="dbOrdSearch(this.value)">
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
     ${[['all','الكل'],['new','🆕 جديد'],['paid','💰 مدفوع'],['undelivered','⏳ لم تُسلَّم'],['delivered','🎁 سُلّمت']].map(([k, lbl]) => `<button class="cmini" onclick="dbOrdFilter('${k}')">${lbl}</button>`).join('')}
    </div>`
  if (!dbOrders.length) h += `<p class="cmut">لا طلبات بعد — أول طلب من أي زبون في العالم سيظهر هنا.</p>`
  h += `<div id="ordListWrap">${ordersListHTML()}</div>`
  h += `</div>`
  if (dbRsvps.length) {
    h += `<div class="ctlcard" style="margin-bottom:16px"><h3>💌 ردود الحضور (${dbRsvps.length})</h3>` +
      dbRsvps.slice(0, 30).map((r) => `<div class="ctlrow"><span>
        ${r.attending ? '💛 سيحضرون' : '🙏 اعتذار'} · ${r.guests || 1}
        ${(r.allergies && r.allergies.length) ? '<br><small>⚠️ ' + E(r.allergies.join('، ')) + '</small>' : ''}
        ${r.message ? '<br><small>“' + E(r.message) + '”</small>' : ''}</span>
        <small style="color:#8A7A63">${new Date(r.created_at).toLocaleDateString('ar-TN')}</small></div>`).join('') + `</div>`
  }
  return h
}

function wishesHTML() {
  const list = [...dbWishes].sort((a, b) => (a.approved === b.approved) ? 0 : (a.approved ? 1 : -1))
  let h = `<div class="ctlcard" style="margin-bottom:16px"><h3>☁️ تهانٍ من كل الأجهزة (${dbWishes.length})
    <button class="cmini" onclick="dbRefresh()">تحديث ↻</button></h3>`
  if (!list.length) h += `<p class="cmut">لا تهاني بعد.</p>`
  h += list.slice(0, 50).map((w) => `<div class="ctlrow">
      <span>“${E(w.body)}” — <b>${E(w.name || 'ضيف')}</b></span>
      <span style="display:flex;gap:6px">
        <button class="cmini ${w.approved ? 'ok' : ''}" onclick="dbWishOk(${w.id},${!w.approved})">${w.approved ? 'منشورة ✓' : 'نشر'}</button>
        <button class="cmini del" onclick="dbWishDel(${w.id})">حذف</button>
      </span></div>`).join('')
  return h + `</div>`
}

function connectedBadge() {
  if ($('dbbadge')) return
  const b = document.createElement('div')
  b.id = 'dbbadge'
  b.style.cssText = 'position:fixed;bottom:14px;inset-inline-end:14px;z-index:500;background:#1E4A28;color:#EFFBF2;border-radius:99px;padding:8px 14px;font-size:.72rem;font-weight:700;display:flex;gap:10px;align-items:center;box-shadow:0 10px 26px -10px rgba(20,60,30,.6)'
  b.innerHTML = '☁️ متصل بقاعدة البيانات <button id="dbout" style="background:none;border:none;color:#BFE8CB;cursor:pointer;text-decoration:underline;font-size:.72rem;font-family:inherit">خروج</button>'
  document.body.appendChild(b)
  $('dbout').onclick = async () => { try { await sb.auth.signOut() } catch (e) {} location.reload() }
}

function enterDb() {
  window.__dbMode = true
  try { if (window.Notification && Notification.permission === 'default') Notification.requestPermission() } catch (e) {}
  window.__dbOrdersHTML = ordersHTML
  window.__dbWishesHTML = wishesHTML
  window.dbRefresh = fetchAll
  function siteRoot () {
    let p = location.pathname.replace(/admin(\.html)?\/?$/, '')
    if (!p.endsWith('/')) p += '/'
    return location.origin + p
  }
  function dbWaLink (phone, link) {
    let n = String(phone).replace(/\D/g, ''); if (n.slice(0, 2) === '00') n = n.slice(2); if (n.length === 8) n = '216' + n
    window.open('https://wa.me/' + n + '?text=' + encodeURIComponent('🎁 مبروك! دعوتكم من فرحة جاهزة:\n' + link + '\nافتحوها والمسوا الختم ✨ ثم شاركوها مع ضيوفكم 💛'), '_blank')
  }
  async function invCreate (o, config) {
    let slug = o.inv_slug
    if (!slug) {
      slug = 'inv-' + Date.now().toString(36) + Math.floor(Math.random() * 46656).toString(36)
      const { error } = await sb.from('invitations').insert({ slug, order_id: o.id, design_id: (config && config.design) || 1, config, published: true })
      if (error) { toast('تعذّر إنشاء الدعوة — شغّلوا schema-3-delivery.sql أولًا'); return }
      await sb.from('orders').update({ inv_slug: slug, status: 'مدفوع' }).eq('id', o.id)
      o.inv_slug = slug
    }
    const link = siteRoot() + '?i=' + slug
    try { await navigator.clipboard.writeText(link) } catch (e) {}
    toast('🎁 أُنشئ التسليم ونُسخ الرابط ✓')
    if (o.phone) dbWaLink(o.phone, link)
    fetchAll()
  }
  window.dbDeliver = async (id) => {
    const o = dbOrders.find((x) => String(x.id) === String(id)); if (!o) return
    const okPay = confirm('💰 تأكيد استلام الدفع؟\n\nتحقّقوا من:\n· وصول ' + (o.price||'') + ' د.ت إلى D17\n· تطابق المرجع 🧾 ' + (o.ref || '—') + '\n· رقم المُرسِل ' + (o.phone || '—') + '\n\nبعد التأكيد تُنشأ الدعوة وتُرسل للزبون.')
    if (!okPay) return
    const kEl = document.getElementById('dk' + id)
    const kind = (kEl && kEl.value) || 'design'
    const pl = o.payload || {}
    if (kind === 'ai') {
      const lb = document.getElementById('aiup' + id)
      if (lb) { lb.style.display = 'inline-flex'; toast('📤 اختاروا ملف الفيلم — يُرفع ويُسلَّم برابط خاص') }
      return
    }
    let config
    if (kind === 'ultra') config = { kind: 'ultra', uIdx: pl.uIdx || 0, c: pl.c || {}, design: pl.design || 1 }
    else if (kind === 'site') config = { kind: 'site', st: pl.st || {}, c: pl.c || {}, design: pl.design || 1 }
    else config = { kind: 'design', design: pl.design || 1, c: pl.c || {} }
    await invCreate(o, config)
  }
  window.dbDeliverAi = async (id, ev) => {
    const o = dbOrders.find((x) => String(x.id) === String(id)); if (!o) return
    const file = ev.target.files && ev.target.files[0]; if (!file) return
    toast('جارٍ رفع الفيلم… ⏳')
    try {
      const url = await window.__dbUpload(file, 'videos')
      await invCreate(o, { kind: 'ai', video: url, title: o.item, design: 1 })
    } catch (e) { toast('تعذّر الرفع — تأكدوا من schema-2') }
    ev.target.value = ''
  }
  window.dbEditFull = (slug) => {
    if (!slug) return
    const base = location.origin + location.pathname.replace(/admin(\.html)?\/?$/, '')
    window.open(base + '?edit=' + encodeURIComponent(slug), '_blank')
  }
  window.dbEditNames = async (id) => {
    const o = dbOrders.find((x) => String(x.id) === String(id)); if (!o || !o.inv_slug) return
    const cur = (o.payload && o.payload.c && o.payload.c.n) || ''
    const next = prompt('✏️ تعديل أسماء الدعوة (كما تظهر للضيوف):', cur)
    if (next == null) return
    try {
      const { data } = await sb.from('invitations').select('config').eq('slug', o.inv_slug).maybeSingle()
      const cfg = (data && data.config) || (o.payload || {})
      cfg.c = Object.assign({}, cfg.c || {}, { n: String(next).slice(0, 80) })
      const { error } = await sb.from('invitations').update({ config: cfg }).eq('slug', o.inv_slug)
      if (error) { toast('تعذّر التعديل'); return }
      if (o.payload) { o.payload.c = Object.assign({}, o.payload.c || {}, { n: cfg.c.n }) }
      toast('✏️ حُدّثت الأسماء — تظهر فورًا للضيوف')
    } catch (e) { toast('تعذّر التعديل') }
  }
  window.dbSendLink = (id) => {
    const o = dbOrders.find((x) => String(x.id) === String(id)); if (!o || !o.inv_slug) return
    const link = siteRoot() + '?i=' + o.inv_slug
    if (o.phone) dbWaLink(o.phone, link)
    else { try { navigator.clipboard.writeText(link); toast('لا رقم مسجّل — نُسخ الرابط') } catch (e) {} }
  }
  window.dbGuestWa = (id) => {
    const o = dbOrders.find((x) => String(x.id) === String(id)); if (!o || !o.inv_slug) return
    const rs = dbRsvps.filter((r) => r.inv_slug === o.inv_slug)
    const yes = rs.filter((r) => r.attending !== false)
    const no = rs.filter((r) => r.attending === false)
    const gsum = yes.reduce((a, r) => a + (Number(r.guests) || 1), 0)
    let msg = '📊 ردود دعوتكم حتى الآن:\n✅ سيحضرون: ' + yes.length + ' (مجموع الضيوف ' + gsum + ')\n🙏 اعتذروا: ' + no.length
    rs.slice(0, 20).forEach((r) => { msg += '\n· ' + (r.name || 'ضيف') + (r.attending === false ? ' ❌' : ' ✅') + (r.guests ? ' ×' + r.guests : '') })
    if (rs.length > 20) msg += '\n… والبقية في ملف CSV'
    if (o.phone) dbWaText(o.phone, msg)
    else { try { navigator.clipboard.writeText(msg); toast('نُسخ الملخص') } catch (e) {} }
  }
  window.dbGuestCsv = (slug) => {
    const rs = dbRsvps.filter((r) => r.inv_slug === slug)
    const esc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'
    let csv = '\uFEFFالاسم,سيحضر,عدد الضيوف,الحساسيات,ملاحظات,التاريخ\n'
    rs.forEach((r) => { csv += [esc(r.name), r.attending === false ? 'لا' : 'نعم', r.guests || 1, esc(r.allergies), esc(r.message || r.other), esc((r.created_at || '').slice(0, 10))].join(',') + '\n' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    a.download = 'farha-rsvps-' + slug + '.csv'
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000)
    toast('⬇️ نُزّل ملف الردود')
  }
  function dbWaText (phone, text) {
    let n = String(phone).replace(/\D/g, ''); if (n.slice(0, 2) === '00') n = n.slice(2); if (n.length === 8) n = '216' + n
    window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(text), '_blank')
  }
  window.dbCopyLink = (slug) => {
    const link = siteRoot() + '?i=' + slug
    try { navigator.clipboard.writeText(link); toast('🔗 نُسخ رابط الدعوة') } catch (e) {}
  }
  window.dbSetStatus = async (id, v) => {
    try { await sb.from('orders').update({ status: v }).eq('id', id) } catch (e) {}
    if (typeof window.toast === 'function') window.toast('☁️ حُدّثت حالة الطلب #' + id)
    fetchAll()
  }
  window.dbWishOk = async (id, to) => {
    try { await sb.from('wishes').update({ approved: to }).eq('id', id) } catch (e) {}
    if (typeof window.toast === 'function') window.toast(to ? '☁️ نُشرت لكل الزوّار' : 'أُخفيت')
    fetchAll()
  }
  window.dbWishDel = async (id) => {
    try { await sb.from('wishes').delete().eq('id', id) } catch (e) {}
    fetchAll()
  }
  window.__dbUpload = async (file, bucket) => {
    const path = Date.now() + '-' + String(file.name || 'file').replace(/[^\w.\-]/g, '_').slice(-60)
    const { error } = await sb.storage.from(bucket || 'videos').upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = sb.storage.from(bucket || 'videos').getPublicUrl(path)
    return data.publicUrl
  }
  window.__dbSaveCfg = async (cfg) => {
    try {
      const { error } = await sb.from('site_config').update({ cfg, updated_at: new Date().toISOString() }).eq('id', 1)
      if (!error && typeof window.toast === 'function') window.toast('☁️ نُشر لكل الزوّار مباشرة')
    } catch (e) {}
  }
  connectedBadge()
  fetchAll()
  // realtime: new orders/wishes pop in live; harmless if the socket fails
  try {
    sb.channel('farha-inbox')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (p) => { notifyNewOrder(p && p.new); fetchAllDebounced() })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, () => fetchAllDebounced())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, () => fetchAllDebounced())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wishes' }, () => fetchAllDebounced())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, () => fetchAllDebounced())
      .subscribe()
  } catch (e) {}
}

/* ---------- boot ---------- */
async function openSiteWindow(){
 const site=window.location.href.split('/admin')[0]; // Get domain from current URL
 window.open(site,'_blank');
}
window.openSite=openSiteWindow;
async function start() {
  if (!sb) return // library failed → local demo mode, dashboard works as before
  let session = null
  try { const r = await sb.auth.getSession(); session = r && r.data && r.data.session } catch (e) {}
  if (session) enterDb()
  else showLogin()
}
start()
