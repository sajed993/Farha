/* ===== site control bridge ===== */
const LSK={cfg:'farha_cfg',wishes:'farha_wishes',orders:'farha_orders',meta:'farha_meta'};
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
const CFG_DEF={sec:{ultra:0,premium:0,ai:0,sites:0,datef:0,open:0,wishes:0,cats:0,gallery:0,design:0,ready:1,offers:1},edi:{cd:1,prog:1,dress:1,dir:1,stay:1,rsvp:1},films:{},offers:{readyPrice:99,readyWas:110,readyRevs:3,readyDays:2,signPrice:249,signWas:0,signRevs:5,signDays:7,ribbonOn:1,noteOn:1,txt:{}},envStyle:'full',env:{classic:1,full:1,macro:1,silk:1,press:1},vid:{site:'full',customer:'full'},price:{ultra:199,ai:249,site:149,design:79,ready:99,readyWas:110},wa:'21655787973',d17:'55787973',rib:'32016788101212289120',flouci:'',banner:{on:0,txt:'🎉 عرض افتتاحي هذا الأسبوع'},designs:{},media:{films:{},customFilms:[],vopens:[],customDesigns:[],hideShows:[],readyFilms:[]}};
function loadCFG(){const cc=lsGet(LSK.cfg,{})||{};const o=JSON.parse(JSON.stringify(CFG_DEF));
 Object.assign(o.sec,cc.sec||{});Object.assign(o.price,cc.price||{});o.wa=cc.wa||CFG_DEF.wa;o.d17=cc.d17||CFG_DEF.d17;
 Object.assign(o.banner,cc.banner||{});o.designs=cc.designs||{};
 Object.assign(o.edi,cc.edi||{});o.films=cc.films||{};
 Object.assign(o.offers,cc.offers||{});
 if(cc.envStyle)o.envStyle=cc.envStyle;Object.assign(o.env,cc.env||{});
 Object.assign(o.vid,cc.vid||{});
 o.media=Object.assign(JSON.parse(JSON.stringify(CFG_DEF.media)),cc.media||{});return o;}
let CFG=loadCFG();
function saveCFG(){CFG.v=4;lsSet(LSK.cfg,CFG);if(window.__dbSaveCfg)window.__dbSaveCfg(CFG);toast('حُفظ — سيظهر على الموقع فورًا ✓');}
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
/* Derived from the shared catalogue rather than copied from it. The copy that
   used to live here fell four films behind before anyone noticed, so there is
   no copy any more — add a film anywhere and it appears in every panel. */
const RDCATNAME={wed:'أعراس',henna:'ليالي الحنّة',bday:'أعياد ميلاد',
 baby:'مواليد',grad:'تخرّج',save:'احفظوا التاريخ'};
function rdFilms(){return readyCatalogue().map(f=>
 [f.id, f.name.ar||f.id, RDCATNAME[f.cat]||f.cat, !!f._custom]);}
Object.defineProperty(window,'RDFILMS',{get:rdFilms});
const EDISECL=[['cd','ساعة العدّ التنازلي'],['prog','برنامج الحفل + مواقع الفقرات'],['dress','قواعد اللباس'],
 ['dir','الوصول وصفّ السيارات'],['stay','الإقامة'],['rsvp','تأكيد الحضور']];
function ctlEdi(k,v){CFG.edi[k]=v?1:0;saveCFG();}
/* the five envelope styles: one is active, any can be switched off */
const ENVL=[['full','الظرف الكامل','الشاشة كلها ظرف، وكل طيّة يتبعها خيط ذهبي'],
 ['macro','اللقطة القريبة','كاميرا قريبة جدًا من الشمع — الأجرأ'],
 ['silk','جيب الحرير','حرير منسوج بلون الفيلم، والبطاقة ترتفع منه'],
 ['press','النقش الغائر','مونوغرام غائر في الورق وحلقة ذهبية — الأهدأ'],
 ['classic','الظرف الكلاسيكي','الظرف الأصلي، بطاقة في منتصف الشاشة']];
function ctlEnvOn(k,v){CFG.env[k]=v?1:0;
 if(!v&&CFG.envStyle===k)CFG.envStyle='classic';
 saveCFG();}
function ctlEnvPick(k){if(CFG.env[k]===0)CFG.env[k]=1;CFG.envStyle=k;saveCFG();}

/* ── how the film is shown inside the invitation ──
   Two scopes: our own ready films, and invitations customers build. Nothing is
   saved until confirmed; the preview runs the real site in an iframe so what
   you see is what ships, not a drawing of it. */
const VIDL=[['full','اللوح الكامل','الفيلم يملأ القسم والنص فوقه — الحالي'],
 ['window','النافذة','مركّب على الورق كصورة مؤطّرة بحافة ذهبية'],
 ['arch','المحراب','داخل قوس أندلسي — الأقوى هويةً'],
 ['medal','المدالية','دائرة محاطة بحلقة ذهبية'],
 ['split','الشطر','الفيلم أعلى والورق أسفل — الأوضح قراءةً'],
 ['band','الشريط السينمائي','شريط عريض في المنتصف'],
 ['duo','ثنائي اللون','أبيض وأسود مصبوغ بلوني اللوحة']];
const VIDSCOPE=[['site','أفلام الموقع','الدعوات الجاهزة التي نعرضها'],
 ['customer','فيديوهات الزبائن','الدعوات التي يبنيها الزبون بفيديو خاص']];
/* pending choice per scope, applied only on confirm */
let VIDTRY={site:null,customer:null};
let VIDFILM='marble', VIDSEC='hall';
function vidPick(scope,k){VIDTRY[scope]=k;renderContent();}
function vidConfirm(scope){
 const k=VIDTRY[scope];if(!k)return;
 CFG.vid[scope]=k;VIDTRY[scope]=null;saveCFG();renderContent();}
function vidCancel(scope){VIDTRY[scope]=null;renderContent();}
function vidFilm(v){VIDFILM=v;renderContent();}
function vidSec(v){VIDSEC=v;renderContent();}
function vidView(){
 return VIDSCOPE.map(([scope,nm,ds])=>{
  const cur=CFG.vid[scope]||'full';
  const tryK=VIDTRY[scope];
  const shown=tryK||cur;
  const url='index.html?vidPreview='+encodeURIComponent(VIDFILM)
   +'&vidStyle='+encodeURIComponent(shown)+'&vidSec='+encodeURIComponent(VIDSEC)
   +'&_='+shown+VIDFILM+VIDSEC;
  return ctlCard('🎞️ عرض الفيلم — '+nm,ds+'. اضغطوا على شكل لتجرّبوه في المعاينة، ثم أكّدوا.',
   `<div class="vidpick">${VIDL.map(([k,n,d])=>`
     <button class="vidopt ${shown===k?'on':''} ${cur===k?'cur':''}" onclick="vidPick('${scope}','${k}')">
      <b>${n}</b><span>${d}</span>${cur===k?'<i>الحالي</i>':''}</button>`).join('')}</div>
    <div class="vidprev">
     <div class="vidprev-ctl">
      <select onchange="vidFilm(this.value)">${RDFILMS.map(([id,fn])=>
        `<option value="${id}" ${VIDFILM===id?'selected':''}>${fn}</option>`).join('')}</select>
      <select onchange="vidSec(this.value)">${[['hero','الغلاف'],['hall','الدعوة'],
        ['msg','الرسالة'],['venue','المكان'],['prog','البرنامج']].map(([v,n])=>
        `<option value="${v}" ${VIDSEC===v?'selected':''}>${n}</option>`).join('')}</select>
      <span class="cmut" style="font-size:.76rem">معاينة حيّة من الموقع نفسه</span>
     </div>
     <div class="vidphone"><iframe src="${url}" title="preview" loading="lazy"></iframe></div>
    </div>
    ${tryK&&tryK!==cur?`<div class="vidconfirm">
      <span>تجربة: <b>${VIDL.find(v=>v[0]===tryK)[1]}</b> — غير محفوظ بعد</span>
      <span style="display:flex;gap:8px">
       <button class="act gold" onclick="vidConfirm('${scope}')">تأكيد وحفظ</button>
       <button class="act" onclick="vidCancel('${scope}')">إلغاء</button>
      </span></div>`:''}`);
 }).join('');}
function ctlFilm(id,k,v){CFG.films[id]=CFG.films[id]||{};
 if(k==='vis')CFG.films[id].vis=!!v;
 else if(k==='price')CFG.films[id].price=Math.max(0,parseInt(v)||0);
 else CFG.films[id][k]=v;
 saveCFG();}
function ctlVis(id,v){CFG.designs[id]=CFG.designs[id]||{};CFG.designs[id].vis=!!v;saveCFG();}
function ctlBadge(id,v){CFG.designs[id]=CFG.designs[id]||{};CFG.designs[id].badge=v;saveCFG();}
function escA(s){return String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
const SECL=[['ready','✦ قسم «دعوات جاهزة» (الأفلام)'],
 ['offers','✦ قسم الباقتين (المجموعة / التوقيع)'],
 ['cats','المناسبات'],['gallery','معرض القوالب'],
 ['design','محرّر «صمّم دعوتك» وأزراره'],['ultra','✦ قسم «واقعي جدًا»'],['premium','قسم بريميوم'],['ai','سينما AI (داخل بريميوم)'],['sites','مواقع المناسبات'],['datef','دعوة أول موعد التفاعلية'],['open','عروض لحظة الفتح'],['wishes','صندوق التهاني داخل الدعوات']];
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
/* ── building a new ready invitation from the dashboard ── */
function rdCustom(){CFG.media.readyFilms=CFG.media.readyFilms||[];return CFG.media.readyFilms;}
function rdSlug(v){return String(v||'').trim().toLowerCase()
 .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24);}
function rdNewSet(i,k,v){const L=rdCustom();if(!L[i])return;L[i][k]=v;saveCFG();}
function rdNewAdd(){
 const L=rdCustom();
 let id='film-'+(L.length+1), n=2;
 while(readyCatalogue().some(f=>f.id===id)){id='film-'+(L.length+n);n++;}
 L.push({id:id,cat:'wed',v:'',p:'',nameAr:'دعوة جديدة',
   sw0:'#3E3020',sw1:'#AE7E70',sw2:'#EFDFC2'});
 saveCFG();renderContent();
 toast('أُضيفت دعوة — ارفعوا فيديوها لتظهر على الموقع');}
function rdNewDel(i){const L=rdCustom();const f=L[i];
 if(f&&CFG.films&&CFG.films[f.id])delete CFG.films[f.id];
 L.splice(i,1);saveCFG();renderContent();toast('حُذفت ✓');}
function rdNewUp(ev,i,field){
 mediaUp(ev.target,url=>{const L=rdCustom();if(L[i])L[i][field]=url;});}
/* a poster grabbed from the film itself, so a new invitation is never blank */
function rdGrabPoster(i){
 const L=rdCustom(),f=L[i];
 if(!f||!f.v){toast('ارفعوا الفيديو أولاً');return;}
 const v=document.createElement('video');
 v.src=f.v;v.muted=true;v.crossOrigin='anonymous';v.preload='auto';
 v.onloadeddata=()=>{v.currentTime=Math.min(1.2,(v.duration||2)/2);};
 v.onseeked=()=>{try{
   const c=document.createElement('canvas');
   c.width=v.videoWidth;c.height=v.videoHeight;
   c.getContext('2d').drawImage(v,0,0);
   f.p=c.toDataURL('image/jpeg',.82);saveCFG();renderContent();
   toast('أُخذت صورة الغلاف ✓');
  }catch(e){toast('تعذّر أخذ الصورة — ارفعوها يدويًا');}};
 v.onerror=()=>toast('تعذّر قراءة الفيديو');}

function newFilmsView(){
 const L=rdCustom();
 const cats=Object.keys(RDCATNAME);
 return ctlCard('➕ دعوات جديدة من عندكم',
  'ارفعوا فيديو واختاروا ألوانه — تظهر على الرفّ مع البقية، '
  +'وتجدونها في كل اللوحات الأخرى فورًا.',
  (L.length?L.map((f,i)=>`<div class="filmrow ${f.v?'':'off'}">
    <div class="filmrow-h">
     <b>${escA(f.nameAr||f.id)}</b>
     <em>${RDCATNAME[f.cat]||f.cat}</em>
     <span class="filmrow-st">${f.v?'جاهز':'بلا فيديو'}</span>
     <button class="txdel" onclick="rdNewDel(${i})" title="حذف">×</button>
    </div>
    <div class="filmrow-g">
     <label>الاسم (عربي)<input value="${escA(f.nameAr||'')}"
      oninput="rdNewSet(${i},'nameAr',this.value)"></label>
     <label>Nom (FR)<input value="${escA(f.nameFr||'')}"
      oninput="rdNewSet(${i},'nameFr',this.value)"></label>
     <label>Name (EN)<input value="${escA(f.nameEn||'')}"
      oninput="rdNewSet(${i},'nameEn',this.value)"></label>
     <label>المناسبة<select onchange="rdNewSet(${i},'cat',this.value);renderContent()">
      ${cats.map(c=>`<option value="${c}" ${f.cat===c?'selected':''}>${RDCATNAME[c]}</option>`).join('')}
     </select></label>
     <label>الوصف<input value="${escA(f.blurbAr||'')}"
      oninput="rdNewSet(${i},'blurbAr',this.value)"></label>
     <label>رابط الموسيقى<input value="${escA(f.snd||'')}" placeholder="/media/snd/...webm"
      oninput="rdNewSet(${i},'snd',this.value)"></label>
     <label>لون الحبر<input type="color" value="${f.sw0||'#3E3020'}"
      oninput="rdNewSet(${i},'sw0',this.value)"></label>
     <label>لون اللمسة<input type="color" value="${f.sw1||'#AE7E70'}"
      oninput="rdNewSet(${i},'sw1',this.value)"></label>
     <label>لون الورق<input type="color" value="${f.sw2||'#EFDFC2'}"
      oninput="rdNewSet(${i},'sw2',this.value)"></label>
    </div>
    <div class="filmup">
     <label class="act">${f.v?'تغيير الفيديو':'↑ ارفعوا الفيديو'}
      <input type="file" accept="video/*" hidden onchange="rdNewUp(event,${i},'v')"></label>
     <label class="act">${f.p?'تغيير الغلاف':'↑ صورة الغلاف'}
      <input type="file" accept="image/*" hidden onchange="rdNewUp(event,${i},'p')"></label>
     <button class="act" onclick="rdGrabPoster(${i})">التقاط الغلاف من الفيديو</button>
     ${f.v?`<a class="act gold" href="index.html?vidPreview=${f.id}&vidSec=hall" target="_blank">معاينة ↗</a>`:''}
    </div>
   </div>`).join('')
   :'<p class="cmut">لا دعوات مضافة بعد.</p>')
  +`<button class="act gold" onclick="rdNewAdd()">+ دعوة جديدة</button>`);}

function ctlPriceReady(k,v){CFG.price[k]=Math.max(0,parseInt(v)||0);saveCFG();}
function readyView(){
 const F=CFG.films||{},E=CFG.edi||{};
 const envOpt=(cur)=>ENVL.map(([k,n])=>
   `<option value="${k}" ${cur===k?'selected':''}>${n}</option>`).join('');
 const vidOpt=(cur)=>VIDL.map(([k,n])=>
   `<option value="${k}" ${cur===k?'selected':''}>${n}</option>`).join('');
 return newFilmsView()
 + ctlCard('💰 سعر الدعوات الجاهزة',
  'السعر المعروض والسعر المشطوب فوقه. اجعلوا المشطوب صفرًا لإخفاء الخصم.',
  `<div class="f-row"><label>السعر الحالي (د.ت)</label>
    <input type="number" value="${CFG.price.ready||99}"
     onchange="ctlPriceReady('ready',this.value);renderContent()"></div>
   <div class="f-row"><label>السعر قبل الخصم (د.ت)</label>
    <input type="number" value="${CFG.price.readyWas||0}"
     onchange="ctlPriceReady('readyWas',this.value);renderContent()"></div>`)
 + ctlCard('🎞️ الدعوات الجاهزة — كل فيلم على حدة',
  'لكل فيلم: إظهاره أو إخفاؤه، اسمه، سعره الخاص، شكل ظرفه، وطريقة عرض فيلمه. '
  +'اتركوا «الافتراضي» ليتبع الإعداد العام.',
  RDFILMS.map(([id,nm,cat])=>{const o=F[id]||{};
   return `<div class="filmrow ${o.vis===false?'off':''}">
    <div class="filmrow-h">
     <span class="sw-toggle ${o.vis===false?'':'on'}"
      onclick="ctlFilm('${id}','vis',${o.vis===false});renderContent()"></span>
     <b>${nm}</b><em>${cat}</em>
     <span class="filmrow-st">${o.vis===false?'مخفي':'ظاهر'}</span>
    </div>
    <div class="filmrow-g">
     <label>الاسم<input placeholder="${escA(nm)}" value="${escA(o.nm||'')}"
      onchange="ctlFilm('${id}','nm',this.value)"></label>
     <label>السعر<input type="number" placeholder="${CFG.price.ready||99}"
      value="${o.price||''}" onchange="ctlFilm('${id}','price',this.value)"></label>
     <label>شكل الظرف<select onchange="ctlFilm('${id}','env',this.value)">
      <option value="">الافتراضي</option>${envOpt(o.env||'')}</select></label>
     <label>عرض الفيلم<select onchange="ctlFilm('${id}','vid',this.value)">
      <option value="">الافتراضي</option>${vidOpt(o.vid||'')}</select></label>
     <label>رابط الموسيقى<input placeholder="/media/snd/….webm"
      value="${escA(o.snd||'')}" onchange="ctlFilm('${id}','snd',this.value)"></label>
     <label>اسم الأغنية<input placeholder="الفنّان — العنوان"
      value="${escA(o.sndN||'')}" onchange="ctlFilm('${id}','sndN',this.value)"></label>
    </div>
   </div>`;}).join(''))
 + ctlCard('🧩 أقسام الدعوة','ما يظهر داخل الدعوة نفسها — بلا أي شيء عن الطعام أو الحساسية.',
   EDISECL.map(([k,l])=>`<div class="ctlrow"><span>${l}</span>
    <span class="sw-toggle ${E[k]===0?'':'on'}" onclick="ctlEdi('${k}',${E[k]===0});renderContent()"></span>
   </div>`).join(''));}

function envView(){
 const E=CFG.env||{},cur=CFG.envStyle||'classic';
 return ctlCard('✉️ شاشة الظرف','ما يراه الضيف قبل الدعوة. اختاروا واحدًا ليكون الفعّال، وأطفئوا ما لا يناسبكم.',
  ENVL.map(([k,nm,ds])=>`<div class="ctlrow" style="align-items:flex-start;gap:10px">
   <span style="flex:1">
    <b style="display:block;font-size:.9rem">${nm}${cur===k?' <span style="color:#2F6B3A">· الفعّال ✓</span>':''}</b>
    <span class="cmut" style="font-size:.78rem">${ds}</span>
   </span>
   <button class="act ${cur===k?'gold':''}" style="padding:6px 12px;font-size:.78rem"
    onclick="ctlEnvPick('${k}');renderContent()" ${E[k]===0?'disabled':''}>تفعيل</button>
   <span class="sw-toggle ${E[k]===0?'':'on'}" onclick="ctlEnvOn('${k}',${E[k]===0});renderContent()"></span>
  </div>`).join(''));}

/* ================= نصوص الدعوات الجاهزة =================
   One film at a time, one language at a time. Every field is an override:
   leaving it empty keeps the copy the film ships with, so the panel never
   forces the owner to retype what is already right. */
let TXF='marble', TXL='ar';
const TXLANGS=[['ar','العربية'],['fr','Français'],['en','English']];
function txPick(id){TXF=id;render();window.scrollTo(0,0);}
function txLang(l){TXL=l;renderContent();}
function txGet(id){const o=(CFG.films[id]||{}).txt||{};return o[TXL]||{};}
function txSet(id,k,v){
 CFG.films[id]=CFG.films[id]||{};
 CFG.films[id].txt=CFG.films[id].txt||{};
 CFG.films[id].txt[TXL]=CFG.films[id].txt[TXL]||{};
 CFG.films[id].txt[TXL][k]=v;
 saveCFG();}
function txProgRows(id){
 const p=(CFG.films[id]||{}).prog||{};
 return (p[TXL]||[]).slice();}
function txProgSet(id,rows){
 CFG.films[id]=CFG.films[id]||{};
 CFG.films[id].prog=CFG.films[id].prog||{};
 CFG.films[id].prog[TXL]=rows;
 saveCFG();}
function txProgEdit(id,i,k,v){const r=txProgRows(id);
 while(r.length<=i)r.push({time:'',title:'',place:''});
 r[i][k]=v;txProgSet(id,r);}
function txProgAdd(id){const r=txProgRows(id);
 r.push({time:'',title:'',place:''});txProgSet(id,r);renderContent();}
function txProgDel(id,i){const r=txProgRows(id);
 r.splice(i,1);txProgSet(id,r);renderContent();}
function txClear(id){
 if(CFG.films[id]){delete CFG.films[id].txt;delete CFG.films[id].prog;}
 saveCFG();renderContent();
 toast('أُعيدت النصوص الأصلية ✓');}

function txtView(){
 const id=TXF, x=txGet(id), rows=txProgRows(id);
 const row=(k,label,hint,area)=>`<div class="txf">
   <label>${label}${hint?`<em>${hint}</em>`:''}</label>
   ${area?`<textarea rows="3" placeholder="${escA(hint||'')}"
      oninput="txSet('${id}','${k}',this.value)">${escA(x[k]||'')}</textarea>`
        :`<input value="${escA(x[k]||'')}" placeholder="${escA(hint||'')}"
      oninput="txSet('${id}','${k}',this.value)">`}
  </div>`;
 return `<div class="cgrid">
  ${ctlCard('🎞️ اختاروا الدعوة',
   'كل دعوة نصوصها الخاصة وبكل لغة على حدة.',
   `<div class="txpick">${RDFILMS.map(([fid,nm,cat])=>{
     const has=((CFG.films[fid]||{}).txt)||((CFG.films[fid]||{}).prog);
     const off=(CFG.films[fid]||{}).vis===false;
     return `<button class="txchip ${TXF===fid?'on':''}" onclick="txPick('${fid}')">
       ${nm}<em>${cat}</em>${has?'<i class="txdot" title="معدّل"></i>':''}
       ${off?'<s>مخفي</s>':''}</button>`;}).join('')}</div>`)}

  ${ctlCard('✒️ نصوص «'+ (RDFILMS.find(r=>r[0]===id)||['','',''])[1] +'»',
   'اتركوا أي حقل فارغًا ليبقى النص الأصلي. الحفظ فوري.',
   `<div class="txlangs">${TXLANGS.map(([l,n])=>
     `<button class="txlang ${TXL===l?'on':''}" onclick="txLang('${l}')">${n}</button>`).join('')}</div>

    <h4 class="txh">في الرفّ</h4>
    ${row('blurb','الوصف تحت الاسم','سطر قصير يظهر على البطاقة',1)}

    <h4 class="txh">داخل الدعوة</h4>
    ${row('t','العنوان الصغير','دعوة زفاف')}
    ${row('n','الأسماء','مريم و يوسف')}
    ${row('d','التاريخ كما يُكتب','14 سبتمبر 2026')}
    ${row('when','تاريخ العدّ التنازلي','2026-09-14T19:00')}
    ${row('p','المكان','رياض الأندلس')}
    ${row('m','الرسالة','يتشرفان بدعوتكم…',1)}

    <h4 class="txh">قواعد اللباس</h4>
    ${row('dressT','العنوان','أنيق رسمي')}
    ${row('dressD','التفصيل','بدلة داكنة · فستان طويل')}

    <h4 class="txh">الوصول</h4>
    ${row('dirT','العنوان','موقف مجاني')}
    ${row('dirD','التفصيل','خدمة صفّ السيارات…',1)}

    <h4 class="txh">الإقامة</h4>
    ${row('stayT','العنوان','أسعار خاصة')}
    ${row('stayD','التفصيل','فندقان قريبان…',1)}

    <div class="txfoot">
     <button class="act" onclick="txClear('${id}')">إعادة النصوص الأصلية</button>
     <a class="act gold" href="index.html?vidPreview=${id}&vidSec=hall" target="_blank">معاينة على الموقع ↗</a>
    </div>`)}

  ${ctlCard('🕑 برنامج الحفل',
   'اتركوه فارغًا ليبقى البرنامج الأصلي. أي سطر بلا عنوان يُتجاهل.',
   `${rows.length?rows.map((r,i)=>`<div class="txprow">
      <input class="tt" value="${escA(r.time||'')}" placeholder="19:00"
       oninput="txProgEdit('${id}',${i},'time',this.value)">
      <input value="${escA(r.title||'')}" placeholder="الفقرة"
       oninput="txProgEdit('${id}',${i},'title',this.value)">
      <input value="${escA(r.place||'')}" placeholder="المكان"
       oninput="txProgEdit('${id}',${i},'place',this.value)">
      <button class="txdel" onclick="txProgDel('${id}',${i})" title="حذف">×</button>
     </div>`).join(''):'<p class="cmut">لا فقرات مخصّصة — يُعرض البرنامج الأصلي.</p>'}
    <button class="act" onclick="txProgAdd('${id}')">+ أضيفوا فقرة</button>`)}
 </div>`;}

function mediaView(){
 const M=CFG.media;const cloud=window.__dbMode?'':`<p class="cmut" style="color:#A33">⚠️ لرفع الفيديوهات سجّلوا الدخول السحابي أولًا (الأزرار الأخرى تعمل).</p>`;
 return `<div class="cgrid">`+envView()+vidView()+readyView()+
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
/* ======= طلبات الموقع وردود الضيوف =======
   Whatever the two forms on the site collected. They sit at the top of the
   الطلبات and الضيوف pages rather than in a page of their own, because
   that is where someone looking for a new order already goes.
   Export is CSV with a byte-order mark — the one shape Excel, Numbers and
   Google Sheets all open with Arabic intact and no import dialogue. */
const FRMK={ord:'farha_reqs',rv:'farha_rsvp'};
function frmRows(k){try{return JSON.parse(localStorage.getItem(k)||'[]');}catch(e){return [];}}
function frmWipe(k){
 if(!confirm('مسح كل السجلّات؟ لا يمكن التراجع.'))return;
 localStorage.setItem(k,'[]');renderContent();toast('مُسحت');}
function frmWhen(iso){
 if(!iso)return '';
 const d=new Date(iso);if(isNaN(d))return String(iso);
 const p=n=>('0'+n).slice(-2);
 return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());}
/* a wa.me link for the number they left; bare Tunisian numbers get the prefix */
function frmWaTo(phone){
 const p=String(phone||'').replace(/[^0-9]/g,'');
 if(!p)return '';
 return 'https://wa.me/'+(p.length===8?'216':'')+p;}

function exportReqs(){
 const R=frmRows(FRMK.ord);
 if(!R.length){toast('لا طلبات بعد');return;}
 dlCSV('farha-requests.csv',[['التاريخ','الاسم','الهاتف','الفيلم','الاختيار',
   'الأسماء','تاريخ المناسبة','المكان','رسالة الدعوة','ما يتخيّلونه','السعر','اللغة','واتساب'],
  ...R.map(r=>[frmWhen(r.at),r.name||'',r.phone||'',r.filmName||'',
   {this:'هذا الفيلم',other:'فيلم آخر معروض',new:'فيلم جديد خاص'}[r.choice]||'',
   r.names||'',r.when||'',r.place||'',r.msg||'',r.wish||'',r.price||'',r.lang||'',
   r.viaWhatsApp?'نعم':''])]);}

function exportRsvp(){
 const R=frmRows(FRMK.rv);
 if(!R.length){toast('لا ردود بعد');return;}
 dlCSV('farha-guests.csv',[['التاريخ','الدعوة','اسم الضيف','الرد','العدد','الرسالة','اللغة'],
  ...R.map(r=>[frmWhen(r.at),r.host||r.invite||'',r.name||'',
   r.coming?'سيحضر':'معتذر',r.coming?(r.count||1):'',r.msg||'',r.lang||''])]);}

/* the panel that opens the الطلبات page */
function reqOrdersHTML(){
 const R=frmRows(FRMK.ord).slice().reverse();
 if(!R.length)return `<div class="ctlcard" style="margin-bottom:16px">
   <h3>\u{1F4E5} طلبات من نموذج الموقع</h3>
   <p class="cmut">لا طلبات بعد — كل من يملأ النموذج أو يتخطّاه إلى واتساب يظهر هنا.</p></div>`;
 return `<div class="ctlcard" style="margin-bottom:16px">
  <h3>\u{1F4E5} طلبات من نموذج الموقع <span class="sub">${R.length} طلب</span></h3>
  <div class="frqlist">${R.map(r=>`<div class="frqrow">
    <div class="frqh"><b>${escA(r.name||'—')}</b>
     ${r.phone?`<a class="frqwa" href="${frmWaTo(r.phone)}" target="_blank" dir="ltr">${escA(r.phone)} ↗</a>`:''}
     <span class="frqd">${frmWhen(r.at)}</span></div>
    <div class="frqb">
     ${r.filmName?`<span class="frqtag">${escA(r.filmName)}</span>`:''}
     ${r.choice==='new'?'<span class="frqtag new">يريد فيلمًا جديدًا</span>':''}
     ${r.choice==='other'?'<span class="frqtag">فيلم آخر من المعروضة</span>':''}
     ${r.viaWhatsApp?'<span class="frqtag wa">تخطّى إلى واتساب</span>':''}
     ${r.price?`<span class="frqtag">${r.price} د.ت</span>`:''}
     <span class="frqtag lang">${escA(r.lang||'')}</span>
     ${r.names?`<span>${escA(r.names)}</span>`:''}
     ${r.when?`<span>\u{1F4C5} ${escA(r.when)}</span>`:''}
     ${r.place?`<span>\u{1F4CD} ${escA(r.place)}</span>`:''}
    </div>
    ${r.wish?`<p class="frqmsg">${escA(r.wish)}</p>`:''}
    ${r.msg?`<p class="frqmsg quiet">رسالة الدعوة: ${escA(r.msg)}</p>`:''}
   </div>`).join('')}</div>
  <div class="frqfoot">
   <button class="act" onclick="exportReqs()">⬇️ تصدير CSV (يفتح في Excel)</button>
   <button class="act" onclick="frmWipe('farha_reqs')">\u{1F5D1} مسح الكل</button>
  </div></div>`;}

/* the panel that opens the الضيوف page */
function reqGuestsHTML(){
 const R=frmRows(FRMK.rv).slice().reverse();
 if(!R.length)return `<div class="ctlcard" style="margin-bottom:16px">
   <h3>\u{1F4DD} ردود الضيوف من داخل الدعوة</h3>
   <p class="cmut">لا ردود بعد — كل ضيف يضغط «سأحضر» يظهر هنا مع رسالته.</p></div>`;
 const yes=R.filter(r=>r.coming);
 const head=yes.reduce((n,r)=>n+(+r.count||1),0);
 /* One list per invitation, keyed on the slug rather than the couple's name:
    the slug is what the shared link needs, and two couples can share a name. */
 const byInv={};
 R.forEach(r=>{const k=r.invite||r.host||'—';
  (byInv[k]=byInv[k]||{nm:r.host||r.invite||'—',rows:[]}).rows.push(r);});
 return `<div class="ctlcard" style="margin-bottom:16px">
  <h3>\u{1F4DD} ردود الضيوف من داخل الدعوة <span class="sub">${R.length} رد</span></h3>
  <div class="mini-stat" style="margin-bottom:12px">
   <span>سيحضر <b>${yes.length}</b></span>
   <span>معتذر <b>${R.length-yes.length}</b></span>
   <span>مجموع الحضور <b>${head}</b></span></div>
  ${Object.keys(byInv).map(k=>`<div class="frqinv">
    <h4>${escA(byInv[k].nm)} <small>${byInv[k].rows.length}</small>
     <button class="act tiny" onclick="glCopy('${escA(k)}')">\u{1F517} رابط للأصحاب</button></h4>
    <div class="frqlist">${byInv[k].rows.map(r=>`<div class="frqrow ${r.coming?'yes':'no'}">
      <div class="frqh"><b>${escA(r.name)}</b>
       <span class="frqtag ${r.coming?'yes':'no'}">${r.coming?'سيحضر':'معتذر'}</span>
       ${r.coming&&(r.count||1)>1?`<span class="frqtag">${r.count} أشخاص</span>`:''}
       <span class="frqd">${frmWhen(r.at)}</span></div>
      ${r.msg?`<p class="frqmsg">${escA(r.msg)}</p>`:''}
     </div>`).join('')}</div></div>`).join('')}
  <div class="frqfoot">
   <button class="act" onclick="exportRsvp()">⬇️ تصدير CSV (يفتح في Excel)</button>
   <button class="act" onclick="frmWipe('farha_rsvp')">\u{1F5D1} مسح الكل</button>
  </div>
  <p class="cmut" style="margin-top:10px">«رابط للأصحاب» ينسخ صفحة للقراءة فقط تُحدّث نفسها — لا حساب ولا ملف يُرفع من جديد. ومن أراد جدولًا، التصدير فوقه.</p></div>`;}

/* The link an owner is handed. The list has a key of its own now, held in the
   database, so building the URL from the slug alone would produce something
   that opens an empty page — the real one comes from the backend. */
function glUrl(slug){
 const base=location.origin+location.pathname.replace(/[^/]*$/,'');
 return base+'?guests='+encodeURIComponent(slug)+'&k=…';}
function glCopy(slug){
 if(!slug){toast('اكتبوا معرّف الدعوة أولًا');return;}
 if(window.dbGuestLink){window.dbGuestLink(slug);return;}
 toast('سجّلوا الدخول أولًا — المفتاح محفوظ في قاعدة البيانات');}

/* Any invitation, not only the ones this browser happens to have replies for.
   The real replies live in the database, so the slug is what matters here. */
function glLinkHTML(){
 let slugs=[];
 try{slugs=frmRows(FRMK.rv).map(r=>r.invite).filter(Boolean);}catch(e){}
 try{const R=window.__dbRows;if(R&&R.invitations)slugs=slugs.concat(R.invitations.map(i=>i.slug));}catch(e){}
 slugs=slugs.filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,40);
 return ctlCard('\u{1F517} رابط قائمة الضيوف',
  'صفحة للقراءة فقط تُظهر لأصحاب الدعوة من ردّ عليهم، وتُحدّث نفسها مع كل رد جديد. لا دخول ولا تعديل — من يفتح الرابط يقرأ القائمة فقط.',
  `<div class="glbar">
    <input id="glSlug" placeholder="معرّف الدعوة (slug)" list="glSlugs"
     oninput="const e=document.getElementById('glOut');if(e)e.textContent=this.value?glUrl(this.value):'';">
    <datalist id="glSlugs">${slugs.map(x=>`<option value="${escA(x)}">`).join('')}</datalist>
    <button class="act gold" onclick="glCopy(document.getElementById('glSlug').value.trim())">نسخ الرابط</button>
   </div>
   <div class="glout" id="glOut"></div>`);}

/* ======= الرد الآلي على واتساب =======
   A page cannot make WhatsApp answer on its own — the reply has to come from
   WhatsApp Business, which sends a greeting to anyone who writes for the first
   time. So the promise is written here ready to paste, and the site shows the
   same words the moment a visitor leaves for WhatsApp, so nobody waits on a
   setting that may not be switched on yet. */
const WA_GREET={
 all:'شكرًا لتواصلكم معنا \u{1F49B}\nوصلتنا رسالتكم، سنراجعها ونعود إليكم اليوم أو خلال 24 ساعة على الأكثر.\n—\nMerci de nous avoir écrit. Nous revenons vers vous aujourd\'hui, ou sous 24 heures au plus.\n—\nThank you for writing. We will get back to you today, or within 24 hours at the latest.',
 ar:'شكرًا لتواصلكم معنا \u{1F49B} وصلتنا رسالتكم، سنراجعها ونعود إليكم اليوم أو خلال 24 ساعة على الأكثر.',
 fr:'Merci de nous avoir écrit \u{1F49B} Nous avons bien reçu votre message et revenons vers vous aujourd\'hui, ou sous 24 heures au plus.',
 en:'Thank you for writing \u{1F49B} We have received your message and will get back to you today, or within 24 hours at the latest.'};

function waCopy(k){
 const txt=WA_GREET[k]||'';
 const done=()=>toast('نُسخ — الصقوه في واتساب');
 try{
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,()=>waCopyFallback(txt,done));return;}
 }catch(e){}
 waCopyFallback(txt,done);}
/* clipboard API needs a secure origin; a hidden textarea works anywhere */
function waCopyFallback(txt,done){
 const ta=document.createElement('textarea');
 ta.value=txt;ta.style.cssText='position:fixed;opacity:0';
 document.body.appendChild(ta);ta.select();
 try{document.execCommand('copy');done();}catch(e){toast('انسخوه يدويًا من المربّع');}
 ta.remove();}

function waAutoHTML(){
 return ctlCard('\u{1F7E2} الرد الآلي على واتساب',
  'من يتخطّى النموذج ويكتب لكم يرى الوعد على الموقع فورًا. ليصله داخل واتساب أيضًا، فعّلوا رسالة الترحيب في تطبيق WhatsApp Business مرّة واحدة:',
  `<ol class="wasteps">
    <li>WhatsApp Business ← الإعدادات ← أدوات الأعمال</li>
    <li>«رسالة الترحيب» ← فعّلوها ← الصقوا النصّ تحت</li>
    <li>أرسلوها إلى «الجميع»</li>
   </ol>
   <div class="wabox">${escA(WA_GREET.all)}</div>
   <div class="frqfoot">
    <button class="act gold" onclick="waCopy('all')">\u{1F4CB} نسخ النصّ باللغات الثلاث</button>
    <button class="act" onclick="waCopy('ar')">عربي فقط</button>
    <button class="act" onclick="waCopy('fr')">Français</button>
    <button class="act" onclick="waCopy('en')">English</button>
   </div>`);}

/* ======= الباقتان =======
   The offer section reads its numbers from here. The count of films is not
   among them: it counts the shelf, so hiding a film changes what the offer
   claims without anyone remembering to come back and edit it. */
function ctlOff(k,v){CFG.offers[k]=Math.max(0,parseInt(v)||0);saveCFG();}
const OFFL=[
 ['المجموعة','readyPrice','readyWas','readyRevs','readyDays',
  'الزبون يختار فيلمًا ممّا نعرضه. أزرار الأسعار تحت كل فيلم تؤدّي إلى هذه الباقة.'],
 ['التوقيع','signPrice','signWas','signRevs','signDays',
  'دعوة تُصنع من الصفر. نموذج الطلب يفتح على «فيلم جديد» مباشرة.']];
/* ---- the words on the cards, one language at a time ----
   Every field is an override: leave it empty and the shipped line shows. The
   tokens are what keep an edited card from going stale — {n} counts the films
   on the shelf, {c} the occasions they cover, {r} the rounds set below, {d}
   the days. Write them into any sentence and they stay live. */
let OFFLANG='ar';
function offLang(v){OFFLANG=v;renderContent();}
function offTxtGet(k){
 const T=(CFG.offers.txt||{})[OFFLANG]||{};
 return T[k]===undefined?'':T[k];}
function offTxtSet(k,v){
 CFG.offers.txt=CFG.offers.txt||{};
 CFG.offers.txt[OFFLANG]=CFG.offers.txt[OFFLANG]||{};
 const o=CFG.offers.txt[OFFLANG];
 if(String(v).trim()==='')delete o[k]; else o[k]=v;
 saveCFG();}
/* the bullets are edited as a block, one line each — the shape they are read in */
function offLinesSet(k,v){
 CFG.offers.txt=CFG.offers.txt||{};
 CFG.offers.txt[OFFLANG]=CFG.offers.txt[OFFLANG]||{};
 const arr=String(v||'').split('\n').map(x=>x.trim()).filter(Boolean);
 const o=CFG.offers.txt[OFFLANG];
 if(!arr.length)delete o[k]; else o[k]=arr;
 saveCFG();}
function offLinesGet(k){
 const v=((CFG.offers.txt||{})[OFFLANG]||{})[k];
 return Array.isArray(v)?v.join('\n'):'';}
function offReset(){
 if(!confirm('إعادة نصوص هذه اللغة إلى الأصل؟'))return;
 if(CFG.offers.txt)delete CFG.offers.txt[OFFLANG];
 saveCFG();renderContent();}

const OFFLANGS=[['ar','العربية'],['fr','Français'],['en','English']];
const OFFHEAD=[['kick','الشارة فوق العنوان','طريقتان'],
 ['title','عنوان القسم','اختاروا فيلمًا صنعناه…'],
 ['sub','السطر تحت العنوان','الأولى جاهزة وتصلكم بسرعة…']];
const OFFCARD=[
 ['ready','البطاقة الأولى — من الأفلام المعروضة',
  [['rName','اسم الباقة','المجموعة'],
   ['rRibbon','الشريط المائل (فارغ = بلا شريط)','الأكثر اختيارًا'],
   ['rFor','لمن هي؟','لمن رأى فيلمًا من أفلامنا فأحبّه.'],
   ['rCta','زرّ الطلب','اطلبوا من المجموعة'],
   ['rSee','الزرّ الثاني','شاهدوا الأفلام أوّلًا']],
  'rLines','{n} أفلام جاهزة على {c} مناسبات\nظرف يُفتح، شمع يُكسر\n{r} جولات تعديل\nتصلكم خلال {d} أيّام'],
 ['sign','البطاقة الثانية — الدعوة الخاصة',
  [['sName','اسم الباقة','التوقيع'],
   ['sFor','لمن هي؟','لمن يريد دعوة لا توجد إلاّ عنده.'],
   ['sCta','زرّ الطلب','ابدأوا دعوة خاصة'],
   ['sNote','السطر تحت الزرّ (فارغ = بلا)','عدد محدود كلّ شهر…']],
  'sLines','كل ما في «المجموعة»، ثمّ\nفيلم يُصنع من الصفر\n{r} جولات تعديل\nتصلكم خلال {d} أيّام']];

function ctlOffOn(k,v){CFG.offers[k]=v?1:0;saveCFG();}
function offSwitch(k,lbl){
 return `<label class="ctlrow"><span>${lbl}</span>
   <input type="checkbox" ${CFG.offers[k]===0?'':'checked'} onchange="ctlOffOn('${k}',this.checked)"></label>`;}
function offField(k,lbl,ph){
 return `<label class="offf"><span>${lbl}</span>
   <input value="${escA(offTxtGet(k))}" placeholder="${escA(ph)}"
    onchange="offTxtSet('${k}',this.value)"></label>`;}

function offView(){
 let n=0;try{n=readyCatalogue().filter(f=>!(CFG.films[f.id]&&CFG.films[f.id].vis===false)).length;}catch(e){}
 const row=(lbl,k,suf)=>`<div class="ctlrow"><span>${lbl}</span>
   <span style="display:flex;align-items:center;gap:6px">
    <input class="cnum" type="number" min="0" value="${CFG.offers[k]|0}" onchange="ctlOff('${k}',this.value)">
    <small style="color:#8A7A63">${suf}</small></span></div>`;

 const numbers=OFFL.map(([nm,pk,wk,rk,dk,ds])=>ctlCard('💎 أرقام «'+nm+'»',ds,
   row('السعر',pk,'د.ت')
  +row('السعر المشطوب (0 = بلا)',wk,'د.ت')
  +row('جولات التعديل — {r}',rk,'جولة')
  +row('مدة التسليم — {d}',dk,'يوم')
  )).join('');

 const shown=ctlCard('👁 ما يظهر على البطاقتين',
   'الخانات الفارغة تعني «اعرضوا النصّ الأصلي»، فالإخفاء له مفتاحه.',
   offSwitch('ribbonOn','الشريط المائل على البطاقة الأولى')
  +offSwitch('noteOn','السطر تحت زرّ البطاقة الثانية'));

 const tabs=`<div class="offtabs">${OFFLANGS.map(([k,nm])=>
   `<button class="chip ${OFFLANG===k?'on':''}" onclick="offLang('${k}')">${nm}</button>`).join('')}
   <button class="act" style="margin-inline-start:auto" onclick="offReset()">↺ إعادة للأصل</button></div>`;

 const cards=OFFCARD.map(([id,nm,fields,lk,lph])=>ctlCard('✍️ '+nm,'',
   fields.map(([k,l,ph])=>offField(k,l,ph)).join('')
  +`<label class="offf"><span>بنود القائمة — سطر لكل بند</span>
     <textarea rows="6" placeholder="${escA(lph)}"
      onchange="offLinesSet('${lk}',this.value)">${escA(offLinesGet(lk))}</textarea></label>`)).join('');

 return ctlCard('🌐 لغة النصوص',
   'كل لغة نصوصها. اتركوا خانة فارغة فيظهر النصّ الأصلي. الرموز تعمل داخل أيّ جملة: '
  +'{n} عدد الأفلام، {c} عدد المناسبات، {r} جولات التعديل، {d} أيام التسليم.',tabs)
 +ctlCard('✍️ رأس القسم','',
   OFFHEAD.map(([k,l,ph])=>offField(k,l,ph)).join(''))
 +cards
 +shown
 +numbers
 +ctlCard('🔢 عدد الأفلام — {n}',
   'لا يُكتب يدويًا — القسم يعدّ الرفّ بنفسه. أطفئوا فيلمًا من «المحتوى والأفلام» وينقص الرقم وحده.',
   `<div class="ctlrow"><span>الظاهر الآن على الموقع</span><b style="font-size:1.4rem;color:#8A6210">${n}</b></div>`);}
function realOrdersHTML(){if(window.__dbOrdersHTML)return window.__dbOrdersHTML();const a=lsGet(LSK.orders,[]);if(!a.length)return '';
 const sum=a.reduce((s,o)=>s+(+o.price||0),0);
 return `<div class="ctlcard" style="margin-bottom:16px"><h3>🛎️ طلبات واردة من الموقع (${a.length}) — ${sum} د.ت</h3>`+
  a.slice(0,40).map(o=>`<div class="ctlrow"><span><b>${o.id}</b> · ${escA(o.item)} — ${o.price} د.ت<br><small style="color:#8A7A63">${new Date(o.ts).toLocaleString('ar-TN')}</small></span>
   <select class="csel" onchange="roStatus(${o.ts},this.value)">${['جديد','مدفوع','مكتمل','ملغى'].map(s=>`<option ${o.st===s?'selected':''}>${s}</option>`).join('')}</select></div>`).join('')+`</div>`;}
function roStatus(ts,v){const a=lsGet(LSK.orders,[]);const o=a.find(x=>x.ts===ts);if(o){o.st=v;lsSet(LSK.orders,a);toast('حُدّثت حالة الطلب → '+v);renderContent();}}
window.addEventListener('storage',function(e){if(e&&e.key&&(e.key===LSK.wishes||e.key===LSK.orders||e.key===LSK.meta)){try{renderContent()}catch(x){}}});

const NAV=[['over','📊','نظرة عامة'],['ctl','🎛️','التحكم بالموقع'],['media','🎬','المحتوى والأفلام'],['txt','✍️','نصوص الدعوات'],['off','\u{1F48E}','الباقتان'],['orders','🛒','الطلبات'],['inv','💌','الدعوات'],['tpl','🖼️','القوالب والأفلام'],['guests','👥','الضيوف والردود'],['wish','💬','التهاني'],['ana','📈','التحليلات'],['set','⚙️','الإعدادات']];
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

