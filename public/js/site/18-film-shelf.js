/* ================= ready-made invitations =================
   The three finished films, each playing inside an iPhone frame with its own
   footage bleeding out behind it as a blurred backdrop. Tapping one opens the
   full scrolling invitation with that film as its plates. */

/* the catalogue lives in js/shared/films.js so the dashboard sees the same one */
function FR(){return readyCatalogue();}



/* Text written in the dashboard for one film, in the language being shown.
   Empty fields fall through to the copy that ships with the film. */
function readyTxt(id){
 const o=readyCfg(id).txt;
 return (o&&o[S.lang])||{};}
function readyBlurb(f){const x=readyTxt(f.id);
 return (x.blurb&&x.blurb.trim())||f.blurb[S.lang];}
/* the programme, if the owner wrote one; rows with no title are dropped */
function readyProg(f){
 const rows=(readyCfg(f.id).prog||{})[S.lang];
 if(!rows||!rows.length)return null;
 const keep=rows.filter(r=>(r.title||'').trim());
 return keep.length?keep.map(r=>({time:r.time||'',title:r.title||'',
   place:r.place||'',map:r.map||'',music:0,photos:[]})):null;}

function readyFilm(id){const L=FR();return L.find(f=>f.id===id)||L[0];}
/* Dashboard overrides: hide a film, rename it, or reprice it. */
/* readyCfg now lives in shared/films.js, beside readyCatalogue — the dashboard
   needs it too, and one definition is what keeps preview and delivery in step. */
function readyShown(){return FR().filter(f=>readyCfg(f.id).vis!==false);}
function readyName(f){const o=readyCfg(f.id);return (o.nm&&o.nm.trim())||f.name[S.lang];}
function readyPrice(f){const o=readyCfg(f.id);return o.price||CFG.price.ready||CFG.price.ultra;}
/* the price it is discounted from; hidden when it is not actually lower */
/* Arabic-Indic digits in Arabic, Latin elsewhere — matches the invitations */
function rdNum(n){return S.lang==='ar'?toAr(n):String(n);}
function readyWas(f){const o=readyCfg(f.id);
 const was=o.was||CFG.price.readyWas||0;
 return was>readyPrice(f)?was:0;}

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
     <span class="rd-cat">${t().rdCats[f.cat]}${readyWas(f)?`<i class="rd-save">${t().save}</i>`:''}</span>
     <b>${esc(readyName(f))}</b>
     <p>${esc(readyBlurb(f))}</p>
     <div class="rd-acts">
      <button class="rd-btn gold" onclick="openReady('${f.id}')">${t().rdOpen}</button>
      <button class="rd-btn ghost" onclick="openOrder('${f.id}')">
       ${t().rdOrder}
       <span class="rd-price">${readyWas(f)?`<s>${rdNum(readyWas(f))}</s>`:''}
        <b>${rdNum(readyPrice(f))} ${t().cur}</b></span>
      </button>
     </div>
    </div>
   </article>`).join('')}</div>
 </section>`;}

/* Open the full invitation dressed in the chosen film. */
function openReady(id){
 const f=readyFilm(id);
 demoBackup={c:JSON.parse(JSON.stringify(S.c))};
 const when=new Date(Date.now()+37*864e5+5*36e5);
 S.c={...S.c,...readyDef(f,S.lang),font:0,pal:0,anim:'edi',music:1,autoplay:true,musicStart:'open',
  qr:false,maps:'https://maps.google.com',story:[],guest:'',
  when:when.toISOString().slice(0,16),
  film:f.id,films:{hero:f.v,hall:f.v,detail:f.v,date:f.v,venue:f.p},
  ediPal:f._custom?'':f.id, ediSw:f._custom?f.sw:null,
  /* whatever the dashboard set for this film, else the scope default */
  envStyle:readyCfg(f.id).env||'',vidStyle:readyCfg(f.id).vid||'',
  dress:f.dress?{t:(f.dress[S.lang]||[])[0]||'',d:(f.dress[S.lang]||[])[1]||'',sw:f.sw||null}:null,
  trackUrl:readyCfg(f.id).snd||f.snd||'',
  trackName:readyCfg(f.id).sndN||f.sndN||'',
  /* where the song should start and stop for this film, if it was trimmed */
  trackFrom:+readyCfg(f.id).snd0||0,
  trackTo:+readyCfg(f.id).snd1||0,
  dir:f.cat==='wed'?ediDemoNote('dir'):null,
  stay:f.cat==='wed'?ediDemoNote('stay'):null,
  program:ediDemoProgram(f.cat)};

 /* anything typed in the dashboard wins over the shipped copy */
 const x=readyTxt(f.id), pick=(v,fb)=>(v&&String(v).trim())?v:fb;
 S.c.t=pick(x.t,S.c.t); S.c.n=pick(x.n,S.c.n); S.c.d=pick(x.d,S.c.d);
 S.c.p=pick(x.p,S.c.p); S.c.m=pick(x.m,S.c.m);
 if(x.when&&x.when.trim())S.c.when=x.when;
 if(x.dressT||x.dressD){
  S.c.dress={t:pick(x.dressT,(S.c.dress||{}).t||''),
             d:pick(x.dressD,(S.c.dress||{}).d||''),sw:f.sw||null};}
 if(x.dirT||x.dirD)S.c.dir={t:x.dirT||'',d:x.dirD||''};
 if(x.stayT||x.stayD)S.c.stay={t:x.stayT||'',d:x.stayD||''};
 const pr=readyProg(f); if(pr)S.c.program=pr;

 editorialOpen();}
;

/* Shelf playback is gated the same way as the invitation: a card off screen
   costs nothing, and preload only escalates once it scrolls in. */
function filmShelfMount(){
 const host=document.getElementById('ready');
 if(!host||host.dataset.mounted)return;
 host.dataset.mounted='1';
 lazyvWatch([...host.querySelectorAll('.iph-scr')], 2);}

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
