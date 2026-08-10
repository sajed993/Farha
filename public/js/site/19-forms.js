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
  /* Also to the database, which is what lets an owner open their guest list on
     their own phone. localStorage only ever holds what this one device saw, so
     without this the shared link would open empty for everybody else. */
  try {
    if (typeof dbHook === 'function') {
      if (k === FRM_K.rsvp)
        dbHook('rsvp', { inv_slug: row.invite, name: row.name, attending: !!row.coming,
                         guests: row.count || 1, message: row.msg });
      else
        dbHook('order', { item: row.filmName || (row.choice === 'new' ? 'فيلم جديد خاص' : 'دعوة'),
                          price: row.price || 0, phone: row.phone,
                          customer_name: row.name, payload: row });
    }
  } catch (e) {}
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
                      names: 'الأسماء', wish: 'ما نتخيّله', offer: 'الباقة' },
                fr: { film: 'Film', name: 'Nom', when: 'Date', place: 'Lieu',
                      names: 'Prénoms', wish: 'Souhaits', offer: 'Formule' },
                en: { film: 'Film', name: 'Name', when: 'Date', place: 'Venue',
                      names: 'Names', wish: 'Wishes', offer: 'Offer' } }[L];
  const bits = [head, ''];
  const add = (k, v) => { if (v && String(v).trim()) bits.push(lbl[k] + ': ' + v); };
  /* say which offer, so the conversation starts where the page left off */
  try { const O = t().off;
    const nm = (typeof offName === 'function') ? offName(o.tier === 'sign' ? 'sign' : 'ready')
             : (o.tier === 'sign' ? O.sName : O.rName);
    bits.push(lbl.offer + ': ' + nm); } catch (e) {}
  add('film', o.filmName); add('name', o.name); add('names', o.names);
  add('when', o.when + (o.time ? ' · ' + o.time : '')); add('place', o.place); add('wish', o.wish);
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
/* 'ready' picks from the shelf, 'sign' is one made from nothing. It changes
   the price shown, which film choice starts selected, and what the form
   leads with — asking a Signature buyer to pick from a shelf would be the
   wrong question. */
let FRM_TIER = 'ready';
/* Which occasion this is. One box labelled "names on the invitation" asked a
   couple to type two names into one field and a new parent to type one, and
   gave us a string nobody could split afterwards. The occasion decides which
   boxes appear, so a wedding asks for the groom and the bride separately and
   a birth asks for the baby. */
let FRM_CAT = 'wed';

/* Ideas live here rather than in the i18n file: they are the form's content,
   they change with the occasion, and there are a lot of them. */
const FRM_IDEAS = {
  ar: {
    msg: {
      wed: ['يتشرّفان بدعوتكم لمشاركتهما فرحة العمر',
            'بقلوب مفعمة بالسعادة ندعوكم لحضور حفل زفافنا',
            'وجودكم معنا هو أجمل هديّة'],
      henna: ['ندعوكم لليلة الحنّة — ليلة فرح وزغاريد',
              'شاركونا أحلى ليلة قبل العرس',
              'الحنّة على اليد، والفرح في القلب — كونوا معنا'],
      bday: ['ندعوكم لمشاركتنا فرحة عيد الميلاد',
             'شمعة جديدة، وفرحة نحبّ أن نعيشها معكم',
             'يوم جميل يستحق أن نحتفل به سويًّا'],
      baby: ['بفرحة كبيرة نبشّركم بقدوم مولودنا',
             'وصل أجمل ضيف إلى بيتنا — تعالوا نفرحو',
             'قلبنا امتلأ، وندعوكم لتشاركونا هذه الفرحة'],
      grad: ['بعد سنوات من التعب، وصلنا — شاركونا الفرحة',
             'ندعوكم لحفل التخرّج ومشاركتنا هذه اللحظة',
             'حلمٌ تحقّق، ونحبّ أن نحتفل به معكم'],
      save: ['احفظوا التاريخ — التفاصيل قريبًا',
             'شيءٌ جميل قادم، ونريدكم معنا فيه',
             'سجّلوا هذا اليوم عندكم من الآن'],
      open: ['يسرّنا دعوتكم لحضور افتتاح مقرّنا الجديد',
             'بابٌ جديد يُفتح، ونحبّ أن تكونوا أوّل من يعبره',
             'اشتغلنا على هذا المكان طويلًا — تعالوا نفتحه معًا']
    },
    wish: ['ألوان دافئة، ذهبي وكريمي، وموسيقى هادئة',
           'شيء بسيط وأنيق — أبيض وأخضر، بلا زخرفة كثيرة',
           'أجواء تونسية: زليج، ياسمين، وخطّ عربي',
           'أبيض وأسود، سينمائي، وموسيقى بيانو',
           'مرح وملوّن — نحبّ شيئًا يضحك القلب']
  },
  fr: {
    msg: {
      wed: ['Ont la joie de vous convier à leur mariage',
            'Avec le cœur plein, nous vous invitons à partager notre bonheur',
            'Votre présence est le plus beau des cadeaux'],
      henna: ['Nous vous invitons à la nuit du henné',
              'Partagez avec nous la plus belle nuit avant le mariage',
              'Le henné sur les mains, la joie dans le cœur — venez'],
      bday: ['Nous vous invitons à fêter cet anniversaire avec nous',
             'Une bougie de plus, et une joie à partager',
             'Une belle journée qui mérite d’être fêtée ensemble'],
      baby: ['C’est avec une immense joie que nous vous annonçons sa naissance',
             'Le plus beau des invités est arrivé — venez le rencontrer',
             'Notre cœur est comblé, et nous voulons le partager avec vous'],
      grad: ['Après des années de travail, nous y sommes — partagez notre joie',
             'Nous vous invitons à la cérémonie de remise des diplômes',
             'Un rêve réalisé, que nous aimerions fêter avec vous'],
      open: ['Nous avons le plaisir de vous convier à l’inauguration de notre nouvelle adresse',
             'Une porte s’ouvre — soyez les premiers à la franchir',
             'Nous avons longtemps travaillé sur ce lieu : ouvrons-le ensemble'],
      save: ['Réservez la date — les détails suivront',
             'Quelque chose de beau arrive, et nous vous y voulons',
             'Notez ce jour dès maintenant']
    },
    wish: ['Tons chauds, doré et crème, une musique douce',
           'Simple et élégant — blanc et vert, peu d’ornements',
           'Ambiance tunisienne : zellige, jasmin et calligraphie',
           'Noir et blanc, cinématographique, au piano',
           'Joyeux et coloré — quelque chose qui fait sourire']
  },
  en: {
    msg: {
      wed: ['Joyfully invite you to celebrate their wedding',
            'With full hearts, we invite you to share our day',
            'Your presence is the greatest gift'],
      henna: ['We invite you to our henna night',
              'Share the loveliest night before the wedding with us',
              'Henna on the hands, joy in the heart — be there'],
      bday: ['We invite you to celebrate this birthday with us',
             'One more candle, and a joy worth sharing',
             'A lovely day that deserves to be spent together'],
      baby: ['With great joy we announce the arrival of our baby',
             'The loveliest guest has arrived — come and meet them',
             'Our hearts are full, and we would like to share it'],
      grad: ['After years of work, we made it — share the joy',
             'We invite you to the graduation ceremony',
             'A dream come true, and we would love to celebrate it with you'],
      open: ['We are pleased to invite you to the opening of our new place',
             'A new door opens — be the first through it',
             'We worked on this place for a long time. Come and open it with us'],
      save: ['Save the date — details to follow',
             'Something lovely is coming, and we want you there',
             'Put this day in your calendar now']
    },
    wish: ['Warm tones, gold and cream, and quiet music',
           'Simple and elegant — white and green, little ornament',
           'A Tunisian feel: zellige, jasmine and Arabic calligraphy',
           'Black and white, cinematic, with piano',
           'Bright and colourful — something that makes you smile']
  }
};
function frmIdeas() { return FRM_IDEAS[S.lang] || FRM_IDEAS.ar; }

/* Which occasions the form offers. This was a hand-written list, so adding
   افتتاح to the shelf added it everywhere except here — the one place a
   customer actually orders from. It is read off the catalogue now: every
   occasion RD_CATS knows about that has at least one film still on the shelf.
   Adding the next one will need no edit here at all. */
function frmOccs() {
  let cats = ['wed','henna','bday','baby','grad','save'];
  try {
    const films = readyCatalogue().filter(x => x.v &&
      (typeof readyCfg !== 'function' || readyCfg(x.id).vis !== false));
    const have = RD_CATS.filter(k => k !== 'all' && films.some(f => f.cat === k));
    if (have.length) cats = have;
  } catch (e) {}
  return cats.filter(k => (t().rdCats || {})[k]);
}

/* Which name boxes an occasion needs. [id, label, required] */
function frmNameFields(cat) {
  const N = t().ordN;
  if (cat === 'baby') return [['ordNameA', N.baby, true], ['ordNameB', N.parents, false]];
  if (cat === 'bday') return [['ordNameA', N.celebrant, true], ['ordNameB', N.age, false]];
  if (cat === 'grad') return [['ordNameA', N.grad, true], ['ordNameB', N.degree, false]];
  if (cat === 'henna') return [['ordNameA', N.bride, true], ['ordNameB', N.groomOpt, false]];
  if (cat === 'open') return [['ordNameA', N.biz, true], ['ordNameB', N.bizWhat, false]];
  return [['ordNameA', N.groom, true], ['ordNameB', N.bride, true]];
}
/* the one string the invitation is titled with, built from the parts */
function frmJoinNames(cat, a, b) {
  a = (a || '').trim(); b = (b || '').trim();
  if (!a) return b;
  if (!b) return a;
  if (cat === 'bday') return a;                   /* the second box is an age */
  if (cat === 'baby' || cat === 'grad') return a; /* parents / degree are context */
  if (cat === 'open') return a;                   /* the trade is context, not a name */
  return a + (S.lang === 'ar' ? ' و ' : ' & ') + b;
}

/* Ideas for anyone staring at an empty field — folded away by default.
   Eight suggestions, each a full sentence, took about four hundred pixels of
   a phone screen from people who already knew what they wanted to write. One
   line now, and one tap to open. A <details> does this without script, keeps
   its own open state, and is reachable from a keyboard. */
function frmIdeaChips(target, list) {
  if (!list || !list.length) return '';
  return `<details class="frm-ideas" data-for="${target}">
    <summary>${esc(t().ordIdeas)}</summary>
    <div class="frm-idealist">${list.map((s, i) => `<button type="button" class="frm-idea"
      onclick="frmUseIdea('${target}',${i})">${esc(s)}</button>`).join('')}</div>
  </details>`;
}
function frmUseIdea(target, i) {
  const list = target === 'ordMsg' ? (frmIdeas().msg[FRM_CAT] || frmIdeas().msg.wed) : frmIdeas().wish;
  const el = document.getElementById(target);
  if (!el) return;
  el.value = list[i] || '';
  el.focus();
  /* the chosen one stays marked, so a second tap is clearly a change of mind */
  const wrap = document.querySelector('.frm-ideas[data-for="' + target + '"]');
  if (wrap) [...wrap.querySelectorAll('.frm-idea')].forEach((b, j) => b.classList.toggle('on', j === i));
}

/* the block that changes with the occasion, rebuilt in place so nothing
   already typed is lost when someone switches */
function frmEventHTML(cat) {
  const T = t();
  const fields = frmNameFields(cat);
  const msgIdeas = frmIdeas().msg[cat] || frmIdeas().msg.wed;
  return `
    <div class="frm-occs">${frmOccs().map(k =>
      `<button type="button" class="frm-occ ${cat === k ? 'on' : ''}"
        onclick="frmSetOcc('${k}')">${esc(T.rdCats[k])}</button>`).join('')}</div>

    <div class="frm-g2">${fields.map(([id, lbl, req]) =>
      `<label class="frm-f"><span>${esc(lbl)}${req ? ' <i>*</i>' : ''}</span>
        <input id="${id}" autocomplete="off"></label>`).join('')}</div>

    <div class="frm-g2 frm-when">
      <label class="frm-f"><span>${esc(T.ordDateL)}</span>
        <input id="ordWhen" type="date" dir="ltr" min="${new Date().toISOString().slice(0,10)}"></label>
      <label class="frm-f"><span>${esc(T.ordTimeL)}</span>
        <input id="ordTime" type="time" dir="ltr"></label>
    </div>
    <label class="frm-f"><span>${esc(T.ordPlaceL)}</span>
      <input id="ordPlace" placeholder="${esc(T.ordPlaceEg)}"></label>

    <label class="frm-f"><span>${esc(T.ordMsgL)}</span>
      <textarea id="ordMsg" rows="2"></textarea></label>
    ${frmIdeaChips('ordMsg', msgIdeas)}`;
}
function frmSetOcc(cat) {
  const host = document.getElementById('ordEvent');
  if (!host) return;
  /* carry across whatever fits: the first name always, the second only when
     the new occasion still has a second name box rather than an age */
  const keep = { a: frmVal('ordNameA'), b: frmVal('ordNameB'), when: frmVal('ordWhen'),
                 time: frmVal('ordTime'), place: frmVal('ordPlace'), msg: frmVal('ordMsg') };
  const wasPaired = FRM_CAT === 'wed' || FRM_CAT === 'save' || FRM_CAT === 'henna';
  FRM_CAT = cat;
  const isPaired = cat === 'wed' || cat === 'save' || cat === 'henna';
  host.innerHTML = frmEventHTML(cat);
  const set = (id, v) => { const e = document.getElementById(id); if (e && v) e.value = v; };
  set('ordNameA', keep.a);
  if (wasPaired === isPaired) set('ordNameB', keep.b);
  set('ordWhen', keep.when); set('ordTime', keep.time);
  set('ordPlace', keep.place); set('ordMsg', keep.msg);
  /* The shelf is filtered to the new occasion, so a film chosen under the old
     one may no longer be on screen. Keeping it selected would send an order
     naming a film the customer can no longer see; it is dropped and asked for
     again. Choosing a film from the shelf sets the occasion to match, so this
     only fires when the occasion is changed by hand. */
  FRM_ALLFILMS = false;
  const fh = document.getElementById('ordFilms');
  if (fh) {
    if (FRM_FILM && !frmFilmList().some((x) => x.id === FRM_FILM.id)) FRM_FILM = null;
    fh.innerHTML = frmFilmPicker();
    frmHead();
  }
}

function openOrder(filmId, tier) {
  closeOrder();
  const f = (typeof readyFilm === 'function' && filmId) ? readyFilm(filmId) : null;
  FRM_FILM = f;
  FRM_TIER = (tier === 'sign') ? 'sign' : 'ready';
  FRM_ALLFILMS = false;
  /* tapping a film already says what the occasion is; the chips still let it
     be changed, for anyone who liked a wedding film for their engagement */
  FRM_CAT = (f && f.cat) || 'wed';
  const sign = FRM_TIER === 'sign';
  const O = t().off;
  const nm = f ? (typeof readyName === 'function' ? readyName(f) : f.name[S.lang]) : '';
  const price = f && typeof readyPrice === 'function' ? readyPrice(f)
              : (typeof offTier === 'function' ? offTier()[FRM_TIER].price : 0);

  const d = document.createElement('div');
  d.className = 'frm-veil'; d.id = 'ordveil';
  d.onclick = e => { if (e.target === d) closeOrder(); };
  d.innerHTML = `<div class="frm-sheet ${sign ? 'is-sign' : ''}" role="dialog" aria-modal="true">
    <button class="frm-x" onclick="closeOrder()" aria-label="${esc(t().ordClose)}">✕</button>
    <h3 class="frm-t">${esc(sign ? (typeof offOne==='function'?offOne('sCta',O.sCta,'sign'):O.sCta) : t().ordT)}</h3>
    <p class="frm-sub">${esc(sign ? (typeof offOne==='function'?offOne('sFor',O.sFor,'sign'):O.sFor) : t().ordSub)}</p>
    ${f ? `<div class="frm-pick"><img src="${f.p}" alt="" loading="lazy">
      <span><b>${esc(nm)}</b><em>${price} ${esc(t().cur)}</em></span></div>`
      : `<div class="frm-pick tier"><span class="frm-tiern">${esc(typeof offName==='function'?offName(FRM_TIER):(sign?O.sName:O.rName))}</span>
      <span><em>${price} ${esc(t().cur)}</em></span></div>`}

    <label class="frm-l">${esc(t().ordWho)}</label>
    <div class="frm-g2">
      <input id="ordName" placeholder="${esc(t().ordName)}" autocomplete="name">
      <input id="ordPhone" placeholder="${esc(t().ordPhone)}" inputmode="tel" autocomplete="tel" dir="ltr">
    </div>

    <label class="frm-l">${esc(t().ordEv)}</label>
    <div id="ordEvent">${frmEventHTML(FRM_CAT)}</div>

    ${sign ? '' : `<label class="frm-l">${esc(t().ordFilm)}</label>
    <div id="ordFilms">${frmFilmPicker()}</div>`}

    <label class="frm-l">${esc(t().ordWish)}</label>
    <textarea id="ordWish" rows="${sign ? 5 : 3}" placeholder="${esc(t().ordWishPh)}"></textarea>
    ${frmIdeaChips('ordWish', frmIdeas().wish)}

    <div class="frm-act">
      <button class="frm-go" onclick="submitOrder()">${esc(t().ordSend)}</button>
      <button class="frm-alt" onclick="skipToWa()">${esc(t().ordSkip)}</button>
      <p class="frm-note">${esc(t().ordSkipNote)}</p>
    </div>
  </div>`;
  document.body.appendChild(d);
  scrollSync();
  setTimeout(() => { const n = document.getElementById('ordName'); if (n) n.focus(); }, 60);
}
function closeOrder() {
  const d = document.getElementById('ordveil');
  if (d) d.remove();
  scrollSync();
}
/* ═══ choosing the film ═══
   The first package is a ready film — that is the whole product — but the
   form asked for it with three radio buttons, one of which («اختاروا لي»)
   was ticked by default. Most orders therefore arrived naming no film at
   all, and an order with no film is delivered as a bare design.

   So it is a wall of posters now: you pick the one you saw. The occasion
   chosen above floats its own films to the front rather than hiding the
   rest, because somebody who liked a wedding film for their engagement
   should not have to fight the form for it. */
/* Films for the occasion that was chosen above, and only those. They used to
   be merely sorted to the front with everything else trailing behind, so
   picking «تخرّج» still showed weddings underneath — which reads as the filter
   being broken rather than as generosity. Anyone who does want a wedding film
   for their engagement can still ask, with «كل الأفلام». */
let FRM_ALLFILMS = false;
function frmFilmList() {
  let all = [];
  try { all = readyCatalogue().filter((x) => x.v && (typeof readyCfg !== 'function' || readyCfg(x.id).vis !== false)); }
  catch (e) { return []; }
  if (FRM_ALLFILMS) return all;
  const mine = all.filter((x) => x.cat === FRM_CAT);
  /* an occasion we have no film for must not leave the form with nothing to
     choose — better to show everything than to show an empty shelf */
  return mine.length ? mine : all;
}
function frmFilmPicker() {
  const list = frmFilmList();
  if (!list.length) return '';
  let total = 0;
  try { total = readyCatalogue().filter((x) => x.v && (typeof readyCfg !== 'function' || readyCfg(x.id).vis !== false)).length; }
  catch (e) { total = list.length; }
  const cats = t().rdCats || {};
  const cell = (x) => {
    const nm = (typeof readyName === 'function') ? readyName(x) : (x.name[S.lang] || x.id);
    const pr = (typeof readyPrice === 'function') ? readyPrice(x) : '';
    const on = !!(FRM_FILM && FRM_FILM.id === x.id);
    return `<button type="button" class="frm-film ${on ? 'on' : ''}" data-film="${esc(x.id)}"
      onclick="frmPickFilm('${x.id}')" aria-pressed="${on}">
      <img src="${esc(x.p)}" alt="" loading="lazy" decoding="async">
      <span class="frm-filmn">${esc(nm)}</span>
      <em>${esc(cats[x.cat] || '')}${pr ? ' · ' + pr + ' ' + esc(t().cur) : ''}</em>
      <i class="frm-filmtick">✓</i>
    </button>`;
  };
  const more = (!FRM_ALLFILMS && list.length < total)
    ? `<button type="button" class="frm-allfilms" onclick="frmShowAll()">${esc(t().ordFilmAll)}</button>` : '';
  return `<div class="frm-films">${list.map(cell).join('')}</div>${more}
   <p class="frm-filmnote">${esc(t().ordFilmNote)}</p>`;
}
function frmShowAll() {
  FRM_ALLFILMS = true;
  const host = document.getElementById('ordFilms');
  if (host) host.innerHTML = frmFilmPicker();
}
/* the card at the top of the sheet, which carries the price */
function frmHead() {
  const head = document.querySelector('#ordveil .frm-pick');
  if (!head) return;
  const f = FRM_FILM;
  if (!f) {
    const O = t().off, sign = FRM_TIER === 'sign';
    const price = (typeof offTier === 'function') ? offTier()[FRM_TIER].price : 0;
    head.className = 'frm-pick tier';
    head.innerHTML = `<span class="frm-tiern">${esc(typeof offName === 'function' ? offName(FRM_TIER) : (sign ? O.sName : O.rName))}</span>
      <span><em>${price} ${esc(t().cur)}</em></span>`;
    return;
  }
  const nm = (typeof readyName === 'function') ? readyName(f) : f.name[S.lang];
  const pr = (typeof readyPrice === 'function') ? readyPrice(f) : '';
  head.className = 'frm-pick';
  head.innerHTML = `<img src="${esc(f.p)}" alt="" loading="lazy">
    <span><b>${esc(nm)}</b><em>${pr} ${esc(t().cur)}</em></span>`;
}
function frmPickFilm(id) {
  const f = (typeof readyFilm === 'function') ? readyFilm(id) : null;
  if (!f) return;
  FRM_FILM = f;
  /* Only the two buttons whose state changed are touched. Rebuilding the grid
     recreated every <img>, so every poster was fetched and decoded again on
     each tap — the whole strip flickered and the scroll position jumped. */
  const host = document.getElementById('ordFilms');
  if (host) host.querySelectorAll('.frm-film').forEach((b) => {
    const on = b.dataset.film === id;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  frmHead();
}

function frmVal(id) { const e = document.getElementById(id); return e ? e.value.trim() : ''; }
function frmCollect() {
  const f = FRM_FILM;
  return {
    at: frmNow(), lang: S.lang,
    name: frmVal('ordName'), phone: frmVal('ordPhone'),
    occ: FRM_CAT,
    nameA: frmVal('ordNameA'), nameB: frmVal('ordNameB'),
    names: frmJoinNames(FRM_CAT, frmVal('ordNameA'), frmVal('ordNameB')),
    when: frmVal('ordWhen'), time: frmVal('ordTime'),
    place: frmVal('ordPlace'), msg: frmVal('ordMsg'),
    wish: frmVal('ordWish'),
    filmId: f ? f.id : '', filmName: f ? (typeof readyName === 'function' ? readyName(f) : f.name[S.lang]) : '',
    tier: FRM_TIER,
    /* Signature is always a new film; the ready package is always one of ours */
    choice: (FRM_TIER === 'sign') ? 'new' : (f ? f.id : ''),
    price: f && typeof readyPrice === 'function' ? readyPrice(f)
         : (typeof offTier === 'function' ? offTier()[FRM_TIER].price : 0)
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
  if (!o.name || !o.phone) {
    toast(t().ordNeed);
    const e = document.getElementById(o.name ? 'ordPhone' : 'ordName'); if (e) e.focus();
    return;
  }
  /* the names are what the invitation is titled with — an order without them
     costs a round trip on WhatsApp to ask */
  if (!o.nameA) { toast(t().ordNeedNames); const e = document.getElementById('ordNameA'); if (e) e.focus(); return; }
  /* an order for the ready package with no film named is an order we cannot
     deliver without a phone call — ask here instead */
  if (FRM_TIER !== 'sign' && !o.filmId) {
    toast(t().ordNeedFilm);
    const w = document.querySelector('#ordFilms .frm-films');
    if (w && w.scrollIntoView) w.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
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
    <div class="frm-act">
      <button class="frm-go" onclick="frmWaLast()">${esc(t().ordWa)}</button>
      <button class="frm-alt" onclick="closeOrder()">${esc(t().ordClose)}</button>
    </div>
  </div>`;
  document.body.appendChild(d);
  scrollSync();
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
    <div class="frm-act">
      <button class="frm-go" onclick="submitRsvp(${coming ? 1 : 0})">${esc(t().rvSend)}</button>
    </div>
  </div>`;
  document.body.appendChild(d);
  scrollSync();
  setTimeout(() => { const n = document.getElementById('rvName'); if (n) n.focus(); }, 60);
}
function closeRsvp() { const d = document.getElementById('rvveil'); if (d) d.remove(); scrollSync(); }
function submitRsvp(coming) {
  const name = frmVal('rvName');
  if (!name) { toast(t().rvNeed); return; }
  const row = {
    at: frmNow(), lang: S.lang,
    /* The slug of the invitation this guest is standing in. It has to be the
       slug and nothing else: the guest list is looked up by it, and falling
       back to the couple's name filed every reply somewhere the list could
       never find it. */
    invite: (typeof window !== 'undefined' && window.__inviteSlug)
            || (S.c && S.c.film) || (S.c && S.c.n) || '',
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
