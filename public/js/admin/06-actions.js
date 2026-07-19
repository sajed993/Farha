/* ================= actions ================= */
function setStatus(id,v){const o=ORDERS.find(x=>x.id===id);if(o){o.status=v;renderContent();toast('حُدّثت حالة '+id+' → '+v);}}
function dlCSV(name,rows){try{
 const csv='\uFEFF'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
 a.download=name;a.click();toast('جارٍ تنزيل '+name+' ⬇️');}catch(e){toast('التصدير متاح عند فتح اللوحة في المتصفح');}}
function exportOrders(){dlCSV('farha-orders.csv',[['الطلب','العميل','القالب','النوع','السعر','الحالة'],
 ...ORDERS.map(o=>[o.id,o.cust,o.tpl,o.prem?'بريميوم':'عادي',o.price,o.status])]);}
function exportGuests(){dlCSV('farha-guests.csv',[['الضيف','الدعوة','الرد','تفاعلات'],
 ...GUESTS.map(g=>[g.n,INV[g.inv-1]?INV[g.inv-1].n:'',g.st,g.react])]);}

