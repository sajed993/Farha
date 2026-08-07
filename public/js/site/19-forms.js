/* ================= order form + guest RSVP =================
   Two forms that turn interest into something the owner can act on.

   The order form asks only for what is genuinely needed to build a film, and
   offers a way past it: a visitor who would rather talk can jump straight to
   WhatsApp and we ask there instead. Either way the message is composed in the
   language they were reading the site in.

   The RSVP form replaces a button that used to show a toast and store nothing.
   Replies are kept per invitation so an owner can be handed their own list. */

/* ---- storage ---------------------------------------------------------- */
const FRM_K = { orders: 'farha_reqs', rsvp: 'farha_rsvp' };

function frmGet(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
function frmPush(k, row) {
  const a = frmGet(k);
  a.push(row);
  try { localStorage.setItem(k, JSON.stringify(a)); } catch (e) {}
  /* the backend takes it too when a customer is signed in; failing that the
     row still exists locally and the dashboard can export it */
  try { if (window.__sbSaveRow) window.__sbSaveRow(k, row); } catch (e) {}
  return a;
}
function frmNow() { const d = new Date(); return d.toISOString(); }

/* ---- WhatsApp -------------------------------------------------------- */
function frmWaNumber() {
  return String((typeof CFG !== 'undefined' && CFG && CFG.wa) || '').replace(/[^0-9]/g, '');
}
/* Composed in whichever language the visitor is reading, so the reply that
   comes back is in the language they wrote in. */
function frmWaText(o) {
  const L = S.lang;
  const head = { ar: 'السلام عليكم، أودّ طلب دعوة رقمية.',
                 fr: 'Bonjour, je souhaite commander une invitation numérique.',
                 en: 'Hello, I would like to order a digital invitation.' }[L];
  const lbl = { ar: { film: 'الفيلم', name: 'الاسم', when: 'التاريخ', place: 'المكان',
                      names: 'الأسماء', wish: 'ما نتخيّله' },
                fr: { film: 'Film', name: 'Nom', when: 'Date', place: 'Lieu',
                      names: 'Prénoms', wish: 'Souhaits' },
                en: { film: 'Film', name: 'Name', when: 'Date', place: 'Venue',
                      names: 'Names', wish: 'Wishes' } }[L];
  const bits = [head, ''];
  const add = (k, v) => { if (v && String(v).trim()) bits.push(lbl[k] + ': ' + v); };
  add('film', o.filmName); add('name', o.name); add('names', o.names);
  add('when', o.when); add('place', o.place); add('wish', o.wish);
  return bits.join('\n');
}
function frmWaOpen(o) {
  const n = frmWaNumber();
  const txt = encodeURIComponent(frmWaText(o || {}));
  const url = n ? ('https://wa.me/' + n + '?text=' + txt)
                : ('https://wa.me/?text=' + txt);
  window.open(url, '_blank', 'noopener');
}

/* ---- the order form -------------------------------------------------- */
let FRM_FILM = null;

function openOrder(filmId) {
  closeOrder();
  const f = (typeof readyFilm === 'function' && filmId) ? readyFilm(filmId) : null;
  FRM_FILM = f;
  const nm = f ? (typeof readyName === 'function' ? readyName(f) : f.name[S.lang]) : '';
  const price = f && typeof readyPrice === 'function' ? readyPrice(f) : 0;

  const d = document.createElement('div');
  d.className = 'frm-veil'; d.id = 'ordveil';
  d.onclick = e => { if (e.target === d) closeOrder(); };
  d.innerHTML = `<div class="frm-sheet" role="dialog" aria-modal="true">
    <button class="frm-x" onclick="closeOrder()" aria-label="${esc(t().ordClose)}">✕</button>
    <h3 class="frm-t">${esc(t().ordT)}</h3>
    <p class="frm-sub">${esc(t().ordSub)}</p>
    ${f ? `<div class="frm-pick"><img src="${f.p}" alt="" loading="lazy">
      <span><b>${esc(nm)}</b><em>${price} ${esc(t().cur)}</em></span></div>` : ''}

    <label class="frm-l">${esc(t().ordWho)}</label>
    <div class="frm-g2">
      <input id="ordName" placeholder="${esc(t().ordName)}" autocomplete="name">
      <input id="ordPhone" placeholder="${esc(t().ordPhone)}" inputmode="tel" autocomplete="tel">
    </div>

    <label class="frm-l">${esc(t().ordEv)}</label>
    <input id="ordNames" placeholder="${esc(t().ordNames)}">
    <div class="frm-g2">
      <input id="ordWhen" placeholder="${esc(t().ordDate)}">
      <input id="ordPlace" placeholder="${esc(t().ordPlace)}">
    </div>
    <input id="ordMsg" placeholder="${esc(t().ordMsg)}">

    <label class="frm-l">${esc(t().ordFilm)}</label>
    <div class="frm-radio">
      ${f ? `<label><input type="radio" name="ordf" value="this" checked><span>${esc(t().ordFilmThis)}</span></label>` : ''}
      <label><input type="radio" name="ordf" value="other" ${f ? '' : 'checked'}><span>${esc(t().ordFilmOther)}</span></label>
      <label><input type="radio" name="ordf" value="new"><span>${esc(t().ordFilmNew)}</span></label>
    </div>

    <label class="frm-l">${esc(t().ordWish)}</label>
    <textarea id="ordWish" rows="3" placeholder="${esc(t().ordWishPh)}"></textarea>

    <button class="frm-go" onclick="submitOrder()">${esc(t().ordSend)}</button>
    <button class="frm-alt" onclick="skipToWa()">${esc(t().ordSkip)}</button>
    <p class="frm-note">${esc(t().ordSkipNote)}</p>
  </div>`;
  document.body.appendChild(d);
  document.body.style.overflow = 'hidden';
  setTimeout(() => { const n = document.getElementById('ordName'); if (n) n.focus(); }, 60);
}
function closeOrder() {
  const d = document.getElementById('ordveil');
  if (d) d.remove();
  if (!document.querySelector('.veil,.frm-veil')) document.body.style.overflow = '';
}
function frmVal(id) { const e = document.getElementById(id); return e ? e.value.trim() : ''; }
function frmCollect() {
  const pickEl = document.querySelector('input[name="ordf"]:checked');
  const f = FRM_FILM;
  return {
    at: frmNow(), lang: S.lang,
    name: frmVal('ordName'), phone: frmVal('ordPhone'),
    names: frmVal('ordNames'), when: frmVal('ordWhen'),
    place: frmVal('ordPlace'), msg: frmVal('ordMsg'),
    wish: frmVal('ordWish'),
    filmId: f ? f.id : '', filmName: f ? (typeof readyName === 'function' ? readyName(f) : f.name[S.lang]) : '',
    choice: pickEl ? pickEl.value : 'other',
    price: f && typeof readyPrice === 'function' ? readyPrice(f) : 0
  };
}
function skipToWa() {
  /* keep whatever was typed before jumping, so nothing the visitor
     already wrote is thrown away */
  const o = frmCollect();
  o.viaWhatsApp = true;
  if (o.name || o.phone || o.wish) frmPush(FRM_K.orders, o);
  frmWaOpen(o);
  /* The WhatsApp greeting is set inside WhatsApp Business, and it only fires
     once they actually send. Showing the same promise here means nobody
     leaves this page without having read it. */
  closeOrder();
  orderThanks(o);
}
function submitOrder() {
  const o = frmCollect();
  if (!o.name || !o.phone) { toast(t().ordNeed); return; }
  frmPush(FRM_K.orders, o);
  closeOrder();
  orderThanks(o);
}
/* the order just sent, kept so the follow-up button can reuse it without
   round-tripping the whole object through an onclick attribute */
let FRM_LAST = null;
function frmWaLast() { frmWaOpen(FRM_LAST || {}); }
function orderThanks(o) {
  FRM_LAST = o;
  const d = document.createElement('div');
  d.className = 'frm-veil'; d.id = 'ordveil';
  d.onclick = e => { if (e.target === d) closeOrder(); };
  d.innerHTML = `<div class="frm-sheet frm-thanks" role="dialog" aria-modal="true">
    <div class="frm-tick">✓</div>
    <h3 class="frm-t">${esc(t().ordOk)}</h3>
    <p class="frm-sub">${esc(t().ordOkNote)}</p>
    <button class="frm-go" onclick="frmWaLast()">${esc(t().ordWa)}</button>
    <button class="frm-alt" onclick="closeOrder()">${esc(t().ordClose)}</button>
  </div>`;
  document.body.appendChild(d);
}

/* ---- guest RSVP ------------------------------------------------------ */
function openRsvp(coming) {
  closeRsvp();
  const d = document.createElement('div');
  d.className = 'frm-veil'; d.id = 'rvveil';
  d.onclick = e => { if (e.target === d) closeRsvp(); };
  d.innerHTML = `<div class="frm-sheet frm-rv" role="dialog" aria-modal="true">
    <button class="frm-x" onclick="closeRsvp()" aria-label="${esc(t().ordClose)}">✕</button>
    <h3 class="frm-t">${esc(coming ? t().rvT : t().rvTno)}</h3>
    <input id="rvName" placeholder="${esc(t().rvName)}" autocomplete="name">
    ${coming ? `<label class="frm-l tight">${esc(t().rvCount)}</label>
    <input id="rvCount" inputmode="numeric" value="1">` : ''}
    <textarea id="rvMsg" rows="3" placeholder="${esc(t().rvMsg)}"></textarea>
    <button class="frm-go" onclick="submitRsvp(${coming ? 1 : 0})">${esc(t().rvSend)}</button>
  </div>`;
  document.body.appendChild(d);
  setTimeout(() => { const n = document.getElementById('rvName'); if (n) n.focus(); }, 60);
}
function closeRsvp() { const d = document.getElementById('rvveil'); if (d) d.remove(); }
function submitRsvp(coming) {
  const name = frmVal('rvName');
  if (!name) { toast(t().rvNeed); return; }
  const row = {
    at: frmNow(), lang: S.lang,
    invite: (S.c && (S.c.film || S.c.n)) || '',
    host: (S.c && S.c.n) || '',
    name: name,
    coming: coming ? 1 : 0,
    count: coming ? (parseInt(frmVal('rvCount'), 10) || 1) : 0,
    msg: frmVal('rvMsg')
  };
  frmPush(FRM_K.rsvp, row);
  closeRsvp();
  toast(t().rvOk);
  if (coming && typeof burst === 'function') burst(['🎉', '💛']);
  const r = veil && veil.querySelector('.rsvp');
  if (r) r.style.opacity = .45;
}
