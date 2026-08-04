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

function ediPlate(k,cls){
 const on=ediImgOK[k];
 return `<div class="edi-ph p-${k} ${on?'has':''} ${cls||''}"${on?` style="background-image:url('${EDI_IMG_BASE}${k}.jpg')"`:''}></div>`;}

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
function ediWax(cv,initials){
 const ctx=cv.getContext('2d');if(!ctx)return;
 const seal=cv.parentElement;
 let strokes=0,done=false;

 function paint(){
  const r=cv.getBoundingClientRect();
  cv.width=Math.max(120,Math.round(r.width*2));
  cv.height=Math.max(120,Math.round(r.height*2));
  const w=cv.width,h=cv.height,cx=w/2,cy=h/2,rr=Math.min(w,h)*.47;
  ctx.clearRect(0,0,w,h);
  const g=ctx.createRadialGradient(w*.36,h*.3,w*.04,cx,cy,rr*1.15);
  g.addColorStop(0,'#D6A85B');g.addColorStop(.34,'#A87A28');
  g.addColorStop(.7,'#6E4614');g.addColorStop(1,'#3E260A');
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
  ctx.fillStyle='rgba(34,18,2,.6)';
  ctx.font='700 '+Math.round(w*.24)+'px '+(S.lang==='ar'?'"Aref Ruqaa",serif':'"Cormorant Garamond",serif');
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(initials||'✦',cx,cy+w*.015);}

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

/* ---- sections ---- */
function ediHTML(){
 const c=S.c,E=t().edi,ini=inInitials(c.n),dp=ediDateParts();
 const mono=ini.length>=2
  ? `<b>${esc(ini[0])}</b><i>${S.lang==='ar'?'و':'&'}</i><b>${esc(ini[1])}</b>`
  : `<b class="solo">${esc(ini[0]||'✦')}</b>`;
 const cart=n=>`<div class="edi-mono ${n||''}">${EDI_CART}<span class="mg">${mono}</span></div>`;
 const prog=(c.program&&c.program.length?c.program:[]).slice(0,6);

 return `<div class="edi" id="edi">
  <div class="edi-bar"><i id="ediBar"></i></div>
  <button class="edi-x" onclick="closeVeil()">${t().closePrev}</button>

  <section class="edi-s edi-hero">
   ${ediPlate('hero')}<div class="edi-wash"></div>
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
   <div class="edi-in rv">
    ${cart('lg')}
    <h2 class="edi-names">${esc(c.n)}</h2>
    <p class="edi-body">${esc(c.m)}</p>
    <div class="edi-rule">${EDI_RULE}</div>
   </div>
  </section>

  <section class="edi-s edi-msg">
   ${ediPlate('detail','soft')}<div class="edi-wash deep"></div>
   <div class="edi-in rv">
    <p class="edi-lbl">${esc(E.msgL)}</p>
    <h3 class="edi-sub">${esc(E.msgS)}</h3>
    <div class="edi-rule sm">${EDI_RULE}</div>
    <p class="edi-body">${esc(E.msgBody)}</p>
    <p class="edi-sign">${esc(c.n)}</p>
   </div>
  </section>

  <section class="edi-s edi-date">
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
   <div class="edi-in rv">
    <p class="edi-lbl dk">${esc(E.venueL)}</p>
    <div class="edi-rule sm dk">${EDI_RULE}</div>
    <h3 class="edi-venue-n">${esc(c.p)}</h3>
    ${c.maps?`<a class="edi-btn" href="${esc(c.maps)}" target="_blank" rel="noopener">${t().uMaps}</a>`:''}
   </div>
   ${ediPlate('venue','frame')}
  </section>

  ${prog.length?`<section class="edi-s edi-prog">
   <div class="edi-in rv">
    <p class="edi-lbl">${esc(t().progTitle)}</p>
    <div class="edi-rule sm">${EDI_RULE}</div>
    <div class="edi-tl">${prog.map((p,i)=>`<div class="edi-tli">
      <span class="edi-med">${EDI_ICONS[i%EDI_ICONS.length]}</span>
      <b>${esc(p.time)}</b>
      <span class="edi-tlt">${esc(p.title)||'—'}</span>
     </div>`).join('')}</div>
   </div>
  </section>`:''}

  <section class="edi-s edi-rsvp light">
   <div class="edi-in rv">
    <p class="edi-lbl dk">${t().uRsvp}</p>
    <div class="edi-rule sm dk">${EDI_RULE}</div>
    <p class="edi-q">${t().uAttend}</p>
    <div class="edi-yn">
     <button class="edi-btn" onclick="rsvp(1)">${t().uYes}</button>
     <button class="edi-btn ghost" onclick="rsvp(0)">${t().uNo}</button>
    </div>
    <p class="edi-thx">${esc(E.thanks)}</p>
   </div>
  </section>
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

 const bar=root.querySelector('#ediBar');
 root.addEventListener('scroll',()=>{
  const m=root.scrollHeight-root.clientHeight;
  if(bar)bar.style.width=(m>0?(root.scrollTop/m*100):0)+'%';},{passive:true});}

function editorialOpen(){
 closeVeil(true);
 veil=document.createElement('div');veil.className='veil edi-veil-root';
 document.body.appendChild(veil);document.body.style.overflow='hidden';
 const stage=document.createElement('div');stage.className='cstage edi-stage';
 veil.appendChild(stage);
 stage.innerHTML=`<div class="edi-boot"><span></span></div>`;
 ediPreload(()=>{if(veil&&veil.querySelector('.edi-stage'))mountEditorial(stage);
  try{if(S.c.music&&S.c.autoplay)playMusic(S.c.music);}catch(e){}});}

/* demo entry: dress the emerald wedding template with a full programme */
function editorialDemo(){
 demoBackup={design:S.design,c:JSON.parse(JSON.stringify(S.c))};
 S.design=2;
 const dz=DESIGNS.find(d=>d.id===2);
 const when=new Date(Date.now()+37*864e5+5*36e5);
 S.c={...S.c,...dz.def[S.lang],font:0,pal:0,anim:'edi',music:1,autoplay:true,musicStart:'open',
  qr:false,maps:'https://maps.google.com',story:[],guest:'',
  when:when.toISOString().slice(0,16),program:ediDemoProgram()};
 editorialOpen();}

function ediDemoProgram(){
 const L={
  ar:[['16:00','استقبال الضيوف'],['17:00','عقد القران'],['18:30','كوكتيل وصور'],['20:00','العشاء'],['22:00','السهرة']],
  fr:[['16:00','Accueil des invités'],['17:00','Cérémonie'],['18:30','Cocktail & photos'],['20:00','Dîner'],['22:00','Soirée']],
  en:[['16:00','Guest welcome'],['17:00','Ceremony'],['18:30','Cocktail & photos'],['20:00','Dinner'],['22:00','Party']]}[S.lang];
 return L.map(([time,title])=>({time:time,title:title,place:'',map:'',music:0,photos:[]}));}

;
