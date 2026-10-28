
/* ================= home: the collection in four views ================= */
function go(view){$$('.view').forEach(v=>v.classList.toggle('show',v.id===view));closeBookMenu();closeDrawer();coachClear();if(view==='home')renderHome();maybeTour(view)}
const hashN=s=>{let h=7;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)};
function homeList(){const q=($('#homeQ')?.value||'').trim().toLowerCase(),sort=S.prefs.sort||'recent';
  const l=S.agendas.filter(a=>!q||a.name.toLowerCase().includes(q));
  const by={recent:(a,b)=>b.updated-a.updated,name:(a,b)=>a.name.localeCompare(b.name,'es'),created:(a,b)=>(b.created||0)-(a.created||0),pages:(a,b)=>b.pages.length-a.pages.length}[sort];
  return l.sort(by)}
const titleEl=a=>(a.cover.elements||[]).find(x=>x.type==='text');
function titleInk(a,base){const t=titleEl(a),c=a.cover.color;
  if(!t||t.fx==='grabado')return `color:${shade(c,-.5)};text-shadow:0 1px 0 rgba(255,255,255,.22),0 -1px 1px rgba(0,0,0,.45)`;
  if(t.fx==='dorado')return `color:#e8c766;text-shadow:0 1px 0 rgba(0,0,0,.35)`;if(t.fx==='plata')return `color:#e6e8eb;text-shadow:0 1px 0 rgba(0,0,0,.35)`;
  return `color:${t.color||base}`}
/* Title plate: a cream label with a gold rule, placed on the side of the spine the elastic leaves free. */
const plateText=a=>esc(((titleEl(a)?.role!=='initials'&&titleEl(a)?.text)||a.name).split('\n')[0]);
function plateAt(len,band){if(band==null)return .5;return band<.5?(band+1)/2+.02:band/2-.02}
const plate=(a,v,fs,pos,max)=>`<span class="plate ${v?'v':'h'}" style="${v?'top':'left'}:${(pos*100).toFixed(1)}%;font-size:${fs}px;${v?'max-height':'max-width'}:${max}px"><i>✦</i><span>${plateText(a)}</span><i>✦</i></span>`;
const metaLine=a=>`${a.pages.length} ${a.pages.length===1?'página':'páginas'} · ${ago(a.updated)}`;

function renderHome(){if(!S)return;const box=$('#shelf'),view=S.prefs.view||'portadas',list=homeList();
  renderHero();  $('#homeTitle').textContent=greeting();$('#homeDate').textContent=todayLabel();
  $$('#viewSeg [data-view]').forEach(b=>{b.classList.toggle('on',b.dataset.view===view);b.setAttribute('aria-checked',b.dataset.view===view)});
  $('#homeSort').value=S.prefs.sort||'recent';box.className='coll v-'+view;
  if(!S.agendas.length){box.innerHTML=`<div class="empty"><svg viewBox="0 0 120 90" width="150" aria-hidden="true"><rect x="22" y="12" width="62" height="70" rx="6" fill="var(--accent-soft)" stroke="var(--muted)" stroke-width="2"/><path d="M70 12v70" stroke="var(--muted)" stroke-width="2" stroke-dasharray="3 4"/><path d="M84 30c14 2 20 12 16 26" stroke="var(--accent)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="99" cy="60" r="5" fill="var(--accent)"/></svg>
    <h2>Tu estantería está vacía</h2><p>Crea tu primera agenda: eliges el cuero, el elástico y cómo serán sus hojas.</p><button class="btn primary" data-new>${ico('plus')}Nueva agenda</button></div>`;return}
  if(!list.length){box.innerHTML=`<div class="empty"><h2>Ninguna agenda se llama así</h2><p>Prueba con otra palabra o borra la búsqueda.</p></div>`;return}
  box.innerHTML=({portadas:viewCovers,estante:viewShelf,pila:viewStack,lista:viewList}[view]||viewCovers)(list)}

function viewCovers(list){return `<div class="covers">${list.map(a=>`<div class="ccard" data-id="${a.id}">
   <button type="button" class="cbook" data-act="open" aria-label="Abrir ${esc(a.name)}">${book3D(a,Math.min(190,Math.round(dims(a)[0]*.27)),{ry:28,rx:5})}</button>
   <div class="cmeta"><div><b>${esc(a.name)}</b><span>${metaLine(a)}${a.shareId?' · compartida':''}</span></div><button type="button" class="btn ghost icon" data-act="menu" aria-label="Opciones de ${esc(a.name)}">${ico('dots')}</button></div></div>`).join('')}</div>`}

function spineHTML(a,h){const[W,H]=dims(a),k=h/240,w=Math.round(depthOf(a)*k*1.25),c=a.cover,t=titleEl(a),e=c.elastic,ch=(c.charms||[])[0];
  const band=e.orient==='horizontal'?`<i class="sband" style="top:${Math.round(h*(e.pos??.6))-3}px;background:${bandFill(e,true)}"></i>`:'';
  return `<button type="button" class="spine" data-act="menu" data-id="${a.id}" aria-label="${esc(a.name)}" style="width:${w}px;height:${h}px;--lea:${c.color};--tilt:${(hashN(a.id)%5===0)?'-4deg':'0deg'}">
   <span class="sface" style="background:${c.color}">${leatherFace(c)}<i class="srim t"></i><i class="srim b"></i>${band}
   ${plate(a,true,clamp(w*.36,9.5,14),plateAt(h,e.orient==='horizontal'?(e.pos??.6):null),Math.round(h*.56))}</span>
   ${ch?`<span class="scharm">${charmSVG(ch,18)}</span>`:''}</button>`}
function viewShelf(list){const box=$('#shelf'),cw=Math.max(240,Math.min(1100,box.clientWidth||innerWidth-32)-24),scale=innerWidth<600?.82:1,rows=[[]];let x=0;
  for(const a of list){const[,H]=dims(a),h=Math.round(Math.min(250,H*.31)*scale),w=Math.round(depthOf(a)*(h/240)*1.25)+6;
    if(x+w>cw-70&&rows[rows.length-1].length){rows.push([]);x=0}rows[rows.length-1].push([a,h]);x+=w}
  const plant=`<svg class="decor plant" viewBox="0 0 60 80" aria-hidden="true"><path d="M30 46C20 30 10 30 6 22c12 0 20 8 24 22zM30 46c4-18 14-26 24-26-4 12-14 18-24 26zM30 48c0-16 2-30 0-42 6 12 6 28 0 42z" fill="var(--accent)" opacity=".75"/><path d="M14 48h32l-5 28H19z" fill="var(--shelf)"/><path d="M14 48h32v5H14z" fill="var(--panel)" opacity=".35"/></svg>`;
  return rows.map((r,i)=>`<div class="shrow"><div class="shbooks">${r.map(([a,h])=>spineHTML(a,h)).join('')}${i===rows.length-1?plant:''}</div><div class="board"></div></div>`).join('')}

function viewStack(list){const per=innerWidth<600?6:7,stacks=[];for(let i=0;i<list.length;i+=per)stacks.push(list.slice(i,i+per));
  const cup=`<svg class="decor cup" viewBox="0 0 64 60" aria-hidden="true"><path d="M24 4c-4 5 4 8 0 14M34 2c-4 5 4 8 0 14" stroke="var(--muted)" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/><path d="M10 22h38v16c0 10-8 18-19 18S10 48 10 38z" fill="var(--panel)" stroke="var(--line)"/><path d="M48 26h5a7 7 0 0 1 0 14h-6" stroke="var(--panel)" stroke-width="4" fill="none"/><path d="M10 22h38v5H10z" fill="var(--accent)" opacity=".55"/></svg>`;
  return `<div class="stacks">${stacks.map((st,si)=>`<div class="stack">${si===0?cup:''}${st.map((a,i)=>{const[,H]=dims(a),L=Math.round(Math.min(310,H*.38)),T=Math.round(clamp(depthOf(a)*.72,28,52)),c=a.cover,t=titleEl(a),hsh=hashN(a.id);
    return `<button type="button" class="pbook" data-act="menu" data-id="${a.id}" aria-label="${esc(a.name)}" style="width:${L}px;height:${T}px;--dx:${(hsh%31)-15}px;--rot:${((hsh>>3)%5-2)*.6}deg;background:${c.color};z-index:${st.length-i}">
     ${leatherFace(c)}<i class="ptop" style="background:${shade(c.color,.12)}"></i><i class="pedge"></i>
     ${plate(a,false,clamp(T*.36,11,16),plateAt(L,c.elastic.orient==='horizontal'?(c.elastic.pos??.6):null),Math.round(L*.56))}
     ${c.elastic.orient==='horizontal'?`<i class="pband" style="left:${Math.round(L*(c.elastic.pos??.6))-4}px;background:${bandFill(c.elastic,false)}"></i>`:''}</button>`}).join('')}</div>`).join('')}</div>`}

function viewList(list){return `<div class="rows" role="list">${list.map(a=>`<div class="lrow" role="listitem" data-id="${a.id}">
   <button type="button" class="lcover" data-act="open" aria-label="Abrir ${esc(a.name)}">${bookHTML(a,Math.round(dims(a)[0]*.082))}</button>
   <button type="button" class="lname" data-act="open"><b>${esc(a.name)}</b><span>${typeLabel(a.type)}${a.shareId?' · compartida':''}</span></button>
   <span class="lnum">${a.pages.length} pág.</span><span class="ldate">${ago(a.updated).replace('editada ','')}</span>
   <button type="button" class="btn sm primary" data-act="open">Abrir</button><button type="button" class="btn ghost icon" data-act="menu" aria-label="Opciones de ${esc(a.name)}">${ico('dots')}</button></div>`).join('')}</div>`}

/* ---- per-agenda menu ---- */
function closeBookMenu(){$$('.bmenu,.bmenu-veil').forEach(x=>x.remove())}
function openBookMenu(a,anchor){closeBookMenu();const sheet=innerWidth<640;
  const items=[['open','book','Abrir agenda'],['order','bag','Pedirla en cuero'],['cover','brush','Editar portada'],['edit','edit','Nombre y tamaño'],['dup','copy','Duplicar'],['export','dl','Exportar'],['share','share',a.shareId?'Compartida · ver enlace':'Compartir'],['del','trash','Eliminar']];
  const veil=document.createElement('div');veil.className='bmenu-veil'+(sheet?' dim':'');document.body.appendChild(veil);
  const m=document.createElement('div');m.className='bmenu'+(sheet?' sheet-mode':'');m.setAttribute('role','menu');
  m.innerHTML=`<div class="bm-head">${bookHTML(a,Math.round(dims(a)[0]*.096))}<div><b>${esc(a.name)}</b><span>${metaLine(a)}</span></div></div>
   ${items.map(([k,i,l])=>`<button type="button" role="menuitem" data-mact="${k}"${k==='del'?' class="danger"':''}>${ico(i)}${l}</button>`).join('')}`;
  document.body.appendChild(m);
  if(!sheet){const r=anchor.getBoundingClientRect(),mw=m.offsetWidth,mh=m.offsetHeight;let x=r.left+r.width/2-mw/2,y=r.bottom+8;if(y+mh>innerHeight-12)y=Math.max(12,r.top-mh-8);x=clamp(x,12,innerWidth-mw-12);Object.assign(m.style,{left:x+'px',top:y+'px'})}
  requestAnimationFrame(()=>m.classList.add('in'));
  veil.onpointerdown=closeBookMenu;m.onclick=e=>{const b=e.target.closest('[data-mact]');if(!b)return;closeBookMenu();bookAction(a,b.dataset.mact)};
  m.querySelector('button')?.focus()}
function bookAction(a,act){
  if(act==='order')return openOrder(5,orderFromAgenda(a));
  if(act==='open')return openAgenda(a);if(act==='cover')return openCover(a);if(act==='edit')return openCreate(a);if(act==='export')return openExport(a);if(act==='share')return openShare(a);
  if(act==='dup'){const c=clone(a);c.id=uid();c.name=a.name+' (copia)';c.created=c.updated=Date.now();delete c.shareId;delete c.sharePages;delete c.sharedAt;c.pages.forEach(p=>{p.id=uid();p.elements.forEach(x=>x.id=uid())});S.agendas.push(c);persist();renderHome();toast('Agenda duplicada');return}
  if(act==='del'){const i=S.agendas.indexOf(a);S.agendas.splice(i,1);persist();renderHome();
    toast(`“${a.name}” eliminada`,{action:'Deshacer',ms:7000,fn:()=>{S.agendas.splice(i,0,a);persist();renderHome()},after:()=>{if(a.shareId&&!S.agendas.includes(a))unshare(a).catch(()=>{})}})}}

$('#shelf').addEventListener('click',e=>{if(e.target.closest('[data-new]'))return openCreate();const b=e.target.closest('[data-act]');if(!b)return;
  const id=b.dataset.id||b.closest('[data-id]')?.dataset.id,a=S.agendas.find(x=>x.id===id);if(!a)return;
  b.dataset.act==='menu'?openBookMenu(a,b):bookAction(a,b.dataset.act)});
$('#shelf').addEventListener('dblclick',e=>{const b=e.target.closest('.spine[data-id],.pbook');if(b){closeBookMenu();openAgenda(S.agendas.find(x=>x.id===b.dataset.id))}});
$('#viewSeg').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(!b)return;S.prefs.view=b.dataset.view;persist();renderHome()});
$('#homeSort').onchange=e=>{S.prefs.sort=e.target.value;persist();renderHome()};
$('#homeQ').addEventListener('input',()=>renderHome());
$('#btnNew').onclick=()=>openCreate();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('.bmenu'))closeBookMenu()});
addEventListener('resize',()=>{if($('#home').classList.contains('show')&&['estante','pila'].includes(S?.prefs?.view))renderHomeSoon()});

/* ---- brand hero: what Delulu Journal is, and the two ways in ---- */
function renderHero(){const h=$('#hero');if(S.prefs.heroMin){h.innerHTML=`<div class="hero-mini"><span>${brandLogo('sm')}</span><span class="hm-t">Cuero artesanal, hecho a mano en Guatemala</span><button type="button" class="btn sm hero-y" data-hero="order">Pedí tu libreta →</button><button type="button" class="btn ghost icon" data-hero="max" aria-label="Mostrar la portada">${ico('dl')}</button></div>`;return}
  const demo=orderAgenda({size:'a5',leather:'cafe',elastic:'azul',charm:'croissant',initials:''});
  h.innerHTML=`<div class="hero-card"><span class="hs s1">★</span><span class="hs s2">★</span><span class="hs s3">✦</span><span class="hs s4">★</span>
   <div class="hero-copy">${brandLogo('xl bare')}<p class="hero-tag"><span>Soñá.</span> <em>Planeá.</em> <b>Repetí.</b></p>
    <p class="hero-p">Diseñá libretas digitales para soltar tu creatividad, y armá tu Delulu de cuero artesanal, hecha a mano en Guatemala.</p>
    <div class="hero-cta"><button type="button" class="btn hero-y" data-hero="order">Pedí tu libreta de cuero →</button><button type="button" class="btn hero-g" data-hero="new">${ico('plus')}Crear una libreta digital</button></div></div>
   <div class="hero-book">${book3D(demo,innerWidth<640?120:170,{ry:26,rx:6})}</div>
   <button type="button" class="hero-min" data-hero="min" aria-label="Achicar la portada" title="Achicar">${ico('x')}</button></div>`}
$('#hero').addEventListener('click',e=>{const b=e.target.closest('[data-hero]');if(!b)return;const k=b.dataset.hero;
  if(k==='order')openOrder(0);if(k==='new')openCreate();if(k==='min'||k==='max'){S.prefs.heroMin=k==='min';persist();renderHero()}});
