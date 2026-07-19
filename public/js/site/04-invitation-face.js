/* ================= invitation face ================= */
function cdChip(when){
 if(!when)return '';
 const diff=new Date(when)-Date.now();
 if(diff<=0)return `<div class="i-cd">${t().started}</div>`;
 const days=Math.ceil(diff/864e5);
 return `<div class="i-cd">⏳ ${t().daysLeft} ${S.lang==='ar'?toAr(days):days} ${t().dayW}</div>`;}
function toAr(n){return String(n).replace(/[0-9]/g,d=>'0123456789'[d]);}
function inviteHTML(dz,c){
 const pal=PALETTES[c.pal];
 const bg=pal?pal.bg:dz.bg, ac=pal?pal.ac:dz.ac, ink=pal?pal.ink:dz.ink;
 const font=(S.lang==='ar'?FONTS_A:FONTS_L)[c.font];
 let layer='';
 if(dz.layer==='bg-stars'){let s='';for(let i=0;i<10;i++)s+=`<i style="left:${8+Math.random()*84}%;top:${5+Math.random()*90}%;animation-delay:${(Math.random()*2).toFixed(2)}s">✦</i>`;layer=`<div class="bg-stars" style="position:absolute;inset:0">${s}</div>`;}
 else if(dz.layer==='bg-confetti'){const em=['🎉','✨','🎈','⭐'];let s='';for(let i=0;i<9;i++)s+=`<i style="left:${5+Math.random()*88}%;top:${4+Math.random()*92}%;transform:rotate(${Math.floor(Math.random()*60-30)}deg)">${em[i%4]}</i>`;layer=`<div class="bg-confetti" style="position:absolute;inset:0">${s}</div>`;}
 else if(dz.layer)layer=`<div class="${dz.layer}"></div>`;
 let cor='';
 if(dz.corners==='svg')cor=['tl','tr','bl','br'].map(p=>`<span class="fcorner ${p}">${CORNER_SVG}</span>`).join('');
 else if(dz.corners)cor=['tl','tr','bl','br'].map(p=>`<span class="fcorner ${p}" style="font-size:1.15em;display:grid;place-items:center">${dz.corners}</span>`).join('');
 let pets='';
 if(dz.pet){let ps='';for(let i=0;i<5;i++)ps+=`<i style="left:${8+i*19+Math.random()*6}%;animation-duration:${(7+Math.random()*6).toFixed(1)}s;animation-delay:${(-Math.random()*9).toFixed(1)}s">${dz.pet}</i>`;pets=`<div class="inpetals">${ps}</div>`;}
 return `<div class="invite" style="--ibg:${bg};--iac:${ac};--iink:${ink};--ifont:${font}">
   ${layer}${pets}${cor}${c.frame===false?'':'<div class="frame"></div>'}<div class="grain"></div><div class="sheen"></div>
   <div class="i-orn">${dz.orn}</div>
   <div class="i-title">${esc(c.t)}</div>
   <div class="i-names ${dz.foil?'foil':''}">${esc(c.n)}</div>
   <div class="i-flourish">${FLOURISH}</div>
   <div class="i-date"><i>◆</i>${esc(c.d)}<i>◆</i></div>
   <div class="i-place">${esc(c.p)}</div>
   <div class="i-msg">${esc(c.m)}</div>
   ${cdChip(c.when)}</div>`;}

;

