/* ===== site control bridge ===== */
const LSK={cfg:'farha_cfg',wishes:'farha_wishes',orders:'farha_orders',meta:'farha_meta'};
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
const CFG_DEF={sec:{ultra:1,premium:1,ai:1,sites:1,datef:1,open:1,wishes:1,ready:1},edi:{cd:1,prog:1,dress:1,dir:1,stay:1,rsvp:1},films:{},price:{ultra:199,ai:249,site:149,design:79},wa:'21655787973',d17:'55787973',rib:'32016788101212289120',flouci:'',banner:{on:0,txt:'🎉 عرض افتتاحي هذا الأسبوع'},designs:{},media:{films:{},customFilms:[],vopens:[],customDesigns:[],hideShows:[]}};
function loadCFG(){const cc=lsGet(LSK.cfg,{})||{};const o=JSON.parse(JSON.stringify(CFG_DEF));
 Object.assign(o.sec,cc.sec||{});Object.assign(o.price,cc.price||{});o.wa=cc.wa||CFG_DEF.wa;o.d17=cc.d17||CFG_DEF.d17;
 Object.assign(o.banner,cc.banner||{});o.designs=cc.designs||{};
 Object.assign(o.edi,cc.edi||{});o.films=cc.films||{};
 o.media=Object.assign(JSON.parse(JSON.stringify(CFG_DEF.media)),cc.media||{});return o;}
let CFG=loadCFG();
function saveCFG(){lsSet(LSK.cfg,CFG);if(window.__dbSaveCfg)window.__dbSaveCfg(CFG);toast('حُفظ — سيظهر على الموقع فورًا ✓');}
function ctlExport(){const pub=lsGet(LSK.wishes,[]).filter(w=>w.ok).slice(0,20).map(w=>({txt:w.txt,n:w.n}));
 const obj=Object.assign(JSON.parse(JSON.stringify(CFG)),{pub:pub});
 const js='window.FARHA_CFG='+JSON.stringify(obj)+';';
 try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([js],{type:'text/javascript'}));
  a.download='farha-config.js';a.click();toast('نُزِّل farha-config.js — ارفعوه بجانب ملفات الموقع ✓');}catch(e){toast('تعذّر التنزيل');}}
function ctlSec(k,v){CFG.sec[k]=v?1:0;saveCFG();}
function ctlPrice(k,v){CFG.price[k]=Math.max(0,parseInt(v)||0);saveCFG();}
function ctlWa(v){CFG.wa=(v||'').trim();saveCFG();}
function ctlD17(v){CFG.d17=(v||'').trim();saveCFG();}
function ctlBan(k,v){CFG.banner[k]=(k==='on')?(v?1:0):v;saveCFG();}
/* the four ready-made films, and the sections inside their invitation */
const RDFILMS=[['marble','قصر الرخام'],['oneday','يومًا ما'],['wisteria','ظلال الوستارية'],['rings','خواتم النور']];
const EDISECL=[['cd','ساعة العدّ التنازلي'],['prog','برنامج الحفل + مواقع الفقرات'],['dress','قواعد اللباس'],
 ['dir','الوصول وصفّ السيارات'],['stay','الإقامة'],['rsvp','تأكيد الحضور']];
function ctlEdi(k,v){CFG.edi[k]=v?1:0;saveCFG();}
function ctlFilm(id,k,v){CFG.films[id]=CFG.films[id]||{};
 if(k==='vis')CFG.films[id].vis=!!v;
 else if(k==='price')CFG.films[id].price=Math.max(0,parseInt(v)||0);
 else CFG.films[id][k]=v;
 saveCFG();}
function ctlVis(id,v){CFG.designs[id]=CFG.designs[id]||{};CFG.designs[id].vis=!!v;saveCFG();}
function ctlBadge(id,v){CFG.designs[id]=CFG.designs[id]||{};CFG.designs[id].badge=v;saveCFG();}
function escA(s){return String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
const SECL=[['ready','✦ قسم «دعوات جاهزة» (الأفلام)'],['ultra','✦ قسم «واقعي جدًا»'],['premium','قسم بريميوم'],['ai','سينما AI (داخل بريميوم)'],['sites','مواقع المناسبات'],['datef','دعوة أول موعد التفاعلية'],['open','عروض لحظة الفتح'],['wishes','صندوق التهاني داخل الدعوات']];
function ctlCard(tt,ss,inner){return `<div class="ctlcard"><h3>${tt}</h3>${ss?`<p class="cmut">${ss}</p>`:''}${inner}</div>`;}

/* ===== dynamic content manager ===== */
const AIN=['قبلة الشاطئ الأبدية','فراشة الحب','القصر الملكي الحقيقي','عرس ضوء القمر','رومانسية البندقية','سماء الأحلام'];
const AIE=['🏖️','🦋','👑','🌕','🛶','☁️'];
const SHN=['فيلم سينمائي','تلفاز الثمانينات','بولارويد على الطاولة','بكرة سينما قديمة','أسطوانة ذهبية','فيديوكم الخاص'];
const BADGES=[['','بدون'],['hot','🔥 رواج'],['new','✨ جديد'],['star','⭐ مميّز']];
async function mediaUp(inp,cb){
 const file=inp.files&&inp.files[0];if(!file)return;
 if(file.size>80*1024*1024){toast('الحد الأقصى 80MB');inp.value='';return;}
 if(!window.__dbUpload){toast('الرفع يتطلب تسجيل الدخول السحابي ☁️');inp.value='';return;}
 toast('جارٍ رفع الفيديو… ⏳');
 try{const url=await window.__dbUpload(file,'videos');cb(url);saveCFG();renderContent();toast('رُفع ونُشر لكل الزوّار ✓ ☁️');}
 catch(e){toast('تعذّر الرفع — تأكدوا من إنشاء الحاويات (schema-2)');}
 inp.value='';}
function mFilmUp(ev,i){mediaUp(ev.target,url=>{CFG.media.films[i]={url:url};});}
function mFilmRm(i){delete CFG.media.films[i];saveCFG();renderContent();}
function mAddFilm(ev){const nm=(document.getElementById('mfNm')||{}).value||'',ds=(document.getElementById('mfDs')||{}).value||'',em=(document.getElementById('mfEm')||{}).value||'🎬';
 if(!nm.trim()){toast('أدخلوا اسم الفيلم أولًا');ev.target.value='';return;}
 mediaUp(ev.target,url=>{CFG.media.customFilms.push({nm:nm.trim().slice(0,40),ds:ds.trim().slice(0,120),em:em.trim().slice(0,4)||'🎬',url:url});});}
function mDelFilm(j){CFG.media.customFilms.splice(j,1);saveCFG();renderContent();}
function mAddVopen(ev){const nm=(document.getElementById('mvNm')||{}).value||'';
 if(!nm.trim()){toast('أدخلوا اسم المقدمة أولًا');ev.target.value='';return;}
 mediaUp(ev.target,url=>{CFG.media.vopens.push({nm:nm.trim().slice(0,30),url:url});});}
function mDelVopen(i){CFG.media.vopens.splice(i,1);saveCFG();renderContent();}
function mAddDesign(){const g=id=>(document.getElementById(id)||{}).value||'';
 const nm=g('mdNm').trim();if(!nm){toast('أدخلوا اسم القالب');return;}
 CFG.media.customDesigns.push({nm:nm.slice(0,40),em:(g('mdEm')||'✨').slice(0,4),cat:g('mdCat')||'wed',
  bg:g('mdBg')||'#FFF9EC',ac:g('mdAc')||'#B98A2F',ink:g('mdInk')||'#3A2B10',badge:g('mdBadge')||''});
 saveCFG();renderContent();toast('أُضيف القالب ونُشر ✓');}
function mDelDesign(i){CFG.media.customDesigns.splice(i,1);saveCFG();renderContent();}
function mShowTgl(i,on){const h=CFG.media.hideShows;const ix=h.indexOf(i);
 if(on&&ix>-1)h.splice(ix,1);if(!on&&ix===-1)h.push(i);saveCFG();}
/* the ready-made films, and the sections inside their invitation */
function readyView(){
 const F=CFG.films||{},E=CFG.edi||{};
 return ctlCard('🎞️ الدعوات الجاهزة — الأفلام',
  'أخفوا فيلمًا، أو غيّروا اسمه وسعره. الألوان تُستخرج من الفيديو تلقائيًا.',
  RDFILMS.map(([id,nm])=>{const o=F[id]||{};
   return `<div class="ctlrow" style="flex-wrap:wrap;gap:8px">
    <span style="min-width:9rem">${nm}</span>
    <span class="sw-toggle ${o.vis===false?'':'on'}" onclick="ctlFilm('${id}','vis',${o.vis===false});renderContent()"></span>
    <input style="flex:1;min-width:7rem" placeholder="${escA(nm)}" value="${escA(o.nm||'')}"
     onchange="ctlFilm('${id}','nm',this.value)">
    <input type="number" style="width:5.5rem" placeholder="${CFG.price.ultra}" value="${o.price||''}"
     onchange="ctlFilm('${id}','price',this.value)">
   </div>`;}).join(''))
 + ctlCard('🧩 أقسام الدعوة','ما يظهر داخل الدعوة نفسها — بلا أي شيء عن الطعام أو الحساسية.',
   EDISECL.map(([k,l])=>`<div class="ctlrow"><span>${l}</span>
    <span class="sw-toggle ${E[k]===0?'':'on'}" onclick="ctlEdi('${k}',${E[k]===0});renderContent()"></span>
   </div>`).join(''));}

function mediaView(){
 const M=CFG.media;const cloud=window.__dbMode?'':`<p class="cmut" style="color:#A33">⚠️ لرفع الفيديوهات سجّلوا الدخول السحابي أولًا (الأزرار الأخرى تعمل).</p>`;
 return `<div class="cgrid">`+readyView()+
  ctlCard('🎬 أفلام سينما AI — فيديوهاتها','ولّدوا الفيديو بأزرار «نسخ البرومبت» في الموقع، ثم ارفعوه هنا ليظهر فورًا لكل الزوّار'+(cloud?'':''),
   cloud+AIN.map((n,i)=>{const has=M.films[i]&&M.films[i].url;
    return `<div class="ctlrow"><span>${AIE[i]} ${n} ${has?'<b style="color:#2F6B3A">· سحابي ✓</b>':''}</span>
     <span style="display:flex;gap:6px">
      <label class="cmini">${has?'استبدال':'رفع فيديو'}<input class="hiddenup" type="file" accept="video/*" onchange="mFilmUp(event,${i})"></label>
      ${has?`<button class="cmini del" onclick="mFilmRm(${i})">إزالة</button>`:''}</span></div>`;}).join(''))+
  ctlCard('➕ أفلام جديدة من إبداعكم','تُضاف إلى رف السينما في الموقع مع زر السلة تلقائيًا',
   M.customFilms.map((f,j)=>`<div class="ctlrow"><span>${escA(f.em)} ${escA(f.nm)}</span><button class="cmini del" onclick="mDelFilm(${j})">حذف</button></div>`).join('')+
   `<input class="cinp" id="mfNm" placeholder="اسم الفيلم (مثال: ليلة الحناء)" style="margin-top:10px">
    <input class="cinp" id="mfDs" placeholder="وصف قصير" style="margin:8px 0">
    <div style="display:flex;gap:8px"><input class="cinp" id="mfEm" placeholder="رمز 🎬" style="width:90px">
    <label class="cmini" style="flex:1;text-align:center;padding:10px">اختيار الفيديو والرفع 📤<input class="hiddenup" type="file" accept="video/*" onchange="mAddFilm(event)"></label></div>`)+
  ctlCard('🎥 مقدمات فتح بالفيديو (أنيميشن جديدة)','تظهر كخيارات «لحظة فتح» إضافية في محرر الدعوات — الضيف يلمس فيُعرض فيديوكم ثم تظهر الدعوة',
   M.vopens.map((v,i)=>`<div class="ctlrow"><span>🎥 ${escA(v.nm)}</span><button class="cmini del" onclick="mDelVopen(${i})">حذف</button></div>`).join('')+
   `<div style="display:flex;gap:8px;margin-top:10px"><input class="cinp" id="mvNm" placeholder="اسم المقدمة (مثال: افتتاح ملكي)">
    <label class="cmini" style="white-space:nowrap;padding:10px">رفع 📤<input class="hiddenup" type="file" accept="video/*" onchange="mAddVopen(event)"></label></div>`)+
  ctlCard('🖼️ قوالب دعوات جديدة','قالب جديد بألوانكم يظهر في المعرض والمحرر فورًا — بلا أي كود',
   M.customDesigns.map((d,i)=>`<div class="ctlrow"><span>${escA(d.em)} ${escA(d.nm)}
     <i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${escA(d.bg)};border:1px solid #ddd"></i>
     <i style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${escA(d.ac)}"></i></span>
    <button class="cmini del" onclick="mDelDesign(${i})">حذف</button></div>`).join('')+
   `<input class="cinp" id="mdNm" placeholder="اسم القالب (مثال: ليالي الياسمين)" style="margin-top:10px">
    <div style="display:flex;gap:8px;margin:8px 0"><input class="cinp" id="mdEm" placeholder="رمز ✨" style="width:80px">
     <select class="csel" id="mdCat" style="flex:1"><option value="wed">عرس</option><option value="grad">تخرج</option><option value="oth">مناسبات أخرى</option></select>
     <select class="csel" id="mdBadge" style="flex:1">${BADGES.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div>
    <div class="ctlrow"><span>الخلفية</span><input type="color" id="mdBg" value="#FFF9EC"></div>
    <div class="ctlrow"><span>الذهبي/التمييز</span><input type="color" id="mdAc" value="#B98A2F"></div>
    <div class="ctlrow"><span>الحبر</span><input type="color" id="mdInk" value="#3A2B10"></div>
    <button class="cbtn" style="margin-top:10px;width:100%" onclick="mAddDesign()">إضافة القالب ونشره ✦</button>`)+
  ctlCard('📺 أنماط عروض مواقع المناسبات','أخفوا أي نمط عرض لا يناسبكم',
   SHN.map((n,i)=>`<label class="ctlrow"><span>${n}</span><input type="checkbox" ${M.hideShows.includes(i)?'':'checked'} onchange="mShowTgl(${i},this.checked)"></label>`).join(''))+
  `</div>`;}
function ctlView(){
 const meta=lsGet(LSK.meta,null);
 const designs=(meta&&meta.designs&&meta.designs.length)?meta.designs:TPL.map(x=>({id:x.id,name:x.n,em:x.em}));
 const B=[['','بدون'],['hot','🔥 رواج'],['new','✨ جديد'],['star','⭐ مميّز']];
 const pr=(k,l)=>`<div class="ctlrow"><span>${l}</span><span style="display:flex;gap:6px;align-items:center"><input class="cinp num" type="number" min="0" value="${CFG.price[k]}" onchange="ctlPrice('${k}',this.value)"> د.ت</span></div>`;
 return `<div class="cgrid">`+
  ctlCard('🧩 أقسام الموقع','فعّلوا أو أخفوا أقسامًا كاملة — يتحدّث الموقع فورًا',
   SECL.map(([k,l])=>`<label class="ctlrow"><span>${l}</span><input type="checkbox" ${CFG.sec[k]?'checked':''} onchange="ctlSec('${k}',this.checked)"></label>`).join(''))+
  ctlCard('💰 الأسعار',' تُحدَّث أزرار الطلب على الموقع مباشرة',pr('design','القوالب الأساسية (زر الشراء في المحرر والمعرض)')+pr('ultra','دعوات «واقعي جدًا»')+pr('ai','أفلام سينما AI')+pr('site','مواقع المناسبات'))+
  ctlCard('📲 الدفع D17 + واتساب للتواصل','عند كل «اطلبوا»: يدفع الزبون عبر D17 (رقمكم + المبلغ + إرسال الإثبات)، وواتساب مخصص للاستفسارات والشكاوى — مع فقاعة محادثة عائمة في الموقع. يُسجَّل كل طلب في «الطلبات»',
   `<div class="ctlrow"><span>رقم واتساب (دولي، بدون +)</span></div>
    <input class="cinp" style="direction:ltr;text-align:left" placeholder="21655787973" value="${escA(CFG.wa)}" onchange="ctlWa(this.value)">
    <div class="ctlrow" style="margin-top:8px"><span>رقم D17 (للتحويلات)</span></div>
    <input class="cinp" style="direction:ltr;text-align:left" placeholder="55787973" value="${escA(CFG.d17)}" onchange="ctlD17(this.value)">`)+
  ctlCard('📣 شريط إعلان أعلى الموقع','',
   `<label class="ctlrow"><span>تفعيل الشريط</span><input type="checkbox" ${CFG.banner.on?'checked':''} onchange="ctlBan('on',this.checked)"></label>
    <input class="cinp" placeholder="نص الإعلان…" value="${escA(CFG.banner.txt)}" onchange="ctlBan('txt',this.value)">`)+
  ctlCard('🖼️ القوالب: الظهور والشارات','أخفوا أي قالب أو غيّروا شارته (رواج/جديد/مميّز) على الموقع',
   designs.map(d=>{const o=CFG.designs[d.id]||{};const vis=o.vis!==false;const bd=(o.badge!==undefined?o.badge:'');
    return `<div class="ctlrow"><span>${d.em||'🎴'} ${escA(d.name)}</span><span style="display:flex;gap:8px;align-items:center">
     <select class="csel" onchange="ctlBadge(${d.id},this.value)">${B.map(([v,l])=>`<option value="${v}" ${bd===v?'selected':''}>${l}</option>`).join('')}</select>
     <label style="display:flex;gap:5px;align-items:center;font-size:.72rem">ظاهر <input type="checkbox" ${vis?'checked':''} onchange="ctlVis(${d.id},this.checked)"></label></span></div>`;}).join(''))+
  `</div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="cbtn" onclick="saveCFG()">💾 حفظ (معاينة حيّة في متصفحكم)</button>
  <button class="cbtn" style="background:linear-gradient(120deg,#2F6B3A,#1E4A28);color:#fff" onclick="ctlExport()">🌍 نشر للجميع — تنزيل farha-config.js</button></div>
  <p class="chint">🔎 <b>معاينة حيّة:</b> الحفظ يطبّق التغييرات فورًا على الموقع في متصفحكم (نفس النطاق).<br>
  🌍 <b>النشر لكل الزوّار:</b> اضغطوا «نشر للجميع» ثم ارفعوا ملف <b>farha-config.js</b> في نفس مجلد الاستضافة (بجانب ملفَي الموقع) — تسري الأسعار والأقسام والقوالب والإعلان والتهاني المنشورة على كل زائر.<br>
  📥 تنبيه صادق: صندوقا «الطلبات والتهاني الواردة» يلتقطان ما يحدث على هذا المتصفح/النطاق فقط — الطلبات من أجهزة الزبائن تصلكم عبر واتساب، أمّا جمعها تلقائيًا في اللوحة فيحتاج خادمًا (Backend) يمكن بناؤه لاحقًا.</p>`;}
function realWishesHTML(){if(window.__dbWishesHTML)return window.__dbWishesHTML();const a=lsGet(LSK.wishes,[]);if(!a.length)return '';
 return `<div class="ctlcard" style="margin-bottom:16px"><h3>📥 تهانٍ واردة من الموقع (${a.length})</h3><p class="cmut">انشروا التهنئة لتظهر لكل الضيوف في الدعوات</p>`+
  a.slice(0,40).map(w=>`<div class="ctlrow"><span>“${escA(w.txt)}” — <b>${escA(w.n||'ضيف')}</b></span>
   <span style="display:flex;gap:6px"><button class="cmini ${w.ok?'ok':''}" onclick="rwOk(${w.ts})">${w.ok?'منشورة ✓':'نشر'}</button>
   <button class="cmini del" onclick="rwDel(${w.ts})">حذف</button></span></div>`).join('')+`</div>`;}
function rwOk(ts){const a=lsGet(LSK.wishes,[]);const w=a.find(x=>x.ts===ts);if(w){w.ok=!w.ok;lsSet(LSK.wishes,a);renderContent();toast(w.ok?'نُشرت على الموقع ✓':'أُخفيت عن الموقع');}}
function rwDel(ts){lsSet(LSK.wishes,lsGet(LSK.wishes,[]).filter(x=>x.ts!==ts));renderContent();toast('حُذفت');}
function realOrdersHTML(){if(window.__dbOrdersHTML)return window.__dbOrdersHTML();const a=lsGet(LSK.orders,[]);if(!a.length)return '';
 const sum=a.reduce((s,o)=>s+(+o.price||0),0);
 return `<div class="ctlcard" style="margin-bottom:16px"><h3>🛎️ طلبات واردة من الموقع (${a.length}) — ${sum} د.ت</h3>`+
  a.slice(0,40).map(o=>`<div class="ctlrow"><span><b>${o.id}</b> · ${escA(o.item)} — ${o.price} د.ت<br><small style="color:#8A7A63">${new Date(o.ts).toLocaleString('ar-TN')}</small></span>
   <select class="csel" onchange="roStatus(${o.ts},this.value)">${['جديد','مدفوع','مكتمل','ملغى'].map(s=>`<option ${o.st===s?'selected':''}>${s}</option>`).join('')}</select></div>`).join('')+`</div>`;}
function roStatus(ts,v){const a=lsGet(LSK.orders,[]);const o=a.find(x=>x.ts===ts);if(o){o.st=v;lsSet(LSK.orders,a);toast('حُدّثت حالة الطلب → '+v);renderContent();}}
window.addEventListener('storage',function(e){if(e&&e.key&&(e.key===LSK.wishes||e.key===LSK.orders||e.key===LSK.meta)){try{renderContent()}catch(x){}}});

const NAV=[['over','📊','نظرة عامة'],['ctl','🎛️','التحكم بالموقع'],['media','🎬','المحتوى والأفلام'],['orders','🛒','الطلبات'],['inv','💌','الدعوات'],['tpl','🖼️','القوالب والأفلام'],['guests','👥','الضيوف والردود'],['wish','💬','التهاني'],['ana','📈','التحليلات'],['set','⚙️','الإعدادات']];
function newOrdersCount(){return ORDERS.filter(o=>o.d<1&&o.status==='جديد').length;}
function shell(inner,title){
 return `<div class="layout">
 <aside class="side ${S.side?'open':''}">
  <div class="logo"><b>فرحة</b><small>لوحة التحكم</small></div>
  ${NAV.map(([k,ic,l])=>`<button class="nav-item ${S.view===k?'on':''}" onclick="go('${k}')">
    <span class="ic">${ic}</span>${l}${k==='orders'&&newOrdersCount()?`<span class="pill">${toAr(newOrdersCount())}</span>`:''}</button>`).join('')}
  <div class="foot"><a class="site-link" href="./" target="_blank">🌐 فتح الموقع</a></div>
 </aside>
 <div class="main">
  <div class="top">
   <button class="burger" onclick="S.side=!S.side;render()">☰</button>
   <h1>${title}</h1>
   <div class="search">🔎<input placeholder="ابحثوا في الطلبات والدعوات…" value="${esc(S.q)}" oninput="S.q=this.value;renderContent()"></div>
   <div style="position:relative">
    <button class="bell" onclick="S.notif=!S.notif;render()">🔔<i></i></button>
    <div class="notif ${S.notif?'open':''}">${NOTIFS.map(n=>`<div class="n"><span>${n.em}</span><div><b>${n.b}</b><span>${n.s}</span></div></div>`).join('')}</div>
   </div>
   <div class="avatar">أ</div>
  </div>
  <div class="content" id="content">${inner}</div>
 </div></div>`;}

;

