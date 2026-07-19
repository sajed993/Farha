/* ================= cinematic ceremony ================= */
let veil=null,demoBackup=null,cdTimer=null;
function cineShell(inner){
 return `<div class="cine-fx"><div class="rays"></div><div class="spot"></div><div class="vign"></div></div>
  <div class="lbx t"></div><div class="lbx b"></div>
  <button class="close-x" onclick="closeVeil()">${t().closePrev}</button>
  <div class="flash" id="flash"></div>${inner}`;}
function ceremony(intro){
 closeVeil(true);
 veil=document.createElement('div');veil.className='veil';
 document.body.appendChild(veil);document.body.style.overflow='hidden';
 for(let i=0;i<22;i++){const d=document.createElement('span');d.className='dust';
  const s=(2+Math.random()*3.5).toFixed(1);
  d.style.cssText=`position:fixed;left:${Math.random()*100}%;width:${s}px;height:${s}px;--dx:${(Math.random()*70-35).toFixed(0)}px;
   animation:rise ${(8+Math.random()*8).toFixed(1)}s linear ${(-Math.random()*8).toFixed(1)}s infinite;z-index:2`;
  veil.appendChild(d);}
 if(intro){
  const box=document.createElement('div');box.className='cstage';
  box.innerHTML=`<div class="recv"><div class="recv-emo">💌</div>
   <p style="font-size:1.3rem;color:var(--champ);margin-bottom:2px;font-weight:700">${S.c.guest?`${t().helloGuest} ${esc(S.c.guest)} 💛`:`${t().helloAll} 💛`}</p>
   <h2>${t().received}</h2>
   <p>${t().fromWho} <b style="color:var(--champ)">${esc(S.c.n)}</b></p>
   <button class="btn-hero" onclick="startGuestFlow()">${t().openIt}</button></div>`;
  veil.insertAdjacentHTML('afterbegin',cineShell(''));
  veil.appendChild(box);
 } else {veil.insertAdjacentHTML('afterbegin',cineShell(''));mountCeremony();}
}
let storyT=null;
function startGuestFlow(){
 if(S.c.memVid){playMemVid();return;}
 if(S.c.story&&S.c.story.length)playStory(0);else mountCeremony();}
function playMemVid(){
 let stage=veil.querySelector('.cstage');
 if(!stage){stage=document.createElement('div');stage.className='cstage';veil.appendChild(stage);}
 stage.innerHTML=`<div class="memvid"><video id="mv" src="${S.c.memVid.url}" playsinline autoplay ${S.c.autoplay?'':''}></video></div>
   <button class="s-skip film-skip" onclick="afterMemVid()">${t().storySkip}</button>
   <div class="hint" style="position:fixed;bottom:11vh;z-index:60;left:0;right:0">${t().videoHint}</div>`;
 const v=document.getElementById('mv');
 if(v){v.onended=()=>afterMemVid();
  v.play().catch(()=>{v.muted=true;v.play().catch(()=>{});});}
 filmT.push(setTimeout(()=>{if(veil&&veil.querySelector('#mv'))afterMemVid();},32000));}
function afterMemVid(){clearFilm();
 const v=veil&&veil.querySelector('#mv');if(v){try{v.pause()}catch(e){}}
 if(S.c.story&&S.c.story.length)playStory(0);else mountCeremony();}
function playStory(i){
 if(!veil)return;
 let stage=veil.querySelector('.cstage');
 if(!stage){stage=document.createElement('div');stage.className='cstage';veil.appendChild(stage);}
 if(i>=S.c.story.length){stage.onclick=null;mountCeremony();return;}
 const s=S.c.story[i];
 stage.innerHTML=`<div class="story-slide">
   ${s.ph?`<div class="s-ph" style="background-image:url('${s.ph}')"></div>`:''}
   <p class="s-txt">${esc(s.t)}</p>
   <div class="s-dots">${S.c.story.map((_,d)=>`<i class="${d===i?'on':''}"></i>`).join('')}</div>
  </div><button class="s-skip" onclick="event.stopPropagation();skipStory()">${t().storySkip}</button>`;
 stage.onclick=()=>{clearTimeout(storyT);playStory(i+1);};
 clearTimeout(storyT);storyT=setTimeout(()=>playStory(i+1),3800);}
function skipStory(){clearTimeout(storyT);
 const stage=veil&&veil.querySelector('.cstage');if(stage)stage.onclick=null;
 mountCeremony();}
function mountVideoOpen(ix){
 const v=((CFG.media&&CFG.media.vopens)||[])[ix];
 if(!veil||!v||!v.url){reveal();return;}
 veil.innerHTML=`<div class="cstage"><div class="vopen">
   <video id="vopenV" src="${v.url}" playsinline preload="auto"></video>
   <button class="pm-enter" id="vopenGo">${t().openIt}</button></div></div>
  <button class="close-x" onclick="closeVeil()">${t().closePrev}</button>`;
 const stage=veil.querySelector('.cstage');
 stage.querySelector('#vopenGo').onclick=function(){this.style.display='none';
  const vd=stage.querySelector('#vopenV');if(!vd){reveal();return;}
  vd.style.opacity=1;
  vd.onended=()=>reveal();vd.onerror=()=>reveal();
  vd.play().catch(()=>{vd.muted=true;vd.play().catch(()=>reveal());});
  filmT.push(setTimeout(()=>{if(vd.paused&&vd.readyState<2)reveal();},2500));};}
function mountCeremony(){cerMusicOn=false;
 if(typeof S.c.anim==='string'&&S.c.anim.charAt(0)==='v'){mountVideoOpen(parseInt(S.c.anim.slice(1))||0);return;}
 clearTimeout(storyT);
 const dz=getDesign(),inv=inviteHTML(dz,S.c),a=S.c.anim;
 const stg=veil&&veil.querySelector('.cstage');if(stg)stg.onclick=null;
 let stage=veil.querySelector('.cstage');
 if(!stage){stage=document.createElement('div');stage.className='cstage';veil.appendChild(stage);}
 if(a>=100){mountPremium(a-100,stage);return;}
 const hint=`<div class="hint">${t().hints[a]}</div>`;
 if(a===0){ /* royal envelope */
  stage.innerHTML=`<div class="env-wrap"><div class="envelope" id="env">
    <div class="env-back"></div><div class="env-card">${inv}</div><div class="env-front"></div>
    <div class="env-flap"></div>
    <div class="seal"><span class="half h1">❦</span><span class="half h2">❦</span></div>
   </div></div>${hint}`;
  stage.querySelector('#env').onclick=function(){if(this.classList.contains('open'))return;
   ceremonyMusic();this.classList.add('open');setTimeout(()=>reveal(),1450);};
 }else if(a===1){ /* wax seal shatter */
  stage.innerHTML=`<div class="sealstage" id="sst"><div class="parch"></div>
    <div class="bigseal"><span class="shard sh1">❦</span><span class="shard sh2">❦</span><span class="shard sh3">❦</span><span class="shard sh4">❦</span></div>
   </div>${hint}`;
  stage.querySelector('#sst').onclick=function(){if(this.classList.contains('open'))return;
   ceremonyMusic();this.classList.add('open');const f=veil.querySelector('#flash');if(f)f.classList.add('go');
   setTimeout(()=>reveal(),1050);};
 }else if(a===2){ /* silk ribbon + book fold */
  stage.innerHTML=`<div class="ribstage" id="rib">${inv}
    <div class="fold l"></div><div class="fold r"></div>
    <div class="riband h"></div><div class="riband v"></div><div class="ribbow">🎀</div>
   </div>${hint}`;
  stage.querySelector('#rib').onclick=function(){if(this.classList.contains('open'))return;
   ceremonyMusic();this.classList.add('open');setTimeout(()=>reveal(true),1750);};
 }else if(a===3){ /* royal curtains */
  stage.innerHTML=`<div class="big-card" id="bigc" style="opacity:0">${inv}</div>
   <div class="curt l"><span class="tassel">🪢</span></div><div class="curt r"><span class="tassel">🪢</span></div>
   <div class="hint" style="position:fixed;bottom:11vh;z-index:45;left:0;right:0">${t().hints[3]}</div>`;
  veil.onclick=e=>{if(e.target.closest('.curt')){veil.onclick=null;reveal();}};
 }else if(a===5){ /* butterfly garden */
  const gfl=['🌷','🌸','🌼','🌺','🌻','🌷','🌸','🌼'];
  let gf='';for(let i=0;i<8;i++)gf+=`<span class="gf" style="left:${4+i*12+Math.random()*4}%;font-size:${(2+Math.random()*1.4).toFixed(1)}rem;animation-delay:${(0.15+i*0.16).toFixed(2)}s">${gfl[i]}</span>`;
  let bf='';for(let i=0;i<3;i++)bf+=`<span class="bfly" style="--fd:${(8+i*2.5).toFixed(1)}s;animation-delay:${(-i*3.1).toFixed(1)}s;font-size:${(1.5+i*.35).toFixed(2)}rem">🦋</span>`;
  stage.innerHTML=`<div class="big-card" id="bigc" style="opacity:0;transition:opacity 1s .55s">${inv}</div>
   <div class="garden" id="garden">${gf}${bf}<span class="bigbfly" id="bigb">🦋</span></div>
   <div class="hint" style="position:fixed;bottom:11vh;z-index:45;left:0;right:0">${t().hints[5]}</div>`;
  for(let i=0;i<6;i++)spawnPetal(veil,true);
  stage.querySelector('#garden').onclick=function(){if(this.classList.contains('open'))return;
   ceremonyMusic();this.classList.add('open');reveal();};
 }else if(a===6){ /* blooming flowers */
  veil.classList.add('daylight');
  const rfl=['🌸','🌺','🌼','🌷','💮','🌸','🌺','🌼'];
  let rf='';for(let i=0;i<8;i++){const ang=i*45;
   rf+=`<span class="rf" style="--ang:${ang}deg;--del:${(0.9+i*0.14).toFixed(2)}s;--ox:${(Math.cos(ang*Math.PI/180)*62).toFixed(0)}vmax;--oy:${(Math.sin(ang*Math.PI/180)*62).toFixed(0)}vmax">${rfl[i]}</span>`;}
  stage.innerHTML=`<div class="big-card" id="bigc" style="opacity:0;transition:opacity 1s .5s">${inv}</div>
   <div class="bloomwrap" id="bloom">${rf}<span class="cflower">🌸</span></div>
   <div class="hint" style="position:fixed;bottom:11vh;z-index:45;left:0;right:0">${t().hints[6]}</div>`;
  stage.querySelector('#bloom').onclick=function(){if(this.classList.contains('open'))return;
   ceremonyMusic();this.classList.add('open');reveal();};
 }else if(a===7){ /* golden gift box */
  stage.innerHTML=`<div class="giftwrap" id="gift"><div class="gbox">
    <div class="beam"></div><div class="gbody"></div><div class="glid"></div>
    <div class="grib v"></div><div class="grib h"></div><span class="gbow">🎀</span></div></div>
   <div class="big-card" id="bigc" style="opacity:0;transition:opacity 1s 1s;position:absolute">${inv}</div>
   ${hint}`;
  stage.querySelector('#gift').onclick=function(){if(this.classList.contains('open'))return;
   ceremonyMusic();this.classList.add('open');
   const box=this.querySelector('.gbox'),ems=['🌹','✨','🌸','💛','✨','🌹','✨'];
   ems.forEach((e,i)=>{const sp=document.createElement('span');sp.className='risef';sp.textContent=e;
    sp.style.cssText=`--rx:${(Math.random()*160-80).toFixed(0)}px;--rr:${(Math.random()*260-130).toFixed(0)}deg;animation-delay:${(0.9+i*0.16).toFixed(2)}s;font-size:${(1.3+Math.random()*1).toFixed(2)}rem`;
    box.appendChild(sp);});
   setTimeout(()=>{this.style.transition='1s';this.style.opacity=0;this.style.transform='translateY(60px) scale(.85)';},2100);
   reveal();};
 }else if(a===8){ /* heart bloom — first date */
  veil.classList.add('blush');
  let hh='';for(let i=0;i<14;i++)hh+=`<span class="hs-heart" style="left:${5+Math.random()*90}%;--hd:${(5+Math.random()*4).toFixed(1)}s;--hx:${(Math.random()*10-5).toFixed(1)}vw;animation-delay:${(-Math.random()*7).toFixed(1)}s;font-size:${(1.6+Math.random()*2).toFixed(1)}vmin">${['💗','🤍','💕','❤️','🩷'][i%5]}</span>`;
  stage.innerHTML=`<div class="big-card" id="bigc" style="opacity:0;transition:opacity 1s .5s">${inv}</div>
   <div class="heartstage" id="hstage">${hh}
    <div class="hs-cups"><span class="cup cl">☕</span><span class="cup cr">☕</span></div>
    <span class="hs-bigheart" id="hbig">❤️</span>
    <div class="hs-word">${S.lang==='ar'?'هل تقبلين؟':S.lang==='fr'?'Tu viens ?':'Will you?'}</div>
   </div>
   <div class="hint" style="position:fixed;bottom:11vh;z-index:45;left:0;right:0">${t().hints[8]}</div>`;
  setTimeout(()=>{const h=document.getElementById('hstage');if(h)h.classList.add('armed');},900);
  stage.querySelector('#hstage').onclick=function(){if(this.classList.contains('open'))return;
   ceremonyMusic();this.classList.add('open');reveal();};
 }else{ /* rose petals */
  let pp='';
  for(let i=0;i<44;i++){const x=(i%8)*12.5+Math.random()*8,y=Math.floor(i/8)*17+Math.random()*10;
   pp+=`<span class="pp" style="left:${x}%;top:${y}%;--tx:${(Math.random()*160-80).toFixed(0)}px;--rr:${(Math.random()*520-260).toFixed(0)}deg;transition-delay:${(Math.random()*0.35).toFixed(2)}s">${['🌹','🌸','🥀'][i%3]}</span>`;}
  stage.innerHTML=`<div class="big-card" id="bigc" style="opacity:0">${inv}</div>
   <div class="petalcover" id="pcov">${pp}</div>
   <div class="hint" style="position:fixed;bottom:11vh;z-index:45;left:0;right:0">${t().hints[4]}</div>`;
  stage.querySelector('#pcov').onclick=()=>reveal();
 }
}
let pmT1=null,pmT2=null,pmT3=null,filmT=[];
function clearFilm(){filmT.forEach(t=>clearTimeout(t));filmT=[];
 clearTimeout(pmT1);clearTimeout(pmT2);clearTimeout(pmT3);}
function mountPremium(idx,stage){
 veil.classList.add('premium');
 clearFilm();
 let sc=veil.querySelector('.cine-scene');
 if(!sc){sc=document.createElement('div');sc.className='cine-scene';
  veil.insertBefore(sc,stage);}
 sc.innerHTML='<div class="framing" id="frm"></div><div class="grainfx"></div>';
 stage.innerHTML=`<div class="pm-titles" id="pmT">
   <div class="ttl">${esc(S.c.t)}</div><div class="nms">${esc(S.c.n)}</div>
   <div class="dte">◆ ${esc(S.c.d)} ◆</div></div>
  <button class="pm-enter" id="pmE" onclick="reveal()">${t().pmEnter}</button>
  <button class="s-skip film-skip" id="fSkip" onclick="skipFilm(${idx})">${t().storySkip}</button>`;
 veil.insertAdjacentHTML('beforeend','<div class="dipfx" id="dip"></div><div class="interttl" id="itl"><p></p></div>');
 playFilm(idx);
 const bu=FILMS[idx].burst;
 if(bu)pmT3=setTimeout(()=>goldBurstAt(bu[1],bu[2]),bu[0]);}
function camSet(frm,sh){frm.style.transition='none';
 frm.style.transformOrigin=sh.x+'% '+sh.y+'%';
 frm.style.transform='scale('+sh.s+')';
 void frm.offsetWidth;
 frm.style.transition='transform '+(sh.d/1000)+'s linear';
 frm.style.transform='scale('+sh.s2+')';}
function playFilm(idx){
 const film=FILMS[idx],frm=document.getElementById('frm'),
  dip=document.getElementById('dip'),itl=document.getElementById('itl');
 let elapsed=0,sceneIn=false;
 film.shots.forEach((sh,si)=>{
  filmT.push(setTimeout(()=>{
   const f=document.getElementById('frm'),d=document.getElementById('dip'),
    it=document.getElementById('itl');if(!f)return;
   const doCut=cb=>{
    if(si===0||!sh.dip){cb();return;}
    d.className='dipfx '+(sh.dip==='w'?'w':'')+' on';
    setTimeout(()=>{cb();d.classList.remove('on');},180);};
   if(sh.txt){doCut(()=>{
    if(sceneIn)f.style.filter='brightness(.3) blur(4px)';
    it.querySelector('p').textContent=t().pmLines[idx];
    it.classList.add('show');
    filmT.push(setTimeout(()=>{it.classList.remove('show');
     if(sceneIn)f.style.filter='';},sh.d-500));});}
   else{doCut(()=>{
    it.classList.remove('show');f.style.filter='';
    if(!sceneIn){f.innerHTML=sceneHTML(idx,idx===3?{once:true}:{});sceneIn=true;}
    if(sh.doors)filmT.push(setTimeout(()=>{
     const dr=f.querySelector('.sc-doors');if(dr)dr.classList.add('played');},900));
    camSet(f,sh);});}
  },elapsed));
  elapsed+=sh.d;});
 pmT1=setTimeout(()=>{const e=document.getElementById('pmT');if(e)e.classList.add('show');},elapsed+250);
 pmT2=setTimeout(()=>{const e=document.getElementById('pmE');if(e)e.classList.add('show');
  const sk=document.getElementById('fSkip');if(sk)sk.style.display='none';},elapsed+1100);}
function skipFilm(idx){clearFilm();
 const f=document.getElementById('frm'),it=document.getElementById('itl'),
  d=document.getElementById('dip'),sk=document.getElementById('fSkip');
 if(it)it.classList.remove('show');if(d)d.classList.remove('on');
 if(f){if(!f.innerHTML||f.innerHTML.indexOf('scene')<0)f.innerHTML=sceneHTML(idx,idx===3?{once:true}:{});
  const dr=f.querySelector('.sc-doors');if(dr)dr.classList.add('played');
  f.style.filter='';f.style.transition='transform 1s ease';
  f.style.transformOrigin='50% 45%';f.style.transform='scale(1.08)';}
 const e1=document.getElementById('pmT');if(e1)e1.classList.add('show');
 const e2=document.getElementById('pmE');if(e2)e2.classList.add('show');
 if(sk)sk.style.display='none';}
function goldBurstAt(fx,fy){
 const W=window.innerWidth||800,H=window.innerHeight||600;
 for(let k=0;k<26;k++){const s=document.createElement('span');s.className='gspark';
  const sz=(3+Math.random()*5).toFixed(1);
  s.style.cssText=`left:${(fx*W).toFixed(0)}px;top:${(fy*H).toFixed(0)}px;width:${sz}px;height:${sz}px;
   --sx:${(Math.random()*220-110).toFixed(0)}px;--sy:${(Math.random()*200-40).toFixed(0)}px;animation-delay:${(Math.random()*.4).toFixed(2)}s`;
  document.body.appendChild(s);setTimeout(()=>s.remove(),2300);}}
let cerMusicOn=false;
function ceremonyMusic(){
 if(cerMusicOn)return;
 if(!(S.c.music&&S.c.autoplay))return;
 cerMusicOn=true;
 try{playMusic(S.c.music);}catch(e){}}
function reveal(keepStage){
 if(!veil)return;
 veil.classList.add('revealed');
 const a=S.c.anim,dz=getDesign();
 const finish=()=>{buildFinale();};
 if(a>=100){const sc=veil.querySelector('.cine-scene');if(sc)sc.classList.add('dimmed');
  clearFilm();
  const it=veil.querySelector('#itl');if(it)it.classList.remove('show');
  const dp=veil.querySelector('#dip');if(dp)dp.classList.remove('on');
  const sk=veil.querySelector('#fSkip');if(sk)sk.remove();
  setTimeout(finish,1150);}
 else if(a>=3){veil.classList.add('opened');
  const b=veil.querySelector('#bigc');if(b)b.style.opacity=1;
  setTimeout(finish,{3:1500,4:1400,5:1650,6:1550,7:2400,8:1500}[a]);}
 else if(a===2){setTimeout(finish,500);}
 else{const env=veil.querySelector('#env');if(env)env.classList.add('gone');
  setTimeout(finish,550);}
 const emo={wed:['🌸','✨','🕊️','💛'],grad:['🎉','⭐','✨','🎓'],oth:['🎈','🎊','✨','💛']}[dz.cat]||['✨'];
 burst(emo);
 ceremonyMusic();
 const h=veil.querySelectorAll('.hint');h.forEach(x=>x.remove());
}
function buildFinale(){
 if(!veil||veil.querySelector('.final'))return;
 const dz=getDesign();
 const stage=veil.querySelector('.cstage');if(stage)stage.remove();
 const cov=veil.querySelector('#pcov');if(cov)cov.remove();
 const fin=document.createElement('div');fin.className='final';
 let html=`<div class="big-card">${inviteHTML(dz,S.c)}</div>`;
 if(S.c.when)html+=`<div class="f-sec"><h3>⏳ ${t().cdTitle}</h3><div class="cd-row" id="cdrow"></div></div>`;
 if(S.c.program.length)html+=`<div class="f-sec"><h3>🗓️ ${t().progTitle}</h3><div class="timeline">${
  S.c.program.map((p,i)=>`<div class="tl-item">
   <div class="tl-time">${esc(p.time)}</div>
   <div class="tl-title">${esc(p.title)||'—'}${p.music?`<button class="tplay" onclick="playMusic(${p.music})">${t().playDay}</button>`:''}</div>
   <div class="tl-place">${esc(p.place)}${p.map?`<a href="${esc(p.map)}" target="_blank" rel="noopener">${t().mapBtn}</a>`:''}</div>
   ${p.photos.length?`<div class="tl-photos">${p.photos.map(ph=>`<img src="${ph}">`).join('')}</div>`:''}
  </div>`).join('')}</div></div>`;
 if(S.c.qr&&S.c.maps)html+=`<div class="qr-wrap"><div id="qrbox"></div><p>${t().scanQ}</p></div>`;
 if(S.c.music&&!S.c.autoplay)html+=`<button class="soundbtn" onclick="playMusic(S.c.music)">${t().unmute}</button>`;
 html+=`<div class="f-sec"><div class="reacts">${['❤️','🎉','👏','😍'].map((e,i)=>
  `<button onclick="react(this,'${e}')">${e}<i>0</i></button>`).join('')}</div></div>`;
 html+=`<div class="f-sec"><h3>💌 ${t().congrats}</h3>
  ${CFG.sec.wishes?`<div class="wishbox"><textarea id="wishTxt" placeholder="${esc(t().congratsPh)}"></textarea>
   <button class="btn-hero" style="padding:13px 26px" onclick="sendWish()">${t().send}</button></div>
  <div id="wishList" class="wishlist">${wishesHTML()}</div></div>`:``}`;
 html+=`<div class="rsvp"><span>${t().rsvpQ}</span>
  <button class="r-yes" onclick="rsvp(1)">${t().rsvpYes}</button>
  <button class="r-no" onclick="rsvp(0)">${t().rsvpNo}</button></div>`;
 fin.innerHTML=html;veil.appendChild(fin);
 if(S.c.when)startCountdown();
 if(S.c.qr&&S.c.maps){const qb=document.getElementById('qrbox');if(qb){qb.innerHTML='';let done=false;try{if(window.QRCode){new QRCode(qb,{text:S.c.maps,width:116,height:116,colorDark:'#2A2118',colorLight:'#FFF9EC',correctLevel:QRCode.CorrectLevel.M});done=true;}}catch(e){}if(!done)qb.innerHTML='<a href="'+esc(S.c.maps)+'" target="_blank" style="color:#2A2118;font-weight:700">📍 '+t().mapBtn+'</a>';}}
}
function startCountdown(){clearInterval(cdTimer);
 const row=document.getElementById('cdrow');if(!row)return;
 const tick=()=>{const diff=new Date(S.c.when)-Date.now();
  if(diff<=0){row.innerHTML=`<div class="started">${t().started}</div>`;clearInterval(cdTimer);return;}
  const d=Math.floor(diff/864e5),h=Math.floor(diff/36e5)%24,m=Math.floor(diff/6e4)%60,s=Math.floor(diff/1e3)%60;
  const v=[d,h,m,s];
  row.innerHTML=v.map((x,i)=>`<div class="cd-box"><b>${String(x).padStart(2,'0')}</b><span>${t().cdL[i]}</span></div>`).join('');};
 tick();cdTimer=setInterval(tick,1000);}
function react(btn,e){const c=btn.querySelector('i');c.textContent=+c.textContent+1;
 const r=btn.getBoundingClientRect();
 const f=document.createElement('span');f.className='floatr';f.textContent=e;
 f.style.cssText=`left:${r.left+r.width/2-12}px;top:${r.top-8}px`;
 document.body.appendChild(f);setTimeout(()=>f.remove(),1500);}
function wishesHTML(){const dbw=(window.__dbWishes||[]).map(w=>({txt:w.body,who:w.name}));const pub=((typeof window!=='undefined'&&window.FARHA_CFG&&window.FARHA_CFG.pub)||[]).map(w=>({txt:w.txt,who:w.n}));
 const ap=dbw.concat(pub).concat(lsGet(LSK.wishes,[]).filter(w=>w.ok).slice(0,12).map(w=>({txt:w.txt,who:w.n})));
 return ap.concat(S.wishes).map(w=>`<div class="wish">“${esc(w.txt)}” — <b>${esc(w.who)||'💛'}</b></div>`).join('');}
function sendWish(){const el=document.getElementById('wishTxt');if(!el)return;
 try{const tx=(el.value||'').trim().slice(0,160);if(tx){const a=lsGet(LSK.wishes,[]);a.unshift({n:(S.c.guest||'ضيف'),txt:tx,ts:Date.now(),ok:false});lsSet(LSK.wishes,a.slice(0,300));dbHook('wish',{name:(S.c.guest||'ضيف'),body:tx});}}catch(e){}
 const v=el.value.trim();if(!v)return;
 S.wishes.unshift({txt:v.slice(0,240),who:S.c.guest||''});el.value='';
 const l=document.getElementById('wishList');if(l)l.innerHTML=wishesHTML();
 toast(t().congratsSent);burst(['💛','💌']);}
function rsvp(y){toast(t().rsvpSent);if(y)burst(['🎉','💛']);
 const r=veil&&veil.querySelector('.rsvp');if(r)r.style.opacity=.45;}
function demoProgram(){return [
 {time:'19:00',title:{ar:'استقبال الضيوف',fr:'Accueil des invités',en:'Guest welcome'}[S.lang],place:{ar:'البهو الكبير',fr:'Grand hall',en:'Grand hall'}[S.lang],map:'https://maps.google.com',music:1,photos:[]},
 {time:'21:00',title:{ar:'العشاء والموسيقى',fr:'Dîner & musique',en:'Dinner & music'}[S.lang],place:{ar:'قاعة الياسمين',fr:'Salle Yasmine',en:'Yasmine hall'}[S.lang],map:'',music:3,photos:[]}];}
function openPremium(i){openEditor(PM_MAP[i]);S.c.anim=100+i;render();}
function premDemo(i){
 demoBackup={design:S.design,c:JSON.parse(JSON.stringify(S.c))};
 S.design=PM_MAP[i];const dz=DESIGNS.find(d=>d.id===S.design);
 const when=new Date(Date.now()+37*864e5+5*36e5);
 S.c={...S.c,...dz.def[S.lang],font:0,pal:0,anim:100+i,music:1,autoplay:true,qr:false,maps:'',story:[],guest:'',
  when:when.toISOString().slice(0,16),program:demoProgram()};
 ceremony(true);}
function demoAnim(i){
 demoBackup={design:S.design,c:JSON.parse(JSON.stringify(S.c))};
 S.design=[1,10,9,2,4,4,11,1,12][i];const dz=DESIGNS.find(d=>d.id===S.design);
 const when=new Date(Date.now()+37*864e5+5*36e5);
 S.c={...S.c,...dz.def[S.lang],font:0,pal:0,anim:i,music:i===2?3:1,autoplay:true,qr:false,maps:'',story:[],guest:'',
  when:when.toISOString().slice(0,16),
  program:demoProgram()};
 ceremony(true);}
function closeVeil(silent){
 const mv=veil&&veil.querySelector('#mv');if(mv){try{mv.pause()}catch(e){}}
 if(veil){veil.remove();veil=null;}
 document.body.style.overflow='';stopMusic();clearInterval(cdTimer);clearTimeout(showEndT);
 clearFilm();
 if(!silent&&demoBackup){S.design=demoBackup.design;S.c=demoBackup.c;demoBackup=null;}
 if(!silent&&S.view==='land')ambient();}
function burst(ems){for(let i=0;i<38;i++){const s=document.createElement('span');s.className='conf';
 s.textContent=ems[i%ems.length];
 s.style.cssText=`left:${Math.random()*100}vw;font-size:${(0.8+Math.random()*1.5).toFixed(2)}rem;animation-duration:${(2.6+Math.random()*2.8).toFixed(1)}s;animation-delay:${(Math.random()*0.9).toFixed(2)}s`;
 document.body.appendChild(s);setTimeout(()=>s.remove(),6500);}}

