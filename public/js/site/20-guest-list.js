/* ================= the guest list, read only =================
   A link the couple can be handed: /?guests=<slug>. It shows who replied to
   their invitation and nothing else — no dashboard, no editing, no account.

   It reads the same rsvps rows the invitation writes, so it is the list itself
   rather than an export of it; a reply that arrives while the page is open
   appears without anyone reloading. When there is no database to reach it
   falls back to whatever this device stored, which is what makes it work
   while testing and on the owner's own phone. */

function glSlug() {
  try { return new URLSearchParams(location.search).get('guests') || ''; }
  catch (e) { return ''; }
}
let GL_ON = false, GL_ROWS = [], GL_LIVE = false, GL_STOP = null, GL_HOST = '';

/* Two shapes reach this page: rows from the database and rows this device
   stored. Normalise once here so nothing below has to know the difference. */
function glNorm(r) {
  return {
    at: r.created_at || r.at || '',
    name: r.name || '—',
    coming: ('attending' in r) ? !!r.attending : !!r.coming,
    count: +(r.guests || r.count || 0) || 0,
    msg: r.message || r.msg || ''
  };
}
function glWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const p = n => ('0' + n).slice(-2);
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}

async function glFetch(slug) {
  if (window.__sbGuests) {
    const rows = await window.__sbGuests(slug);
    if (rows) {
      GL_LIVE = true;
      if (!GL_HOST && window.__sbInviteName) {
        try { GL_HOST = (await window.__sbInviteName(slug)) || ''; } catch (e) {}
      }
      return rows.map(glNorm);
    }
  }
  GL_LIVE = false;
  const mine = (typeof frmGet === 'function') ? frmGet('farha_rsvp') : [];
  const ours = mine.filter(r => (r.invite || '') === slug || (r.host || '') === slug);
  if (!GL_HOST) { const h = ours.find(r => r.host); if (h) GL_HOST = h.host; }
  return ours.map(glNorm).reverse();
}

function glHTML(slug) {
  const T = t();
  const yes = GL_ROWS.filter(r => r.coming);
  const head = yes.reduce((n, r) => n + (r.count || 1), 0);
  return `<div class="gl">
   <header class="gl-head">
    <span class="gl-kick">${esc(T.glKick)}</span>
    <h1>${esc(T.glTitle)}</h1>
    ${GL_HOST ? `<p>${esc(GL_HOST)}</p>` : ''}
   </header>
   <div class="gl-nums">
    <div><b>${yes.length}</b><span>${esc(T.glYes)}</span></div>
    <div><b>${GL_ROWS.length - yes.length}</b><span>${esc(T.glNo)}</span></div>
    <div class="wide"><b>${head}</b><span>${esc(T.glHeads)}</span></div>
   </div>
   ${GL_ROWS.length ? `<ul class="gl-list">${GL_ROWS.map(r => `
     <li class="gl-row ${r.coming ? 'yes' : 'no'}">
      <div class="gl-top"><b>${esc(r.name)}</b>
       <span class="gl-tag">${r.coming ? (r.count > 1 ? r.count + ' ' + esc(T.glPeople) : esc(T.glComing)) : esc(T.glSorry)}</span>
       <time>${glWhen(r.at)}</time></div>
      ${r.msg ? `<p>${esc(r.msg)}</p>` : ''}
     </li>`).join('')}</ul>`
    : `<p class="gl-empty">${esc(T.glEmpty)}</p>`}
   <footer class="gl-foot">
    <button class="gl-btn" onclick="glCsv()">${esc(T.glDl)}</button>
    <p>${esc(GL_LIVE ? T.glLive : T.glLocal)}</p>
   </footer>
  </div>`;
}

/* the same file the dashboard exports, for whoever wants a spreadsheet */
function glCsv() {
  const T = t();
  const rows = [[T.glCName, T.glCReply, T.glCCount, T.glCMsg, T.glCWhen]]
    .concat(GL_ROWS.map(r => [r.name, r.coming ? T.glComing : T.glSorry,
      r.coming ? (r.count || 1) : '', r.msg, glWhen(r.at)]));
  const csv = '﻿' + rows.map(r => r.map(c =>
    '"' + String(c === undefined || c === null ? '' : c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
  try {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'guests-' + glSlug() + '.csv';
    document.body.appendChild(a); a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 400);
  } catch (e) { toast(t().glDlErr); }
}

async function glPaint() {
  const slug = glSlug();
  GL_ROWS = await glFetch(slug);
  const app = document.getElementById('app');
  if (app) app.innerHTML = glHTML(slug);
}

function glBoot() {
  const slug = glSlug();
  if (!slug) return;
  GL_ON = true;
  document.documentElement.classList.add('is-guestlist');
  glPaint();
  /* A reply that lands while the page is open should just appear. Polling is
     what actually carries this: realtime only reaches the signed-in owner,
     and the couple opening the link are not signed in to anything. */
  setTimeout(() => {
    if (window.__sbGuestsWatch) GL_STOP = window.__sbGuestsWatch(slug, glPaint);
    setInterval(glPaint, 25000);
  }, 1400);
}
if (typeof window !== 'undefined') window.addEventListener('load', () => { try { glBoot(); } catch (e) {} });
