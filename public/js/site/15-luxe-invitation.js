/* ═══════════════════════════════════════════════════════════════════
   LUXE INVITATION — premium wax-seal cover → cinematic photo scenes
   Theme 1 ("Sidi Gold"). Built asset-ready: every real image (wax seal,
   paper texture, couple photo) has a clearly-marked SLOT with a CSS/SVG
   placeholder. Swap LUXE_ASSETS urls when real assets arrive.
   Triggered by S.c.anim === 'luxe'.  Cloneable via LUXE_THEMES.
   ═══════════════════════════════════════════════════════════════════ */

/* ---- ASSET SLOTS (replace url:'' with real image URLs later) ---- */
const LUXE_ASSETS = {
  seal:  { url: '', alt: 'wax-seal' },      // transparent PNG of the wax seal
  paper: { url: '', alt: 'paper-lace' },    // cream lace/paper cover texture
  photo: { url: '', alt: 'couple-photo' }   // default sample couple photo
};
/* couple can override photo via S.st.photos[0] or S.c.memPhoto */
function _luxePhoto () {
  try {
    if (S.c && S.c.luxePhoto) return S.c.luxePhoto;
    if (S.st && S.st.photos && S.st.photos[0]) return S.st.photos[0];
    if (LUXE_ASSETS.photo.url) return LUXE_ASSETS.photo.url;
  } catch (e) {}
  return ''; // falls back to CSS gradient placeholder
}

/* ---- THEME PALETTE (clone this object to add more themes later) ---- */
const LUXE_THEMES = {
  sidigold: {
    name: { ar: 'سيدي الذهبي', fr: 'Sidi Doré', en: 'Sidi Gold' },
    cream: '#F5EEE0', paper: '#EFE6D3', ink: '#3C2E17',
    gold: '#C69A45', goldDeep: '#9A7327', goldLight: '#E7CE93',
    wax: '#B08842', waxDark: '#8A6420', overlay: 'rgba(24,16,6,.46)'
  }
};
function _luxeTheme () { return LUXE_THEMES[(S.c && S.c.luxeTheme) || 'sidigold'] || LUXE_THEMES.sidigold; }

/* initials from the couple names for the seal ("نور & كريم" -> "ن & ك") */
function _luxeInitials () {
  try {
    const n = String((S.c && S.c.n) || '').trim();
    const parts = n.split(/\s*&\s*|\s+و\s+|\s*\+\s*/).filter(Boolean);
    if (parts.length >= 2) return parts[0].trim().charAt(0) + ' & ' + parts[1].trim().charAt(0);
    return (n.charAt(0) || '✦');
  } catch (e) { return '✦'; }
}

/* ---- date block parts (day-name · number · month · year · time) ---- */
function _luxeDate () {
  const c = S.c || {};
  return { full: c.d || '', when: c.when || '', dayName: c.dayName || '', num: c.dnum || '', mon: c.dmon || '', yr: c.dyr || '' };
}

/* ═══ ENTRY: mount the luxe invitation into the ceremony veil ═══ */
function mountLuxe (stage) {
  if (!veil) return;
  veil.classList.add('luxe');
  clearFilm && clearFilm();
  const th = _luxeTheme();
  // set theme CSS variables on the veil
  veil.style.setProperty('--lx-cream', th.cream);
  veil.style.setProperty('--lx-paper', th.paper);
  veil.style.setProperty('--lx-ink', th.ink);
  veil.style.setProperty('--lx-gold', th.gold);
  veil.style.setProperty('--lx-gold-deep', th.goldDeep);
  veil.style.setProperty('--lx-gold-light', th.goldLight);
  veil.style.setProperty('--lx-wax', th.wax);
  veil.style.setProperty('--lx-wax-dark', th.waxDark);
  veil.style.setProperty('--lx-overlay', th.overlay);

  let sc = veil.querySelector('.cine-scene');
  if (!sc) { sc = document.createElement('div'); sc.className = 'cine-scene'; veil.insertBefore(sc, stage); }
  sc.innerHTML = '';
  stage.innerHTML = luxeCoverHTML();
  const cov = stage.querySelector('#lxCover');
  if (cov) cov.onclick = function () {
    if (this.classList.contains('opening')) return;
    this.classList.add('opening');
    try { ceremonyMusic && ceremonyMusic('open'); } catch (e) {}
    setTimeout(() => luxeScenes(stage), 1350);
  };
}

/* ---- COVER: paper + wax seal + tap prompt (SLOT: seal, paper) ---- */
function luxeCoverHTML () {
  const paperBg = LUXE_ASSETS.paper.url
    ? `background-image:url('${LUXE_ASSETS.paper.url}');background-size:cover;background-position:center`
    : ''; /* else CSS placeholder via .lx-paper */
  const seal = LUXE_ASSETS.seal.url
    ? `<img class="lx-seal-img" src="${LUXE_ASSETS.seal.url}" alt="seal">`
    : `<div class="lx-seal"><span class="lx-seal-mono">${esc(_luxeInitials())}</span></div>`; /* CSS placeholder */
  const tapTxt = S.lang === 'ar' ? 'إضغطوا لفتح الدعوة' : S.lang === 'fr' ? "Appuyez pour ouvrir l'invitation" : 'Tap to open the invitation';
  return `<div class="lx-cover" id="lxCover">
    <div class="lx-paper" style="${paperBg}"></div>
    <div class="lx-lace lx-lace-t"></div><div class="lx-lace lx-lace-b"></div>
    <div class="lx-botanical">
      <span class="lx-leaf l1">🌿</span><span class="lx-leaf l2">🌾</span><span class="lx-sprig">✿</span>
    </div>
    <div class="lx-seal-wrap">${seal}</div>
    <div class="lx-tap"><span>${tapTxt}</span><div class="lx-tap-hand">☝</div></div>
  </div>`;
}

/* ---- SCENES: cinematic full-photo name reveal (SLOT: photo) ---- */
let _lxT = [];
function _lxClear () { _lxT.forEach(clearTimeout); _lxT = []; }
function luxeScenes (stage) {
  _lxClear();
  const c = S.c || {}, d = _luxeDate();
  const photo = _luxePhoto();
  const photoBg = photo ? `background-image:linear-gradient(180deg,var(--lx-overlay),var(--lx-overlay)),url('${photo}');background-size:cover;background-position:center` : '';
  const invTitle = c.t || (S.lang === 'ar' ? 'دعوة حضور حفل زفاف' : S.lang === 'fr' ? 'Invitation au mariage' : 'Wedding Invitation');
  const msg = c.m || '';
  const place = c.p || '';
  // build the main cinematic scene
  stage.innerHTML = `<div class="lx-scene" id="lxScene">
    <div class="lx-photo ${photo ? '' : 'lx-photo-ph'}" style="${photoBg}"></div>
    <div class="lx-scrim"></div>
    <div class="lx-content">
      <div class="lx-kicker">${esc(invTitle)}</div>
      <div class="lx-names">${_luxeNames(c.n)}</div>
      ${msg ? `<div class="lx-msg">${esc(String(msg).slice(0, 140))}</div>` : ''}
      <div class="lx-rule"><span></span>✦<span></span></div>
      <div class="lx-datebar">
        ${d.dayName ? `<div class="lx-dcol"><b>${esc(d.dayName)}</b></div><div class="lx-dsep"></div>` : ''}
        <div class="lx-dcol lx-dbig">
          ${d.mon ? `<span class="lx-dmon">${esc(d.mon)}</span>` : ''}
          <span class="lx-dnum">${esc(d.num || _guessDayNum(d.full))}</span>
          ${d.yr ? `<span class="lx-dyr">${esc(d.yr)}</span>` : (d.full ? `<span class="lx-dyr">${esc(_guessYear(d.full))}</span>` : '')}
        </div>
        ${d.when ? `<div class="lx-dsep"></div><div class="lx-dcol"><b>${esc(d.when)}</b></div>` : ''}
      </div>
      ${place ? `<div class="lx-place">📍 ${esc(place)}</div>` : ''}
    </div>
    <div class="lx-disc ${c.music && c.autoplay ? 'spin' : ''}" title="music"><span>♪</span></div>
    <button class="lx-enter" id="lxEnter">${(typeof t === 'function' && t().pmEnter) || (S.lang === 'ar' ? 'ادخلوا' : 'Enter')}</button>
  </div>`;
  // staged fade-ins
  const el = stage.querySelector('#lxScene');
  ['lx-kicker', 'lx-names', 'lx-msg', 'lx-rule', 'lx-datebar', 'lx-place'].forEach((cls, i) => {
    const n = el && el.querySelector('.' + cls);
    if (n) { n.style.opacity = 0; _lxT.push(setTimeout(() => { n.classList.add('lx-in'); }, 350 + i * 480)); }
  });
  const enter = stage.querySelector('#lxEnter');
  if (enter) enter.onclick = () => { try { reveal(); } catch (e) {} };
}

/* names: split "نور & كريم" into two elegant lines with an ampersand */
function _luxeNames (n) {
  n = String(n || '').trim();
  const parts = n.split(/\s*&\s*|\s+و\s+|\s*\+\s*/).filter(Boolean);
  if (parts.length >= 2) return `<span class="lx-n1">${esc(parts[0].trim())}</span><span class="lx-amp">&amp;</span><span class="lx-n2">${esc(parts.slice(1).join(' ').trim())}</span>`;
  return `<span class="lx-n1">${esc(n)}</span>`;
}
function _guessDayNum (full) { const m = String(full || '').match(/\d{1,2}/); return m ? m[0] : ''; }
function _guessYear (full) { const m = String(full || '').match(/(20\d\d)/); return m ? m[1] : ''; }
