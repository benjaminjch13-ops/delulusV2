
/* ================= agenda view / page editor ================= */
const V={cur:0,double:true,zoom:1,thumbs:false,libTab:'stickers',cat:'todos',q:''};
function openAgenda(a,pageIdx=0){ED.a=a;ED.mode='page';ED.sel=null;ED.draw=null;$('#btnDraw').classList.remove('on');V.cur=pageIdx;V.zoom=1;V.double=innerWidth>900&&!(a.orient==='land'&&innerWidth<1300);
  initHistory();ED.rerender=renderStage;$('#openTitle').textContent=a.name;go('open');renderLib();renderStage(true);renderCtx();
  if(a.pages.length>1)setTimeout(()=>tipOnce('turn',touch()?'Desliza el dedo de lado para pasar la página':'Arrastra la esquina de la página para pasarla'),1800)}
function spreadIdx(){if(!V.double)return[V.cur];const l=V.cur-(V.cur%2);return[l,l+1]}
function renderStage(opening){const a=ED.a,[W,H]=dims(a),st=$('#stage');const idx=spreadIdx();const pad=14;
  const SW=W*idx.length+pad*2,SH=H+pad*2;const fit=Math.min((st.clientWidth-24)/SW,(st.clientHeight-16)/SH);const s=Math.max(.1,fit*V.zoom);
  st.classList.toggle('scroll',V.zoom>1);
  st.innerHTML=`<div class="spreadbox" style="width:${SW*s}px;height:${SH*s}px"><div class="spread${opening?' opening':''}" style="transform:scale(${s});--inv:${1/s};--lea:${a.cover.color}">
    ${idx.map((pi,k)=>{const p=a.pages[pi];const cls=idx.length===1?'solo':k?'r':'l';
      if(!p)return `<div class="page ${cls} blank" style="width:${W}px;height:${H}px"><button data-addpage>+ Agregar página</button></div>`;
      return pageHTML(p,pi,W,H,cls,true)}).join('')}
    ${idx.length>1?'<div class="ring"></div>':''}${stackEdges(a.pages.length,idx)}${ribbonHTML(a,W,H,idx.length>1)}${turnZones(a.pages.length,idx,W,H)}</div></div>`;
  $$('.page[data-pi]',st).forEach(pd=>{const p=a.pages[+pd.dataset.pi];if(ED.draw)pd.style.cursor='crosshair';paintEls(pd,p.elements);bindSurface(pd,p.elements,W,H)});
  const first=$('.page[data-pi]',st);if(first&&(!ED.activeArr||!idx.some(i=>a.pages[i]?.elements===ED.activeArr))){ED.activeSurf=first;ED.activeArr=a.pages[+first.dataset.pi].elements;ED.activeW=W;ED.activeH=H}
  else if(first){const pd=$$('.page[data-pi]',st).find(p=>a.pages[+p.dataset.pi].elements===ED.activeArr);if(pd)ED.activeSurf=pd}
  if(ED.sel){const pd=$$('.page[data-pi]',st).find(p=>a.pages[+p.dataset.pi].elements===ED.sel.arr);if(pd)ED.sel.surf=pd;else ED.sel=null}
  const ab=$('[data-addpage]',st);if(ab)ab.onclick=()=>{a.pages.push(pg(a.pageBg||'lines'));commit();renderStage();refreshThumbs()};
  const n=a.pages.length;$('#pageInfo').textContent=idx.length>1?`Páginas ${idx[0]+1}–${Math.min(idx[1]+1,n)} de ${n}`:`Página ${idx[0]+1} de ${n}`;
  $('#btnPrev').disabled=idx[0]<=0;$('#btnNext').disabled=idx[idx.length-1]>=n-1;
  $('#btnView').classList.toggle('on',V.double);if(V.thumbs)refreshThumbs();renderCtx()}
function activePageIndex(){const a=ED.a;const i=a.pages.findIndex(p=>p.elements===ED.activeArr);return i<0?V.cur:i}
function nav(d){if(ED.sel)deselect();autoTurn(d)}
$('#btnPrev').onclick=()=>nav(-1);$('#btnNext').onclick=()=>nav(1);
$('#btnBack').onclick=()=>{deselect();ED.draw=null;go('home')};
$('#btnView').onclick=()=>{V.double=!V.double;renderStage()};
$('#btnZoomIn').onclick=()=>{V.zoom=Math.min(3,V.zoom*1.25);renderStage()};$('#btnZoomOut').onclick=()=>{V.zoom=Math.max(.5,V.zoom/1.25);renderStage()};
$('#btnCoverFromOpen').onclick=()=>openCover(ED.a);
$('#btnPageMenu').onclick=()=>{V.thumbs=!V.thumbs;$('#thumbs').hidden=!V.thumbs;$('#btnPageMenu').classList.toggle('on',V.thumbs);if(V.thumbs)refreshThumbs();renderStage()};
$('#btnLibMobile').onclick=()=>{$('#lib').classList.toggle('openp');tipOnce('lib','Toca un sticker o una foto para pegarlo en la página')};
addEventListener('resize',()=>{clearTimeout(V.rt);V.rt=setTimeout(()=>{if($('#open').classList.contains('show'))renderStage();if($('#cover').classList.contains('show'))renderCoverStage()},120)});
function miniPage(p,W,H,w){const s=w/W;return `<div class="mini" style="width:${W}px;height:${H}px;transform:scale(${s});${bgCSS(p.bg)}">${elsHTML(p.elements)}</div>`}
function refreshThumbs(){if(!V.thumbs||ED.mode!=='page')return;const a=ED.a,[W,H]=dims(a),w=64,h=w*H/W;const cur=activePageIndex();const vis=spreadIdx();
  $('#thumbs').innerHTML=`<div style="display:flex;flex-direction:column;gap:4px;flex:none;justify-content:center">
    <button class="btn" data-pg="add" style="padding:5px 10px;font-size:12px">${ico('plus')}Nueva</button><button class="btn" data-pg="dup" style="padding:5px 10px;font-size:12px">${ico('copy')}Duplicar</button></div>
   <div style="display:flex;flex-direction:column;gap:4px;flex:none;justify-content:center"><button class="btn" data-pg="mvl" style="padding:5px 10px;font-size:12px">${ico('left')}Mover</button><button class="btn" data-pg="del" style="padding:5px 10px;font-size:12px">${ico('trash')}Borrar</button></div>`
   +a.pages.map((p,i)=>`<button class="thumb${vis.includes(i)?' on':''}" data-go="${i}" style="width:${w}px;height:${h}px" aria-label="Ir a la página ${i+1}">${miniPage(p,W,H,w)}<span class="n">${i+1}${i===cur?' •':''}</span></button>`).join('');
  $('#thumbs').onclick=ev=>{const g=ev.target.closest('[data-go]'),b=ev.target.closest('[data-pg]');
    if(g){V.cur=+g.dataset.go;ED.activeArr=a.pages[V.cur].elements;ED.sel=null;renderStage();return}
    if(!b)return;const i=activePageIndex();
    if(b.dataset.pg==='add'){a.pages.splice(i+1,0,pg(a.pageBg||'lines'));V.cur=i+1;ED.activeArr=a.pages[i+1].elements}
    if(b.dataset.pg==='dup'){const c=clone(a.pages[i]);c.id=uid();c.elements.forEach(e=>e.id=uid());a.pages.splice(i+1,0,c);V.cur=i+1;ED.activeArr=c.elements;toast('Página duplicada')}
    if(b.dataset.pg==='mvl'){if(i===0)return toast('Ya es la primera página');const[p]=a.pages.splice(i,1);a.pages.splice(i-1,0,p);V.cur=i-1}
    if(b.dataset.pg==='del'){if(a.pages.length<2)return toast('La agenda necesita al menos una página');return confirmBox(`¿Eliminar la página ${i+1}?`,'Puedes recuperarla con Deshacer mientras la agenda siga abierta.','Eliminar',()=>{a.pages.splice(i,1);V.cur=Math.max(0,i-1);ED.activeArr=null;ED.sel=null;commit();renderStage()})}
    ED.sel=null;commit();renderStage()}}

/* ================= library ================= */
const CATS=[['todos','Todos'],['flores','Flores'],['botánico','Botánico'],['corazones','Corazones'],['estrellas','Estrellas'],['emociones','Emociones'],['kawaii','Kawaii'],['vintage','Vintage'],['minimal','Minimal'],['romántico','Romántico'],['otoño','Otoño'],['invierno','Invierno'],['verano','Verano'],['lectura','Lectura'],['estudio','Estudio'],['viajes','Viajes'],['bienestar','Bienestar']];
const isFav=k=>S.prefs.favs.includes(k);
function favBtn(k){return `<button class="fav${isFav(k)?' on':''}" data-fav="${k}" aria-label="Favorito">${isFav(k)?'★':'☆'}</button>`}
function stickerTile(st){return `<div class="tile" draggable="true" data-add="sticker:${st.id}" title="${st.n}" role="button" tabindex="0"><svg viewBox="${st.vb||'0 0 100 100'}" style="overflow:visible">${st.s(st.col)}</svg>${favBtn('sticker:'+st.id)}</div>`}
function libItems(){const t=V.libTab;
  if(t==='stickers'){const q=V.q.toLowerCase();const list=STICKERS.filter(s=>(V.cat==='todos'||s.c.includes(V.cat))&&(!q||(s.n+' '+s.c).toLowerCase().includes(q)));
    const custom=S.prefs.custom.filter(id=>S.images[id]);
    return `<input class="search" type="search" id="libQ" placeholder="Buscar: flor, gato, sello…" value="${esc(V.q)}">
     <div class="chips" id="libCats">${CATS.map(([v,l])=>`<button class="chip${V.cat===v?' on':''}" data-cat="${v}">${l}</button>`).join('')}</div>
     <div class="grid">${list.map(stickerTile).join('')||'<span class="hint" style="grid-column:1/-1">Nada coincide con esa búsqueda.</span>'}</div>
     <span class="lbl">Tus stickers</span><div class="grid">${custom.map(id=>`<div class="tile" draggable="true" data-add="custom:${id}" role="button" tabindex="0"><img src="${S.images[id]}" alt="">${favBtn('custom:'+id)}</div>`).join('')}
     <label class="tile" style="cursor:pointer;color:var(--muted);font-size:11px;text-align:center">${ico('plus')}<input type="file" accept="image/png,image/webp,image/jpeg" id="impSticker" hidden multiple></label></div>
     <span class="hint">Importa PNG con fondo transparente para usarlos en todas tus agendas.</span>`}
  if(t==='plantillas')return packItems();
  if(t==='cintas')return `<span class="lbl">Washi tape</span><div class="grid c2">${TAPES.flatMap(p=>TAPE_COLORS.slice(0,4).map((c,i)=>`<div class="tile wide" draggable="true" data-add="tape:${p.id}:${c}" title="${p.n}"><div style="width:90%;height:26px;background:${tapeBg(p.id,c)};clip-path:${ZZ};transform:rotate(${i%2?3:-4}deg)"></div>${favBtn(`tape:${p.id}:${c}`)}</div>`)).join('')}</div>`;
  if(t==='papeles')return `<span class="lbl">Recortes y marcos</span><div class="grid c3">${PAPERS.map(p=>`<div class="tile" draggable="true" data-add="paper:${p.id}" title="${p.n}"><div style="position:relative;width:70%;height:70%">${elInner({type:p.id==='note'?'note':'paper',pid:p.id,text:'',w:60,h:60})}</div>${favBtn('paper:'+p.id)}</div>`).join('')}</div>
     <span class="lbl">Notas adhesivas</span><div class="grid">${NOTE_COLORS.map(c=>`<div class="tile" draggable="true" data-add="note:${c}"><div style="width:70%;height:70%;background:${c};box-shadow:0 3px 5px -3px rgba(0,0,0,.4)"></div></div>`).join('')}</div>`;
  if(t==='texto'){const P=[['title','Título','"Young Serif", serif',30],['sub','Subtítulo','"Amatic SC", cursive',30],['para','Párrafo','Caveat, cursive',22],['hand','Manuscrita','"Homemade Apple", cursive',16],['type','Máquina de escribir','"Special Elite", monospace',16],['check','Checklist','Caveat, cursive',22],['label','Etiqueta','Figtree, sans-serif',15]];
    return `<span class="lbl">Agregar texto</span><div style="display:flex;flex-direction:column;gap:8px">${P.map(([k,l,f,s])=>`<button class="tile" style="aspect-ratio:auto;justify-content:flex-start;padding:10px 14px;font-family:${f};font-size:${s}px;color:#3b2d26" draggable="true" data-add="text:${k}">${l}</button>`).join('')}</div>
     <span class="lbl">Letra manuscrita</span><div class="fontlist">${HAND_FONTS.map(([n,f])=>`<button data-hand='${f}' style="font-family:${f.replace(/"/g,"'")}"><small>${n}</small>Querido diario</button>`).join('')}</div>
     <span class="hint">Toca dos veces un texto para editarlo. Escribe “[ ]” para crear casillas.</span>`}
  if(t==='fotos'){const ph=Object.keys(S.images).filter(id=>!S.prefs.custom.includes(id)&&id.startsWith('img_'));
    return `<label class="btn primary" style="justify-content:center">${ico('image')}Subir fotos<input type="file" accept="image/*" id="impPhoto" hidden multiple></label>
     <span class="hint">Se guardan en este navegador, ajustadas para que no ocupen demasiado espacio.</span>
     <span class="lbl">Tus fotos</span><div class="grid c3">${ph.map(id=>`<div class="tile" draggable="true" data-add="photo:${id}" style="padding:0"><img src="${S.images[id]}" alt="" style="width:100%;height:100%;object-fit:cover"></div>`).join('')||'<span class="hint" style="grid-column:1/-1">Aún no has subido fotos.</span>'}</div>`}
  if(t==='fondo'){const p=ED.a.pages[activePageIndex()]||ED.a.pages[0];
    return `<span class="lbl">Papel de la página ${activePageIndex()+1}</span><div class="grid c3">${BGS.map(([v,l])=>`<button class="tile${p.bg.type===v?' on':''}" data-bg="${v}" style="${bgCSS({type:v,color:p.bg.color})};flex-direction:column;justify-content:flex-end;font-size:11px;color:#6b584d;${p.bg.type===v?'border:2px solid var(--accent)':''}">${l}</button>`).join('')}</div>
     <span class="lbl">Color del papel</span><div class="swrow">${BG_COLORS.map(c=>`<button class="sw${p.bg.color===c?' on':''}" data-bgc="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}<input type="color" id="bgCustom" value="${p.bg.color}" aria-label="Otro color"></div>
     <button class="btn" data-bgall>Aplicar este papel a todas las páginas</button>`}
  if(t==='favs'){const f=S.prefs.favs;if(!f.length)return `<span class="hint">Marca con ☆ los stickers, cintas y papeles que más uses y aparecerán aquí.</span>`;
    return `<div class="grid">${f.map(k=>{const[ty,a,b]=k.split(':');if(ty==='sticker'){const st=STICKERS.find(s=>s.id===a);return st?stickerTile(st):''}
      if(ty==='custom')return S.images[a]?`<div class="tile" draggable="true" data-add="${k}"><img src="${S.images[a]}" alt="">${favBtn(k)}</div>`:'';
      if(ty==='tape')return `<div class="tile" draggable="true" data-add="${k}"><div style="width:90%;height:22px;background:${tapeBg(a,b)};clip-path:${ZZ}"></div>${favBtn(k)}</div>`;
      if(ty==='paper')return `<div class="tile" draggable="true" data-add="${k}"><div style="position:relative;width:70%;height:70%">${elInner({type:'paper',pid:a,w:60,h:60})}</div>${favBtn(k)}</div>`;return''}).join('')}</div>`}
  return ''}
function makeFromKey(k){const[ty,a,b]=k.split(':');
  if(ty==='sticker'){const st=STICKERS.find(s=>s.id===a),vb=(st?.vb||'0 0 100 100').split(' ').map(Number),w=vb[2]>vb[3]?150:90;return{type:'sticker',sid:a,w,h:Math.round(w*vb[3]/vb[2]),r:Math.round((Math.random()-.5)*(vb[2]>vb[3]?6:16))}}
  if(ty==='custom'){return{type:'sticker',custom:a,w:110,h:110}}
  if(ty==='tape')return{type:'tape',pat:a,color:b,w:150,h:30,r:Math.round((Math.random()-.5)*20)};
  if(ty==='paper')return a==='note'?{type:'note',text:'',bgc:'#f6e3a1',w:160,h:160,font:'Caveat, cursive',fs:22,r:-2}:{type:'paper',pid:a,w:a==='polaroid'?200:240,h:a==='polaroid'?240:a==='torn'?150:200,r:Math.round((Math.random()-.5)*8)};
  if(ty==='note')return{type:'note',text:'Escribe aquí',bgc:a,w:160,h:160,font:'Caveat, cursive',fs:22,r:-3};
  if(ty==='photo'){const im=new Image();im.src=S.images[a];const w=220,h=im.naturalWidth?w*im.naturalHeight/im.naturalWidth:220;return{type:'image',img:a,w,h,frame:'polaroid',r:Math.round((Math.random()-.5)*10)}}
  if(ty==='text'){const m={title:['Título','"Young Serif", serif',34,320,56],sub:['Subtítulo','"Amatic SC", cursive',38,280,56],para:['Escribe lo que quieras recordar de hoy…','Caveat, cursive',24,300,110],hand:['Una nota a mano','"Homemade Apple", cursive',18,280,70],type:['Querida yo del futuro:','"Special Elite", monospace',18,300,60],check:['[ ] Primera cosa\n[ ] Segunda cosa\n[ ] Tercera cosa','Caveat, cursive',24,260,120],label:['ETIQUETA','Figtree, sans-serif',14,140,36]}[a];
    return{type:'text',text:m[0],font:m[1],fs:m[2],w:m[3],h:m[4],color:'#3b2d26',b:a==='label',bg:a==='label'?'cinta':'',bgc:'#f3dfe1',al:a==='label'?'center':'left'}}
  return null}
function renderLib(){const tabs=[['plantillas','Plantillas'],['stickers','Stickers'],['cintas','Cintas'],['papeles','Papeles'],['texto','Texto'],['fotos','Fotos'],['fondo','Fondo'],['favs','★']];
  $('#lib').innerHTML=`<div class="tabs">${tabs.map(([v,l])=>`<button class="tab${V.libTab===v?' on':''}" data-tab="${v}">${l}</button>`).join('')}<div class="spacer"></div><button class="btn ghost icon mobile-only" data-closelib aria-label="Cerrar">${ico('x')}</button></div><div class="body">${libItems()}</div>`}
const lib=$('#lib');
lib.addEventListener('click',async ev=>{const t=ev.target;
  if(t.closest('[data-closelib]'))return lib.classList.remove('openp');
  const tab=t.closest('[data-tab]');if(tab){V.libTab=tab.dataset.tab;return renderLib()}
  const fav=t.closest('[data-fav]');if(fav){ev.stopPropagation();const k=fav.dataset.fav,f=S.prefs.favs;const i=f.indexOf(k);i<0?f.push(k):f.splice(i,1);persist();return renderLib()}
  const cat=t.closest('[data-cat]');if(cat){V.cat=cat.dataset.cat;return renderLib()}
  const pk=t.closest('[data-pack]');if(pk){curPack=pk.dataset.pack;return renderLib()}
  const tp=t.closest('[data-tpl]');if(tp)return insertTemplatePage(curPack,+tp.dataset.tpl);
  const hf=t.closest('[data-hand]');if(hf){placeEl({type:'text',text:'Querido diario…',font:hf.dataset.hand,fs:30,w:300,h:60,color:'#3b2d26'});return}
  const add=t.closest('[data-add]');if(add){const e=makeFromKey(add.dataset.add);if(e)placeEl(e);return}
  const bg=t.closest('[data-bg]'),bgc=t.closest('[data-bgc]');const p=ED.a.pages[activePageIndex()];
  if(bg){p.bg.type=bg.dataset.bg;commit();renderStage();renderLib()}
  if(bgc){p.bg.color=bgc.dataset.bgc;commit();renderStage();renderLib()}
  if(t.closest('[data-bgall]')){ED.a.pages.forEach(q=>q.bg={...p.bg});ED.a.pageBg=p.bg.type;commit();renderStage();toast('Papel aplicado a todas las páginas')}});
lib.addEventListener('input',ev=>{if(ev.target.id==='libQ'){V.q=ev.target.value;const pos=ev.target.selectionStart;renderLib();const q=$('#libQ');q.focus();q.setSelectionRange(pos,pos)}
  if(ev.target.id==='bgCustom'){ED.a.pages[activePageIndex()].bg.color=ev.target.value;renderStage()}});
lib.addEventListener('change',async ev=>{const t=ev.target;
  if(t.id==='bgCustom'){commit();renderLib()}
  if(t.id==='impPhoto'){let last;for(const f of t.files){const r=await readImage(f);if(r){const w=220;placeEl({type:'image',img:r.id,w,h:w*r.h/r.w,frame:'polaroid',r:Math.round((Math.random()-.5)*10)});last=r}}if(last)renderLib()}
  if(t.id==='impSticker'){for(const f of t.files){const r=await readImage(f,600);if(r){S.prefs.custom.push(r.id)}}persist();renderLib();toast('Stickers importados')}});
lib.addEventListener('dragstart',ev=>{const add=ev.target.closest('[data-add]');if(!add)return;ev.dataTransfer.setData('text/plain',add.dataset.add);ev.dataTransfer.effectAllowed='copy';
  ED.drag=p=>{const e=makeFromKey(add.dataset.add);if(e)placeEl(e,p)}});
lib.addEventListener('dragend',()=>setTimeout(()=>ED.drag=null,50));
lib.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.dataset.add)ev.target.click()});
