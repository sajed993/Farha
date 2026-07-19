/* ================= seeded demo data ================= */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
 t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=mulberry32(2026);
const AR_D='0123456789';
const toAr=n=>String(n).replace(/[0-9]/g,d=>AR_D[d]);
const fmtN=n=>toAr(Number(n).toLocaleString('en-US'));
const CUST=['أميرة بن علي','يوسف التريكي','سلمى قلال','محمد الجبالي','ليلى حداد','آدم بوعزيزي','نور شريف','كريم مرزوقي','هند صفر','زياد العياري','مريم بالحاج','سامي غربال','ياسمين كوكي','رامي عبدلي','فاطمة نصري','عمر بن سالم'];
const TPL=[
 {id:1,em:'✨',n:'عرس ذهبي فاخر',cat:'أعراس',badge:'رواج',vis:true},
 {id:2,em:'🕌',n:'عرس عربي ملكي',cat:'أعراس',badge:'مميّز',vis:true},
 {id:3,em:'🕊️',n:'عرس أبيض بسيط',cat:'أعراس',badge:'جديد',vis:true},
 {id:4,em:'🌹',n:'عرس الورد',cat:'أعراس',badge:'',vis:true},
 {id:5,em:'🎓',n:'تخرّج عصري',cat:'تخرّج',badge:'',vis:true},
 {id:6,em:'🎓',n:'تخرّج فاخر داكن',cat:'تخرّج',badge:'مميّز',vis:true},
 {id:7,em:'🎈',n:'عيد ميلاد مرح',cat:'أخرى',badge:'رواج',vis:true},
 {id:8,em:'☁️',n:'استقبال مولود',cat:'أخرى',badge:'',vis:true},
 {id:9,em:'🥂',n:'خطوبة أنيقة',cat:'أخرى',badge:'جديد',vis:true},
 {id:10,em:'🪔',n:'دعوة عربية كلاسيكية',cat:'أخرى',badge:'',vis:true},
 {id:11,em:'📖',n:'حكاية حب',cat:'أعراس',badge:'جديد',vis:true}];
const FILMS=[
 {id:'p1',em:'🌅',n:'عرس الغروب الذهبي',cat:'واقعي'},{id:'p2',em:'🏰',n:'القصر الملكي',cat:'واقعي'},
 {id:'p3',em:'⛲',n:'الحديقة الملكية',cat:'واقعي'},{id:'p4',em:'🚪',n:'أبواب القصر',cat:'واقعي'},
 {id:'p5',em:'🦋',n:'حكاية الفراشة',cat:'خيالي'},{id:'p6',em:'🎆',n:'ليلة المهرجان',cat:'خيالي'},
 {id:'p7',em:'🌙',n:'ضوء القمر',cat:'خيالي'},{id:'p8',em:'✨',n:'غبار السحر',cat:'خيالي'}];
FILMS.forEach(f=>{f.vis=true;f.uses=Math.floor(R()*60+14)});
const PRICE={std:29,prem:79,scratch:19};
const STATUSES=['جديد','مدفوع','مُسلّم','ملغي'];
/* orders across 90 days, newest first */
let ORDERS=[];{let oid=1180;
 for(let d=89;d>=0;d--){
  const growth=(89-d)/89;
  let n=Math.floor(R()*2.4+growth*2.6);
  if(d%7<2)n+=1;
  for(let k=0;k<n;k++){
   const prem=R()<0.24+growth*0.14;
   const scratch=!prem&&R()<0.14;
   const tpl=prem?FILMS[Math.floor(R()*8)]:TPL[R()<0.5?Math.floor(R()*4):Math.floor(R()*11)];
   let status='مُسلّم';
   if(d<1)status=R()<0.6?'جديد':'مدفوع';
   else if(d<4)status=R()<0.5?'مدفوع':'مُسلّم';
   if(R()<0.04)status='ملغي';
   ORDERS.push({id:'FR-'+(oid++),d,cust:CUST[Math.floor(R()*CUST.length)],
    tpl:tpl.n,em:tpl.em,prem,price:prem?PRICE.prem:(scratch?PRICE.scratch:PRICE.std),status});
  }}
 ORDERS.sort((a,b)=>a.d-b.d);}
/* daily views/opens */
const DAYS=90;
let VIEWS=[],OPENS=[];
for(let d=DAYS-1;d>=0;d--){const g=(DAYS-1-d)/DAYS;
 const v=Math.floor(38+g*150+R()*46+(d%7<2?36:0));
 VIEWS.push(v);OPENS.push(Math.floor(v*(0.55+R()*0.14)));}
/* invitations */
const COUPLES=[['نور & كريم',1],['مريم و يوسف',2],['أمل & رامي',3],['هند و زياد',4],['سلمى · دفعة 2026',5],['آدم 2026',6],['لينا',7],['صغيرنا الغالي',8],['سارة و آدم',9],['آل بن صالح',10],['ياسمين & مهدي',11],['ريم & أنس',1],['شيماء و بلال',4],['دفعة الطب 2026',6]];
let INV=COUPLES.map(([n,tid],i)=>{const t=TPL[tid-1];
 const views=Math.floor(R()*900+120),op=Math.floor(views*(0.5+R()*0.2));
 const yes=Math.floor(op*(0.28+R()*0.2)),no=Math.floor(op*(0.05+R()*0.06));
 return {id:i+1,n,em:t.em,tpl:t.n,when:Math.floor(R()*80+4),views,op,yes,no,
  prem:R()<0.35,active:R()<0.86};});
/* guests of first invitation as sample + wishes */
const GNAMES=['خالتي سعاد','عمّي منصف','أنس و ريم','عائلة الجبالي','د. ليلى','صديق الطفولة معز','جيران البيت القديم','ابنة العم شهد','أصدقاء الجامعة','عائلة بوسالم','مروى','حمزة و أسماء','الأستاذ رضا','أم أيوب','فريق العمل','لطفي','منى و توفيق','عائلة عمّار'];
let GUESTS=GNAMES.map((g,i)=>{const r=R();
 return {n:g,st:r<0.52?'سيحضر':r<0.68?'معتذر':'لم يرد',react:Math.floor(R()*9),inv:1+Math.floor(R()*3)};});
const WTXT=['ألف مبروك! فرحتكم فرحتنا 💛','ما شاء الله، أجمل دعوة رأيتها','عقبال الفرحة الكبرى 🎉','الله يتمم لكم على خير','دمعت عيني من الافتتاحية 🥹','بالرفاه والبنين','كل التوفيق يا أبطال','تستاهلوا كل الجمال','إن شاء الله حاضرون!','دعوة تحفة… من صممها؟ 😍','ربي يسعدكم','أحلى عرسان 🤍'];
let WISHES=[];for(let i=0;i<22;i++){WISHES.push({id:i+1,txt:WTXT[Math.floor(R()*WTXT.length)],
 who:CUST[Math.floor(R()*CUST.length)],inv:INV[Math.floor(R()*INV.length)].n,
 d:Math.floor(R()*14),ok:R()<0.8});}
/* notifications */
const NOTIFS=[
 {em:'🛒',b:'طلب جديد — عرس ذهبي فاخر',s:'قبل 8 دقائق · أميرة بن علي'},
 {em:'💌',b:'23 ردًّا جديدًا على دعوة نور & كريم',s:'قبل ساعة'},
 {em:'✨',b:'فيلم «أبواب القصر» تخطّى 100 استخدام',s:'اليوم'},
 {em:'⭐',b:'تقييم 5 نجوم من هند صفر',s:'أمس'}];

;

