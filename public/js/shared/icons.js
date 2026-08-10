/* ================= علامات القوالب =================
   Named MARKS, not ICONS: 16-editorial-invitation.js already owns EDI_ICONS
   (the row of medallions further down the invitation), and a second const of
   the same name in a classic script throws and takes that whole file with it.
   The mark in the middle of an invitation. There used to be exactly one — an
   oval cartouche — on every template, which is a large part of why they all
   read alike.

   Weddings keep that cartouche: they are the bulk of the catalogue, the mark
   suits them, and there is no reason to disturb invitations that already work.
   Everything else takes the mark that describes it.

   Loaded by the site and by the dashboard, so the picker and the invitation
   are never drawing from two different lists. */

const EDI_MARK_STROKE =
  "stroke='currentColor' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'";

const EDI_MARKS = {
  /* the original — an oval cartouche, still the default for weddings */
  cartouche:
    "<ellipse cx='50' cy='50' rx='26' ry='34' S/><ellipse cx='50' cy='50' rx='22' ry='30' S opacity='.5'/>" +
    "<path d='M50 12c-4.5 4-6.5 8.5-6.5 13M50 12c4.5 4 6.5 8.5 6.5 13' S opacity='.7'/>" +
    "<path d='M50 88c-4.5-4-6.5-8.5-6.5-13M50 88c4.5-4 6.5-8.5 6.5-13' S opacity='.7'/>" +
    "<circle cx='50' cy='11' r='2' fill='currentColor' stroke='none'/>" +
    "<circle cx='50' cy='89' r='2' fill='currentColor' stroke='none'/>",
  arch:
    "<path d='M22 84V44a28 28 0 0 1 56 0v40' S/><path d='M32 84V46a18 18 0 0 1 36 0v38' S opacity='.5'/>" +
    "<path d='M14 84h72' S/><circle cx='50' cy='30' r='2.4' fill='currentColor' stroke='none'/>",
  rings:
    "<circle cx='40' cy='54' r='19' S/><circle cx='62' cy='54' r='19' S/>" +
    "<path d='M40 35l3-8 3 8' S opacity='.7'/>",
  bloom:
    "<path d='M50 18v14' S/><path d='M50 32c-9 0-15 7-15 14s6 13 15 13 15-6 15-13-6-14-15-14z' S/>" +
    "<path d='M42 62c-2 8-1 14 8 20 9-6 10-12 8-20' S opacity='.65'/>" +
    "<circle cx='50' cy='46' r='3' fill='currentColor' stroke='none'/>",
  star:
    "<path d='M50 14l9 18 20 3-14 14 3 20-18-9-18 9 3-20-14-14 20-3z' S/>" +
    "<path d='M50 30l4.5 9 10 1.5-7 7 1.5 10-9-4.5-9 4.5 1.5-10-7-7 10-1.5z' S opacity='.45'/>",
  hands:
    "<path d='M26 62c6-10 14-16 24-16s18 6 24 16' S/><circle cx='50' cy='40' r='7' S/>" +
    "<path d='M30 68c8 8 32 8 40 0' S opacity='.6'/>",
  record:
    "<circle cx='48' cy='56' r='28' S/><circle cx='48' cy='56' r='9' S opacity='.6'/>" +
    "<circle cx='48' cy='56' r='2.4' fill='currentColor' stroke='none'/><path d='M70 26l10 10-14 12' S/>",
  henna:
    "<path d='M36 78V46a5 5 0 0 1 10 0v-8a5 5 0 0 1 10 0v6a5 5 0 0 1 10 0v22a16 16 0 0 1-16 16h-4a10 10 0 0 1-10-10z' S/>" +
    "<path d='M46 60h10' S opacity='.55'/><path d='M28 26a12 12 0 1 0 12 12' S opacity='.7'/>",
  cap:
    "<path d='M12 42l38-16 38 16-38 16z' S/><path d='M28 50v18c0 6 10 10 22 10s22-4 22-10V50' S/>" +
    "<path d='M84 46v20' S opacity='.7'/><circle cx='84' cy='70' r='3' fill='currentColor' stroke='none'/>",
  crib:
    "<path d='M24 46v34M76 46v34M24 80h52' S/><path d='M24 58h52' S opacity='.5'/>" +
    "<path d='M36 46V32M50 46V26M64 46V32' S opacity='.7'/>" +
    "<circle cx='50' cy='22' r='3' fill='currentColor' stroke='none'/>",
  candle:
    "<path d='M40 82V50h20v32z' S/><path d='M50 50V38' S/>" +
    "<path d='M50 38c-5-4-5-10 0-16 5 6 5 12 0 16z' S/><path d='M32 82h36' S opacity='.6'/>",
  date:
    "<rect x='22' y='30' width='56' height='52' rx='6' S/><path d='M22 46h56' S/>" +
    "<path d='M36 22v14M64 22v14' S/><circle cx='50' cy='64' r='7' S opacity='.65'/>",
  compass:
    "<circle cx='50' cy='54' r='30' S/><path d='M62 42L44 50l-6 20 18-8z' S/>" +
    "<circle cx='50' cy='54' r='2.6' fill='currentColor' stroke='none'/>" +
    "<path d='M50 18v6M50 84v6M14 54h6M80 54h6' S opacity='.6'/>",
  gate:
    "<path d='M20 84V40l30-18 30 18v44' S/><path d='M38 84V58a12 12 0 0 1 24 0v26' S/><path d='M12 84h76' S/>",
  bow:
    "<path d='M50 46c-6-12-26-14-26 0s20 12 26 0z' S/><path d='M50 46c6-12 26-14 26 0s-20 12-26 0z' S/>" +
    "<circle cx='50' cy='46' r='5' S/><path d='M45 52l-7 28 10-7 10 7-7-28' S opacity='.75'/>",
};

/* what each is called in the dashboard picker */
const EDI_MARK_NAMES = {
  cartouche: 'الإطار البيضاوي (الافتراضي)', arch: 'قوس', rings: 'خاتمان',
  bloom: 'زهرة', star: 'نجمة زليج', hands: 'يدان', record: 'أسطوانة',
  henna: 'كفّ حنّة', cap: 'قبّعة تخرّج', crib: 'سرير مولود', candle: 'شمعة',
  date: 'تقويم', compass: 'بوصلة', gate: 'بوّابة', bow: 'شريطة',
};

/* The SVG for one key, sized by whatever contains it. `weight` is for the
   programme medallions: those were drawn on a 32 viewBox at stroke 1.3, which
   is 4% of the box, and these are drawn on 100 at 1.5, which is 1.5%. Used at
   medallion size without it, a mark arrives as a hairline next to the ones it
   is standing in for. */
function ediMarkSVG(key, weight) {
  const body = EDI_MARKS[key] || EDI_MARKS.cartouche;
  const stroke = weight
    ? EDI_MARK_STROKE.replace("stroke-width='1.5'", "stroke-width='" + weight + "'")
    : EDI_MARK_STROKE;
  return "<svg viewBox='0 0 100 100' aria-hidden='true' focusable='false'>"
       + body.split(' S').join(' ' + stroke) + "</svg>";
}
