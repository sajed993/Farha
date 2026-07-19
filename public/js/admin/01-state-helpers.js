/* ================= state & helpers ================= */
let S={view:'over',range:30,q:'',ostatus:'الكل',notif:false,side:false,
 cfg:{brand:'فرحة',priceStd:29,pricePrem:79,lang:'العربية',premOn:true,mailNew:true,mailRsvp:true,waShare:true}};
const app=document.getElementById('app');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const sum=a=>a.reduce((x,y)=>x+y,0);
function inRange(o){return o.d<S.range;}
function revenue(range){return sum(ORDERS.filter(o=>o.d<range&&o.status!=='ملغي').map(o=>o.price));}
function ordersIn(range){return ORDERS.filter(o=>o.d<range&&o.status!=='ملغي').length;}
function toast(m){const e=document.createElement('div');e.className='toast';e.textContent=m;
 document.body.appendChild(e);setTimeout(()=>e.remove(),2400);}

