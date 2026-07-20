/* ============ dashboard control bridge ============ */
const LSK={cfg:'farha_cfg',wishes:'farha_wishes',orders:'farha_orders',meta:'farha_meta'};
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
const CFG_DEF={sec:{ultra:1,premium:1,ai:1,sites:1,datef:1,open:1,wishes:1},price:{ultra:199,ai:249,site:149,design:79},wa:'21655787973',d17:'55787973',rib:'32016788101212289120',flouci:'',banner:{on:0,txt:''},designs:{},media:{films:{},customFilms:[],vopens:[],customDesigns:[],hideShows:[]}};
let CFG=JSON.parse(JSON.stringify(CFG_DEF));
let T0=null;
function loadCFG(){
 if(!T0){T0={};['uOrder','aiOrderB','stOrder'].forEach(k=>{T0[k]={ar:T.ar[k],fr:T.fr[k],en:T.en[k]};});}
 const fc=(typeof window!=='undefined'&&window.FARHA_CFG)?window.FARHA_CFG:{};
 const lc=lsGet(LSK.cfg,{})||{};
 const cc={sec:Object.assign({},fc.sec||{},lc.sec||{}),price:Object.assign({},fc.price||{},lc.price||{}),
  wa:(lc.wa!==undefined&&lc.wa!=='')?lc.wa:(fc.wa||''),
  d17:(lc.d17!==undefined&&lc.d17!=='')?lc.d17:(fc.d17||''),
  banner:Object.assign({},fc.banner||{},lc.banner||{}),
  designs:Object.assign({},fc.designs||{},lc.designs||{})};
 CFG=JSON.parse(JSON.stringify(CFG_DEF));
 Object.assign(CFG.sec,cc.sec||{});Object.assign(CFG.price,cc.price||{});
 CFG.wa=cc.wa||CFG_DEF.wa;CFG.d17=cc.d17||CFG_DEF.d17;Object.assign(CFG.banner,cc.banner||{});CFG.designs=cc.designs||{};
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
function _editConfig(){return {kind:S._editKind||'design',design:S.design||1,c:JSON.parse(JSON.stringify(S.c)),st:_slimSt(S.st),uIdx:S._editUidx||0};}
window.saveEditToInvite=async function(){
 if(!window.__sbSaveInvite||!S._editSlug){toast(S.lang==='ar'?'لا يمكن الحفظ هنا':'Cannot save');return;}
 toast(S.lang==='ar'?'جارٍ الحفظ…':'Saving…');
 const ok=await window.__sbSaveInvite(S._editSlug,_editConfig());
 toast(ok?(S.lang==='ar'?'💾 حُفظ — يظهر فورًا للزبون':'Saved ✓'):(S.lang==='ar'?'تعذّر الحفظ':'Save failed'));
 return ok;
};
window.saveEditAsTemplate=async function(){
 if(!window.__sbSaveTemplate){toast('—');return;}
 const nm=prompt(S.lang==='ar'?'اسم القالب الجاهز للبيع:':'Template name:','');
 if(!nm)return;
 toast(S.lang==='ar'?'جارٍ الحفظ…':'Saving…');
 const ok=await window.__sbSaveTemplate(nm,_editConfig());
 toast(ok?(S.lang==='ar'?'⭐ حُفظ كقالب جاهز':'Saved as template ✓'):(S.lang==='ar'?'تعذّر الحفظ':'Failed'));
 return ok;
};
window.__applyInvite=function(cfg,guest){try{
 cfg=cfg||{};const k=cfg.kind||'design';
 if(cfg.c)S.c={...S.c,...cfg.c};
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
 const map={ultra:'#ultra',premium:'#premium',sites:'#sites',datef:'#datef',open:'#open'};
 for(const k in map){const on=!!CFG.sec[k];const e=document.querySelector(map[k]);
  if(e)e.style.display=on?'':'none';
  document.querySelectorAll('[onclick*="scrollSec(\''+k+'\')"]').forEach(a=>a.style.display=on?'':'none');}
 const aw=document.getElementById('aiwrap');if(aw)aw.style.display=CFG.sec.ai?'':'none';
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
 const msg=(S.lang==='ar'?'مرحبًا! لديّ استفسار بخصوص: ':'Hello! I have a question about: ')+p.item+' — '+p.price+(S.lang==='ar'?' د.ت':' DT')+(_ph?'\n📱 '+_ph:'');
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
function _slimSt(st){try{const s=JSON.parse(JSON.stringify(st||S.st||{}));s.photos=[];s.video=null;s.track=null;return s;}catch(e){return {};}}
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
 const msg=(S.lang==='ar'?'✅ دفعت عبر ':'✅ Paid via ')+mLabel+refLine+'\n'+p.item+' — '+p.price+(S.lang==='ar'?' د.ت':' DT')+'\n📱 '+ph+(S.lang==='ar'?'\n📎 أرفقوا لقطة التحويل هنا':'\n📎 Attach your transfer screenshot here');
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
  const payload=Object.assign({design:designSnap,c:cSnap,st:st,uIdx:uIdxSnap},extra);
  dbHook('order',{item:String(p.item),price:p.price,phone:phn,customer_name:nm,ref:(m==='rib'?(p.ref||''):''),method:m,payload:payload});
  if(hasMedia)toast(S.lang==='ar'?'📨 استلمنا طلبكم بصوركم — بعد تأكيد الدفع تصلكم دعوتكم 💛':'📨 Order received with your media ✓');
 })();}
window.addEventListener('storage',function(e){if(e&&e.key&&(e.key===LSK.cfg||e.key===LSK.wishes)){try{loadCFG();render();}catch(x){}}});
function render(){applyCFGdom._raf=requestAnimationFrame(function(){try{applyCFGdom()}catch(e){}});
 const sameView=prevView===S.view;
 const keepY=sameView?window.scrollY:0;
 app.innerHTML=S.view==='land'?landView():editorView();
 if(S.view==='land')ambient();
 window.scrollTo(0,sameView?keepY:0);
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
 if(S.c.memVid&&S.c.memVid.url)try{URL.revokeObjectURL(S.c.memVid.url)}catch(e){}
 S.c.memVid={name:f.name.slice(0,26),url:URL.createObjectURL(f)};render();toast('🎥 ✓');}
function rmMemVid(){if(S.c.memVid&&S.c.memVid.url)try{URL.revokeObjectURL(S.c.memVid.url)}catch(e){}
 S.c.memVid=null;render();}
function stSet(k,v){S.st[k]=v;render();}
function stUpVideo(ev){const f=ev.target.files[0];if(!f)return;
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
function spawnPetal(host,init){if(!host||!host.isConnected)return;const p=document.createElement('span');p.className='petal';
 p.textContent=['🌸','🌺','✿'][Math.floor(Math.random()*3)];
 p.style.cssText=`left:${Math.random()*100}%;--dx:${(Math.random()*120-60).toFixed(0)}px;font-size:${(0.8+Math.random()*0.8).toFixed(2)}rem;
  animation-duration:${(9+Math.random()*7).toFixed(1)}s;animation-delay:${init?(-Math.random()*9).toFixed(1):0}s;opacity:.75`;
 host.appendChild(p);setTimeout(()=>p.remove(),17000);}

