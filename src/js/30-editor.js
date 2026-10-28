
/* ================= editing engine (shared by pages and cover) ================= */
const ED={a:null,mode:'page',sel:null,hist:[],fut:[],last:'',draw:null,lasso:null,multi:false,snap:true,rerender:()=>{},activeArr:null,activeSurf:null};
const snap=()=>JSON.stringify({pages:ED.a.pages,cover:ED.a.cover});
function initHistory(){ED.hist=[];ED.fut=[];ED.last=snap();updUndo()}
function commit(){const s=snap();if(s===ED.last)return;ED.hist.push(ED.last);if(ED.hist.length>80)ED.hist.shift();ED.last=s;ED.fut=[];ED.a.updated=Date.now();persist();updUndo();if(ED.mode==='page')refreshThumbs()}
function restore(s){const o=JSON.parse(s);ED.a.pages=o.pages;ED.a.cover=o.cover;ED.last=s;ED.sel=null;ED.a.updated=Date.now();persist();ED.rerender();updUndo()}
function undo(){if(!ED.hist.length)return;ED.fut.push(ED.last);restore(ED.hist.pop())}
function redo(){if(!ED.fut.length)return;ED.hist.push(ED.last);restore(ED.fut.pop())}
function updUndo(){['#btnUndo','#cUndo'].forEach(s=>$(s).disabled=!ED.hist.length);['#btnRedo','#cRedo'].forEach(s=>$(s).disabled=!ED.fut.length)}
$('#btnUndo').onclick=$('#cUndo').onclick=undo;$('#btnRedo').onclick=$('#cRedo').onclick=redo;

/* ---- selection: one element, several, or whole groups ---- */
const selEls=()=>{if(!ED.sel)return[];const s=new Set(ED.sel.ids);return ED.sel.arr.filter(e=>s.has(e.id))};
const isMulti=()=>!!ED.sel&&ED.sel.ids.length>1;
const selEl=()=>ED.sel&&!isMulti()?ED.sel.arr.find(e=>e.id===ED.sel.id):null;
function expand(arr,ids){const set=new Set(ids),gs=new Set(arr.filter(e=>set.has(e.id)&&e.g).map(e=>e.g));return arr.filter(e=>set.has(e.id)||(e.g&&gs.has(e.g))).map(e=>e.id)}
function corners(e){const r=(e.r||0)*Math.PI/180,c=Math.cos(r),s=Math.sin(r),cx=e.x+e.w/2,cy=e.y+e.h/2;return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>{const x=a*e.w/2,y=b*e.h/2;return[cx+x*c-y*s,cy+x*s+y*c]})}
function bboxOf(els){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;els.forEach(e=>corners(e).forEach(([x,y])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}));return{x:x0,y:y0,w:x1-x0,h:y1-y0}}
const handles=()=>`<i class="hd rot" data-h="rot"></i><i class="hd br" data-h="rs"></i><i class="hd tl" data-h="rs"></i>`;
function paintEls(surf,arr){const box=surf.querySelector('.els');if(!box)return;const lea=ED.mode==='cover'?ED.a.cover.color:null;
  box.innerHTML=arr.map((e,i)=>elHTML(lea?{...e,lea}:e,i+1)).join('');
  if(ED.sel&&ED.sel.arr===arr){const ids=ED.sel.ids;
    if(ids.length===1){const d=box.querySelector(`[data-id="${ids[0]}"]`),e=arr.find(x=>x.id===ids[0]);if(d&&e){d.classList.add('sel');if(!e.locked&&!ED.lasso)d.insertAdjacentHTML('beforeend',handles())}}
    else{const els=selEls();els.forEach(e=>box.querySelector(`[data-id="${e.id}"]`)?.classList.add('msel'));const b=bboxOf(els),grp=els[0]?.g&&els.every(e=>e.g===els[0].g);
      box.insertAdjacentHTML('beforeend',`<div class="gbox${grp?' grp':''}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px">${els.some(e=>!e.locked)?handles():''}</div>`)}}}
function patchEl(surf,e){const d=surf.querySelector(`.els [data-id="${e.id}"]`);if(!d)return;const z=d.style.zIndex;d.setAttribute('style',elStyle(e,z))}
function patchGbox(surf){const g=surf.querySelector('.gbox');if(!g||!ED.sel)return;const b=bboxOf(selEls());Object.assign(g.style,{left:b.x+'px',top:b.y+'px',width:b.w+'px',height:b.h+'px'})}
function repaintSel(){if(!ED.sel)return;paintEls(ED.sel.surf,ED.sel.arr)}
function setSel(surf,arr,ids,primary){const prev=ED.sel;ED.sel=ids.length?{surf,arr,ids,id:ids.includes(primary)?primary:ids[ids.length-1]}:null;if(ids.length===1)tipOnce('select',touch()?'Arrastra para moverlo · dos dedos para agrandar y girar · abajo están sus opciones':'Arrastra para moverlo · la esquina cambia el tamaño · el círculo lo gira · abajo están sus opciones');
  if(prev&&prev.arr!==arr)paintEls(prev.surf,prev.arr);paintEls(surf,arr);closeSheet();renderCtx()}
function select(surf,arr,id,add){let ids=id?expand(arr,[id]):[];const prev=ED.sel;
  if(add&&prev&&prev.arr===arr&&id){const cur=new Set(prev.ids),ex=expand(arr,[id]),has=ex.every(i=>cur.has(i));ex.forEach(i=>has?cur.delete(i):cur.add(i));ids=arr.filter(e=>cur.has(e.id)).map(e=>e.id)}
  setSel(surf,arr,ids,id)}
function deselect(){ED.multi=false;if(!ED.sel){renderCtx();return}const p=ED.sel;ED.sel=null;paintEls(p.surf,p.arr);closeSheet();renderCtx()}
function surfPoint(surf,ev,W){const r=surf.getBoundingClientRect();const s=r.width/W;return{x:(ev.clientX-r.left)/s,y:(ev.clientY-r.top)/s,s}}
const RATIO=e=>['image','sticker','note'].includes(e.type)||(e.type==='paper'&&e.pid==='polaroid')||e.type==='stroke';

/* ---- guides ---- */
function snapMove(arr,mov,b0,dx,dy,W,H,s){const th=7/s,ids=new Set(mov.map(e=>e.id)),xs=[0,W/2,W],ys=[0,H/2,H];
  arr.forEach(o=>{if(ids.has(o.id)||o.type==='stroke')return;const b=bboxOf([o]);xs.push(b.x,b.x+b.w/2,b.x+b.w);ys.push(b.y,b.y+b.h/2,b.y+b.h)});
  const best=(v0,size,list)=>{let r=null;[0,size/2,size].forEach(off=>list.forEach(t=>{const d=t-(v0+off);if(Math.abs(d)<th&&(!r||Math.abs(d)<Math.abs(r.d)))r={d,t}}));return r};
  const bx=best(b0.x+dx,b0.w,xs),by=best(b0.y+dy,b0.h,ys),lines=[];if(bx){dx+=bx.d;lines.push({v:1,p:bx.t})}if(by){dy+=by.d;lines.push({v:0,p:by.t})}return[dx,dy,lines]}
function showGuides(surf,lines){let g=surf.querySelector(':scope > .guides');if(!lines.length){g?.remove();return}
  if(!g){g=document.createElement('div');g.className='guides';surf.appendChild(g)}
  g.innerHTML=lines.map(l=>l.v?`<i style="left:${l.p}px;top:-2000px;bottom:-2000px;width:calc(1px*var(--inv,1))"></i>`:`<i style="top:${l.p}px;left:-2000px;right:-2000px;height:calc(1px*var(--inv,1))"></i>`).join('')}
function updSnapBtn(){['#btnSnap','#cSnap'].forEach(s=>$(s)?.classList.toggle('on',ED.snap))}
['#btnSnap','#cSnap'].forEach(s=>$(s).onclick=()=>{ED.snap=!ED.snap;S.prefs.snap=ED.snap;persist();updSnapBtn();toast(ED.snap?'Guías activadas (mantén Alt para moverte libre)':'Guías desactivadas')});

function bindSurface(surf,arr,W,H){
  surf.ondragover=ev=>{if(ED.drag){ev.preventDefault()}};
  surf.ondrop=ev=>{if(!ED.drag)return;ev.preventDefault();const p=surfPoint(surf,ev,W);ED.activeSurf=surf;ED.activeArr=arr;ED.activeW=W;ED.activeH=H;ED.drag(p);ED.drag=null};
  surf.onpointerdown=ev=>{if(ev.button>0)return;ED.activeSurf=surf;ED.activeArr=arr;ED.activeW=W;ED.activeH=H;
    if(ED.lasso)return lassoStart(surf,W,ev);
    if(ED.draw)return drawStart(surf,arr,W,ev);
    const hd=ev.target.closest('.hd'),elD=ev.target.closest('.el');
    if(hd&&ED.sel){ev.preventDefault();return isMulti()?groupDrag(surf,W,ev,hd.dataset.h):handleDrag(surf,W,ev,hd.dataset.h)}
    if(!elD)return marquee(surf,arr,W,ev);
    const e=arr.find(x=>x.id===elD.dataset.id);if(!e)return;
    const chk=ev.target.closest('.chk');
    if(chk&&ED.sel&&!isMulti()&&ED.sel.id===e.id){ev.preventDefault();const ls=e.text.split('\n'),i=+chk.dataset.line;ls[i]=ls[i].replace(/\[( |x)\]/i,m=>m.toLowerCase()==='[x]'?'[ ]':'[x]');e.text=ls.join('\n');paintEls(surf,arr);commit();return}
    if(ev.shiftKey||ev.metaKey||ev.ctrlKey||ED.multi){ev.preventDefault();select(surf,arr,e.id,true);return}
    if(!ED.sel||ED.sel.arr!==arr||!ED.sel.ids.includes(e.id))select(surf,arr,e.id);
    if(selEls().every(x=>x.locked))return;
    ev.preventDefault();moveDrag(surf,W,ev)};
  surf.ondblclick=ev=>{const d=ev.target.closest('.el');if(!d||isMulti())return;const e=arr.find(x=>x.id===d.dataset.id);if(e&&!e.locked&&(e.type==='text'||e.type==='note'))openTextSheet(e)};
}
const PTRS=new Map();
function moveDrag(surf,W,ev){const mov=selEls().filter(e=>!e.locked);if(!mov.length)return;const arr=ED.sel.arr,H=ED.activeH,p0=surfPoint(surf,ev,W),st=mov.map(e=>[e.x,e.y]),b0=bboxOf(mov),one=mov.length===1?mov[0]:null;
  let moved=false,pinch=null;PTRS.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});
  const mv=m=>{if(!PTRS.has(m.pointerId))return;PTRS.set(m.pointerId,{x:m.clientX,y:m.clientY});
    if(PTRS.size>=2){if(!one)return;const[a,b]=[...PTRS.values()];const d=Math.hypot(b.x-a.x,b.y-a.y),ang=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI,e=one;
      if(!pinch)pinch={d,ang,w:e.w,h:e.h,r:e.r||0,cx:e.x+e.w/2,cy:e.y+e.h/2};
      const k=clamp(d/pinch.d,.15,8);e.w=Math.max(16,pinch.w*k);e.h=Math.max(12,pinch.h*k);e.r=pinch.r+(ang-pinch.ang);e.x=pinch.cx-e.w/2;e.y=pinch.cy-e.h/2;moved=true;patchEl(surf,e);return}
    const p=surfPoint(surf,m,W);let dx=p.x-p0.x,dy=p.y-p0.y,lines=[];if(!moved&&Math.hypot(dx,dy)<2)return;moved=true;
    if(ED.snap&&!m.altKey)[dx,dy,lines]=snapMove(arr,mov,b0,dx,dy,W,H,p.s);
    mov.forEach((e,i)=>{e.x=st[i][0]+dx;e.y=st[i][1]+dy;patchEl(surf,e)});patchGbox(surf);showGuides(surf,lines)};
  const up=u=>{PTRS.delete(u.pointerId);if(PTRS.size)return;document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);showGuides(surf,[]);if(moved){commit();if(pinch)repaintSel()}};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);
  surf.addEventListener('pointerdown',function sec(s){if(PTRS.size&&s.pointerId!==ev.pointerId&&!PTRS.has(s.pointerId)){PTRS.set(s.pointerId,{x:s.clientX,y:s.clientY});s.stopPropagation()}},{capture:true,once:true})}
function handleDrag(surf,W,ev,kind){const e=selEl();if(!e)return;const cx=e.x+e.w/2,cy=e.y+e.h/2,w0=e.w,h0=e.h;const rad=-(e.r||0)*Math.PI/180;const d0=Math.hypot(w0/2,h0/2);
  const mv=m=>{const p=surfPoint(surf,m,W);const vx=p.x-cx,vy=p.y-cy;
    if(kind==='rot'){let a=Math.atan2(vy,vx)*180/Math.PI+90;if(m.shiftKey)a=Math.round(a/15)*15;else for(const t of[0,90,180,-90,270])if(Math.abs(a-t)<4)a=t;e.r=Math.round(a*10)/10}
    else{const lx=vx*Math.cos(rad)-vy*Math.sin(rad),ly=vx*Math.sin(rad)+vy*Math.cos(rad);
      if(RATIO(e)){const k=Math.max(.08,Math.hypot(lx,ly)/d0);e.w=w0*k;e.h=h0*k}else{e.w=Math.max(24,Math.abs(lx)*2);e.h=Math.max(e.type==='tape'?10:20,Math.abs(ly)*2)}
      e.x=cx-e.w/2;e.y=cy-e.h/2}
    patchEl(surf,e)};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);repaintSel();commit()};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up)}
function groupDrag(surf,W,ev,kind){const els=selEls().filter(e=>!e.locked);if(!els.length)return;const b=bboxOf(els),cx=b.x+b.w/2,cy=b.y+b.h/2,init=els.map(e=>({x:e.x,y:e.y,w:e.w,h:e.h,r:e.r||0,fs:e.fs}));
  const p0=surfPoint(surf,ev,W),a0=Math.atan2(p0.y-cy,p0.x-cx),d0=Math.max(1,Math.hypot(p0.x-cx,p0.y-cy));
  const mv=m=>{const p=surfPoint(surf,m,W);
    if(kind==='rot'){let da=(Math.atan2(p.y-cy,p.x-cx)-a0)*180/Math.PI;if(m.shiftKey)da=Math.round(da/15)*15;const r=da*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
      els.forEach((e,i)=>{const o=init[i],ex=o.x+o.w/2-cx,ey=o.y+o.h/2-cy;e.r=o.r+da;e.x=cx+ex*c-ey*s-o.w/2;e.y=cy+ex*s+ey*c-o.h/2})}
    else{const k=Math.max(.1,Math.hypot(p.x-cx,p.y-cy)/d0);els.forEach((e,i)=>{const o=init[i],ex=o.x+o.w/2-cx,ey=o.y+o.h/2-cy;e.w=o.w*k;e.h=o.h*k;if(o.fs)e.fs=o.fs*k;e.x=cx+ex*k-e.w/2;e.y=cy+ey*k-e.h/2})}
    els.forEach(e=>patchEl(surf,e))};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);els.forEach(e=>{if(e.fs)e.fs=Math.round(e.fs*10)/10});repaintSel();commit()};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up)}
function marquee(surf,arr,W,ev){const p0=surfPoint(surf,ev,W),add=ev.shiftKey;let box=null,r=null;
  const mv=m=>{const p=surfPoint(surf,m,W);if(!box&&Math.hypot(p.x-p0.x,p.y-p0.y)<6)return;if(!box){box=document.createElement('div');box.className='marq';surf.appendChild(box)}
    r={x:Math.min(p.x,p0.x),y:Math.min(p.y,p0.y),w:Math.abs(p.x-p0.x),h:Math.abs(p.y-p0.y)};Object.assign(box.style,{left:r.x+'px',top:r.y+'px',width:r.w+'px',height:r.h+'px'})};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);
    if(!box){deselect();return}box.remove();const hit=arr.filter(e=>{const b=bboxOf([e]);return b.x<r.x+r.w&&b.x+b.w>r.x&&b.y<r.y+r.h&&b.y+b.h>r.y}).map(e=>e.id);
    if(!hit.length){deselect();return}const ids=expand(arr,add&&ED.sel?.arr===arr?[...ED.sel.ids,...hit]:hit);setSel(surf,arr,ids,ids[ids.length-1])};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)}

/* ---- free drawing ---- */
function liveSvg(surf,W){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('style','position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:99999');s.setAttribute('viewBox',`0 0 ${W} ${surf.offsetHeight}`);surf.appendChild(s);return s}
function drawStart(surf,arr,W,ev){ev.preventDefault();const D=ED.draw;
  if(D.tool==='eraser'){const kill=t=>{const d=t.closest&&t.closest('.el');if(!d)return;const i=arr.findIndex(x=>x.id===d.dataset.id&&x.type==='stroke');if(i>=0){arr.splice(i,1);paintEls(surf,arr);D.dirty=true}};
    kill(ev.target);const mv=m=>kill(document.elementFromPoint(m.clientX,m.clientY)||document.body);const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);if(D.dirty){D.dirty=false;commit()}};
    document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);return}
  const pts=[surfPoint(surf,ev,W)];const sw=D.tool==='marker'?D.sw*2.6:D.tool==='brush'?D.sw*1.8:D.sw;
  const live=liveSvg(surf,W);live.innerHTML=`<path fill="none" stroke="${D.color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="${D.tool==='marker'?.45:1}"/>`;const path=live.firstChild;
  const toD=(P,ox=0,oy=0)=>P.map((p,i)=>{if(!i)return`M${(p.x-ox).toFixed(1)} ${(p.y-oy).toFixed(1)}`;const q=P[i-1];return`Q${(q.x-ox).toFixed(1)} ${(q.y-oy).toFixed(1)} ${((q.x+p.x)/2-ox).toFixed(1)} ${((q.y+p.y)/2-oy).toFixed(1)}`}).join('')+(P.length===1?`l.1 0`:'');
  const mv=m=>{(m.getCoalescedEvents?m.getCoalescedEvents():[m]).forEach(c=>pts.push(surfPoint(surf,c,W)));path.setAttribute('d',toD(pts))};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);live.remove();
    const pad=sw/2+2;let x0=Math.min(...pts.map(p=>p.x))-pad,y0=Math.min(...pts.map(p=>p.y))-pad,x1=Math.max(...pts.map(p=>p.x))+pad,y1=Math.max(...pts.map(p=>p.y))+pad;
    arr.push({id:uid(),type:'stroke',tool:D.tool,color:D.color,sw,x:x0,y:y0,w:x1-x0,h:y1-y0,r:0,vw:x1-x0,vh:y1-y0,d:toD(pts,x0,y0)});paintEls(surf,arr);commit()};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up)}

/* ---- freehand photo crop ---- */
function startLasso(e){closeSheet();ED.lasso={id:e.id};repaintSel();renderCtx()}
function lassoStart(surf,W,ev){ev.preventDefault();const e=ED.sel&&ED.sel.arr.find(x=>x.id===ED.lasso.id);if(!e){ED.lasso=null;renderCtx();return}
  const pts=[surfPoint(surf,ev,W)];const live=liveSvg(surf,W);live.innerHTML=`<path fill="rgba(196,135,140,.15)" stroke="#c4878c" stroke-width="2" stroke-dasharray="6 4" vector-effect="non-scaling-stroke"/>`;const path=live.firstChild;
  const mv=m=>{pts.push(surfPoint(surf,m,W));path.setAttribute('d','M'+pts.map(p=>p.x.toFixed(1)+' '+p.y.toFixed(1)).join('L')+'Z')};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);live.remove();ED.lasso=null;
    if(pts.length<8){toast('Dibuja un contorno más grande alrededor de la foto');repaintSel();renderCtx();return}
    const r=-(e.r||0)*Math.PI/180,c=Math.cos(r),s=Math.sin(r),cx=e.x+e.w/2,cy=e.y+e.h/2;
    const loc=pts.filter((p,i)=>i%2===0).map(p=>{const dx=p.x-cx,dy=p.y-cy;return[clamp((dx*c-dy*s+e.w/2)/e.w,0,1),clamp((dx*s+dy*c+e.h/2)/e.h,0,1)]});
    e.lasso='M'+loc.map(([x,y])=>x.toFixed(4)+' '+y.toFixed(4)).join('L')+'Z';e.mask='lasso';e.frame='none';repaintSel();commit();renderCtx();toast('Recorte aplicado')};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up)}

/* ---- background removal for stickers and photos ---- */
async function removeBg(src,tol){const img=await loadImg(src);if(!img)throw new Error('img');const w=img.naturalWidth,h=img.naturalHeight,c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);const d=x.getImageData(0,0,w,h),p=d.data;const R=[],G=[],B=[];
  const sample=i=>{if(p[i+3]>20){R.push(p[i]);G.push(p[i+1]);B.push(p[i+2])}};
  for(let X=0;X<w;X+=2){sample(X*4);sample(((h-1)*w+X)*4)}for(let Y=0;Y<h;Y+=2){sample(Y*w*4);sample((Y*w+w-1)*4)}
  const med=a=>{a.sort((m,n)=>m-n);return a.length?a[a.length>>1]:255};const bg=[med(R),med(G),med(B)];
  const dist=i=>Math.sqrt((p[i]-bg[0])**2+(p[i+1]-bg[1])**2+(p[i+2]-bg[2])**2);
  const seen=new Uint8Array(w*h),q=new Int32Array(w*h);let qt=0,qh=0;
  const tryPush=k=>{if(seen[k])return;const i=k*4;if(p[i+3]<20||dist(i)<tol){seen[k]=1;q[qt++]=k}};
  for(let X=0;X<w;X++){tryPush(X);tryPush((h-1)*w+X)}for(let Y=0;Y<h;Y++){tryPush(Y*w);tryPush(Y*w+w-1)}
  while(qh<qt){const k=q[qh++],X=k%w;if(X>0)tryPush(k-1);if(X<w-1)tryPush(k+1);if(k>=w)tryPush(k-w);if(k<w*(h-1))tryPush(k+w)}
  for(let k=0;k<w*h;k++)if(seen[k]){const i=k*4;p[i+3]=Math.round(p[i+3]*clamp((dist(i)-tol*.55)/(tol*.45),0,1))}
  x.putImageData(d,0,0);let x0=w,y0=h,x1=-1,y1=-1;
  for(let Y=0;Y<h;Y++)for(let X=0;X<w;X++)if(p[(Y*w+X)*4+3]>12){if(X<x0)x0=X;if(X>x1)x1=X;if(Y<y0)y0=Y;if(Y>y1)y1=Y}
  if(x1<0)throw new Error('empty');const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,-x0,-y0);
  return{url:o.toDataURL('image/png'),w:o.width,h:o.height}}
function openBgSheet(e){closeSheet();const host=ctxHost(),src=imgURL(e.type==='image'?e.img:e.custom),s=document.createElement('div');s.className='sheet';
  s.innerHTML=`<span class="lbl">Quitar fondo</span><span class="hint">Funciona mejor con fondos lisos: una hoja, una pared o una mesa de un solo color.</span>
   <div class="row"><div class="bgprev"><img id="bgP" alt="Vista previa sin fondo"></div><div style="flex:1;min-width:150px;display:flex;flex-direction:column;gap:8px"><label class="hint" for="bgT">Sensibilidad</label><input id="bgT" type="range" min="10" max="140" value="45"><span class="hint" id="bgMsg"></span></div></div>
   <div class="row"><div class="spacer"></div><button class="btn" data-x>Cancelar</button><button class="btn primary" data-ok disabled>Aplicar</button></div>`;
  host.appendChild(s);let res=null,tk=0,deb;
  const run=async()=>{const t=++tk;$('#bgMsg',s).textContent='Procesando…';try{const r=await removeBg(src,+$('#bgT',s).value);if(t!==tk)return;res=r;$('#bgP',s).src=r.url;$('#bgMsg',s).textContent='';$('[data-ok]',s).disabled=false}
    catch(err){if(t===tk){res=null;$('#bgMsg',s).textContent='Con esa sensibilidad no queda nada. Bájala un poco.';$('[data-ok]',s).disabled=true}}};
  $('#bgT',s).oninput=()=>{clearTimeout(deb);deb=setTimeout(run,180)};run();
  s.onclick=ev=>{if(ev.target.closest('[data-x]'))return closeSheet();if(!ev.target.closest('[data-ok]')||!res)return;
    const id='img_'+uid();S.images[id]=res.url;if(!S.prefs.custom.includes(id))S.prefs.custom.push(id);
    if(e.type==='image'){e.type='sticker';delete e.img;delete e.frame;delete e.mask;delete e.lasso}e.custom=id;
    const cx=e.x+e.w/2,cy=e.y+e.h/2,L=Math.max(e.w,e.h),k=L/Math.max(res.w,res.h);e.w=res.w*k;e.h=res.h*k;e.x=cx-e.w/2;e.y=cy-e.h/2;
    closeSheet();repaintSel();commit();renderCtx();toast('Fondo quitado. También quedó en “Tus stickers”')}}

/* ---- contextual toolbar ---- */
function ctxHost(){return ED.mode==='cover'?$('#cctx'):$('#ctx')}
function renderCtx(){$('#ctx').innerHTML='';$('#cctx').innerHTML='';const host=ctxHost();
  if(ED.draw)return renderDrawBar(host);
  if(ED.lasso){host.innerHTML=`<div class="ctx"><span class="hint" style="padding:0 10px">Dibuja sobre la foto el contorno que quieres conservar</span><button class="btn on" data-c="lassoX" style="padding:7px 12px">Cancelar</button></div>`;
    host.firstChild.onclick=ev=>{if(ev.target.closest('[data-c]')){ED.lasso=null;repaintSel();renderCtx()}};return}
  const els=selEls();if(!els.length)return;const e=els.length===1?els[0]:null;
  const B=(act,icon,label,on)=>`<button class="btn${on?' on':''}" data-c="${act}" aria-label="${label}" title="${label}">${ico(icon)}</button>`;
  const opv=Math.round(((e||els[0]).op??1)*100);
  const tail=`<span class="sep"></span>`+B('dup','copy','Duplicar')+B('front','up','Traer al frente')+B('back','down','Enviar al fondo')+B('align','align',e?'Alinear en la página':'Alinear')+B('lock','lock','Bloquear',false)
    +`<label class="op">${opv}%<input type="range" min="10" max="100" value="${opv}" data-c="op" aria-label="Opacidad"></label>`+B('multi','multi','Seleccionar varios',ED.multi)+B('del','trash','Eliminar');
  let h='';
  if(!e){const grp=els[0].g&&els.every(x=>x.g===els[0].g);h=`<span class="hint" style="padding:0 8px;white-space:nowrap">${els.length} elementos</span>`+(grp?B('ungroup','ungroup','Desagrupar'):B('group','group','Agrupar'))+(els.every(x=>x.locked)?B('lock','lock','Desbloquear',true):tail)}
  else if(e.locked){h=B('lock','lock','Desbloquear',true)+`<span class="hint" style="padding:0 8px">Elemento bloqueado</span>`}
  else{
   if(e.type==='text'||e.type==='note'){h+=B('edit','edit','Editar texto')+`<select data-c="font" aria-label="Tipografía">${FONTS.map(([n,f])=>`<option value='${f}'${f===e.font?' selected':''}>${n}</option>`).join('')}</select>`
     +`<button class="btn" data-c="fs-" aria-label="Texto más pequeño">A−</button><button class="btn" data-c="fs+" aria-label="Texto más grande">A+</button>`
     +`<button class="btn${e.b?' on':''}" data-c="b" aria-label="Negrita"><b>B</b></button><button class="btn${e.it?' on':''}" data-c="it" aria-label="Cursiva"><i style="font-family:serif">I</i></button><button class="btn${e.u?' on':''}" data-c="u" aria-label="Subrayado"><u>U</u></button>`
     +`<button class="btn" data-c="al" aria-label="Alineación del texto">${{left:'⟸',center:'≡',right:'⟹'}[e.al||'left']}</button>`
     +`<input type="color" data-c="color" value="${e.color||'#3b2d26'}" aria-label="Color del texto">`;
     if(e.type==='note')h+=`<input type="color" data-c="bgc" value="${e.bgc||'#f6e3a1'}" aria-label="Color de la nota">`;
     else if(ED.mode==='cover')h+=`<select data-c="fx" aria-label="Acabado">${[['','Impreso'],['grabado','Grabado'],['dorado','Estampado oro'],['plata','Estampado plata']].map(([v,l])=>`<option value="${v}"${(e.fx||'')===v?' selected':''}>${l}</option>`).join('')}</select>`;
     else h+=`<select data-c="tbg" aria-label="Fondo del texto">${[['','Sin fondo'],['papel','Papel rasgado'],['cinta','Etiqueta']].map(([v,l])=>`<option value="${v}"${(e.bg||'')===v?' selected':''}>${l}</option>`).join('')}</select>`}
   if(e.type==='image')h+=B('photo','image','Foto, marco y forma')+B('bg','wand','Quitar fondo');
   if(e.type==='sticker'&&e.custom)h+=B('bg','wand','Quitar fondo');
   if((e.type==='sticker'&&!e.custom)||e.type==='paper'||e.type==='stroke'||e.type==='tape')h+=`<input type="color" data-c="color" value="${e.color||(STICKERS.find(s=>s.id===e.sid)||{}).col||'#e9c2c4'}" aria-label="Color">`;
   if(e.type==='tape')h+=`<select data-c="pat" aria-label="Diseño de la cinta">${TAPES.map(t=>`<option value="${t.id}"${t.id===e.pat?' selected':''}>${t.n}</option>`).join('')}</select>`;
   h+=tail}
  host.innerHTML=`<div class="ctx">${h}</div>`;
  const bar=host.firstChild;
  bar.onclick=ev=>{const b=ev.target.closest('button[data-c]');if(!b)return;ctxAct(b.dataset.c)};
  bar.oninput=ev=>{const t=ev.target,c=t.dataset.c;if(!ED.sel)return;
    if(c==='op'){selEls().forEach(x=>{x.op=t.value/100;patchEl(ED.sel.surf,x)});t.parentElement.firstChild.textContent=t.value+'%';return}
    const e=selEl();if(e&&(c==='color'||c==='bgc')){e[c]=t.value;repaintSel()}};
  bar.onchange=ev=>{const t=ev.target,c=t.dataset.c,e=selEl();if(c==='op'){commit();return}if(!e)return;
    if(c==='font')e.font=t.value;if(c==='fx')e.fx=t.value;if(c==='tbg')e.bg=t.value;if(c==='pat')e.pat=t.value;repaintSel();commit()}}
function ctxAct(c){if(!ED.sel)return;const{arr,surf}=ED.sel,els=selEls(),e=els.length===1?els[0]:null,ids=new Set(ED.sel.ids);
  switch(c){
    case 'del':for(let i=arr.length-1;i>=0;i--)if(ids.has(arr[i].id))arr.splice(i,1);ED.sel=null;ED.multi=false;paintEls(surf,arr);closeSheet();break;
    case 'dup':{const gm={},nids=[];els.forEach(x=>{const n={...clone(x),id:uid(),x:x.x+18,y:x.y+18};if(x.g)n.g=gm[x.g]||(gm[x.g]=uid());arr.push(n);nids.push(n.id)});ED.sel={surf,arr,ids:nids,id:nids[nids.length-1]};paintEls(surf,arr);break}
    case 'front':case 'back':{const pick=arr.filter(x=>ids.has(x.id)),rest=arr.filter(x=>!ids.has(x.id));arr.length=0;c==='front'?arr.push(...rest,...pick):arr.push(...pick,...rest);paintEls(surf,arr);break}
    case 'lock':{const v=!els.every(x=>x.locked);els.forEach(x=>x.locked=v);paintEls(surf,arr);break}
    case 'group':{const g=uid();els.forEach(x=>x.g=g);paintEls(surf,arr);toast('Agrupados: ahora se mueven juntos');break}
    case 'ungroup':els.forEach(x=>delete x.g);paintEls(surf,arr);toast('Grupo separado');break;
    case 'multi':ED.multi=!ED.multi;renderCtx();if(ED.multi)toast('Toca otros elementos para sumarlos o quitarlos');return;
    case 'align':openAlignSheet();return;
    case 'bg':if(e)openBgSheet(e);return;
    case 'edit':if(e)openTextSheet(e);return;
    case 'photo':if(e)openPhotoSheet(e);return;
    default:if(!e)return;
      if(c==='fs+')e.fs=Math.round((e.fs||24)*1.12);
      if(c==='fs-')e.fs=Math.max(8,Math.round((e.fs||24)/1.12));
      if(c==='b'||c==='it'||c==='u')e[c]=!e[c];
      if(c==='al')e.al={left:'center',center:'right',right:'left'}[e.al||'left'];
      repaintSel()}
  commit();renderCtx()}
function openAlignSheet(){closeSheet();const host=ctxHost(),els=selEls(),unit=els.length>1&&els.every(x=>x.g&&x.g===els[0].g),rel=els.length>1&&!unit,s=document.createElement('div');s.className='sheet';
  const A=[['l','Izquierda'],['ch','Centro'],['r','Derecha'],['t','Arriba'],['cv','Medio'],['b','Abajo']];
  s.innerHTML=`<span class="lbl">${rel?'Alinear entre sí':'Alinear en la página'}</span><div class="opts">${A.map(([k,l])=>`<button class="chip" data-al="${k}">${l}</button>`).join('')}</div>
   ${rel&&els.length>2?`<span class="lbl">Distribuir</span><div class="opts"><button class="chip" data-al="dh">Mismo espacio horizontal</button><button class="chip" data-al="dv">Mismo espacio vertical</button></div>`:''}
   <div class="row"><div class="spacer"></div><button class="btn primary" data-ok>Listo</button></div>`;
  host.appendChild(s);s.onclick=ev=>{if(ev.target.closest('[data-ok]'))return closeSheet();const b=ev.target.closest('[data-al]');if(b)alignSel(b.dataset.al,rel,unit)}}
function alignSel(k,rel,unit){const{surf,arr}=ED.sel,els=selEls().filter(e=>!e.locked);if(!els.length)return;const W=ED.activeW,H=ED.activeH;
  const ref=rel?bboxOf(els):{x:0,y:0,w:W,h:H};
  const delta=b=>({l:[ref.x-b.x,0],r:[ref.x+ref.w-b.x-b.w,0],ch:[ref.x+ref.w/2-b.x-b.w/2,0],t:[0,ref.y-b.y],b:[0,ref.y+ref.h-b.y-b.h],cv:[0,ref.y+ref.h/2-b.y-b.h/2]})[k];
  if(k==='dh'||k==='dv'){const hz=k==='dh',bs=els.map(e=>({e,b:bboxOf([e])})).sort((a,b)=>hz?a.b.x-b.b.x:a.b.y-b.b.y),tot=bs.reduce((s,o)=>s+(hz?o.b.w:o.b.h),0),gap=((hz?ref.w:ref.h)-tot)/(bs.length-1);let pos=hz?ref.x:ref.y;
    bs.forEach(o=>{const d=pos-(hz?o.b.x:o.b.y);hz?o.e.x+=d:o.e.y+=d;pos+=(hz?o.b.w:o.b.h)+gap})}
  else if(unit||(!rel&&els.length>1)){const[dx,dy]=delta(bboxOf(els));els.forEach(e=>{e.x+=dx;e.y+=dy})}
  else els.forEach(e=>{const[dx,dy]=delta(bboxOf([e]));e.x+=dx;e.y+=dy});
  paintEls(surf,arr);commit()}
function closeSheet(){$$('.sheet').forEach(s=>s.remove())}
function openTextSheet(e){closeSheet();const host=ctxHost();const s=document.createElement('div');s.className='sheet';
  s.innerHTML=`<label class="lbl" for="tEdit">Texto</label><textarea id="tEdit">${esc(e.text)}</textarea><div class="row"><span class="hint">Escribe “[ ]” al inicio de una línea para crear una casilla; tócala para marcarla.</span><div class="spacer"></div><button class="btn primary" data-ok>Listo</button></div>`;
  host.appendChild(s);const ta=$('#tEdit',s);ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);
  ta.oninput=()=>{e.text=ta.value;repaintSel()};$('[data-ok]',s).onclick=()=>{closeSheet();commit()};ta.onblur=()=>commit()}
const MASK_OPTS=[['none','Rectángulo'],['circle','Círculo'],['heart','Corazón'],['star','Estrella'],['arch','Arco'],['scallop','Festón'],['hex','Hexágono'],['blob','Orgánica'],['lasso','Recorte libre ✎']];
function maskIcon(k){if(k==='none')return `<svg viewBox="0 0 20 20" width="18" height="18"><rect x="3" y="4" width="14" height="12" rx="1" fill="currentColor" opacity=".5"/></svg>`;if(k==='lasso')return'';
  return `<svg viewBox="0 0 1 1" width="18" height="18"><path d="${MASK_PATHS[k]}" fill="currentColor" opacity=".5"/></svg>`}
function openPhotoSheet(e){closeSheet();const host=ctxHost();const s=document.createElement('div');s.className='sheet';const mk=maskOf(e)||'none';
  s.innerHTML=`<div class="row"><span class="lbl" style="width:70px">Forma</span><div class="opts" id="pMk" style="flex:1">${MASK_OPTS.map(([v,l])=>`<button class="chip${mk===v?' on':''}" data-m="${v}" style="display:inline-flex;gap:4px;align-items:center">${maskIcon(v)}${l}</button>`).join('')}</div></div>
   <div class="row"><span class="lbl" style="width:70px">Marco</span><div class="opts" id="pFr" style="flex:1">${[['none','Sin marco'],['polaroid','Polaroid'],['borde','Borde blanco'],['redondo','Redondeado']].map(([v,l])=>`<button class="chip${(mk==='none'?(e.frame||'none'):'none')===v?' on':''}" data-v="${v}">${l}</button>`).join('')}</div></div>
   <div class="row"><label class="lbl" for="pZ" style="width:70px">Zoom</label><input id="pZ" type="range" min="100" max="300" value="${(e.zoom||1)*100}" style="flex:1"></div>
   <div class="row"><label class="lbl" for="pX" style="width:70px">Encuadre</label><input id="pX" type="range" min="0" max="100" value="${e.px??50}" style="flex:1" aria-label="Horizontal"><input id="pY" type="range" min="0" max="100" value="${e.py??50}" style="flex:1" aria-label="Vertical"></div>
   <div class="row"><input id="pCap" type="text" placeholder="Pie de foto (en polaroid)" value="${esc(e.cap||'')}" style="flex:1;min-width:140px;border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--paper);color:#3b2d26">
    <label class="hint"><input type="checkbox" id="pOl" ${e.outline?'checked':''}> Contorno blanco</label><label class="hint"><input type="checkbox" id="pSh" ${e.shadow!==false?'checked':''}> Sombra</label><button class="btn primary" data-ok>Listo</button></div>`;
  host.appendChild(s);
  $('#pMk',s).onclick=ev=>{const b=ev.target.closest('[data-m]');if(!b)return;if(b.dataset.m==='lasso')return startLasso(e);e.mask=b.dataset.m;if(e.mask!=='none'){if(e.frame==='circulo'||e.frame)e.frame='none'}else if(e.frame==='circulo')e.frame='none';
    $$('#pMk .chip',s).forEach(x=>x.classList.toggle('on',x===b));if(e.mask!=='none')$$('#pFr .chip',s).forEach(x=>x.classList.toggle('on',x.dataset.v==='none'));repaintSel()};
  $('#pFr',s).onclick=ev=>{const b=ev.target.closest('[data-v]');if(!b)return;e.frame=b.dataset.v;if(e.frame!=='none'){e.mask='none';$$('#pMk .chip',s).forEach(x=>x.classList.toggle('on',x.dataset.m==='none'))}$$('#pFr .chip',s).forEach(x=>x.classList.toggle('on',x===b));repaintSel()};
  s.oninput=ev=>{const t=ev.target;if(t.id==='pZ')e.zoom=t.value/100;if(t.id==='pX')e.px=+t.value;if(t.id==='pY')e.py=+t.value;if(t.id==='pCap')e.cap=t.value;if(t.id==='pSh')e.shadow=t.checked;if(t.id==='pOl')e.outline=t.checked;repaintSel()};
  $('[data-ok]',s).onclick=()=>{closeSheet();commit()}}
function renderDrawBar(host){const D=ED.draw;const cols=['#3b2d26','#b5646d','#e3a2ad','#6f8566','#6c5e91','#3f5f7a','#c48b2f','#ffffff'];
  host.innerHTML=`<div class="ctx">${[['pen','Lápiz'],['marker','Marcador'],['brush','Pincel'],['eraser','Borrador']].map(([t,l])=>`<button class="btn${D.tool===t?' on':''}" data-t="${t}" style="padding:7px 10px">${t==='eraser'?ico('eraser'):''}${l}</button>`).join('')}
   <span class="sep"></span>${cols.map(c=>`<button class="sw${D.color===c?' on':''}" data-col="${c}" style="background:${c};width:24px;height:24px;flex:none" aria-label="Color ${c}"></button>`).join('')}<input type="color" value="${D.color}" data-cc aria-label="Otro color">
   <label class="op" style="width:110px">Grosor<input type="range" min="1" max="16" value="${D.sw}" data-sw></label><span class="sep"></span><button class="btn on" data-done style="padding:7px 12px">Listo</button></div>`;
  const bar=host.firstChild;bar.onclick=ev=>{const t=ev.target.closest('[data-t]'),c=ev.target.closest('[data-col]');if(t)D.tool=t.dataset.t;if(c)D.color=c.dataset.col;if(ev.target.closest('[data-done]'))return toggleDraw(false);renderDrawBar(host)};
  bar.oninput=ev=>{if(ev.target.dataset.sw!==undefined)D.sw=+ev.target.value;if(ev.target.dataset.cc!==undefined)D.color=ev.target.value}}
function toggleDraw(on){if(on){deselect();ED.draw=ED.draw0||{tool:'pen',color:'#3b2d26',sw:3};tipOnce('draw','Dibuja sobre la página. Toca Listo cuando termines')}else{ED.draw0=ED.draw;ED.draw=null}$('#btnDraw').classList.toggle('on',!!ED.draw);$$('.page').forEach(p=>p.style.cursor=ED.draw?'crosshair':'');renderCtx()}
$('#btnDraw').onclick=()=>toggleDraw(!ED.draw);

document.addEventListener('keydown',ev=>{const tag=document.activeElement?.tagName;if(/INPUT|TEXTAREA|SELECT/.test(tag))return;
  const inEd=$('#open').classList.contains('show')||$('#cover').classList.contains('show');if(!inEd||$('.modal'))return;
  const mod=ev.metaKey||ev.ctrlKey,k=ev.key.toLowerCase();
  if(mod&&k==='z'){ev.preventDefault();ev.shiftKey?redo():undo();return}
  if(mod&&k==='y'){ev.preventDefault();redo();return}
  if(mod&&k==='a'&&ED.activeArr){ev.preventDefault();const ids=ED.activeArr.map(e=>e.id);if(ids.length)setSel(ED.activeSurf,ED.activeArr,ids,ids[ids.length-1]);return}
  if(ED.sel){if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();ctxAct('del');return}
    if(mod&&k==='d'){ev.preventDefault();ctxAct('dup');return}
    if(mod&&k==='g'){ev.preventDefault();if(isMulti())ctxAct(ev.shiftKey?'ungroup':'group');return}
    if(ev.key==='Escape'){deselect();return}
    const e=selEl();if(e&&ev.key==='Enter'&&(e.type==='text'||e.type==='note')){ev.preventDefault();openTextSheet(e);return}
    const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[ev.key];
    if(d){ev.preventDefault();const st=ev.shiftKey?10:1;selEls().filter(x=>!x.locked).forEach(x=>{x.x+=d[0]*st;x.y+=d[1]*st;patchEl(ED.sel.surf,x)});patchGbox(ED.sel.surf);clearTimeout(ED.nt);ED.nt=setTimeout(commit,300)}return}
  if(ED.mode==='page'&&!ED.draw){if(ev.key==='ArrowRight')nav(1);if(ev.key==='ArrowLeft')nav(-1)}
  if(ev.key==='Escape'){if(ED.draw)toggleDraw(false);if(ED.lasso){ED.lasso=null;repaintSel();renderCtx()}}});

/* adding elements */
function placeEl(e,p){const arr=ED.activeArr,surf=ED.activeSurf;if(!arr)return;const W=ED.activeW,H=ED.activeH;
  const c=p||{x:W/2+(Math.random()-.5)*60,y:H/2+(Math.random()-.5)*60};e.id=uid();e.x=clamp(c.x-e.w/2,-e.w/2,W-e.w/2);e.y=clamp(c.y-e.h/2,-e.h/2,H-e.h/2);e.r=e.r??0;
  arr.push(e);ED.sel={surf,arr,ids:[e.id],id:e.id};paintEls(surf,arr);renderCtx();commit();if(innerWidth<=820)$$('.side').forEach(s=>s.classList.remove('openp'))}
async function readImage(file,max=1100){if(!/^image\/(png|jpe?g|webp|gif|heic|heif)$/i.test(file.type)){toast('Ese archivo no es una imagen compatible (JPG, PNG o WebP)');return null}
  if(file.size>25*1048576){toast('La imagen pesa más de 25 MB; elige una más ligera');return null}
  const url=URL.createObjectURL(file);try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
    const k=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
    const x=c.getContext('2d');x.drawImage(img,0,0,c.width,c.height);const png=file.type==='image/png';const data=c.toDataURL(png?'image/png':'image/jpeg',.84);
    const id='img_'+uid();S.images[id]=data;return{id,w:c.width,h:c.height}}catch(e){toast('No se pudo leer la imagen');return null}finally{URL.revokeObjectURL(url)}}
