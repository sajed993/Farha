/* ================= landing ================= */
function navHTML(){return `<div class="nav">
 <div class="logo" onclick="go('land')"><b>${S.lang==='ar'?'فرحة':'Far7a'}</b><small>${t().brandS}</small></div>
 <nav class="menu">
  <a onclick="scrollSec('gallery')" href="javascript:void(0)">${t().navTpl}</a>
  <a onclick="scrollSec('cats')" href="javascript:void(0)">${t().navCats}</a>
  <a onclick="scrollSec('open')" href="javascript:void(0)">${t().navOpen}</a>
  <a class="prem" onclick="scrollSec('ready')" href="javascript:void(0)" style="color:var(--gold2)">✦ ${t().rdNav}</a>
  <a class="prem" onclick="scrollSec('ultra')" href="javascript:void(0)" style="color:var(--gold3)">✦ ${t().uBadge}</a>
  <a class="prem" onclick="scrollSec('premium')" href="javascript:void(0)">${t().navPrem}</a>
  <a class="prem" onclick="scrollSec('sites')" href="javascript:void(0)">${t().navSites}</a>
  <a class="prem" onclick="scrollSec('datef')" href="javascript:void(0)" style="color:var(--acc-grad)">${t().dfKick.split(' ')[0]} ❤️</a>
 </nav>
 <div class="nav-actions">
  <button class="lang-btn" onclick="toggleLang()">${t().langBtn}</button>
  <button class="btn-gold" onclick="openScratch()">${t().navStart}</button>
 </div></div>`;}
/* الطيف — one band per occasion, each showing that film under its own colour.
   The two marked .x only render on screens wide enough to carry five. */
const SPEC_BANDS=[
 {f:'/media/inv/inv-1.mp4',      c:'var(--acc-wed)',  k:'wed',  x:0},
 {f:'/media/inv/bday-cake.mp4',  c:'var(--acc-bday)', k:'bday', x:1},
 {f:'/media/inv/baby-basket.mp4',c:'var(--acc-baby)', k:'baby', x:0},
 {f:'/media/inv/grad.mp4',       c:'var(--acc-grad)', k:'grad', x:1},
 {f:'/media/inv/soon.mp4',       c:'var(--acc-save)', k:'save', x:0}
];
function heroSpectrum(){
 const poster=f=>f.slice(0,-4)+'.jpg';
 return `<div class="spec">${SPEC_BANDS.map(b=>`
  <span class="spec-b ${b.x?'x':''}">
   <video src="${b.f}" poster="${poster(b.f)}" muted loop playsinline preload="none"></video>
   <i style="background:${b.c}"></i><b>${t().rdCats[b.k]}</b>
  </span>`).join('')}</div>
  <div class="spec-veil"></div><div class="hero-grain"></div>`;}

/* Decode only while the hero is on screen. Five clips playing behind a
   scrolled-past hero is what makes a phone run hot. */
function heroSpectrumMount(){
 const h=document.querySelector('.hero');
 if(!h||h.dataset.specMounted)return;
 h.dataset.specMounted='1';
 const vids=[...h.querySelectorAll('.spec-b video')];
 if(!vids.length)return;
 const still=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(still)return;                    /* posters only, nothing decodes */
 const play=v=>{if(v.preload!=='auto')v.preload='auto';v.play().catch(()=>{});};
 if(!('IntersectionObserver' in window)){vids.forEach(play);return;}
 const io=new IntersectionObserver(es=>es.forEach(e=>{
  const v=e.target;
  /* a band hidden at this width has no layout box, so it never starts */
  if(e.isIntersecting&&v.offsetParent!==null)play(v);
  else if(!v.paused)v.pause();}),{threshold:.05});
 vids.forEach(v=>io.observe(v));}
function landView(){
 return navHTML()+`
 <header class="hero">
  ${heroSpectrum()}
  <div class="hero-copy">
   <span class="kicker">${t().badge}</span>
   <h1>${t().h1a}<br><span class="foil">${t().h1b}</span></h1>
   <p class="sub">${t().heroSub}</p>
   <div class="hero-ctas">
    <button class="btn-gold" onclick="openScratch()">${t().ctaDesign}</button>
    <button class="btn-line" onclick="scrollSec('gallery')">${t().ctaExplore}</button>
   </div>
  </div>
 </header>
 ${filmShelfHTML()}
 <section id="cats">
  <div class="sec-head"><span class="kicker">${t().catsKick}</span><h2>${t().catsTitle}</h2></div>
  <div class="cats">
   <div class="cat c-wed" onclick="setFilter('wed');scrollSec('gallery')"><div class="shine"></div>
    <div class="big-emo">💍</div><h3>${t().wed}</h3><p>${t().wedD}</p><button class="go">${t().discover}</button></div>
   <div class="cat c-grad" onclick="setFilter('grad');scrollSec('gallery')"><div class="shine"></div>
    <div class="big-emo">🎓</div><h3>${t().grad}</h3><p>${t().gradD}</p><button class="go">${t().discover}</button></div>
   <div class="cat c-oth" onclick="setFilter('oth');scrollSec('gallery')"><div class="shine"></div>
    <div class="big-emo">🎉</div><h3>${t().oth}</h3><p>${t().othD}</p><button class="go">${t().discover}</button></div>
  </div>
 </section>
 <section id="gallery">
  <div class="sec-head"><span class="kicker">${t().galKick}</span><h2>${t().galTitle}</h2><p>${t().galSub}</p></div>
  <div class="filters">${[['all',t().fAll],['wed',t().fWed],['grad',t().fGrad],['date',t().fDate],['oth',t().fOth],['star',t().fStar]]
   .map(([k,l])=>`<button class="chip ${S.filter===k?'on':''}" onclick="setFilter('${k}',true)">${l}</button>`).join('')}</div>
  <div class="grid">
   <div class="tcard scratchc" onclick="openScratch()"><div class="big">✏️</div>${t().scratch}</div>
   ${DESIGNS.filter(d=>cfgShow(d)&&(S.filter==='all'||d.cat===S.filter||(S.filter==='oth'&&d.cat==='date')||(S.filter==='star'&&d.badge==='star'))).slice().sort((a,b)=>{const w={hot:0,new:1,star:2};return (w[a.badge]??9)-(w[b.badge]??9);}).map(d=>`
    <div class="tcard" onclick="openEditor(${d.id})">${`<button class="tc-cart" onclick="event.stopPropagation();addToCart('${((d.name&&(d.name[S.lang]||d.name.ar))||"دعوة").replace(/'/g,"")}',CFG.price.design)">🛒 ${CFG.price.design}</button>`}
     ${d.badge?`<span class="badge ${d.badge}">${{hot:t().bHot,new:t().bNew,star:t().bStar}[d.badge]}</span>`:''}
     ${inviteHTML(d,{...d.def[S.lang],font:0,pal:0,frame:true})}
     <div class="t-meta"><b>${d.name[S.lang]}</b><span>${d.tag[S.lang]}</span></div>
     <button class="t-cta">${t().customize}</button>
    </div>`).join('')}
  </div>
 </section>
 <section id="ultra">
  <div class="sec-head"><span class="kicker">${t().uKick}</span><h2>${t().uTitle}</h2><p>${t().uSub}</p></div>
  <div class="ultra-grid">${ULTRA.map((u,i)=>`
   <div class="ucard">
    <span class="ubadge">✦ ${t().uBadge}</span>
    <div class="uprev veil u-${u.k}" style="position:relative;z-index:auto" onclick="ultraOpen(${i})">
     <div class="uveil" style="position:absolute;transform:scale(.82)">
      <div class="uenv-wrap" style="pointer-events:none;animation:none">
       <div class="uenv"><div class="ulace">${ulaceHTML(i+2)}</div><div class="usheen"></div></div>
       <div class="uribbon"><i></i><i></i></div>
       <div class="uflap"><div class="ulace" style="opacity:.6">${ulaceHTML(i+7)}</div></div>
       <div class="useal"><b>${u.ini[S.lang]}</b></div>
      </div></div></div>
    <div class="umeta"><b>${['🖤','🤍','🍷'][i]} ${t().uNames[i]}</b><p>${t().uDescs[i]}</p>
     <div class="uacts">
      <button class="ubtn go" onclick="ultraOpen(${i})">${t().uOpen}</button>
      <button class="ubtn ghost" onclick="addToCart(t().uNames[${i}],CFG.price.ultra)">${t().uOrder}</button>
     </div></div>
   </div>`).join('')}</div>
 </section>
 <section id="premium">
  <div class="grainfx"></div>
  <div class="sec-head"><span class="kicker">${t().pmKick}</span><h2>${t().pmTitle}</h2>
   <div class="pm-tag">«${t().pmTag}»</div><p>${t().pmSub}</p>
   <button class="pm-cta" onclick="openPremium(0)">${t().pmCta}</button></div>
  <div class="filters pm-filters">${[['all',t().pmCatAll],['r','🎥 '+t().pmCatR],['i','🪄 '+t().pmCatI]].map(([k,l])=>`<button class="chip ${S.pmFilter===k?'on':''}" onclick="setPmFilter('${k}')">${l}</button>`).join('')}</div>
  <div class="pm-grid">${FILMS.map((_,i)=>i).filter(i=>S.pmFilter==='all'||PM_CAT[i]===S.pmFilter).map(i=>`
   <div class="pcard">
    <div class="pv" onclick="premDemo(${i})">${sceneHTML(i)}<span class="pm-badge">${t().pmBadge}</span><span class="play">▶</span></div>
    <div class="pmeta"><b>${PM_ICO[i]} ${t().pmNames[i]}</b><div class="pd">${t().pmDescs[i]}</div>
     <div class="pchips"><span class="pchip catc">${PM_CAT[i]==='r'?'🎥 '+t().pmCatR:'🪄 '+t().pmCatI}</span><span class="pchip">4K</span><span class="pchip">⏱ ${durStr(i)}</span></div>
     <div class="pbtns"><button class="pbtn-ghost" onclick="premDemo(${i})">${t().pmPreview} ▸</button>
      <button class="pbtn-gold" onclick="openPremium(${i})">${t().pmCustomize}</button></div>
    </div></div>`).join('')}
  </div>

 <div id="aiwrap"><div class="sec-head" style="margin-top:70px"><span class="kicker">${t().aiKick}</span>
   <h2 style="font-size:clamp(1.7rem,4.6vw,2.6rem)">${t().aiTitle}</h2><p>${t().aiSub}</p></div>
  <div class="ai-grid">${aiList().map(f=>{const pal=AIPAL[(f.builtin?f.i:f.i-100)%6];return `
   <div class="aicard">
    <div class="aipost" style="--p1:${pal[0]};--p2:${pal[1]};--p3:${pal[2]}" onclick="aiPlay(${f.i})">
     <span class="aiemoji">${f.ic}</span>
     <span class="aitag ${f.url?'rdy':''}">${f.url?t().aiReady:t().aiSoon}</span>
     <span class="aiplaybtn">▶</span>
    </div>
    <div class="aimeta"><b>${f.ic} ${esc(f.nm)}</b><p>${esc(f.ds)}</p>
     ${f.builtin?`<div class="aiacts">
      <label class="aibtn up">${AIV[f.i]?esc(AIV[f.i].name)+' ✓':t().aiUpload}<input class="hiddenfile" type="file" accept="video/*" onchange="aiUp(event,${f.i})"></label>
      <button class="aibtn" onclick="copyPrompt(${f.i})">${t().aiCopy}</button>
     </div>`:``}
     <button class="aibtn gold" onclick="aiPlay(${f.i})">${t().aiPlayB}</button>
     <button class="aibtn ghost" onclick="addToCart(aiList().find(x=>x.i===${f.i}).nm,CFG.price.ai)">${t().aiOrderB}</button>
    </div>
   </div>`}).join('')}</div></div>
 </section>
 <section id="sites">
  <div class="sec-head"><span class="kicker">${t().stKick}</span><h2>${t().stTitle}</h2>
   <div class="pm-tag">«${t().stTag}»</div><p>${t().stSub}</p></div>
  <div class="occ-row">${t().stOccs.map((o,i)=>`<button class="chip ${S.st.occ===i?'on':''}" onclick="stSet('occ',${i})">${o}</button>`).join('')}</div>
  <div class="studio">
   <div class="style-grid">${t().stStyles.map((s,i)=>((CFG.media&&CFG.media.hideShows)||[]).includes(i)?'':`
    <div class="stylec ${S.st.style===i?'on':''}" onclick="stSet('style',${i})">
     <div class="sprev">${stylePrev(i)}</div><b>${['🎬','📺','📸','🎞️'][i]} ${s}</b><p>${t().stStyleD[i]}</p>
    </div>`).join('')}</div>
   <div class="stud-card">
    <div><span class="st-lab">🖼️ ${t().stPhotos}</span>
     <div class="photo-strip" style="margin-top:8px">
      ${S.st.photos.map((p,i)=>`<span class="ph"><img src="${p}"><button class="rm" onclick="stRmPhoto(${i})">✕</button></span>`).join('')}
      ${S.st.photos.length<8?`<button class="add-ph" onclick="document.getElementById('stf').click()">＋</button>
        <input id="stf" class="hiddenfile" type="file" accept="image/*" multiple onchange="stAddPhotos(event)">`:''}
     </div></div>
    <div><span class="st-lab">✍️ ${t().stNames}</span><input class="st-inp" value="${esc(S.st.names)}" oninput="S.st.names=this.value"></div>
    <div><span class="st-lab">📅 ${t().stDate}</span>
     <label class="st-date">
      <input type="date" value="${esc(S.st.dateISO||'')}" onchange="stSetDate(this.value)">
      <span class="st-date-txt ${S.st.date?'has':''}">${S.st.date?esc(S.st.date):t().stDate}</span>
      <span class="st-date-ic">📅</span>
     </label></div>
    <div><span class="st-lab">🎵 ${t().stMusic}</span>
      <div class="opt-row st-music">${[...t().musics,...(S.st.track?[S.st.track.name]:[])].map((m,mi)=>`<button class="opt ${S.st.music===mi?'on':''}" onclick="stSet('music',${mi})">${['🔇','🎹','🥁','🪕','🎵'][mi]||'🎵'} ${m}</button>`).join('')}</div></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-self:start">
     <label class="upload-lab">🎵 ${t().upTrack}<input class="hiddenfile" type="file" accept="audio/*" onchange="stUpTrack(event)"></label>
     <label class="upload-lab">${t().stUpVid}<input class="hiddenfile" type="file" accept="video/*" onchange="stUpVideo(event)"></label>
     ${S.st.video?`<span style="font-size:.8rem;color:var(--gold3);font-weight:700;align-self:center">${esc(S.st.video.name)} ✓ <button onclick="stRmVideo()" style="color:var(--red);font-weight:700">✕</button></span>`:''}
    </div>
    <div class="big-actions">
     <button class="btn-show" onclick="playShow()">${t().stPreview}</button>
     <button class="btn-ghost" onclick="stOrder()">${t().stOrder}</button>
    </div></div>
  </div>
 </section>
 <section id="datef">
  <div class="sec-head"><span class="kicker">${t().dfKick}</span><h2>${t().dfTitle}</h2><p>${t().dfSub}</p></div>
  <div class="df-cta">
   <button class="btn-df" onclick="playDateFlow()">${t().dfDemo}</button>
   <button class="btn-df ghost" onclick="openEditor(12)">${t().dfUse}</button>
  </div>
 </section>
 <section id="open">
  <div class="sec-head"><span class="kicker">${t().openKick}</span><h2>${t().openTitle}</h2><p>${t().openSub}</p></div>
  <div class="demo-grid">${t().anims.map((a,i)=>`
   <div class="demo" onclick="demoAnim(${i})">
    <div class="ico">${ANIM_ICO[i]}</div>
    <b>${a}</b><p>${t().animD[i]}</p>
    <button class="try">${t().live} ▸</button>
   </div>`).join('')}
  </div>
 </section>
 <footer class="footer">
  <h2>${t().footBig1} <span class="fs foil">${t().footBig2}</span></h2>
  <p>${t().footSub}</p>
  <button class="btn-gold" style="padding:16px 40px;font-size:1.05rem" onclick="openScratch()">${t().ctaDesign}</button>
  <div class="rights">${t().rights} · <a href="legal.html" style="color:rgba(255,249,236,.55)">${t().legalL}</a> · <a href="admin.html" style="color:rgba(255,249,236,.45)">⚙ ${t().adminL}</a></div>
 </footer>`;}

