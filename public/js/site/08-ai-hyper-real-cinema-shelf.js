/* ================= AI hyper-real cinema shelf ================= */
const AIP=[
`Create an ultra-photorealistic cinematic wedding invitation set during golden hour on a pristine tropical beach. A breathtaking bride wearing a luxurious flowing white wedding gown walks barefoot across the wet sand while her elegant groom, dressed in a perfectly tailored black tuxedo, walks toward her. Their clothes move naturally with the ocean breeze. The camera follows them with smooth Hollywood-style drone movements before slowly orbiting around the couple. Gentle waves reflect the golden sunlight, creating mirror-like reflections. They stop in the middle of the shoreline, hold each other, smile naturally, and share a slow, romantic kiss as the camera circles them in slow motion. White rose petals drift through the air while tiny glowing golden particles sparkle around them. Vertical 9:16, 20 seconds. Photorealistic, cinematic masterpiece, Hollywood wedding film, luxury perfume commercial aesthetic, 4K HDR, 60 FPS, ultra realistic humans, natural facial expressions, emotional storytelling, physically accurate lighting, global illumination, ray tracing, cinematic depth of field, anamorphic lens flares, volumetric lighting, soft golden particles, realistic cloth simulation, premium color grading, luxury atmosphere, award-winning cinematography, seamless camera movements, no cartoon style, no CGI appearance, no distortion, perfect hands, perfect faces, premium wedding advertisement quality.`,
`Begin with an extreme macro shot of a beautiful white butterfly resting on a blooming white rose covered with morning dew. The butterfly slowly opens its wings before gently flying through an enormous luxury botanical garden filled with roses, fountains, cherry blossom trees, and marble statues. The camera follows behind the butterfly in one continuous cinematic shot. It flies between elegant floral arches before discovering a breathtaking bride standing alone in an ivory wedding dress. The butterfly circles her gracefully before softly landing beside her ear. She closes her eyes and smiles naturally. At that exact moment thousands of golden particles explode softly into the air while the groom walks toward her. They embrace lovingly. The camera slowly rotates around them in cinematic slow motion. 30 seconds. Photorealistic, cinematic masterpiece, Hollywood wedding film, luxury perfume commercial aesthetic, 4K HDR, 60 FPS, ultra realistic humans, natural facial expressions, emotional storytelling, physically accurate lighting, global illumination, ray tracing, cinematic depth of field, anamorphic lens flares, volumetric lighting, soft golden particles, realistic cloth simulation, premium color grading, luxury atmosphere, award-winning cinematography, seamless camera movements, no cartoon style, no CGI appearance, no distortion, perfect hands, perfect faces, premium wedding advertisement quality.`,
`Produce an ultra-luxury cinematic wedding invitation inside an enormous European palace inspired by Versailles. Massive marble staircases, crystal chandeliers, white roses, gold decorations, and candlelight illuminate the room. A bride slowly descends the staircase wearing an elegant couture wedding gown with a ten-meter-long flowing veil. At the bottom of the stairs waits the groom in an elegant black tuxedo. The camera moves with slow Steadicam shots while sunlight pours through enormous palace windows creating volumetric god rays. They meet in the center of the ballroom, gently hold hands, dance slowly, then kiss beneath a massive crystal chandelier. Thousands of floating golden dust particles surround them. Photorealistic, cinematic masterpiece, Hollywood wedding film, luxury perfume commercial aesthetic, 4K HDR, 60 FPS, ultra realistic humans, natural facial expressions, emotional storytelling, physically accurate lighting, global illumination, ray tracing, cinematic depth of field, anamorphic lens flares, volumetric lighting, soft golden particles, realistic cloth simulation, premium color grading, luxury atmosphere, award-winning cinematography, seamless camera movements, no cartoon style, no CGI appearance, no distortion, perfect hands, perfect faces, premium wedding advertisement quality.`,
`A luxurious black-themed wedding beside a calm ocean under a full moon. Everything is illuminated only by moonlight, candles, and soft lanterns. The bride wears a breathtaking white gown while the groom wears an elegant velvet black tuxedo. Reflections shimmer across the water. Slow cinematic camera movements reveal the couple walking hand in hand before stopping beneath an elegant floral arch made of white roses and crystal decorations. They slowly kiss as fireworks silently illuminate the night sky behind them. White flower petals float around them while silver particles sparkle through the air. Photorealistic, cinematic masterpiece, Hollywood wedding film, luxury perfume commercial aesthetic, 4K HDR, 60 FPS, ultra realistic humans, natural facial expressions, emotional storytelling, physically accurate lighting, global illumination, ray tracing, cinematic depth of field, anamorphic lens flares, volumetric lighting, soft golden particles, realistic cloth simulation, premium color grading, luxury atmosphere, award-winning cinematography, seamless camera movements, no cartoon style, no CGI appearance, no distortion, perfect hands, perfect faces, premium wedding advertisement quality.`,
`Begin with an aerial shot over Venice at sunset. A luxurious gondola slowly glides through peaceful canals decorated with white roses and candles. The bride wears a couture wedding gown while the groom wears an elegant tuxedo. They look at each other lovingly before sharing a romantic kiss as the gondola passes beneath an ancient stone bridge. Golden reflections dance across the water. The camera slowly pulls upward revealing the historic city while elegant invitation typography fades into the sky. Photorealistic, cinematic masterpiece, Hollywood wedding film, luxury perfume commercial aesthetic, 4K HDR, 60 FPS, ultra realistic humans, natural facial expressions, emotional storytelling, physically accurate lighting, global illumination, ray tracing, cinematic depth of field, anamorphic lens flares, volumetric lighting, soft golden particles, realistic cloth simulation, premium color grading, luxury atmosphere, award-winning cinematography, seamless camera movements, no cartoon style, no CGI appearance, no distortion, perfect hands, perfect faces, premium wedding advertisement quality.`,
`A breathtaking dream sequence begins above the clouds during sunrise. Massive floating marble platforms, waterfalls flowing into the clouds, golden trees, white flowers, and heavenly architecture create an ethereal atmosphere. The bride and groom walk toward each other across a glowing marble bridge. Their clothes move naturally with the wind. They embrace before kissing while golden feathers drift from the sky. The camera slowly circles around them with dramatic cinematic lighting. Elegant gold invitation typography materializes from glowing particles. Photorealistic, cinematic masterpiece, Hollywood wedding film, luxury perfume commercial aesthetic, 4K HDR, 60 FPS, ultra realistic humans, natural facial expressions, emotional storytelling, physically accurate lighting, global illumination, ray tracing, cinematic depth of field, anamorphic lens flares, volumetric lighting, soft golden particles, realistic cloth simulation, premium color grading, luxury atmosphere, award-winning cinematography, seamless camera movements, no cartoon style, no CGI appearance, no distortion, perfect hands, perfect faces, premium wedding advertisement quality.`
];
const AIICO=['🏖️','🦋','👑','🌕','🛶','☁️'];
const AIPAL=[['#F2C879','#8A5A3A','#2E5E66'],['#E9F0DF','#7C9482','#3A5E42'],['#F6EAD2','#D3AC55','#6E4A22'],
 ['#22304F','#5570B8','#0A0E1E'],['#F0A868','#C4667F','#2E5E66'],['#F7D3E2','#E3C77E','#7088C0']];
let AIV=[null,null,null,null,null,null];
function aiPremiere(url,title){closeVeil(true);
 veil=document.createElement('div');veil.className='veil premium';document.body.appendChild(veil);scrollSync();
 veil.innerHTML=`<div class="cstage" style="display:grid;place-items:center;background:#000">
  <div style="width:100%;max-width:760px;padding:14px;text-align:center">
   <div style="color:#E9C87B;font-weight:800;font-size:1.05rem;margin-bottom:10px">🎬 ${esc(title||'')}</div>
   ${url?`<video src="${url}" controls autoplay playsinline style="width:100%;border-radius:14px;background:#000"></video>`:`<p style="color:#ccc">الفيلم قيد التجهيز 🎞️</p>`}
   <p style="color:#B9A88A;font-size:.72rem;margin-top:10px">اضغطوا مطوّلًا على الفيديو لحفظه 💛</p>
  </div></div><button class="close-x" onclick="closeVeil()">${t().closePrev}</button>`;}
function aiList(){
 const M=(CFG&&CFG.media)||{};
 const base=AIICO.map((ic,i)=>({i:i,ic:ic,builtin:true,nm:t().aiNames[i],ds:t().aiDescs[i],
  url:(AIV[i]&&AIV[i].url)||((M.films&&M.films[i]&&M.films[i].url)||'')}));
 const customs=(M.customFilms||[]).map((f,j)=>({i:100+j,ic:f.em||'🎬',builtin:false,nm:f.nm||'فيلم خاص',ds:f.ds||'',url:f.url||''}));
 return base.concat(customs);}
function aiUp(ev,i){const f=ev.target.files[0];if(!f)return;
 if(AIV[i]&&AIV[i].url)try{URL.revokeObjectURL(AIV[i].url)}catch(e){}
 AIV[i]={name:f.name.slice(0,24),url:URL.createObjectURL(f)};render();toast('🎬 ✓');}
function copyPrompt(i){const txt=AIP[i];
 const done=()=>toast(t().aiCopied);
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done).catch(()=>fallbackCopy(txt,done));}
 else fallbackCopy(txt,done);}
function fallbackCopy(txt,done){try{const ta=document.createElement('textarea');ta.value=txt;
 ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();
 document.execCommand('copy');ta.remove();done();}catch(e){toast('📋');}}
function aiPlay(i){
 const _f=aiList().find(x=>x.i===i);if(!_f||!_f.url){toast(t().aiNoVid);return;}
 closeVeil(true);
 veil=document.createElement('div');veil.className='veil';veil.style.background='#000';
 document.body.appendChild(veil);scrollSync();
 veil.innerHTML=`<div class="aiplay">
   <video id="aivid" src="${_f.url}" playsinline autoplay></video>
   <div class="lbx t"></div><div class="lbx d"></div><div class="grainfx"></div>
   <div class="ai-cal"><div class="ai-line" id="ail1">${t().aiL1}</div>
    <div class="ai-line ai-names" id="ail2">${esc(S.st.names||S.c.n||'')||['نور & مهدي','Emma & Alexander','Emma & Alexander'][['ar','fr','en'].indexOf(S.lang)]}</div>
    <div class="ai-line" id="ail3">${t().aiL3}</div></div>
  </div>
  <button class="s-skip film-skip" onclick="closeVeil()">${t().storySkip}</button>
  <button class="close-x" onclick="closeVeil()">${t().closePrev}</button>`;
 const v=veil.querySelector('#aivid');
 const arm=(dur)=>{const d=Math.max(6,dur||20);
  filmT.push(setTimeout(()=>{const e=document.getElementById('ail1');if(e)e.classList.add('show');},d*500));
  filmT.push(setTimeout(()=>{const e=document.getElementById('ail2');if(e)e.classList.add('show');},d*660));
  filmT.push(setTimeout(()=>{const e=document.getElementById('ail3');if(e)e.classList.add('show');},d*800));};
 if(v){v.onloadedmetadata=()=>arm(v.duration);
  v.onended=()=>{const c=veil&&veil.querySelector('.ai-cal');if(c)c.classList.add('hold');};
  v.onerror=()=>arm(20);
  v.play().catch(()=>{v.muted=true;v.play().catch(()=>{});});
  filmT.push(setTimeout(()=>{if(v.readyState<1)arm(20);},1500));}}

