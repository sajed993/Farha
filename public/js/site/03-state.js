/* ================= state ================= */
let S={lang:'ar',view:'land',filter:'all',rdFilter:'all',cart:0,tier:'prem',extras:[],
 /* The opening is always the editorial one. It used to default to 0 — the old
    royal envelope — which is how invitations that never said otherwise opened
    as old cards. There is only one opening now, and this says so. */
 c:{t:'',n:'',d:'',p:'',m:'',when:'',maps:'',qr:false,font:0,pal:0,anim:'edi',music:1,autoplay:true,musicStart:'open',
    bg:'#FFF9EC',ac:'#B98A2F',ink:'#3A2B10',orn:'✨',corners:'',layer:'',frame:true,foil:true,
    program:[],track:null,story:[],guest:'',trackStart:0,trackEnd:30,trackDur:0,fade:true,memVid:null},
 st:{occ:0,style:0,names:'',date:'',dateISO:'',music:1,photos:[],track:null,video:null},
 df:{step:0,food:-1,day:null,time:-1,mon:6,yr:2026},
 wishes:[]};
const t=()=>T[S.lang];
const app=document.getElementById('app');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));


