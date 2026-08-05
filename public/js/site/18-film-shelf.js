/* ================= ready-made invitations =================
   The three finished films, each playing inside an iPhone frame with its own
   footage bleeding out behind it as a blurred backdrop. Tapping one opens the
   full scrolling invitation with that film as its plates. */

const FILMS_READY=[
 {id:'marble',v:'/media/inv/inv-1.mp4',p:'/media/inv/inv-1.jpg',design:2,
  name:{ar:'قصر الرخام',fr:'Palais de Marbre',en:'Marble Palace'},
  blurb:{ar:'سلالم رخامية وأكاليل ورد باهت الوردة، وأعمدة تصعد نحو النور',
   fr:'Un escalier de marbre, des guirlandes de roses poudrées et des colonnes qui montent vers la lumière',
   en:'A marble staircase, garlands of powder-rose blooms and columns rising into the light'},
  pal:'warm'},
 {id:'oneday',v:'/media/inv/inv-2.mp4',p:'/media/inv/inv-2.jpg',design:3,
  name:{ar:'يومًا ما',fr:'One Day',en:'One Day'},
  blurb:{ar:'أبيض وأسود: كعبٌ وشمبانيا وعلبة خواتم على التول… ووعدٌ مكتوب بخفة',
   fr:'Noir et blanc : escarpins, champagne et un écrin sur le tulle… une promesse écrite tout en légèreté',
   en:'Black and white: heels, champagne and a ring box on tulle… a promise written lightly'},
  pal:'mono'},
 {id:'rings',v:'/media/inv/inv-3.mp4',p:'/media/inv/inv-3.jpg',design:1,
  name:{ar:'خواتم النور',fr:'Anneaux de Lumière',en:'Rings of Light'},
  blurb:{ar:'خاتمان على أرضٍ كالمرآة، ونافذةٌ مقوّسة يعبرها ظلُّ العروس',
   fr:'Deux anneaux sur un sol-miroir et une fenêtre en arche que traverse l\'ombre de la mariée',
   en:'Two rings on a mirrored floor, and an arched window the bride\'s silhouette passes through'},
  pal:'cool'}];

function readyFilm(id){return FILMS_READY.find(f=>f.id===id)||FILMS_READY[0];}

/* An iPhone: titanium rail, Dynamic Island, side buttons, a little screen glare. */
function iphoneHTML(inner,cls){
 return `<div class="iph ${cls||''}">
   <span class="iph-btn vol1"></span><span class="iph-btn vol2"></span>
   <span class="iph-btn vol3"></span><span class="iph-btn pwr"></span>
   <div class="iph-scr">${inner}<span class="iph-isl"></span><span class="iph-glare"></span></div>
  </div>`;}

function filmShelfHTML(){
 return `<section id="ready">
  <div class="sec-head"><span class="kicker">${t().rdKick}</span>
   <h2>${t().rdTitle}</h2><p>${t().rdSub}</p></div>
  <div class="rd-grid">${FILMS_READY.map(f=>`
   <article class="rd-card">
    <div class="rd-stage" onclick="openReady('${f.id}')">
     <div class="rd-bleed" style="background-image:url('${f.p}')"></div>
     <div class="rd-glow"></div>
     ${iphoneHTML(`<video class="rd-v" src="${f.v}" poster="${f.p}"
        muted loop playsinline preload="metadata" autoplay></video>`)}
     <span class="rd-play">▶</span>
    </div>
    <div class="rd-meta">
     <b>${f.name[S.lang]}</b>
     <p>${f.blurb[S.lang]}</p>
     <div class="rd-acts">
      <button class="rd-btn gold" onclick="openReady('${f.id}')">${t().rdOpen}</button>
      <button class="rd-btn ghost" onclick="addToCart('${f.name[S.lang].replace(/'/g,'')}',CFG.price.ultra)">${t().rdOrder}</button>
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
  when:when.toISOString().slice(0,16),program:ediDemoProgram(),
  film:f.id,films:{hero:f.v,hall:f.v,detail:f.v,venue:f.p},ediPal:f.pal};
 editorialOpen();}
;
