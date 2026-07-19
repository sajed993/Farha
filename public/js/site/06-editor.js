/* ================= editor ================= */
function editorView(){
 const dz=getDesign();const scratch=S.design===0;
 const fonts=t().fonts.map((f,i)=>`<button class="opt ${S.c.font===i?'on':''}" style="font-family:${(S.lang==='ar'?FONTS_A:FONTS_L)[i]}" onclick="setC('font',${i})">${f}</button>`).join('');
 const pals=PALETTES.map((p,i)=>{const bg=p?p.bg:dz.bg,ac=p?p.ac:dz.ac;
  return `<button class="sw ${S.c.pal===i?'on':''}" style="background:linear-gradient(135deg,${bg} 55%,${ac} 55%)" onclick="setC('pal',${i})"></button>`;}).join('');
 const anims=t().anims.map((a,i)=>`<button class="opt ${S.c.anim===i?'on':''}" onclick="setC('anim',${i})">${ANIM_ICO[i]} ${a}</button>`).join('')+vopenBtns();
 const musNames=[...t().musics,...(S.c.track?[S.c.track.name]:[])];
 const mus=musNames.map((m,i)=>`<button class="opt ${S.c.music===i?'on':''}" onclick="setC('music',${i})">${['🔇','🎹','🥁','🪕','🎵'][i]||'🎵'} ${m}</button>`).join('');
 const emojis=['💍','❤️','✨','🌸','🕊️','🎓','⭐','🎉','🎈','🥂','🌙','🪔'].map(e=>`<button onclick="addEmoji('${e}')">${e}</button>`).join('');
 let designCtl='';
 if(scratch){
  const orns=['💍','🌹','🎓','🎈','🥂','🌙','🪔','🕊️','⭐','🎂','☁️','👑','✨','🎀'].map(e=>`<button class="${S.c.orn===e?'sel':''}" onclick="setC('orn','${e}')">${e}</button>`).join('');
  const cors=[['',''],['svg','⌜'],['🌸','🌸'],['✦','✦'],['⭐','⭐'],['🎈','🎈'],['✿','✿']].map(([v,l])=>`<button class="${S.c.corners===v?'sel':''}" onclick="setC('corners','${v}')">${l||'—'}</button>`).join('');
  const pats=t().patterns.map((p,i)=>`<button class="opt ${S.c.layer===LAYERS[i]?'on':''}" onclick="setC('layer','${LAYERS[i]}')">${p}</button>`).join('');
  const frm=t().frames.map((f,i)=>`<button class="opt ${(S.c.frame!==false)===(i===0)?'on':''}" onclick="setC('frame',${i===0})">${f}</button>`).join('');
  designCtl=`
   <div class="ctl-sec"><label>🎨 ${t().lColors}</label>
     <div class="row3">
      <div>BG<input type="color" value="${S.c.bg}" oninput="setC('bg',this.value)"></div>
      <div>✦<input type="color" value="${S.c.ac}" oninput="setC('ac',this.value)"></div>
      <div>Aa<input type="color" value="${S.c.ink}" oninput="setC('ink',this.value)"></div>
     </div></div>
   <div class="ctl-sec"><label>${t().lOrn}</label><div class="emoji-row">${orns}</div></div>
   <div class="ctl-sec"><label>${t().lCorners}</label><div class="emoji-row">${cors}</div></div>
   <div class="ctl-sec"><label>${t().lPattern}</label><div class="opt-row">${pats}</div></div>
   <div class="ctl-sec"><label>${t().lFrame}</label><div class="opt-row">${frm}</div></div>`;
 }
 const storyRows=S.c.story.map((s,i)=>`<div class="prog-item">
   <button class="del" onclick="delSlide(${i})">✕</button>
   <span class="mini-label">${t().slideText} ${i+1}</span>
   <textarea rows="2" onchange="setSlide(${i},'t',this.value)">${esc(s.t)}</textarea>
   <div class="photo-strip" style="margin-top:9px">
    ${s.ph?`<span class="ph"><img src="${s.ph}"><button class="rm" onclick="rmSlidePhoto(${i})">✕</button></span>`
      :`<button class="add-ph" onclick="document.getElementById('slf${i}').click()">＋</button>
        <input id="slf${i}" class="hiddenfile" type="file" accept="image/*" onchange="addSlidePhoto(event,${i})">`}
   </div></div>`).join('');
 const fmtT=s=>{s=Math.max(0,Math.floor(+s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
 const dur=Math.max(10,Math.ceil(S.c.trackDur||300));
 const trimUI=S.c.track?`<div style="margin-top:14px">
   <span class="mini-label">✂️ ${t().lTrim} ${S.c.trackDur?`(${fmtT(S.c.trackDur)})`:''}</span>
   <div class="trimrow"><span>${t().trimStart}</span><input id="rgSt" type="range" min="0" max="${dur}" step="1" value="${S.c.trackStart}" oninput="setTrim('trackStart',this.value)"><b id="lblSt">${fmtT(S.c.trackStart)}</b></div>
   <div class="trimrow"><span>${t().trimEnd}</span><input id="rgEn" type="range" min="0" max="${dur}" step="1" value="${S.c.trackEnd}" oninput="setTrim('trackEnd',this.value)"><b id="lblEn">${fmtT(S.c.trackEnd)}</b></div>
   <div class="trim-actions">
    <button class="opt" onclick="playMusic(4)">${t().trimPlay}</button>
    <button class="opt" onclick="stopMusic()">${t().trimStop}</button>
    <span class="toggle ${S.c.fade?'on':''}" onclick="setC('fade',${!S.c.fade})"><span class="tgl"></span>${t().fadeL}</span>
   </div></div>`:'';
 const progRows=S.c.program.map((p,i)=>{
  const dmus=[...t().musics,...(S.c.track?[S.c.track.name]:[])].map((m,mi)=>`<option value="${mi}" ${p.music===mi?'selected':''}>${m}</option>`).join('');
  const phs=p.photos.map((ph,pi)=>`<span class="ph"><img src="${ph}"><button class="rm" onclick="rmPhoto(${i},${pi})">✕</button></span>`).join('');
  return `<div class="prog-item">
   <button class="del" onclick="delDay(${i})">✕</button>
   <div class="row2" style="margin-bottom:9px">
    <div><span class="mini-label">${t().dTime}</span><input type="text" value="${esc(p.time)}" onchange="setProg(${i},'time',this.value)"></div>
    <div><span class="mini-label">${t().dTitle}</span><input type="text" value="${esc(p.title)}" onchange="setProg(${i},'title',this.value)"></div></div>
   <div class="row2" style="margin-bottom:9px">
    <div><span class="mini-label">${t().dPlace}</span><input type="text" value="${esc(p.place)}" onchange="setProg(${i},'place',this.value)"></div>
    <div><span class="mini-label">${t().dMap}</span><input type="url" value="${esc(p.map)}" onchange="setProg(${i},'map',this.value)" placeholder="https://maps.google.com/…"></div></div>
   <div class="row2" style="align-items:end">
    <div><span class="mini-label">${t().dMusic}</span><select onchange="setProg(${i},'music',+this.value)" style="width:100%;padding:11px;border-radius:12px;border:1.5px solid rgba(92,79,62,.2);background:var(--cream)">${dmus}</select></div>
    <div><span class="mini-label">${t().dPhotos}</span>
     <div class="photo-strip">${phs}
      <button class="add-ph" onclick="document.getElementById('phf${i}').click()">＋</button>
      <input id="phf${i}" class="hiddenfile" type="file" accept="image/*" multiple onchange="addPhotos(event,${i})">
     </div></div></div>
  </div>`;}).join('');
 return navHTML()+`<div class="page"><div class="page-head">
   <button class="crumb" onclick="go('land')">${t().back}</button>
   <h2>${t().editTitle} · ${dz.name[S.lang]}</h2></div>
  <div class="editor">
   <div class="stage" id="stage">${inviteHTML(dz,S.c)}</div>
   <div class="controls">
    <div class="ctl-sec"><label>✍️ ${t().lTitle}</label><input type="text" value="${esc(S.c.t)}" oninput="setC('t',this.value)">
     <span class="mini-label" style="margin-top:12px">${t().lNames}</span><input type="text" value="${esc(S.c.n)}" oninput="setC('n',this.value)">
     <div class="row2" style="margin-top:12px">
      <div><span class="mini-label">${t().lDateTxt}</span><input type="text" value="${esc(S.c.d)}" oninput="setC('d',this.value)"></div>
      <div><span class="mini-label">${t().lPlace}</span><input type="text" value="${esc(S.c.p)}" oninput="setC('p',this.value)"></div></div>
     <span class="mini-label" style="margin-top:12px">${t().lMsg}</span><textarea oninput="setC('m',this.value)">${esc(S.c.m)}</textarea>
     <div style="margin-top:10px" class="emoji-row">${emojis}</div></div>
    <div class="ctl-sec"><label>⏳ ${t().lWhen}</label><input type="datetime-local" value="${esc(S.c.when)}" onchange="setC('when',this.value)">
     <span class="mini-label" style="margin-top:12px">${t().lMaps}</span><input type="url" value="${esc(S.c.maps)}" onchange="setC('maps',this.value)" placeholder="https://maps.google.com/…">
     <div style="margin-top:12px"><span class="toggle ${S.c.qr?'on':''}" onclick="setC('qr',${!S.c.qr})"><span class="tgl"></span>${t().lQr}</span></div>
     <span class="mini-label" style="margin-top:12px">👋 ${t().lGuest}</span><input type="text" value="${esc(S.c.guest)}" oninput="setC('guest',this.value)"></div>
    <div class="ctl-sec"><label>🗓️ ${t().lProgram}</label>${progRows}
     <button class="add-day" onclick="addDay()">${t().addDay}</button></div>
    <div class="ctl-sec"><label>📖 ${t().lStory}</label>${storyRows}
     <button class="add-day" onclick="addSlide()">${t().addSlide}</button></div>
    <div class="ctl-sec"><label>🖋️ ${t().lFont}</label><div class="opt-row">${fonts}</div></div>
    ${scratch?designCtl:`<div class="ctl-sec"><label>🎨 ${t().lColors}</label><div class="swatches">${pals}</div></div>`}
    <div class="ctl-sec"><label>🎬 ${t().lAnim}</label><div class="opt-row">${anims}</div>
     <span class="mini-label" style="margin-top:14px">${t().pmScenes}</span>
     <div class="opt-row">${t().pmNames.map((n,i)=>`<button class="opt prem-opt ${S.c.anim===100+i?'on':''}" onclick="setC('anim',${100+i})">${PM_ICO[i]} ${n}</button>`).join('')}</div></div>
    <div class="ctl-sec"><label>${t().lMusic}</label><div class="opt-row">${mus}</div>
     <div style="margin-top:12px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">
      <label class="upload-lab">🎵 ${t().upTrack}<input class="hiddenfile" type="file" accept="audio/*" onchange="upTrack(event)"></label>
      <span class="toggle ${S.c.autoplay?'on':''}" onclick="setC('autoplay',${!S.c.autoplay})"><span class="tgl"></span>${t().autoplay}</span>
     </div>${trimUI}
     <div style="margin-top:16px;border-top:1px dashed rgba(138,106,43,.18);padding-top:14px">
      <span class="mini-label">🎥 ${t().lVideo}</span>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:4px">
       <label class="upload-lab">${t().upVideo}<input class="hiddenfile" type="file" accept="video/*" onchange="upMemVid(event)"></label>
       ${S.c.memVid?`<span style="font-size:.8rem;color:var(--gold3);font-weight:700">${esc(S.c.memVid.name)} ✓ <button onclick="rmMemVid()" style="color:var(--red);font-weight:700">✕</button></span>`:''}
      </div></div></div>
    <div class="big-actions">
     <button class="btn-hero" style="background:linear-gradient(120deg,#1E4A28,#2F6B3A);color:#EFFBF2" onclick="addToCart(((DESIGNS.find(z=>z.id===S.design)||{}).name||{})[S.lang]||'دعوة رقمية',CFG.price.design)">${t().buyDesign} ${CFG.price.design} ${S.lang==='ar'?'د.ت':'DT'}</button>
     <button class="btn-hero" onclick="ceremony(true)">${t().preview}</button>
     <button class="btn-ghost" onclick="shareLink()">${t().getLink}</button>
     <button class="btn-ghost" onclick="addCart()">${t().addCart}</button>
    </div></div></div></div>`;}

;

