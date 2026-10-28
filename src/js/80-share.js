
/* ================= sharing: read-only link + standalone flipbook ================= */
const ARTIFACT_URL='https://claude.ai/artifact/RLVVrSFRxbNGCkZURgaGtQ';
function dataURLtoBlob(u){const[h,b]=u.split(',');const mime=(h.match(/data:([^;]+)/)||[])[1]||'image/png';const bin=atob(b),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:mime})}
const shareLink=sid=>`${ARTIFACT_URL}#ver-${sid}`;
async function publishShare(a,onProg){const db=await cap('db');if(!db)throw new Error('Compartir solo funciona dentro de claude.ai o la app de Claude.');
  const user=await cap('user');if(user&&user.isOwner&&!user.isOwner())throw new Error('Solo la dueña de Delulu Journal puede crear enlaces para compartir.');
  const ids=[...new Set(JSON.stringify({p:a.pages,c:a.cover}).match(/img_[a-z0-9]+/g)||[])].filter(id=>S.images[id]);
  S.prefs.assetMap=S.prefs.assetMap||{};const map={};let assets=null;
  for(let i=0;i<ids.length;i++){const id=ids[i];onProg(i/(ids.length+a.pages.length+1),`Subiendo foto ${i+1} de ${ids.length}…`);
    if(S.prefs.assetMap[id]){map[id]=S.prefs.assetMap[id];continue}
    assets=assets||await cap('assets');if(!assets)throw new Error('No se pudieron subir las fotos desde esta vista.');
    try{const r=await assets.upload(dataURLtoBlob(S.images[id]));map[id]=r.url;S.prefs.assetMap[id]=r.url}catch(err){throw new Error(err?.code==='quota_exceeded'||err?.code==='too_large'?'Se llenó el espacio para fotos compartidas. Quita fotos grandes o deja de compartir otra agenda.':'No se pudo subir una foto. Intenta de nuevo.')}}
  const sid=a.shareId||('s'+uid()),base=`shares/${sid}`;
  const meta={v:1,name:a.name,size:a.size,orient:a.orient,cover:a.cover,pageCount:a.pages.length,images:map,updated:Date.now()};
  if(JSON.stringify(meta).length>250000)throw new Error('La portada es demasiado pesada para compartir.');
  try{await db.doc(base).set(meta);
    for(let i=0;i<a.pages.length;i++){onProg((ids.length+i+1)/(ids.length+a.pages.length+1),`Publicando página ${i+1} de ${a.pages.length}…`);const p=a.pages[i],body={i,bg:p.bg,elements:p.elements};
      if(JSON.stringify(body).length>250000)throw{message:`La página ${i+1} tiene demasiados trazos para compartir. Borra algunos dibujos y vuelve a intentar.`};
      await db.doc(`${base}/pages/p${String(i).padStart(4,'0')}`).set(body)}
    for(let i=a.pages.length;i<(a.sharePages||0);i++)await db.doc(`${base}/pages/p${String(i).padStart(4,'0')}`).delete()}
  catch(err){throw new Error(err?.message&&!err.code?err.message:err?.code==='quota_exceeded'?'Se llenó el espacio para agendas compartidas. Deja de compartir alguna y vuelve a intentar.':'No se pudo publicar la agenda. Revisa tu conexión e intenta de nuevo.')}
  a.shareId=sid;a.sharePages=a.pages.length;a.sharedAt=Date.now();persist();return sid}
async function unshare(a){const db=await cap('db');if(!db||!a.shareId)return;const base=`shares/${a.shareId}`;
  await db.doc(base).delete();for(let i=0;i<(a.sharePages||a.pages.length);i++)await db.doc(`${base}/pages/p${String(i).padStart(4,'0')}`).delete().catch(()=>{});
  delete a.shareId;delete a.sharePages;delete a.sharedAt;persist()}
function openShare(a){if(ED.sel)deselect();const m=modal(`<header><h2>Compartir “${esc(a.name)}”</h2><div class="spacer"></div><button class="btn ghost icon" data-x aria-label="Cerrar">${ico('x')}</button></header><div class="content one" id="shBody"></div>
   <footer style="align-items:center"><div class="xprog" hidden><div class="prog"><i></i></div><span class="hint" id="shMsg"></span></div><div class="spacer"></div><span id="shBtns"></span></footer>`,'sm');
  const body=$('#shBody',m),btns=$('#shBtns',m);let busy=false;
  const prog=(p,msg)=>{$('.xprog',m).hidden=false;$('.prog i',m).style.width=Math.round(p*100)+'%';$('#shMsg',m).textContent=msg};
  const who=`<p class="hint" style="margin:0">Quién puede abrirlo: las personas a las que des acceso a Delulu Journal desde el menú <b>Compartir</b> de claude.ai, o cualquiera con sesión iniciada si activas el enlace público. Ven una copia de solo lectura: no pueden editarla ni ver tus otras agendas.</p>`;
  const draw=()=>{if(a.shareId){const link=shareLink(a.shareId);
      body.innerHTML=`<p style="margin:0">Esta agenda se puede hojear con este enlace. Publicada ${ago(a.sharedAt||Date.now()).replace('editada ','')}.</p>
       <div class="swrow" style="flex-wrap:nowrap"><input type="text" id="shLink" readonly value="${esc(link)}" class="numin" style="flex:1;width:auto;min-width:0"><button class="btn" data-copy>Copiar</button></div>${who}
       <p class="hint" style="margin:0">Los cambios que hagas después no aparecen hasta que toques “Actualizar”.</p>`;
      btns.innerHTML=`<button class="btn ghost" data-stop>Dejar de compartir</button><button class="btn" data-guest>Ver como invitada</button><button class="btn primary" data-pub>Actualizar</button>`}
    else{body.innerHTML=`<p style="margin:0">Crea un enlace para que otras personas hojeen esta agenda página por página, con su portada, fotos y stickers.</p>${who}`;
      btns.innerHTML=`<button class="btn" data-x>Cancelar</button><button class="btn primary" data-pub>Crear enlace</button>`}};
  if(!window.claude){body.innerHTML=`<p style="margin:0">Exportala como <b>página web</b>: se descarga un archivo que se hojea igualito, con portada, fotos y stickers. Lo podés mandar por WhatsApp, correo o subirlo a tu portafolio.</p><p class="hint" style="margin:0">También podés exportarla en PDF o imágenes para redes.</p>`;
    btns.innerHTML=`<button class="btn" data-x>Cancelar</button><button class="btn primary" data-exp>Exportar</button>`;
    return m.addEventListener('click',ev=>{if(ev.target.closest('[data-x]'))m.remove();if(ev.target.closest('[data-exp]')){m.remove();openExport(a)}})}
  draw();
  m.addEventListener('click',async ev=>{const t=ev.target;if(busy)return;
    if(t.closest('[data-x]'))return m.remove();
    if(t.closest('[data-copy]')){const inp=$('#shLink',m);try{await navigator.clipboard.writeText(inp.value);toast('Enlace copiado')}catch(e){inp.select();toast('Selecciona y copia el enlace')}return}
    if(t.closest('[data-guest]')){m.remove();location.hash='ver-'+a.shareId;return}
    if(t.closest('[data-pub]')){busy=true;try{await publishShare(a,prog);prog(1,'Listo');draw();toast('Enlace listo')}catch(e){prog(0,e.message)}finally{busy=false}return}
    if(t.closest('[data-stop]')){busy=true;try{prog(.5,'Quitando el enlace…');await unshare(a);prog(1,'Ya no se comparte');draw()}catch(e){prog(0,'No se pudo quitar el enlace. Intenta de nuevo.')}finally{busy=false}}})}

/* ---- read-only flipbook view (opened from a share link) ---- */
const FL={a:null,i:-1};
function routeHash(){if(location.hash==='#pedir')return openOrder(0);const m=location.hash.match(/^#ver-([A-Za-z0-9_-]{2,40})$/);if(m)return openShared(m[1]);if($('#share').classList.contains('show')){SHARED_IMG={};go('home')}}
addEventListener('hashchange',routeHash);
function shareMsg(t){$('#shareStage').innerHTML=`<div style="max-width:420px;text-align:center;display:flex;flex-direction:column;gap:14px;align-items:center"><p style="margin:0;font-size:16px">${esc(t)}</p><button class="btn primary" data-mine>Ir a mis agendas</button></div>`;$('#shareNav').hidden=true}
async function openShared(sid){go('share');$('#shareTitle').textContent='Agenda compartida';shareMsg('Abriendo la agenda…');
  const db=await cap('db');if(!db)return shareMsg('Para ver esta agenda, abre el enlace en claude.ai con la sesión iniciada en la cuenta con la que te la compartieron.');
  try{const ms=await db.doc('shares/'+sid).get();if(!ms.exists)return shareMsg('Esta agenda ya no se comparte, o el enlace está incompleto.');
    const meta=clone(ms.data()),ps=await db.collection(`shares/${sid}/pages`).orderBy('i').limit(1000).get();
    SHARED_IMG=meta.images||{};FL.a={...meta,id:'shared',pages:ps.docs.map(d=>{const p=clone(d.data());return{id:uid(),bg:p.bg,elements:p.elements||[]}})};FL.i=-1;
    $('#shareTitle').textContent=meta.name;renderFlip()}
  catch(e){shareMsg('No se pudo cargar la agenda. Revisa tu conexión e intenta de nuevo.')}}
function flipIdx(){const two=innerWidth>760;if(FL.i<0)return[];return two?[FL.i-(FL.i%2),FL.i-(FL.i%2)+1]:[FL.i]}
function renderFlip(dir){const a=FL.a,st=$('#shareStage');if(!a)return;const[W,H]=dims(a),n=a.pages.length;$('#shareNav').hidden=false;
  if(FL.i<0){const bw=Math.min(st.clientWidth-60,(st.clientHeight-70)*W/H,420);st.innerHTML=`<button class="flipcover" data-open aria-label="Abrir la agenda">${bookHTML(a,bw)}<span class="hint">Toca la portada para abrirla</span></button>`;$('#flipInfo').textContent='Portada';$('#flipPrev').disabled=true;$('#flipNext').disabled=!n;return}
  const idx=flipIdx(),pad=14,SW=W*idx.length+pad*2,SH=H+pad*2,s=Math.max(.1,Math.min((st.clientWidth-24)/SW,(st.clientHeight-16)/SH));
  st.innerHTML=`<div class="spreadbox" style="width:${SW*s}px;height:${SH*s}px"><div class="spread${dir==='open'?' opening':''}" style="transform:scale(${s});--lea:${a.cover.color}">
    ${idx.map((pi,k)=>{const p=a.pages[pi],cls=idx.length===1?'solo':k?'r':'l';if(!p)return `<div class="page ${cls}" style="width:${W}px;height:${H}px;background:#fbf7f0"></div>`;
      return pageHTML(p,pi,W,H,cls,false)}).join('')}
    ${idx.length>1?'<div class="ring"></div>':''}${stackEdges(n,idx)}${ribbonHTML(a,W,H,idx.length>1)}${turnZones(n,idx,W,H)}</div></div>`;
  $('#flipInfo').textContent=idx.length>1?`Páginas ${idx[0]+1}–${Math.min(idx[1]+1,n)} de ${n}`:`Página ${idx[0]+1} de ${n}`;$('#flipPrev').disabled=false;$('#flipNext').disabled=idx[idx.length-1]>=n-1}
function flip(d){const a=FL.a;if(!a)return;const step=flipIdx().length||1,n=a.pages.length;
  if(FL.i<0){if(d>0&&n){FL.i=0;renderFlip('open')}return}
  const first=flipIdx()[0],t=first+d*step;if(t<0){FL.i=-1;renderFlip();return}if(t>n-1)return;autoTurn(d)}
$('#flipPrev').onclick=()=>flip(-1);$('#flipNext').onclick=()=>flip(1);
$('#share').addEventListener('click',ev=>{if(ev.target.closest('[data-open]'))flip(1);if(ev.target.closest('[data-mine]')){history.replaceState(null,'',location.pathname+location.search);SHARED_IMG={};go('home')}});
document.addEventListener('keydown',ev=>{if(!$('#share').classList.contains('show')||$('.modal'))return;if(ev.key==='ArrowRight')flip(1);if(ev.key==='ArrowLeft')flip(-1)});
addEventListener('resize',()=>{if($('#share').classList.contains('show'))renderFlip()});

/* ---- standalone flipbook web page (for a portfolio or any host) ---- */
function flipbookHTML(title,pages){const T=esc(title);
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${T}</title>
<style>:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;background:#d8c3a5;background-image:repeating-linear-gradient(92deg,transparent 0 38px,rgba(110,78,50,.1) 38px 40px,transparent 40px 90px);font-family:Georgia,"Times New Roman",serif;color:#3b2d26}
header{padding:22px 16px 6px;text-align:center}h1{font-weight:400;margin:0;font-size:clamp(24px,5vw,34px)}header p{margin:6px 0 0;font:14px system-ui,sans-serif;color:#6e5a4d}
.stage{flex:1;width:100%;display:flex;align-items:center;justify-content:center;padding:12px 16px;touch-action:pan-y}
.stage img{display:block;max-width:100%;max-height:calc(100vh - 180px);border-radius:10px;box-shadow:0 26px 50px -22px rgba(50,28,14,.7);transition:opacity .22s ease,transform .3s ease}
.stage img.out{opacity:0;transform:translateX(var(--dx,0))}nav{display:flex;align-items:center;gap:16px;padding:6px 16px 26px;font:14px system-ui,sans-serif}
button{width:46px;height:46px;border-radius:50%;border:0;background:#fffaf3;color:#3b2d26;font-size:22px;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.18)}button:disabled{opacity:.35;cursor:default}button:focus-visible{outline:2px solid #c4878c;outline-offset:2px}
@media (prefers-reduced-motion:reduce){.stage img{transition:none}}</style></head>
<body><header><h1>${T}</h1><p>Agenda hecha en Delulu Journal · usa las flechas o desliza</p></header><main class="stage"><img id="pg" alt=""></main>
<nav><button id="pv" aria-label="Anterior">‹</button><span id="ct" aria-live="polite"></span><button id="nx" aria-label="Siguiente">›</button></nav>
<script>const P=${JSON.stringify(pages.map(p=>p.src))},L=${JSON.stringify(pages.map(p=>p.label))};let i=0;const im=document.getElementById('pg'),ct=document.getElementById('ct'),pv=document.getElementById('pv'),nx=document.getElementById('nx');
function show(n,d){if(n<0||n>=P.length)return;i=n;im.style.setProperty('--dx',(d||0)*-30+'px');im.classList.add('out');setTimeout(()=>{im.src=P[i];im.alt=L[i];im.classList.remove('out')},d?180:0);ct.textContent=L[i]+'  ·  '+(i+1)+'/'+P.length;pv.disabled=i===0;nx.disabled=i===P.length-1}
pv.onclick=()=>show(i-1,-1);nx.onclick=()=>show(i+1,1);addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(i+1,1);if(e.key==='ArrowLeft')show(i-1,-1)});
let x0=null;im.parentElement.addEventListener('pointerdown',e=>x0=e.clientX);addEventListener('pointerup',e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>50)show(i+(dx<0?1:-1),dx<0?1:-1)});show(0);<\/script></body></html>`}
