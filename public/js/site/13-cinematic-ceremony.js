/* ================= the veil the invitation opens inside =================
   This file used to be the whole ceremony: nine ways of opening a card —
   an envelope, a wax seal, a ribbon, curtains, a butterfly garden — plus the
   premium film reel, the uploaded video openings and the golden door. All of
   them dressed the old card designs, which are gone.

   What is left is the part the editorial invitation actually uses: the veil
   it lives in, the way out of it, and the two small things a guest touches.

   The important consequence is that there is now exactly one way an
   invitation opens. Before, the opening was chosen by S.c.anim, and anything
   that was not the string 'edi' fell through to a card. The default was 0 —
   the royal envelope — so a delivered invitation whose config never said
   otherwise opened as an old card. That is the bug that was reported twice.
   It cannot happen now: there is nothing else to fall into. */

let veil = null, demoBackup = null, cdTimer = null;

function cineShell(inner){
 return `<div class="cine-fx"><div class="rays"></div><div class="spot"></div><div class="vign"></div></div>
  <div class="lbx t"></div><div class="lbx b"></div>
  <button class="close-x" onclick="closeVeil()">${t().closePrev}</button>
  <div class="flash" id="flash"></div>${inner}`;}

/* Open an invitation. `intro` shows the «you have received an invitation»
   card first, which is what a guest arriving on a link sees. */
function ceremony(intro){
 closeVeil(true);
 veil=document.createElement('div');veil.className='veil';
 document.body.appendChild(veil);scrollSync();
 for(let i=0;i<22;i++){const d=document.createElement('span');d.className='dust';
  const s=(2+Math.random()*3.5).toFixed(1);
  d.style.cssText=`position:fixed;left:${Math.random()*100}%;width:${s}px;height:${s}px;--dx:${(Math.random()*70-35).toFixed(0)}px;
   animation:rise ${(8+Math.random()*8).toFixed(1)}s linear ${(-Math.random()*8).toFixed(1)}s infinite;z-index:2`;
  veil.appendChild(d);}
 if(intro){
  const box=document.createElement('div');box.className='cstage';
  box.innerHTML=`<div class="recv"><div class="recv-emo">💌</div>
   <p style="font-size:1.3rem;color:var(--champ);margin-bottom:2px;font-weight:700">${S.c.guest?`${t().helloGuest} ${esc(S.c.guest)} 💛`:`${t().helloAll} 💛`}</p>
   <h2>${t().received}</h2>
   <p>${t().fromWho} <b style="color:var(--champ)">${esc(S.c.n)}</b></p>
   <button class="btn-hero" onclick="startGuestFlow()">${t().openIt}</button></div>`;
  veil.insertAdjacentHTML('afterbegin',cineShell(''));
  veil.appendChild(box);
 } else { veil.insertAdjacentHTML('afterbegin',cineShell('')); mountCeremony(); }
}
function startGuestFlow(){ mountCeremony(); }

/* One opening, always. */
function mountCeremony(){ editorialOpen(); }

/* the countdown inside the invitation */
function startCountdown(){clearInterval(cdTimer);
 const row=document.getElementById('cdrow');if(!row)return;
 const tick=()=>{const diff=new Date(S.c.when)-Date.now();
  if(diff<=0){row.innerHTML=`<div class="started">${t().started}</div>`;clearInterval(cdTimer);return;}
  const d=Math.floor(diff/864e5),h=Math.floor(diff/36e5)%24,m=Math.floor(diff/6e4)%60,s=Math.floor(diff/1e3)%60;
  const v=[d,h,m,s];
  row.innerHTML=v.map((x,i)=>`<div class="cd-box"><b>${String(x).padStart(2,'0')}</b><span>${t().cdL[i]}</span></div>`).join('');};
 tick();cdTimer=setInterval(tick,1000);}

function rsvp(y){
 if(typeof openRsvp==='function'){openRsvp(!!y);return;}
 toast(t().rsvpSent);if(y)burst(['🎉','💛']);
 const r=veil&&veil.querySelector('.rsvp');if(r)r.style.opacity=.45;}

function closeVeil(silent){
 if(veil){veil.remove();veil=null;}
 scrollSync();stopMusic();clearInterval(cdTimer);
 try{clearTimeout(showEndT)}catch(e){}
 try{clearInterval(ediCdT)}catch(e){}
 try{if(typeof ambT!=='undefined')clearInterval(ambT);}catch(e){}
 if(!silent&&demoBackup){S.c=demoBackup.c;demoBackup=null;}
 if(!silent&&S.view==='land')ambient();}

function burst(ems){for(let i=0;i<38;i++){const s=document.createElement('span');s.className='conf';
 s.textContent=ems[i%ems.length];
 s.style.cssText=`left:${Math.random()*100}vw;font-size:${(0.8+Math.random()*1.5).toFixed(2)}rem;animation-duration:${(2.6+Math.random()*2.8).toFixed(1)}s;animation-delay:${(Math.random()*0.9).toFixed(2)}s`;
 document.body.appendChild(s);setTimeout(()=>s.remove(),6500);}}
