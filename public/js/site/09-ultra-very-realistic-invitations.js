/* ================= ULTRA very-realistic invitations ================= */
const ULTRA=[
 {k:'noir',ini:{ar:'ن&م',fr:'M&M',en:'M&M'},names:{ar:'نور & مهدي',fr:'Maya & Mehdi',en:'Maya & Mehdi'},
  date:{ar:'21 نوفمبر 2026',fr:'21 novembre 2026',en:'November 21, 2026'},iso:'20261121T163000',time:'16:30'},
 {k:'ivory',ini:{ar:'س&ي',fr:'S&Y',en:'S&Y'},names:{ar:'سلمى & يوسف',fr:'Salma & Youssef',en:'Salma & Youssef'},
  date:{ar:'9 مايو 2027',fr:'9 mai 2027',en:'May 9, 2027'},iso:'20270509T170000',time:'17:00'},
 {k:'royal',ini:{ar:'ه&ز',fr:'H&Z',en:'H&Z'},names:{ar:'هند & زياد',fr:'Hind & Ziad',en:'Hind & Ziad'},
  date:{ar:'14 فبراير 2027',fr:'14 février 2027',en:'February 14, 2027'},iso:'20270214T180000',time:'18:00'}];
let uIdx=0,uMusic=true,uOvr=null;window.__setUltraOvr=function(o){uOvr=o||null;};
function ulaceHTML(seed){
 let h='';
 for(let i=0;i<26;i++){const s=(6+((i*37+seed*13)%22));
  h+=`<i style="left:${(i*41+seed*29)%96}%;top:${(i*53+seed*17)%94}%;width:${s}px;height:${s}px"></i>`;}
 const fl=['❀','✿','❁','✾'];
 for(let i=0;i<14;i++){h+=`<i class="fl" style="left:${(i*67+seed*31)%92}%;top:${(i*43+seed*23)%90}%;font-size:${12+((i*7)%14)}px">${fl[i%4]}</i>`;}
 return h;}
function svgUMap(acc){
 return `<svg viewBox="0 0 430 230" style="width:100%;display:block;background:#F2ECDD">
  <path d="M-10 40 Q80 20 160 55 T430 40" fill="none" stroke="#E2D8C2" stroke-width="13"/>
  <path d="M-10 130 Q120 100 230 140 T440 120" fill="none" stroke="#E2D8C2" stroke-width="17"/>
  <path d="M60 240 Q90 150 70 60" fill="none" stroke="#E2D8C2" stroke-width="11"/>
  <path d="M300 240 Q330 160 310 70 Q305 30 340 -10" fill="none" stroke="#E2D8C2" stroke-width="13"/>
  <ellipse cx="392" cy="196" rx="90" ry="48" fill="#CFE0DA"/>
  <ellipse cx="392" cy="196" rx="90" ry="48" fill="none" stroke="#BBD1C9" stroke-width="2"/>
  ${[[36,178],[120,42],[196,186],[256,58],[152,118]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5.5" fill="#D8CDB4"/><circle cx="${p[0]}" cy="${p[1]}" r="9.5" fill="none" stroke="#D8CDB4" stroke-width="1.4" opacity=".6"/>`).join('')}
  <g transform="translate(215,96)">
   <circle r="17" fill="${acc}" opacity=".16"><animate attributeName="r" values="13;24;13" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".22;.05;.22" dur="2.6s" repeatCount="indefinite"/></circle>
   <path d="M0 10 C -10 -2 -9 -14 0 -15 C 9 -14 10 -2 0 10 Z" fill="${acc}"/>
   <circle cy="-7" r="4" fill="#FAF5EC"/></g></svg>`;}
function ultraOpen(i){
 uIdx=i;const u=ULTRA[i];
 closeVeil(true);
 veil=document.createElement('div');veil.className='veil u-'+u.k;
 document.body.appendChild(veil);document.body.style.overflow='hidden';
 const st=document.createElement('div');st.className='uveil';veil.appendChild(st);
 st.innerHTML=`
  <div class="uenv-wrap" id="uenvw" onclick="ultraCrack()">
   <div class="uenv"><div class="ulace">${ulaceHTML(i+2)}</div><div class="usheen"></div></div>
   <div class="uribbon"><i></i><i></i></div>
   <div class="uflap"><div class="ulace" style="opacity:.6">${ulaceHTML(i+7)}</div></div>
   <div class="useal" id="useal"><b>${u.ini[S.lang]}</b></div>
  </div>
  <div class="uhint">${t().uSealHint}</div>`;
 veil.insertAdjacentHTML('beforeend',`<button class="close-x" onclick="closeVeil()">${t().closePrev}</button>
  <button class="usnd" id="usnd" onclick="ultraSound()">${uMusic?t().uMusicOn:t().uMusicOff}</button>`);}
function ultraCrack(){
 const w=document.getElementById('uenvw');if(!w||w.dataset.done)return;w.dataset.done=1;
 const seal=document.getElementById('useal');if(seal)seal.classList.add('crack');
 const hint=veil.querySelector('.uhint');if(hint)hint.remove();
 if(uMusic)try{playMusic(1);}catch(e){}
 setTimeout(()=>{const stg=veil&&veil.querySelector('.uveil');if(stg)stg.classList.add('uopen');},350);
 setTimeout(()=>ultraDoc(),1500);}
function ultraDoc(){
 if(!veil)return;const u=ULTRA[uIdx];
 const doc=document.createElement('div');doc.className='udoc';
 doc.innerHTML=`<div class="paper">
  <div class="usec u-hero">
   <span class="spark">✦</span>
   <div class="knames">${esc((uOvr&&uOvr.n)||u.names[S.lang])}</div>
   <div class="kdiv"></div>
   <div class="kdate">${esc((uOvr&&uOvr.d)||u.date[S.lang])}</div>
  </div>
  <div class="usec">
   <div class="stt">${t().uStory}</div><span class="spark" style="font-size:1rem">♡</span>
   <div class="sst">${t().uHow}</div><p class="tx">${t().uHowTx}</p>
   <div class="sst">${t().uLove}</div><p class="tx">${t().uLoveTx}</p>
   <div class="sst">${t().uProp}</div><p class="tx">${t().uPropTx}</p>
  </div>
  <div class="usec">
   <span class="spark">✦</span><div class="stt">${t().uCer}</div>
   <div class="u-rows">
    <div class="r"><span class="ic">🕐</span>${t().uCerAt} ${u.time}</div>
    <div class="r"><span class="ic">📍</span><b>${t().uCerVenue}</b></div>
    <div class="r" style="color:#8A7A63;font-size:.88rem">${t().uCerCity}</div>
   </div>
   <div class="umap">${svgUMap(getComputedStyle(veil).getPropertyValue('--uacc')||'#8A6A2B')}</div>
   <p class="tx" style="margin-bottom:18px">${t().uCerNote}</p>
   <div class="ubts">
    <button class="ubt" onclick="window.open('https://maps.google.com/?q='+encodeURIComponent(t().uCerVenue+', '+t().uCerCity),'_blank')">${t().uMaps}</button>
    <button class="ubt solid" onclick="ultraICS()">${t().uCal}</button>
   </div>
  </div>
  <div class="usec">
   <span class="spark">✦</span><div class="stt">${t().uRsvp}</div>
   <div class="uform">
    <div><span class="flab">${t().uAttend} *</span>
     <div class="uradio">
      <label><input type="radio" name="uatt" value="y" checked><span>💛 ${t().uYes}</span></label>
      <label><input type="radio" name="uatt" value="n"><span>${t().uNo}</span></label>
     </div></div>
    <div><span class="flab">${t().uGuests}</span>
     <select id="ugsel">${t().uGuestN.map((g,gi)=>`<option value="${gi+1}">${g}</option>`).join('')}</select></div>
    <div class="ubox"><div class="bt">⚠️ ${t().uAllg}</div><div class="bn">${t().uAllgNote}</div>
     <div class="uchecks">${t().uAllgs.map((a,ai)=>`<label><input type="checkbox" data-a="${ai}">${a}</label>`).join('')}</div>
     <div style="margin-top:12px"><span class="flab">${t().uOther}</span>
      <input type="text" id="uoth" placeholder="${t().uOtherPh}"></div></div>
    <div><span class="flab">${t().uMsg}</span><textarea id="umsg" placeholder="${t().uMsgPh}"></textarea></div>
    <button class="usend" onclick="ultraSend()">${t().uSend}</button>
   </div>
  </div>
  <div class="ucandles">${[26,40,32,48,30,38,24].map(h=>`<div class="ucnd" style="height:${h}px"></div>`).join('')}</div>
  <div class="ufoot">${t().brand||'فرحة'} ✦</div>
 </div>`;
 veil.appendChild(doc);
 requestAnimationFrame(()=>requestAnimationFrame(()=>doc.classList.add('in')));
 setTimeout(()=>{const s=veil&&veil.querySelector('.uveil');if(s)s.remove();},1400);}
function ultraSound(){uMusic=!uMusic;const b=document.getElementById('usnd');
 if(b)b.textContent=uMusic?t().uMusicOn:t().uMusicOff;
 if(!uMusic)stopMusic();else try{playMusic(1);}catch(e){}}
function ultraICS(){const u=ULTRA[uIdx];
 try{
  const dt=u.iso;const de=dt.replace(/T(\d{2})/,(m,h)=>'T'+String(Math.min(23,+h+4)).padStart(2,'0'));
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Farha//Invite//AR','BEGIN:VEVENT',
   'UID:'+Date.now()+'@farha','DTSTART:'+dt,'DTEND:'+de,
   'SUMMARY:'+u.names[S.lang]+' — '+t().uCer,
   'LOCATION:'+t().uCerVenue+', '+t().uCerCity,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
  a.download='farha-invitation.ics';a.click();toast(t().uCalOk);
 }catch(e){toast(t().uCalOk);}}
function ultraSend(){
 try{const att=(document.querySelector('input[name=uatt]:checked')||{}).value==='y';
  const guests=parseInt((document.getElementById('ugsel')||{}).value||'1')||1;
  const allergies=[...document.querySelectorAll('.uchecks input:checked')].map(x=>x.parentElement.textContent.trim());
  const other=((document.getElementById('uoth')||{}).value||'').slice(0,120);
  const message=((document.getElementById('umsg')||{}).value||'').slice(0,300);
  dbHook('rsvp',{inv_slug:window.__inviteSlug||null,attending:att,guests:guests,allergies:allergies,other:other,message:message});}catch(e){}
 toast(t().uSent);burst(['🤍','✦','💛']);
 const s=veil&&veil.querySelector('.usend');if(s){s.disabled=true;s.style.opacity=.6;}}
