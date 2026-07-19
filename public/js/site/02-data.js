/* ================= data ================= */
const FONTS_L=["'Fraunces',serif","'Fraunces',serif","'Karla',sans-serif","'Great Vibes',cursive"];
const FONTS_A=["'Aref Ruqaa',serif","'Amiri',serif","'IBM Plex Sans Arabic',sans-serif","'Amiri',serif"];
const LAYERS=['','bg-dots','bg-arch','bg-rays','bg-zellige','bg-damask','bg-stars','bg-confetti'];
const ANIM_ICO=['💌','🔴','🎀','🎭','🌹','🦋','🌸','🎁','❤️'];
const PM_ICO=['🌅','🏰','⛲','🚪','🦋','🎆','🌙','✨','💗','💍'];
const PM_MAP=[1,2,9,10,4,6,3,11,4,9];
const PM_DUR=['0:45','0:50','0:40','0:35','0:55','0:45','0:40','0:30','0:40','0:35'];
const PM_CAT=['r','r','r','r','i','i','i','i','i','i'];
/* shot: {x,y,s,s2,d[,dip:'b'|'w'][,txt][,doors]} — x/y camera origin %, s→s2 move, d ms */
const FILMS=[
 {shots:[{x:50,y:44,s:1,s2:1.1,d:3300},{txt:1,d:2300},{x:50,y:58,s:2.1,s2:2.4,d:3100,dip:'b'},{x:50,y:77,s:2.9,s2:3.3,d:3300,dip:'b'}]},
 {shots:[{x:50,y:45,s:1,s2:1.12,d:3300},{x:13,y:22,s:2.35,s2:2.6,d:3000,dip:'b'},{x:50,y:72,s:2.6,s2:2.85,d:2800,dip:'b'},{txt:1,d:2300},{x:50,y:45,s:1.08,s2:1.16,d:2400}]},
 {shots:[{x:50,y:42,s:1,s2:1.12,d:3200},{x:50,y:66,s:2.5,s2:2.75,d:3100,dip:'b'},{txt:1,d:2300},{x:26,y:44,s:1.28,s2:1.4,d:2800,dip:'b'}]},
 {shots:[{x:50,y:44,s:1,s2:1.05,d:1400,doors:1},{x:50,y:44,s:1.05,s2:1.22,d:3300},{x:50,y:42,s:1.25,s2:3.5,d:2500,dip:'w'},{txt:1,d:2300}],burst:[9600,.5,.42]},
 {shots:[{txt:1,d:2500},{x:50,y:52,s:1.05,s2:1.1,d:3600},{x:21,y:63,s:2.3,s2:2.45,d:3000,dip:'b'},{x:50,y:44,s:1.2,s2:1.28,d:4400,dip:'b'},{x:72,y:27,s:2.6,s2:2.8,d:3400,dip:'b'}],burst:[16400,.72,.26]},
 {shots:[{x:50,y:44,s:1,s2:1.1,d:3200},{x:30,y:56,s:2.4,s2:2.6,d:2900,dip:'b'},{x:56,y:74,s:2.2,s2:2.45,d:3000,dip:'b'},{txt:1,d:2300}]},
 {shots:[{x:50,y:40,s:1,s2:1.06,d:3000},{txt:1,d:2400},{x:79,y:23,s:2.25,s2:2.5,d:3400,dip:'b'},{x:32,y:74,s:2.3,s2:2.5,d:3000,dip:'b'}]},
 {shots:[{txt:1,d:2500},{x:50,y:50,s:1,s2:1.08,d:3400},{x:50,y:50,s:1.9,s2:2.15,d:2900,dip:'b'},{x:50,y:50,s:1.05,s2:1.12,d:2200,dip:'w'}],burst:[8900,.5,.46]},
 {shots:[{x:50,y:42,s:1,s2:1.1,d:3200},{x:30,y:34,s:2,s2:2.2,d:2800,dip:'b'},{txt:1,d:2300},{x:50,y:46,s:1.15,s2:1.24,d:2600}]},
 {shots:[{x:50,y:60,s:1,s2:1.12,d:3200},{x:50,y:30,s:2.6,s2:2.9,d:3000,dip:'b'},{txt:1,d:2300},{x:50,y:44,s:1.2,s2:1.3,d:2400,dip:'w'}],burst:[8600,.5,.34]}];
function filmDur(idx){return FILMS[idx].shots.reduce((a,s)=>a+s.d,0);}
function durStr(i){return S.lang==='ar'?toAr(PM_DUR[i]):PM_DUR[i];}
function sceneHTML(i,opts){opts=opts||{};
 const grade=g=>`<div class="grade ${g}"></div>`;
 if(i===0){ /* sunset */
  let pt='';for(let k=0;k<6;k++)pt+=`<i class="wpetal" style="left:${-6+Math.random()*10}%;top:${6+Math.random()*40}%;font-size:${(1.3+Math.random()*1.1).toFixed(1)}vmin;--wd:${(9+Math.random()*7).toFixed(1)}s;animation-delay:${(-Math.random()*11).toFixed(1)}s">${['💮','🌼','🕊️'][k%3]}</i>`;
  let bd='';for(let k=0;k<3;k++)bd+=`<i class="bird" style="--bf:${(16+k*4)}s;animation-delay:${-k*6}s;font-size:${(1+k*.25).toFixed(2)}vmin">🕊️</i>`;
  return `<div class="scene sc-sunset"><div class="zoom"><div class="sky"></div>
   <div class="cloud" style="left:2%;top:12%;width:44%;height:12%;--cd:76s"></div>
   <div class="cloud" style="left:52%;top:6%;width:38%;height:10%;--cd:92s;animation-delay:-30s"></div>
   <div class="cloud" style="left:26%;top:24%;width:30%;height:8%;--cd:64s;animation-delay:-14s;opacity:.7"></div>
   <div class="sun"></div>
   <i class="flare" style="left:31%;top:31%;width:5vmin;height:5vmin"></i><i class="flare" style="left:61%;top:44%;width:2.6vmin;height:2.6vmin"></i>
   <div class="sea"></div><div class="searip"></div>${bd}
   <i class="cpl">🤵👰</i><div class="cplref"></div>${pt}
   <i class="fgleaf" style="inset-inline-start:-8%;bottom:-10%">🌴</i></div>${grade('g-sunset')}</div>`;}
 if(i===1){ /* palace */
  let cn='';for(let k=0;k<6;k++)cn+=`<i class="cndl" style="left:${9+k*15.4}%;animation-delay:${(Math.random()*.3).toFixed(2)}s">🕯️</i>`;
  return `<div class="scene sc-palace"><div class="zoom"><div class="bg"></div>
   <div class="win" style="left:14%"></div><div class="win" style="left:43.5%"></div><div class="win" style="right:14%"></div>
   <div class="wbeam" style="left:12%"></div><div class="wbeam" style="left:42%;animation-delay:-2s"></div><div class="wbeam" style="right:11%;animation-delay:-4s"></div>
   <div class="chand" style="left:8%"><div class="body"></div></div>
   <div class="chand" style="right:8%"><div class="body"></div></div>
   <div class="floor"></div><div class="carpet"></div>
   <div class="refl" style="left:10%"></div><div class="refl" style="right:10%;animation-delay:-2.4s"></div>
   ${cn}</div>${grade('g-palace')}</div>`;}
 if(i===2){ /* garden */
  let rs='';['🌹','💮','🌷','🌹','💮'].forEach((f,k)=>rs+=`<i class="bigfl" style="left:${5+k*20}%;bottom:${2+(k%2)*3}%;font-size:${4.5+(k%3)}vmin;position:absolute;filter:drop-shadow(0 8px 14px rgba(60,40,10,.4))">${f}</i>`);
  let lv='';for(let k=0;k<4;k++)lv+=`<i class="leaf" style="left:${-4+Math.random()*8}%;top:${Math.random()*30}%;font-size:${(1.4+Math.random()).toFixed(1)}vmin;--wd:${(11+Math.random()*6).toFixed(1)}s;animation-delay:${(-Math.random()*12).toFixed(1)}s">🍃</i>`;
  let dp='';for(let k=0;k<3;k++)dp+=`<span class="drop" style="--dx:${(k-1)*3.4}vmin;animation-delay:${(k*.55).toFixed(2)}s"></span>`;
  return `<div class="scene sc-garden"><div class="zoom"><div class="bg"></div><div class="arch"></div>
   <div class="gray" style="left:8%;--rp:6s"></div><div class="gray" style="left:24%;--rp:7.5s;animation-delay:-2s"></div><div class="gray" style="left:40%;--rp:5.5s;animation-delay:-4s"></div>
   <i class="flare" style="left:12%;top:8%;width:9vmin;height:9vmin"></i>
   <div class="fnt-p"></div><div class="jet"></div>${dp}<div class="fnt-b"></div>
   <div class="rip"></div><div class="rip" style="animation-delay:1.6s"></div>
   ${rs}${lv}<i class="bird" style="--bf:14s">🕊️</i><i class="bird" style="--bf:19s;animation-delay:-8s;font-size:1.6vmin">🕊️</i>
   <span class="hero-bf" style="--bp:19s;font-size:2.6vmin;z-index:6"><i class="wings">🦋</i></span>
   <i class="fgrose" style="inset-inline-end:-7%;bottom:-9%">🌹</i></div>${grade('g-garden')}</div>`;}
 if(i===3){ /* palace doors */
  let sp='';for(let k=0;k<7;k++)sp+=`<span class="dspark" style="left:${20+k*10}%;--sd:${(5.5+Math.random()*4).toFixed(1)}s;--sx:${(Math.random()*8-4).toFixed(1)}vmin;animation-delay:${(-Math.random()*8).toFixed(1)}s"></span>`;
  return `<div class="scene sc-doors ${opts.once?'once':''}"><div class="bg"></div>
   <div class="dwrap"><div class="hall"></div><div class="hglow"></div>${sp}
    <div class="door l" style="--dopen:dol"></div><div class="door r" style="--dopen:dor"></div>
    <div class="dframe"></div></div>${grade('g-doors')}</div>`;}
 if(i===4){ /* butterfly tale */
  let pt='';for(let k=0;k<5;k++)pt+=`<i class="wpetal" style="left:${Math.random()*30}%;top:${Math.random()*30}%;font-size:${(1.2+Math.random()).toFixed(1)}vmin;--wd:${(12+Math.random()*6).toFixed(1)}s;animation-delay:${(-Math.random()*12).toFixed(1)}s">🌸</i>`;
  let ff='';for(let k=0;k<5;k++)ff+=`<span class="ffly" style="left:${10+Math.random()*55}%;top:${30+Math.random()*50}%;--ff:${(6+Math.random()*4).toFixed(1)}s;animation-delay:${(-Math.random()*7).toFixed(1)}s"></span>`;
  const bf=(cls,dl)=>`<span class="hero-bf ${cls}" style="--bp:15s;animation-delay:${dl}s"><i class="wings">🦋</i></span>`;
  return `<div class="scene sc-bfly"><div class="bg"></div><div class="glow"></div>
   <i class="bigfl" style="left:12%;bottom:6%;font-size:9vmin">🌹</i>
   <i class="bigfl" style="left:28%;bottom:2%;font-size:6vmin">🌸</i>
   <i class="bigfl" style="left:4%;bottom:1%;font-size:5vmin">🌷</i>
   <div class="bride"></div><i class="earr">✦</i>${pt}${ff}
   ${bf('gh2',.24)}${bf('gh',.12)}${bf('',0)}${grade('g-bfly')}</div>`;}
 if(i===5){ /* festival night */
  let st='';for(let k=0;k<12;k++)st+=`<i style="left:${Math.random()*96}%;top:${Math.random()*40}%;color:#F0DA9A;font-size:${(0.8+Math.random()*0.9).toFixed(1)}vmin;animation:twinkle ${(1.8+Math.random()*2).toFixed(1)}s ease-in-out ${(Math.random()*2).toFixed(1)}s infinite">✦</i>`;
  let ln='';for(let k=0;k<5;k++)ln+=`<i class="lant" style="left:${8+k*19}%;bottom:14%;--lr:${(13+Math.random()*8).toFixed(1)}s;--lx:${(Math.random()*10-5).toFixed(1)}vw;animation-delay:${(-Math.random()*15).toFixed(1)}s">🏮</i>`;
  let fw='',wr='';const cols=['#F0DA9A','#E8A0B4','#9DB4E8','#A0E8C4'];
  for(let f=0;f<4;f++){let sp='';
   for(let k=0;k<10;k++){const ang=k*36*Math.PI/180,r=9+Math.random()*4;
    sp+=`<i style="--fx:${(Math.cos(ang)*r).toFixed(1)}vmin;--fy:${(Math.sin(ang)*r).toFixed(1)}vmin;--fc:${cols[f]};--ft:${(2.4+f*.4).toFixed(1)}s;--fdl:${(f*.9).toFixed(1)}s"></i>`;}
   fw+=`<span class="fw" style="left:${16+f*22}%;top:${14+(f%2)*13}%">${sp}</span>`;
   wr+=`<span class="wref" style="left:${9+f*22}%;--fc:${cols[f]};--ft:${(2.4+f*.4).toFixed(1)}s;--fdl:${(f*.9).toFixed(1)}s"></span>`;}
  return `<div class="scene sc-fest"><div class="bg"></div>${st}${fw}
   <span class="sstar"></span><div class="skyline"></div>
   <div class="water">${wr}<div class="msea" style="position:absolute;inset:0;opacity:.4"></div></div>
   ${ln}${grade('g-fest')}</div>`;}
 if(i===6){ /* moonlight */
  let st='';for(let k=0;k<16;k++)st+=`<i style="left:${Math.random()*96}%;top:${Math.random()*48}%;color:#EFF2FF;font-size:${(0.6+Math.random()*0.8).toFixed(1)}vmin;animation:twinkle ${(1.6+Math.random()*2.4).toFixed(1)}s ease-in-out ${(Math.random()*2.5).toFixed(1)}s infinite">✦</i>`;
  let ff='';for(let k=0;k<6;k++)ff+=`<span class="ffly" style="left:${8+Math.random()*70}%;top:${52+Math.random()*34}%;--ff:${(6+Math.random()*5).toFixed(1)}s;animation-delay:${(-Math.random()*8).toFixed(1)}s"></span>`;
  return `<div class="scene sc-moon"><div class="zoom"><div class="bg"></div>${st}
   <div class="moon"></div>
   <div class="cloud cl-l" style="left:4%;top:16%;width:46%;height:13%"></div>
   <div class="cloud cl-r" style="right:2%;top:22%;width:44%;height:12%"></div>
   <div class="cloud" style="left:30%;top:36%;width:34%;height:9%;opacity:.5;animation:cpartl 36s ease-in-out infinite alternate"></div>
   <div class="hill" style="left:-14%"></div><div class="hill" style="right:-18%;height:22%"></div>
   <i class="tree" style="left:10%">🌲</i><i class="tree" style="left:22%;font-size:6.5vmin;bottom:10%">🌲</i><i class="tree" style="right:14%;font-size:8vmin">🌲</i>
   ${ff}<div class="msea"></div></div>${grade('g-moon')}</div>`;}
 if(i===8){ /* pink dream */
  let hb='';for(let k=0;k<7;k++)hb+=`<i class="hb" style="left:${8+k*13}%;bottom:6%;--lr:${(12+Math.random()*7).toFixed(1)}s;animation-delay:${(-Math.random()*14).toFixed(1)}s">${['💗','🤍','💕','🌸'][k%4]}</i>`;
  let bk='';for(let k=0;k<9;k++){const s=(2+Math.random()*4).toFixed(1);bk+=`<span class="bok" style="left:${(Math.random()*94).toFixed(1)}%;top:${(Math.random()*82).toFixed(1)}%;width:${s}vmin;height:${s}vmin;--bp2:${(4+Math.random()*3).toFixed(1)}s"></span>`;}
  let sp='';for(let k=0;k<12;k++)sp+=`<i class="spk" style="left:${(Math.random()*96).toFixed(1)}%;top:${(Math.random()*70).toFixed(1)}%;font-size:${(0.8+Math.random()).toFixed(1)}vmin;animation-delay:${(Math.random()*2).toFixed(1)}s">✦</i>`;
  return `<div class="scene sc-pink"><div class="zoom"><div class="bg"></div>
   <div class="cloud" style="left:2%;top:14%;width:44%;height:14%;--cd:70s"></div>
   <div class="cloud" style="right:2%;top:24%;width:40%;height:12%;--cd:86s;animation-delay:-30s"></div>
   ${bk}${sp}${hb}
   <i class="rib" style="inset-inline-start:-6%;bottom:-8%">🌸</i><i class="rib" style="inset-inline-end:-6%;bottom:-9%;font-size:13vmin">🌷</i>
   </div>${grade('g-pink')}</div>`;}
 if(i===9){ /* ring glow */
  let sp='';for(let k=0;k<8;k++)sp+=`<span class="sray" style="left:50%;transform:translateX(-50%) rotate(${k*45}deg);transform-origin:top;animation-delay:${(Math.random()*2).toFixed(1)}s"></span>`;
  let st='';for(let k=0;k<10;k++)st+=`<i style="left:${(Math.random()*96).toFixed(1)}%;top:${(Math.random()*44).toFixed(1)}%;color:#F0DA9A;font-size:${(0.7+Math.random()*.8).toFixed(1)}vmin;animation:twinkle ${(1.8+Math.random()*2).toFixed(1)}s ease-in-out ${(Math.random()*2).toFixed(1)}s infinite">✦</i>`;
  return `<div class="scene sc-ring"><div class="bg"></div>${st}
   <div class="ped"></div>
   <div class="ringw">${sp}<div class="band"></div><div class="stone"></div></div>${grade('g-ring')}</div>`;}
 /* fairy dust */
 let mt='';for(let k=0;k<36;k++){const sz=(0.6+Math.random()*1.1).toFixed(2);
  mt+=`<span class="mote" style="width:${sz}vmin;height:${sz}vmin;--mx:${(Math.random()*84-42).toFixed(1)}vmin;--my:${(Math.random()*66-33).toFixed(1)}vmin;--cx:${(Math.random()*7-3.5).toFixed(1)}vmin;--cy:${(Math.random()*7-3.5).toFixed(1)}vmin;--mt:${(4.5+Math.random()*3.5).toFixed(1)}s;--md:${(-Math.random()*6).toFixed(1)}s"></span>`;}
 return `<div class="scene sc-fairy"><div class="bg"></div><div class="bloomc"></div>
  <div class="swirl">${mt}</div>${grade('g-fairy')}</div>`;}
const PALETTES=[null,
 {bg:"#FFF9EC",ac:"#B98A2F",ink:"#3A2B10"},
 {bg:"#2A2118",ac:"#E3C77E",ink:"#F6EBD2"},
 {bg:"#16493E",ac:"#D3AC55",ink:"#F1EADA"},
 {bg:"#FBEFEA",ac:"#C4827A",ink:"#4E2F2A"},
 {bg:"#EFF3EC",ac:"#7C9482",ink:"#2F3E33"},
 {bg:"#EDF1FA",ac:"#5570B8",ink:"#22304F"}];
const FLOURISH='<svg viewBox="0 0 120 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 7 H44 M76 7 H116"/><path d="M52 7c2-4 6-4 8 0s6 4 8 0"/><circle cx="60" cy="7" r="1.6" fill="currentColor"/></svg>';
const CORNER_SVG='<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 37V14C3 7 8 3 14 3h23"/><path d="M9 31V17c0-5 3-8 8-8h14"/><circle cx="9" cy="9" r="2" fill="currentColor"/></svg>';
const Dz=(id,cat,badge,name,sub,tag,bg,ac,ink,foil,orn,corners,layer,def)=>({id,cat,badge,name,sub,tag,bg,ac,ink,foil,orn,corners,layer,def});
const DESIGNS=[
Dz(1,'wed','hot',{ar:'عرس ذهبي فاخر',fr:'Mariage Or Luxe',en:'Luxury Gold Wedding'},{ar:'ليلة العمر',fr:'La nuit d\'une vie',en:'The night of a lifetime'},
 {ar:'فاخر · ذهبي · موسيقى',fr:'Luxe · Doré · Musique',en:'Luxury · Gold · Music'},'#FFF9EC','#B98A2F','#3A2B10',true,'✨','svg','bg-damask',
 {ar:{t:'دعوة زفاف',n:'نور & كريم',d:'14 سبتمبر 2026',p:'قصر الأنوار، تونس',m:'يتشرفان بدعوتكم لمشاركتهما فرحة زفافهما'},
  fr:{t:'Mariage',n:'Nour & Karim',d:'14 · 09 · 2026',p:'Palais El Anouar, Tunis',m:'Nous serions honorés de partager notre bonheur avec vous'},
  en:{t:'Wedding',n:'Nour & Karim',d:'14 · 09 · 2026',p:'El Anouar Palace, Tunis',m:'We would be honored to share our joy with you'}}),
Dz(2,'wed','star',{ar:'عرس عربي ملكي',fr:'Mariage Royal Arabe',en:'Royal Arabic Wedding'},{ar:'على الطراز العربي الأصيل',fr:'Style arabe authentique',en:'Authentic Arabic style'},
 {ar:'كلاسيكي · زمردي · خط عربي',fr:'Classique · Émeraude · Calligraphie',en:'Classic · Emerald · Calligraphy'},'#16493E','#D3AC55','#F1EADA',true,'🕌','svg','bg-zellige',
 {ar:{t:'دعوة زفاف',n:'مريم و يوسف',d:'2 أكتوبر 2026',p:'رياض الأندلس',m:'يتشرفان بدعوتكم لحفل زفافهما'},
  fr:{t:'Mariage',n:'Meriem & Youssef',d:'02 · 10 · 2026',p:'Riad Al Andalus',m:'Ont l\'honneur de vous convier à leur mariage'},
  en:{t:'Wedding',n:'Meriem & Youssef',d:'02 · 10 · 2026',p:'Riad Al Andalus',m:'Have the honor of inviting you to their wedding'}}),
Dz(3,'wed','new',{ar:'عرس أبيض بسيط',fr:'Mariage Blanc Minimal',en:'Minimal White Wedding'},{ar:'بسيط… ويقول كل شيء',fr:'Simple… et tout est dit',en:'Simple… and it says it all'},
 {ar:'بسيط · أنيق · هادئ',fr:'Minimal · Élégant · Calme',en:'Minimal · Elegant · Calm'},'#FCFBF7','#9A8C7B','#3A342C',false,'🕊️','','',
 {ar:{t:'احفظوا التاريخ',n:'أمل & رامي',d:'25 يوليو 2026',p:'دار صبري، نابل',m:'ببساطة، وبكل حب'},
  fr:{t:'Save the date',n:'Amel & Rami',d:'25 · 07 · 2026',p:'Dar Sabri, Nabeul',m:'Simplement, avec amour'},
  en:{t:'Save the date',n:'Amel & Rami',d:'25 · 07 · 2026',p:'Dar Sabri, Nabeul',m:'Simply, with love'}}),
Dz(4,'wed',null,{ar:'عرس الورد',fr:'Mariage Fleuri',en:'Rose Floral Wedding'},{ar:'وردٌ يليق بحكايتهما',fr:'Des roses dignes de leur histoire',en:'Roses worthy of their story'},
 {ar:'زهري · رومانسي · ناعم',fr:'Rose · Romantique · Doux',en:'Blush · Romantic · Soft'},'#FBEFEA','#C4827A','#4E2F2A',false,'🌹','🌸','bg-dots',
 {ar:{t:'دعوة زفاف',n:'هند و زياد',d:'19 سبتمبر 2026',p:'حديقة الياسمين',m:'حضوركم يزيد فرحتنا نورًا 🌸'},
  fr:{t:'Mariage',n:'Hind & Ziad',d:'19 · 09 · 2026',p:'Jardin des Jasmins',m:'Votre présence illuminera notre bonheur 🌸'},
  en:{t:'Wedding',n:'Hind & Ziad',d:'19 · 09 · 2026',p:'Jasmine Garden',m:'Your presence will light up our joy 🌸'}}),
Dz(5,'grad',null,{ar:'تخرّج عصري',fr:'Diplôme Moderne',en:'Modern Graduation'},{ar:'تخرّجت أخيرًا!',fr:'Enfin diplômée !',en:'Finally graduated!'},
 {ar:'عصري · شبابي · كونفيتي',fr:'Moderne · Jeune · Confetti',en:'Modern · Youthful · Confetti'},'#EDF1FA','#5570B8','#22304F',false,'🎓','','bg-confetti',
 {ar:{t:'حفل تخرّج',n:'سلمى · دفعة 2026',d:'11 يوليو 2026',p:'منزل عائلة بن علي',m:'شاركونا فرحة النجاح 🎉'},
  fr:{t:'Remise de diplôme',n:'Salma · Promo 2026',d:'11 · 07 · 2026',p:'Chez la famille Ben Ali',m:'Partagez avec nous la joie de la réussite 🎉'},
  en:{t:'Graduation',n:'Salma · Class of 2026',d:'11 · 07 · 2026',p:'Ben Ali family home',m:'Share the joy of success with us 🎉'}}),
Dz(6,'grad','star',{ar:'تخرّج فاخر داكن',fr:'Diplôme Luxe Sombre',en:'Dark Luxury Graduation'},{ar:'سهرة سوداء بلمسة ذهب',fr:'Soirée noire touchée d\'or',en:'A black night touched with gold'},
 {ar:'داكن · ذهبي · راقٍ',fr:'Sombre · Doré · Chic',en:'Dark · Gold · Chic'},'#1B1710','#E3C77E','#F6EBD2',true,'🎓','svg','bg-stars',
 {ar:{t:'باكالوريا 2026',n:'آدم',d:'12 يوليو 2026',p:'سطح «السماء»',m:'سنوات من الجهد، وليلة من الذهب ✨'},
  fr:{t:'Bac 2026',n:'Adam',d:'12 · 07 · 2026',p:'Rooftop Le Ciel',m:'Des années d\'efforts, une nuit d\'or ✨'},
  en:{t:'Class of 2026',n:'Adam',d:'12 · 07 · 2026',p:'Le Ciel Rooftop',m:'Years of effort, one golden night ✨'}}),
Dz(7,'oth','hot',{ar:'عيد ميلاد مرح',fr:'Anniversaire Joyeux',en:'Birthday Fun'},{ar:'خمس سنوات من الفرح',fr:'Cinq ans de bonheur',en:'Five years of joy'},
 {ar:'مرح · باستيل · بالونات',fr:'Fun · Pastel · Ballons',en:'Fun · Pastel · Balloons'},'#FFF4F0','#E58BA6','#54333E',false,'🎈','🎈','bg-confetti',
 {ar:{t:'عيد ميلاد',n:'لينا',d:'20 أغسطس 2026',p:'حديقة الياسمين',m:'كعكة وألعاب وضحك كثير 🎂'},
  fr:{t:'Anniversaire',n:'Lina',d:'20 · 08 · 2026',p:'Parc des Jasmins',m:'Gâteau, jeux et fous rires 🎂'},
  en:{t:'Birthday',n:'Lina',d:'20 · 08 · 2026',p:'Jasmine Park',m:'Cake, games and lots of laughs 🎂'}}),
Dz(8,'oth',null,{ar:'استقبال مولود',fr:'Baby Shower',en:'Baby Shower'},{ar:'أهلًا بالمولود',fr:'Bienvenue bébé',en:'Welcome little one'},
 {ar:'ناعم · ميرمية · لطيف',fr:'Doux · Sauge · Tendre',en:'Soft · Sage · Sweet'},'#EFF3EC','#7C9482','#2F3E33',false,'☁️','🕊️','bg-dots',
 {ar:{t:'استقبال مولود',n:'صغيرنا الغالي',d:'5 سبتمبر 2026',p:'منزل الجدة فاطمة',m:'حفل استقبال صغيرنا الغالي 🤍'},
  fr:{t:'Baby shower',n:'Notre petit trésor',d:'05 · 09 · 2026',p:'Chez Mamie Fatma',m:'Fêtons l\'arrivée de notre trésor 🤍'},
  en:{t:'Baby shower',n:'Our little treasure',d:'05 · 09 · 2026',p:'Grandma Fatma\'s home',m:'Celebrating our little treasure 🤍'}}),
Dz(9,'oth','new',{ar:'خطوبة أنيقة',fr:'Fiançailles Élégantes',en:'Elegant Engagement'},{ar:'شمبانيا وذهب وبداية حكاية',fr:'Champagne, or et début d\'histoire',en:'Champagne, gold and a story begins'},
 {ar:'شمبانيا · راقٍ · رومانسي',fr:'Champagne · Chic · Romantique',en:'Champagne · Chic · Romantic'},'#F6EDD9','#B98A2F','#4C3A17',true,'🥂','svg','bg-arch',
 {ar:{t:'حفل خطوبة',n:'سارة و آدم',d:'21 نوفمبر 2026',p:'فيلا الشمبانيا',m:'يسعدنا حضوركم حفل خطوبتنا'},
  fr:{t:'Fiançailles',n:'Sara & Adam',d:'21 · 11 · 2026',p:'Villa Champagne',m:'Nous serions ravis de vous compter parmi nous'},
  en:{t:'Engagement',n:'Sara & Adam',d:'21 · 11 · 2026',p:'Champagne Villa',m:'We would love to have you with us'}}),
Dz(10,'oth',null,{ar:'دعوة عربية كلاسيكية',fr:'Invitation Arabe Classique',en:'Classic Arabic Invitation'},{ar:'دعوة كريمة',fr:'Une noble invitation',en:'A gracious invitation'},
 {ar:'كلاسيكي · تراثي · زخارف',fr:'Classique · Héritage · Ornements',en:'Classic · Heritage · Ornate'},'#F6F0E2','#8A6A2B','#4C3A17',false,'🪔','svg','bg-damask',
 {ar:{t:'دعوة كريمة',n:'آل بن صالح',d:'17 سبتمبر 2026',p:'دار المدينة',m:'نتشرف بحضوركم مجلسنا العامر'},
  fr:{t:'Invitation',n:'Famille Ben Salah',d:'17 · 09 · 2026',p:'Dar El Medina',m:'Nous serions honorés de votre présence'},
  en:{t:'Invitation',n:'Ben Salah Family',d:'17 · 09 · 2026',p:'Dar El Medina',m:'We would be honored by your presence'}}),
Dz(11,'wed','new',{ar:'حكاية حب',fr:"Histoire d'amour",en:'A Love Story'},{ar:'دعوة تُروى كقصة… بصوركم وكلماتكم',fr:'Une invitation racontée comme une histoire',en:'An invitation told like a story'},
 {ar:'قصة · مشاهد · صور',fr:'Histoire · Scènes · Photos',en:'Story · Scenes · Photos'},'#FBF3EC','#B98A2F','#4E342B',true,'📖','svg','bg-arch',
 {ar:{t:'حكايتنا',n:'ياسمين & مهدي',d:'3 أكتوبر 2026',p:'دار الحكايات',m:'قبل أن تفتحوا الدعوة… شاهدوا كيف بدأ كل شيء'},
  fr:{t:'Notre histoire',n:'Yasmine & Mehdi',d:'03 · 10 · 2026',p:'Dar El Hikayat',m:"Avant d'ouvrir la carte… voyez où tout a commencé"},
  en:{t:'Our story',n:'Yasmine & Mehdi',d:'03 · 10 · 2026',p:'Dar El Hikayat',m:'Before you open the card… see where it all began'}})
];
DESIGNS.push(Dz(12,'date','new',{ar:'دعوة أول موعد',fr:'Invitation Premier Rendez-vous',en:'First-Date Invitation'},{ar:'ابدآ حكايتكما بأناقة',fr:'Commencez votre histoire avec élégance',en:'Begin your story elegantly'},
 {ar:'رومانسي · باستيل · جريء',fr:'Romantique · Pastel · Audacieux',en:'Romantic · Pastel · Bold'},'#FDEFF4','#C4667F','#5A2A3C',true,'❤️','🌸','bg-dots',
 {ar:{t:'أول موعد',n:'أنا و أنتِ',d:'الجمعة · 8 مساءً',p:'مقهى الغروب',m:'قهوة، وحديث، وربما بداية حكاية… هل تقبلين؟ ☕❤️'},
  fr:{t:'Premier rendez-vous',n:'Toi & Moi',d:'Vendredi · 20h',p:'Café du Coucher',m:'Un café, une discussion, peut-être un début… tu viens ? ☕❤️'},
  en:{t:'First date',n:'You & Me',d:'Friday · 8 PM',p:'Sunset Café',m:'Coffee, a talk, maybe a beginning… will you come? ☕❤️'}}));
DESIGNS[11].pet='💗';
DESIGNS[11].anim=8;
DESIGNS[10].story={
 ar:[{t:'بدأت حكايتنا بسلامٍ بسيط… وابتسامة لم تغب',ph:''},{t:'وكبر الحب حتى صار بيتًا وقلبًا واحدًا',ph:''},{t:'واليوم… نكتب أجمل فصولها، ويسعدنا أن تكونوا معنا',ph:''}],
 fr:[{t:'Notre histoire a commencé par un simple bonjour… et un sourire',ph:''},{t:"L'amour a grandi jusqu'à devenir un seul cœur",ph:''},{t:"Aujourd'hui, nous écrivons le plus beau chapitre — soyez avec nous",ph:''}],
 en:[{t:'Our story began with a simple hello… and a smile',ph:''},{t:'Love grew until two hearts became one',ph:''},{t:'Today we write the most beautiful chapter — be with us',ph:''}]};
DESIGNS[0].pet='✦';DESIGNS[3].pet='🌸';DESIGNS[10].pet='🌸';
const SCRATCH_DEF={ar:{t:'دعوة',n:'نجوم اليوم',d:'01 · 01 · 2027',p:'مكان الحفل',m:'اكتبوا هنا أجمل رسالة ✨'},
 fr:{t:'Invitation',n:'Nos héros du jour',d:'01 · 01 · 2027',p:'Le lieu de la fête',m:'Écrivez ici votre plus beau message ✨'},
 en:{t:'Invitation',n:'Our stars of the day',d:'01 · 01 · 2027',p:'The venue',m:'Write your most beautiful message here ✨'}};

