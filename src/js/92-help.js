
/* ================= self-guided help: welcome, tours, searchable guide, one-time tips, shortcuts ================= */
const touch=()=>matchMedia('(pointer:coarse)').matches;
/* first visible element among "a|b|c" alternatives (selectors may contain commas, so | separates them) */
function firstVisible(sel){for(const s of sel.split('|')){const el=[...document.querySelectorAll(s)].find(e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2&&r.bottom>0&&r.top<innerHeight&&getComputedStyle(e).visibility!=='hidden'});if(el)return el}return null}

/* ---- spotlight engine ---- */
const COACH={steps:[],i:0,name:'',single:false};
function coachClear(){$$('.coach').forEach(x=>x.remove())}
function startTour(name,manual){const steps=(TOURS[name]||[]).filter(s=>!s.when||s.when());if(!steps.length){if(manual)toast('Esta pantalla no tiene recorrido');return}
  closeBookMenu();COACH.steps=steps;COACH.i=0;COACH.name=name;COACH.single=false;S.prefs.seenTours={...(S.prefs.seenTours||{}),[name]:1};persist();coachShow()}
function spotlight(sel,t,x){COACH.steps=[{sel,t,x}];COACH.i=0;COACH.single=true;coachShow()}
function coachShow(){coachClear();const st=COACH.steps[COACH.i];if(!st)return;
  setTimeout(()=>{const el=firstVisible(st.sel);if(!el){if(COACH.i<COACH.steps.length-1){COACH.i++;coachShow()}return}
    el.scrollIntoView({block:'nearest',inline:'nearest'});const r=el.getBoundingClientRect(),pad=6,last=COACH.i===COACH.steps.length-1;
    const ov=document.createElement('div');ov.className='coach';
    ov.innerHTML=`<div class="coach-hole" style="left:${r.left-pad}px;top:${r.top-pad}px;width:${r.width+pad*2}px;height:${r.height+pad*2}px"></div>
     <div class="coach-tip" role="dialog" aria-live="polite" aria-label="${esc(st.t)}">${COACH.single?'':`<span class="coach-n">${COACH.i+1} de ${COACH.steps.length}</span>`}<b>${st.t}</b><p>${st.x}</p>
      <div class="coach-b">${COACH.i&&!COACH.single?'<button type="button" class="btn sm ghost" data-c="prev">Atrás</button>':''}<span class="spacer"></span>${COACH.single||last?'':'<button type="button" class="btn sm ghost" data-c="skip">Saltar</button>'}<button type="button" class="btn sm primary" data-c="next">${COACH.single?'Entendido':last?'Listo':'Siguiente'}</button></div></div>`;
    document.body.appendChild(ov);const tip=$('.coach-tip',ov),tw=tip.offsetWidth,th=tip.offsetHeight,big=r.height>innerHeight*.55;
    let y=big?r.top+Math.min(r.height,innerHeight-r.top)/2-th/2:r.bottom+pad+12;if(!big&&y+th>innerHeight-12)y=r.top-pad-12-th;if(y<12)y=clamp(r.bottom+pad+12,12,innerHeight-th-12);
    const x=clamp(r.left+r.width/2-tw/2,12,innerWidth-tw-12);Object.assign(tip.style,{left:x+'px',top:clamp(y,12,innerHeight-th-12)+'px'});
    requestAnimationFrame(()=>ov.classList.add('in'));tip.querySelector('[data-c="next"]').focus()},60)}
document.addEventListener('click',e=>{const b=e.target.closest('.coach [data-c]');if(!b)return;const c=b.dataset.c;
  if(c==='next'){if(COACH.single||COACH.i>=COACH.steps.length-1){coachClear();if(!COACH.single&&COACH.name==='home'&&!S.prefs.tourDoneMsg){S.prefs.tourDoneMsg=1;persist();toast('Listo. La guía completa está en el botón ? de arriba')}}else{COACH.i++;coachShow()}}
  if(c==='prev'){COACH.i=Math.max(0,COACH.i-1);coachShow()}if(c==='skip')coachClear()});
document.addEventListener('keydown',e=>{if(!$('.coach'))return;if(e.key==='Escape'){coachClear();e.stopPropagation()}if(e.key==='ArrowRight'||e.key==='Enter'){e.preventDefault();$('.coach [data-c="next"]')?.click()}if(e.key==='ArrowLeft')$('.coach [data-c="prev"]')?.click()},true);
addEventListener('resize',()=>{if($('.coach'))coachShow()});
/* first visit to a screen: run its tour, if the person chose the guided start */
function maybeTour(view){if(!S||S.prefs.tours!=='on'||(S.prefs.seenTours||{})[view]||$('.modal'))return;setTimeout(()=>{if(curScreen()===view&&!$('.modal'))startTour(view)},700)}

const TOURS={
  home:[
    {sel:'#hero .hero-y|#hero .hero-mini .hero-y',t:'Tu Delulu de cuero',x:'Armá tu libreta física en 4 pasos (tamaño, cuero, elástico y charm), mirala en 3D y pedila por DM a @delulu.journal.'},
    {sel:'#btnNew',t:'Crea una agenda',x:'Eliges el nombre, el cuero, el elástico, el tamaño y con qué páginas empieza. Todo se puede cambiar después.'},
    {sel:'#shelf .cbook|#shelf .spine|#shelf .pbook|#shelf .lrow',t:'Tus agendas',x:'Toca una para abrirla. En el botón ⋯ están la portada, exportar, compartir, duplicar y eliminar.'},
    {sel:'#viewSeg',t:'Cámbiale la vista',x:'Míralas como portadas, en un estante, apiladas o en lista. Se recuerda lo que elijas.'},
    {sel:'#homeQ',t:'Busca y ordena',x:'Escribe parte del nombre para encontrar una agenda, y ordénalas por fecha, nombre o páginas.'},
    {sel:'#btnMenu',t:'Todo está en el menú',x:'Tema y colores, copias de seguridad, la guía y, cuando tienes una agenda abierta, sus opciones.'},
    {sel:'#btnHelp',t:'¿Tienes una duda?',x:'Aquí está la guía con cada paso. Desde el menú puedes repetir este recorrido cuando quieras.'}],
  open:[
    {sel:'#lib .tabs|.dock [data-click="#btnLibMobile"]',t:'Agrega cosas a la página',x:'Stickers, cintas, papeles, texto, fotos y plantillas. Toca uno para pegarlo, o arrástralo a donde lo quieras.'},
    {sel:'.page[data-pi]',t:'La página es libre',x:'Toca un elemento para seleccionarlo: arrástralo para moverlo, usa la esquina para el tamaño y el círculo de arriba para girarlo. Con el dedo, usa dos para agrandar y girar.'},
    {sel:'.tz.r|#btnNext',t:'Pasa la página',x:'Arrastra la esquina doblada como en un libro de verdad, desliza el dedo de lado o usa las flechas.'},
    {sel:'#btnUndo',t:'¿Te equivocaste?',x:'Deshaz y rehaz cualquier cambio. No hay botón de guardar: todo se guarda solo.'},
    {sel:'#btnPageMenu|.dock [data-click="#btnPageMenu"]',t:'Tus páginas',x:'Agrega, duplica, mueve o borra páginas, y salta a cualquiera con las miniaturas.'},
    {sel:'#btnMenu|.dock [data-click="#btnMenu"]',t:'Más opciones',x:'Exportar a PDF, compartir, editar la portada y las herramientas están en el menú.'}],
  cover:[
    {sel:'#coverSide .tabs|.dock [data-click="#btnCoverPanel"]',t:'Personaliza la portada',x:'Cuero y textura, el cierre (elástico y cinta marcapáginas), hasta seis charms y decoración.'},
    {sel:'#coverStage .cover',t:'Decora encima',x:'El título y los adornos se mueven igual que en las páginas. Selecciona el título para elegir si va grabado, en oro o impreso.'},
    {sel:'#btn3d|.dock [data-click="#btn3d"]',t:'Mírala en 3D',x:'Gírala para ver el lomo, el canto de las hojas y la contratapa.'},
    {sel:'#btnCoverOpen|.dock [data-click="#btnCoverOpen"]',t:'Ábrela',x:'Cuando te guste, abre la agenda para escribir y decorar las páginas.'}],
  share:[
    {sel:'#shareStage .spread|#shareStage .flipcover',t:'Una agenda compartida',x:'Es de solo lectura. Toca la portada para abrirla y arrastra la esquina o usa las flechas para hojearla.'}]
};

/* ---- one-time contextual tips ---- */
function tipOnce(key,msg){if(!S)return;const seen=S.prefs.tips||(S.prefs.tips={});if(seen[key]||$('.coach'))return;seen[key]=1;persist();toast(msg,{ms:5200})}

/* ---- the guide: searchable how-tos with "show me where" ---- */
const HELP=[
 {g:'Delulu Journal',t:'Pedir mi libreta de cuero',k:'pedido comprar cuero fisica dm instagram tamaño elastico charm',s:['Toca <b>Pedí tu libreta de cuero</b> en el inicio o en el menú.','Elegí el tamaño (A5 o A6), el color del cuero, el elástico y el charm. La vista 3D muestra cómo va quedando.','En <b>Tu pedido</b> toca <b>Pedidos por DM</b>: se abre Instagram y tu pedido queda copiado para pegarlo en el chat.'],show:['home','#hero .hero-y|#btnMenu','Empezá aquí: son 4 pasitos y al final lo pedís por DM.']},
 {g:'Delulu Journal',t:'Pedir en cuero una libreta que diseñé',k:'pedir cuero digital fisica misma',s:['Abre el menú <b>⋯</b> de la agenda (o el menú con la agenda abierta).','Elige <b>Pedirla en cuero</b>: se llena el pedido con los colores más parecidos.','Revisa y cambia lo que quieras antes de pedirla por DM.']},
 {g:'Empezar',t:'Crear una agenda',k:'nueva nombre cuero tamaño plantilla',s:['Toca <b>Nueva agenda</b>.','Ponle nombre y elige con qué empieza: en blanco, una plantilla básica o un paquete ya decorado.','Elige tamaño, orientación, cuero y elástico. La vista previa cambia al instante.','Toca <b>Crear agenda</b>: se abre su portada para que la personalices.'],show:['home','#btnNew','Empieza aquí: eliges nombre, cuero, elástico, tamaño y con qué páginas empieza.']},
 {g:'Empezar',t:'Ver tus agendas de otra forma',k:'vista estante pila lista portadas buscar ordenar',s:['Arriba de tus agendas elige <b>Portadas</b>, <b>Estante</b>, <b>Pila</b> o <b>Lista</b>.','Usa el buscador para encontrar una por nombre y el selector para ordenarlas.'],show:['home','#viewSeg','Elige Portadas, Estante, Pila o Lista. A la izquierda puedes buscar y a la derecha ordenar.']},
 {g:'Empezar',t:'Opciones de cada agenda',k:'menu puntos eliminar duplicar renombrar',s:['Toca el botón <b>⋯</b> junto a la agenda. En Estante y Pila, toca el lomo.','Ahí puedes abrirla, editar la portada, cambiar nombre y tamaño, duplicar, exportar, compartir o eliminar.','Si eliminas una por error, toca <b>Deshacer</b> en el aviso de abajo.'],show:['home','#shelf [data-act="menu"]|#shelf .spine|#shelf .pbook','Aquí están las opciones de cada agenda: portada, nombre, duplicar, exportar, compartir y eliminar.']},
 {g:'Decorar páginas',t:'Pegar stickers, fotos y texto',k:'agregar sticker foto texto biblioteca cinta papel',s:['Abre una agenda.','En la computadora usa el panel de la izquierda; en el teléfono toca <b>Agregar</b> abajo.','Toca un sticker para pegarlo o arrástralo a la página.','Para fotos, abre la pestaña <b>Fotos</b> y toca <b>Subir fotos</b>.'],show:['open','#lib .tabs|.dock [data-click="#btnLibMobile"]','Elige una pestaña y toca lo que quieras pegar. También puedes arrastrarlo a la página.']},
 {g:'Decorar páginas',t:'Mover, agrandar y girar',k:'mover tamaño girar rotar seleccionar dedos',s:['Toca un elemento para seleccionarlo.','Arrástralo para moverlo. La esquina cambia el tamaño y el círculo de arriba lo gira.','En el teléfono, usa dos dedos para agrandar y girar a la vez.','Con el teclado, las flechas lo mueven (Shift para ir más rápido).'],show:['open','.page[data-pi] .el','Toca este elemento: arrástralo para moverlo, la esquina cambia el tamaño y el círculo lo gira.']},
 {g:'Decorar páginas',t:'Cambiar color, capas, bloquear o borrar',k:'color capas frente fondo bloquear borrar duplicar opacidad barra',s:['Selecciona el elemento: abajo aparece su barra de opciones.','Ahí cambias el color, lo traes al frente o al fondo, lo duplicas, lo bloqueas, cambias su transparencia o lo borras.']},
 {g:'Decorar páginas',t:'Escribir y editar texto',k:'texto escribir letra fuente casilla checklist',s:['En la pestaña <b>Texto</b> elige un estilo para agregarlo.','Toca dos veces un texto (o el lápiz de su barra) para escribir.','Empieza una línea con <b>[ ]</b> para crear una casilla que se marca al tocarla.','En la barra eliges la letra, el tamaño, la alineación y el fondo.']},
 {g:'Decorar páginas',t:'Seleccionar varios, agrupar y alinear',k:'varios grupo agrupar alinear distribuir seleccion',s:['En la computadora: Shift + clic, o arrastra un recuadro desde un espacio vacío.','En el teléfono: selecciona uno y toca <b>Varios</b> en su barra; luego toca los demás.','Toca <b>Agrupar</b> para que se muevan juntos y <b>Alinear</b> para ordenarlos.']},
 {g:'Decorar páginas',t:'Recortar fotos y quitar el fondo',k:'recortar forma corazon marco polaroid quitar fondo varita',s:['Selecciona una foto y toca el botón de foto en su barra.','Elige una forma (corazón, estrella, arco…) o un marco como polaroid. También puedes recortarla a mano.','Con la varita, <b>Quitar fondo</b> borra fondos lisos; ajusta la sensibilidad hasta que se vea bien.']},
 {g:'Decorar páginas',t:'Dibujar a mano',k:'dibujar lapiz pincel marcador borrador',s:['Toca <b>Dibujar</b> (lápiz arriba, o abajo en el teléfono).','Elige lápiz, marcador o pincel, el color y el grosor.','El borrador quita trazos completos. Toca <b>Listo</b> al terminar.'],show:['open','#btnDraw|.dock [data-click="#btnDraw"]','Toca aquí para dibujar. Elige herramienta, color y grosor, y toca Listo al terminar.']},
 {g:'Páginas',t:'Pasar las páginas',k:'pasar pagina hojear voltear esquina',s:['Arrastra la esquina doblada de la página, como en un libro.','En el teléfono, desliza el dedo de lado sobre un espacio vacío.','También puedes usar las flechas de abajo o las del teclado.'],show:['open','.tz.r|#btnNext','Arrastra desde aquí hacia el lomo, como en un libro. También sirven las flechas.']},
 {g:'Páginas',t:'Agregar, mover o borrar páginas',k:'agregar pagina borrar mover duplicar miniaturas',s:['Toca <b>Páginas</b>: aparecen las miniaturas.','Usa <b>Nueva</b>, <b>Duplicar</b>, <b>Mover</b> o <b>Borrar</b> sobre la página actual.','Toca una miniatura para ir a esa página.'],show:['open','#btnPageMenu|.dock [data-click="#btnPageMenu"]','Toca aquí para ver las miniaturas y agregar, duplicar, mover o borrar páginas.']},
 {g:'Páginas',t:'Plantillas y paquetes',k:'plantilla paquete otoño viajes estudio semanal mensual',s:['En la biblioteca, abre la pestaña <b>Plantillas</b>.','Elige <b>Básicas</b> o un paquete temático.','Toca una página: se agrega después de la que estás viendo.'],show:['open','#lib [data-tab="plantillas"]|.dock [data-click="#btnLibMobile"]','Abre Plantillas y toca una página: se agrega después de la que estás viendo.']},
 {g:'Páginas',t:'Cambiar el papel de la página',k:'fondo papel lineas cuadricula puntos color',s:['En la biblioteca abre la pestaña <b>Fondo</b>.','Elige líneas, cuadrícula, puntos, vintage o kraft, y el color del papel.','Puedes aplicarlo a todas las páginas de una vez.']},
 {g:'Portada',t:'Diseñar la portada',k:'portada cuero elastico charm cinta marcapaginas titulo grabado 3d',s:['Desde el menú elige <b>Editar la portada</b>.','<b>Cuero</b>: color, textura, acabado, patrón o una foto.','<b>Cierre</b>: color y material del elástico, y la cinta marcapáginas.','<b>Charms</b>: hasta seis dijes. <b>Decorar</b>: título, iniciales y adornos.','Toca <b>Vista 3D</b> para verla girando.'],show:['cover','#coverSide .tabs|.dock [data-click="#btnCoverPanel"]','Cuero, Cierre (elástico y cinta), Charms y Decorar: cada pestaña cambia una parte de la portada.']},
 {g:'Guardar y compartir',t:'Exportar a PDF, imágenes o página web',k:'exportar pdf imprimir imagen png descargar',s:['Abre el menú y elige <b>Exportar</b> (o usa ⋯ en tu estantería).','Elige PDF para imprimir, imágenes PNG para redes o página web para tu portafolio.','En el teléfono se abre el menú de compartir para guardarlo donde quieras.'],show:['home','#btnMenu','Abre el menú con la agenda abierta y elige Exportar. También está en el botón ⋯ de cada agenda.']},
 {g:'Guardar y compartir',t:'Compartir una agenda',k:'compartir enlace link solo lectura whatsapp',s:['Abre el menú y elige <b>Compartir</b>.','Exporta la agenda como <b>página web</b>: es un archivo que se hojea página por página.','Mándalo por WhatsApp o correo, o súbelo a tu portafolio. Quien lo abra no puede editarla.']},
 {g:'Guardar y compartir',t:'¿Se guarda solo?',k:'guardar deshacer rehacer automatico',s:['Sí. Cada cambio se guarda en este navegador; arriba verás <b>Guardado</b>.','Para deshacer usa la flecha curva o Ctrl/⌘ + Z.'],show:['open','#btnUndo','Deshacer y rehacer. Todo se guarda solo: no hay botón de guardar.']},
 {g:'Guardar y compartir',t:'Copias de seguridad y espacio',k:'copia respaldo importar espacio almacenamiento borrar',s:['Abre el menú y elige <b>Copias y almacenamiento</b>.','Guarda una copia de todas tus agendas en un archivo; con <b>Importar</b> la recuperas aquí o en otra computadora.','Ahí también ves cuánto espacio usas y puedes borrar fotos que no usas.'],show:['home','#btnMenu','Abre el menú y elige Copias y almacenamiento.']},
 {g:'Apariencia',t:'Cambiar tema, colores y letra',k:'tema color oscuro claro fondo letra nombre',s:['Abre el menú y elige <b>Tema, colores y letra</b>.','Elige uno de los siete temas, el fondo del escritorio, el color de acento y la letra de los títulos.','El modo claro u oscuro se cambia desde el mismo menú.'],show:['home','#btnMenu','Abre el menú y elige Tema, colores y letra. El modo claro u oscuro también está ahí.']}
];
const norm=t=>t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
function openGuide(q=''){closeDrawer();coachClear();
  const m=modal(`<header><h2>Guía de Delulu Journal</h2><div class="spacer"></div><button class="btn ghost icon" data-x aria-label="Cerrar">${ico('x')}</button></header>
   <div class="content one guide"><label class="searchbox"><svg class="i"><use href="#i-search"/></svg><input type="search" id="gQ" placeholder="¿Qué quieres hacer? Ej. foto, PDF, página" value="${esc(q)}" aria-label="Buscar en la guía"></label>
    <div class="g-quick"><button type="button" class="btn sm" data-tour>${ico('compass')}Recorrido por esta pantalla</button>${touch()?'':`<button type="button" class="btn sm" data-keys>${ico('key')}Atajos de teclado</button>`}</div>
    <div id="gList"></div></div>`,'md');
  const draw=()=>{const v=norm($('#gQ',m).value.trim()),list=HELP.filter(h=>!v||norm(h.t+' '+h.k+' '+h.s.join(' ')).includes(v));
    if(!list.length){$('#gList',m).innerHTML=`<p class="hint">No encontramos “${esc($('#gQ',m).value)}”. Prueba con otra palabra, como “sticker”, “PDF” o “portada”.</p>`;return}
    const groups=[...new Set(list.map(h=>h.g))];
    $('#gList',m).innerHTML=groups.map(g=>`<section><span class="lbl">${g}</span>${list.filter(h=>h.g===g).map(h=>`<details${v&&list.length<=3?' open':''}><summary>${h.t}</summary><ol>${h.s.map(x=>`<li>${x}</li>`).join('')}</ol>${h.show?`<button type="button" class="btn sm primary" data-show="${HELP.indexOf(h)}">${ico('compass')}Muéstrame dónde</button>`:''}</details>`).join('')}</section>`).join('')};
  draw();$('#gQ',m).addEventListener('input',draw);setTimeout(()=>{if(!touch())$('#gQ',m).focus()},60);
  m.addEventListener('click',e=>{if(e.target.closest('[data-x]'))return m.remove();if(e.target.closest('[data-tour]')){m.remove();startTour(curScreen(),true);return}
    if(e.target.closest('[data-keys]')){m.remove();openKeys();return}
    const b=e.target.closest('[data-show]');if(!b)return;const h=HELP[+b.dataset.show];m.remove();showMe(h)})}
function showMe(h){const[screen,sel,txt]=h.show,scr=curScreen(),recent=[...S.agendas].sort((x,y)=>y.updated-x.updated)[0];
  if(screen==='home'&&scr!=='home')drawerAct('home');
  if((screen==='open'||screen==='cover')&&scr!==screen){if(!recent){toast('Primero crea una agenda');openCreate();return}const a=(scr==='open'||scr==='cover')?ED.a:recent;screen==='open'?openAgenda(a):openCover(a)}
  setTimeout(()=>spotlight(sel,h.t,txt||h.s[0].replace(/<[^>]+>/g,'')),screen===scr?60:700)}

/* ---- keyboard shortcuts ---- */
function openKeys(){const M=/Mac|iPhone|iPad/.test(navigator.platform)?'⌘':'Ctrl',k=(...x)=>x.map(t=>`<kbd>${t}</kbd>`).join(' + ');
  const rows=[['Deshacer',k(M,'Z')],['Rehacer',k(M,'Shift','Z')],['Seleccionar todo en la página',k(M,'A')],['Duplicar',k(M,'D')],['Agrupar',k(M,'G')],['Desagrupar',k(M,'Shift','G')],
    ['Borrar lo seleccionado',k('Supr')],['Mover lo seleccionado',`${k('←')} ${k('↑')} ${k('→')} ${k('↓')} · con ${k('Shift')} más rápido`],['Editar el texto seleccionado',k('Enter')],['Quitar la selección',k('Esc')],
    ['Pasar página (sin nada seleccionado)',`${k('←')} ${k('→')}`],['Seleccionar varios',`${k('Shift')} + clic`],['Mover sin guías','mantén '+k('Alt')],['Abrir esta lista',k('?')]];
  const m=modal(`<header><h2>Atajos de teclado</h2><div class="spacer"></div><button class="btn ghost icon" data-x aria-label="Cerrar">${ico('x')}</button></header>
   <div class="content one"><table class="keys">${rows.map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div>
   <footer><button class="btn primary" data-x>Listo</button></footer>`,'sm');m.addEventListener('click',e=>{if(e.target.closest('[data-x]'))m.remove()})}
document.addEventListener('keydown',e=>{if(e.key!=='?'||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)||$('.modal'))return;e.preventDefault();openKeys()});

/* ---- welcome (first visit) ---- */
function openWelcome(){closeDrawer();const art=(d,c)=>`<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">${d.replace(/C1/g,c)}</svg>`;
  const cards=[[art('<rect x="10" y="10" width="44" height="44" rx="4" fill="var(--paper)" stroke="var(--line)"/><path d="M32 44c-9-6-12-11-9-15 2-3 6-2 9 2 3-4 7-5 9-2 3 4 0 9-9 15z" fill="C1"/><rect x="14" y="14" width="18" height="6" rx="1" fill="var(--muted)" opacity=".5" transform="rotate(-8 23 17)"/>','var(--accent)'),'Diseñá en digital','Libretas digitales para escribir, pegar stickers y fotos, y decorar a tu manera.'],
    [art('<rect x="14" y="8" width="34" height="48" rx="4" fill="C1"/><path d="M14 30h34" stroke="#2457C9" stroke-width="2.5"/><path d="M31 30v6" stroke="#c9a24a" stroke-width="1.5"/><path d="M26 39c2-4 8-4 10 0-3 2-7 2-10 0z" fill="#dc9a45"/>','#8C3B2A'),'Pedí la tuya en cuero','Armá tu Delulu en 4 pasos, mirala en 3D y pedila por DM. Hecha a mano en Guatemala.'],
    [art('<path d="M16 10h24l10 10v34H16z" fill="var(--paper)" stroke="var(--line)"/><path d="M24 34l6 6 12-14" stroke="C1" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>','var(--accent)'),'Se guarda sola','Todo queda en este navegador. Exporta a PDF o guarda una copia cuando quieras.']];
  const m=modal(`<div class="welcome"><p class="date">Bienvenida a</p>${brandLogo('xl')}<p class="lead">Soñá. Planeá. Repetí. Libretas para soltar tu creatividad, en digital y en cuero artesanal.</p>
    <div class="wcards">${cards.map(([i,t,x])=>`<div class="wcard">${i}<div><b>${t}</b><span>${x}</span></div></div>`).join('')}</div>
    <div class="field wname"><label class="lbl" for="wName">¿Cómo te llamas? <span style="text-transform:none;letter-spacing:0;font-weight:500">(opcional)</span></label><input type="text" id="wName" maxlength="24" placeholder="Para saludarte en tu estantería" value="${esc(S.prefs.name||'')}"></div>
    <div class="wbtns"><button type="button" class="btn" data-w="solo">Explorar por mi cuenta</button><button type="button" class="btn primary" data-w="tour">${ico('compass')}Muéstrame cómo (1 minuto)</button></div></div>`,'md welcome-dlg');
  m.addEventListener('click',e=>{const b=e.target.closest('[data-w]');if(!b)return;const n=$('#wName',m).value.trim();if(n!==(S.prefs.name||'')){S.prefs.name=n}
    S.prefs.welcomed=1;S.prefs.tours=b.dataset.w==='tour'?'on':'off';persist();m.remove();if(curScreen()!=='home')go('home');else renderHome();
    if(b.dataset.w==='tour'){S.prefs.seenTours={};startTour('home')}else toast('Si tienes una duda, toca ? arriba a la derecha',{ms:5000})})}

/* ---- every icon-only button explains itself on hover ---- */
document.addEventListener('pointerover',e=>{const b=e.target.closest?.('button[aria-label]:not([title])');if(b)b.title=b.getAttribute('aria-label')});
$('#btnHelp').onclick=()=>openGuide();
