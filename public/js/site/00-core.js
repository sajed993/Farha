var dbHookQ=[];function dbHook(k,d){try{dbHookQ.push([k,d]);if(dbHookQ.length>80)dbHookQ.shift();if(window.__dbHook)window.__dbHook(k,d);}catch(e){}}

