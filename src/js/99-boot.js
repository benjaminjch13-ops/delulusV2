
/* ================= mobile dock: proxies the toolbar buttons and mirrors their state ================= */
document.addEventListener('click',e=>{const d=e.target.closest('[data-click]');if(d)$(d.dataset.click)?.click()});
$$('.dock [data-click]').forEach(b=>{const t=$(b.dataset.click);if(!t||b.classList.contains('on'))return;const sync=()=>b.classList.toggle('act',t.classList.contains('on'));sync();
  new MutationObserver(sync).observe(t,{attributes:true,attributeFilter:['class']})});

/* ================= boot ================= */
(async()=>{await DB.open();let st=await DB.get('state');
  if(!st||!Array.isArray(st.agendas))st=seed();
  const imgs={};if(st.images&&Object.keys(st.images).length){Object.assign(imgs,st.images);for(const[k,v]of Object.entries(st.images))await DB.set('img:'+k,v).catch(()=>{})}
  else for(const k of st.imgIds||[]){const v=await DB.get('img:'+k);if(v)imgs[k]=v}
  delete st.imgIds;st.images=imageStore(imgs);st.prefs=migratePrefs(Object.assign({theme:'delulu',mode:'system',view:'portadas',sort:'recent',favs:[],custom:[]},st.prefs||{}));S=st;applyPrefs();
  try{await DB.set('state',diskState());setSave('ok','Guardado')}catch(e){setSave('err','No se pudo guardar en este navegador')}
  $('#brandHome').innerHTML=brandLogo('sm');ED.snap=S.prefs.snap!==false;updSnapBtn();renderHome();routeHash();if(!S.prefs.welcomed&&!location.hash.startsWith('#ver-'))setTimeout(openWelcome,400)})();
