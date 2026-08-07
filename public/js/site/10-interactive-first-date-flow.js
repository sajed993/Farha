/* ================= interactive first-date flow — cat edition 😼 ================= */
const FD={
 ar:{q:'هل تقبل(ين) الخروج معي في أول موعد؟',qs:'جاوبوا بصدق… القط يراقب 🐾',yes:'نعم، طبعًا! 💘',no:'لا 😐',
  taunts:['لا؟ متأكد(ة)؟ 🥺','فكّروا مرة أخرى… 😅','القط ما عجبتوش الإجابة 🐾','😼 آخر تحذير…','خلاص — القط قرّر عنكم: نعم! 😹💘'],
  styleT:'شنوّة ستايل الموعد؟',styleS:'اختاروا الأجواء اللي تليق بكم',
  styles:[['🕊️','«اتبعني» — مغامرة سفر'],['🧺','بيك نيك على شاطئ الغروب'],['🤿','غوص تحت الماء'],['🏍️','جولة موتور بين الجبال'],['🐎','ركوب الخيل'],['🚲','دراجات في الليل'],['🕯️','عشاء على ضوء الشموع'],['🎨','موعد رسم ولوحات'],['🍝','عشاء إيطالي دافئ'],['🐈','نطعمو قطط الشارع ونهتمو بهم 🥣']],
  whereT:'وين وامتى نتقابلو؟ 📍',wherePh:'المكان أو العنوان — مثال: قهوة السيدة، سيدي بوسعيد',
  ticket:'تذكرة أول موعد',tkStyle:'الأجواء',tkWhere:'المكان',tkWhen:'التاريخ',tkAt:'الساعة',
  share:'أرسلوها له/لها 📲',shareMsg:'💌 عندي دعوة خاصة ليك…\n🎟️ تذكرة أول موعد!',accepted:'القط وافق بالنيابة 😼'},
 fr:{q:'Acceptes-tu un premier rendez-vous avec moi ?',qs:'Réponds honnêtement… le chat regarde 🐾',yes:'Oui, bien sûr ! 💘',no:'Non 😐',
  taunts:['Non ? Vraiment ? 🥺','Réfléchis encore… 😅','Le chat n\'aime pas cette réponse 🐾','😼 Dernier avertissement…','Le chat a décidé : OUI ! 😹💘'],
  styleT:'Quel style de rendez-vous ?',styleS:'Choisissez votre ambiance',
  styles:[['🕊️','« Suis-moi » — voyage'],['🧺','Pique-nique au coucher du soleil'],['🤿','Plongée sous-marine'],['🏍️','Virée moto en montagne'],['🐎','Balade à cheval'],['🚲','Vélo de nuit'],['🕯️','Dîner aux chandelles'],['🎨','Séance peinture'],['🍝','Dîner italien'],['🐈','Nourrir les chats de rue 🥣']],
  whereT:'Où et quand se retrouve-t-on ? 📍',wherePh:'Lieu ou adresse — ex. Café Sidi Bou Saïd',
  ticket:'Billet du premier rendez-vous',tkStyle:'Ambiance',tkWhere:'Lieu',tkWhen:'Date',tkAt:'Heure',
  share:'Envoyez-le 📲',shareMsg:'💌 Une invitation spéciale…\n🎟️ Billet pour un premier rendez-vous !',accepted:'Le chat a accepté pour vous 😼'},
 en:{q:'Will you go on a first date with me?',qs:'Answer honestly… the cat is watching 🐾',yes:'Yes, of course! 💘',no:'No 😐',
  taunts:['No? Are you sure? 🥺','Think again… 😅','The cat dislikes that answer 🐾','😼 Final warning…','The cat decided: YES! 😹💘'],
  styleT:'What kind of date?',styleS:'Pick your vibe',
  styles:[['🕊️','"Follow me" adventure'],['🧺','Sunset beach picnic'],['🤿','Scuba diving'],['🏍️','Mountain ride'],['🐎','Horseback riding'],['🚲','Night bike ride'],['🕯️','Candlelit dinner'],['🎨','Painting date'],['🍝','Italian dinner'],['🐈','Feed & care for street cats 🥣']],
  whereT:'Where & when do we meet? 📍',wherePh:'Place or address — e.g. Café Sidi Bou Said',
  ticket:'First-date ticket',tkStyle:'Vibe',tkWhere:'Place',tkWhen:'Date',tkAt:'Time',
  share:'Send it 📲',shareMsg:'💌 A special invitation…\n🎟️ First-date ticket!',accepted:'The cat accepted on your behalf 😼'}};
function fd(){return FD[S.lang]||FD.ar;}
function catPawSVG(){return `<svg viewBox="0 0 270 140" style="width:100%;height:100%;display:block">
 <defs><linearGradient id="pawfur" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#F7EFE2"/><stop offset="1" stop-color="#EBDCC4"/></linearGradient></defs>
 <path d="M-14 44 h132 q22 0 30 -14 q4 -8 14 -8 q34 2 44 34 q6 22 -10 38 q-14 14 -36 10 q-10 -2 -14 -10 q-8 -12 -28 -12 h-132 z" fill="url(#pawfur)" stroke="#D8C6A8" stroke-width="2.5" stroke-linejoin="round"/>
 <path d="M196 24 q4 -8 8 0 M214 22 q4 -8 8 0 M232 30 q5 -7 9 1" fill="none" stroke="#E4D4B8" stroke-width="3" stroke-linecap="round"/>
 <path d="M8 46 q9 24 0 46 M40 44 q9 25 0 50 M72 44 q9 25 0 50" fill="none" stroke="#DEC9A6" stroke-width="9" stroke-linecap="round" opacity=".8"/>
 <g stroke="#3A3230" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M178 32 l7 -13 l9 10"/>
  <path d="M216 28 l7 -13 l9 10"/>
  <path d="M200 74 q5 5 10 0 q5 5 10 0"/>
  <path d="M158 70 q-14 -4 -26 -2 M158 78 q-14 2 -26 8 M252 64 q12 -4 22 -2 M252 74 q12 4 20 10"/>
 </g>
 <circle cx="196" cy="58" r="3.4" fill="#3A3230"/><circle cx="226" cy="58" r="3.4" fill="#3A3230"/>
 <ellipse cx="182" cy="72" rx="7" ry="4" fill="#F0BCBC" opacity=".85"/>
 <ellipse cx="240" cy="72" rx="7" ry="4" fill="#F0BCBC" opacity=".85"/>
 <path d="M243 104 c3.5 -5 11 -3 11 2 c0 5 -8 8 -11 10 c-3 -2 -11 -5 -11 -10 c0 -5 7.5 -7 11 -2 z" fill="#fff" stroke="#E3C4BA" stroke-width="2"/>
</svg>`;}
function playDateFlow(){
 closeVeil(true);
 S.df={step:0,style:-1,addr:'',day:null,time:-1,mon:6,yr:2026,noTries:0,noGone:false};
 veil=document.createElement('div');veil.className='veil';
 document.body.appendChild(veil);scrollSync();
 const bg=document.createElement('div');bg.className='df-stage';veil.appendChild(bg);
 veil.insertAdjacentHTML('beforeend',`<button class="df-x" onclick="closeVeil()">✕</button>`);
 let hh='';for(let i=0;i<10;i++)hh+=`<i style="left:${5+i*10}%;bottom:-6%;--d:${(10+Math.random()*8).toFixed(1)}s;animation-delay:${(-Math.random()*14).toFixed(1)}s;font-size:${(1.4+Math.random()*1.8).toFixed(1)}rem">${['🤍','🌷','💗','✨'][i%4]}</i>`;
 bg.insertAdjacentHTML('beforebegin',`<div class="df-hearts-bg">${hh}</div>`);
 dfRender();}
function dfDots(){return `<div class="df-steps">${[0,1,2,3,4].map(i=>`<span class="dot ${S.df.step===i?'on':''}"></span>`).join('')}</div>`;}
function dfRender(){
 const bg=veil&&veil.querySelector('.df-stage');if(!bg)return;
 const s=S.df.step,F=fd();let h='';
 if(s===0){
  h=`<div class="df-card"><div class="em">💌🐾</div>
   <h3>${t().df1title}</h3><div class="sub">${t().df1sub}</div>
   <button class="btn-df" onclick="dfGo(1)">${t().df1btn}</button>${dfDots()}</div>`;
 } else if(s===1){
  h=`<div class="df-card"><div class="em">🥺🌹</div>
   <h3>${F.q}</h3><div class="sub df-taunt" id="dfTaunt">${F.qs}</div>
   <div class="q-arena" id="qArena">
    <button class="btn-df df-yes" id="dfYes" onclick="dfYes()">${F.yes}</button>
    <button class="df-no" id="dfNo"
      onpointerdown="dfNoTry(event)" onmouseenter="dfNoTry(event)" ontouchstart="dfNoTry(event)"
      onclick="dfNoTry(event)">${F.no}</button>
    <div class="cat-paw" id="catPaw">${catPawSVG()}</div>
   </div>${dfDots()}</div>`;
 } else if(s===2){
  h=`<div class="df-card"><div class="em">✨</div>
   <h3>${F.styleT}</h3><div class="sub">${F.styleS}</div>
   <div class="dstyle-grid">${F.styles.map((st,i)=>`<div class="dstyle ${S.df.style===i?'sel':''}" style="background-image:url('img/date/d${i}.jpg')" onclick="dfPickStyle(${i})"><span class="dem">${st[0]}</span><b>${st[1]}</b></div>`).join('')}</div>
   <button class="btn-df" onclick="dfGo(3)">${t().dfNext}</button>${dfDots()}</div>`;
 } else if(s===3){
  h=`<div class="df-card"><div class="em">📍🐾</div>
   <h3>${F.whereT}</h3>
   <input class="df-addr" id="dfAddr" maxlength="70" placeholder="${F.wherePh}" value="${esc(S.df.addr)}" oninput="S.df.addr=this.value">
   ${dfCalendar()}
   <div class="sub" style="margin:6px 0 8px">${t().df3time}</div>
   <div class="time-grid">${DF_TIMES.map((tm,i)=>`<button class="time-p ${S.df.time===i?'sel':''}" onclick="dfPickTime(${i})">${tm}</button>`).join('')}</div>
   <button class="btn-df" onclick="dfGo(4)">${t().df3btn}</button>${dfDots()}</div>`;
 } else {
  const st=F.styles[S.df.style>=0?S.df.style:0];
  const dd=S.df.day||1;const mon=t().dfMonths[S.df.mon];
  const tm=DF_TIMES[S.df.time>=0?S.df.time:14];
  h=`<div class="df-card df-final">
   <div class="df-ticket">
    <div class="tk-top"><span>🎟️ ${F.ticket}</span><span class="tk-cat">😼</span></div>
    <div class="tk-photo" style="background-image:url('img/date/d${S.df.style>=0?S.df.style:0}.jpg')"><span class="tk-em">${st[0]}</span></div>
    <div class="tk-hero"><b>${st[1]}</b></div>
    <div class="tk-rows">
     <div class="row"><span class="ic">📍</span>${F.tkWhere}: <b>${esc(S.df.addr||'—')}</b></div>
     <div class="row"><span class="ic">📆</span>${F.tkWhen}: <b>${dd} ${mon} ${S.df.yr}</b></div>
     <div class="row"><span class="ic">🕐</span>${F.tkAt}: <b>${tm}</b></div>
    </div>
    <div class="tk-perf"></div>
    <div class="tk-code">${'▮▯▮▮▯▮▯▮▮▯▮▮▯▮▯▮▮▯'.split('').map(c=>`<i class="${c==='▮'?'b':''}"></i>`).join('')}</div>
   </div>
   <div class="sub" style="font-family:var(--script);font-size:1.35rem;color:#A05A64;margin-top:8px">${t().df4msg} · ${F.accepted}</div>
   <div class="df-cta" style="margin-top:8px">
    <button class="btn-df" onclick="dfShare()">${F.share}</button>
    <button class="btn-df ghost" onclick="dfGo(0)">${t().dfAgain}</button>
   </div>${dfDots()}</div>`;
 }
 bg.innerHTML=h;
 if(s===4){burstDF();}
}
function dfYes(){burstDF();setTimeout(()=>dfGo(2),650);}
function dfNoTry(ev){
 try{ev.preventDefault();ev.stopPropagation();}catch(e){}
 if(S.df.noGone)return;
 const now=Date.now();if(now-(S.df._lastNo||0)<350)return;S.df._lastNo=now;
 const no=document.getElementById('dfNo'),yes=document.getElementById('dfYes'),ta=document.getElementById('dfTaunt'),ar=document.getElementById('qArena');
 if(!no||!ar)return;
 S.df.noTries++;const n=S.df.noTries,F=fd();
 if(ta)ta.textContent=F.taunts[Math.min(n-1,F.taunts.length-1)];
 if(yes)yes.style.transform=`scale(${Math.min(1+n*0.09,1.5)})`;
 if(n>=5){dfPawFinale(no);return;}
 if(n===3)dfPawSwat();
 const spots=[[6,8],[62,8],[6,64],[62,64],[8,36],[64,36]];
 const sp=spots[Math.floor(Math.random()*spots.length)];
 no.style.insetInlineStart=sp[0]+'%';no.style.top=sp[1]+'%';
 no.style.transform=`rotate(${(Math.random()*22-11).toFixed(0)}deg) scale(${Math.max(1-n*0.1,0.55)})`;}
function dfPawSwat(){
 const paw=document.getElementById('catPaw');if(!paw)return;
 paw.classList.add('in','swat');
 try{if(typeof AC!=='undefined'&&AC){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(640,AC.currentTime);o.frequency.exponentialRampToValueAtTime(180,AC.currentTime+.18);g.gain.setValueAtTime(.12,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.2);o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+.22);}}catch(e){}
 setTimeout(()=>paw.classList.remove('in','swat'),900);}
function dfPawFinale(no){
 S.df.noGone=true;
 const paw=document.getElementById('catPaw');
 if(paw)paw.classList.add('in','grab');
 setTimeout(()=>{if(no){no.classList.add('flee');}},430);
 setTimeout(()=>{if(no)no.remove();if(paw)paw.classList.remove('in','grab');
  const yes=document.getElementById('dfYes');if(yes)yes.classList.add('alone');
  burstDF();},1150);}
function dfPickStyle(i){S.df.style=i;dfRender();}
function dfGo(step){
 if(step===3&&S.df.style<0){toast(t().dfPickFirst);return;}
 if(step===4&&(!S.df.addr.trim()||!S.df.day||S.df.time<0)){toast(t().dfPickFirst);return;}
 if(step===0){S.df.style=-1;S.df.addr='';S.df.day=null;S.df.time=-1;S.df.noTries=0;S.df.noGone=false;}
 S.df.step=step;dfRender();}
function dfPickDay(d){S.df.day=d;dfRender();}
function dfPickTime(i){S.df.time=i;dfRender();}
function dfMonth(dir){let m=S.df.mon+dir,y=S.df.yr;if(m<0){m=11;y--;}if(m>11){m=0;y++;}S.df.mon=m;S.df.yr=y;dfRender();}
function dfShare(){
 const F=fd();const st=F.styles[S.df.style>=0?S.df.style:0];
 const dd=S.df.day||1;const mon=t().dfMonths[S.df.mon];const tm=DF_TIMES[S.df.time>=0?S.df.time:14];
 const msg=F.shareMsg+'\n'+st[0]+' '+st[1]+'\n📍 '+(S.df.addr||'')+'\n📆 '+dd+' '+mon+' '+S.df.yr+' · 🕐 '+tm+'\n😼💘';
 try{window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');}catch(e){}
 burstDF();toast(t().stOrdered);}
const DF_TIMES=['12:00','13:00','14:00','15:00','16:00','17:00','18:00','18:30','19:00','19:30','20:00','20:30'];
function dfCalendar(){
 const mon=S.df.mon,yr=S.df.yr;
 const first=new Date(yr,mon,1).getDay();
 const days=new Date(yr,mon+1,0).getDate();
 const dow=t().dfDays;
 let cells='';
 for(let i=0;i<first;i++)cells+=`<div class="cal-d muted"></div>`;
 for(let d=1;d<=days;d++)cells+=`<div class="cal-d ${S.df.day===d?'sel':''}" onclick="dfPickDay(${d})">${d}</div>`;
 return `<div class="df-cal">
   <div class="cal-h"><button onclick="dfMonth(-1)">‹</button><span>${t().dfMonths[mon]} ${yr}</span><button onclick="dfMonth(1)">›</button></div>
   <div class="cal-grid">${dow.map(d=>`<div class="cal-dow">${d}</div>`).join('')}${cells}</div></div>`;}
function burstDF(){const c=document.createElement('div');c.className='df-confetti';
 veil.appendChild(c);const ico=['💗','🤍','🌷','✨','🕊️','⭐'];
 for(let i=0;i<28;i++){const s=document.createElement('div');
  s.textContent=ico[i%ico.length];s.style.cssText=`position:absolute;left:${Math.random()*100}%;top:-8%;font-size:${(1+Math.random()*1.6).toFixed(1)}rem;animation:fall ${(2.4+Math.random()*2).toFixed(1)}s ease-in ${(Math.random()*.6).toFixed(1)}s forwards`;
  c.appendChild(s);}
 setTimeout(()=>c.remove(),5200);}

function stylePrev(i){
 if(i===0)return `<div class="pv-cine"><div class="b t"></div><div class="fake"></div><div class="b d"></div></div>`;
 if(i===1)return `<div class="pv-tv"><div class="scr"><div class="fake"></div></div><div class="scan"></div><div class="kn"></div></div>`;
 if(i===2)return `<div class="pv-pol"><div class="p" style="left:16%;top:22%;transform:rotate(-8deg)"><i></i></div><div class="p" style="right:14%;top:30%;transform:rotate(7deg)"><i></i></div></div>`;
 if(i===3)return `<div class="pv-reel"><div class="rl"></div></div>`;
 if(i===4)return `<div class="pv-vinyl"><div class="disc"></div></div>`;
 return `<div class="pv-vid"><div class="frm"></div><div class="ply">▶</div></div>`;}
function svgPhoto(kind,i){
 // elegant gradient "photo" compositions — look like real romantic photography, not emoji
 const G={
  wed:[['#F3D9C8','#C98A6E','#6E3A28'],['#EAD9C0','#B98A5E','#5E3E22'],['#F6E6D8','#D0A080','#7A4A32'],['#E8CFC0','#A87860','#4E2E22'],['#F3E0D0','#C08A6A','#6A3E28'],['#EED8C6','#B07850','#5A3220']],
  grad:[['#D8E0F2','#5570B8','#22304F'],['#E0E6F5','#6B84C8','#2E3E5E'],['#CED8EE','#4560A8','#1E2E4E'],['#DDE4F2','#7088C0','#32405E'],['#E8ECF8','#8098CC','#3A4A68'],['#D2DCEF','#5070B0','#243450']],
  date:[['#FCE0EC','#E58BA6','#8E3A54'],['#F8D8E4','#D97C9A','#7E2E48'],['#FDE6F0','#EE9BB4','#9A4560'],['#F6D2E0','#D06E90','#722840'],['#FCE4EE','#E88BA8','#8E3E58'],['#F9DAE6','#DA80A0','#803048']],
  oth:[['#F5E6C8','#C9A24B','#6A4E1A'],['#EFE0BE','#B8923E','#5E4A18'],['#F8ECD2','#D0AC58','#7A5A22'],['#F3E2C2','#C09848','#6E5220'],['#FBEFD8','#D8B462','#82602A'],['#F0E0BC','#BC9440','#5A4418']]
 }[['wed','grad','date','oth'][S.st.occ]];
 const c=G[i%G.length];
 const icons={wed:['💍','💐','🥂','🕊️','🌸','💛'],grad:['🎓','📚','🏆','⭐','🎉','✨'],date:['❤️','☕','🌷','🌙','💌','🥂'],oth:['🎂','🎈','🎁','🎉','✨','💫']}[['wed','grad','date','oth'][S.st.occ]];
 const ic=icons[i%icons.length];
 const id='g'+kind+i+Math.floor(Math.random()*9999);
 return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0.4" y2="1">
   <stop offset="0" stop-color="${c[0]}"/><stop offset="0.55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>
   <radialGradient id="${id}b" cx="0.5" cy="0.32" r="0.7"><stop offset="0" stop-color="rgba(255,255,255,.5)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient></defs>
  <rect width="400" height="300" fill="url(#${id})"/>
  <ellipse cx="200" cy="96" rx="150" ry="90" fill="url(#${id}b)"/>
  <circle cx="316" cy="60" r="30" fill="rgba(255,255,255,.32)"/>
  <path d="M0 232 Q100 208 200 226 T400 220 V300 H0 Z" fill="rgba(40,24,16,.32)"/>
  <path d="M0 258 Q120 240 220 254 T400 250 V300 H0 Z" fill="rgba(40,24,16,.4)"/>
  <text x="200" y="168" font-size="78" text-anchor="middle" dominant-baseline="central" opacity=".92">${ic}</text>
  <rect width="400" height="300" fill="none"/></svg>`;}
function stPhotoList(){
 if(S.st.photos.length)return S.st.photos.map(p=>({img:p}));
 return [0,1,2,3,4,5].map(i=>({svg:svgPhoto('s',i)}));}
function phBG(p){return p.img?`style="background-image:url('${p.img}')"`:'';}
function phInner(p){return p.svg?p.svg:(p.fake?`<div class="fakeph">${p.fake}</div>`:'');}
let showEndT=null;
function playShow(){
 closeVeil(true);
 veil=document.createElement('div');veil.className='veil premium show-veil';
 document.body.appendChild(veil);scrollSync();
 veil.insertAdjacentHTML('afterbegin',`<div class="cine-fx"><div class="vign"></div></div>`);
 veil.insertAdjacentHTML('beforeend',`<button class="close-x" onclick="closeVeil()">${t().closePrev}</button>`);
 const style=S.st.style,phs=stPhotoList(),n=phs.length;
 if(S.st.music)playShowMusic();
 const stage=document.createElement('div');stage.className='show-stage';veil.appendChild(stage);
 let total=0;
 if(style===0){
  const pd=3400;total=n*pd;
  const orgs=['30% 30%','70% 40%','50% 60%','40% 50%','60% 30%','50% 50%'];
  stage.innerHTML=`<div class="shx shx-cine">${phs.map((p,i)=>`<div class="ph kb${i%4}" style="opacity:0;transform-origin:${orgs[i%6]}${p.img?`;background-image:url('${p.img}')`:''}">${phInner(p)}</div>`).join('')}</div>
   <div class="cine-fx"><div class="rays"></div><div class="vign"></div></div><div class="grainfx"></div>`;
  const el=[...stage.querySelectorAll('.shx-cine .ph')];
  let ci=0;
  const showAt=k=>{el.forEach((e,j)=>{e.style.opacity=(j===k)?'1':'0';e.style.transition='opacity 1s ease';});};
  showAt(0);
  const civ=setInterval(()=>{ci=(ci+1)%el.length;showAt(ci);},pd);
  filmT.push(civ);
 } else if(style===1){
  const pd=3000;total=n*pd;
  stage.innerHTML=`<div class="tvset"><div class="tvscreen">
    ${phs.map((p,i)=>`<div class="ph" style="position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity .6s${p.img?`;background-image:url('${p.img}')`:''}">${phInner(p)}</div>`).join('')}
    <div class="tv-scan"></div><div class="tv-roll"></div><div class="tv-glass"></div>
    <div class="vhs">▶ PLAY &nbsp; SP &nbsp; ${esc(S.st.date||'')}</div></div>
    <div class="tv-panel"><div class="kb"></div><div class="kb"></div><div class="sp"></div></div></div>`;
  const tel=[...stage.querySelectorAll('.tvscreen .ph')];
  let ti=0;
  const tvShow=k=>tel.forEach((e,j)=>e.style.opacity=(j===k)?'1':'0');
  tvShow(0);
  const tiv=setInterval(()=>{ti=(ti+1)%tel.length;tvShow(ti);},pd);
  filmT.push(tiv);
 } else if(style===2){
  const pd=2.1;total=n*pd*1000+800;
  const pos=[[-30,-16,-9],[26,-20,8],[-20,18,-6],[30,16,7],[0,-4,-3],[8,22,5],[-34,4,-11],[34,-6,9]];
  stage.innerHTML=`<div class="poltable"></div>${phs.map((p,i)=>{const P=pos[i%8];
    return `<div class="pol" style="--px:${P[0]}vmin;--py:${P[1]}vmin;--pr:${P[2]}deg;--del:${(i*pd).toFixed(2)}s">
     <div class="pimg" ${phBG(p)}>${phInner(p)}</div><div class="pcap">${esc(S.st.names||'♥')}</div></div>`;}).join('')}`;
 } else if(style===3){
  total=3000+n*1400+800;
  const cellW=Math.min(window.innerHeight*0.6,460)+20;
  const shift=(n-1)*cellW;
  stage.innerHTML=`<div class="leader" id="leader"><div class="lead-ring"></div><b id="leadn">3</b></div>
   <div class="reelwrap" style="opacity:0" id="reelw">
    <div class="strip" style="--sx:${document.documentElement.dir==='rtl'?shift:-shift}px;--sd:${(n*1.4).toFixed(1)}s;animation-delay:2.9s">
     ${phs.map(p=>`<div class="cell"><div class="cimg" ${phBG(p)}>${phInner(p)}</div></div>`).join('')}</div></div>
   <div class="projfl"></div>`;
  let cnt=3;const ln=stage.querySelector('#leadn');
  const iv=setInterval(()=>{cnt--;if(ln)ln.textContent=cnt>0?cnt:'';if(cnt<=0){clearInterval(iv);
    const ld=stage.querySelector('#leader');if(ld)ld.style.display='none';
    const rw=stage.querySelector('#reelw');if(rw)rw.style.opacity=1;}},1000);
  filmT.push(iv);
 } else if(style===4){ /* golden vinyl */
  const pd=3.0;total=n*pd*1000;
  stage.innerHTML=`<div class="vinylwrap"><div class="glowbg"></div>
    <div class="vinyl" style="--vs:9s">
     ${phs.map((p,i)=>`<div class="vphoto ${i===0?'on':''}" data-i="${i}" ${phBG(p)}>${phInner(p)}</div>`).join('')}
     <div class="vhole"></div></div>
    <div class="tonearm"></div></div>`;
  let vi=0;const vph=[...stage.querySelectorAll('.vphoto')];
  const vt=setInterval(()=>{vph[vi]&&vph[vi].classList.remove('on');vi=(vi+1)%vph.length;vph[vi]&&vph[vi].classList.add('on');},pd*1000);
  filmT.push(vt);
 } else { /* video-in-frame (style 5) */
  total=0; // driven by video length or fallback timer
  if(S.st.video){
   stage.innerHTML=`<div class="vidframe"><div class="vfbox">
     <video id="stvid" src="${S.st.video.url}" playsinline autoplay></video><div class="vfg"></div></div></div>`;
   const v=stage.querySelector('#stvid');
   if(v){v.onended=()=>showEnd();v.play().catch(()=>{v.muted=true;v.play().catch(()=>{});});}
   total=32000;
  } else {
   stage.innerHTML=`<div class="vidframe"><div class="vfbox"><div class="novid">
     <div class="big">🎬</div><b>${t().stUpVid}</b><p>${t().stStyleD[5]}</p></div><div class="vfg"></div></div></div>`;
   total=4000;
  }
 }
 clearTimeout(showEndT);
 showEndT=setTimeout(()=>showEnd(),Math.max(4000,total));
 filmT.push(showEndT);}
function showEnd(){
 if(!veil)return;
 const stage=veil.querySelector('.show-stage');
 if(stage){stage.style.transition='opacity 1.2s';stage.style.opacity=0;}
 const end=document.createElement('div');end.className='show-end';
 end.innerHTML=`<div class="inner">
   <div style="font-size:3rem">${t().stOccs[S.st.occ].split(' ')[0]}</div>
   <h2 class="foil-n">${esc(S.st.names||t().stOccs[S.st.occ])}</h2>
   ${S.st.date?`<div class="dt">◆ ${esc(S.st.date)} ◆</div>`:''}
   <div class="thx">${t().stEnd}</div>
   <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px">
    <button class="pm-enter show" style="opacity:1;transform:none;animation:none" onclick="playShow()">${t().stReplay}</button>
    <button class="soundbtn" onclick="stOrder()">${t().stOrder}</button></div></div>`;
 setTimeout(()=>{if(veil)veil.appendChild(end);burst(['💛','✨','🌸']);},900);}
let showAUD=null,synthLoopT=null;
function playShowMusic(){stopMusic();
 // uploaded track
 if(S.st.track&&(S.st.music>=4)){
  showAUD=new Audio(S.st.track.url);showAUD.loop=true;showAUD.volume=.75;
  showAUD.play().catch(()=>{showAUD.muted=false;showAUD.play().catch(()=>{})});
  AUD=showAUD;return;}
 if(!S.st.music)return;
 // synth melody — resume context (gesture-safe) and loop continuously
 try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  if(AC.state==='suspended')AC.resume();}catch(e){}
 const m=MEL[S.st.music];if(!m)return;
 const beat=60/m.bpm;
 let loopSec=0;m.notes.forEach(([f,dr])=>loopSec+=dr*beat*0.6);
 const playOnce=()=>{if(!veil)return;
  try{if(AC.state==='suspended')AC.resume();
   let when=AC.currentTime+.06;
   m.notes.forEach(([f,dr])=>{const o=AC.createOscillator(),g=AC.createGain();
    o.type=m.wave;o.frequency.value=f;o.connect(g);g.connect(AC.destination);
    g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(.15,when+.05);
    g.gain.exponentialRampToValueAtTime(.001,when+dr*beat*.95);
    o.start(when);o.stop(when+dr*beat);playing.push(o);when+=dr*beat*.6;});
  }catch(e){}};
 playOnce();
 synthLoopT=setInterval(playOnce,Math.max(2000,loopSec*1000));
 filmT.push(synthLoopT);}

