/* ================= ألوان الختم وأختامه =================
   The seal was one colour and one emblem: a gold disc with the initials
   pressed into it. Every invitation on the shelf wore the same one, and there
   was no way to change it without editing the code.

   Loaded by the site and by the dashboard, like the marks and the catalogue,
   so the picker and the invitation can never drift apart.

   The colours are the ones wax actually comes in — the reference set that
   prompted this is a shop's range of sealing wax, and these are its colours
   rebuilt as gradient bases rather than its photographs, which are somebody
   else's product shots and not ours to ship. Drawn rather than pasted also
   means a seal recolours with its film instead of being a fixed picture. */

const WAX_COLS = {
  gold:       { hex: '#A87A28', ar: 'ذهبي' },
  copper:     { hex: '#9C5A2E', ar: 'نحاسي' },
  bronze:     { hex: '#7A5A2E', ar: 'برونزي' },
  silver:     { hex: '#8E8A86', ar: 'فضّي' },
  ivory:      { hex: '#D8CBB2', ar: 'عاجي' },
  blush:      { hex: '#C7959A', ar: 'وردي باهت' },
  burgundy:   { hex: '#6E2231', ar: 'خمري' },
  terracotta: { hex: '#A65A3A', ar: 'طيني' },
  sage:       { hex: '#6F7F5E', ar: 'أخضر مريمي' },
  navy:       { hex: '#25314A', ar: 'كحلي' },
  black:      { hex: '#241F1C', ar: 'أسود' },
};

/* What is pressed into it. 'ini' is the initials, which is what it always
   did; the rest are the marks already in the library, so an opening can be
   sealed with a ribbon and a travel agency with a compass. */
const WAX_EMS = {
  ini:      'الحرفان الأوّلان (الافتراضي)',
  rings:    'خاتمان',
  bloom:    'زهرة',
  star:     'نجمة زليج',
  hands:    'يدان',
  henna:    'كفّ حنّة',
  candle:   'شمعة',
  crib:     'سرير مولود',
  cap:      'قبّعة تخرّج',
  compass:  'بوصلة',
  gate:     'بوّابة',
  bow:      'شريطة',
  date:     'تقويم',
  arch:     'قوس',
  cartouche:'إطار بيضاوي',
};

function waxHex(key) {
  const c = WAX_COLS[key];
  return c ? c.hex : '';
}

/* A standalone SVG for a mark, as a data URI an <img> can load. ediMarkSVG
   draws with currentColor and no xmlns, both of which are right inside the
   page and wrong for an image the canvas has to rasterise. */
function waxEmblemURI(key, colour, weight) {
  if (typeof EDI_MARKS === 'undefined') return '';
  const body = EDI_MARKS[key] || EDI_MARKS.cartouche;
  const stroke = "stroke='" + (colour || '#000') + "' fill='none' stroke-width='"
    + (weight || 5) + "' stroke-linecap='round' stroke-linejoin='round'";
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='200' height='200'>"
    + body.split(' S').join(' ' + stroke).split('currentColor').join(colour || '#000')
    + "</svg>";
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
