// ═══ فرحة — dashboard backend (Supabase auth + cloud inboxes) ═══
// Loads AFTER the classic dashboard scripts. With a session: cloud mode
// (orders/wishes/RSVPs from every device, «حفظ» publishes to all visitors).
// Without: the login gate, or local demo mode.
import { sb } from '../shared/supabase.js'

let dbOrders = [], dbWishes = [], dbRsvps = [], dbInvitations = [], dbEvents = []
const $ = (id) => document.getElementById(id)
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]))
const E = (s) => (window.escA ? window.escA(s) : esc(s))
const STS = ['جديد', 'مدفوع', 'مكتمل', 'ملغى']

/* ---------- login gate ---------- */
/* the only two ways the panel becomes visible: a confirmed session, or the
   login form itself */
function revealShell () {
  const a = document.getElementById('app'); if (a) a.hidden = false
  const b = document.getElementById('dbboot'); if (b) b.remove()
}
function showLogin() {
  revealShell()
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
let __origTitle = (typeof document !== 'undefined' && document.title) || 'فرحة'
let __titleFlash = null
function notifyNewOrder (row) {
  try {
    const item = (row && row.item) || 'طلب جديد'
    const price = (row && row.price) ? (' — ' + row.price + ' د.ت') : ''
    // 1) toast
    try { toast('🔔 طلب جديد: ' + item + price) } catch (e) {}
    // 2) flashing browser-tab title (so you notice even on another tab)
    try {
      clearInterval(__titleFlash)
      let on = true
      __titleFlash = setInterval(() => { document.title = on ? ('🔔 طلب جديد! — فرحة') : __origTitle; on = !on }, 900)
      setTimeout(() => { clearInterval(__titleFlash); document.title = __origTitle }, 12000)
    } catch (e) {}
    // 3) sound
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)()
      ;[880, 1175].forEach((f, i) => {
        const o = a.createOscillator(); const g = a.createGain()
        o.frequency.value = f; g.gain.value = 0.09
        o.connect(g).connect(a.destination); o.start(a.currentTime + i * 0.18); o.stop(a.currentTime + i * 0.18 + 0.16)
      })
    } catch (e) {}
    // 4) desktop notification (if the owner allowed it)
    try {
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('فرحة — طلب جديد 🔔', { body: item + price, tag: 'farha-order' })
      }
    } catch (e) {}
  } catch (e) {}
}
let __fetching = false
async function fetchAll() {
  if (__fetching) return
  __fetching = true
  try {
    // All four queries fire in PARALLEL (one round-trip instead of four).
    const [o, w, r, iv, ev] = await Promise.all([
      sb.from('orders').select('id,item,price,customer_name,phone,status,ref,method,inv_slug,created_at').order('created_at', { ascending: false }).limit(200),
      sb.from('wishes').select('*').order('created_at', { ascending: false }).limit(200),
      sb.from('rsvps').select('*').order('created_at', { ascending: false }).limit(500),
      sb.from('invitations').select('*').order('created_at', { ascending: false }).limit(300),
      sb.from('events').select('*').order('created_at', { ascending: false }).limit(2000),
    ])
    if (o && !o.error && Array.isArray(o.data)) dbOrders = o.data
    if (w && !w.error && Array.isArray(w.data)) dbWishes = w.data
    if (r && !r.error && Array.isArray(r.data)) dbRsvps = r.data
    if (iv && !iv.error && Array.isArray(iv.data)) dbInvitations = iv.data
    if (ev && !ev.error && Array.isArray(ev.data)) dbEvents = ev.data
  } catch (e) { console.warn('[farha db] fetchAll', e && e.message) }
  __fetching = false
  window.__dbRows = { orders: dbOrders, rsvps: dbRsvps, wishes: dbWishes, invitations: dbInvitations, events: dbEvents }
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
// design id -> visual palette (kept in sync with 02-data.js)
const DTHUMB={1:{bg:'#FFF9EC',ac:'#B98A2F',ink:'#3A2B10',orn:'✨'},2:{bg:'#16493E',ac:'#D3AC55',ink:'#F1EADA',orn:'🕌'},3:{bg:'#FCFBF7',ac:'#9A8C7B',ink:'#3A342C',orn:'🕊️'},4:{bg:'#FBEFEA',ac:'#C4827A',ink:'#4E2F2A',orn:'🌹'},5:{bg:'#EDF1FA',ac:'#5570B8',ink:'#22304F',orn:'🎓'},6:{bg:'#1B1710',ac:'#E3C77E',ink:'#F6EBD2',orn:'🎓'},7:{bg:'#FFF4F0',ac:'#E58BA6',ink:'#54333E',orn:'🎈'},8:{bg:'#EFF3EC',ac:'#7C9482',ink:'#2F3E33',orn:'☁️'},9:{bg:'#F6EDD9',ac:'#B98A2F',ink:'#4C3A17',orn:'🥂'},10:{bg:'#F6F0E2',ac:'#8A6A2B',ink:'#4C3A17',orn:'🪔'},11:{bg:'#FBF3EC',ac:'#B98A2F',ink:'#4E342B',orn:'📖'}}
const KINDICON={design:'🎴',ultra:'👑',site:'🌐',ai:'🎬'}
// resolve palette for an order: prefer its saved config colors, else the design default
function _thumbPal(o){
  try{const p=o.payload||{};const c=p.c||{};const d=DTHUMB[p.design]||DTHUMB[1]||{}
    return {bg:c.bg||d.bg||'#FFF9EC',ac:c.ac||d.ac||'#B98A2F',ink:c.ink||d.ink||'#3A2B10',orn:c.orn||d.orn||'✨',kind:gk(o)}}
  catch(e){return {bg:'#FFF9EC',ac:'#B98A2F',ink:'#3A2B10',orn:'✨',kind:'design'}}
}
// small CSS invitation thumbnail for an order row
function miniThumb(o){
  const pal=_thumbPal(o);const nm=orderName(o)||(o.payload&&o.payload.c&&o.payload.c.n)||''
  const isVid=pal.kind==='ai'||pal.kind==='site'
  return `<div class="miniThumb" onclick="dbPreview(${o.id})" title="${o.inv_slug?'اضغطوا للمعاينة':'معاينة أولية'}" style="cursor:pointer;flex:0 0 auto;width:52px;height:70px;border-radius:8px;overflow:hidden;border:1.5px solid ${pal.ac};background:${pal.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:0 1px 4px rgba(0,0,0,.12)">
    <div style="font-size:15px;line-height:1">${isVid?KINDICON[pal.kind]:pal.orn}</div>
    <div style="width:60%;height:2px;background:${pal.ac};border-radius:2px"></div>
    <div style="font-size:6.5px;color:${pal.ink};font-weight:700;text-align:center;padding:0 3px;line-height:1.15;max-height:22px;overflow:hidden">${E(String(nm).slice(0,18))||'&nbsp;'}</div>
    <div style="width:40%;height:2px;background:${pal.ac};opacity:.6;border-radius:2px"></div>
  </div>`
}
// big preview modal — lazy-loads payload for a faithful mini invitation
window.dbPreview = async (id) => {
  const o = dbOrders.find((x) => String(x.id) === String(id)); if (!o) return
  let host = document.getElementById('previewModal')
  if (!host) { host = document.createElement('div'); host.id = 'previewModal'; document.body.appendChild(host) }
  host.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(20,15,8,.72);display:flex;align-items:center;justify-content:center;padding:20px'
  host.innerHTML = '<div style="color:#F3E3B8;font-family:sans-serif">⏳ جارٍ التحميل…</div>'
  host.onclick = (e) => { if (e.target === host) host.remove() }
  if (typeof ensurePayload === 'function') { try { await ensurePayload(o) } catch (e) {} }
  const pal = _thumbPal(o); const p = o.payload || {}; const c = p.c || {}
  const nm = orderName(o) || c.n || ''; const dt = c.d || ''; const pl = c.p || ''; const msg = c.m || ''
  const isVid = pal.kind === 'ai' || pal.kind === 'site'
  host.innerHTML = `<div style="max-width:340px;width:100%;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.4)">
    <div style="background:${pal.bg};padding:30px 22px;text-align:center;border-bottom:3px solid ${pal.ac}">
      <div style="font-size:34px;margin-bottom:8px">${isVid?KINDICON[pal.kind]:pal.orn}</div>
      <div style="height:2px;width:44px;background:${pal.ac};margin:10px auto"></div>
      <div style="font-family:Georgia,serif;font-size:1.4rem;color:${pal.ink};font-weight:700;margin:6px 0">${E(nm)||'—'}</div>
      ${dt?`<div style="color:${pal.ink};opacity:.85;font-size:.9rem;margin-top:6px">📅 ${E(dt)}</div>`:''}
      ${pl?`<div style="color:${pal.ink};opacity:.85;font-size:.9rem">📍 ${E(pl)}</div>`:''}
      ${msg?`<div style="color:${pal.ink};opacity:.7;font-size:.78rem;margin-top:10px;font-style:italic;line-height:1.6">${E(String(msg).slice(0,120))}</div>`:''}
      <div style="height:2px;width:44px;background:${pal.ac};margin:14px auto 0"></div>
    </div>
    <div style="padding:14px;background:#faf7f0;display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
      <span style="font-size:.72rem;color:#8A7A63">${KINDICON[pal.kind]||''} ${E(o.item)} · ${o.price} د.ت</span>
      ${o.inv_slug?`<button class="cmini" onclick="dbEditFull('${E(o.inv_slug)}')">🎨 فتح وتعديل كامل</button>`:'<span style="font-size:.7rem;color:#A33">معاينة أولية — لم تُسلَّم بعد</span>'}
      <button class="cmini" onclick="document.getElementById('previewModal').remove()">إغلاق ✕</button>
    </div>
  </div>`
}
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
    const hay = [o.id, o.item, o.phone, o.ref, orderName(o)].join(' ').toLowerCase()
    return hay.includes(__ordQ)
  })
}
function orderName (o) {
    try {
      const p = o.payload || {}
      const c = p.c || {}
      return (o.customer_name || c.n || c.name || p.name || '').toString().trim()
    } catch (e) { return '' }
  }
  function ordersListHTML () {
  const list = ordersFiltered()
  if (!list.length) return `<p class="cmut">لا نتائج مطابقة.</p>`
  return list.slice(0, 80).map((o) => `<div class="ctlrow" style="align-items:flex-start;gap:10px">
      ${miniThumb(o)}
      <span style="flex:1">${orderName(o) ? '<b style="color:#8A6210;font-size:1.02em">👤 ' + E(orderName(o)) + '</b><br>' : ''}<b>#${o.id}</b> · ${E(o.item)} — ${o.price} د.ت<br>
      <small style="color:#8A7A63">${new Date(o.created_at).toLocaleString('ar-TN')}${o.phone ? ' · 📱 ' + E(o.phone) : ''}${o.method ? ' · ' + ({d17:'💳 D17',flouci:'📱 Flouci',rib:'🏦 تحويل بنكي'}[o.method] || o.method) : ''}${o.ref ? ' · 🧾 <b style="color:#8A6210">' + E(o.ref) + '</b>' : ''}</small><br>
      ${o.inv_slug
        ? `<small style="color:#2F6B3A">🎁 دعوة جاهزة: ?i=${E(o.inv_slug)} · 👥 ${dbRsvps.filter(r => r.inv_slug === o.inv_slug).length} ردًا</small><br>
           <button class="cmini" onclick="dbCopyLink('${E(o.inv_slug)}')">🔗 نسخ الرابط</button>
           <button class="cmini" onclick="dbSendLink(${o.id})">📲 إرسالها للزبون</button>
           <button class="cmini" onclick="dbGuestWa(${o.id})">📊 ملخص الردود له</button>
           <button class="cmini" onclick="dbGuestCsv('${E(o.inv_slug)}')">⬇️ CSV</button>
           <button class="cmini" onclick="dbGuestLink('${E(o.inv_slug)}')">🔗 رابط الضيوف للأصحاب</button>
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
  revealShell()
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
    const _em = { gift: String.fromCodePoint(0x1F381), spark: String.fromCodePoint(0x2728), heart: String.fromCodePoint(0x1F49B) }
    window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(_em.gift + ' مبروك! دعوتكم من فرحة جاهزة:\n' + link + '\nافتحوها والمسوا الختم ' + _em.spark + ' ثم شاركوها مع ضيوفكم ' + _em.heart), '_blank')
  }
  /* An invitation link is the only thing standing between a stranger and a
     couple's names, date, venue and guest list, so it has to be unguessable.
     The old slug was a timestamp plus three base-36 characters: the timestamp
     is roughly when the order was delivered, which leaves 46,656 tries.
     This is 20 characters from the OS random source — about 100 bits — using
     an alphabet with no 0/O or 1/l/I, so it survives being read aloud. */
  const SLUG_ABC = '23456789abcdefghjkmnpqrstuvwxyz'
  function randomId (len) {
    const a = new Uint8Array(len)
    crypto.getRandomValues(a)
    let out = ''
    for (let i = 0; i < len; i++) out += SLUG_ABC[a[i] % SLUG_ABC.length]
    return out
  }

  /* Turn a request-form order into a real invitation: the customer's own words
     where they gave them, and the film they chose already dressed on it, so
     delivering is a check rather than a retype. */
  function configFromRequest (pl) {
    const f = (typeof readyCatalogue === 'function' && pl.filmId)
      ? readyCatalogue().find((x) => x.id === pl.filmId) : null
    const c = {}
    if (pl.names) c.n = String(pl.names).slice(0, 80)
    if (pl.place) c.p = String(pl.place).slice(0, 80)
    if (pl.msg) c.m = String(pl.msg).slice(0, 300)
    if (pl.when) {
      c.d = String(pl.when).slice(0, 40)          // shown as written
      /* The countdown wants a moment, not a day. It must NOT go through
         Date.parse and toISOString: a bare "19:30" is read as local time and
         written back as UTC, so a wedding at half past seven was stored as
         half past six. Both halves are already in the shape S.c.when wants —
         a local wall clock — so they are simply joined. */
      const time = /^\d{2}:\d{2}$/.test(pl.time || '') ? pl.time : '19:00'
      if (/^\d{4}-\d{2}-\d{2}$/.test(pl.when)) c.when = pl.when + 'T' + time
    }
    const config = { kind: 'design', design: (f && f.design) || 1, c }
    if (f) {
      /* Whatever the dashboard set for this film wins over what shipped with
         it — the same order the shelf uses when the customer previews it.
         Without this, delivery read the catalogue alone: a song uploaded here
         was ignored, the stretch it was trimmed to was ignored, and the
         customer received a different invitation from the one they chose. */
      const o = (typeof readyCfg === 'function') ? readyCfg(f.id) : {}
      config.film = f.id
      config.films = { hero: f.v, hall: f.v, detail: f.v, date: f.v, venue: f.p }
      config.ediPal = f.id
      config.ediSw = f.sw || null
      config.envStyle = o.env || ''
      config.vidStyle = o.vid || ''
      config.trackUrl = o.snd || f.snd || ''
      config.trackName = o.sndN || f.sndN || ''
      config.trackFrom = +o.snd0 || 0
      config.trackTo = +o.snd1 || 0
      config.anim = 'edi'
      config.music = 1
    }
    return config
  }

  async function invCreate (o, config) {
    let slug = o.inv_slug
    if (!slug) {
      slug = 'i' + randomId(20)
      /* the guest list gets a second secret of its own: without it, every
         guest holding an invitation could swap ?i= for ?guests= and read the
         names and private messages of everyone else invited */
      const list_key = randomId(24)
      const { error } = await sb.from('invitations').insert({ slug, list_key, order_id: o.id, design_id: (config && config.design) || 1, config, published: true })
      if (error) { toast('تعذّر إنشاء الدعوة — شغّلوا schema-10-locks.sql أولًا'); return }
      await sb.from('orders').update({ inv_slug: slug, status: 'مدفوع' }).eq('id', o.id)
      o.inv_slug = slug
    }
    const link = siteRoot() + '?i=' + slug
    try { await navigator.clipboard.writeText(link) } catch (e) {}
    toast('🎁 أُنشئ التسليم ونُسخ الرابط ✓')
    if (o.phone) dbWaLink(o.phone, link)
    fetchAll()
  }

  /* the couple's own guest-list page — slug and key, and nothing else works */
  window.dbGuestLink = async (slug) => {
    if (!slug) return
    try {
      const { data } = await sb.from('invitations').select('list_key').eq('slug', slug).maybeSingle()
      let key = data && data.list_key
      if (!key) {                       /* an invitation made before the keys existed */
        key = randomId(24)
        await sb.from('invitations').update({ list_key: key }).eq('slug', slug)
      }
      const link = siteRoot() + '?guests=' + encodeURIComponent(slug) + '&k=' + encodeURIComponent(key)
      try { await navigator.clipboard.writeText(link) } catch (e) {}
      toast('🔗 نُسخ رابط قائمة الضيوف — للأصحاب فقط')
      return link
    } catch (e) { toast('تعذّر إنشاء الرابط') }
  }
  // The list fetch is light (no payload, to avoid DB timeouts). When we actually
  // need the full design — delivering or editing — fetch just that one row's payload.
  async function ensurePayload (o) {
    if (o.payload) return o.payload
    try {
      const { data } = await sb.from('orders').select('payload').eq('id', o.id).maybeSingle()
      o.payload = (data && data.payload) || {}
    } catch (e) { o.payload = {} }
    return o.payload
  }
  window.dbDeliver = async (id) => {
    const o = dbOrders.find((x) => String(x.id) === String(id)); if (!o) return
    const okPay = confirm('💰 تأكيد استلام الدفع؟\n\nتحقّقوا من:\n· وصول ' + (o.price||'') + ' د.ت إلى D17\n· تطابق المرجع 🧾 ' + (o.ref || '—') + '\n· رقم المُرسِل ' + (o.phone || '—') + '\n\nبعد التأكيد تُنشأ الدعوة وتُرسل للزبون.')
    if (!okPay) return
    const kEl = document.getElementById('dk' + id)
    const kind = (kEl && kEl.value) || 'design'
    const pl = await ensurePayload(o)
    if (kind === 'ai') {
      const lb = document.getElementById('aiup' + id)
      if (lb) { lb.style.display = 'inline-flex'; toast('📤 اختاروا ملف الفيلم — يُرفع ويُسلَّم برابط خاص') }
      return
    }
    let config
    if (kind === 'ultra') config = { kind: 'ultra', uIdx: pl.uIdx || 0, c: pl.c || {}, design: pl.design || 1 }
    else if (kind === 'site') config = { kind: 'site', st: pl.st || {}, c: pl.c || {}, design: pl.design || 1 }
    /* An order from the site's request form carries what the customer typed —
       the names, the date, the place, the film they picked — but none of it in
       the shape a design config wants. Left alone it delivered an invitation
       with placeholder names, and everything had to be retyped by hand. */
    else if (pl.tier || pl.filmId || pl.choice) config = configFromRequest(pl)
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
    // LIVE visitor presence: count everyone currently on the customer site
    try {
      const pres = sb.channel('presence-site', { config: { presence: { key: 'dashboard-' + Math.random().toString(36).slice(2) } } })
      pres.on('presence', { event: 'sync' }, () => {
        try {
          const state = pres.presenceState()
          // count non-dashboard keys
          let n = 0
          Object.keys(state).forEach((k) => { if (k.indexOf('dashboard-') !== 0) n += (state[k] || []).length })
          window.__liveCount = n
          const el = document.getElementById('liveDot')
          if (el) el.textContent = String(n)
          if (S.tab === 'ana' && typeof window.renderContent === 'function') { /* live number updates via el */ }
        } catch (e) {}
      })
      pres.subscribe()
    } catch (e) {}
  } catch (e) {}
}

/* ---------- boot ---------- */
async function openSiteWindow(){
 const site=window.location.href.split('/admin')[0]; // Get domain from current URL
 window.open(site,'_blank');
}
window.openSite=openSiteWindow;
async function start() {
  if (!sb) {
    /* No library means no way to verify anyone. Previously this fell through
       to "local demo mode" with the whole panel on screen; now it asks for a
       sign-in it cannot complete, which is the safe direction to fail. */
    showLogin()
    const e = document.getElementById('dberr')
    if (e) e.textContent = 'تعذّر الاتصال بالخادم — أعيدوا تحميل الصفحة'
    return
  }
  let session = null
  try { const r = await sb.auth.getSession(); session = r && r.data && r.data.session } catch (e) {}
  if (session) enterDb()
  else showLogin()
}
start()
