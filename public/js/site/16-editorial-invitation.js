/* ================= editorial invitation =================
   A full-bleed, portrait, scrolling invitation — the photographic tier.
   Photographs live in /img/inv/<key>.jpg and are optional: each plate falls
   back to a CSS backdrop, so the layout ships before the images do. */

const EDI_PLATES=['hero','hall','detail','venue'];
const EDI_IMG_BASE='/img/inv/';
const ediImgOK={};

/* Probe each plate once; a missing file just leaves the CSS backdrop in place. */
function ediPreload(done){
 let left=EDI_PLATES.length;
 const tick=()=>{if(--left<=0&&done)done();};
 EDI_PLATES.forEach(k=>{
  if(ediImgOK[k]!==undefined){tick();return;}
  const im=new Image();
  im.onload=()=>{ediImgOK[k]=im.naturalWidth>0;tick();};
  im.onerror=()=>{ediImgOK[k]=false;tick();};
  im.src=EDI_IMG_BASE+k+'.jpg';});
 if(!EDI_PLATES.length&&done)done();}

/* Sections share one film, so each enters it at a different moment — the
   scroll then reads as a journey rather than the same shot four times. */
/* ---- film plate style ----
   Two scopes: the ready films we ship, and invitations a customer builds.
   A film may override the scope default; the URL may override both, which is
   how the dashboard previews a style without saving it. */
const EDI_VID=['full','window','arch','medal','split','band','duo'];
function ediVidStyle(){
 try{
  const q=new URLSearchParams(location.search).get('vidStyle');
  if(q&&EDI_VID.indexOf(q)>=0)return q;
 }catch(e){}
 if(S.c.vidStyle&&EDI_VID.indexOf(S.c.vidStyle)>=0)return S.c.vidStyle;
 const V=(typeof CFG!=='undefined'&&CFG&&CFG.vid)||{};
 const scope=S.c.film?'site':'customer';
 const w=V[scope];
 return (w&&EDI_VID.indexOf(w)>=0)?w:'full';}

/* The fixed per-plate cues that used to live here are gone. They gave each
   plate a different moment of the film, which looked varied standing still and
   jumped every time a guest scrolled. One clock now — see ediClockGive. */
/* Is this invitation running the one-film-behind-everything layout? Asked in
   two places — by the backdrop that builds the film, and by the plates that
   must then not build anything at all. */
function ediStickyOn(){
 return S.c.ediLayout==='sticky' && !!(S.c.films&&S.c.films.hero)
        && /\.mp4$/i.test(S.c.films.hero);}

/* A plate is a film when one is assigned, else a photograph, else the CSS wash. */
function ediPlate(k,cls){
 /* Under the sticky layout there are no plates. Hiding them in CSS was not
    enough: a display:none <video> is still in the document and still fetches
    its file, so a guest was pulling the same film five times over to look at
    one of them. Nothing is built, so nothing is downloaded. */
 if(ediStickyOn())return '';
 const film=S.c.films&&S.c.films[k];
 if(film&&/\.mp4$/i.test(film)){
  const poster=film.replace(/\.mp4$/,'.jpg');
  /* The cue used to be baked into the src as a #t= fragment. It reads well —
     the browser starts decoding at the cue instead of being seeked afterwards
     — but a fragment makes a different URL, and a different URL is a different
     resource: the same film was downloaded once per plate. Four plates, four
     downloads. Measured on قصر الرخام, a guest transferred 16MB of a 4MB film.
     The cue is carried as data now and applied once the metadata is in, so all
     four plates share one file and one download. */
  /* the poster is the plate's own ground, not only the video's poster
     attribute: a <video> with no data draws nothing, and the section behind
     showed through for the half second it took to arrive. */
  return `<div class="edi-ph film ${cls||''}" style="background-image:url('${poster}')"><video src="${film}" poster="${poster}"
    muted loop playsinline preload="${k==='hero'?'auto':'metadata'}"></video></div>`;}
 if(film)
  return `<div class="edi-ph has ${cls||''}" style="background-image:url('${film}')"></div>`;
 const on=ediImgOK[k];
 return `<div class="edi-ph p-${k} ${on?'has':''} ${cls||''}"${on?` style="background-image:url('${EDI_IMG_BASE}${k}.jpg')"`:''}></div>`;}

/* ═══ كلمات كل مناسبة ═══
   Every label inside the invitation came from one flat set — رسالة العروسين,
   باقٍ لبداية الفرح, ننتظركم بكل الشوق — so a travel agency's opening invited
   you to a couple's wedding in its own words. The weddings read correctly and
   are left exactly as they are; every other occasion overrides only the lines
   that are actually about a bride and groom.

   Two layers: the occasion, then the film. الإقلاع and البوّابة are travel
   agencies, so their words are about journeys rather than about a new office —
   the same category, a different room. */

const EDI_WORDS = {
 henna:{
  ar:{msgL:'كلمة العروس',msgS:'ليلةٌ تُحفظ في القلب',
   msgBody:'ليلة الحنّة ليست تفصيلًا صغيرًا قبل العرس — هي ليلتنا نحن. نحبّ أن نراكم فيها، ونسمع زغاريدكم قبل كلّ شيء.',
   dateHint:'اكشطوا الختم لتعرفوا ليلتنا',cdL:'باقٍ على ليلة الحنّة',
   thanks:'ننتظركم بالزغاريد',progTitle:'برنامج الليلة',dressL:'اللباس'},
  fr:{msgL:'Mot de la mariée',msgS:'Une nuit qu’on garde',
   msgBody:'La nuit du henné n’est pas un détail avant le mariage — c’est notre nuit. Nous aimerions vous y voir, et entendre vos youyous avant tout le reste.',
   dateHint:'Grattez le sceau pour découvrir notre nuit',cdL:'Avant la nuit du henné',
   thanks:'Nous vous attendons',progTitle:'Programme de la nuit',dressL:'Tenue'},
  en:{msgL:'A word from the bride',msgS:'A night we keep',
   msgBody:'The henna night is not a small thing before the wedding — it is our own night. We would like you in it, and to hear you before anything else.',
   dateHint:'Scratch the seal to find our night',cdL:'Until the henna night',
   thanks:'We are waiting for you',progTitle:'The night’s programme',dressL:'What to wear'}},

 bday:{
  ar:{msgL:'كلمة من القلب',msgS:'سنةٌ أخرى… ومازلنا نحتفل',
   msgBody:'ما نحبّ أن نحتفل وحدنا. عام آخر مرّ، وأجمل ما فيه أنّكم كنتم فيه — تعالوا نطفئ الشمعة معًا.',
   dateL:'اكشفوا الموعد',dateHint:'اكشطوا الختم لتعرفوا يوم الحفل',
   cdL:'باقٍ على الحفل',thanks:'وجودكم هو الهديّة',dressL:'اللباس'},
  fr:{msgL:'Un mot du cœur',msgS:'Une année de plus… et on fête encore',
   msgBody:'Nous n’aimons pas fêter seuls. Une année est passée, et le plus beau, c’est que vous y étiez — venez souffler la bougie avec nous.',
   dateL:'Découvrez la date',dateHint:'Grattez le sceau pour découvrir le jour',
   cdL:'Avant la fête',thanks:'Votre présence est le cadeau',dressL:'Tenue'},
  en:{msgL:'A word from the heart',msgS:'One more year, and still celebrating',
   msgBody:'We do not like celebrating alone. Another year has gone, and the best of it is that you were in it — come and blow out the candle with us.',
   dateL:'Reveal the date',dateHint:'Scratch the seal to find the day',
   cdL:'Until the party',thanks:'Your being there is the gift',dressL:'What to wear'}},

 baby:{
  ar:{msgL:'كلمة العائلة',msgS:'صرنا ثلاثة',
   msgBody:'انتظرناه طويلًا، ووصل. نحبّ أن نراكم حوله في أوّل أيامه، وأن يعرف وجوهكم قبل أن يعرف الكلام.',
   dateL:'اكشفوا الموعد',dateHint:'اكشطوا الختم لتعرفوا يوم الاستقبال',
   cdL:'باقٍ على الاستقبال',venueL:'المكان',thanks:'ننتظركم لتباركوا لنا',
   progTitle:'برنامج اليوم',dressL:'اللباس'},
  fr:{msgL:'Mot de la famille',msgS:'Nous voilà trois',
   msgBody:'Nous l’avons longtemps attendu, et il est arrivé. Nous aimerions vous voir autour de lui dès ses premiers jours, qu’il connaisse vos visages avant les mots.',
   dateL:'Découvrez la date',dateHint:'Grattez le sceau pour découvrir le jour',
   cdL:'Avant la réception',venueL:'Le lieu',thanks:'Venez nous féliciter',
   progTitle:'Programme du jour',dressL:'Tenue'},
  en:{msgL:'A word from the family',msgS:'There are three of us now',
   msgBody:'We waited a long time, and he arrived. We would like you around him in his first days, so he knows your faces before he knows any words.',
   dateL:'Reveal the date',dateHint:'Scratch the seal to find the day',
   cdL:'Until the welcome',venueL:'The place',thanks:'Come and wish us well',
   progTitle:'The day’s programme',dressL:'What to wear'}},

 grad:{
  ar:{msgL:'كلمة هذا اليوم',msgS:'سنواتٌ من التعب… ويومٌ واحد',
   msgBody:'هذا اليوم ليس نهاية سنوات فقط — هو أيضًا شكرٌ لكلّ من وقف معنا فيها. تعالوا نُنهيها كما بدأناها: معًا.',
   dateL:'اكشفوا الموعد',dateHint:'اكشطوا الختم لتعرفوا يوم التخرّج',
   cdL:'باقٍ على التخرّج',thanks:'فرحتنا لا تكتمل من دونكم',
   progTitle:'برنامج اليوم',dressL:'اللباس'},
  fr:{msgL:'Le mot de ce jour',msgS:'Des années d’efforts… et un seul jour',
   msgBody:'Ce jour n’est pas seulement la fin de longues années — c’est aussi un merci à ceux qui les ont traversées avec nous. Finissons-les comme nous les avons commencées : ensemble.',
   dateL:'Découvrez la date',dateHint:'Grattez le sceau pour découvrir le jour',
   cdL:'Avant la remise',thanks:'Notre joie n’est rien sans vous',
   progTitle:'Programme du jour',dressL:'Tenue'},
  en:{msgL:'A word for the day',msgS:'Years of work, and one day',
   msgBody:'This day is not only the end of long years — it is also a thank you to everyone who went through them with us. Let us finish them the way we started: together.',
   dateL:'Reveal the date',dateHint:'Scratch the seal to find the day',
   cdL:'Until the ceremony',thanks:'Our joy is nothing without you',
   progTitle:'The day’s programme',dressL:'What to wear'}},

 open:{
  ar:{msgL:'كلمة الإدارة',msgS:'بابٌ جديد… ونحبّ أن تفتحوه معنا',
   msgBody:'اشتغلنا على هذا المكان طويلًا، واليوم صار جاهزًا. حضوركم في أوّل يوم يعني لنا أكثر ممّا يعني أيّ يوم بعده.',
   dateL:'اكشفوا الموعد',dateHint:'اكشطوا الختم لتعرفوا يوم الافتتاح',
   venueL:'العنوان',cdL:'باقٍ على الافتتاح',thanks:'يشرّفنا حضوركم',
   progTitle:'برنامج الافتتاح',dressL:'اللباس',
   rsvpL:'تأكيد الحضور',attend:'هل تشرّفوننا؟',yes:'سأكون هناك',no:'أعتذر'},
  fr:{msgL:'Mot de la direction',msgS:'Une porte de plus — ouvrez-la avec nous',
   msgBody:'Nous avons travaillé longtemps sur ce lieu, et il est prêt. Votre présence le premier jour compte plus que tous les jours qui suivront.',
   dateL:'Découvrez la date',dateHint:'Grattez le sceau pour découvrir l’ouverture',
   venueL:'L’adresse',cdL:'Avant l’ouverture',thanks:'Votre présence nous honore',
   progTitle:'Programme de l’inauguration',dressL:'Tenue',
   rsvpL:'Confirmation',attend:'Nous ferez-vous l’honneur ?',yes:'J’y serai',no:'Je m’excuse'},
  en:{msgL:'A word from the management',msgS:'A new door — open it with us',
   msgBody:'We worked on this place for a long time, and it is ready. Your being here on the first day matters more to us than any day after it.',
   dateL:'Reveal the date',dateHint:'Scratch the seal to find the opening',
   venueL:'The address',cdL:'Until the opening',thanks:'We would be honoured',
   progTitle:'Opening programme',dressL:'What to wear',
   rsvpL:'Confirm attendance',attend:'Will you join us?',yes:'I will be there',no:'I am sorry'}},

 save:{
  ar:{cdL:'باقٍ على اليوم',thanks:'التفاصيل تصلكم قريبًا',
   msgS:'الموعد أوّلًا… والتفاصيل بعده',
   msgBody:'لم نُنهِ كلّ التفاصيل بعد، لكنّ اليوم صار معروفًا. احفظوه الآن، والباقي يصلكم في وقته.'},
  fr:{cdL:'Avant le jour',thanks:'Les détails suivront',
   msgS:'La date d’abord, les détails ensuite',
   msgBody:'Tout n’est pas encore arrêté, mais le jour, lui, est fixé. Notez-le dès maintenant, le reste vous parviendra en temps voulu.'},
  en:{cdL:'Until the day',thanks:'The details will follow',
   msgS:'The date first, the details after',
   msgBody:'Not everything is settled yet, but the day is. Keep it now, and the rest will reach you in time.'}}
};

/* One film can want different words from the rest of its occasion. Both travel
   agencies are openings, but an opening that sells journeys does not talk
   about a room. */
const EDI_WORDS_FILM = {
 takeoff:{
  ar:{msgS:'من هنا تبدأ الرحلات',
   msgBody:'فتحنا هذا المكان لسببٍ واحد: أن تكون كلّ رحلة تبدأ منه أسهل ممّا كانت. تعالوا في أوّل يوم — ومنه نبدأ.',
   thanks:'نراكم عند الإقلاع',progTitle:'برنامج الافتتاح'},
  fr:{msgS:'C’est d’ici que partent les voyages',
   msgBody:'Nous avons ouvert ce lieu pour une seule raison : que chaque voyage qui en part soit plus simple qu’avant. Venez le premier jour — et partons de là.',
   thanks:'Rendez-vous au décollage',progTitle:'Programme de l’inauguration'},
  en:{msgS:'The journeys start here',
   msgBody:'We opened this place for one reason: so that every journey leaving it is easier than it used to be. Come on the first day — and we start from there.',
   thanks:'See you at takeoff',progTitle:'Opening programme'}},
 boarding:{
  ar:{msgS:'بوّابةٌ تُفتح… ووجهةٌ تنتظر',
   msgBody:'كلّ سفرة تبدأ ببوّابة. هذه بوّابتنا، ونحبّ أن يكون أوّل من يعبرها أنتم.',
   thanks:'نراكم عند البوّابة',progTitle:'برنامج الافتتاح'},
  fr:{msgS:'Une porte s’ouvre, une destination attend',
   msgBody:'Chaque voyage commence à une porte. Voici la nôtre, et nous aimerions que vous soyez les premiers à la franchir.',
   thanks:'Rendez-vous à la porte',progTitle:'Programme de l’inauguration'},
  en:{msgS:'A gate opens, a destination waits',
   msgBody:'Every journey begins at a gate. This is ours, and we would like you to be the first through it.',
   thanks:'See you at the gate',progTitle:'Opening programme'}}
};

/* The words this invitation is written in: the shared set, then its occasion,
   then its film. A wedding matches nothing here and keeps every default, which
   is the point — they already read correctly. */
function ediWords(){
 const base=Object.assign({},t().edi,{
  progTitle:t().progTitle,rsvpL:t().uRsvp,attend:t().uAttend,
  yes:t().uYes,no:t().uNo});
 const L=S.lang;
 const cat=S.c&&S.c.ediCat;
 const byCat=cat&&EDI_WORDS[cat]&&(EDI_WORDS[cat][L]||EDI_WORDS[cat].ar);
 const byFilm=S.c&&S.c.film&&EDI_WORDS_FILM[S.c.film]
   &&(EDI_WORDS_FILM[S.c.film][L]||EDI_WORDS_FILM[S.c.film].ar);
 return Object.assign(base,byCat||{},byFilm||{});
}

/* ---- ornament ---- */
const EDI_CART='<svg viewBox="0 0 120 150" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">'
 +'<ellipse cx="60" cy="75" rx="52" ry="68"/><ellipse cx="60" cy="75" rx="46" ry="62" opacity=".5"/>'
 +'<path d="M60 9c-9 8-13 17-13 26M60 9c9 8 13 17 13 26" opacity=".7"/>'
 +'<path d="M60 141c-9-8-13-17-13-26M60 141c9-8 13-17 13-26" opacity=".7"/>'
 +'<circle cx="60" cy="7" r="2" fill="currentColor" stroke="none"/>'
 +'<circle cx="60" cy="143" r="2" fill="currentColor" stroke="none"/></svg>';
const EDI_RULE='<svg viewBox="0 0 200 12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">'
 +'<path d="M2 6h72M126 6h72"/>'
 +'<path d="M84 6c4-4 8-4 10 0-2 4-6 4-10 0Z" fill="currentColor" fill-opacity=".3"/>'
 +'<path d="M116 6c-4-4-8-4-10 0 2 4 6 4 10 0Z" fill="currentColor" fill-opacity=".3"/>'
 +'<path d="M100 1.6l3 4.4-3 4.4-3-4.4z" fill="currentColor" stroke="none"/></svg>';
/* programme medallions, drawn rather than emoji */
const EDI_ICONS=[
 '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 27V13a8 8 0 0116 0v14"/><path d="M4 27h24"/><path d="M16 27v-7"/></svg>',
 '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12.5" cy="19" r="7"/><circle cx="19.5" cy="19" r="7"/><path d="M16 8l2.4 3.4h-4.8z"/></svg>',
 '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 6h16l-8 10z"/><path d="M16 16v9"/><path d="M11 25h10"/></svg>',
 '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="4.4" opacity=".55"/></svg>',
 '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="11" cy="23" r="4"/><path d="M15 23V7l10-2v14"/><circle cx="21" cy="19" r="4"/></svg>'];

/* ═══ ميداليات البرنامج ═══
   The five medallions beside the programme rows were one fixed set, and the
   second of them is two interlocking rings. Every occasion was therefore
   wearing a wedding symbol on every second line — an agency opening included.

   Weddings keep EDI_ICONS exactly as they are. Everything else draws from the
   marks library, which already has a candle, a crib, a cap, a henna hand, a
   compass and a gate in it. Nothing new is invented; the right ones are
   pointed at. */
const EDI_MEDS = {
 henna:['henna','bloom','hands','record','star'],
 bday:['candle','bloom','star','record','hands'],
 baby:['crib','bloom','hands','star','candle'],
 grad:['cap','star','bloom','record','hands'],
 open:['bow','gate','star','hands','record']
};
/* a travel agency navigates rather than cuts ribbons */
const EDI_MEDS_FILM = {
 takeoff:['compass','gate','star','bow','hands'],
 boarding:['gate','compass','star','bow','hands']
};
/* Marks are drawn on a 100 viewBox at stroke 1.5; the medallions were drawn on
   a 32 viewBox at 1.3, which is 4% of the box rather than 1.5%. Without the
   heavier weight they arrive as hairlines beside the wedding ones. */
function ediMeds(){
 const keys = (S.c&&S.c.film&&EDI_MEDS_FILM[S.c.film])
   || (S.c&&S.c.ediCat&&EDI_MEDS[S.c.ediCat]);
 if(!keys || typeof ediMarkSVG!=='function') return EDI_ICONS;
 return keys.map(function(k){ return ediMarkSVG(k,3.8); });
}

/* ═══ برنامج كل مناسبة ═══
   ediDemoProgram fell through to the wedding programme for anything it had no
   entry for, so an agency opening ran عقد القران in قاعة الياسمين at five.
   These are the two that were missing. */
const EDI_PROG_EXTRA = {
 open:{
  ar:[['16:30','استقبال المدعوين','مدخل الوكالة'],['17:00','كلمة الافتتاح','القاعة'],
      ['17:30','قصّ الشريط','الباب الرئيسي'],['18:00','جولة في المكان','الطوابق'],
      ['19:00','لقاء وتعارف','الشرفة']],
  fr:[['16:30','Accueil des invités','Entrée de l’agence'],['17:00','Discours d’ouverture','La salle'],
      ['17:30','Coupure du ruban','La porte principale'],['18:00','Visite des lieux','Les étages'],
      ['19:00','Rencontre','La terrasse']],
  en:[['16:30','Welcoming the guests','The agency entrance'],['17:00','Opening address','The hall'],
      ['17:30','Cutting the ribbon','The main door'],['18:00','A walk through','The floors'],
      ['19:00','Meeting the team','The terrace']]}
};
/* and the two travel agencies, which do not open a room so much as a route */
const EDI_PROG_FILM = {
 takeoff:{
  ar:[['16:30','استقبال الضيوف والشركاء','مدخل الوكالة'],['17:00','كلمة الافتتاح','القاعة'],
      ['17:30','قصّ الشريط','الباب الرئيسي'],['18:00','وجهات أوّل موسم','ركن العرض'],
      ['19:00','أوّل حجز من هذا الباب','مكتب الحجوزات']],
  fr:[['16:30','Accueil des invités et partenaires','Entrée de l’agence'],['17:00','Discours d’ouverture','La salle'],
      ['17:30','Coupure du ruban','La porte principale'],['18:00','Les premières destinations','L’espace expo'],
      ['19:00','La première réservation','Le comptoir']],
  en:[['16:30','Welcoming guests and partners','The agency entrance'],['17:00','Opening address','The hall'],
      ['17:30','Cutting the ribbon','The main door'],['18:00','The first destinations','The display corner'],
      ['19:00','The first booking through this door','The counter']]},
 boarding:{
  ar:[['17:00','فتح البوّابة','المدخل'],['17:30','كلمة الافتتاح','القاعة'],
      ['18:00','قصّ الشريط','الباب الرئيسي'],['18:30','وجهات هذا الموسم','ركن العرض'],
      ['19:30','لقاء وتعارف','الشرفة']],
  fr:[['17:00','Ouverture de la porte','L’entrée'],['17:30','Discours d’ouverture','La salle'],
      ['18:00','Coupure du ruban','La porte principale'],['18:30','Les destinations de la saison','L’espace expo'],
      ['19:30','Rencontre','La terrasse']],
  en:[['17:00','Opening the gate','The entrance'],['17:30','Opening address','The hall'],
      ['18:00','Cutting the ribbon','The main door'],['18:30','This season’s destinations','The display corner'],
      ['19:30','Meeting the team','The terrace']]}
};

/* ---- gold frame + floral corners, drawn ----
   The reference plates put a cream panel inside an ornate gold frame with
   blooms crowding two opposite corners. Both are SVG so they scale with the
   section and stay crisp behind a real photograph later. */
const EDI_FCORNER='<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">'
 +'<path d="M2 58V20C2 10 10 2 20 2h38"/>'
 +'<path d="M8 50V23C8 15 15 8 23 8h27"/>'
 +'<path d="M8 30C8 17.8 17.8 8 30 8"/>'
 +'<path d="M14 14C19 5 28 2 38 2 34 12 25 14 14 14Z" fill="currentColor" fill-opacity=".2"/>'
 +'<path d="M30 8c0 6-5 11-11 11" opacity=".7"/>'
 +'<circle cx="5.6" cy="5.6" r="2.2" fill="currentColor" stroke="none"/>'
 +'<circle cx="30" cy="30" r="1.3" fill="currentColor" stroke="none"/></svg>';
/* small crest that sits at the top centre of the frame */
const EDI_CREST='<svg viewBox="0 0 80 34" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">'
 +'<path d="M4 30h20M56 30h20"/>'
 +'<path d="M40 4c-7 6-11 12-11 18a11 11 0 0022 0c0-6-4-12-11-18Z"/>'
 +'<path d="M40 12c-3.4 3.4-5 6.6-5 9.6a5 5 0 0010 0c0-3-1.6-6.2-5-9.6Z" fill="currentColor" fill-opacity=".22"/>'
 +'<path d="M29 22c-4 0-7-2-8-5M51 22c4 0 7-2 8-5" opacity=".7"/>'
 +'<circle cx="40" cy="32" r="1.6" fill="currentColor" stroke="none"/></svg>';

function ediFrame(){
 return `<div class="edi-frame" aria-hidden="true">
   <span class="fc tl">${EDI_FCORNER}</span><span class="fc tr">${EDI_FCORNER}</span>
   <span class="fc bl">${EDI_FCORNER}</span><span class="fc br">${EDI_FCORNER}</span>
   <span class="fcrest">${EDI_CREST}</span></div>`;}

/* A bloom: layered petals over a shaded heart, so it reads as a rose and not a dot. */
function ediRose(r,fill,dark){
 let s='';
 for(let k=0;k<7;k++)s+=`<ellipse cx="0" cy="${(-r*.58).toFixed(1)}" rx="${(r*.46).toFixed(1)}" ry="${(r*.56).toFixed(1)}" fill="${fill}" transform="rotate(${(k*360/7).toFixed(0)})"/>`;
 for(let k=0;k<5;k++)s+=`<ellipse cx="0" cy="${(-r*.3).toFixed(1)}" rx="${(r*.3).toFixed(1)}" ry="${(r*.36).toFixed(1)}" fill="${dark}" opacity=".26" transform="rotate(${(k*72+28).toFixed(0)})"/>`;
 return s+`<circle r="${(r*.2).toFixed(1)}" fill="${dark}" opacity=".5"/>`;}

/* A corner bouquet: blooms crowd the corner along a quarter arc and shrink
   away from it, with foliage sprays reaching out past them. Deterministic
   from `seed` so a section renders identically every time. */
function ediFlora(seed,cls){
 if(S.c.films)return '';   /* the footage carries the decoration */
 const rnd=i=>{const x=Math.sin(seed*97.13+i*13.71)*10000;return x-Math.floor(x);};
 const pals=[['#E7B6AE','#B4635E','#F6E0DA'],['#DFC3D6','#8A5172','#F2E4EC'],
  ['#EFD6B6','#C08F3E','#FBF1E0'],['#E6C6B8','#A97158','#F7E8E0'],['#D8C3A4','#9C7C4E','#F1E6D4']];
 let defs='',s='';
 const N=8;
 for(let i=0;i<N;i++){
  const f=i/(N-1),a=(.05+.9*f)*Math.PI/2,R=24+rnd(i)*36;
  const cx=6+Math.cos(a)*R,cy=6+Math.sin(a)*R;
  const r=18-9.5*f+rnd(i+9)*4.5,p=pals[i%pals.length];
  defs+=`<radialGradient id="fg${seed}_${i}" cx="36%" cy="30%" r="72%">`
   +`<stop offset="0" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[0]}"/></radialGradient>`;
  s+=`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(rnd(i+30)*360).toFixed(0)})">`
   +ediRose(r,`url(#fg${seed}_${i})`,p[1])+`</g>`;}
 /* foliage sprays, drawn under nothing in particular — they read as filler */
 let fol='';
 for(let i=0;i<6;i++){
  const a=(.08+.84*(i/5))*Math.PI/2,L=54+rnd(i+60)*38;
  const x2=6+Math.cos(a)*L,y2=6+Math.sin(a)*L;
  const qx=6+Math.cos(a)*L*.5-9+rnd(i+70)*18,qy=6+Math.sin(a)*L*.5-9+rnd(i+80)*18;
  fol+=`<path d="M6 6 Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="#8B9C73" stroke-width="1.05" opacity=".62"/>`;
  for(let k=1;k<=3;k++){const u=k/4,v=1-u;
   const px=v*v*6+2*v*u*qx+u*u*x2,py=v*v*6+2*v*u*qy+u*u*y2;
   fol+=`<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="2.7" ry="6.4" fill="#8B9C73" opacity=".55" transform="rotate(${(rnd(i*7+k)*360).toFixed(0)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;}}
 /* a few gold buds for sparkle */
 let bud='';
 for(let i=0;i<6;i++){
  const a=(.1+.8*rnd(i+500))*Math.PI/2,R=30+rnd(i+520)*44;
  bud+=`<circle cx="${(6+Math.cos(a)*R).toFixed(1)}" cy="${(6+Math.sin(a)*R).toFixed(1)}" r="${(1.6+rnd(i+540)*2).toFixed(1)}" fill="#C9A24B" opacity=".78"/>`;}
 return `<svg class="edi-flora ${cls||''}" viewBox="0 0 100 100" aria-hidden="true">`
  +`<defs>${defs}</defs>${fol}${bud}${s}</svg>`;}

/* an engraved dial, and a gown-and-tails mark for the dress code */
const EDI_DIAL='<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">'
 +'<circle cx="20" cy="20" r="15"/><circle cx="20" cy="20" r="12" stroke-dasharray="1 3" opacity=".6"/>'
 +'<path d="M20 11.5V20l5.4 3.4"/>'
 +'<path d="M20 3.6v2.6M20 33.8v2.6M3.6 20h2.6M33.8 20h2.6"/>'
 +'<circle cx="20" cy="20" r="1.3" fill="currentColor" stroke="none"/></svg>';
const EDI_PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
 +'<path d="M12 21s6.4-6.2 6.4-11A6.4 6.4 0 0 0 5.6 10c0 4.8 6.4 11 6.4 11Z"/>'
 +'<circle cx="12" cy="10" r="2.3"/></svg>';
const EDI_COMPASS='<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">'
 +'<circle cx="20" cy="20" r="15"/>'
 +'<path d="M25.6 14.4 17 17l-2.6 8.6L23 23z"/>'
 +'<circle cx="20" cy="20" r="1.1" fill="currentColor" stroke="none"/></svg>';
const EDI_KEY='<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">'
 +'<circle cx="14.6" cy="14.6" r="7"/><circle cx="14.6" cy="14.6" r="2.6"/>'
 +'<path d="M19.6 19.6 32 32"/><path d="M27.4 27.4 31 23.8M31 31l3.4-3.4"/></svg>';
const EDI_DRESS='<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">'
 +'<path d="M14.6 5.4 20 10l5.4-4.6"/>'
 +'<path d="M14.6 5.4 12.4 12 20 15.6 27.6 12l-2.2-6.6"/>'
 +'<path d="M20 15.6 12.6 35h14.8z"/>'
 +'<path d="M16.6 24.4h6.8" opacity=".55"/></svg>';

/* ---- date split for the seal reveal ---- */
function ediDateParts(){
 const c=S.c;
 if(c.when){
  const d=new Date(c.when);
  if(!isNaN(d)){
   const loc=S.lang==='ar'?'ar-TN':S.lang==='fr'?'fr-FR':'en-GB';
   let wd='',mo='';
   try{wd=d.toLocaleDateString(loc,{weekday:'long'});mo=d.toLocaleDateString(loc,{month:'long'});}catch(e){}
   const day=S.lang==='ar'?toAr(d.getDate()):String(d.getDate());
   const yr=S.lang==='ar'?toAr(d.getFullYear()):String(d.getFullYear());
   return {wd:wd,day:day,rest:(mo+' '+yr).trim()};}}
 /* no timestamp — fall back to the display date, biggest token as the numeral */
 const raw=String(c.d||'').trim();
 const num=raw.match(/\d+/);
 return {wd:'',day:num?(S.lang==='ar'?toAr(num[0]):num[0]):raw,rest:num?raw.replace(num[0],'').trim():''};}

/* ---- the wax seal you scratch ---- */
/* The seal's base colour: whatever the dashboard set for this film, else the
   film palette's own --wax, else the old gold. */
function ediWaxBase(el){
 const chosen=(S.c&&S.c.waxCol&&typeof waxHex==='function')?waxHex(S.c.waxCol):'';
 if(chosen)return chosen;
 try{const v=getComputedStyle(el).getPropertyValue('--wax').trim();if(v)return v;}catch(e){}
 return '#A87A28';}
/* lighten or darken a hex by an amount, so one colour makes a whole ramp */
function ediWaxShade(hex,amt){
 const m=String(hex).replace('#','');
 const n=m.length===3?m.split('').map(c=>c+c).join(''):m;
 const v=parseInt(n,16);
 let r=(v>>16)&255,g=(v>>8)&255,b=v&255;
 const f=a=>Math.max(0,Math.min(255,Math.round(amt>=0?a+(255-a)*amt:a*(1+amt))));
 return 'rgb('+f(r)+','+f(g)+','+f(b)+')';}

let ediWaxImg=null,ediWaxStamp=null;
function ediWax(cv,initials){
 const ctx=cv.getContext('2d');if(!ctx)return;
 const seal=cv.parentElement;
 let strokes=0,done=false;
 /* Either a photographed seal, which is the whole thing, or a mark pressed
    into the painted one. A stamp wins: it already carries its own shape and
    colour, so there is nothing left for those settings to say. */
 ediWaxImg=null; ediWaxStamp=null;
 const stampKey=(S.c&&S.c.waxImg)||'';
 if(stampKey && typeof waxStampURL==='function' && waxStampURL(stampKey)){
  const st=new Image();
  st.onload=function(){ediWaxStamp=st;try{paint();}catch(e){}};
  st.src=waxStampURL(stampKey);
 }else{
  const emKey=(S.c&&S.c.waxEm)||'ini';
  if(emKey!=='ini' && typeof waxEmblemURI==='function'){
   const im=new Image();
   im.onload=function(){ediWaxImg=im;try{paint();}catch(e){}};
   im.src=waxEmblemURI(emKey,'#1B1006',5.5);
  }
 }

 function paint(){
  const r=cv.getBoundingClientRect();
  cv.width=Math.max(120,Math.round(r.width*2));
  cv.height=Math.max(120,Math.round(r.height*2));
  const w=cv.width,h=cv.height,cx=w/2,cy=h/2,rr=Math.min(w,h)*.47;
  ctx.clearRect(0,0,w,h);
  if(ediWaxStamp && ediWaxStamp.complete && ediWaxStamp.naturalWidth){
   const d=rr*2.08;
   ctx.drawImage(ediWaxStamp,cx-d/2,cy-d/2,d,d);
   return;}
  /* The ramp was four fixed golds. It is built from one base colour now — the
     film's --wax, or whatever the dashboard chose for it — so a seal can be
     navy or sage without a second copy of this function. */
  const base=ediWaxBase(cv);
  const g=ctx.createRadialGradient(w*.36,h*.3,w*.04,cx,cy,rr*1.15);
  g.addColorStop(0,ediWaxShade(base,.32));g.addColorStop(.34,base);
  g.addColorStop(.7,ediWaxShade(base,-.3));g.addColorStop(1,ediWaxShade(base,-.55));
  ctx.beginPath();
  const n=30;
  for(let i=0;i<=n;i++){const a=i/n*Math.PI*2;
   const rad=rr*(.93+.06*Math.sin(a*5)+.03*Math.cos(a*3+1.1));
   const x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad;
   i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.closePath();ctx.fillStyle=g;ctx.fill();
  /* pressed relief: a bright rim above, a dark trench below */
  ctx.strokeStyle='rgba(255,238,196,.3)';ctx.lineWidth=w*.012;
  ctx.beginPath();ctx.arc(cx,cy,rr*.78,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(40,22,4,.55)';ctx.lineWidth=w*.016;
  ctx.beginPath();ctx.arc(cx,cy,rr*.72,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(255,238,196,.16)';ctx.lineWidth=w*.006;
  ctx.beginPath();ctx.arc(cx,cy,rr*.62,0,Math.PI*2);ctx.stroke();
  const em=(S.c&&S.c.waxEm)||'ini';
  if(em!=='ini' && ediWaxImg && ediWaxImg.complete && ediWaxImg.naturalWidth){
   /* debossed: a pale copy a hair above, the dark one in place */
   const d=rr*1.06, x=cx-d/2, y=cy-d/2;
   ctx.globalAlpha=.30; ctx.drawImage(ediWaxImg,x,y-w*.008,d,d);
   ctx.globalAlpha=.62; ctx.drawImage(ediWaxImg,x,y,d,d);
   ctx.globalAlpha=1;
  }else{
   ctx.fillStyle='rgba(20,12,4,.62)';
   ctx.font='700 '+Math.round(w*.24)+'px '+(S.lang==='ar'?'"Aref Ruqaa",serif':'"Cormorant Garamond",serif');
   ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillText(initials||'✦',cx,cy+w*.015);}}

 const at=e=>{const r=cv.getBoundingClientRect();
  const p=(e.touches&&e.touches[0])||e;
  return [(p.clientX-r.left)/r.width*cv.width,(p.clientY-r.top)/r.height*cv.height];};
 const rub=e=>{
  if(done)return;
  if(e.cancelable)e.preventDefault();
  const c=at(e);
  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath();ctx.arc(c[0],c[1],cv.width*.15,0,Math.PI*2);ctx.fill();
  ctx.globalCompositeOperation='source-over';
  if(++strokes>=13)ediReveal();};

 let rubbing=false;
 const start=e=>{rubbing=true;rub(e);};
 const move=e=>{if(rubbing)rub(e);};
 const end=()=>{rubbing=false;};
 cv.addEventListener('pointerdown',start);
 cv.addEventListener('pointermove',move);
 window.addEventListener('pointerup',end);
 cv.addEventListener('touchstart',start,{passive:false});
 cv.addEventListener('touchmove',move,{passive:false});
 cv.addEventListener('touchend',end);

 /* No confetti here on purpose — the wax simply dissolves. */
 window.ediReveal=function(){
  if(done)return;done=true;
  seal.classList.add('open');
  cv.style.transition='opacity .9s ease,transform .9s ease';
  cv.style.opacity='0';cv.style.transform='scale(1.14)';};
 paint();
 window.addEventListener('resize',paint);}


/* ---- countdown ----
   Four engraved cells separated by hairlines, with a drawn dial in the label.
   Classic stationery treatment rather than a digital timer. */
function ediCountHTML(){
 const c=S.c,E=ediWords();
 if(!c.when||!ediSecOn('cd'))return '';
 return `<section class="edi-s edi-count">
   ${S.c.films?ediPlate('venue','soft'):''}${S.c.films?'<div class="edi-wash deep"></div>':''}
   ${ediTint(1)}${ediFlora(63,'tr')}${ediFrame()}
   <div class="edi-in rv">
    <p class="edi-lbl"><span class="edi-ico">${EDI_DIAL}</span>${esc(E.cdL)}</p>
    <div class="edi-rule sm">${EDI_RULE}</div>
    <div class="edi-clock" id="ediClock">${ediClockCells([0,0,0,0])}</div>
    <p class="edi-cdnote">${esc(S.lang==='ar'?toAr(c.d):c.d)}</p>
   </div>
  </section>`;}
function ediClockCells(v){
 const L=t().cdL, ar=S.lang==='ar';
 return v.map((n,i)=>`<div><b>${ar?toAr(String(n).padStart(2,'0')):String(n).padStart(2,'0')}</b><span>${L[i]}</span></div>`).join('');}
let ediCdT=null;
function ediStartClock(){
 clearInterval(ediCdT);
 const box=document.getElementById('ediClock');
 if(!box||!S.c.when)return;
 const tick=()=>{
  const el=document.getElementById('ediClock');
  if(!el){clearInterval(ediCdT);return;}
  const diff=new Date(S.c.when)-Date.now();
  if(diff<=0){el.innerHTML=`<div class="started">${t().started}</div>`;clearInterval(ediCdT);return;}
  el.innerHTML=ediClockCells([Math.floor(diff/864e5),Math.floor(diff/36e5)%24,
   Math.floor(diff/6e4)%60,Math.floor(diff/1e3)%60]);};
 tick();ediCdT=setInterval(tick,1000);}

/* ---- dress code ---- */
function ediDressHTML(){
 const d=S.c.dress,E=ediWords();
 if(!d||!(d.t||d.d)||!ediSecOn('dress'))return '';
 const sw=(d.sw&&d.sw.length?d.sw:['var(--ink)','var(--blush)','var(--cream-hi)'])
  .map(c=>`<span class="sw" style="background:${c}"></span>`).join('');
 return `<section class="edi-s edi-dress light">
   ${ediTint(1)}${ediFlora(70,'bl')}${ediFrame()}
   <div class="edi-in rv">
    <p class="edi-lbl dk"><span class="edi-ico">${EDI_DRESS}</span>${esc(E.dressL)}</p>
    <div class="edi-rule sm dk">${EDI_RULE}</div>
    <h3 class="edi-dress-t">${esc(d.t||'')}</h3>
    ${d.d?`<p class="edi-dress-d">${esc(d.d)}</p>`:''}
    <div class="edi-sw">${sw}</div>
   </div>
  </section>`;}


/* The light sections had no film behind them and read as flat cream. This bleeds
   the film's own poster through at low opacity so the colour keeps flowing. */
function ediTint(seed){
 if(!(S.c.films&&(S.c.films.venue||S.c.films.hero)))return '';
 return `<div class="edi-tint t${(seed||0)%3}"></div>`;}

/* ---- optional notes: directions, accommodation ----
   Same shape for both, so adding another later costs one entry. */
function ediNoteHTML(key,icon,label,cls){
 const d=S.c[key];
 if(!d||!(d.t||d.d))return '';
 if(!ediSecOn(key))return '';
 return `<section class="edi-s edi-note ${cls||''}">
   ${ediTint(2)}${ediFrame()}
   <div class="edi-in rv">
    <p class="edi-lbl dk"><span class="edi-ico">${icon}</span>${esc(label)}</p>
    <div class="edi-rule sm dk">${EDI_RULE}</div>
    ${d.t?`<h3 class="edi-note-t">${esc(d.t)}</h3>`:''}
    ${d.d?`<p class="edi-note-d">${esc(d.d)}</p>`:''}
   </div>
  </section>`;}

/* Dashboard switches. Absent config means on, so nothing disappears by default. */
function ediSecOn(k){
 const o=(typeof CFG!=='undefined'&&CFG&&CFG.edi)||null;
 return !o||o[k]===undefined||!!o[k];}

/* ---- sections ---- */
function ediHTML(){
 const c=S.c,E=ediWords(),ini=inInitials(c.n),dp=ediDateParts();
 const mono=ini.length>=2
  ? `<b>${esc(ini[0])}</b><i>${S.lang==='ar'?'و':'&'}</i><b>${esc(ini[1])}</b>`
  : `<b class="solo">${esc(ini[0]||'✦')}</b>`;
 /* The mark in the middle. Weddings keep the cartouche they have always had;
    anything else uses the one chosen for it, in the film or in the dashboard. */
 const mark=(typeof ediMarkSVG==='function' && S.c.ediIcon)
   ? ediMarkSVG(S.c.ediIcon) : EDI_CART;
 const cart=n=>`<div class="edi-mono ${n||''}">${mark}<span class="mg">${mono}</span></div>`;
 const prog=ediSecOn('prog')?(c.program&&c.program.length?c.program:[]).slice(0,6):[];
 const MEDS=ediMeds();

 /* ═══ one film behind everything ═══
    In this layout the invitation has no separate plates: a single film is
    pinned behind the whole thing and the text scrolls over it. It is
    continuous by construction — nothing is seeked, nothing is handed over,
    so there is no seam to get wrong and no cost in stutter. It is a direct
    child of .edi rather than of a section, so no section's overflow can clip
    it, and it carries .edi-ph.film so the existing playback watcher picks it
    up without being told about it. */
 const stick = ediStickyOn()
   ? `<div class="edi-ph film edi-sticky"
        style="background-image:url('${c.films.hero.replace(/\.mp4$/,'.jpg')}')"><video src="${c.films.hero}"
        poster="${c.films.hero.replace(/\.mp4$/,'.jpg')}"
        muted loop playsinline preload="auto"></video></div>
      <div class="edi-sticky-wash"></div>` : '';

 return `<div class="edi" id="edi" data-vid="${ediVidStyle()}">
  ${stick}
  <div class="edi-bar"><i id="ediBar"></i></div>
  <button class="edi-x" onclick="closeVeil()">${t().closePrev}</button>

  <section class="edi-s edi-hero">
   ${ediPlate('hero')}<div class="edi-wash"></div>
   ${ediFlora(3,'tr')}${ediFlora(8,'bl')}${ediFrame()}
   <div class="edi-in">
    ${cart()}
    <h1 class="edi-names">${esc(c.n)}</h1>
    <div class="edi-rule">${EDI_RULE}</div>
    <p class="edi-kick">${esc(c.t)}</p>
   </div>
   <div class="edi-cue"><span>${esc(E.scroll)}</span><i></i></div>
  </section>

  <section class="edi-s edi-invite">
   ${ediPlate('hall')}<div class="edi-wash deep"></div>
   ${ediFlora(14,'tl')}${ediFlora(21,'br')}${ediFrame()}
   <div class="edi-in rv">
    ${cart('lg')}
    <h2 class="edi-names">${esc(c.n)}</h2>
    <p class="edi-body">${esc(c.m)}</p>
    <div class="edi-rule">${EDI_RULE}</div>
   </div>
  </section>

  <section class="edi-s edi-msg">
   ${ediPlate('detail','soft')}<div class="edi-wash deep"></div>
   ${ediFlora(30,'tr')}${ediFrame()}
   <div class="edi-in rv">
    <p class="edi-lbl">${esc(E.msgL)}</p>
    <h3 class="edi-sub">${esc(E.msgS)}</h3>
    <div class="edi-rule sm">${EDI_RULE}</div>
    <p class="edi-body">${esc(E.msgBody)}</p>
    <p class="edi-sign">${esc(c.n)}</p>
   </div>
  </section>

  <section class="edi-s edi-date">
   ${S.c.films?ediPlate('date','soft'):''}${S.c.films?'<div class="edi-wash deep"></div>':''}
   ${ediFlora(37,'tl')}${ediFlora(44,'br')}${ediFrame()}
   <div class="edi-in rv">
    <p class="edi-lbl">${esc(E.dateL)}</p>
    <p class="edi-hint">${esc(E.dateHint)}</p>
    <div class="edi-seal" id="ediSeal">
     <div class="edi-dt">
      ${dp.wd?`<b>${esc(dp.wd)}</b>`:''}
      <em>${esc(dp.day)}</em>
      ${dp.rest?`<span>${esc(dp.rest)}</span>`:''}
     </div>
     <canvas class="edi-cv" id="ediCv"></canvas>
    </div>
    <button class="edi-skip" onclick="ediReveal()">${esc(E.dateSkip)}</button>
   </div>
  </section>

  <section class="edi-s edi-venue light">
   ${ediTint(0)}${ediFlora(51,'tr')}${ediFrame()}
   <div class="edi-in rv">
    <p class="edi-lbl dk">${esc(E.venueL)}</p>
    <div class="edi-rule sm dk">${EDI_RULE}</div>
    <h3 class="edi-venue-n">${esc(c.p)}</h3>
    ${c.maps?`<a class="edi-btn" href="${esc(c.maps)}" target="_blank" rel="noopener">${t().uMaps}</a>`:''}
   </div>
   ${ediPlate('venue','frame')}
  </section>

  ${ediCountHTML()}

  ${prog.length?`<section class="edi-s edi-prog">
   ${ediTint(2)}${ediFrame()}
   <div class="edi-in rv">
    <p class="edi-lbl">${esc(E.progTitle)}</p>
    <div class="edi-rule sm">${EDI_RULE}</div>
    <div class="edi-tl">${prog.map((p,i)=>`<div class="edi-tli">
      <span class="edi-med">${MEDS[i%MEDS.length]}</span>
      <span class="edi-tlw">
       <span class="edi-tlt">${esc(p.title)||'—'}</span>
       ${p.place?`<span class="edi-pos"><i>${EDI_PIN}</i>${p.map
         ?`<a href="${esc(p.map)}" target="_blank" rel="noopener">${esc(p.place)}</a>`
         :esc(p.place)}</span>`:''}
      </span>
      <b>${esc(p.time)}</b>
     </div>`).join('')}</div>
   </div>
  </section>`:''}

  ${ediDressHTML()}
  ${ediNoteHTML('dir',EDI_COMPASS,t().edi.dirL,'light')}
  ${ediNoteHTML('stay',EDI_KEY,t().edi.stayL)}

  ${ediSecOn('rsvp')?`<section class="edi-s edi-rsvp light">
   ${ediTint(0)}${ediFlora(58,'bl')}${ediFrame()}
   <div class="edi-in rv">
    <p class="edi-lbl dk">${esc(E.rsvpL)}</p>
    <div class="edi-rule sm dk">${EDI_RULE}</div>
    <p class="edi-q">${esc(E.attend)}</p>
    <div class="edi-yn">
     <button class="edi-btn" onclick="rsvp(1)">${esc(E.yes)}</button>
     <button class="edi-btn ghost" onclick="rsvp(0)">${esc(E.no)}</button>
    </div>
    <p class="edi-thx">${esc(E.thanks)}</p>
   </div>
  </section>`:''}
 </div>`;}

/* ---- mount ---- */
function mountEditorial(stage){
 stage.innerHTML=ediHTML();
 const root=stage.querySelector('#edi');
 const cv=stage.querySelector('#ediCv');
 if(cv)ediWax(cv,inInitials(S.c.n).join(''));

 /* fade sections up as they arrive */
 const items=root.querySelectorAll('.rv,.edi-hero .edi-in,.edi-cue');
 if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
   if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.22});
  items.forEach(n=>io.observe(n));
 } else items.forEach(n=>n.classList.add('in'));

 /* Decode only what is visible. Every plate playing at once was the stutter. */
 const vids=[...root.querySelectorAll('.edi-ph.film video')];
 if(vids.length){
  const hero=vids[0];
  ediClockReset();
  if(hero)hero.play().catch(()=>{});
  if('IntersectionObserver' in window){
   const vo=new IntersectionObserver(es=>es.forEach(e=>{
    const v=e.target;
    if(e.isIntersecting){
     if(v.preload!=='auto')v.preload='auto';
     ediClockGive(v);
    } else if(!v.paused){ ediClockTake(v); v.pause(); }}),{threshold:.15});
   vids.forEach(v=>{
  /* show it only when there is something to show — until then the poster
     underneath is what the guest sees, which is the same picture */
  const reveal=function(){ v.classList.add('on'); };
  if(v.readyState>=2) reveal(); else v.addEventListener('loadeddata',reveal,{once:true});
  ediClockFollow(v); vo.observe(v); });
 /* All the plates are the same file, so once the first has it the rest are
    reading from cache. Escalating them a moment after the invitation opens
    costs one request, not four, and removes the wait on arrival. */
 setTimeout(function(){
  vids.forEach(function(v){ if(v.preload!=='auto') v.preload='auto'; });
 },700);
  } else vids.forEach(v=>v.play().catch(()=>{}));}

 ediStartClock();

 const bar=root.querySelector('#ediBar');
 root.addEventListener('scroll',()=>{
  const m=root.scrollHeight-root.clientHeight;
  if(bar)bar.style.width=(m>0?(root.scrollTop/m*100):0)+'%';},{passive:true});}

/* A built-in film has a .pal-<id> class written by hand. One added from the
   dashboard has only three colours, so the rest of the palette is derived
   from them and written inline — same variables, same result. */
function ediMix(hex,amt){
 const h=String(hex||'').trim().replace('#','');
 if(h.length<6)return '#000000';
 const n=parseInt(h.slice(0,6),16);
 let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
 const t=amt>0?255:0,k=Math.abs(amt);
 r=Math.round(r+(t-r)*k);g=Math.round(g+(t-g)*k);b=Math.round(b+(t-b)*k);
 return '#'+[r,g,b].map(v=>('0'+v.toString(16)).slice(-2)).join('');}
function ediPaletteVars(sw){
 if(!sw||sw.length<3)return '';
 const ink=sw[0],acc=sw[1],paper=sw[2];
 const V={
  '--cream':ediMix(paper,.55),'--cream-hi':ediMix(paper,.8),
  '--beige':ediMix(paper,.12),'--beige-dp':ediMix(paper,-.16),
  '--gold':ediMix(acc,-.1),'--gold-hi':ediMix(acc,.5),
  '--gold-lo':ediMix(acc,-.38),'--gold-pale':ediMix(acc,.72),
  '--ink':ink,'--ink-soft':ediMix(ink,.18),'--ink-mute':ediMix(ink,.42),
  '--blush':acc,'--plum':ediMix(acc,-.34),'--sage':ediMix(acc,-.05),
  '--wax':ediMix(acc,-.24)};
 return Object.keys(V).map(k=>k+':'+V[k]).join(';');}

function editorialOpen(){
 closeVeil(true);
 /* the landing page is still behind the veil; give its decoders back before
    the invitation asks for its own */
 try{lazyvReleaseAll()}catch(e){}
 veil=document.createElement('div');
 veil.className='veil edi-veil-root'+(S.c.ediPal?' pal-'+S.c.ediPal:'')+(S.c.ediFont?' font-'+S.c.ediFont:'')+(S.c.ediLayout?' lay-'+S.c.ediLayout:'');
 /* a film added from the dashboard carries its colours rather than a class */
 if(S.c.ediSw){const v=ediPaletteVars(S.c.ediSw);if(v)veil.setAttribute('style',v);}
 document.body.appendChild(veil);scrollSync();
 const stage=document.createElement('div');stage.className='cstage edi-stage';
 veil.appendChild(stage);
 /* The guest meets the envelope first; the invitation mounts behind it
    while they are still deciding to press the seal. */
 waxEnvelope(stage,()=>{
  if(!veil)return;
  const inner=veil.querySelector('.edi-stage');
  if(inner){ mountEditorial(inner); ediStartMusic(inner); }});
 ediPreload(()=>{});}

/* The music used to start here, at the moment the invitation mounted —
   before the guest had even reached for the seal. Whatever they took to press
   it, five seconds or fifty, the song was already that far in by the time any
   film appeared. For most of the shelf that only meant an arbitrary entry
   point. For بياض it broke the film: that footage was cut to the opening of
   its song, note for frame, and none of it survived the wait.

   It starts with the film now. The first frame and the first note together,
   which is also the only arrangement a browser reliably allows — pressing the
   seal is the gesture that earns the right to make sound. */
/* ═══ one clock for the whole invitation ═══
   Each plate used to start at a fixed point in the film — the hero at zero,
   the next at 4.6s, the next at 8.5s. Scrolling from one to the next therefore
   jumped, because the second plate had been waiting at its own mark rather
   than carrying on.

   There is one clock now. A plate leaving the screen records where it got to;
   the next one to arrive starts from exactly there. The film reads as one
   continuous take that happens to be shown through several windows. */
let EDI_CLOCK = 0;
function ediClockReset(){ EDI_CLOCK = 0; }
function ediClockTake(v){
 try{ if(v && !isNaN(v.currentTime)) EDI_CLOCK = v.currentTime; }catch(e){}
}
/* The clock is kept current by whatever is playing, not only by whatever has
   just left. During a scroll both plates are briefly on screen at once, so the
   arriving one would otherwise read a value from before the outgoing one had
   moved — and appear to jump backwards. */
function ediClockFollow(v){
 v.addEventListener('timeupdate', function(){
  if(!v.paused && !isNaN(v.currentTime)) EDI_CLOCK = v.currentTime;
 });
}
function ediClockGive(v){
 const t = EDI_CLOCK;
 const put = function(){
  try{
   const d = v.duration || 0;
   /* a plate that would start past the end wraps, rather than sitting frozen
      on the last frame */
   const want = (d && t >= d - 0.15) ? 0 : t;
   if(Math.abs(v.currentTime - want) > 0.2) v.currentTime = want;
  }catch(e){}
  v.play().catch(function(){});
 };
 if(v.readyState >= 1) put(); else v.addEventListener('loadedmetadata', put, {once:true});
}

function ediStartMusic(root){
 try{
  if(!S.c.music||!S.c.autoplay)return;
  const v=root&&root.querySelector('.edi-hero video, .edi-ph.film video');
  let done=false;
  const go=()=>{ if(done)return; done=true;
   try{ if(v)v.currentTime=0; }catch(e){}
   try{ playMusic(S.c.music); }catch(e){} };
  if(!v){ go(); return; }
  if(!v.paused&&v.readyState>=2&&v.currentTime>0){ go(); return; }
  v.addEventListener('playing',go,{once:true});
  /* A film that never reports playing must not leave the invitation silent.
     Two and a half seconds was too patient: the heavier designs mount slowly
     and ليلة الحنّة sat quiet for five seconds after the seal. One second is
     long enough for a film that is going to start — بياض reports playing
     within twenty milliseconds — and short enough that a film which is not
     going to start does not cost the guest the opening. */
  setTimeout(go,1000);
 }catch(e){}
}

/* demo entry: dress the emerald wedding template with a full programme */
function editorialDemo(){
 demoBackup={c:JSON.parse(JSON.stringify(S.c))};
 const when=new Date(Date.now()+37*864e5+5*36e5);
 S.c={...S.c,...readyDef({cat:'wed'},S.lang),font:0,pal:0,anim:'edi',music:1,autoplay:true,musicStart:'open',
  qr:false,maps:'https://maps.google.com',story:[],guest:'',
  when:when.toISOString().slice(0,16),program:ediDemoProgram()};
 editorialOpen();}

function ediDemoProgram(cat,f){
 const row=function(r){return {time:r[0],title:r[1],place:r[2],map:'',music:0,photos:[]};};
 /* A wedding that carries its own running order uses it; everything else
    falls back to the one shared by its occasion. */
 if(typeof readyProgDemo==='function'){
  const own=readyProgDemo(f,S.lang);
  if(own)return own.map(row);}
 /* This film's own, then its occasion's — both added because falling through
    to the wedding programme had an agency opening running عقد القران. */
 const fid=f&&f.id;
 if(fid&&EDI_PROG_FILM[fid])return (EDI_PROG_FILM[fid][S.lang]||EDI_PROG_FILM[fid].ar).map(row);
 if(EDI_PROG_EXTRA[cat])return (EDI_PROG_EXTRA[cat][S.lang]||EDI_PROG_EXTRA[cat].ar).map(row);
 /* A save-the-date has no programme by definition — the whole point is that
    the details are not settled yet. An empty one hides the section. */
 if(cat==='save')return [];
 const P={
  wed:{ar:[['16:00','استقبال الضيوف','بهو القصر'],['17:00','عقد القران','قاعة الياسمين'],
    ['18:30','كوكتيل وصور','الشرفة المطلّة على البحر'],['20:00','العشاء','القاعة الكبرى'],
    ['22:00','السهرة','الحديقة الخلفية']],
   fr:[['16:00','Accueil des invités','Hall du palais'],['17:00','Cérémonie','Salle Yasmine'],
    ['18:30','Cocktail & photos','Terrasse sur la mer'],['20:00','Dîner','Grande salle'],
    ['22:00','Soirée','Jardin arrière']],
   en:[['16:00','Guest welcome','Palace hall'],['17:00','Ceremony','Yasmine hall'],
    ['18:30','Cocktail & photos','Sea-facing terrace'],['20:00','Dinner','The grand hall'],
    ['22:00','Party','The back garden']]},
  bday:{ar:[['18:00','استقبال','الشرفة'],['19:00','إطفاء الشموع','الصالة'],
    ['20:00','الهدايا والصور','ركن الصور'],['21:30','موسيقى ورقص','الحديقة']],
   fr:[['18:00','Accueil','La terrasse'],['19:00','Les bougies','Le salon'],
    ['20:00','Cadeaux & photos','Coin photo'],['21:30','Musique & danse','Le jardin']],
   en:[['18:00','Welcome','The terrace'],['19:00','Blowing the candles','The lounge'],
    ['20:00','Gifts & photos','Photo corner'],['21:30','Music & dancing','The garden']]},
  baby:{ar:[['15:00','استقبال الضيوف','بيت العائلة'],['16:00','تسمية المولود','الصالة'],
    ['17:00','الصور التذكارية','ركن الصور'],['18:00','الشاي والحلوى','الحديقة']],
   fr:[['15:00','Accueil','Maison de famille'],['16:00','Le prénom','Le salon'],
    ['17:00','Photos souvenirs','Coin photo'],['18:00','Thé & douceurs','Le jardin']],
   en:[['15:00','Welcome','The family home'],['16:00','Naming the baby','The lounge'],
    ['17:00','Keepsake photos','Photo corner'],['18:00','Tea & sweets','The garden']]},
  henna:{ar:[['18:00','استقبال الأهل','دار العائلة'],['19:00','موكب صينية الحنّة','البهو'],
    ['20:00','وضع الحنّة','الصالة الكبرى'],['21:30','المزود والزغاريد','الفناء'],
    ['23:00','الشاي والحلويات','الحديقة']],
   fr:[['18:00','Accueil des proches','Maison de famille'],['19:00','Cortège du plateau','Le hall'],
    ['20:00','Pose du henné','Grande salle'],['21:30','Mezoued et youyous','La cour'],
    ['23:00','Thé et douceurs','Le jardin']],
   en:[['18:00','Welcoming the families','The family home'],['19:00','The henna tray procession','The hall'],
    ['20:00','Applying the henna','The great hall'],['21:30','Mezoued and zaghareet','The courtyard'],
    ['23:00','Tea and sweets','The garden']]},
  grad:{ar:[['10:00','التجمّع','ساحة الكلية'],['11:00','تسليم الشهادات','القاعة الكبرى'],
    ['12:30','الصور مع العائلة','الحديقة'],['14:00','الاحتفال','بيت العائلة']],
   fr:[['10:00','Rassemblement','Cour de la faculté'],['11:00','Remise des diplômes','Grand amphi'],
    ['12:30','Photos en famille','Le jardin'],['14:00','La fête','Maison de famille']],
   en:[['10:00','Gathering','The faculty courtyard'],['11:00','Diplomas','The great hall'],
    ['12:30','Family photos','The garden'],['14:00','The celebration','The family home']]}};
 const L=(P[cat]||P.wed)[S.lang];
 return L.map(([time,title,place])=>({time:time,title:title,place:place,map:'',music:0,photos:[]}));}

;
