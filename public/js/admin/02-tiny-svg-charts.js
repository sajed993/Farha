/* ================= tiny SVG charts ================= */
function areaChart(data,w,h,color,fill){
 const mx=Math.max(...data)*1.12,n=data.length;
 const pt=data.map((v,i)=>[(i/(n-1))*w,h-8-(v/mx)*(h-22)]);
 const line=pt.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
 const area=line+` L${w} ${h} L0 ${h} Z`;
 const grid=[0.25,0.5,0.75].map(g=>`<line x1="0" x2="${w}" y1="${(h-8)*g}" y2="${(h-8)*g}" stroke="rgba(138,106,43,.12)" stroke-dasharray="3 5"/>`).join('');
 return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none">
  <defs><linearGradient id="ag${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stop-color="${color}" stop-opacity=".38"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  ${grid}<path d="${area}" fill="${fill||('url(#ag'+color.replace('#','')+')')}"/>
  <path d="${line}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${pt[n-1][0]}" cy="${pt[n-1][1]}" r="4.5" fill="${color}" stroke="#fff" stroke-width="2"/></svg>`;}
function spark(data,color){return areaChart(data,120,38,color);}
function twoLines(a,b,w,h){
 const mx=Math.max(...a,...b)*1.12,n=a.length;
 const path=d=>d.map((v,i)=>((i?'L':'M')+((i/(n-1))*w).toFixed(1)+' '+(h-8-(v/mx)*(h-22)).toFixed(1))).join(' ');
 return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none">
  <path d="${path(a)}" fill="none" stroke="#B98A2F" stroke-width="2.6" stroke-linecap="round"/>
  <path d="${path(b)}" fill="none" stroke="#C4827A" stroke-width="2.6" stroke-dasharray="1 0" stroke-linecap="round" opacity=".9"/></svg>`;}
function donut(parts,unit){
 unit=unit||'طلب';
 const total=sum(parts.map(p=>p.v));let acc=0;
 const C=2*Math.PI*44;
 const segs=parts.map(p=>{const f=p.v/total,off=acc*C;acc+=f;
  return `<circle r="44" cx="60" cy="60" fill="none" stroke="${p.c}" stroke-width="16"
   stroke-dasharray="${(f*C).toFixed(1)} ${C.toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}"
   transform="rotate(-90 60 60)" stroke-linecap="butt"/>`;}).join('');
 return `<svg viewBox="0 0 120 120" width="150" height="150">${segs}
  <text x="60" y="57" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="19" fill="#2A2118">${fmtN(total)}</text>
  <text x="60" y="74" text-anchor="middle" font-size="8.5" fill="#8A7A63" font-family="IBM Plex Sans Arabic">${unit}</text></svg>`;}

