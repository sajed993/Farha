/* ================= views ================= */
function dbOverHTML(){const R=window.__dbRows||{orders:[],rsvps:[],wishes:[]};
 const rev=R.orders.filter(o=>o.status!=='ملغي').reduce((a,o)=>a+(Number(o.price)||0),0);
 const news=R.orders.filter(o=>o.status==='جديد'||!o.status).length;
 const att=R.rsvps.filter(r=>r.attending!==false).length;
 const st=(l,v,c)=>`<div class="stat"><span class="lbl">${l}</span><b style="color:${c||'#3A2B10'}">${v}</b></div>`;
 const latest=R.orders.slice(0,8).map(o=>`<div class="ctlrow"><span>#${o.id} · ${escA(o.item||'')}</span><span>${o.price||0} د.ت · ${escA(o.status||'جديد')}</span></div>`).join('')||'<p class="cmut">لا طلبات بعد — أول طلب سيظهر هنا.</p>';
 return `<div class="statgrid">${st('☁️ طلبات حقيقية',R.orders.length)}${st('💰 الإيرادات',rev+' د.ت','#8A6210')}${st('🆕 بانتظار المعالجة',news,'#A33')}${st('💌 ردود حضور',R.rsvps.length)}${st('🙋 سيحضرون',att,'#2F6B3A')}${st('🎉 تهانٍ',R.wishes.length)}</div>
 <div class="card"><h3>🛎️ أحدث الطلبات (حيّة)</h3>${latest}</div>
 <p class="cmut">☁️ كل الأرقام أعلاه من قاعدة بياناتكم مباشرة — الرسوم التفصيلية ستغتني تلقائيًا مع تراكم الطلبات الحقيقية.</p>`;}
function overView(){if(window.__dbMode&&window.__dbRows)return dbOverHTML();

 const r=S.range;
 const rev=revenue(r),revPrev=revenue(r*2)-rev;
 const ord=ordersIn(r),ordPrev=ordersIn(r*2)-ord;
 const vws=sum(VIEWS.slice(-r)),ops=sum(OPENS.slice(-r));
 const yes=sum(INV.map(i=>i.yes)),no=sum(INV.map(i=>i.no));
 const yesRate=Math.round(yes/(yes+no)*100);
 const dl=(a,b)=>{const p=b?Math.round((a-b)/b*100):0;
  return `<span class="d ${p>=0?'up':'down'}">${p>=0?'▲':'▼'} ${toAr(Math.abs(p))}% عن الفترة السابقة</span>`;}
 const revDaily=[];for(let d=r-1;d>=0;d--)revDaily.push(sum(ORDERS.filter(o=>o.d===d&&o.status!=='ملغي').map(o=>o.price)));
 const catCount=c=>ORDERS.filter(o=>o.d<r&&!o.prem&&TPL.find(t=>t.n===o.tpl&&t.cat===c)).length;
 const premC=ORDERS.filter(o=>o.d<r&&o.prem).length;
 const parts=[{v:catCount('أعراس'),c:'#C4827A',l:'أعراس'},{v:catCount('تخرّج'),c:'#5570B8',l:'تخرّج'},
  {v:catCount('أخرى'),c:'#7C9482',l:'أخرى'},{v:premC,c:'#B98A2F',l:'بريميوم ✦'}];
 const top=TPL.map(t=>({t,c:ORDERS.filter(o=>o.d<r&&o.tpl===t.n).length}))
  .sort((a,b)=>b.c-a.c).slice(0,5);
 const mxTop=Math.max(...top.map(x=>x.c),1);
 const recent=ORDERS.slice(0,6);
 return `
 <div class="chips">${[7,30,90].map(x=>`<button class="chip ${S.range===x?'on':''}" onclick="S.range=${x};renderContent()">آخر ${toAr(x)} ${x===7?'أيام':'يومًا'}</button>`).join('')}</div>
 <div class="grid-kpi">
  <div class="kpi"><div class="lb">💰 الإيرادات</div><div class="v">${fmtN(rev)} <small style="font-size:.9rem">د.ت</small></div>${dl(rev,revPrev)}<div class="spark">${spark(revDaily.slice(-24),'#B98A2F')}</div></div>
  <div class="kpi"><div class="lb">🛒 الطلبات</div><div class="v">${fmtN(ord)}</div>${dl(ord,ordPrev)}<div class="spark">${spark(revDaily.map(x=>x/29).slice(-24),'#C4827A')}</div></div>
  <div class="kpi"><div class="lb">👁️ مشاهدات الدعوات</div><div class="v">${fmtN(vws)}</div>${dl(vws,sum(VIEWS.slice(-r*2,-r)))}<div class="spark">${spark(VIEWS.slice(-24),'#7C9482')}</div></div>
  <div class="kpi"><div class="lb">💌 فتحات سينمائية</div><div class="v">${fmtN(ops)}</div>${dl(ops,sum(OPENS.slice(-r*2,-r)))}<div class="spark">${spark(OPENS.slice(-24),'#5570B8')}</div></div>
  <div class="kpi"><div class="lb">🎉 نسبة «سأحضر»</div><div class="v">${toAr(yesRate)}%</div><span class="d up">▲ من ${fmtN(yes+no)} ردًّا</span></div>
 </div>
 <div class="two">
  <div class="card"><h3>📈 الإيرادات اليومية <span class="sub">آخر ${toAr(r)} يومًا · د.ت</span></h3>
   ${areaChart(revDaily,720,210,'#B98A2F')}</div>
  <div class="card"><h3>🧭 الطلبات حسب الفئة</h3>
   <div class="donut-wrap">${donut(parts)}
    <div class="legend" style="flex-direction:column;align-items:start">${parts.map(p=>`<i style="--c:${p.c}">${p.l} — <b style="font-family:var(--num)">${fmtN(p.v)}</b></i>`).join('')}</div>
   </div></div>
 </div>
 <div class="two">
  <div class="card"><h3>🛒 أحدث الطلبات <span class="sub"><button class="act" onclick="go('orders')">عرض الكل ←</button></span></h3>
   <table class="tbl"><thead><tr><th>الطلب</th><th>العميل</th><th>القالب</th><th>النوع</th><th>السعر</th><th>الحالة</th></tr></thead>
   <tbody>${recent.map(o=>orderRow(o,false)).join('')}</tbody></table></div>
  <div class="card"><h3>🏆 الأكثر مبيعًا</h3>
   <div class="bars">${top.map(x=>`<div class="bar-row"><span>${x.t.em} ${x.t.n}</span><div class="tr"><div class="fl" style="width:${Math.round(x.c/mxTop*100)}%"></div></div><b>${fmtN(x.c)}</b></div>`).join('')}</div>
  </div>
 </div>`;}

function orderRow(o,withAction){
 const bc={'جديد':'b-new','مدفوع':'b-paid','مُسلّم':'b-done','ملغي':'b-cancel'}[o.status];
 const when=o.d===0?'اليوم':o.d===1?'أمس':'قبل '+toAr(o.d)+' يومًا';
 return `<tr><td class="id">${o.id}<br><span style="color:var(--taupe);font-size:.68rem;font-family:var(--body)">${when}</span></td>
  <td>${esc(o.cust)}</td><td>${o.em} ${esc(o.tpl)}</td>
  <td><span class="bdg ${o.prem?'b-prem':'b-std'}">${o.prem?'بريميوم ✦':'عادي'}</span></td>
  <td style="font-family:var(--num);font-weight:600">${fmtN(o.price)} د.ت</td>
  <td><span class="bdg ${bc}">${o.status}</span></td>
  ${withAction?`<td><select class="act" onchange="setStatus('${o.id}',this.value)">
    ${STATUSES.map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></td>`:''}</tr>`;}

function ordersView(){if(window.__dbMode)return realOrdersHTML()+`<p class="cmut" style="margin-top:6px">☁️ هذه القائمة حيّة من قاعدة البيانات — كل طلب جديد من أي زبون يظهر هنا فورًا.</p>`;
 return realOrdersHTML()+_ordersView0();}
function _ordersView0(){
 let list=ORDERS.filter(o=>S.ostatus==='الكل'||o.status===S.ostatus);
 if(S.q)list=list.filter(o=>(o.cust+o.id+o.tpl).includes(S.q));
 const shown=list.slice(0,40);
 return `
 <div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
   <div class="chips">${['الكل',...STATUSES].map(s=>`<button class="chip ${S.ostatus===s?'on':''}" onclick="S.ostatus='${s}';renderContent()">${s}</button>`).join('')}</div>
   <span style="margin-inline-start:auto"></span>
   <button class="act" onclick="exportOrders()">⬇️ تصدير CSV</button>
  </div>
  <div class="mini-stat" style="margin-bottom:12px">
   <span>النتائج <b>${fmtN(list.length)}</b></span><span>قيمتها <b>${fmtN(sum(list.filter(o=>o.status!=='ملغي').map(o=>o.price)))}</b> د.ت</span></div>
  <table class="tbl"><thead><tr><th>الطلب</th><th>العميل</th><th>القالب</th><th>النوع</th><th>السعر</th><th>الحالة</th><th>تغيير</th></tr></thead>
  <tbody>${shown.map(o=>orderRow(o,true)).join('')||'<tr><td colspan="7" class="empty">لا نتائج مطابقة</td></tr>'}</tbody></table>
  ${list.length>40?`<div class="empty">عرض 40 من ${fmtN(list.length)} — استخدموا البحث للتصفية</div>`:''}
 </div>`;}

function invView(){
 if(window.__dbMode&&window.__dbRows){return invViewReal();}
 let list=INV;
 if(S.q)list=list.filter(i=>(i.n+i.tpl).includes(S.q));
 return `<div class="card">
  <h3>💌 الدعوات المُنشأة <span class="sub">${fmtN(list.length)} دعوة</span></h3>
  <table class="tbl"><thead><tr><th>الدعوة</th><th>القالب</th><th>الموعد</th><th>مشاهدات</th><th>فُتحت</th><th>سيحضر / معتذر</th><th>الحالة</th><th></th></tr></thead>
  <tbody>${list.map(i=>`<tr>
   <td><b style="font-family:var(--serif)">${i.em} ${esc(i.n)}</b>${i.prem?' <span class="bdg b-prem" style="padding:3px 9px">✦</span>':''}</td>
   <td style="color:var(--taupe)">${esc(i.tpl)}</td>
   <td>بعد ${toAr(i.when)} يومًا</td>
   <td style="font-family:var(--num)">${fmtN(i.views)}</td>
   <td style="font-family:var(--num)">${fmtN(i.op)}</td>
   <td><span class="bdg b-yes">${fmtN(i.yes)}</span> <span class="bdg b-no">${fmtN(i.no)}</span></td>
   <td><span class="bdg ${i.active?'b-done':'b-wait'}">${i.active?'نشطة':'منتهية'}</span></td>
   <td style="white-space:nowrap"><a class="act" href="farha-invitations.html" target="_blank">فتح 👁️</a>
    <button class="act" onclick="toast('نُسخ رابط الدعوة 🔗')">رابط</button></td>
  </tr>`).join('')}</tbody></table></div>`;}

function tplView(){
 return `<div class="card"><h3>🖼️ القوالب <span class="sub">${fmtN(TPL.length)}</span></h3>
  <div class="tpl-grid">${TPL.map((t,i)=>{
   const uses=ORDERS.filter(o=>o.tpl===t.n).length;
   return `<div class="tplc"><div class="hd"><span class="em">${t.em}</span><b>${t.n}</b>
    <span class="sw-toggle ${t.vis?'on':''}" onclick="TPL[${i}].vis=!TPL[${i}].vis;renderContent();toast(TPL[${i}].vis?'أصبح القالب ظاهرًا':'أُخفي القالب')"></span></div>
    <div class="st"><span>الفئة <b style="font-family:var(--body)">${t.cat}</b></span><span>الطلبات <b>${fmtN(uses)}</b></span><span>الإيراد <b>${fmtN(uses*PRICE.std)}</b></span></div>
    <div class="rw"><span style="font-size:.72rem;color:var(--taupe);font-weight:700">الشارة:</span>
     ${['','رواج','جديد','مميّز'].map(b=>`<button class="chip ${t.badge===b?'on':''}" style="padding:4px 11px;font-size:.68rem" onclick="TPL[${i}].badge='${b}';renderContent()">${b||'بدون'}</button>`).join('')}</div>
   </div>`;}).join('')}</div></div>
 <div class="card"><h3>🎬 أفلام بريميوم <span class="sub">${fmtN(FILMS.length)}</span></h3>
  <div class="tpl-grid">${FILMS.map((f,i)=>`<div class="tplc"><div class="hd"><span class="em">${f.em}</span><b>${f.n}</b>
    <span class="sw-toggle ${f.vis?'on':''}" onclick="FILMS[${i}].vis=!FILMS[${i}].vis;renderContent()"></span></div>
    <div class="st"><span>التصنيف <b style="font-family:var(--body)">${f.cat}</b></span><span>الاستخدام <b>${fmtN(f.uses)}</b></span><span>الإيراد <b>${fmtN(f.uses*PRICE.prem)}</b></span></div>
   </div>`).join('')}</div></div>`;}

function guestsView(){
 if(window.__dbMode&&window.__dbRows){return guestsViewReal();}
 let list=GUESTS;if(S.q)list=list.filter(g=>g.n.includes(S.q));
 const yes=list.filter(g=>g.st==='سيحضر').length,no=list.filter(g=>g.st==='معتذر').length,w=list.length-yes-no;
 return `<div class="card">
  <h3>👥 الضيوف والردود <span class="sub">عيّنة: دعوات هذا الأسبوع</span></h3>
  <div class="mini-stat" style="margin-bottom:14px">
   <span>سيحضر <b>${fmtN(yes)}</b></span><span>معتذر <b>${fmtN(no)}</b></span><span>لم يرد <b>${fmtN(w)}</b></span>
   <span style="margin-inline-start:auto"></span><button class="act" onclick="exportGuests()">⬇️ تصدير قائمة الضيوف</button></div>
  <table class="tbl"><thead><tr><th>الضيف</th><th>الدعوة</th><th>الرد</th><th>تفاعلات</th><th>تذكير</th></tr></thead>
  <tbody>${list.map((g,i)=>`<tr><td><b>${esc(g.n)}</b></td><td style="color:var(--taupe)">${esc(INV[g.inv-1]?INV[g.inv-1].n:'—')}</td>
   <td><span class="bdg ${g.st==='سيحضر'?'b-yes':g.st==='معتذر'?'b-no':'b-wait'}">${g.st}</span></td>
   <td style="font-family:var(--num)">${g.react?'❤️ '+fmtN(g.react):'—'}</td>
   <td>${g.st==='لم يرد'?`<button class="act" onclick="toast('أُرسل تذكير لطيف إلى ${esc(g.n)} 💌')">إرسال تذكير</button>`:'—'}</td></tr>`).join('')}
  </tbody></table></div>`;}

function invViewReal(){
 const R=window.__dbRows;const evs=R.events||[];
 let list=(R.invitations||[]).slice();
 if(S.q)list=list.filter(i=>JSON.stringify(i.config||{}).includes(S.q)||(i.slug||'').includes(S.q));
 const cnt=(slug,k)=>evs.filter(e=>e.inv_slug===slug&&e.kind===k).length;
 const rsvpFor=(slug)=>(R.rsvps||[]).filter(r=>r.inv_slug===slug);
 if(!list.length)return `<div class="card"><h3>💌 الدعوات المُنشأة</h3><p class="cmut">لا دعوات بعد — ستظهر هنا فور تسليم أول طلب.</p></div>`;
 return `<div class="card">
  <h3>💌 الدعوات المُنشأة <span class="sub">${fmtN(list.length)} دعوة — حيّة</span></h3>
  <table class="tbl"><thead><tr><th>الدعوة</th><th>الرابط</th><th>مشاهدات</th><th>فُتحت</th><th>سيحضر / معتذر</th><th></th></tr></thead>
  <tbody>${list.map(i=>{const nm=(i.config&&i.config.c&&i.config.c.n)||i.slug;const rs=rsvpFor(i.slug);const yes=rs.filter(x=>x.attending!==false).length;const no=rs.length-yes;return `<tr>
   <td><b style="font-family:var(--serif)">${escA(nm)}</b></td>
   <td style="color:var(--taupe);font-family:var(--num)">?i=${escA(i.slug)}</td>
   <td style="font-family:var(--num)">${fmtN(cnt(i.slug,'view')+cnt(i.slug,'open'))}</td>
   <td style="font-family:var(--num)">${fmtN(cnt(i.slug,'reveal'))}</td>
   <td><span class="bdg b-yes">${fmtN(yes)}</span> <span class="bdg b-no">${fmtN(no)}</span></td>
   <td style="white-space:nowrap"><button class="act" onclick="dbCopyLink('${escA(i.slug)}')">🔗 رابط</button>
    <button class="act" onclick="dbEditFull('${escA(i.slug)}')">🎨 تعديل</button></td>
  </tr>`;}).join('')}</tbody></table></div>`;}
function guestsViewReal(){
 const R=window.__dbRows;let list=(R.rsvps||[]).slice();
 if(S.q)list=list.filter(g=>(g.name||'').includes(S.q));
 const yes=list.filter(g=>g.attending!==false).length,no=list.length-yes;
 const invName=(slug)=>{const iv=(R.invitations||[]).find(x=>x.slug===slug);return (iv&&iv.config&&iv.config.c&&iv.config.c.n)||slug||'—';};
 return `<div class="card">
  <h3>👥 الضيوف والردود <span class="sub">${fmtN(list.length)} رد — حيّ</span></h3>
  <div class="mini-stat" style="margin-bottom:14px">
   <span>سيحضر <b>${fmtN(yes)}</b></span><span>معتذر <b>${fmtN(no)}</b></span>
   <span style="margin-inline-start:auto"></span></div>
  ${list.length?`<table class="tbl"><thead><tr><th>الضيف</th><th>الدعوة</th><th>الرد</th><th>عدد</th><th>رسالة</th></tr></thead>
  <tbody>${list.map(g=>`<tr><td><b>${escA(g.name||'ضيف')}</b></td><td style="color:var(--taupe)">${escA(invName(g.inv_slug))}</td>
   <td><span class="bdg ${g.attending!==false?'b-yes':'b-no'}">${g.attending!==false?'سيحضر':'معتذر'}</span></td>
   <td style="font-family:var(--num)">${toAr(g.guests||1)}</td>
   <td style="color:var(--taupe);max-width:200px">${escA((g.message||'').slice(0,60))}</td></tr>`).join('')}
  </tbody></table>`:'<p class="cmut">لا ردود بعد.</p>'}</div>`;}

function wishView(){return realWishesHTML()+_wishView0();}
function _wishView0(){
 let list=WISHES;if(S.q)list=list.filter(w=>(w.txt+w.who+w.inv).includes(S.q));
 return `<div class="card"><h3>💬 تهاني الضيوف <span class="sub">${fmtN(list.filter(w=>w.ok).length)} منشورة · ${fmtN(list.filter(w=>!w.ok).length)} بانتظار المراجعة</span></h3>
  <table class="tbl"><thead><tr><th>التهنئة</th><th>من</th><th>على دعوة</th><th>الحالة</th><th></th></tr></thead>
  <tbody>${list.map((w,i)=>`<tr><td style="max-width:340px;font-family:var(--serif)">“${esc(w.txt)}”</td>
   <td>${esc(w.who)}</td><td style="color:var(--taupe)">${esc(w.inv)}</td>
   <td><span class="bdg ${w.ok?'b-done':'b-wait'}">${w.ok?'منشورة':'قيد المراجعة'}</span></td>
   <td><button class="act" onclick="WISHES[${i}].ok=!WISHES[${i}].ok;renderContent()">${w.ok?'إخفاء':'نشر ✓'}</button></td></tr>`).join('')}
  </tbody></table></div>`;}

;

function anaView(){
 const R=(window.__dbMode&&window.__dbRows)?window.__dbRows:null;
 const r=S.range||7;
 if(!R){return `<div class="card"><h3>📊 التحليلات</h3><p class="cmut">سجّلوا الدخول السحابي ☁️ لعرض بيانات زوّاركم الحقيقية.</p></div>`;}
 const now=Date.now(),DAY=86400000,from=now-r*DAY;
 const evs=(R.events||[]).filter(e=>e.created_at&&new Date(e.created_at).getTime()>=from);
 const ords=(R.orders||[]).filter(o=>o.created_at&&new Date(o.created_at).getTime()>=from);
 const rsvps=(R.rsvps||[]);
 const views=evs.filter(e=>e.kind==='view').length;
 const opens=evs.filter(e=>e.kind==='open').length;
 const reveals=evs.filter(e=>e.kind==='reveal').length;
 const replied=rsvps.length;
 const attending=rsvps.filter(x=>x.attending!==false).length;
 const revenue=ords.filter(o=>o.status==='مدفوع'||o.inv_slug).reduce((a,o)=>a+(+o.price||0),0);
 // daily series for views vs opens
 const days=[];for(let i=r-1;i>=0;i--){const d0=now-i*DAY;const k=new Date(d0).toISOString().slice(0,10);days.push(k);}
 const dayCount=(kind)=>days.map(k=>evs.filter(e=>e.kind===kind&&(e.created_at||'').slice(0,10)===k).length);
 const vSeries=dayCount('view'),oSeries=dayCount('open');
 // device split from real events
 const dev={phone:0,tablet:0,desktop:0};evs.forEach(e=>{const d=e.device||'phone';if(dev[d]!=null)dev[d]++;});
 const devTot=dev.phone+dev.tablet+dev.desktop||1;
 const DEV=[{l:'هاتف',v:Math.round(dev.phone/devTot*100),c:'#B98A2F'},{l:'حاسوب',v:Math.round(dev.desktop/devTot*100),c:'#C4827A'},{l:'لوحي',v:Math.round(dev.tablet/devTot*100),c:'#7C9482'}];
 // funnel from real data
 const fun=[['👁️ زاروا الموقع',views,100],
  ['💌 فتحوا الدعوة',opens,views?Math.round(opens/views*100):0],
  ['🎬 شاهدوا الافتتاح',reveals,views?Math.round(reveals/views*100):0],
  ['✍️ ردّوا (RSVP)',replied,views?Math.round(replied/views*100):0],
  ['🎉 سيحضرون',attending,views?Math.round(attending/views*100):0]];
 const live=window.__liveCount||0;
 return `
 <div class="chips">${[7,30,90].map(x=>`<button class="chip ${S.range===x?'on':''}" onclick="S.range=${x};renderContent()">آخر ${toAr(x)} ${x===7?'أيام':'يومًا'}</button>`).join('')}
  <button class="cmini" onclick="dbRefresh()" style="margin-inline-start:auto">تحديث ↻</button></div>

 <div class="statgrid" style="margin-bottom:14px">
  <div class="card" style="text-align:center"><div style="font-size:1.8rem">🟢</div><b style="font-size:1.7rem;font-family:var(--num);color:#2F6B3A">${toAr(live)}</b><div class="sub">على الموقع الآن</div></div>
  <div class="card" style="text-align:center"><div style="font-size:1.8rem">👁️</div><b style="font-size:1.7rem;font-family:var(--num)">${fmtN(views)}</b><div class="sub">زيارة</div></div>
  <div class="card" style="text-align:center"><div style="font-size:1.8rem">💌</div><b style="font-size:1.7rem;font-family:var(--num)">${fmtN(opens)}</b><div class="sub">فتحة دعوة</div></div>
  <div class="card" style="text-align:center"><div style="font-size:1.8rem">💰</div><b style="font-size:1.7rem;font-family:var(--num)">${fmtN(revenue)}</b><div class="sub">د.ت مؤكدة</div></div>
 </div>

 <div class="two">
  <div class="card"><h3>👁️ الزيارات مقابل الفتحات <span class="sub">آخر ${toAr(r)} يومًا</span></h3>
   ${(typeof twoLines==='function')?twoLines(vSeries.length?vSeries:[0],oSeries.length?oSeries:[0],720,200):''}
   <div class="legend"><i style="--c:#B98A2F">زيارات — <b style="font-family:var(--num)">${fmtN(views)}</b></i>
    <i style="--c:#C4827A">فتحات — <b style="font-family:var(--num)">${fmtN(opens)}</b></i></div></div>
  <div class="card"><h3>📱 أجهزة الزوّار <span class="sub">حقيقية</span></h3>
   ${devTot>1?`<div class="donut-wrap">${(typeof donut==='function')?donut(DEV.map(d=>({v:Math.max(d.v,0.001),c:d.c})),'% من الزيارات'):''}
    <div class="legend" style="flex-direction:column;align-items:start">${DEV.map(d=>`<i style="--c:${d.c}">${d.l} — <b style="font-family:var(--num)">${toAr(d.v)}%</b></i>`).join('')}</div></div>`
    :`<p class="cmut">لا زيارات بعد في هذه الفترة.</p>`}</div>
 </div>

 <div class="card"><h3>🫙 قمع التفاعل <span class="sub">من الزيارة إلى الحضور — بيانات حقيقية</span></h3>
  ${views?`<div class="funnel">${fun.map(([l,v,p],i)=>`<div class="fun" style="--w:${100-i*13}%;opacity:${1-i*.07}">
    <span>${l}</span><b>${fmtN(v)} · ${toAr(p)}%</b></div>`).join('')}</div>`
   :`<p class="cmut">لا بيانات بعد — شاركوا رابط موقعكم أو دعوةً ليبدأ العدّ فورًا.</p>`}</div>
`;}

function setView(){
 const c=S.cfg;
 const tg=(k,l)=>`<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
  <span class="sw-toggle ${c[k]?'on':''}" onclick="S.cfg.${k}=!S.cfg.${k};renderContent()"></span>
  <span style="font-weight:600;font-size:.9rem">${l}</span></div>`;
 return `<div class="settings-grid">
  <div class="card"><h3>🏷️ الهوية والأسعار</h3>
   <div class="f-row"><label>اسم المتجر</label><input value="${esc(c.brand)}" oninput="S.cfg.brand=this.value"></div>
   <div class="f-row"><label>سعر الدعوة العادية (د.ت)</label><input type="number" value="${c.priceStd}" oninput="S.cfg.priceStd=+this.value"></div>
   <div class="f-row"><label>سعر دعوة بريميوم ✦ (د.ت)</label><input type="number" value="${c.pricePrem}" oninput="S.cfg.pricePrem=+this.value"></div>
   <div class="f-row"><label>اللغة الافتراضية للموقع</label><select onchange="S.cfg.lang=this.value">
    ${['العربية','Français','English'].map(l=>`<option ${c.lang===l?'selected':''}>${l}</option>`).join('')}</select></div>
   <button class="act gold" onclick="toast('حُفظت الإعدادات ✓ (تجريبي)')">حفظ التغييرات</button></div>
  <div class="card"><h3>🔔 التنبيهات والمزايا</h3>
   ${tg('premOn','إظهار قسم بريميوم ✦ في الموقع')}
   ${tg('mailNew','تنبيه بريدي عند كل طلب جديد')}
   ${tg('mailRsvp','ملخص يومي بردود الضيوف')}
   ${tg('waShare','زر مشاركة واتساب على الدعوات')}
   <div style="border-top:1px dashed var(--line);margin:16px 0;padding-top:16px">
    <h3 style="font-size:.95rem">💾 النسخ الاحتياطي</h3>
    <p style="font-size:.78rem;color:var(--taupe);margin:6px 0 10px;font-weight:600">نزّلوا نسخة كاملة من طلباتكم ودعواتكم وردود ضيوفكم وتهانيهم (ملف JSON) — احفظوها في مكان آمن دوريًا.</p>
    <button class="act gold" onclick="dbBackup()">⬇️ تنزيل نسخة احتياطية كاملة</button>
    <button class="act" style="margin-top:8px" onclick="dbBackupCsv()">⬇️ تنزيل الطلبات (CSV)</button>
    <p id="bkNote" style="font-size:.72rem;color:var(--taupe);margin-top:8px"></p>
   </div></div></div>`;}
function dbBackup(){
 if(!window.__dbMode||!window.__dbRows){toast('سجّلوا الدخول السحابي أولًا ☁️');return;}
 try{
  const R=window.__dbRows;
  const data={exported_at:new Date().toISOString(),app:'farha',orders:R.orders||[],invitations:R.invitations||[],rsvps:R.rsvps||[],wishes:R.wishes||[]};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='farha-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);
  const n=document.getElementById('bkNote');if(n)n.textContent='✓ نُزّلت نسخة تحتوي '+(R.orders||[]).length+' طلب · '+(R.rsvps||[]).length+' رد · '+(R.wishes||[]).length+' تهنئة';
  toast('💾 نُزّلت النسخة الاحتياطية ✓');
 }catch(e){toast('تعذّر التصدير');}}
function dbBackupCsv(){
 if(!window.__dbMode||!window.__dbRows){toast('سجّلوا الدخول السحابي أولًا ☁️');return;}
 try{
  const R=window.__dbRows;const esc=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  let csv='\uFEFF#,المنتج,السعر,الحالة,الهاتف,المرجع,الطريقة,رابط الدعوة,التاريخ\n';
  (R.orders||[]).forEach(o=>{csv+=[o.id,esc(o.item),o.price,esc(o.status||'جديد'),esc(o.phone),esc(o.ref),esc(o.method),esc(o.inv_slug),esc((o.created_at||'').slice(0,10))].join(',')+'\n';});
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  a.download='farha-orders-'+new Date().toISOString().slice(0,10)+'.csv';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('⬇️ نُزّلت الطلبات');
 }catch(e){toast('تعذّر التصدير');}}

