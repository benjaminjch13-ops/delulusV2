
/* ================= cover editor ================= */
const CV={tab:'cuero',three:false,ry:-26,rx:8};
function openCover(a,fresh){ED.a=a;ED.mode='cover';ED.sel=null;ED.draw=null;CV.three=false;initHistory();ED.rerender=()=>{renderCoverStage();renderCoverSide()};
  $('#coverTitle').textContent='Portada · '+a.name;go('cover');renderCoverSide();renderCoverStage();renderCtx();if(fresh)toast('Agenda creada. Personaliza su portada')}
function renderCoverStage(){const a=ED.a,[W,H]=dims(a),st=$('#coverStage');
  if(CV.three){const w=Math.min(st.clientWidth*.62,(st.clientHeight-90)*W/H,460);
    st.innerHTML=`<div class="c3d">${book3D(a,w,{ry:CV.ry,rx:CV.rx})}<p class="hint">Arrastra para girarla y ver el lomo y la contratapa</p></div>`;$('#btn3d').classList.add('on');return}
  const s=Math.min((st.clientWidth-70)/W,(st.clientHeight-70)/H,1.2);
  st.innerHTML=`<div style="width:${W*s}px;height:${H*s}px;position:relative"><div style="position:absolute;left:0;top:0;transform:scale(${s});transform-origin:0 0;--inv:${1/s}">
   <div class="book flatbook" id="cBook" style="width:${W}px;height:${H}px"><div class="edges"></div><div class="edges b"></div>${coverFace(a,W,H,false)}${bandHTML(a,W,H)}${charmsHTML(a,W,H)}</div></div></div>`;
  const surf=$('.cover',st);$('.elayer',surf).classList.add('els');surf.style.touchAction='none';surf.style.overflow='visible';
  if(ED.sel)ED.sel.surf=surf;paintEls(surf,a.cover.elements);
  bindSurface(surf,a.cover.elements,W,H);ED.activeSurf=surf;ED.activeArr=a.cover.elements;ED.activeW=W;ED.activeH=H;
  $('#btn3d').classList.remove('on')}
$('#coverStage').addEventListener('pointerdown',ev=>{if(!CV.three){if(!ev.composedPath().some(n=>n.classList&&n.classList.contains('cover')))deselect();return}
  const b=$('#coverStage .b3');if(!b)return;ev.preventDefault();const x0=ev.clientX,y0=ev.clientY,r0=CV.ry,x0r=CV.rx;b.style.transition='none';
  const mv=m=>{CV.ry=r0+(m.clientX-x0)*.5;CV.rx=clamp(x0r-(m.clientY-y0)*.3,-35,35);b.style.setProperty('--ry',CV.ry+'deg');b.style.setProperty('--rx',CV.rx+'deg')};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);b.style.transition=''};document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up)});
$('#btn3d').onclick=()=>{CV.three=!CV.three;if(CV.three){deselect();CV.ry=0;CV.rx=0}renderCoverStage();if(CV.three&&motionOn()){const b=$('#coverStage .b3');requestAnimationFrame(()=>requestAnimationFrame(()=>{CV.ry=-32;CV.rx=10;b.style.setProperty('--ry','-32deg');b.style.setProperty('--rx','10deg')}))}else if(CV.three){CV.ry=-32;CV.rx=10;renderCoverStage()}};
$('#btnCoverBack').onclick=()=>{deselect();go('home')};
$('#btnCoverOpen').onclick=()=>openAgenda(ED.a);
$('#btnCoverPanel').onclick=()=>$('#coverSide').classList.toggle('openp');
function coverSet(fn,live){fn(ED.a.cover);renderCoverStage();if(!live){commit();renderCoverSide()}}
function renderCoverSide(){const c=ED.a.cover,e=c.elastic,tabs=[['cuero','Cuero'],['cierre','Cierre'],['charms','Charms'],['decorar','Decorar']];let b='';
  if(CV.tab==='cuero')b=`<div class="field"><span class="lbl">Modelo</span>${chipRow('model',[['delulu','Delulu · con solapa'],['clasica','Clásica · con costura']],c.model==='delulu'?'delulu':'clasica')}</div><div class="field"><span class="lbl">Color</span>${swRow('color',LEATHERS,c.color)}<label class="hint" style="display:flex;gap:8px;align-items:center"><input type="color" data-k="color" value="${c.color}"> Otro color</label></div>
    <div class="field"><span class="lbl">Textura</span>${chipRow('texture',[['natural','Natural'],['liso','Liso'],['granulado','Granulado'],['saffiano','Saffiano']],c.texture)}</div>
    <div class="field"><span class="lbl">Acabado</span>${chipRow('finish',[['mate','Mate'],['brillo','Brillante'],['tornasol','Tornasol']],c.finish)}</div>
    <div class="field"><span class="lbl">Patrón</span>${chipRow('pattern',PATTERN_NAMES,c.pattern||'none')}</div>
    <div class="field"><span class="lbl">Imagen de portada</span><label class="btn" style="justify-content:center">${ico('image')}${c.photo?'Cambiar imagen':'Usar una imagen'}<input type="file" accept="image/*" id="cPhoto" hidden></label>
     ${c.photo?`${chipRow('photoBlend',[['multiply','Teñida en el cuero'],['normal','Impresa'],['overlay','Sutil']],c.photoBlend||'multiply')}<label class="hint">Intensidad<input type="range" min="20" max="100" value="${(c.photoOp??.85)*100}" data-k="photoOp"></label><button class="btn ghost" data-rmphoto>Quitar imagen</button>`:''}</div>`;
  if(CV.tab==='cierre')b=`<div class="field"><span class="lbl">Color del elástico</span>${swRow('el.color',ELASTICS,e.color)}<label class="hint" style="display:flex;gap:8px;align-items:center"><input type="color" data-k="el.color" value="${e.color}"> Otro color</label></div>
    <div class="field"><span class="lbl">Cinta marcapáginas</span><div class="swrow" data-f="ribbon"><button type="button" class="sw none${c.ribbon==='none'?' on':''}" data-v="none" aria-label="Sin cinta" title="Sin cinta"></button><button type="button" class="sw def${!c.ribbon?' on':''}" data-v="" aria-label="Predeterminada" title="Predeterminada" style="background:#b5646d"></button>${['#b5646d','#d9a1a8','#c9a24a','#7f9474','#7d9ab3','#8e7bb5','#3b2d26','#f1e6d6'].map(col=>`<button type="button" class="sw${c.ribbon===col?' on':''}" data-v="${col}" style="background:${col}" aria-label="Cinta ${col}"></button>`).join('')}</div></div>
    <div class="field"><span class="lbl">Material</span>${chipRow('el.style',[['cordon','Cordón redondo'],['plano','Cinta plana'],['trenzado','Trenzado']],e.style)}</div>
    <div class="field"><span class="lbl">Orientación</span>${chipRow('el.orient',[['vertical','Vertical'],['horizontal','Horizontal']],e.orient)}</div>
    <div class="field"><label class="lbl" for="elW">Grosor · ${e.width}px</label><input id="elW" type="range" min="4" max="18" value="${e.width}" data-k="el.width"></div>
    <div class="field"><label class="lbl" for="elP">Posición</label><input id="elP" type="range" min="${e.orient==='horizontal'?25:55}" max="${e.orient==='horizontal'?80:93}" value="${Math.round((e.pos??.84)*100)}" data-k="el.pos"></div>`;
  if(CV.tab==='charms')b=`<span class="lbl">Charms en el elástico</span><div style="display:flex;flex-direction:column;gap:8px">${(c.charms||[]).map((ch,i)=>`<div style="display:flex;flex-direction:column;gap:8px;border:1px solid var(--line);border-radius:14px;padding:10px">
      <div class="charmrow">${charmSVG(ch,26)}<span class="nm">${(CHARM_SHAPES.find(s=>s[0]===ch.shape)||['','Personalizado'])[1]}</span>
       <button class="btn" data-ch="up" data-i="${i}" aria-label="Subir">${ico('left')}</button><button class="btn" data-ch="down" data-i="${i}" aria-label="Bajar">${ico('right')}</button><button class="btn" data-ch="rm" data-i="${i}" aria-label="Quitar">${ico('trash')}</button></div>
      <div class="opts">${MATERIALS.map(([v,l])=>`<button class="chip${ch.material===v?' on':''}" data-ch="mat" data-i="${i}" data-v2="${v}">${l}</button>`).join('')}</div>
      <div class="swrow">${ch.material==='esmalte'?`<input type="color" data-chk="color" data-i="${i}" value="${ch.color}" aria-label="Color del esmalte">`:''}<label class="hint" style="flex:1">Tamaño<input type="range" min="60" max="160" value="${(ch.size||1)*100}" data-chk="size" data-i="${i}"></label>
       ${ch.shape==='letter'?`<input type="text" maxlength="1" value="${esc(ch.letter||'')}" data-chk="letter" data-i="${i}" aria-label="Inicial" style="width:44px;text-align:center;border:1px solid var(--line);border-radius:8px;padding:6px;background:var(--paper);color:#3b2d26">`:''}</div></div>`).join('')||'<span class="hint">Sin charms. Agrega uno abajo.</span>'}</div>
    <span class="lbl">Agregar charm</span><div class="grid">${CHARM_SHAPES.map(([v,l])=>`<button class="tile" data-addcharm="${v}" title="${l}" aria-label="${l}">${charmSVG({shape:v,material:'oro',color:'#c4878c',letter:'A'},26)}</button>`).join('')}
     <label class="tile" title="Importar dije" style="cursor:pointer;color:var(--muted)">${ico('plus')}<input type="file" accept="image/png,image/webp" id="cCharm" hidden></label></div>
    <span class="hint">Puedes combinar hasta 6 charms. Importa un PNG transparente para crear tu propio dije.</span>`;
  if(CV.tab==='decorar'){const q=['heart','star','sparkle','flower','daisy','sprig','leaf','moon','butterfly','bow','tag','stamp','postmark','cat','cloud','rainbow'];
    b=`<span class="lbl">Texto en la portada</span><div class="grid c2">
      <button class="tile" style="aspect-ratio:auto;padding:12px;font-family:'Young Serif',serif;font-size:18px;color:#3b2d26" data-ct="title">Título</button>
      <button class="tile" style="aspect-ratio:auto;padding:12px;font-family:'Playfair Display',serif;font-size:18px;font-style:italic;color:#3b2d26" data-ct="ini">Iniciales</button>
      <button class="tile" style="aspect-ratio:auto;padding:12px;font-family:'Amatic SC',cursive;font-size:22px;color:#3b2d26" data-ct="year">Año</button>
      <button class="tile" style="aspect-ratio:auto;padding:12px;font-family:Caveat,cursive;font-size:20px;color:#3b2d26" data-ct="phrase">Frase</button></div>
     <span class="hint">Selecciona un texto para elegir si va grabado, estampado en oro o plata, o impreso.</span>
     <span class="lbl">Adornos</span><div class="grid">${q.map(id=>stickerTile(STICKERS.find(s=>s.id===id))).join('')}</div>
     <span class="lbl">Fotos y stickers propios</span><div class="grid">${S.prefs.custom.filter(id=>S.images[id]).map(id=>`<div class="tile" data-add="custom:${id}"><img src="${S.images[id]}" alt=""></div>`).join('')}
      <label class="tile" style="cursor:pointer;color:var(--muted)" title="Subir imagen">${ico('image')}<input type="file" accept="image/*" id="cImg" hidden></label></div>`}
  $('#coverSide').innerHTML=`<div class="tabs">${tabs.map(([v,l])=>`<button class="tab${CV.tab===v?' on':''}" data-ctab="${v}">${l}</button>`).join('')}<div class="spacer"></div><button class="btn ghost icon mobile-only" data-closecs aria-label="Cerrar">${ico('x')}</button></div><div class="body">${b}</div>`}
const cs=$('#coverSide');
const setK=(c,k,v)=>{if(k.startsWith('el.'))c.elastic[k.slice(3)]=v;else c[k]=v};
cs.addEventListener('click',ev=>{const t=ev.target,c=ED.a.cover;
  if(t.closest('[data-closecs]'))return cs.classList.remove('openp');
  const tab=t.closest('[data-ctab]');if(tab){CV.tab=tab.dataset.ctab;return renderCoverSide()}
  const v=t.closest('[data-v]');if(v&&v.parentElement.dataset.f){const f=v.parentElement.dataset.f;coverSet(c=>{setK(c,f,v.dataset.v);if(f==='el.orient')c.elastic.pos=v.dataset.v==='horizontal'?.6:.84});return}
  if(t.closest('[data-rmphoto]'))return coverSet(c=>{delete c.photo});
  const ch=t.closest('[data-ch]');if(ch){const i=+ch.dataset.i,L=c.charms;coverSet(()=>{const a=ch.dataset.ch;
    if(a==='rm')L.splice(i,1);if(a==='up'&&i>0)[L[i-1],L[i]]=[L[i],L[i-1]];if(a==='down'&&i<L.length-1)[L[i+1],L[i]]=[L[i],L[i+1]];if(a==='mat')L[i].material=ch.dataset.v2});return}
  const ac=t.closest('[data-addcharm]');if(ac){if(c.charms.length>=6)return toast('Máximo 6 charms por cierre');coverSet(c=>c.charms.push({id:uid(),shape:ac.dataset.addcharm,material:'oro',color:'#c4878c',size:1,letter:(ED.a.name[0]||'A')}));return}
  const ct=t.closest('[data-ct]');if(ct){const[W,H]=dims(ED.a);const k=ct.dataset.ct;const m={title:[ED.a.name,'"Young Serif", serif',40,W-120,70],ini:[(ED.a.name.match(/\b\p{L}/gu)||['J']).slice(0,2).join('.').toUpperCase()+'.','"Playfair Display", serif',56,200,80],year:[String(new Date().getFullYear()),'"Amatic SC", cursive',48,160,60],phrase:['un lugar para mis días','Caveat, cursive',30,W-140,50]}[k];
    placeEl({type:'text',text:m[0],font:m[1],fs:m[2],w:m[3],h:m[4],al:'center',fx:k==='phrase'?'':'dorado',color:'#fbf2ea',it:k==='ini'});return}
  const add=t.closest('[data-add]');if(add&&!t.closest('[data-fav]')){const e=makeFromKey(add.dataset.add);if(e){e.w*=.7;e.h*=.7;placeEl(e)}}});
cs.addEventListener('input',ev=>{const t=ev.target;
  if(t.dataset.k){const k=t.dataset.k;const val=t.type==='range'?(k==='el.width'?+t.value:t.value/100):t.value;coverSet(c=>setK(c,k,val),true);if(k==='el.width')t.previousElementSibling.textContent=`Grosor · ${t.value}px`}
  if(t.dataset.chk){const ch=ED.a.cover.charms[+t.dataset.i];const k=t.dataset.chk;ch[k]=k==='size'?t.value/100:t.value;renderCoverStage();const row=t.closest('[style]').parentElement.querySelector('.charmrow svg');if(row)row.outerHTML=charmSVG(ch,26)}});
cs.addEventListener('change',async ev=>{const t=ev.target;
  if(t.dataset.k||t.dataset.chk){commit();if(t.type==='color')renderCoverSide()}
  if(t.id==='cPhoto'&&t.files[0]){const r=await readImage(t.files[0],1000);if(r)coverSet(c=>{c.photo=r.id})}
  if(t.id==='cImg'&&t.files[0]){const r=await readImage(t.files[0],700);if(r){const w=180;placeEl({type:'image',img:r.id,w,h:w*r.h/r.w,frame:'borde'});renderCoverSide()}}
  if(t.id==='cCharm'&&t.files[0]){const r=await readImage(t.files[0],240);if(r)coverSet(c=>c.charms.push({id:uid(),shape:'custom',img:r.id,material:'oro',color:'#c4878c',size:1.1}))}});

/* refresh “Fondo” tab when the active page changes */
$('#stage').addEventListener('pointerup',()=>{if(V.libTab==='fondo'&&$('#open').classList.contains('show'))setTimeout(renderLib,0)});

