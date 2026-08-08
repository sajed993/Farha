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

/* ═══ three small helpers that outlived the files they were born in ═══
   These lived among the old card designs. The editorial invitation, the wax
   envelope and the share buttons still use them, so they move here rather
   than being rescued one crash at a time. */

/* «نور & كريم» / «Nour et Karim» → the pair of names, however they were joined */
const NAME_SEP=/\s*&\s*|\s*\+\s*|\s+و\s+|\s+and\s+|\s+et\s+/i;
function inNameParts(n){return String(n==null?'':n).replace(/\s+/g,' ').trim()
 .split(NAME_SEP).map(s=>s.trim()).filter(Boolean);}
function inInitials(n){return inNameParts(n).slice(0,2)
 .map(s=>Array.from(s)[0]||'').filter(Boolean);}

/* Arabic-Indic digits were tried and rejected: the invitations read better
   with Latin numerals. Kept as the single place that decision lives. */
function toAr(n){return String(n);}

/* copying a link where the clipboard API is refused (http, old iOS) */
function fallbackCopy(txt,done){try{const ta=document.createElement('textarea');ta.value=txt;
 ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();
 document.execCommand('copy');ta.remove();done();}catch(e){toast('📋');}}
