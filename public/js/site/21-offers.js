/* ================= the two ways to buy =================
   Two cards, and the whole decision sits in them.

   المجموعة — pick a film we have already made. Its headline number is not
   written anywhere: it counts the films actually on the shelf, so adding one
   in the dashboard changes the offer without anyone touching this file.

   التوقيع — one made for them alone. It is the dearer card, and it is drawn
   to look it: ink ground, foil rule, its own ornament. Nobody should need the
   word «premium» to see which is which.

   Both buttons land in the same order form the shelf uses, with the tier
   carried through — Signature arrives with «a film made for us» already
   chosen, because that is the only thing it can mean. */

function offTier() {
  const o = (typeof CFG !== 'undefined' && CFG && CFG.offers) || {};
  return {
    ready: {
      price: +o.readyPrice || +CFG.price.ready || 99,
      was: +o.readyWas || +CFG.price.readyWas || 0,
      revs: +o.readyRevs || 3,
      days: +o.readyDays || 2
    },
    sign: {
      price: +o.signPrice || 249,
      was: +o.signWas || 0,
      revs: +o.signRevs || 5,
      days: +o.signDays || 7
    }
  };
}

/* what the shelf actually holds right now, so the offer never overstates it */
function offCounts() {
  let films = [];
  try { films = readyShown(); } catch (e) {}
  const cats = {};
  films.forEach(f => { cats[f.cat] = 1; });
  return { films: films.length, cats: Object.keys(cats).length };
}

/* ---- every word on the cards, and where it comes from ------------------
   Anything typed in the dashboard for the language being read wins; anything
   left empty falls through to the copy that ships. So a half-translated card
   is still a whole card, and clearing a field is how you undo an edit. */
function offTxt() {
  const o = (typeof CFG !== 'undefined' && CFG && CFG.offers && CFG.offers.txt) || {};
  return o[S.lang] || {};
}
/* Numbers stay live inside whatever sentence the owner writes: {n} films on
   the shelf, {c} occasions they cover, {r} rounds of changes, {d} days to
   deliver. That is what keeps the copy editable without freezing the counts. */
function offFill(str, tier) {
  const C = offCounts(), P = offTier()[tier] || {};
  return String(str || '')
    .replace(/\{n\}/g, C.films).replace(/\{c\}/g, C.cats)
    .replace(/\{r\}/g, P.revs).replace(/\{d\}/g, P.days);
}
/* one field: dashboard text if there is any, else the shipped line */
function offOne(key, fallback, tier) {
  const v = offTxt()[key];
  return offFill((v && String(v).trim()) ? v : fallback, tier);
}
/* the bullet list: a written list replaces the shipped one wholesale, because
   picking which shipped lines survive an edit would be guesswork */
function offLines(key, fallback, tier) {
  const raw = offTxt()[key];
  const own = Array.isArray(raw) ? raw.filter(x => String(x || '').trim()) : [];
  return (own.length ? own : fallback).map(x => offFill(x, tier));
}

/* ── drawn marks, not emoji ── */
const OFF_MARK = {
  /* three plates stacked: the shelf, in one glyph */
  ready: `<svg viewBox="0 0 46 46" fill="none" aria-hidden="true">
    <rect x="6" y="12" width="22" height="30" rx="4" stroke="currentColor" stroke-width="1.5" opacity=".35"/>
    <rect x="11" y="8" width="24" height="33" rx="4" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
    <rect x="17" y="4" width="24" height="34" rx="4" stroke="currentColor" stroke-width="1.6"/>
    <path d="M25 15.5l7 5.5-7 5.5z" fill="currentColor"/></svg>`,
  /* a nib and its stroke: something written rather than chosen */
  sign: `<svg viewBox="0 0 46 46" fill="none" aria-hidden="true">
    <path d="M9 37c6-3 8.5-8 11-14.5S25.5 9 31 6c3.5-1.9 7 .4 6.4 4.2-.8 5.2-5.6 8.9-11.4 10.6-4.3 1.3-8.4 1.1-10.6.4"
     stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M9 37l5.5-5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="33.5" cy="30.5" r="2" fill="currentColor" opacity=".55"/>
    <circle cx="38" cy="24" r="1.3" fill="currentColor" opacity=".35"/></svg>`
};
/* a corner flourish for the signature card */
const OFF_FLOUR = `<svg class="off-flour" viewBox="0 0 120 120" fill="none" aria-hidden="true">
  <path d="M120 0c-26 4-46 18-58 38-9 15-14 32-27 42-9 7-21 10-35 9"
   stroke="currentColor" stroke-width="1.1" opacity=".5"/>
  <path d="M120 22c-19 5-33 16-42 31-8 13-15 25-27 32"
   stroke="currentColor" stroke-width="1.1" opacity=".3"/>
  <circle cx="62" cy="38" r="2.4" fill="currentColor" opacity=".45"/></svg>`;

function offerNum(n) { return String(n); }

/* the shipped bullet lists, written with the same tokens the dashboard uses */
function offDefLines(tier) {
  const O = t().off;
  return tier === 'ready'
    ? [O.rFilms, O.rInter, O.rNames, O.revs, O.days]
    : [O.sAll, O.sMade, O.sCalli, O.sHand, O.revs, O.days];
}
/* the card names are wanted in more than one place — the order form titles its
   sheet with whichever the visitor clicked */
function offName(tier) {
  const O = t().off;
  return tier === 'sign' ? offOne('sName', O.sName, 'sign') : offOne('rName', O.rName, 'ready');
}

function offersHTML() {
  const T = t(), O = T.off, P = offTier();
  const price = (p, cur) => `<div class="off-price">
    ${p.was > p.price ? `<s>${offerNum(p.was)}</s>` : ''}
    <b>${offerNum(p.price)}</b><i>${esc(cur)}</i></div>`;
  const list = ls => `<ul class="off-list">${ls.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
  /* Emptying a field means «use the shipped line», so it cannot also mean
     «remove this». The two optional bits get their own switch. */
  const oc = (typeof CFG !== 'undefined' && CFG && CFG.offers) || {};
  const ribbon = (oc.ribbonOn === 0) ? '' : offOne('rRibbon', O.rRibbon, 'ready');
  const note = (oc.noteOn === 0) ? '' : offOne('sNote', O.sNote, 'sign');

  return `<section id="offers">
   <div class="sec-head"><span class="kicker">${esc(offOne('kick', O.kick, 'ready'))}</span>
    <h2>${esc(offOne('title', O.title, 'ready'))}</h2>
    <p>${esc(offOne('sub', O.sub, 'ready'))}</p></div>

   <div class="off-grid">

    <article class="off-card off-ready">
     ${ribbon ? `<span class="off-ribbon">${esc(ribbon)}</span>` : ''}
     <div class="off-mark">${OFF_MARK.ready}</div>
     <h3>${esc(offName('ready'))}</h3>
     <p class="off-for">${esc(offOne('rFor', O.rFor, 'ready'))}</p>
     ${price(P.ready, T.cur)}
     ${list(offLines('rLines', offDefLines('ready'), 'ready'))}
     <button class="off-go" onclick="openOrder('','ready')">${esc(offOne('rCta', O.rCta, 'ready'))}</button>
     <button class="off-see" onclick="scrollSec('ready')">${esc(offOne('rSee', O.rSee, 'ready'))}</button>
    </article>

    <article class="off-card off-sign">
     ${OFF_FLOUR}
     <div class="off-mark">${OFF_MARK.sign}</div>
     <h3>${esc(offName('sign'))}</h3>
     <p class="off-for">${esc(offOne('sFor', O.sFor, 'sign'))}</p>
     ${price(P.sign, T.cur)}
     ${list(offLines('sLines', offDefLines('sign'), 'sign'))}
     <button class="off-go" onclick="openOrder('','sign')">${esc(offOne('sCta', O.sCta, 'sign'))}</button>
     ${note ? `<p class="off-note">${esc(note)}</p>` : ''}
    </article>

   </div>
  </section>`;
}
