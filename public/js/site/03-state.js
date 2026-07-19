/* ================= state ================= */
let S={lang:'ar',view:'land',filter:'all',pmFilter:'all',design:null,cart:0,
 c:{t:'',n:'',d:'',p:'',m:'',when:'',maps:'',qr:false,font:0,pal:0,anim:0,music:1,autoplay:true,
    bg:'#FFF9EC',ac:'#B98A2F',ink:'#3A2B10',orn:'✨',corners:'',layer:'',frame:true,foil:true,
    program:[],track:null,story:[],guest:'',trackStart:0,trackEnd:30,trackDur:0,fade:true,memVid:null},
 st:{occ:0,style:0,names:'',date:'',dateISO:'',music:1,photos:[],track:null,video:null},
 df:{step:0,food:-1,day:null,time:-1,mon:6,yr:2026},
 wishes:[]};
const t=()=>T[S.lang];
const app=document.getElementById('app');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function getDesign(){
 if(S.design===0)return {id:0,cat:'oth',badge:null,name:{ar:T.ar.myCard,fr:T.fr.myCard,en:T.en.myCard},
  bg:S.c.bg,ac:S.c.ac,ink:S.c.ink,foil:S.c.foil,orn:S.c.orn,corners:S.c.corners,layer:S.c.layer,def:SCRATCH_DEF};
 return DESIGNS.find(d=>d.id===S.design);}

