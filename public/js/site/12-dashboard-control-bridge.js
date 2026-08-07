const EM={gift:String.fromCodePoint(0x1F381),check:String.fromCodePoint(0x2705),phone:String.fromCodePoint(0x1F4F1),clip:String.fromCodePoint(0x1F4CE),heart:String.fromCodePoint(0x1F49B),spark:String.fromCodePoint(0x2728),receipt:String.fromCodePoint(0x1F9FE)};
/* ============ dashboard control bridge ============ */
const LSK={cfg:'farha_cfg',wishes:'farha_wishes',orders:'farha_orders',meta:'farha_meta'};
/* Anything saved from the dashboard used to win over the defaults forever,
   so a phone that had ever stored a config kept showing old sections and
   old prices while a fresh browser showed the new ones. Bumping this drops
   the stored sec/price once; everything the owner typed is kept. */
const CFG_VER=5;
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
/* Everything except the newest section is off for now; each is one switch
   away in the dashboard. */
const CFG_DEF={sec:{ultra:0,premium:0,ai:0,sites:0,datef:0,open:0,wishes:0,
  cats:0,gallery:0,design:0,ready:1,offers:1},
 price:{ultra:199,ai:249,site:149,design:79,ready:99,readyWas:110},
 edi:{cd:1,prog:1,dress:1,dir:1,stay:1,rsvp:1},films:{},
 offers:{readyPrice:99,readyWas:110,readyRevs:3,readyDays:2,
         signPrice:249,signWas:0,signRevs:5,signDays:7,ribbonOn:1,noteOn:1,txt:{}},
 envStyle:'full',env:{classic:1,full:1,macro:1,silk:1,press:1},
 vid:{site:'full',customer:'full'},
 tiers:[
  {id:'ess',em:'🌱',name:{ar:'Essentiel — أساسي',fr:'Essentiel',en:'Essential'},price:29,feats:{ar:['تصميم واحد','الأسماء والتاريخ والمكان','افتتاح بسيط'],fr:['Un design','Noms, date, lieu','Ouverture simple'],en:['One design','Names, date, place','Simple opening']}},
  {id:'prem',em:'✦',name:{ar:'Premium — مميّز',fr:'Premium',en:'Premium'},price:69,feats:{ar:['كل ما في الأساسي','موسيقى + معرض صور','افتتاح سينمائي','تأكيد حضور RSVP'],fr:['Tout Essentiel','Musique + galerie','Ouverture cinématique','RSVP'],en:['All Essential','Music + gallery','Cinematic opening','RSVP']}},
  {id:'lux',em:'👑',name:{ar:'Luxe — فاخر',fr:'Luxe',en:'Luxe'},price:129,feats:{ar:['كل ما في المميّز','فيلم بالذكاء الاصطناعي','حائط التهاني','فيديو افتتاح مخصص','تسليم أولوية'],fr:['Tout Premium','Film IA','Mur de vœux','Vidéo perso','Livraison prioritaire'],en:['All Premium','AI film','Wishes wall','Custom video','Priority delivery']}}
 ],
 extras:[
  {id:'aifilm',em:'🎬',name:{ar:'فيلم بالذكاء الاصطناعي',fr:'Film IA',en:'AI film'},price:60},
  {id:'video',em:'🎥',name:{ar:'فيديو افتتاح مخصص',fr:'Vidéo d\'ouverture',en:'Custom video opening'},price:20},
  {id:'gallery',em:'🖼️',name:{ar:'معرض صور إضافي',fr:'Galerie photo',en:'Extra photo gallery'},price:10},
  {id:'musicup',em:'🎵',name:{ar:'رفع موسيقاكم الخاصة',fr:'Votre musique',en:'Upload your music'},price:10}
 ],wa:'21655787973',d17:'55787973',rib:'32016788101212289120',flouci:'',banner:{on:0,txt:''},designs:{},media:{films:{},customFilms:[],vopens:[],customDesigns:[],hideShows:[],readyFilms:[]}};
let CFG=JSON.parse(JSON.stringify(CFG_DEF));
let T0=null;
function loadCFG(){
 if(!T0){T0={};['uOrder','aiOrderB','stOrder'].forEach(k=>{T0[k]={ar:T.ar[k],fr:T.fr[k],en:T.en[k]};});}
 const fc=(typeof window!=='undefined'&&window.FARHA_CFG)?window.FARHA_CFG:{};
 let lc=lsGet(LSK.cfg,{})||{};
 if((lc.v|0)<CFG_VER){
  const keep=Object.assign({},lc);
  delete keep.sec;delete keep.price;      /* these are ours to set */
  keep.v=CFG_VER;lc=keep;lsSet(LSK.cfg,lc);
 }
 const cc={sec:Object.assign({},fc.sec||{},lc.sec||{}),price:Object.assign({},fc.price||{},lc.price||{}),
  wa:(lc.wa!==undefined&&lc.wa!=='')?lc.wa:(fc.wa||''),
  d17:(lc.d17!==undefined&&lc.d17!=='')?lc.d17:(fc.d17||''),
  banner:Object.assign({},fc.banner||{},lc.banner||{}),
  designs:Object.assign({},fc.designs||{},lc.designs||{}),
  edi:Object.assign({},fc.edi||{},lc.edi||{}),
  films:Object.assign({},fc.films||{},lc.films||{}),
  offers:Object.assign({},fc.offers||{},lc.offers||{}),
  envStyle:lc.envStyle||fc.envStyle||'',
  env:Object.assign({},fc.env||{},lc.env||{}),
  vid:Object.assign({},fc.vid||{},lc.vid||{})};
 CFG=JSON.parse(JSON.stringify(CFG_DEF));
 Object.assign(CFG.sec,cc.sec||{});Object.assign(CFG.price,cc.price||{});
 CFG.wa=cc.wa||CFG_DEF.wa;CFG.d17=cc.d17||CFG_DEF.d17;Object.assign(CFG.banner,cc.banner||{});CFG.designs=cc.designs||{};
 Object.assign(CFG.edi,cc.edi||{});CFG.films=cc.films||{};
 Object.assign(CFG.offers,cc.offers||{});
 if(cc.envStyle)CFG.envStyle=cc.envStyle;Object.assign(CFG.env,cc.env||{});
 Object.assign(CFG.vid,cc.vid||{});
 CFG.media=Object.assign(JSON.parse(JSON.stringify(CFG_DEF.media)),(fc.media||{}),(lc.media||{}));
 for(let i=DESIGNS.length-1;i>=0;i--)if(DESIGNS[i]._custom)DESIGNS.splice(i,1);
 (CFG.media.customDesigns||[]).forEach((cd,ix)=>{const nm=cd.nm||('قالب '+(ix+1));
  DESIGNS.push({_custom:true,id:200+ix,cat:cd.cat||'wed',badge:cd.badge||'',
   name:{ar:nm,fr:nm,en:nm},sub:{ar:'تصميم خاص بكم',fr:'Design exclusif',en:'Exclusive design'},
   tag:{ar:'خاص · جديد',fr:'Exclusif · Nouveau',en:'Exclusive · New'},
   bg:cd.bg||'#FFF9EC',ac:cd.ac||'#B98A2F',ink:cd.ink||'#3A2B10',foil:true,orn:cd.orn||'✨',corners:'svg',layer:'bg-damask',
   def:{ar:{t:'دعوة',n:'نور & كريم',d:'2026',p:'تونس',m:'يتشرفان بدعوتكم لمشاركة فرحتهما'},
        fr:{t:'Invitation',n:'Nour & Karim',d:'2026',p:'Tunis',m:'Ont la joie de vous convier à leur fête'},
        en:{t:'Invitation',n:'Nour & Karim',d:'2026',p:'Tunis',m:'Joyfully invite you to celebrate with them'}}});});
 const P={uOrder:CFG.price.ultra,aiOrderB:CFG.price.ai,stOrder:CFG.price.site};
 ['ar','fr','en'].forEach(L=>{for(const k in P){if(T0[k][L])T[L][k]=T0[k][L].replace(/\d+/,P[k]);}});
 DESIGNS.forEach(d=>{const o=CFG.designs[d.id];d._hide=!!(o&&o.vis===false);
  if(o&&o.badge!==undefined)d.badge=o.badge;});
 try{lsSet(LSK.meta,{designs:DESIGNS.map(d=>({id:d.id,name:(d.name&&(d.name.ar||d.name))||('تصميم '+d.id),em:d.pet||'🎴'}))});}catch(e){}}
window.__loadForEdit=function(cfg,slug){try{
 cfg=cfg||{};
 if(cfg.design!=null)S.design=cfg.design;
 openEditor(S.design||1);
 if(cfg.c)S.c={...S.c,...cfg.c};
 /* the same keys __applyInvite restores — opening an invitation to edit it
    must not quietly drop the film, palette and song on the way in */
 INV_KEYS.forEach(function(key){ if(cfg[key]!==undefined)S.c[key]=cfg[key]; });
 if(cfg.st)S.st=Object.assign({},S.st||{},cfg.st);
 S._editSlug=slug||null;S._editKind=cfg.kind||'design';S._editUidx=cfg.uIdx||0;
 render();
 setTimeout(()=>{try{showEditSaveBar();}catch(e){}},300);
}catch(e){console.warn('loadForEdit',e&&e.message);}};
function showEditSaveBar(){
 if(document.getElementById('editSaveBar'))return;
 const bar=document.createElement('div');bar.id='editSaveBar';
 bar.innerHTML=`<span>✏️ ${S.lang==='ar'?'وضع تعديل الطلب':'Editing order'}${S._editSlug?' · '+S._editSlug:''}</span>
  <span style="display:flex;gap:8px">
   <button onclick="saveEditToInvite()">💾 ${S.lang==='ar'?'حفظ للزبون':'Save'}</button>
   <button onclick="saveEditAsTemplate()">⭐ ${S.lang==='ar'?'حفظ كقالب':'Save as template'}</button>
  </span>`;
 document.body.appendChild(bar);
}
/* …and must not drop them on the way back out either. Saving used to write
   only {kind, design, c, st}, so one edit stripped the film from an
   invitation that had been delivered with it. */
function _editConfig(){
 const o={kind:S._editKind||'design',design:S.design||1,
  c:JSON.parse(JSON.stringify(S.c)),st:_slimSt(S.st),uIdx:S._editUidx||0};
 INV_KEYS.forEach(function(key){ if(S.c[key]!==undefined)o[key]=S.c[key]; });
 return o;}
window.saveEditToInvite=async function(){
 if(!window.__sbSaveInvite||!S._editSlug){toast(S.lang==='ar'?'لا يمكن الحفظ هنا':'Cannot save');return;}
 toast(S.lang==='ar'?'جارٍ الحفظ…':'Saving…');
 // upload any temporary (blob:) videos to permanent storage first
 const upErr=await _persistEditMedia();
 if(upErr){const msg=upErr.sizeMB?(S.lang==='ar'?`⚠️ الفيديو حجمه ${upErr.sizeMB} ميغا، الحد الأقصى ${upErr.maxMB} ميغا. اختاروا فيديو أقصر.`:`⚠️ Video is ${upErr.sizeMB}MB, max ${upErr.maxMB}MB. Use a shorter video.`):(S.lang==='ar'?'⚠️ تعذّر رفع الفيديو. حاولوا مجددًا.':'⚠️ Video upload failed. Try again.');toast(msg);return false;}
 const res=await window.__sbSaveInvite(S._editSlug,_editConfig());
 const ok=res&&res.ok;
 if(ok){toast(S.lang==='ar'?'💾 حُفظ — يظهر فورًا للزبون':'Saved ✓');}
 else{const reason=(res&&res.reason)||'?';
  const map={'not-logged-in':S.lang==='ar'?'سجّلوا الدخول أولًا من لوحة التحكم':'Please log in from the dashboard first','no-row-matched':S.lang==='ar'?'لم يُعثر على هذه الدعوة (ربما حُذفت)':'Invitation not found (maybe deleted)'};
  toast((map[reason])||((S.lang==='ar'?'تعذّر الحفظ: ':'Save failed: ')+reason));}
 return ok;
};
// convert temporary blob: video URLs in S.c.memVid / S.st.video into permanent storage URLs
async function _persistEditMedia(){
 try{
  if(!window.__uploadEventMedia)return null;
  const needMem=S.c.memVid&&S.c.memVid.url&&String(S.c.memVid.url).startsWith('blob:');
  const needStV=S.st&&S.st.video&&S.st.video.url&&String(S.st.video.url).startsWith('blob:');
  if(!needMem&&!needStV)return null;
  const packed=await window.__uploadEventMedia({photos:[],track:null,video:needMem?{name:S.c.memVid.name,url:S.c.memVid.url}:(needStV?S.st.video:null)});
  if(packed&&packed.__uploadErr)return packed.__uploadErr;
  if(needMem&&packed.video&&packed.video.url){S.c.memVid={name:S.c.memVid.name,url:packed.video.url};}
  if(needStV&&packed.video&&packed.video.url){S.st.video={name:S.st.video.name,url:packed.video.url};}
  return null;
 }catch(e){return {msg:(e&&e.message)||'error'};}
}
window.saveEditAsTemplate=async function(){
 if(!window.__sbSaveTemplate){toast('—');return;}
 const nm=prompt(S.lang==='ar'?'اسم القالب الجاهز للبيع:':'Template name:','');
 if(!nm)return;
 toast(S.lang==='ar'?'جارٍ الحفظ…':'Saving…');
 const ok=await window.__sbSaveTemplate(nm,_editConfig());
 toast(ok?(S.lang==='ar'?'⭐ حُفظ كقالب جاهز':'Saved as template ✓'):(S.lang==='ar'?'تعذّر الحفظ':'Failed'));
 return ok;
};
/* The keys that decide what an invitation actually looks and sounds like.
   Only cfg.c and cfg.design used to be copied, so a delivered invitation
   opened with the couple's names on a bare design — no film behind it, no
   palette from that film, no song. Everything the dashboard saved was there
   in the config and being thrown away one line before it was used. */
const INV_KEYS=['film','films','ediPal','ediSw','envStyle','vidStyle',
 'trackUrl','trackName','anim','music','musicStart','autoplay',
 'program','dress','dir','stay','story','maps','qr','font','pal'];
window.__applyInvite=function(cfg,guest){try{
 cfg=cfg||{};const k=cfg.kind||'design';
 if(cfg.c)S.c={...S.c,...cfg.c};
 INV_KEYS.forEach(function(key){ if(cfg[key]!==undefined)S.c[key]=cfg[key]; });
 if(guest)S.c.guest=String(guest).slice(0,40);
 if(k==='ultra'){window.__setUltraOvr&&window.__setUltraOvr({n:cfg.c&&cfg.c.n,d:cfg.c&&cfg.c.d});ultraOpen(Math.min(2,Math.max(0,(+cfg.uIdx)||0)));return;}
 if(k==='site'){if(cfg.st)S.st=Object.assign({},S.st,cfg.st);playShow();return;}
 if(k==='ai'){aiPremiere(cfg.video||'',cfg.title||'فيلمكم الخاص');return;}
 if(cfg.design!=null&&!cfg.cart)S.design=cfg.design;
 ceremony(false);
}catch(e){}};
function vopenBtns(){return ((CFG.media&&CFG.media.vopens)||[]).map((v,i)=>`<button class="opt ${S.c.anim==='v'+i?'on':''}" onclick="setC('anim','v'+${i})">🎥 ${esc(v.nm||'فيديو')}</button>`).join('');}
function cfgShow(d){return !d._hide;}
function applyCFGdom(){
 try{ensureWaFloat()}catch(e){}
 try{cartFab()}catch(e){}
 const map={ultra:'#ultra',premium:'#premium',sites:'#sites',datef:'#datef',open:'#open',
  ready:'#ready',cats:'#cats',gallery:'#gallery'};
 for(const k in map){const on=!!CFG.sec[k];const e=document.querySelector(map[k]);
  if(e)e.style.display=on?'':'none';
  document.querySelectorAll('[onclick*="scrollSec(\''+k+'\')"]').forEach(a=>a.style.display=on?'':'none');}
 const aw=document.getElementById('aiwrap');if(aw)aw.style.display=CFG.sec.ai?'':'none';
 /* the editor is reachable from several buttons; with the design flow off they
    would all land on a page the visitor was not offered */
 const dz=!!CFG.sec.design;
 document.querySelectorAll('[onclick*="openScratch"],[data-needs="design"]')
  .forEach(b=>{b.style.display=dz?'':'none';});
 const ex=document.querySelector('.cfg-banner');
 const want=!!(CFG.banner&&CFG.banner.on&&CFG.banner.txt&&S.view==='land');
 if(!want&&ex)ex.remove();
 if(want){if(ex)ex.textContent=CFG.banner.txt;else{
  const b=document.createElement('div');b.className='cfg-banner';b.textContent=CFG.banner.txt;
  const app=document.getElementById('app');if(app&&app.firstChild)app.insertBefore(b,app.firstChild);}}
}
function waContact(){try{window.open('https://wa.me/'+waNum()+'?text='+encodeURIComponent(t().waFloat),'_blank');}catch(e){}}
function ensureWaFloat(){if(document.getElementById('wafloat'))return;
 const b=document.createElement('button');b.id='wafloat';b.className='wa-float';b.title='WhatsApp';
 b.innerHTML='💬';b.onclick=waContact;document.body.appendChild(b);}

/* ================= shopping cart ================= */
function cartGet(){return lsGet('farha_cart',[])}
function cartSet(a){lsSet('farha_cart',a);cartFab()}
function addToCart(item,price,ev){if(ev&&ev.stopPropagation)ev.stopPropagation();
 const a=cartGet();if(a.some(x=>x.item===String(item))){toast(t().inCart);openCart();return;}
 a.push({item:String(item),price:+price||0});cartSet(a);toast(t().added);openCart();}
function cartFab(){let b=document.getElementById('cartfab');const n=cartGet().length;
 if(!b){b=document.createElement('button');b.id='cartfab';b.className='cart-fab';
  b.onclick=function(){openCart()};b.innerHTML='🛒<span class="cfn" id="cfn"></span>';
  document.body.appendChild(b);}
 b.style.display=n?'grid':'none';const c=document.getElementById('cfn');if(c)c.textContent=n;}
function closeCartSheet(){const d=document.getElementById('cartveil');if(d)d.remove();}
function openCart(){closeCartSheet();closePay();
 const a=cartGet();const cur=S.lang==='ar'?' د.ت':' DT';
 const total=a.reduce((s,x)=>s+(+x.price||0),0);
 const d=document.createElement('div');d.className='payveil';d.id='cartveil';
 d.onclick=function(e){if(e.target===d)closeCartSheet();};
 d.innerHTML=`<div class="paysheet"><div class="payhead"><b>🛒 ${t().cartT}</b><span class="payprice">${total}${cur}</span></div>
  ${a.length?a.map((x,i)=>`<div class="cart-row"><span>${esc(x.item)}</span><span class="crp">${x.price}${cur}<button class="crx" onclick="cartRemove(${i})">✕</button></span></div>`).join(''):`<p class="paysub" style="text-align:center;padding:16px 0">${t().cartEmpty}</p>`}
  ${a.length?`<div class="cart-total"><span>${t().cartTotal}</span><b>${total}${cur}</b></div>
  <button class="payproof" style="margin-top:8px" onclick="checkoutCart()">${t().cartGo}</button>`:''}
  <button class="payx" onclick="closeCartSheet()">${t().cartKeep}</button></div>`;
 document.body.appendChild(d);}
function cartRemove(i){const a=cartGet();a.splice(i,1);cartSet(a);openCart();}
function checkoutCart(){const a=cartGet();if(!a.length)return;
 const total=a.reduce((s,x)=>s+(+x.price||0),0);
 const label=a.map(x=>x.item).join(' + ').slice(0,118);
 closeCartSheet();placeOrder(label,total);if(S._pay)S._pay.fromCart=true;S._pay.payload={cart:cartGet()};}
function pTiers(){return (CFG.tiers&&CFG.tiers.length)?CFG.tiers:CFG_DEF.tiers;}
function pExtras(){return (CFG.extras&&CFG.extras.length)?CFG.extras:CFG_DEF.extras;}
function pTier(){return pTiers().find(x=>x.id===S.tier)||pTiers()[0];}
function priceTotal(){let t=(pTier()||{}).price||0;(S.extras||[]).forEach(id=>{const e=pExtras().find(x=>x.id===id);if(e)t+=e.price;});return t;}
function setTier(id){S.tier=id;render();}
function toggleExtra(id){const a=S.extras||[];const i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);S.extras=a;render();}
function orderLabel(){const tr=pTier()||{};const nm=(tr.name&&tr.name[S.lang])||'دعوة';const ex=(S.extras||[]).length?(' +'+(S.extras.length)+(S.lang==='ar'?' إضافة':' extras')):'';return nm+ex;}
function buyBundle(){const label=orderLabel();const total=priceTotal();
 placeOrder(label,total);
 if(S._pay){S._pay.payload={design:S.design||0,c:JSON.parse(JSON.stringify(S.c)),tier:S.tier,extras:(S.extras||[]).slice(),breakdown:{tier:(pTier()||{}).price||0,extras:(S.extras||[]).map(id=>{const e=pExtras().find(x=>x.id===id);return e?{id:e.id,price:e.price}:null;}).filter(Boolean),total:total}};}}
function placeOrder(item,price){
 const arr=lsGet(LSK.orders,[]);
 arr.unshift({id:'W'+String(Date.now()).slice(-6),item:String(item),price:price,ts:Date.now(),st:'جديد'});
 lsSet(LSK.orders,arr.slice(0,200));
 openPaySheet(item,price);
 S._pay.payload={design:S.design||0,c:JSON.parse(JSON.stringify(S.c))};}
function payRib(){return String(CFG.rib||'32016788101212289120').replace(/\s/g,'');}
function payFlouci(){return String(CFG.flouci||CFG.d17||'').replace(/\D/g,'');}
function payMethod(){return S._pay&&S._pay.method||'d17';}
function waNum(){let n=String(CFG.wa||CFG_DEF.wa).replace(/\D/g,'');if(n.slice(0,2)==='00')n=n.slice(2);if(n.length===8)n='216'+n;return n;}
function fmtD17(n){n=String(n||'').replace(/\D/g,'');const m=n.match(/^(\d{2})(\d{3})(\d{3})$/);return m?m[1]+' '+m[2]+' '+m[3]:n;}
function openPaySheet(item,price){closePay();S._submitting=false;S._pay={item:String(item),price:price,ref:'FR'+Math.random().toString(36).slice(2,6).toUpperCase()};
 const d=document.createElement('div');d.className='payveil';d.id='payveil';
 d.onclick=function(e){if(e.target===d)closePay();};
 const cur=S.lang==='ar'?' د.ت':' DT';
 d.innerHTML=`<div class="paysheet">
  <div class="payhead"><b>${esc(item)}</b><span class="payprice">${price}${cur}</span></div>
  <p class="paysub">📲 ${t().payChoose}</p>
  <input class="payphone" id="payName" maxlength="60" placeholder="${S.lang==='ar'?'👤 اسمكم الكامل — لكي نعرف صاحب الطلب':'👤 Your full name'}" value="${esc(S._cname||'')}" style="margin-bottom:8px">
  <input class="payphone" id="payPhone" inputmode="tel" maxlength="16" placeholder="${S.lang==='ar'?'🟢 رقم واتسابكم — نرسل عليه رابط دعوتكم بعد تأكيد الدفع':'🟢 Your WhatsApp — your invitation link arrives after payment'}" value="${esc(S._phone||'')}">
  <div class="paytabs">
   <button class="paytab on" data-m="d17" onclick="payTab('d17')">💳 D17</button>
   <button class="paytab" data-m="flouci" onclick="payTab('flouci')">📱 Flouci</button>
   <button class="paytab" data-m="rib" onclick="payTab('rib')">🏦 ${S.lang==='ar'?'تحويل بنكي':'Virement'}</button>
  </div>
  <div class="paypanel on" data-m="d17">
   <p class="d17s">${t().d17Steps}</p>
   <div class="paynum">${esc(fmtD17(CFG.d17))}</div>
   <button class="paycopy" onclick="payCopyVal('${esc(String(CFG.d17||'').replace(/\D/g,''))}')">${t().payCopy}</button>
  </div>
  <div class="paypanel" data-m="flouci">
   <p class="d17s">${S.lang==='ar'?'أرسلوا المبلغ عبر Flouci إلى هذا الرقم ثم أرفقوا اللقطة':'Send via Flouci to this number, then attach the screenshot'}</p>
   <div class="paynum">${esc(fmtD17(payFlouci()))}</div>
   <button class="paycopy" onclick="payCopyVal('${esc(payFlouci())}')">${t().payCopy}</button>
  </div>
  <div class="paypanel" data-m="rib">
   <p class="d17s">${S.lang==='ar'?'حوّلوا إلى هذا الحساب البنكي (RIB) وضعوا المرجع في الملاحظة:':'Transfer to this bank account (RIB) with the reference in the note:'}</p>
   <div class="pay-ref">🧾 ${S.lang==='ar'?'المرجع':'Reference'}: <b>${(S._pay&&S._pay.ref)||''}</b></div>
   <div class="paynum payrib">${esc(payRib())}</div>
   <button class="paycopy" onclick="payCopyVal('${esc(payRib())}')">${S.lang==='ar'?'نسخ الـRIB':'Copy RIB'}</button>
  </div>
  <div class="payamt">${t().payAmount}: <b>${price}${cur}</b></div>
  <button class="payproof" onclick="payProof()">${t().payProof}</button>
  <button class="paywaline" onclick="payWa()">${t().payWa}</button>
  <button class="payx" onclick="closePay()">${t().closePrev}</button></div>`;
 document.body.appendChild(d);}
function closePay(){const d=document.getElementById('payveil');if(d)d.remove();}
function payWa(){const p=S._pay||{};
 const _ph=((document.getElementById('payPhone')||{}).value||'').trim();
 const msg=(S.lang==='ar'?'مرحبًا! لديّ استفسار بخصوص: ':'Hello! I have a question about: ')+p.item+' — '+p.price+(S.lang==='ar'?' د.ت':' DT')+(_ph?'\n'+EM.phone+' '+_ph:'');
 const num=waNum();if(!num){toast(t().err);return;}
 const txt=encodeURIComponent(msg);const url='https://wa.me/'+num+'?text='+txt;
 try{const w=window.open(url,'_blank');if(!w)toast('واتساب');}catch(e){toast(t().err);}
 if(S._pay&&S._pay.fromCart)cartSet([]);toast(t().stOrdered);closePay();}
function payTab(m){S._pay&&(S._pay.method=m);
 document.querySelectorAll('.paytab').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
 document.querySelectorAll('.paypanel').forEach(p=>p.classList.toggle('on',p.dataset.m===m));}
function payCopyVal(v){const done=()=>toast(t().payCopied);
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(done).catch(()=>fallbackCopy(v,done));
 else fallbackCopy(v,done);}
function payCopy(){const n=String(CFG.d17||'').replace(/\D/g,'');const done=()=>toast(t().payCopied);
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(n).then(done).catch(()=>fallbackCopy(n,done));
 else fallbackCopy(n,done);}
function _slimSt(st){try{const s=JSON.parse(JSON.stringify(st||S.st||{}));
 const keepHttp=(m)=>m&&m.url&&String(m.url).startsWith('http')?m:null;
 s.photos=Array.isArray(s.photos)?s.photos.filter(p=>typeof p==='string'&&p.startsWith('http')):[];
 s.video=keepHttp(s.video);s.track=keepHttp(s.track);return s;}catch(e){return {};}}
function payProof(){const p=S._pay||{};
 if(S._submitting)return;                       // hard guard: no double-submit
 const nm=((document.getElementById('payName')||{}).value||'').trim();
 if(nm.length<2){toast(S.lang==='ar'?'👤 اكتبوا اسمكم أولًا':'👤 Enter your name first');const e=document.getElementById('payName');if(e)e.focus();return;}
 const ph=((document.getElementById('payPhone')||{}).value||'').trim();const phn=ph.replace(/\D/g,'');
 if(phn.length<8){toast(S.lang==='ar'?'🟢 أدخلوا رقم واتسابكم أولًا — عليه تصلكم الدعوة':'🟢 Enter your WhatsApp number first');const e=document.getElementById('payPhone');if(e)e.focus();return;}
 S._cname=nm;
 S._submitting=true;setTimeout(()=>{S._submitting=false;},4000);
 try{const _b=document.querySelector('.payproof');if(_b){_b.disabled=true;_b.style.opacity=.6;}}catch(e){}
 S._phone=ph;
 const m=p.method||'d17';
 // 1) open WhatsApp SYNCHRONOUSLY (popup blockers require this in the click handler)
 const mLabel={d17:'D17',flouci:'Flouci',rib:(S.lang==='ar'?'تحويل بنكي':'Virement bancaire')}[m];
 const refLine=(m==='rib')?((S.lang==='ar'?'\n🧾 المرجع: ':'\n🧾 Ref: ')+(p.ref||'')):'';
 const msg=(S.lang==='ar'?EM.check+' دفعت عبر ':EM.check+' Paid via ')+mLabel+refLine+'\n'+p.item+' — '+p.price+(S.lang==='ar'?' د.ت':' DT')+'\n'+EM.phone+' '+ph+(S.lang==='ar'?'\n'+EM.clip+' أرفقوا لقطة التحويل هنا':'\n'+EM.clip+' Attach your transfer screenshot here');
 const num=waNum();if(!num){toast(t().err);return;}
 try{const w=window.open('https://wa.me/'+num+'?text='+encodeURIComponent(msg),'_blank');if(!w)toast('واتساب');}catch(e){}
 // 2) capture design snapshot + raw media, close sheet, reassure customer
 const hasMedia=!!(S.st&&((S.st.photos&&S.st.photos.length)||S.st.video||S.st.track));
 const baseSt=JSON.parse(JSON.stringify(S.st||{}));
 const cSnap=JSON.parse(JSON.stringify(S.c));
 const uIdxSnap=(typeof uIdx!=='undefined'?uIdx:0);
 const designSnap=S.design||0;
 const extra=p.payload||{};
 if(S._pay&&S._pay.fromCart)cartSet([]);
 if(hasMedia)toast(S.lang==='ar'?'⏳ جارٍ حفظ صوركم… ثم يُسجَّل طلبكم':'⏳ Saving your media… then your order is recorded');
 else toast(S.lang==='ar'?'📨 استلمنا طلبكم — بعد تأكيد الدفع تصلكم دعوتكم على واتساب 💛':'📨 Order received — your invitation arrives on WhatsApp after payment ✓');
 closePay();
 // 3) upload media (if any) → build payload with permanent URLs → save order
 (async function(){
  let st;
  try{ st = (hasMedia && window.__uploadEventMedia) ? await window.__uploadEventMedia(baseSt) : _slimSt.call({},baseSt); }
  catch(e){ st = {photos:[],video:null,track:null}; }
  // if a media file was too big or failed, tell the user exactly why
  if(st&&st.__uploadErr){const er=st.__uploadErr;const kind=er.type==='videos'?(S.lang==='ar'?'الفيديو':'The video'):er.type==='music'?(S.lang==='ar'?'الموسيقى':'The music'):(S.lang==='ar'?'إحدى الصور':'A photo');
   const msg=er.sizeMB?(S.lang==='ar'?`⚠️ ${kind} حجمه ${er.sizeMB} ميغا، الحد الأقصى ${er.maxMB} ميغا. جرّبوا ملف أصغر أو أقصر.`:`⚠️ ${kind} is ${er.sizeMB}MB, the max is ${er.maxMB}MB. Please use a smaller/shorter file.`):(S.lang==='ar'?`⚠️ تعذّر رفع ${kind}. حاولوا مرة أخرى.`:`⚠️ Could not upload ${kind}. Please try again.`);
   toast(msg);}
  const payload=Object.assign({design:designSnap,c:cSnap,st:st,uIdx:uIdxSnap},extra);
  dbHook('order',{item:String(p.item),price:p.price,phone:phn,customer_name:nm,ref:(m==='rib'?(p.ref||''):''),method:m,payload:payload});
  if(hasMedia)toast(S.lang==='ar'?'📨 استلمنا طلبكم بصوركم — بعد تأكيد الدفع تصلكم دعوتكم 💛':'📨 Order received with your media ✓');
 })();}
window.addEventListener('storage',function(e){if(e&&e.key&&(e.key===LSK.cfg||e.key===LSK.wishes)){try{loadCFG();render();}catch(x){}}});
function render(){
 /* the shared guest list owns the page once it opens — nothing else belongs
    on it, and a stray render would put the whole site back */
 if(typeof GL_ON!=='undefined'&&GL_ON)return;
 applyCFGdom._raf=requestAnimationFrame(function(){try{applyCFGdom()}catch(e){}});
 const sameView=prevView===S.view;
 const keepY=sameView?window.scrollY:0;
 app.innerHTML=S.view==='land'?landView():editorView();
 if(S.view==='land'){ambient();try{filmShelfMount()}catch(e){}try{heroSpectrumMount()}catch(e){}}
 window.scrollTo(0,sameView?keepY:0);
 /* a backstop: whatever happened before this repaint, the page's ability to
    scroll should match what is actually on screen once it finishes */
 try{scrollSync()}catch(e){}
 prevView=S.view;}
function go(v){S.view=v;render();}
function scrollSec(id){
 if(S.view!=='land'){S.view='land';render();}
 setTimeout(()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'});},60);}
function toggleLang(){S.lang=S.lang==='ar'?'fr':S.lang==='fr'?'en':'ar';
 document.documentElement.dir=T[S.lang].dir;document.documentElement.lang=S.lang;
 if(S.view==='edit'){const dz=getDesign();Object.assign(S.c,dz.def[S.lang]);
  if(dz.story)S.c.story=JSON.parse(JSON.stringify(dz.story[S.lang]));}
 render();}
function setPmFilter(k){S.pmFilter=k;render();setTimeout(()=>{const el=document.getElementById('premium');if(el)el.scrollIntoView();},40);}
function setFilter(f,stay){S.filter=f;if(S.view==='land'&&stay)render(),scrollSec('gallery');else if(S.view==='land')render();}
function openEditor(id){const dz=DESIGNS.find(d=>d.id===id)||DESIGNS[0];S.design=dz.id;S.view='edit';
 S.c={...S.c,...dz.def[S.lang],font:0,pal:0,when:'',maps:'',qr:false,program:[],guest:'',
  anim:(dz.anim!=null?dz.anim:S.c.anim),
  story:dz.story?JSON.parse(JSON.stringify(dz.story[S.lang])):[]};render();}
function openScratch(){S.design=0;S.view='edit';
 S.c={...S.c,...SCRATCH_DEF[S.lang],font:0,pal:0,when:'',maps:'',qr:false,program:[],guest:'',story:[],
  bg:'#FFF9EC',ac:'#B98A2F',ink:'#3A2B10',orn:'✨',corners:'svg',layer:'bg-damask',frame:true,foil:true};render();}
function setC(k,v){S.c[k]=v;
 const ae=document.activeElement;
 const typing=!!(ae&&(ae.tagName==='TEXTAREA'||(ae.tagName==='INPUT'&&['text','url','color','range'].includes(ae.type))));
 if(typing||['t','n','d','p','m','when','bg','ac','ink','guest'].includes(k)){
  const st=document.getElementById('stage');if(st)st.innerHTML=inviteHTML(getDesign(),S.c);}
 else render();}
function addEmoji(e){S.c.m=(S.c.m?S.c.m+' ':'')+e;render();}
function addDay(){S.c.program.push({time:'19:00',title:'',place:'',map:'',music:0,photos:[]});render();}
function delDay(i){S.c.program.splice(i,1);render();}
function setProg(i,k,v){S.c.program[i][k]=v;}
function addPhotos(ev,i){const files=[...ev.target.files];
 files.slice(0,6).forEach(f=>{const r=new FileReader();
  r.onload=e=>{S.c.program[i].photos.push(e.target.result);render();};
  r.readAsDataURL(f);});}
function rmPhoto(i,pi){S.c.program[i].photos.splice(pi,1);render();}
function addSlide(){S.c.story.push({t:'',ph:''});render();}
function delSlide(i){S.c.story.splice(i,1);render();}
function setSlide(i,k,v){S.c.story[i][k]=v;}
function addSlidePhoto(ev,i){const f=ev.target.files[0];if(!f)return;
 const r=new FileReader();r.onload=e=>{S.c.story[i].ph=e.target.result;render();};r.readAsDataURL(f);}
function rmSlidePhoto(i){S.c.story[i].ph='';render();}
function upMemVid(ev){const f=ev.target.files[0];if(!f)return;
 if(f.size>50*1024*1024){toast(S.lang==='ar'?`⚠️ الفيديو حجمه ${Math.round(f.size/1048576)} ميغا، الحد الأقصى 50 ميغا. اختاروا فيديو أقصر.`:`⚠️ Video is ${Math.round(f.size/1048576)}MB, max is 50MB. Please pick a shorter video.`);ev.target.value='';return;}
 if(S.c.memVid&&S.c.memVid.url)try{URL.revokeObjectURL(S.c.memVid.url)}catch(e){}
 S.c.memVid={name:f.name.slice(0,26),url:URL.createObjectURL(f)};render();toast('🎥 ✓');}
function rmMemVid(){if(S.c.memVid&&S.c.memVid.url)try{URL.revokeObjectURL(S.c.memVid.url)}catch(e){}
 S.c.memVid=null;render();}
function stSet(k,v){S.st[k]=v;render();}
function stUpVideo(ev){const f=ev.target.files[0];if(!f)return;
 if(f.size>50*1024*1024){toast(S.lang==='ar'?`⚠️ الفيديو حجمه ${Math.round(f.size/1048576)} ميغا، الحد الأقصى 50 ميغا. اختاروا فيديو أقصر.`:`⚠️ Video is ${Math.round(f.size/1048576)}MB, max is 50MB. Please pick a shorter video.`);ev.target.value='';return;}
 if(S.st.video&&S.st.video.url)try{URL.revokeObjectURL(S.st.video.url)}catch(e){}
 S.st.video={name:f.name.slice(0,26),url:URL.createObjectURL(f)};S.st.style=5;render();toast(t().stVidOk);}
function stRmVideo(){if(S.st.video&&S.st.video.url)try{URL.revokeObjectURL(S.st.video.url)}catch(e){}
 S.st.video=null;render();}
function stSetDate(iso){S.st.dateISO=iso;
 if(!iso){S.st.date='';render();return;}
 const d=new Date(iso+'T00:00:00');
 const MO={ar:['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  fr:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
  en:['January','February','March','April','May','June','July','August','September','October','November','December']};
 const day=d.getDate(),mon=MO[S.lang][d.getMonth()],yr=d.getFullYear();
 S.st.date=S.lang==='en'?`${mon} ${day}, ${yr}`:`${day} ${mon} ${yr}`;
 render();}
function stAddPhotos(ev){const files=[...ev.target.files];
 files.slice(0,8-S.st.photos.length).forEach(f=>{const r=new FileReader();
  r.onload=e=>{S.st.photos.push(e.target.result);render();};r.readAsDataURL(f);});}
function stRmPhoto(i){S.st.photos.splice(i,1);render();}
function stUpTrack(ev){const f=ev.target.files[0];if(!f)return;
 if(S.st.track&&S.st.track.url)try{URL.revokeObjectURL(S.st.track.url)}catch(e){}
 S.st.track={name:'🎵 '+f.name.slice(0,20),url:URL.createObjectURL(f)};S.st.music=4;render();toast('🎵 ✓');}
function stOrder(){addToCart(t().stStyles[S.st.style]+(S.lang==='ar'?' — موقع مناسبة':' — event site'),CFG.price.site);burst(['💛','🌐','✨']);}
function setTrim(k,v){v=Math.max(0,Math.floor(+v||0));S.c[k]=v;
 if(k==='trackStart'&&S.c.trackEnd<=v)S.c.trackEnd=v+10;
 if(k==='trackEnd'&&v<=S.c.trackStart)S.c.trackStart=Math.max(0,v-10);
 const st=document.getElementById('lblSt'),en=document.getElementById('lblEn');
 const rs=document.getElementById('rgSt'),re=document.getElementById('rgEn');
 const f=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
 if(st)st.textContent=f(S.c.trackStart);if(en)en.textContent=f(S.c.trackEnd);
 if(rs)rs.value=S.c.trackStart;if(re)re.value=S.c.trackEnd;}
function upTrack(ev){const f=ev.target.files[0];if(!f)return;
 if(S.c.track&&S.c.track.url)try{URL.revokeObjectURL(S.c.track.url)}catch(e){}
 const url=URL.createObjectURL(f);
 S.c.track={name:'🎵 '+f.name.slice(0,22),url};S.c.music=4;
 S.c.trackStart=0;S.c.trackEnd=30;S.c.trackDur=0;
 try{const probe=new Audio(url);probe.onloadedmetadata=()=>{
  S.c.trackDur=probe.duration||0;
  S.c.trackEnd=Math.min(30,Math.max(10,Math.floor(S.c.trackDur||30)));
  if(S.view==='edit')render();};}catch(e){}
 render();toast('🎵 ✓');}
function shareLink(){toast(t().linkCopied);}
function addCart(){S.cart++;toast(t().added);burst(['✨','💛']);}
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;
 document.body.appendChild(el);setTimeout(()=>el.remove(),2400);}

/* ambient hero particles */
let ambT=null;
function ambient(){clearInterval(ambT);
 const hero=document.querySelector('.hero');if(!hero)return;
 for(let i=0;i<16;i++)spawnDust(hero,true);
 for(let i=0;i<7;i++)spawnPetal(hero,true);
 ambT=setInterval(()=>{if(!document.querySelector('.hero')){clearInterval(ambT);return;}
  spawnDust(hero);spawnPetal(hero);},1400);}
function spawnDust(host,init){if(!host||!host.isConnected)return;const d=document.createElement('span');d.className='dust';
 const s=(2+Math.random()*4).toFixed(1);
 d.style.cssText=`left:${Math.random()*100}%;width:${s}px;height:${s}px;--dx:${(Math.random()*80-40).toFixed(0)}px;
  animation-duration:${(7+Math.random()*8).toFixed(1)}s;animation-delay:${init?(-Math.random()*8).toFixed(1):0}s`;
 host.appendChild(d);setTimeout(()=>d.remove(),16000);}
/* A drawn petal rather than an emoji, so it takes the palette's colour and
   renders the same on every device. */
const PETAL_SVG='<svg viewBox="0 0 40 30" fill="none" aria-hidden="true">'
 +'<path d="M20 3c9 0 17 6 17 12s-8 12-17 12S3 21 3 15 11 3 20 3Z" fill="currentColor" fill-opacity=".62"/>'
 +'<path d="M20 3v24" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/></svg>';
function spawnPetal(host,init){if(!host||!host.isConnected)return;
 const p=document.createElement('span');p.className='petal';
 p.innerHTML=PETAL_SVG;
 const w=(13+Math.random()*16).toFixed(0);
 p.style.cssText=`left:${Math.random()*100}%;--dx:${(Math.random()*120-60).toFixed(0)}px;
  width:${w}px;height:${Math.round(w*0.75)}px;transform:rotate(${(Math.random()*80-40).toFixed(0)}deg);
  animation-duration:${(9+Math.random()*7).toFixed(1)}s;animation-delay:${init?(-Math.random()*9).toFixed(1):0}s;
  opacity:${(0.26+Math.random()*0.22).toFixed(2)}`;
 host.appendChild(p);setTimeout(()=>p.remove(),17000);}

