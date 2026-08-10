/* ================= landing ================= */
/* ================= lazy film plates =================
   Safari keeps a small, shared pool of video decoders and a <video> element
   holds a slot even while paused. The landing page was building fifteen of
   them up front, which is why iPhones crawled. It also explains the black
   rectangles: with preload="none" Safari often will not paint the poster
   attribute at all, so the black screen behind it showed through.

   So no <video> exists until it is needed. Every plate starts as a plain
   <img>, which paints immediately and costs nothing, and is upgraded to a
   real video only while it is on screen — then torn back down, returning the
   decoder. */
/* Two, not five. Five was chosen to bound the number of live decoders, but
   each one also downloads a whole film — measured, the landing page shipped
   6.88MB before a visitor had touched anything, 5.87MB of it video. */
const LAZYV_MAX = 2;
const lazyvLive = [];

function lazyvPoster(src){ return src.slice(0, -4) + '.jpg'; }

/* <img> stand-in. data-v carries the clip it will become. */
function lazyvHTML(src, cls){
 return '<img class="lazyv ' + (cls || '') + '" src="' + lazyvPoster(src) +
        '" data-v="' + src + '" alt="" decoding="async" loading="lazy">';
}

function lazyvDown(host){
 const v = host.__lv;
 if (!v) return;
 try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {}
 v.remove();
 host.__lv = null;
 const img = host.querySelector('.lazyv');
 if (img) img.style.opacity = '';
 const i = lazyvLive.indexOf(host);
 if (i > -1) lazyvLive.splice(i, 1);
}

function lazyvUp(host){
 if (host.__lv) return;
 const img = host.querySelector('.lazyv');
 if (!img) return;
 const src = img.dataset.v;
 if (!src) return;
 /* free the oldest decoder before taking another */
 while (lazyvLive.length >= LAZYV_MAX) lazyvDown(lazyvLive[0]);
 const v = document.createElement('video');
 v.muted = true; v.loop = true; v.playsInline = true;
 v.setAttribute('playsinline', '');
 v.setAttribute('webkit-playsinline', '');
 v.preload = 'auto';
 v.className = 'lazyv-v';
 v.poster = img.currentSrc || img.src;
 v.src = src;
 /* the poster stays put until a frame is actually on screen, so there is
    never a gap where the black backing shows */
 v.addEventListener('playing', function(){ img.style.opacity = '0'; }, { once: true });
 host.insertBefore(v, img.nextSibling);
 host.__lv = v;
 lazyvLive.push(host);
 const go = v.play();
 if (go && go.catch) go.catch(function(){});
}

/* Hand every decoder back at once — used when a full-screen veil takes over. */
function lazyvReleaseAll(){ while (lazyvLive.length) lazyvDown(lazyvLive[0]); }

/* Watch a set of hosts and keep only the visible ones upgraded. */
function lazyvWatch(hosts, max){
 if (!hosts.length) return;
 const still = window.matchMedia &&
   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const c = navigator.connection || {};
 const saver = c.saveData;
 /* a film is a poster's worth of story and a hundred times its weight; on a
    2G handset it is not worth the wait */
 const slow = /(^|-)2g$/.test(c.effectiveType || '');
 if (still || saver || slow) return;    /* posters only */
 if (max === 0) return;                 /* the caller says posters too */
 if (!('IntersectionObserver' in window)) { hosts.slice(0, 1).forEach(lazyvUp); return; }
 const io = new IntersectionObserver(function(es){
  es.forEach(function(e){
   const h = e.target;
   if (e.isIntersecting && h.offsetParent !== null) lazyvUp(h);
   else lazyvDown(h);
  });
 /* .55, not .25 — a card a quarter on screen is one the visitor is scrolling
    past, and it was costing a whole film to glance at */
 }, { threshold: .55 });
 hosts.forEach(function(h){ io.observe(h); });
}

function navHTML(){return `<div class="nav">
 <div class="logo" onclick="go('land')"><b>${S.lang==='ar'?'فرحة':'Far7a'}</b><small>${t().brandS}</small></div>
 <!-- Five of these pointed at sections deleted with the old designs —
      القوالب, المناسبات, لحظة الفتح, واقعي جدًا, بريميوم. They stayed visible
      and scrolled to nothing. Only what exists is listed. -->
 <nav class="menu">
  <a class="prem" onclick="scrollSec('ready')" href="javascript:void(0)" style="color:var(--gold2)">✦ ${t().rdNav}</a>
  <a class="prem" onclick="scrollSec('offers')" href="javascript:void(0)">${t().off.rName}</a>
  <a class="prem" onclick="scrollSec('sites')" href="javascript:void(0)">${t().navSites}</a>
  <a class="prem" onclick="scrollSec('datef')" href="javascript:void(0)" style="color:var(--acc-grad)">${t().dfKick.split(' ')[0]} ❤️</a>
 </nav>
 <div class="nav-actions">
  <button class="theme-btn" onclick="toggleTheme()" type="button"
   aria-pressed="${currentTheme()==='dark'?'true':'false'}"
   aria-label="${currentTheme()==='dark'?t().themeToLight:t().themeToDark}"
   title="${currentTheme()==='dark'?t().themeToLight:t().themeToDark}">
   <svg class="th-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
    fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
    <circle cx="12" cy="12" r="4.2"/>
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"/>
   </svg>
   <svg class="th-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
    fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">
    <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z"/>
   </svg>
  </button>
  <button class="lang-btn" onclick="toggleLang()">${t().langBtn}</button>
 </div></div>`;}
/* الطيف — one band per occasion. The films used to be named here by
   filename, which meant adding an invitation left the hero showing the old
   five and hiding one left the hero still playing it. The bands are drawn from
   the shelf now: the first visible film of each occasion, in category order. */
const SPEC_TINT={wed:'var(--acc-wed)',henna:'var(--acc-bday)',bday:'var(--acc-bday)',
 baby:'var(--acc-baby)',grad:'var(--acc-grad)',save:'var(--acc-save)'};
function specBands(){
 let films=[];
 try{films=readyShown();}catch(e){}
 if(!films.length)return [];
 const seen={},out=[];
 RD_CATS.forEach(k=>{
  if(k==='all')return;
  const f=films.find(x=>x.cat===k&&!seen[x.id]);
  if(f){seen[f.id]=1;out.push({f:f.v,c:SPEC_TINT[k]||'var(--acc-wed)',k:k});}
 });
 /* if the shelf holds fewer occasions than bands, fill from whatever is left
    so the hero is never half empty */
 for(let i=0;out.length<5&&i<films.length;i++){
  const f=films[i];
  if(!seen[f.id]){seen[f.id]=1;out.push({f:f.v,c:SPEC_TINT[f.cat]||'var(--acc-wed)',k:f.cat});}
 }
 return out.slice(0,5);}
function heroSpectrum(){
 const bands=specBands();
 if(!bands.length)return '';
 return `<div class="spec" style="grid-template-columns:repeat(${bands.length},1fr)">${bands.map(b=>`
  <span class="spec-b">
   ${lazyvHTML(b.f)}
   <i style="background:${b.c}"></i><b>${t().rdCats[b.k]}</b>
  </span>`).join('')}</div>
  <div class="spec-veil"></div><div class="hero-grain"></div>`;}

/* The hero is five vertical bands of film behind the title — a texture, not
   the product. All five were on screen at once, so all five downloaded: about
   ten megabytes for a background, before the visitor had chosen anything.

   On a phone each band is roughly seventy pixels wide, where motion is not
   readable and a still frame of the same film is indistinguishable. So the
   hero is posters on phones, and two of the five move on a screen wide enough
   for it to be worth anything. The shelf below is where the films are the
   point, and there they still play. */
function heroSpectrumMount(){
 const h=document.querySelector('.hero');
 if(!h||h.dataset.specMounted)return;
 h.dataset.specMounted='1';
 const wide = window.innerWidth >= 900;
 lazyvWatch([...h.querySelectorAll('.spec-b')], wide ? 2 : 0);}
function landView(){
 return navHTML()+`
 <header class="hero">
  ${heroSpectrum()}
  <div class="hero-copy">
   <span class="kicker">${t().badge}</span>
   <h1>${t().h1a}<br><span class="foil">${t().h1b}</span></h1>
   <p class="sub">${t().heroSub}</p>
   <div class="hero-ctas">
    <button class="${CFG.sec.design?'btn-line':'btn-gold'}"
     onclick="scrollSec('${CFG.sec.gallery?'gallery':'ready'}')">${
      CFG.sec.gallery?t().ctaExplore:t().rdNav}</button>
   </div>
  </div>
 </header>
 ${filmShelfHTML()}
 ${CFG.sec.offers?offersHTML():''}
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
  </div>
 </section>
 <footer class="footer">
  <h2>${t().footBig1} <span class="fs foil">${t().footBig2}</span></h2>
  <p>${t().footSub}</p>
  <div class="rights">${t().rights} · <a href="legal.html" style="color:rgba(255,249,236,.55)">${t().legalL}</a> · <a href="admin.html" style="color:rgba(255,249,236,.45)">⚙ ${t().adminL}</a></div>
 </footer>`;}

