/* ═══ فرحة — التنبيهات ═══
   The bell used to hold four sentences written by hand in a demo file: a
   golden wedding ordered eight minutes ago by a customer who does not exist,
   twenty-three replies to an invitation nobody sent. They never changed,
   which made the bell worse than useless — it looked like news.

   Everything here is read from the rows already on screen. Nothing is stored
   and nothing is invented: if there is no order, there is no line about an
   order. What is remembered, and only on this device, is the moment the bell
   was last opened, so that «new» means new to you rather than new to the
   database. */

const NOTIF_SEEN = 'farha_notif_seen';
const NOTIF_MAX = 14;
const NOTIF_DAYS = 30;

function notifSeen () { try { return +localStorage.getItem(NOTIF_SEEN) || 0; } catch (e) { return 0; } }
function notifMarkSeen () { try { localStorage.setItem(NOTIF_SEEN, String(Date.now())); } catch (e) {} }

/* Arabic counts four ways, not two: one, a pair, a few (3–10), and many (11+).
   «قبل 2 ساعات» and «قبل 8 دقيقة» are both wrong, and wrong grammar in the
   one place a shopkeeper looks twenty times a day reads as carelessness. */
function notifCount (n, one, two, few, many) {
  if (n === 1) return one;
  if (n === 2) return two;
  if (n >= 3 && n <= 10) return fmtN(n) + ' ' + few;
  return fmtN(n) + ' ' + many;
}

/* how long ago, said the way a person would */
function notifAgo (ms) {
  const s = Math.max(0, (Date.now() - ms) / 1000);
  /* 45 seconds, not 90: at 90 the singular «قبل دقيقة» could never appear,
     because anything old enough to leave «الآن» already rounded up to two. */
  if (s < 45) return 'الآن';
  const m = Math.round(s / 60);
  if (m < 60) return 'قبل ' + notifCount(m, 'دقيقة', 'دقيقتين', 'دقائق', 'دقيقة');
  const h = Math.round(m / 60);
  if (h < 24) return 'قبل ' + notifCount(h, 'ساعة', 'ساعتين', 'ساعات', 'ساعة');
  const d = Math.round(h / 24);
  if (d === 1) return 'أمس';
  if (d < 30) return 'قبل ' + notifCount(d, 'يوم', 'يومين', 'أيام', 'يومًا');
  return new Date(ms).toLocaleDateString('ar-TN');
}

const notifWhen = (v) => { const t = Date.parse(v || ''); return isNaN(t) ? 0 : t; };

/* the name a couple would recognise, not a slug */
function notifInvName (slug) {
  const R = window.__dbRows || {};
  const i = (R.invitations || []).find((x) => x.slug === slug);
  return (i && i.config && i.config.c && i.config.c.n) || '';
}

/* Milestones worth a line. Anything more often than this is noise, and a bell
   that cries every view is a bell nobody opens. */
const NOTIF_STEPS = [10, 25, 50, 100, 250, 500, 1000];

function notifFeed () {
  const R = window.__dbRows;
  if (!R) return [];
  const now = Date.now(), floor = now - NOTIF_DAYS * 864e5;
  const out = [];
  const add = (o) => { if (o.at >= floor) out.push(o); };

  /* ---- orders waiting to be dealt with ---- */
  (R.orders || []).forEach((o) => {
    const at = notifWhen(o.created_at);
    if ((o.status || 'جديد') === 'جديد') {
      add({ em: '🛒', at, view: 'orders',
        b: 'طلب جديد — ' + (o.item || 'دعوة'),
        s: [o.customer_name, o.price ? o.price + ' د.ت' : ''].filter(Boolean).join(' · ') });
    } else if (o.inv_slug && o.status === 'مدفوع') {
      add({ em: '🎁', at, view: 'inv',
        b: 'سُلّمت دعوة ' + (notifInvName(o.inv_slug) || o.item || ''),
        s: 'الرابط جاهز للمشاركة' });
    }
  });

  /* ---- replies, gathered per invitation so one wedding is one line ---- */
  const byInv = {};
  (R.rsvps || []).forEach((r) => {
    const at = notifWhen(r.created_at);
    if (at < floor) return;
    const k = r.inv_slug || '—';
    if (!byInv[k]) byInv[k] = { n: 0, yes: 0, at: 0, last: '' };
    const g = byInv[k];
    g.n++; if (r.attending !== false) g.yes++;
    if (at > g.at) { g.at = at; g.last = r.name || ''; }
  });
  Object.keys(byInv).forEach((slug) => {
    const g = byInv[slug], nm = notifInvName(slug);
    add({ em: '💌', at: g.at, view: 'guests',
      b: notifCount(g.n, 'ردّ جديد', 'ردّان جديدان', 'ردود جديدة', 'ردًّا جديدًا')
         + (nm ? ' على دعوة ' + nm : ''),
      s: [g.last, g.n > 1 ? notifCount(g.yes, 'واحد سيحضر', 'اثنان سيحضران', 'سيحضرون', 'سيحضرون') : '']
         .filter(Boolean).join(' · ') });
  });

  /* ---- congratulations nobody has approved yet ---- */
  const wait = (R.wishes || []).filter((w) => !w.approved);
  if (wait.length) {
    add({ em: '🎉', at: Math.max.apply(null, wait.map((w) => notifWhen(w.created_at))),
      view: 'wish',
      b: notifCount(wait.length, 'تهنئة', 'تهنئتان', 'تهانٍ', 'تهنئة') + ' تنتظر موافقتكم',
      s: (wait[0] && wait[0].name) || '' });
  }

  /* ---- what the invitations themselves are doing ---- */
  /* Events arrive newest-first; counted the other way round so the moment a
     milestone was actually crossed is the moment reported. */
  const evs = (R.events || []).slice().sort((a, b) => notifWhen(a.created_at) - notifWhen(b.created_at));
  const seen = {}, firstOpen = {};
  evs.forEach((e) => {
    const slug = e.inv_slug; if (!slug) return;
    const at = notifWhen(e.created_at);
    if (e.kind === 'reveal' && !firstOpen[slug]) {
      firstOpen[slug] = true;
      const nm = notifInvName(slug);
      if (nm) add({ em: '✨', at, view: 'inv', b: 'فُتحت دعوة ' + nm + ' لأوّل مرّة', s: 'ضيف لمس الختم' });
    }
    if (e.kind !== 'view' && e.kind !== 'open') return;
    seen[slug] = (seen[slug] || 0) + 1;
    if (NOTIF_STEPS.indexOf(seen[slug]) < 0) return;
    const nm = notifInvName(slug); if (!nm) return;
    add({ em: '👀', at, view: 'inv',
      b: 'دعوة ' + nm + ' تخطّت ' + fmtN(seen[slug]) + ' مشاهدة',
      s: 'يشاركونها بينهم' });
  });

  out.sort((a, b) => b.at - a.at);
  return out.slice(0, NOTIF_MAX);
}

function notifUnread () { const s = notifSeen(); return notifFeed().filter((n) => n.at > s).length; }

function notifHTML () {
  const feed = notifFeed(), s = notifSeen();
  if (!feed.length) {
    return '<div class="n-empty">' +
      (window.__dbRows ? 'لا جديد بعد — سيظهر هنا كل طلب وكل ردّ فور وصوله.'
                       : 'التنبيهات تعمل بعد الاتصال بقاعدة البيانات.') + '</div>';
  }
  return feed.map((n) => `<button class="n ${n.at > s ? 'unread' : ''}" onclick="notifGo('${n.view}')">
    <span>${n.em}</span>
    <div><b>${escA(n.b)}</b><span>${escA([n.s, notifAgo(n.at)].filter(Boolean).join(' · '))}</span></div>
   </button>`).join('');
}

function notifGo (view) { S.notif = false; notifMarkSeen(); if (typeof go === 'function') go(view); }

function notifToggle () {
  S.notif = !S.notif;
  /* opening it is what makes them read — closing must not, or a glance would
     clear a badge you never looked at */
  if (S.notif) { render(); setTimeout(notifMarkSeen, 900); }
  else render();
}
