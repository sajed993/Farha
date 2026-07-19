/* ================= render ================= */
const TITLES={over:'نظرة عامة',ctl:'التحكم بالموقع',media:'المحتوى والأفلام',orders:'الطلبات',inv:'الدعوات',tpl:'القوالب والأفلام',guests:'الضيوف والردود',wish:'التهاني',ana:'التحليلات',set:'الإعدادات'};
function viewHTML(){return {over:overView,ctl:ctlView,media:mediaView,orders:ordersView,inv:invView,tpl:tplView,guests:guestsView,wish:wishView,ana:anaView,set:setView}[S.view]();}
function render(){app.innerHTML=shell(viewHTML(),TITLES[S.view]);}
function renderContent(){const c=document.getElementById('content');
 if(c)c.innerHTML=viewHTML();
 const badge=document.querySelector('.nav-item .pill');/* keep */}
function go(v){S.view=v;S.side=false;S.notif=false;S.q='';S.ostatus='الكل';render();window.scrollTo(0,0);}
document.addEventListener('click',e=>{if(S.notif&&!e.target.closest('.bell')&&!e.target.closest('.notif')){S.notif=false;render();}});
render();
