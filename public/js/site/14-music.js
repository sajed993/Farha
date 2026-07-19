/* ================= music ================= */
let AC=null,playing=[],AUD=null;
const MEL={
 1:{wave:'sine',bpm:66,notes:[[392,2],[523,2],[659,3],[587,2],[523,2],[659,4],[784,2],[659,2],[587,3],[523,2],[494,2],[523,6]]},
 2:{wave:'triangle',bpm:138,notes:[[523,1],[523,1],[659,2],[523,2],[698,2],[659,4],[523,1],[523,1],[659,2],[523,2],[784,2],[698,4],[880,2],[784,2],[698,2],[659,4]]},
 3:{wave:'sine',bpm:88,notes:[[587,2],[622,2],[740,3],[622,2],[587,2],[554,3],[587,2],[698,2],[622,3],[587,2],[554,2],[587,5]]}};
let fadeI=null;
function fadeTo(v,ms,cb){if(!AUD){if(cb)cb();return;}
 clearInterval(fadeI);
 const from=AUD.volume,steps=Math.max(1,Math.round(ms/40)),dv=(v-from)/steps;let k=0;
 fadeI=setInterval(()=>{k++;if(!AUD){clearInterval(fadeI);return;}
  AUD.volume=Math.min(1,Math.max(0,from+dv*k));
  if(k>=steps){clearInterval(fadeI);if(AUD)AUD.volume=Math.min(1,Math.max(0,v));if(cb)cb();}},40);}
function playMusic(i){stopMusic();
 if(!i)return;
 if(i===4&&S.c.track){
  AUD=new Audio(S.c.track.url);
  const st=Math.max(0,+S.c.trackStart||0);
  let en=+S.c.trackEnd||0;const dur=+S.c.trackDur||0;
  if(dur&&en>dur)en=dur;
  const seg=en>st+1,target=.78,doFade=!!S.c.fade;
  let switching=false;
  try{AUD.currentTime=st;}catch(e){}
  AUD.volume=doFade?0:target;
  const restart=()=>{if(!AUD)return;switching=true;
   const jump=()=>{if(!AUD)return;try{AUD.currentTime=st;}catch(e){}
    AUD.play().catch(()=>{});if(doFade)fadeTo(target,800);else AUD.volume=target;
    setTimeout(()=>{switching=false;},300);};
   if(doFade)fadeTo(0,700,jump);else jump();};
  AUD.ontimeupdate=()=>{if(!AUD||switching)return;
   if(seg&&AUD.currentTime>=en-(doFade?0.75:0.05))restart();};
  AUD.onended=()=>{if(AUD&&!switching)restart();};
  AUD.play().catch(()=>{});
  if(doFade)fadeTo(target,900);
  return;}
 try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
 if(AC.state==='suspended')AC.resume();
 const m=MEL[i];if(!m)return;
 const beat=60/m.bpm;let when=AC.currentTime+.12;
 const loop=(reps)=>{m.notes.forEach(([f,dr])=>{const o=AC.createOscillator(),g=AC.createGain();
  o.type=m.wave;o.frequency.value=f;o.connect(g);g.connect(AC.destination);
  g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(.15,when+.05);
  g.gain.exponentialRampToValueAtTime(.001,when+dr*beat*.95);
  o.start(when);o.stop(when+dr*beat);playing.push(o);when+=dr*beat*.6;});};
 loop();loop();}catch(e){}}
function stopMusic(){playing.forEach(o=>{try{o.stop()}catch(e){}});playing=[];
 clearInterval(fadeI);clearInterval(synthLoopT);
 if(AUD){try{AUD.ontimeupdate=null;AUD.onended=null;AUD.pause();}catch(e){}AUD=null;}
 if(showAUD){try{showAUD.pause()}catch(e){}showAUD=null;}}

document.documentElement.dir='rtl';document.documentElement.lang='ar';
loadCFG();
const __r0=render;render=function(){__r0();try{applyCFGdom()}catch(e){}};
render();
