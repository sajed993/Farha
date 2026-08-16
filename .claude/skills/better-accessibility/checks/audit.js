(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 for(let i=0;i<80 && typeof openReady!=='function';i++) await sleep(100);
 const waitEdi=async()=>{for(let i=0;i<120;i++){if(document.querySelector('.edi-s'))return;await sleep(100);}};
 const bad={divBtn:[],noLabel:[],noFocus:[],smallTap:[],svgNotHidden:[],physicalSide:[]};
 const seen=new Set();
 const note=(k,el,extra)=>{const s=el.tagName.toLowerCase()+'.'+String(el.className||'').trim().split(/\s+/)[0]+(extra||'');
   if(!seen.has(k+s)){seen.add(k+s);bad[k].push(s);}};
 const scan=(root,where)=>{
  root.querySelectorAll('*').forEach(el=>{
   const r=el.getBoundingClientRect(); if(r.width<2||r.height<2)return;
   const cs=getComputedStyle(el);
   /* a clickable thing that is not a control */
   /* a div with role=button and a tabindex is reachable and announced; the
      first version of this check ignored both and went on flagging them */
   if(el.getAttribute('onclick')
      && !/^(button|a|input|select|textarea|label|summary)$/i.test(el.tagName)
      && !(el.getAttribute('role')==='button' && el.hasAttribute('tabindex')))
    note('divBtn',el,' @'+where);
   /* an icon-only control with nothing to announce */
   if(/^(button|a)$/i.test(el.tagName)){
    const txt=(el.textContent||'').trim();
    if(!txt && !el.getAttribute('aria-label') && !el.getAttribute('title')) note('noLabel',el,' @'+where);
    /* the box can be small while the target is not: an ::after may carry the
       reach. Measure the pseudo-element too rather than the box alone. */
    const af=getComputedStyle(el,'::after');
    const pw=parseFloat(af.width)||0, ph=parseFloat(af.height)||0;
    const tw=Math.max(r.width,pw), th=Math.max(r.height,ph);
    /* an inline link inside a sentence is not a tap target with a size of its
       own — the rule is for standalone controls, not for words in a paragraph */
    const inline=el.tagName.toLowerCase()==='a' && !!el.closest('p,.edi-body,.edi-pos');
    if(!inline && (tw<44||th<44)) note('smallTap',el,' '+Math.round(tw)+'x'+Math.round(th)+' @'+where);
   }
   /* decorative svg that a reader will try to announce */
   /* an ancestor with aria-hidden already removes the whole subtree from the
      tree — checking the element alone flagged the frame ornaments, which sit
      inside .edi-frame[aria-hidden]. The test was wrong, not the markup. */
   if(el.tagName.toLowerCase()==='svg' && !el.closest('[aria-hidden]')
      && !el.getAttribute('role') && !el.querySelector('title')) note('svgNotHidden',el,' @'+where);
  });};
 scan(document,'site');
 openReady('marble'); await sleep(400);
 document.getElementById('wenvWax').__open(); await waitEdi(); await sleep(900);
 document.querySelectorAll('.edi-in,.edi-cue').forEach(e=>e.classList.add('in'));
 scan(document.getElementById('edi'),'invitation');
 /* language + direction actually set */
 const langOK=document.documentElement.lang && document.documentElement.dir;
 /* reduced motion honoured somewhere */
 const rm=[...document.styleSheets].some(s=>{try{return [...s.cssRules].some(r=>/prefers-reduced-motion/.test(r.conditionText||''));}catch(e){return false;}});
 try{stopMusic();closeVeil(true);}catch(e){}
 return {langOK, dir:document.documentElement.dir, lang:document.documentElement.lang, reducedMotionRules:rm,
   divBtn:bad.divBtn.slice(0,10), noLabel:bad.noLabel.slice(0,10),
   smallTap:bad.smallTap.slice(0,10), svgNotHidden:bad.svgNotHidden.slice(0,8),
   counts:{divBtn:bad.divBtn.length,noLabel:bad.noLabel.length,smallTap:bad.smallTap.length,svg:bad.svgNotHidden.length}};})()
