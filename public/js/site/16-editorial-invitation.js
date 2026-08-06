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

const EDI_CUE={hero:0,hall:.28,detail:.52,date:.74,venue:.88};
/* Seconds into each clip, so a #t= fragment can be baked into the src. Seeking
   in JS after load stalls the decoder and shows as a freeze; the fragment lets
   the browser begin decoding at the cue instead. */
const EDI_DUR={'/media/inv/inv-1.mp4':16.3,'/media/inv/inv-2.mp4':8.4,
 '/media/inv/inv-3.mp4':9.9,'/media/inv/inv-4.mp4':12.2};
/* A plate is a film when one is assigned, else a photograph, else the CSS wash. */
function ediPlate(k,cls){
 const film=S.c.films&&S.c.films[k];
 if(film&&/\.mp4$/i.test(film)){
  const cue=EDI_CUE[k]||0, dur=EDI_DUR[film]||0;
  const src=film+(cue>0&&dur?('#t='+(dur*cue).toFixed(1)):'');
  const poster=film.replace(/\.mp4$/,'.jpg');
  /* only the first plate preloads in full — the rest wait until they scroll in */
  return `<div class="edi-ph film ${cls||''}"><video src="${src}" poster="${poster}"
    muted loop playsinline preload="${k==='hero'?'auto':'metadata'}"></video></div>`;}
 if(film)
  return `<div class="edi-ph has ${cls||''}" style="background-image:url('${film}')"></div>`;
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


/* ---- countdown ----
   Four engraved cells separated by hairlines, with a drawn dial in the label.
   Classic stationery treatment rather than a digital timer. */
function ediCountHTML(){
 const c=S.c,E=t().edi;
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
 const d=S.c.dress,E=t().edi;
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
 const c=S.c,E=t().edi,ini=inInitials(c.n),dp=ediDateParts();
 const mono=ini.length>=2
  ? `<b>${esc(ini[0])}</b><i>${S.lang==='ar'?'و':'&'}</i><b>${esc(ini[1])}</b>`
  : `<b class="solo">${esc(ini[0]||'✦')}</b>`;
 const cart=n=>`<div class="edi-mono ${n||''}">${EDI_CART}<span class="mg">${mono}</span></div>`;
 const prog=ediSecOn('prog')?(c.program&&c.program.length?c.program:[]).slice(0,6):[];

 return `<div class="edi" id="edi" data-vid="${ediVidStyle()}">
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
    <p class="edi-lbl">${esc(t().progTitle)}</p>
    <div class="edi-rule sm">${EDI_RULE}</div>
    <div class="edi-tl">${prog.map((p,i)=>`<div class="edi-tli">
      <span class="edi-med">${EDI_ICONS[i%EDI_ICONS.length]}</span>
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
    <p class="edi-lbl dk">${t().uRsvp}</p>
    <div class="edi-rule sm dk">${EDI_RULE}</div>
    <p class="edi-q">${t().uAttend}</p>
    <div class="edi-yn">
     <button class="edi-btn" onclick="rsvp(1)">${t().uYes}</button>
     <button class="edi-btn ghost" onclick="rsvp(0)">${t().uNo}</button>
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
  if(hero)hero.play().catch(()=>{});
  if('IntersectionObserver' in window){
   const vo=new IntersectionObserver(es=>es.forEach(e=>{
    const v=e.target;
    if(e.isIntersecting){if(v.preload!=='auto')v.preload='auto';v.play().catch(()=>{});}
    else if(!v.paused)v.pause();}),{threshold:.15});
   vids.forEach(v=>vo.observe(v));
  } else vids.forEach(v=>v.play().catch(()=>{}));}

 ediStartClock();

 const bar=root.querySelector('#ediBar');
 root.addEventListener('scroll',()=>{
  const m=root.scrollHeight-root.clientHeight;
  if(bar)bar.style.width=(m>0?(root.scrollTop/m*100):0)+'%';},{passive:true});}

function editorialOpen(){
 closeVeil(true);
 /* the landing page is still behind the veil; give its decoders back before
    the invitation asks for its own */
 try{lazyvReleaseAll()}catch(e){}
 veil=document.createElement('div');
 veil.className='veil edi-veil-root'+(S.c.ediPal?' pal-'+S.c.ediPal:'');
 document.body.appendChild(veil);document.body.style.overflow='hidden';
 const stage=document.createElement('div');stage.className='cstage edi-stage';
 veil.appendChild(stage);
 /* The guest meets the envelope first; the invitation mounts behind it
    while they are still deciding to press the seal. */
 waxEnvelope(stage,()=>{
  if(!veil)return;
  const inner=veil.querySelector('.edi-stage');
  if(inner)mountEditorial(inner);});
 ediPreload(()=>{});
 try{if(S.c.music&&S.c.autoplay)playMusic(S.c.music);}catch(e){}}

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

function ediDemoProgram(cat){
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
