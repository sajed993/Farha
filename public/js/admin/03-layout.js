/* ================= layout ================= */

/* mobile drawer */
(function(){
 if(document.getElementById('navburger'))return;
 const b=document.createElement('button');b.id='navburger';b.className='navburger';b.textContent='☰';
 b.onclick=function(){const s=document.querySelector('.side');const open=!(s&&s.classList.contains('open'));
  if(s)s.classList.toggle('open',open);document.body.classList.toggle('navopen',open);b.textContent=open?'✕':'☰';};
 document.body.appendChild(b);
 document.addEventListener('click',function(e){
  if(!document.body.classList.contains('navopen'))return;
  const s=document.querySelector('.side');
  if(e.target.closest('.side')){ if(e.target.closest('[onclick],a,button')){s.classList.remove('open');document.body.classList.remove('navopen');b.textContent='☰';} return;}
  if(e.target!==b&&!e.target.closest('.navburger')){s&&s.classList.remove('open');document.body.classList.remove('navopen');b.textContent='☰';}
 },true);
})();
