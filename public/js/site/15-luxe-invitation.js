/* ═══════════════════════════════════════════════════════════════════
   LUXE INVITATION v2 — "Bab Dhahab" (the golden door)
   Closed: a palace doorway. Tap → doors swing open in 3D revealing an
   illuminated hall. Gold monogram cartouche draws itself, names cascade
   line by line (GSAP SplitText), divider draws, date settles.
   Arabic set in Aref Ruqaa. All art is code (SVG) — photo slots optional.
   Triggered by S.c.anim === 'luxe'.
   ═══════════════════════════════════════════════════════════════════ */

/* ---- optional real assets: fill a url to override the drawn art ---- */
const LUXE_ASSETS = {
  door:  { url: '' },   // closed-doorway photo (replaces drawn doors)
  hall:  { url: '' },   // interior hall photo (replaces drawn hall)
  photo: { url: '' }    // couple photo (used on the portrait scene)
};
function _lxHallPhoto () {
  try {
    if (S.c && S.c.luxePhoto) return S.c.luxePhoto;
    if (S.st && S.st.photos && S.st.photos[0]) return S.st.photos[0];
    if (LUXE_ASSETS.hall.url) return LUXE_ASSETS.hall.url;
  } catch (e) {}
  return '';
}

/* ---- collections: each declares a palette + which scene to draw ---- */
const LUXE_THEMES = {
  sidibou: {
    scene: 'vista', vista: 'sidibou',
    name: { ar: 'دار البحر', fr: 'Dar El Bahr', en: 'Dar El Bahr' },
    blurb: { ar: 'سيدي بوسعيد — أبواب زرقاء وبحر لا ينتهي', fr: 'Sidi Bou Saïd — portes bleues, mer infinie', en: 'Sidi Bou Said — blue doors, endless sea' },
    door: '#1E4C8A', doorLo: '#123156', stone: '#EFE6D6', stoneLo: '#CDBEA4',
    gold: '#C79A45', goldLo: '#8A6420', goldHi: '#F3E3BC',
    ink: '#123156', inkSoft: '#2C5A96', glow: '#FFE9B8',
    sky1: '#BEE0F2', sky2: '#EAF6FB', sea1: '#2C6FA8', sea2: '#1B4E7E',
    bloom: '#C6417C', leaf: '#5C7A43', wash: 'rgba(18,49,86,.10)'
  },
  santorini: {
    scene: 'vista', vista: 'santorini',
    name: { ar: 'غروب الجزيرة', fr: 'Coucher des Cyclades', en: 'Caldera Sunset' },
    blurb: { ar: 'سانتوريني — قباب زرقاء وشمس تغرب', fr: 'Santorin — dômes bleus, soleil couchant', en: 'Santorini — blue domes at sunset' },
    door: '#E8DFD2', doorLo: '#C9BCA8', stone: '#F6EFE4', stoneLo: '#DCCDB6',
    gold: '#C98F4B', goldLo: '#8E5F27', goldHi: '#F6DDAE',
    ink: '#5A3524', inkSoft: '#8A5636', glow: '#FFD79A',
    sky1: '#F6B27A', sky2: '#FCE3C3', sea1: '#2E5F86', sea2: '#1A3A57',
    bloom: '#E0708A', leaf: '#6E8757', wash: 'rgba(90,53,36,.10)'
  },
  bab: {
    scene: 'hall',
    name: { ar: 'باب الذهب', fr: 'Bab Dhahab', en: 'Bab Dhahab' },
    blurb: { ar: 'قصر بايليكي — ذهب وكريستال', fr: 'Palais beylical — or et cristal', en: 'Beylical palace — gold and crystal' },
    wall: '#241A0E', wallLo: '#140D06', door: '#1F3A2C', doorLo: '#132318',
    gold: '#C79A45', goldLo: '#8A6420', goldHi: '#F0DCA6',
    glow: '#E8B75F', ink: '#F6EBD2', rug: '#4A1E18'
  },
  imperiale: {
    scene: 'hall',
    name: { ar: 'الإمبراطورية', fr: "L'Impériale", en: 'Imperiale' },
    blurb: { ar: 'قاعة مذهّبة — فخامة مطلقة', fr: 'Salle dorée — luxe absolu', en: 'Gilded hall — absolute luxury' },
    wall: '#1B1509', wallLo: '#0C0904', door: '#2E1418', doorLo: '#1A0A0C',
    gold: '#D8AE55', goldLo: '#96702A', goldHi: '#F6E4B4',
    glow: '#F0C46A', ink: '#F8EFD8', rug: '#3A1216'
  }
};
function _lxTheme () { return LUXE_THEMES[(S.c && S.c.luxeTheme) || 'sidibou'] || LUXE_THEMES.sidibou; }

/* ---- name / initial helpers ---- */
function _lxSplitNames (n) {
  n = String(n || '').trim();
  const p = n.split(/\s*&\s*|\s+و\s+|\s*\+\s*/).filter(Boolean);
  return p.length >= 2 ? [p[0].trim(), p.slice(1).join(' ').trim()] : [n, ''];
}
function _lxInitials () {
  const [a, b] = _lxSplitNames((S.c && S.c.n) || '');
  const f = (s) => (s || '').charAt(0) || '';
  return b ? f(a) + f(b) : f(a) || '\u2726';
}
function _lxDate () {
  const c = S.c || {};
  return {
    dayName: c.dayName || '', num: c.dnum || _lxNum(c.d), mon: c.dmon || '',
    yr: c.dyr || _lxYear(c.d), when: c.when || '', full: c.d || ''
  };
}
function _lxNum (s) { const m = String(s || '').match(/\d{1,2}/); return m ? m[0] : ''; }
function _lxYear (s) { const m = String(s || '').match(/(20\d\d)/); return m ? m[1] : ''; }

/* ═══════════════ SVG art: shared defs, doors, hall, cartouche ═══════════════ */
function _lxDefs (t) {
  return `<defs>
    <linearGradient id="lxGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${t.goldHi}"/><stop offset="45%" stop-color="${t.gold}"/>
      <stop offset="100%" stop-color="${t.goldLo}"/>
    </linearGradient>
    <radialGradient id="lxGlow" cx="50%" cy="38%" r="62%">
      <stop offset="0%" stop-color="${t.glow}" stop-opacity=".55"/>
      <stop offset="55%" stop-color="${t.glow}" stop-opacity=".12"/>
      <stop offset="100%" stop-color="${t.wallLo}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lxWall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.wallLo}"/><stop offset="45%" stop-color="${t.wall}"/>
      <stop offset="100%" stop-color="${t.wallLo}"/>
    </linearGradient>
    <linearGradient id="lxDoor" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.doorLo}"/><stop offset="35%" stop-color="${t.door}"/>
      <stop offset="100%" stop-color="${t.doorLo}"/>
    </linearGradient>
    <pattern id="lxDamask" width="34" height="46" patternUnits="userSpaceOnUse">
      <path d="M17 4 q8 9 0 18 q-8-9 0-18 M17 24 q10 6 0 18 q-10-6 0-18 M2 14 q7 5 0 10 M32 14 q-7 5 0 10"
            fill="none" stroke="${t.gold}" stroke-opacity=".16" stroke-width="1.1"/>
      <circle cx="17" cy="23" r="1.5" fill="${t.gold}" fill-opacity=".2"/>
    </pattern>
    <linearGradient id="lxSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.sky1 || '#BEE0F2'}"/><stop offset="100%" stop-color="${t.sky2 || '#EAF6FB'}"/>
    </linearGradient>
    <linearGradient id="lxSea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.sea1 || '#2C6FA8'}"/><stop offset="100%" stop-color="${t.sea2 || '#1B4E7E'}"/>
    </linearGradient>
    <linearGradient id="lxStone" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${t.stone || '#EFE6D6'}"/><stop offset="100%" stop-color="${t.stoneLo || '#CDBEA4'}"/>
    </linearGradient>
    <filter id="lxSoft"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="lxGrain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/></filter>
  </defs>`;
}

/* the illuminated hall behind the doors (drawn) */
function _lxHallSVG (t) {
  let arches = '';
  [[46, .55], [104, .8], [356, .8], [414, .55]].forEach(([x, o]) => {
    arches += `<path d="M${x - 26} 620 L${x - 26} 250 q26-34 52 0 L${x + 26} 620 Z"
      fill="url(#lxWall)" opacity="${o}"/>
      <path d="M${x - 26} 620 L${x - 26} 250 q26-34 52 0 L${x + 26} 620"
      fill="none" stroke="url(#lxGold)" stroke-width="1.4" opacity=".55"/>`;
  });
  let crystals = '', strands = '';
  [[0, 24, 8, 168], [1, 34, 10, 190], [2, 44, 12, 214], [3, 30, 9, 238]].forEach(([r, rx, n, cy0]) => {
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + r * .3;
      const cx = 230 + Math.cos(a) * rx, cy = cy0 + Math.sin(a) * (rx * 0.24);
      crystals += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(2.4 - r * .25).toFixed(1)}" fill="${t.goldHi}" opacity="${(.95 - r * .12).toFixed(2)}"/>`;
      if (r === 2 && i % 2 === 0) {
        strands += `<path d="M${cx.toFixed(1)} ${cy.toFixed(1)} L${cx.toFixed(1)} ${(cy + 16 + (i % 3) * 7).toFixed(1)}" stroke="${t.goldHi}" stroke-width=".7" opacity=".5"/>
          <circle cx="${cx.toFixed(1)}" cy="${(cy + 16 + (i % 3) * 7).toFixed(1)}" r="1.5" fill="${t.goldHi}" opacity=".8"/>`;
      }
    }
  });
  let candles = '';
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    const cx = 230 + Math.cos(a) * 44, cy = 214 + Math.sin(a) * 10.5;
    candles += `<ellipse cx="${cx.toFixed(1)}" cy="${(cy - 7).toFixed(1)}" rx="2" ry="4.5" fill="${t.goldHi}" opacity=".9"/>
      <ellipse cx="${cx.toFixed(1)}" cy="${(cy - 7).toFixed(1)}" rx="7" ry="11" fill="${t.glow}" opacity=".28" filter="url(#lxSoft)"/>`;
  }
  let sconces = '';
  [86, 374].forEach((x) => {
    sconces += `<ellipse cx="${x}" cy="330" rx="4" ry="9" fill="${t.goldHi}" opacity=".85"/>
      <ellipse cx="${x}" cy="330" rx="26" ry="46" fill="${t.glow}" opacity=".2" filter="url(#lxSoft)"/>`;
  });
  return `<svg class="lx-art" viewBox="0 0 460 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    ${_lxDefs(t)}
    <rect width="460" height="760" fill="url(#lxWall)"/>
    <rect width="460" height="760" fill="url(#lxDamask)" opacity=".55"/>
    ${arches}
    <ellipse cx="230" cy="230" rx="150" ry="150" fill="url(#lxGlow)"/>
    ${sconces}
    <path d="M230 88 L230 158" stroke="url(#lxGold)" stroke-width="1.6"/>
    <circle cx="230" cy="160" r="4" fill="url(#lxGold)"/>
    <ellipse cx="230" cy="168" rx="24" ry="6.5" fill="none" stroke="url(#lxGold)" stroke-width="1.5"/>
    <ellipse cx="230" cy="190" rx="34" ry="9" fill="none" stroke="url(#lxGold)" stroke-width="1.3" opacity=".9"/>
    <ellipse cx="230" cy="214" rx="44" ry="11" fill="none" stroke="url(#lxGold)" stroke-width="1.2" opacity=".8"/>
    <ellipse cx="230" cy="238" rx="30" ry="8" fill="none" stroke="url(#lxGold)" stroke-width="1" opacity=".65"/>
    <path d="M230 246 L230 258" stroke="url(#lxGold)" stroke-width="1" opacity=".7"/>
    <circle cx="230" cy="261" r="3" fill="${t.goldHi}" opacity=".9"/>
    <ellipse cx="230" cy="205" rx="52" ry="52" fill="${t.glow}" opacity=".22" filter="url(#lxSoft)"/>
    ${strands}${candles}${crystals}
    <rect y="612" width="460" height="148" fill="${t.rug}" opacity=".5"/>
    <ellipse cx="230" cy="640" rx="150" ry="30" fill="${t.glow}" opacity=".14" filter="url(#lxSoft)"/>
    <rect width="460" height="760" filter="url(#lxGrain)" opacity=".5" fill="none"/>
  </svg>`;
}

/* a single carved door leaf */
function _lxDoorSVG (t, side) {
  const panels = [[64, 150], [64, 300], [64, 450]].map(([x, y]) =>
    `<rect x="${x - 40}" y="${y}" width="112" height="118" rx="5" fill="none"
      stroke="url(#lxGold)" stroke-width="1.5" opacity=".75"/>
     <rect x="${x - 32}" y="${y + 9}" width="96" height="100" rx="3" fill="none"
      stroke="url(#lxGold)" stroke-width=".8" opacity=".45"/>`).join('');
  const knobX = side === 'l' ? 176 : 14;
  return `<svg class="lx-art" viewBox="0 0 200 760" preserveAspectRatio="none" aria-hidden="true">
    ${_lxDefs(t)}
    <rect width="200" height="760" fill="url(#lxDoor)"/>
    <rect width="200" height="760" fill="url(#lxDamask)" opacity=".25"/>
    ${panels}
    <circle cx="${knobX}" cy="392" r="7" fill="url(#lxGold)"/>
    <circle cx="${knobX}" cy="392" r="12" fill="none" stroke="url(#lxGold)" stroke-width="1" opacity=".6"/>
    <rect x="${side === 'l' ? 194 : 0}" width="6" height="760" fill="${t.goldLo}" opacity=".5"/>
    <rect width="200" height="760" filter="url(#lxGrain)" opacity=".45" fill="none"/>
  </svg>`;
}

/* ornate gold cartouche holding the initials */
function _lxCartoucheSVG (t, initials) {
  return `<svg class="lx-cart-svg" viewBox="0 0 120 150" aria-hidden="true">
    ${_lxDefs(t)}
    <path class="lxC" d="M60 12 C92 12 108 44 108 75 C108 106 92 138 60 138 C28 138 12 106 12 75 C12 44 28 12 60 12 Z"
      fill="none" stroke="url(#lxGold)" stroke-width="2"/>
    <path class="lxC" d="M60 20 C87 20 100 48 100 75 C100 102 87 130 60 130 C33 130 20 102 20 75 C20 48 33 20 60 20 Z"
      fill="none" stroke="url(#lxGold)" stroke-width=".9" opacity=".6"/>
    <path class="lxC" d="M60 4 q6 6 0 12 q-6-6 0-12 M60 134 q6 6 0 12 q-6-6 0-12" fill="url(#lxGold)"/>
    <path class="lxC" d="M44 128 q16 8 32 0" fill="none" stroke="url(#lxGold)" stroke-width="1" opacity=".7"/>
    <text class="lx-cart-t" x="60" y="88" text-anchor="middle">${esc(initials)}</text>
  </svg>`;
}

/* ---- a Mediterranean vista seen through a Moorish arch ---- */
function _lxVistaSVG (t) {
  const isSun = t.vista === 'santorini';
  const horizon = 524;
  /* white town: cubes with domes */
  let town = '';
  const cubes = isSun
    ? [[74, 556, 76, 58], [150, 568, 62, 48], [206, 542, 84, 76], [286, 564, 70, 56], [352, 554, 74, 64]]
    : [[66, 562, 72, 54], [136, 548, 66, 70], [200, 568, 80, 52], [278, 546, 68, 72], [344, 566, 78, 54]];
  cubes.forEach(([x, y, w, h], i) => {
    town += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FBF8F2" opacity=".97"/>
      <rect x="${x}" y="${y}" width="${w}" height="4" fill="#E3DACB"/>`;
    for (let k = 0; k < 2; k++) {
      const wx = x + 12 + k * (w - 34), wy = y + 18 + (i % 2) * 10;
      town += `<rect x="${wx}" y="${wy}" width="13" height="17" rx="1.5" fill="${t.door}" opacity=".82"/>`;
    }
    if (i % 2 === (isSun ? 0 : 1)) {
      const cx = x + w / 2, ry = isSun ? 22 : 17;
      town += `<path d="M${cx - w * .32} ${y} a${w * .32} ${ry} 0 0 1 ${w * .64} 0 Z" fill="${isSun ? '#2E5F86' : t.door}" opacity=".9"/>
        <path d="M${cx} ${y - ry - 7} L${cx} ${y - ry}" stroke="${t.goldHi}" stroke-width="1.6"/>`;
    }
  });
  /* bougainvillea / jasmine on the arch */
  let bloom = '';
  const clusters = [[92, 176], [128, 148], [164, 132], [300, 134], [336, 150], [372, 180], [70, 236], [392, 240]];
  clusters.forEach(([bx, by], i) => {
    for (let k = 0; k < 9; k++) {
      const dx = bx + (Math.sin(i * 3 + k) * 21), dy = by + (Math.cos(i * 2 + k) * 17);
      bloom += `<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="${(2.6 + (k % 3)).toFixed(1)}" fill="${k % 4 === 0 ? '#FBF6EC' : t.bloom}" opacity="${(.62 + (k % 3) * .12).toFixed(2)}"/>`;
    }
    for (let k = 0; k < 5; k++) {
      const dx = bx + (Math.cos(i + k) * 25), dy = by + (Math.sin(i + k) * 21);
      bloom += `<ellipse cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" rx="5" ry="2.6" fill="${t.leaf}" opacity=".72" transform="rotate(${(k * 37) % 360} ${dx.toFixed(1)} ${dy.toFixed(1)})"/>`;
    }
  });
  const archHole = 'M70 706 L70 330 C58 202 150 142 230 142 C310 142 402 202 390 330 L390 706 Z';
  const sun = isSun
    ? `<circle cx="308" cy="470" r="30" fill="${t.glow}" opacity=".9"/>
       <ellipse cx="308" cy="470" rx="112" ry="88" fill="${t.glow}" opacity=".26" filter="url(#lxSoft)"/>
       <rect x="70" y="${horizon}" width="320" height="16" fill="${t.glow}" opacity=".35"/>`
    : `<ellipse cx="322" cy="238" rx="120" ry="96" fill="#FFFFFF" opacity=".2" filter="url(#lxSoft)"/>`;
  return `<svg class="lx-art" viewBox="0 0 460 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    ${_lxDefs(t)}
    <rect width="460" height="760" fill="url(#lxSky)"/>
    ${sun}
    <path d="M70 ${horizon - 6} q60-30 128-16 q70 14 122-6 L390 ${horizon} L70 ${horizon} Z" fill="${t.sea2}" opacity=".28"/>
    <rect y="${horizon}" width="460" height="132" fill="url(#lxSea)"/>
    <rect y="${horizon}" width="460" height="2" fill="#FFFFFF" opacity=".45"/>
    <g opacity=".3">${[542, 562, 586, 608].map((y, i) => `<path d="M${88 + i * 26} ${y} q22-6 44 0 q22 6 44 0 q22-6 44 0" fill="none" stroke="#FFFFFF" stroke-width="1"/>`).join('')}</g>
    ${town}
    <rect y="640" width="460" height="120" fill="url(#lxStone)"/>
    <rect y="640" width="460" height="3" fill="${t.stoneLo}"/>
    <g opacity=".5">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${28 + i * 62}" y="664" width="46" height="46" rx="3" fill="none" stroke="${t.door}" stroke-width="1.4"/><path d="M${51 + i * 62} 616 l11 11 -11 11 -11-11 Z" fill="${t.door}" opacity=".55"/>`).join('')}</g>
    <path d="M0 0 H460 V760 H0 Z ${archHole}" fill="url(#lxStone)" fill-rule="evenodd"/>
    <path d="${archHole}" fill="none" stroke="${t.stoneLo}" stroke-width="3"/>
    <path d="${archHole}" fill="none" stroke="${t.goldHi}" stroke-width="1" opacity=".55" transform="translate(0,6)"/>
    ${bloom}
    <rect width="460" height="760" filter="url(#lxGrain)" opacity=".4" fill="none"/>
  </svg>`;
}

/* ---- Tunisian studded door leaf (Sidi Bou Said blue) ---- */
function _lxStudDoorSVG (t, side) {
  let studs = '';
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 5; c++) {
      const x = 24 + c * 38, y = 176 + r * 50;
      const on = (r % 2 === 0) ? true : (c % 2 === 0);
      if (on) studs += `<circle cx="${x}" cy="${y}" r="3.4" fill="#0C1C30" opacity=".8"/><circle cx="${x - .9}" cy="${y - 1}" r="1.3" fill="${t.goldHi}" opacity=".35"/>`;
    }
  }
  let diamonds = '';
  [268, 468].forEach((y) => {
    diamonds += `<path d="M100 ${y} l30 30 -30 30 -30-30 Z" fill="none" stroke="#0C1C30" stroke-width="1.6" opacity=".5"/>`;
  });
  const half = side === 'l'
    ? 'M0 760 L0 300 C0 190 60 150 200 150 L200 760 Z'
    : 'M200 760 L200 150 C60 150 0 190 0 300 L0 760 Z';
  const knobX = side === 'l' ? 176 : 24;
  return `<svg class="lx-art" viewBox="0 0 200 760" preserveAspectRatio="none" aria-hidden="true">
    ${_lxDefs(t)}
    <rect width="200" height="760" fill="url(#lxStone)"/>
    <path d="${half}" fill="${t.door}"/>
    <path d="${half}" fill="url(#lxDamask)" opacity=".14"/>
    <path d="${half}" fill="none" stroke="${t.doorLo}" stroke-width="4"/>
    ${[210, 400, 590].map((y) => `<rect x="6" y="${y}" width="188" height="7" fill="${t.doorLo}" opacity=".55"/>`).join('')}
    ${studs}${diamonds}
    <circle cx="${knobX}" cy="556" r="9" fill="url(#lxGold)"/>
    <circle cx="${knobX}" cy="556" r="15" fill="none" stroke="url(#lxGold)" stroke-width="1.2" opacity=".55"/>
    <rect x="${side === 'l' ? 194 : 0}" width="6" height="760" fill="${t.doorLo}" opacity=".6"/>
    <rect width="200" height="760" filter="url(#lxGrain)" opacity=".4" fill="none"/>
  </svg>`;
}

/* pick the right art for the active collection */
function _lxSceneSVG (t) { return t.scene === 'vista' ? _lxVistaSVG(t) : _lxHallSVG(t); }
function _lxLeafSVG (t, side) { return t.scene === 'vista' ? _lxStudDoorSVG(t, side) : _lxDoorSVG(t, side); }

/* ═══════════════════════════ MOUNT ═══════════════════════════ */
let _lxTl = null, _lxTimers = [];
function _lxKill () {
  _lxTimers.forEach(clearTimeout); _lxTimers = [];
  if (_lxTl && _lxTl.kill) { try { _lxTl.kill(); } catch (e) {} }
  _lxTl = null;
}
let _lxReg = false;
function _lxG () {
  if (typeof window === 'undefined' || !window.gsap) return null;
  if (!_lxReg) {
    _lxReg = true;
    try {
      const pl = [];
      if (window.DrawSVGPlugin) pl.push(window.DrawSVGPlugin);
      if (window.SplitText) pl.push(window.SplitText);
      if (pl.length) window.gsap.registerPlugin.apply(window.gsap, pl);
    } catch (e) {}
  }
  return window.gsap;
}

function mountLuxe (stage) {
  if (!veil) return;
  _lxKill();
  veil.classList.add('luxe');
  if (typeof clearFilm === 'function') clearFilm();
  const t = _lxTheme();
  const v = veil.style;
  v.setProperty('--lx-gold', t.gold); v.setProperty('--lx-gold-lo', t.goldLo);
  v.setProperty('--lx-gold-hi', t.goldHi); v.setProperty('--lx-ink', t.ink);
  v.setProperty('--lx-wall', t.wall); v.setProperty('--lx-wall-lo', t.wallLo);

  const sc = veil.querySelector('.cine-scene');
  if (sc) sc.innerHTML = '';

  const c = S.c || {}, d = _lxDate();
  const [n1, n2] = _lxSplitNames(c.n);
  const kicker = c.t || (S.lang === 'ar' ? 'دعوة زفاف' : S.lang === 'fr' ? 'Invitation de mariage' : 'Wedding invitation');
  const tap = S.lang === 'ar' ? 'إضغطوا لفتح الباب' : S.lang === 'fr' ? 'Appuyez pour ouvrir' : 'Tap to open';
  const hallPhoto = _lxHallPhoto();
  const doorBg = LUXE_ASSETS.door.url
    ? `<div class="lx-art" style="background-image:url('${LUXE_ASSETS.door.url}');background-size:cover;background-position:center"></div>` : '';

  const light = t.scene === 'vista';
  v.setProperty('--lx-ink-soft', t.inkSoft || t.ink);
  stage.innerHTML = `<div class="lx-stage${light ? ' lx-light' : ''}" id="lxStage">
    <div class="lx-hall">
      ${hallPhoto ? `<div class="lx-art lx-hall-photo" style="background-image:url('${hallPhoto}')"></div>` : _lxSceneSVG(t)}
      <div class="lx-hall-scrim"></div>
      <div class="lx-hall-body">
        <div class="lx-cart" id="lxCart">${_lxCartoucheSVG(t, _lxInitials())}</div>
        <div class="lx-kick" id="lxKick">${esc(kicker)}</div>
        <div class="lx-names" id="lxNames">
          <span class="lx-nline">${esc(n1)}</span>
          ${n2 ? `<span class="lx-amp">&amp;</span><span class="lx-nline">${esc(n2)}</span>` : ''}
        </div>
        ${c.m ? `<div class="lx-msg" id="lxMsg">${esc(String(c.m).slice(0, 150))}</div>` : ''}
        <svg class="lx-div" id="lxDiv" viewBox="0 0 220 20" aria-hidden="true">
          <path class="lxD" d="M4 10 L86 10" stroke="var(--lx-gold)" stroke-width="1" fill="none"/>
          <path class="lxD" d="M134 10 L216 10" stroke="var(--lx-gold)" stroke-width="1" fill="none"/>
          <path class="lxD" d="M110 3 q7 7 0 14 q-7-7 0-14" fill="var(--lx-gold)" stroke="none"/>
          <circle class="lxD" cx="96" cy="10" r="1.8" fill="var(--lx-gold)"/>
          <circle class="lxD" cx="124" cy="10" r="1.8" fill="var(--lx-gold)"/>
        </svg>
        <div class="lx-date" id="lxDate">
          ${d.dayName ? `<span class="lx-dc">${esc(d.dayName)}</span><i class="lx-dsep"></i>` : ''}
          <span class="lx-dc lx-dmain">
            ${d.mon ? `<b class="lx-dmon">${esc(d.mon)}</b>` : ''}
            <b class="lx-dnum">${esc(d.num)}</b>
            ${d.yr ? `<b class="lx-dyr">${esc(d.yr)}</b>` : ''}
          </span>
          ${d.when ? `<i class="lx-dsep"></i><span class="lx-dc">${esc(d.when)}</span>` : ''}
        </div>
        ${c.p ? `<div class="lx-place" id="lxPlace">${esc(c.p)}</div>` : ''}
        <button class="lx-enter" id="lxEnter">${S.lang === 'ar' ? 'ادخلوا إلى الفرحة' : S.lang === 'fr' ? 'Entrer' : 'Enter'}</button>
      </div>
    </div>

    <div class="lx-doors" id="lxDoors">
      <div class="lx-jamb"></div>
      <div class="lx-leaf lx-l" id="lxL">${doorBg || _lxLeafSVG(t, 'l')}</div>
      <div class="lx-leaf lx-r" id="lxR">${doorBg || _lxLeafSVG(t, 'r')}</div>
      <div class="lx-front">
        <div class="lx-cart lx-cart-front" id="lxCartF">${_lxCartoucheSVG(t, _lxInitials())}</div>
        <div class="lx-cover-names">${esc(n1)}${n2 ? ' &amp; ' + esc(n2) : ''}</div>
        <div class="lx-tap" id="lxTap"><span>${esc(tap)}</span></div>
      </div>
    </div>
  </div>`;

  const doors = stage.querySelector('#lxDoors');
  if (doors) doors.onclick = function () {
    if (this.dataset.open) return;
    this.dataset.open = '1';
    try { if (typeof ceremonyMusic === 'function') ceremonyMusic('open'); } catch (e) {}
    _lxOpen(stage);
  };
  const en = stage.querySelector('#lxEnter');
  if (en) en.onclick = () => { try { reveal(); } catch (e) {} };
  _lxIntro(stage);
}

/* subtle idle animation on the closed doors */
function _lxIntro (stage) {
  const g = _lxG();
  const cart = stage.querySelector('#lxCartF');
  if (!g) { if (cart) cart.style.opacity = 1; return; }
  const paths = cart ? cart.querySelectorAll('.lxC') : [];
  g.set(stage.querySelector('.lx-front'), { opacity: 1 });
  const tl = g.timeline();
  if (paths.length && g.plugins && g.plugins.drawSVG) {
    tl.from(paths, { drawSVG: '0%', duration: 1.1, stagger: .12, ease: 'power2.inOut' }, 0);
  } else if (paths.length) {
    tl.from(paths, { opacity: 0, duration: .8, stagger: .1 }, 0);
  }
  tl.from(stage.querySelector('.lx-cart-t'), { opacity: 0, scale: .7, duration: .7, ease: 'back.out(2)' }, .5)
    .from(stage.querySelector('.lx-cover-names'), { opacity: 0, y: 14, duration: .8 }, .8)
    .from(stage.querySelector('#lxTap'), { opacity: 0, y: 10, duration: .7 }, 1.1);
  _lxTl = tl;
}

/* the opening: doors swing, hall settles, content cascades */
function _lxOpen (stage) {
  const g = _lxG();
  const L = stage.querySelector('#lxL'), R = stage.querySelector('#lxR');
  const front = stage.querySelector('.lx-front');
  const hall = stage.querySelector('.lx-hall');
  const items = ['#lxCart', '#lxKick', '#lxNames', '#lxMsg', '#lxDiv', '#lxDate', '#lxPlace']
    .map((s) => stage.querySelector(s)).filter(Boolean);
  const dParts = stage.querySelectorAll('.lxD');
  const cParts = stage.querySelectorAll('#lxCart .lxC');

  if (!g) { /* no GSAP: still work, just plainer */
    stage.classList.add('lx-open-css');
    items.forEach((el, i) => { _lxTimers.push(setTimeout(() => el.classList.add('lx-in'), 700 + i * 260)); });
    return;
  }

  const tl = g.timeline({ defaults: { ease: 'power3.inOut' } });
  tl.to(front, { opacity: 0, duration: .45, ease: 'power2.out' }, 0)
    .to([L, R], { scale: 1.012, duration: .3, ease: 'power2.out' }, 0)
    .to(L, { rotateY: -82, duration: 1.5 }, .25)
    .to(R, { rotateY: 82, duration: 1.5 }, .25)
    .to([L, R], { filter: 'brightness(.72)', duration: 1.4 }, .25)
    .fromTo(hall, { scale: 1.14, filter: 'brightness(.5)' },
      { scale: 1, filter: 'brightness(1)', duration: 2, ease: 'power2.out' }, .2)
    .set(stage.querySelector('#lxDoors'), { pointerEvents: 'none' }, 1.6);

  /* cartouche draws itself, then the lines arrive one by one */
  if (cParts.length && g.plugins && g.plugins.drawSVG) {
    tl.fromTo(cParts, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, stagger: .1, ease: 'power2.inOut' }, 1.15);
  }
  tl.fromTo(stage.querySelector('#lxCart'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9 }, 1.15);

  const seq = [['#lxKick', 1.55], ['#lxNames', 1.8], ['#lxMsg', 2.35], ['#lxDate', 2.9], ['#lxPlace', 3.2]];
  seq.forEach(([sel, at]) => {
    const el = stage.querySelector(sel); if (!el) return;
    if (sel === '#lxNames') {
      const lines = el.querySelectorAll('.lx-nline, .lx-amp');
      let split = null;
      if (window.SplitText) {
        try { split = new window.SplitText(el.querySelectorAll('.lx-nline'), { type: 'chars' }); } catch (e) {}
      }
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: .3 }, at);
      if (split && split.chars && split.chars.length) {
        tl.fromTo(split.chars, { opacity: 0, y: 26, rotateX: -55 },
          { opacity: 1, y: 0, rotateX: 0, duration: .7, stagger: .045, ease: 'back.out(1.6)' }, at);
      } else {
        tl.fromTo(lines, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .8, stagger: .18 }, at);
      }
    } else {
      tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .85 }, at);
    }
  });

  if (dParts.length) {
    if (g.plugins && g.plugins.drawSVG) {
      tl.fromTo(dParts, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: .9, ease: 'power2.out' }, 2.65);
    } else {
      tl.fromTo(dParts, { opacity: 0 }, { opacity: 1, duration: .6 }, 2.65);
    }
  }
  tl.fromTo(stage.querySelector('#lxEnter'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7 }, 3.5);
  _lxTl = tl;
}
