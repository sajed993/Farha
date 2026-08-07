var dbHookQ=[];function dbHook(k,d){try{dbHookQ.push([k,d]);if(dbHookQ.length>80)dbHookQ.shift();if(window.__dbHook)window.__dbHook(k,d);}catch(e){}}

/* ============ the page scroll lock ============
   Every full-screen layer used to set body.overflow itself and trust some
   other line to put it back. One of those lines asked `querySelector('.veil')`
   — and three decorative preview cards inside the «واقعي جدًا» markup carry a
   `veil` class of their own, so the answer was always yes and the page stayed
   locked after an order form closed, with nothing on screen to explain it.

   Nothing counts or remembers now. This looks at what is actually on the page
   and sets overflow to match, so calling it twice, or after a layer someone
   forgot to announce, still lands on the truth. Call it after any open or
   close. */
function scrollSync(){
 try{
  const open=document.getElementById('ordveil')||document.getElementById('rvveil')
   ||document.querySelector('body > .veil')||document.querySelector('body > .edi');
  document.body.style.overflow=open?'hidden':'';
 }catch(e){}
}
