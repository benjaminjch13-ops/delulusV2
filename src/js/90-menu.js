
/* ================= hamburger menu: every feature, grouped, aware of the current screen ================= */
const curScreen=()=>['home','open','cover','share','order'].find(v=>$('#'+v).classList.contains('show'))||'home';
function drawerHTML(){const scr=curScreen(),a=(scr==='open'||scr==='cover')?ED.a:null,mode=S.prefs.mode||'system',desk=innerWidth>820;
  const I=(act,icon,label,o={})=>`<button type="button" class="dr-item${o.on?' on':''}" data-do="${act}"${o.toggle?` role="switch" aria-checked="${!!o.on}"`:''}>${ico(icon)}<span>${label}${o.hint?`<small>${o.hint}</small>`:''}</span>${o.toggle?'<i class="tg" aria-hidden="true"></i>':''}</button>`;
  const recent=[...S.agendas].filter(x=>x!==a).sort((x,y)=>y.updated-x.updated).slice(0,3);
  return `<div class="dr-head">${brandLogo('sm')}<button type="button" class="btn ghost icon" data-do="close" aria-label="Cerrar menú">${ico('x')}</button></div>
  <p class="dr-hello">${esc(greeting())}</p>
  <nav class="dr-body">
   <div class="dr-sec"><span class="lbl">Agendas</span>${scr!=='home'?I('home','home','Mi estantería'):''}${I('new','plus','Nueva agenda')}${I('import','up2','Importar una copia',{hint:'archivo .journaly.json'})}
    ${recent.length?`<span class="dr-sub">Recientes</span>${recent.map(r=>`<button type="button" class="dr-recent" data-do="openid" data-id="${r.id}">${bookHTML(r,Math.round(dims(r)[0]*.043))}<span><b>${esc(r.name)}</b><small>${ago(r.updated).replace('editada ','')}</small></span></button>`).join('')}`:''}</div>
   ${a?`<div class="dr-sec"><span class="lbl">Esta agenda · ${esc(a.name)}</span>
     ${scr==='cover'?I('pages','book','Abrir las páginas'):I('cover','brush','Editar la portada')}
     ${scr==='open'?I('thumbs','pages','Páginas',{hint:'agregar, duplicar, mover, borrar'})+I('tpls','grid','Plantillas y paquetes'):''}
     ${I('export','dl','Exportar',{hint:'PDF, imágenes o página web'})}${I('share','share',window.claude?(a.shareId?'Compartida · ver el enlace':'Compartir con un enlace'):'Compartir',window.claude?{}:{hint:'como página web, PDF o imágenes'})}
     ${I('orderthis','bag','Pedir esta libreta en cuero')}${I('backup1','box','Guardar una copia de esta agenda')}${I('rename','edit','Nombre y tamaño')}${I('dup','copy','Duplicar la agenda')}</div>`:''}
   ${scr==='open'?`<div class="dr-sec"><span class="lbl">Herramientas</span>${I('draw','pen','Dibujo libre',{toggle:1,on:!!ED.draw})}${I('snap','magnet','Guías de alineación',{toggle:1,on:ED.snap})}${desk?I('double','spread','Ver dos páginas',{toggle:1,on:V.double}):''}</div>`:''}
   ${scr==='cover'?`<div class="dr-sec"><span class="lbl">Herramientas</span>${I('c3d','cube','Vista 3D',{toggle:1,on:CV.three})}${I('snap','magnet','Guías de alineación',{toggle:1,on:ED.snap})}</div>`:''}
   <div class="dr-sec dr-brandsec"><span class="lbl">Delulu Journal</span>${I('order','bag','Pedí tu libreta de cuero',{hint:'armala en 4 pasos y pedila por DM'})}${I('howto','guide','Cómo armo mi Delulu')}<a class="dr-item" href="${BRAND.igURL}" target="_blank" rel="noopener">${ico('ig')}<span>@${BRAND.ig}<small>Instagram</small></span></a></div>
   <div class="dr-sec"><span class="lbl">Apariencia</span>${I('theme','palette','Tema, colores y letra')}
    <div class="dr-seg" role="radiogroup" aria-label="Modo claro u oscuro">${[['system','Sistema'],['light','Claro'],['dark','Oscuro']].map(([v,l])=>`<button type="button" data-do="mode" data-v="${v}" class="${mode===v?'on':''}" role="radio" aria-checked="${mode===v}">${l}</button>`).join('')}</div></div>
   <div class="dr-sec"><span class="lbl">Ayuda</span>${I('tour','compass','Recorrido por esta pantalla')}${I('guide','guide','Guía de Delulu Journal',{hint:'cómo hacer cada cosa'})}${desk?I('keys','key','Atajos de teclado'):''}${I('welcome','help','Ver la bienvenida')}</div>
   <div class="dr-sec"><span class="lbl">Tus datos</span>${I('data','box','Copias y almacenamiento')}</div>
  </nav>
  <p class="dr-foot">Todo se guarda solo, en este navegador.</p>`}
function openDrawer(){const d=$('#drawer');d.innerHTML=drawerHTML();d.hidden=false;$('#drawerVeil').hidden=false;$('#btnMenu').setAttribute('aria-expanded','true');
  requestAnimationFrame(()=>{d.classList.add('in');$('#drawerVeil').classList.add('in')});setTimeout(()=>d.querySelector('.dr-item')?.focus(),60)}
function closeDrawer(){const d=$('#drawer');if(d.hidden)return;d.classList.remove('in');$('#drawerVeil').classList.remove('in');$('#btnMenu').setAttribute('aria-expanded','false');
  setTimeout(()=>{d.hidden=true;$('#drawerVeil').hidden=true},220)}
const keepOpen=new Set(['mode','snap','double','draw','c3d']);
function drawerAct(act,b){const a=ED.a;
  switch(act){
    case 'close':break;
    case 'home':if(curScreen()==='share')history.replaceState(null,'',location.pathname+location.search);deselect();ED.draw=null;go('home');break;
    case 'new':openCreate();break;
    case 'import':$('#impBackup').click();break;
    case 'openid':openAgenda(S.agendas.find(x=>x.id===b.dataset.id));break;
    case 'pages':openAgenda(a);break;
    case 'cover':deselect();openCover(a);break;
    case 'thumbs':if(!V.thumbs)$('#btnPageMenu').click();break;
    case 'tpls':V.libTab='plantillas';renderLib();if(innerWidth<=820)$('#lib').classList.add('openp');break;
    case 'export':openExport(a);break;
    case 'share':openShare(a);break;
    case 'backup1':offerFile(`${slug(a.name)}.journaly.json`,new Blob([backupOf(a)],{type:'application/json'})).then(()=>toast('Copia guardada')).catch(e=>toast(e.message));break;
    case 'rename':openCreate(a);break;
    case 'dup':bookAction(a,'dup');break;
    case 'draw':toggleDraw(!ED.draw);break;
    case 'snap':$('#btnSnap').click();break;
    case 'double':$('#btnView').click();break;
    case 'c3d':$('#btn3d').click();break;
    case 'theme':openSettings();break;
    case 'mode':S.prefs.mode=b.dataset.v;applyPrefs();persist();break;
    case 'tour':startTour(curScreen(),true);break;
    case 'guide':openGuide();break;
    case 'keys':openKeys();break;
    case 'welcome':openWelcome();break;
    case 'data':openData();break;
    case 'order':openOrder(1);break;
    case 'howto':openOrder(0);break;
    case 'orderthis':openOrder(5,orderFromAgenda(a));break;
  }
  if(keepOpen.has(act))$('#drawer').innerHTML=drawerHTML();else closeDrawer()}
$('#btnMenu').onclick=()=>$('#drawer').hidden?openDrawer():closeDrawer();
$('#drawerVeil').onclick=closeDrawer;
$('#drawer').addEventListener('click',e=>{const b=e.target.closest('[data-do]');if(b)drawerAct(b.dataset.do,b)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#drawer').hidden){e.stopPropagation();closeDrawer();$('#btnMenu').focus()}},true);
$('#brandHome').onclick=()=>drawerAct('home');

/* ---- copies & storage (everything about the user's data in one place) ---- */
function openData(){const unused=()=>{const used=new Set(JSON.stringify({a:S.agendas,c:S.prefs.custom}).match(/img_[a-z0-9]+/g)||[]);return Object.keys(S.images).filter(k=>!used.has(k))};
  const m=modal(`<header><h2>Copias y almacenamiento</h2><div class="spacer"></div><button class="btn ghost icon" data-x aria-label="Cerrar">${ico('x')}</button></header>
   <div class="content one datadlg"><p class="hint" style="margin:0;font-size:13px">Tus agendas se guardan solas en este navegador. Si borras los datos del navegador o cambias de computadora, se pierden: guarda una copia de vez en cuando.</p>
    <div class="sto"><div class="sto-n" id="stoN"></div><div class="prog"><i id="stoBar"></i></div><span class="hint" id="stoHint"></span></div>
    <div class="dlist">
     <button type="button" class="dr-item" data-d="all">${ico('dl')}<span>Guardar una copia de todas mis agendas<small>Un solo archivo con agendas, fotos y stickers</small></span></button>
     <button type="button" class="dr-item" data-d="import">${ico('up2')}<span>Importar una copia<small>Se agregan a tu estantería; no se borra nada</small></span></button>
     <button type="button" class="dr-item" data-d="gc">${ico('image')}<span id="gcL">Borrar fotos que no usas</span></button>
     <button type="button" class="dr-item danger" data-d="reset">${ico('trash')}<span>Borrar todo y empezar de cero</span></button></div></div>
   <footer><button class="btn primary" data-x>Listo</button></footer>`,'sm');
  const info=async()=>{const n=Object.keys(S.images).length,mb=Object.values(S.images).reduce((s,v)=>s+v.length,0)/1048576,u=unused();let quota=null;
    try{const e=await navigator.storage?.estimate?.();if(e?.quota)quota=e.quota/1048576}catch(_){}
    $('#stoN',m).textContent=`${S.agendas.length} ${S.agendas.length===1?'agenda':'agendas'} · ${n} ${n===1?'foto o sticker':'fotos y stickers'} · ${mb.toFixed(1)} MB`;
    $('#stoBar',m).style.width=quota?Math.max(2,Math.min(100,mb/quota*100))+'%':'4%';$('#stoHint',m).textContent=quota?`De unos ${quota>1024?(quota/1024).toFixed(0)+' GB':Math.round(quota)+' MB'} disponibles en este navegador`:'';
    const g=$('[data-d="gc"]',m);g.hidden=!u.length;$('#gcL',m).innerHTML=`Borrar ${u.length} ${u.length===1?'foto que no usas':'fotos que no usas'}<small>Subidas pero sin usar en ninguna agenda</small>`};info();
  m.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(e.target.closest('[data-x]'))return m.remove();if(!b)return;
    if(b.dataset.d==='all'){if(!S.agendas.length)return toast('Aún no tienes agendas que guardar');offerFile(`journaly-copia-${new Date().toISOString().slice(0,10)}.journaly.json`,new Blob([backupOf(S.agendas)],{type:'application/json'})).then(()=>toast('Copia guardada')).catch(err=>toast(err.message))}
    if(b.dataset.d==='import'){m.remove();$('#impBackup').click()}
    if(b.dataset.d==='gc'){const u=unused();u.forEach(k=>delete S.images[k]);S.prefs.favs=S.prefs.favs.filter(f=>!u.some(k=>f.includes(k)));persist();info();toast(`${u.length} ${u.length===1?'foto borrada':'fotos borradas'}`)}
    if(b.dataset.d==='reset'){m.remove();confirmBox('¿Borrar todas tus agendas?','Se eliminarán todas tus agendas, fotos y stickers de este navegador. Antes de hacerlo, guarda una copia si quieres conservarlas. Esto no se puede deshacer.','Borrar todo',()=>{Object.keys(S.images).forEach(k=>delete S.images[k]);S.agendas=[];S.prefs.favs=[];S.prefs.custom=[];persist();go('home')})}})}
