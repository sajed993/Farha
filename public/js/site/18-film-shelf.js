/* ================= ready-made invitations =================
   The three finished films, each playing inside an iPhone frame with its own
   footage bleeding out behind it as a blurred backdrop. Tapping one opens the
   full scrolling invitation with that film as its plates. */

const FILMS_READY=[
 /* ── weddings ── */
 {id:'marble',cat:'wed',v:'/media/inv/inv-1.mp4',p:'/media/inv/inv-1.jpg',design:2,
  name:{ar:'قصر الرخام',fr:'Palais de Marbre',en:'Marble Palace'},
  blurb:{ar:'سلالم رخامية وأكاليل ورد باهت الوردة، وأعمدة تصعد نحو النور',
   fr:'Un escalier de marbre, des guirlandes de roses poudrées et des colonnes qui montent vers la lumière',
   en:'A marble staircase, garlands of powder-rose blooms and columns rising into the light'},
  dress:{ar:['أنيق رسمي','بدلة داكنة · فستان طويل'],fr:['Tenue de soirée','Costume sombre · robe longue'],en:['Black tie optional','Dark suit · long dress']},
  sw:['#43342A','#AE7E70','#EFDFC2'],
  snd:'/media/snd/marble.webm',sndN:'حسين الجسمي — فستانك الأبيض'},
 {id:'oneday',cat:'wed',v:'/media/inv/inv-2.mp4',p:'/media/inv/inv-2.jpg',design:3,
  name:{ar:'يومًا ما',fr:'One Day',en:'One Day'},
  blurb:{ar:'أبيض وأسود: كعبٌ وشمبانيا وعلبة خواتم على التول… ووعدٌ مكتوب بخفة',
   fr:'Noir et blanc : escarpins, champagne et un écrin sur le tulle… une promesse écrite tout en légèreté',
   en:'Black and white: heels, champagne and a ring box on tulle… a promise written lightly'},
  dress:{ar:['أبيض وأسود','بلا ألوان — أناقة صافية'],fr:['Noir et blanc','Sans couleur — élégance pure'],en:['Black and white','No colour — pure elegance']},
  sw:['#1A1A1D','#8E8A86','#EDEDEF'],
  snd:'/media/snd/oneday.webm',sndN:'Christina Perri — A Thousand Years'},
 {id:'wisteria',cat:'wed',v:'/media/inv/inv-4.mp4',p:'/media/inv/inv-4.jpg',design:4,
  name:{ar:'ظلال الوستارية',fr:'Ombres de Glycine',en:'Wisteria Shade'},
  blurb:{ar:'وستارية تتهدّل على بابٍ عاجي بحلقةٍ ذهبية، والضوء يرقص بين الأوراق',
   fr:"Une glycine retombe sur une porte ivoire cerclée d'or, la lumière danse entre les feuilles",
   en:'Wisteria spilling over an ivory door ringed in gold, light dancing through the leaves'},
  dress:{ar:['أنيق ربيعي','ألوان فاتحة · لمسة ليلكية'],fr:['Chic printanier','Tons clairs · une touche lilas'],en:['Spring formal','Light tones · a touch of lilac']},
  sw:['#3B3326','#8E7AA0','#EADCBC'],
  snd:'/media/snd/wisteria.webm',sndN:'مهى فتوني — أجمل فرحة'},
 {id:'rings',cat:'wed',v:'/media/inv/inv-3.mp4',p:'/media/inv/inv-3.jpg',design:1,
  name:{ar:'خواتم النور',fr:'Anneaux de Lumière',en:'Rings of Light'},
  blurb:{ar:'خاتمان على أرضٍ كالمرآة، ونافذةٌ مقوّسة يعبرها ظلُّ العروس',
   fr:"Deux anneaux sur un sol-miroir et une fenêtre en arche que traverse l'ombre de la mariée",
   en:"Two rings on a mirrored floor, and an arched window the bride's silhouette passes through"},
  dress:{ar:['أنيق كلاسيكي','أزرق داكن · عاجي'],fr:['Classique élégant','Bleu profond · ivoire'],en:['Classic formal','Deep blue · ivory']},
  sw:['#2C3742','#5E88AA','#E6D6BE'],
  snd:'/media/snd/rings.webm',sndN:'Ludovico Einaudi — Nuvole Bianche'},

 /* ── birthdays ── */
 {id:'bdaycake',cat:'bday',v:'/media/inv/bday-cake.mp4',p:'/media/inv/bday-cake.jpg',design:7,
  name:{ar:'شمعة العام',fr:'La Bougie',en:'One Candle'},
  blurb:{ar:'شمعةٌ واحدة فوق كعكة، وورودٌ داكنة حولها، والضوء وحده يحتفل',
   fr:'Une seule bougie sur le gâteau, des fleurs sombres autour, et la lumière qui fête toute seule',
   en:'A single candle on the cake, dark blooms around it, and only the light celebrating'},
  dress:{ar:['أحمر وأسود','لمسة جريئة تكفي'],fr:['Rouge et noir','Une touche audacieuse suffit'],en:['Red and black','One bold touch is enough']},
  sw:['#3A2018','#BE3325','#E9DDCB']},
 {id:'bdayballoons',cat:'bday',v:'/media/inv/bday-balloons.mp4',p:'/media/inv/bday-balloons.jpg',design:7,
  name:{ar:'بالونات وردية',fr:'Ballons Poudrés',en:'Blush Balloons'},
  blurb:{ar:'بالوناتٌ وردية وهدايا وباقةٌ صغيرة — فرحٌ خفيف بلا ضجيج',
   fr:'Ballons poudrés, cadeaux et un petit bouquet — une joie légère, sans bruit',
   en:'Blush balloons, gifts and a small bouquet — light joy, no noise'},
  dress:{ar:['وردي وناعم','ألوان الباستيل'],fr:['Rose et doux','Teintes pastel'],en:['Blush and soft','Pastel tones']},
  sw:['#4A2E2A','#D48CA0','#EEDDD8']},

 /* ── newborns ── */
 {id:'babybasket',cat:'baby',v:'/media/inv/baby-basket.mp4',p:'/media/inv/baby-basket.jpg',design:8,
  name:{ar:'قدمان صغيرتان',fr:'Deux Petits Pieds',en:'Two Small Feet'},
  blurb:{ar:'قدمان صغيرتان في سلّةٍ من القشّ — أهدأ إعلانٍ يمكن أن ترسلوه',
   fr:"Deux petits pieds dans un couffin d'osier — l'annonce la plus douce qui soit",
   en:'Two small feet in a woven basket — the gentlest announcement there is'},
  sw:['#4A4036','#D1815E','#EEDCCB']},
 {id:'babycake',cat:'baby',v:'/media/inv/baby-cake.mp4',p:'/media/inv/baby-cake.jpg',design:8,
  name:{ar:'أهلًا يا صغير',fr:'Oh Baby',en:'Oh Baby'},
  blurb:{ar:'كعكةٌ بيضاء على لحافٍ ناعم، وكلمتان مكتوبتان بالكريمة',
   fr:'Un gâteau blanc sur une couverture douce, et deux mots écrits à la crème',
   en:'A white cake on a soft quilt, and two words piped in cream'},
  sw:['#3F3E3D','#8E8578','#E2E0D8']},

 /* ── graduation ── */
 {id:'grad',cat:'grad',v:'/media/inv/grad.mp4',p:'/media/inv/grad.jpg',design:6,
  name:{ar:'قبّعة وورد',fr:'Toque et Roses',en:'Cap and Roses'},
  blurb:{ar:'قبّعة التخرّج وباقةٌ من الورد الوردي تحت سماءٍ صافية',
   fr:'La toque et un bouquet de roses sous un ciel clair',
   en:'The cap and an armful of pink roses under a clear sky'},
  dress:{ar:['أنيق نهاري','ألوان فاتحة'],fr:['Chic de jour','Tons clairs'],en:['Daytime smart','Light tones']},
  sw:['#1C2030','#C86A8A','#D8DEEE']},

 /* ── save the date ── */
 {id:'soon',cat:'save',v:'/media/inv/soon.mp4',p:'/media/inv/soon.jpg',design:3,
  name:{ar:'قريبًا',fr:'Bientôt',en:'Coming Soon'},
  blurb:{ar:'حريرٌ عاجي وظلٌّ يتحرك، وسطرٌ واحد: شيءٌ جميل قادم',
   fr:"Soie ivoire, une ombre qui bouge, et une seule ligne : quelque chose de beau arrive",
   en:'Ivory silk, a moving shadow, and one line: something lovely is coming'},
  sw:['#4A3E34','#A58E7C','#E8DDCE']}
];
/* order matters — the chips read in this order */
const RD_CATS=['all','wed','bday','baby','grad','save'];


function readyFilm(id){return FILMS_READY.find(f=>f.id===id)||FILMS_READY[0];}
/* Dashboard overrides: hide a film, rename it, or reprice it. */
function readyCfg(id){return (typeof CFG!=='undefined'&&CFG&&CFG.films&&CFG.films[id])||{};}
function readyShown(){return FILMS_READY.filter(f=>readyCfg(f.id).vis!==false);}
function readyName(f){const o=readyCfg(f.id);return (o.nm&&o.nm.trim())||f.name[S.lang];}
function readyPrice(f){const o=readyCfg(f.id);return o.price||CFG.price.ultra;}

/* An iPhone: titanium rail, Dynamic Island, side buttons, a little screen glare. */
function iphoneHTML(inner,cls){
 return `<div class="iph ${cls||''}">
   <span class="iph-btn vol1"></span><span class="iph-btn vol2"></span>
   <span class="iph-btn vol3"></span><span class="iph-btn pwr"></span>
   <div class="iph-scr">${inner}<span class="iph-isl"></span><span class="iph-glare"></span></div>
  </div>`;}

function setRdFilter(k){S.rdFilter=k;render();setTimeout(()=>{try{scrollSec('ready')}catch(e){}},0);}
function filmShelfHTML(){
 const cur=S.rdFilter||'all';
 const avail=readyShown();
 const chips=RD_CATS.filter(k=>k==='all'||avail.some(f=>f.cat===k))
  .map(k=>`<button class="chip ${cur===k?'on':''}" onclick="setRdFilter('${k}')">${t().rdCats[k]}</button>`).join('');
 const list=avail.filter(f=>cur==='all'||f.cat===cur);
 return `<section id="ready">
  <div class="sec-head"><span class="kicker">${t().rdKick}</span>
   <h2>${t().rdTitle}</h2><p>${t().rdSub}</p></div>
  <div class="filters rd-filters">${chips}</div>
  <div class="rd-grid">${list.map(f=>`
   <article class="rd-card">
    <div class="rd-stage" onclick="openReady('${f.id}')">
     <div class="rd-bleed" style="--b1:${(f.sw&&f.sw[1])||'#AE7E70'};--b2:${(f.sw&&f.sw[2])||'#EFDFC2'}"></div>
     <div class="rd-glow"></div>
     ${iphoneHTML(lazyvHTML(f.v,'rd-v'))}
     <span class="rd-play">▶</span>
    </div>
    <div class="rd-meta">
     <span class="rd-cat">${t().rdCats[f.cat]}</span>
     <b>${esc(readyName(f))}</b>
     <p>${f.blurb[S.lang]}</p>
     <div class="rd-acts">
      <button class="rd-btn gold" onclick="openReady('${f.id}')">${t().rdOpen}</button>
      <button class="rd-btn ghost" onclick="addToCart('${readyName(f).replace(/'/g,'')}',${readyPrice(f)})">${t().rdOrder}</button>
     </div>
    </div>
   </article>`).join('')}</div>
 </section>`;}

/* Open the full invitation dressed in the chosen film. */
function openReady(id){
 const f=readyFilm(id);
 demoBackup={design:S.design,c:JSON.parse(JSON.stringify(S.c))};
 S.design=f.design;
 const dz=DESIGNS.find(d=>d.id===f.design)||DESIGNS[1];
 const when=new Date(Date.now()+37*864e5+5*36e5);
 S.c={...S.c,...dz.def[S.lang],font:0,pal:0,anim:'edi',music:1,autoplay:true,musicStart:'open',
  qr:false,maps:'https://maps.google.com',story:[],guest:'',
  when:when.toISOString().slice(0,16),
  film:f.id,films:{hero:f.v,hall:f.v,detail:f.v,date:f.v,venue:f.p},ediPal:f.id,
  dress:f.dress?{t:(f.dress[S.lang]||[])[0]||'',d:(f.dress[S.lang]||[])[1]||'',sw:f.sw||null}:null,
  trackUrl:f.snd||'',trackName:f.sndN||'',
  dir:f.cat==='wed'?ediDemoNote('dir'):null,
  stay:f.cat==='wed'?ediDemoNote('stay'):null,
  program:ediDemoProgram(f.cat)};
 editorialOpen();}
;

/* Shelf playback is gated the same way as the invitation: a card off screen
   costs nothing, and preload only escalates once it scrolls in. */
function filmShelfMount(){
 const host=document.getElementById('ready');
 if(!host||host.dataset.mounted)return;
 host.dataset.mounted='1';
 lazyvWatch([...host.querySelectorAll('.iph-scr')]);}

/* Placeholder copy for the optional notes until the couple fills them in. */
function ediDemoNote(k){
 const L={
  dir:{ar:['موقف مجاني','خدمة صفّ السيارات من الساعة ٣:٣٠ · مدخل الضيوف من البوابة الشرقية'],
   fr:['Parking gratuit',"Service voiturier dès 15h30 · entrée des invités par la porte est"],
   en:['Free parking','Valet from 3:30 pm · guest entrance through the east gate']},
  stay:{ar:['أسعار خاصة','فندقان على بعد دقائق — اذكروا اسم العروسين عند الحجز'],
   fr:['Tarifs négociés','Deux hôtels à quelques minutes — mentionnez les mariés à la réservation'],
   en:['Negotiated rates','Two hotels minutes away — mention the couple when booking']}}[k][S.lang];
 return {t:L[0],d:L[1]};}

/* Dashboard preview: index.html?vidPreview=<film>&vidStyle=<style> opens that
   film straight into the invitation with the envelope skipped, so the admin
   iframe shows the real thing rather than a copy of it. */
function vidPreviewBoot(){
 let q;try{q=new URLSearchParams(location.search);}catch(e){return;}
 const film=q.get('vidPreview');if(!film)return;
 const sec=q.get('vidSec')||'hall';
 document.documentElement.classList.add('is-preview');
 setTimeout(()=>{
  try{openReady(film);}catch(e){return;}
  /* skip the seal — the preview is about the film plate, not the envelope */
  setTimeout(()=>{
   const w=document.getElementById('wenvWax');
   if(w&&w.__open)w.__open();
   setTimeout(()=>{
    const r=document.getElementById('edi');if(!r)return;
    r.querySelectorAll('.edi-in,.edi-cue').forEach(e=>e.classList.add('in'));
    const t=r.querySelector('.edi-'+sec)||r.querySelector('.edi-hero');
    r.style.scrollBehavior='auto';
    if(t)t.scrollIntoView({block:'start'});
   },2600);
  },420);
 },260);}
if(typeof window!=='undefined')window.addEventListener('load',()=>{try{vidPreviewBoot()}catch(e){}});
