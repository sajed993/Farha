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

function offersHTML() {
  const T = t(), O = T.off, P = offTier(), C = offCounts();
  /* the headline of the first card is the shelf counting itself */
  const line1 = O.rFilms.replace('{n}', offerNum(C.films)).replace('{c}', offerNum(C.cats));
  const rRevs = O.revs.replace('{n}', offerNum(P.ready.revs));
  const sRevs = O.revs.replace('{n}', offerNum(P.sign.revs));
  const rDays = O.days.replace('{n}', offerNum(P.ready.days));
  const sDays = O.days.replace('{n}', offerNum(P.sign.days));

  const price = (p, cur) => `<div class="off-price">
    ${p.was > p.price ? `<s>${offerNum(p.was)}</s>` : ''}
    <b>${offerNum(p.price)}</b><i>${esc(cur)}</i></div>`;
  const li = s => `<li>${esc(s)}</li>`;

  return `<section id="offers">
   <div class="sec-head"><span class="kicker">${esc(O.kick)}</span>
    <h2>${esc(O.title)}</h2><p>${esc(O.sub)}</p></div>

   <div class="off-grid">

    <article class="off-card off-ready">
     <span class="off-ribbon">${esc(O.rRibbon)}</span>
     <div class="off-mark">${OFF_MARK.ready}</div>
     <h3>${esc(O.rName)}</h3>
     <p class="off-for">${esc(O.rFor)}</p>
     ${price(P.ready, T.cur)}
     <ul class="off-list">
      ${li(line1)}${li(O.rInter)}${li(O.rNames)}${li(rRevs)}${li(rDays)}
     </ul>
     <button class="off-go" onclick="openOrder('','ready')">${esc(O.rCta)}</button>
     <button class="off-see" onclick="scrollSec('ready')">${esc(O.rSee)}</button>
    </article>

    <article class="off-card off-sign">
     ${OFF_FLOUR}
     <div class="off-mark">${OFF_MARK.sign}</div>
     <h3>${esc(O.sName)}</h3>
     <p class="off-for">${esc(O.sFor)}</p>
     ${price(P.sign, T.cur)}
     <ul class="off-list">
      ${li(O.sAll)}${li(O.sMade)}${li(O.sCalli)}${li(O.sHand)}${li(sRevs)}${li(sDays)}
     </ul>
     <button class="off-go" onclick="openOrder('','sign')">${esc(O.sCta)}</button>
     <p class="off-note">${esc(O.sNote)}</p>
    </article>

   </div>
  </section>`;
}
