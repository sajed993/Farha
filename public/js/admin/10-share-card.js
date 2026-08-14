/* ═══════════ بطاقة المشاركة ═══════════
   What a guest sees before they open anything: the little card WhatsApp draws
   when the couple pastes their link into a chat.

   Until now that card was the stock poster of whichever ready-made film the
   invitation was built on — the same picture for every couple who chose قصر
   الرخام — and it was declared 720×1280, so a chat rendered it as a small
   square thumbnail instead of a wide card.

   This draws a real one, per invitation, at the size a chat actually wants:
   1200×630, the film's own still behind the couple's own names, set in the
   face the invitation itself uses. It runs in the dashboard at the moment an
   invitation is delivered, and the result is uploaded once and remembered in
   the config, so the edge function has nothing to do but point at it. */

const OGC_W = 1200, OGC_H = 630;

/* Aref Ruqaa is already loaded for the panel itself; canvas will silently fall
   back to a system face if we draw before it is ready, and the difference is
   obvious. */
async function ogcFonts () {
  try {
    if (!document.fonts) return;
    await Promise.all([
      document.fonts.load('700 90px "Aref Ruqaa"'),
      document.fonts.load('500 30px "IBM Plex Sans Arabic"'),
      document.fonts.load('500 34px "Fraunces"')
    ]);
    await document.fonts.ready;
  } catch (e) {}
}

function ogcLoad (src) {
  return new Promise(function (res) {
    if (!src) return res(null);
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = function () { res(im); };
    im.onerror = function () { res(null); };
    im.src = src;
  });
}

/* The still this invitation was built on. Same order the edge function uses,
   so the card and the fallback never disagree about which film it is. */
function ogcPoster (cfg, origin) {
  const f = (cfg && cfg.films) || {};
  let p = f.venue || f.poster || '';
  if (!p && f.hero) p = String(f.hero).replace(/\.(mp4|webm|mov)$/i, '.jpg');
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  return (origin || location.origin) + (p.charAt(0) === '/' ? '' : '/') + p;
}

/* cover-crop, the way background-size:cover would */
function ogcCover (ctx, im, w, h) {
  const sr = im.width / im.height, tr = w / h;
  let sw = im.width, sh = im.height, sx = 0, sy = 0;
  if (sr > tr) { sw = Math.round(im.height * tr); sx = Math.round((im.width - sw) / 2); }
  else { sh = Math.round(im.width / tr); sy = Math.round((im.height - sh) / 2); }
  ctx.drawImage(im, sx, sy, sw, sh, 0, 0, w, h);
}

function ogcDate (cfg) {
  const c = (cfg && cfg.c) || {};
  if (c.d) return String(c.d);
  if (!c.when) return '';
  const d = new Date(c.when);
  if (isNaN(d)) return '';
  const p = function (n) { return String(n).padStart(2, '0'); };
  return p(d.getDate()) + ' · ' + p(d.getMonth() + 1) + ' · ' + d.getFullYear();
}

/* Draw the card. Returns a Blob, or null if the still could not be read —
   a tainted canvas throws on toBlob rather than returning something broken. */
async function ogcRender (cfg, origin) {
  await ogcFonts();
  const c = (cfg && cfg.c) || {};
  const cv = document.createElement('canvas');
  cv.width = OGC_W; cv.height = OGC_H;
  const x = cv.getContext('2d');

  /* ground first, so a still that fails to load still leaves a finished card */
  const g0 = x.createLinearGradient(0, 0, OGC_W, OGC_H);
  g0.addColorStop(0, '#241B12'); g0.addColorStop(1, '#0E0A06');
  x.fillStyle = g0; x.fillRect(0, 0, OGC_W, OGC_H);

  const im = await ogcLoad(ogcPoster(cfg, origin));
  if (im) {
    x.save();
    ogcCover(x, im, OGC_W, OGC_H);
    x.restore();
    /* the still is a photograph and the type has to sit on it */
    const sc = x.createLinearGradient(0, 0, 0, OGC_H);
    sc.addColorStop(0, 'rgba(8,6,4,.42)');
    sc.addColorStop(0.42, 'rgba(8,6,4,.62)');
    sc.addColorStop(1, 'rgba(8,6,4,.86)');
    x.fillStyle = sc; x.fillRect(0, 0, OGC_W, OGC_H);
  }

  /* a hairline gold frame, the same gesture the invitation opens with */
  x.strokeStyle = 'rgba(226,201,150,.5)'; x.lineWidth = 2;
  x.strokeRect(26, 26, OGC_W - 52, OGC_H - 52);

  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.direction = 'rtl';          /* the card is Arabic; the digits are guests */

  /* the occasion, small and spaced */
  const kick = String(c.t || '').trim();
  if (kick) {
    x.font = '500 28px "IBM Plex Sans Arabic", sans-serif';
    x.fillStyle = 'rgba(232,208,156,.94)';
    x.fillText(kick, OGC_W / 2, 190);
  }

  /* the names — the reason anyone opens the link */
  const names = String(c.n || '').trim();
  x.font = '700 88px "Aref Ruqaa", serif';
  x.fillStyle = '#F7EFDF';
  x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 26; x.shadowOffsetY = 3;
  ogcFit(x, names, OGC_W - 200, 88, 'Aref Ruqaa', OGC_W / 2, 296);
  x.shadowBlur = 0; x.shadowOffsetY = 0;

  /* rule */
  x.strokeStyle = 'rgba(226,201,150,.55)'; x.lineWidth = 1.4;
  x.beginPath(); x.moveTo(OGC_W / 2 - 120, 366); x.lineTo(OGC_W / 2 - 22, 366);
  x.moveTo(OGC_W / 2 + 22, 366); x.lineTo(OGC_W / 2 + 120, 366); x.stroke();
  x.fillStyle = 'rgba(226,201,150,.9)';
  x.beginPath(); x.arc(OGC_W / 2, 366, 4.5, 0, Math.PI * 2); x.fill();

  /* The date on its own line and drawn left-to-right. Arabic and Latin digits
     on one canvas line get reordered — a phone number came out 973 787 55 the
     last time this was not done deliberately. */
  /* «14 سبتمبر 2026» is a right-to-left string that happens to contain Latin
     digits. Forcing ltr on it — which is the fix for a phone number, a Latin
     string among Arabic — reorders the runs and it came out «سبتمبر 14 2026».
     The direction has to follow the string, not the digits inside it. */
  const dt = ogcDate(cfg);
  if (dt) {
    x.save();
    x.direction = /[؀-ۿ]/.test(dt) ? 'rtl' : 'ltr';
    x.font = '500 34px "Fraunces", Georgia, serif';
    x.fillStyle = 'rgba(244,235,217,.92)';
    x.fillText(dt, OGC_W / 2, 424);
    x.restore();
  }

  /* the place, quieter */
  const place = String(c.p || '').trim();
  if (place) {
    x.font = '400 26px "IBM Plex Sans Arabic", sans-serif';
    x.fillStyle = 'rgba(232,222,203,.72)';
    ogcFit(x, place, OGC_W - 300, 26, 'IBM Plex Sans Arabic', OGC_W / 2, 470);
  }

  /* whose invitation this is */
  x.font = '500 22px "IBM Plex Sans Arabic", sans-serif';
  x.fillStyle = 'rgba(226,201,150,.72)';
  x.fillText('فرحة', OGC_W / 2, OGC_H - 66);

  return await new Promise(function (res) {
    try { cv.toBlob(function (b) { res(b); }, 'image/jpeg', 0.86); }
    catch (e) { res(null); }
  });
}

/* There used to be a letter-spacing helper here that inserted a hair space
   between every character, because canvas has no letter-spacing property.
   In Arabic that severs the cursive joins: «عيد ميلاد» came out as a row of
   disconnected letters. Arabic is not tracked; it is joined. */

/* shrink until it fits rather than run off the card */
function ogcFit (x, text, maxW, size, family, cx, cy) {
  if (!text) return;
  let s = size;
  const weight = family === 'Aref Ruqaa' ? '700' : '400';
  for (let i = 0; i < 24; i++) {
    x.font = weight + ' ' + s + 'px "' + family + '", serif';
    if (x.measureText(text).width <= maxW || s <= 20) break;
    s -= 3;
  }
  x.fillText(text, cx, cy);
}

/* Render, upload, and hand back the public URL. The bucket is the one that
   already exists and is already public. */
async function ogcBuild (cfg, origin) {
  const blob = await ogcRender(cfg, origin);
  if (!blob) return '';
  if (typeof window.__dbUpload !== 'function') return '';
  const name = 'og-' + Date.now() + '.jpg';
  try {
    return await window.__dbUpload(new File([blob], name, { type: 'image/jpeg' }), 'photos');
  } catch (e) { return ''; }
}

if (typeof window !== 'undefined') {
  window.ogcRender = ogcRender;
  window.ogcBuild = ogcBuild;
  window.ogcPoster = ogcPoster;
}
