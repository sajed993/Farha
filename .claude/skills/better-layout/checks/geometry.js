(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 for(let i=0;i<80 && typeof openReady!=='function';i++) await sleep(100);
 const waitEdi=async()=>{for(let i=0;i<120;i++){if(document.querySelector('.edi-s'))return;await sleep(100);}};
 const over=[];
 const sweep=(where)=>{
  document.querySelectorAll('body *').forEach(el=>{
   const cs=getComputedStyle(el);
   if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity<0.05)return;
   if(cs.position==='fixed')return;
   const r=el.getBoundingClientRect();
   if(r.width<4||r.height<4)return;
   if(r.right>innerWidth+2||r.left<-2){
    const s=el.tagName.toLowerCase()+'.'+String(el.className||'').trim().split(/\s+/)[0];
    if(!over.some(o=>o.s===s)) over.push({s,where,l:Math.round(r.left),r:Math.round(r.right)});
   }});};
 await sleep(600); sweep('site');
 const hs=document.body.scrollWidth-document.documentElement.clientWidth;
 openReady('takeoff'); await sleep(500);
 document.getElementById('wenvWax').__open(); await waitEdi(); await sleep(1200);
 document.querySelectorAll('.edi-in,.edi-cue').forEach(e=>e.classList.add('in'));
 sweep('invitation');
 const edi=document.querySelector('.edi');
 const hs2=edi?edi.scrollWidth-edi.clientWidth:0;
 try{stopMusic();closeVeil(true);}catch(e){}
 return {vw:innerWidth, sideScrollSite:hs, sideScrollInvitation:hs2, over:over.slice(0,8)};})()
