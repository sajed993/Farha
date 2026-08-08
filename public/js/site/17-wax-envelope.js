/* ================= wax envelope opening =================
   The screen a guest lands on. Five styles share one wax canvas and one
   opening sequence; only the paper around it differs. The dashboard picks
   which is active and can switch any of them off. */

const ENV_STYLES=['classic','full','macro','silk','press'];
/* Fall back to classic when the chosen style has been switched off, so the
   guest never lands on a blank screen. */
function envStyleActive(){
 const C=(typeof CFG!=='undefined'&&CFG)||{};
 /* a URL override wins (dashboard preview), then the film's own choice,
    then whatever the site default is */
 let q='';try{q=new URLSearchParams(location.search).get('envStyle')||'';}catch(e){}
 const want=(ENV_STYLES.indexOf(q)>=0&&q)
   ||(S.c&&S.c.envStyle&&ENV_STYLES.indexOf(S.c.envStyle)>=0&&S.c.envStyle)
   ||C.envStyle||'classic';
 if(ENV_STYLES.indexOf(want)<0)return 'classic';
 if(C.env&&C.env[want]===0)return 'classic';
 return want;}

/* foil hairlines traced along the folds of the full-bleed envelope */
const ENV_EDGE='<svg class="es-edge" viewBox="0 0 100 213" preserveAspectRatio="none" aria-hidden="true">'
 +'<defs><linearGradient id="esfa" x1="0" y1="0" x2="1" y2="1">'
 +'<stop offset="0" stop-color="var(--gold-lo)"/><stop offset=".18" stop-color="var(--gold-hi)"/>'
 +'<stop offset=".36" stop-color="var(--gold)"/><stop offset=".54" stop-color="var(--gold-hi)"/>'
 +'<stop offset=".72" stop-color="var(--gold-lo)"/><stop offset=".88" stop-color="var(--gold-hi)"/>'
 +'<stop offset="1" stop-color="var(--gold-lo)"/></linearGradient></defs>'
 +'<g fill="none" stroke="url(#esfa)" vector-effect="non-scaling-stroke" stroke-width="2">'
 +'<path d="M-2 0 L50 115 L102 0"/><path d="M-1 0 L52 111"/>'
 +'<path d="M101 0 L48 111"/><path d="M-1 213 L50 118 L101 213"/></g></svg>';
const ENV_FLAPFOIL='<svg class="es-flapfoil" viewBox="0 0 100 213" preserveAspectRatio="none" aria-hidden="true">'
 +'<defs><linearGradient id="esfc" x1="0" y1="0" x2="1" y2=".4">'
 +'<stop offset="0" stop-color="var(--gold-lo)"/><stop offset=".22" stop-color="var(--gold-hi)"/>'
 +'<stop offset=".48" stop-color="var(--gold)"/><stop offset=".72" stop-color="var(--gold-hi)"/>'
 +'<stop offset="1" stop-color="var(--gold-lo)"/></linearGradient></defs>'
 +'<path d="M-2 63 L50 98 L102 63" fill="none" stroke="url(#esfc)" '
 +'vector-effect="non-scaling-stroke" stroke-width="2.2"/></svg>';

/* Shift a hex toward white or black — used to build the wax's relief from the
   single --wax colour the palette gives us. */
function envShade(hex,amt){
 const h=String(hex||'').trim().replace('#','');
 if(h.length<6)return '#2A2622';
 const n=parseInt(h.slice(0,6),16);
 let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
 const t=amt>0?255:0,k=Math.abs(amt);
 r=Math.round(r+(t-r)*k);g=Math.round(g+(t-g)*k);b=Math.round(b+(t-b)*k);
 return '#'+[r,g,b].map(v=>('0'+v.toString(16)).slice(-2)).join('');}

/* Wax pressed with the couple's initials, in the film's own colour. */
function envWax(cv,initials){
 const ctx=cv.getContext('2d');if(!ctx)return null;
 let done=false,strokes=0;
 const waxOf=()=>{
  const v=getComputedStyle(cv).getPropertyValue('--wax').trim();
  return v||'#2A2622';};

 function paint(){
  const r=cv.getBoundingClientRect();
  cv.width=Math.max(140,Math.round(r.width*2));
  cv.height=Math.max(140,Math.round(r.height*2));
  const w=cv.width,h=cv.height,cx=w/2,cy=h/2,rr=Math.min(w,h)*.46;
  ctx.clearRect(0,0,w,h);

  /* the blob: a circle pushed out of true, the way poured wax spreads */
  ctx.beginPath();
  const n=34;
  for(let i=0;i<=n;i++){const a=i/n*Math.PI*2;
   const rad=rr*(.9+.08*Math.sin(a*5+.6)+.045*Math.cos(a*3-1.2)+.02*Math.sin(a*8));
   const x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad;
   i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.closePath();
  const base=waxOf();
  const g=ctx.createRadialGradient(w*.38,h*.32,w*.03,cx,cy,rr*1.2);
  g.addColorStop(0,envShade(base,.34));g.addColorStop(.3,envShade(base,.06));
  g.addColorStop(.72,envShade(base,-.28));g.addColorStop(1,envShade(base,-.52));
  ctx.fillStyle=g;ctx.fill();

  /* pressed relief — light catches the upper rim, the lower edge sits in shadow */
  ctx.save();ctx.clip();
  ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=w*.02;
  ctx.beginPath();ctx.arc(cx,cy-rr*.06,rr*.98,Math.PI*1.05,Math.PI*1.95);ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=w*.03;
  ctx.beginPath();ctx.arc(cx,cy+rr*.04,rr*.97,Math.PI*.08,Math.PI*.92);ctx.stroke();
  ctx.restore();

  /* the die: a stamped ring and the initials, debossed */
  ctx.strokeStyle='rgba(255,255,255,.13)';ctx.lineWidth=w*.011;
  ctx.beginPath();ctx.arc(cx,cy,rr*.74,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=w*.013;
  ctx.beginPath();ctx.arc(cx,cy,rr*.69,0,Math.PI*2);ctx.stroke();

  const fs=Math.round(w*.23);
  ctx.font='700 '+fs+'px '+(S.lang==='ar'?'"Aref Ruqaa",serif':'"Cormorant Garamond",serif');
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='rgba(0,0,0,.5)';
  ctx.fillText(initials||'✦',cx,cy+w*.018);
  ctx.fillStyle='rgba(255,255,255,.15)';
  ctx.fillText(initials||'✦',cx,cy+w*.004);}

 const at=e=>{const r=cv.getBoundingClientRect();
  const p=(e.touches&&e.touches[0])||e;
  return [(p.clientX-r.left)/r.width*cv.width,(p.clientY-r.top)/r.height*cv.height];};

 /* Crumble the wax where the finger goes; a tap alone is enough to open. */
 const rub=e=>{
  if(done)return;
  if(e.cancelable)e.preventDefault();
  const c=at(e);
  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath();ctx.arc(c[0],c[1],cv.width*.16,0,Math.PI*2);ctx.fill();
  ctx.globalCompositeOperation='source-over';
  if(++strokes>=8)cv.__open();};

 let rubbing=false;
 cv.addEventListener('pointerdown',e=>{rubbing=true;rub(e);});
 cv.addEventListener('pointermove',e=>{if(rubbing)rub(e);});
 window.addEventListener('pointerup',()=>{rubbing=false;});
 cv.addEventListener('touchstart',e=>{rubbing=true;rub(e);},{passive:false});
 cv.addEventListener('touchmove',e=>{if(rubbing)rub(e);},{passive:false});
 cv.addEventListener('touchend',()=>{rubbing=false;});
 cv.addEventListener('click',()=>{if(!done)cv.__open();});

 paint();
 window.addEventListener('resize',paint);
 return ()=>{done=true;};}

/* Markup per style. Each returns the paper; the wax canvas is added by the
   mounter so the crumble interaction stays identical across all five. */
function envBody(style,c){
 const nm=esc(c.n), kick=esc(c.t);
 const NAMES=`<p class="es-nm">${nm}<small>${kick}</small></p>`;
 if(style==='full')return `
   <span class="es-pl"></span><span class="es-pr"></span>
   <span class="es-fshade"></span><span class="es-flap"></span>
   ${ENV_EDGE}<span class="es-rule"></span>${NAMES}`;
 if(style==='macro')return `
   <span class="es-diag"><i></i></span><span class="es-dof"></span>${NAMES}`;
 if(style==='silk')return `
   <span class="es-weave"></span><span class="es-sheen"></span>
   <span class="es-card"><b>${nm}</b><span>${kick}</span></span>
   <span class="es-pocket"><i></i></span>
   <span class="es-flap"></span>${ENV_FLAPFOIL}`;
 if(style==='press')return `
   <span class="es-deboss"><span>${esc(inInitials(c.n).join(' '))}</span></span>
   <span class="es-ring"></span><span class="es-rule"></span>${NAMES}`;
 /* classic */
 return `
   <div class="wenv-lin"></div>
   <span class="wenv-f l"></span><span class="wenv-f r"></span><span class="wenv-f b"></span>
   <svg class="wenv-seams" viewBox="0 0 100 72" preserveAspectRatio="none" aria-hidden="true">
    <g fill="none" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="1">
     <path d="M0 0 L50 37"/><path d="M100 0 L50 37"/>
     <path d="M0 72 L50 37"/><path d="M100 72 L50 37"/>
    </g></svg>
   <div class="wenv-note"><span>${kick}</span><b>${nm}</b></div>
   <span class="wenv-f t"></span>`;}

/* Mount the envelope. `after` runs once the flap has finished opening. */
function waxEnvelope(host,after){
 const c=S.c,ini=inInitials(c.n).join('');
 const style=envStyleActive();
 const full=style!=='classic';
 host.innerHTML=`<div class="wenv es-${style} ${full?'es-bleed':''}" id="wenv">
   <div class="wenv-grain"></div>
   ${full?'<div class="es-fib"></div><div class="es-rake"></div><div class="es-vig"></div>':''}
   <button class="wenv-x" onclick="closeVeil()">${t().closePrev}</button>
   <div class="wenv-stack">
    <p class="wenv-to">${c.guest?esc(t().helloGuest)+' '+esc(c.guest):esc(t().helloAll)}</p>
    <div class="wenv-env" id="wenvEnv">
     ${envBody(style,c)}
     <canvas class="wenv-wax" id="wenvWax"></canvas>
    </div>
    <p class="wenv-hint" id="wenvHint">${t().uSealHint}</p>
   </div>
  </div>`;

 const env=host.querySelector('#wenvEnv');
 const cv=host.querySelector('#wenvWax');
 const hint=host.querySelector('#wenvHint');
 let opened=false;

 cv.__open=function(){
  if(opened)return;opened=true;
  if(hint)hint.style.opacity='0';
  cv.style.transition='opacity .55s ease,transform .55s ease';
  cv.style.opacity='0';cv.style.transform='scale(.82) translateY(6%)';
  env.classList.add('cracked');
  /* The opening used to run two and a half seconds before the invitation was
     handed over, and the envelope was already gone at 1.9s — six hundred
     milliseconds of nothing at the end. Measured from the seal, the first
     note landed at 2.6s and the song did not reach full volume until 4s,
     which is why it felt like the music arrived late rather than with the
     opening. The beats are the same, closer together, and the invitation
     arrives as the envelope clears rather than a beat afterwards. */
  setTimeout(()=>env.classList.add('open'),280);      /* flap folds back */
  setTimeout(()=>env.classList.add('lift'),700);      /* note rises out */
  setTimeout(()=>{const w=host.querySelector('#wenv');
   if(w){w.classList.add('gone');}},1180);
  setTimeout(()=>{if(after)after();},1280);};

 envWax(cv,ini);}
;
