
/* ================= turning pages like a real book =================
   A "leaf" with two faces rotates around the spine and follows the pointer. Works in double
   and single page view, in the editor and in the read-only shared view. */
const TURN={busy:false};
const PAD=14;
const staticPage=(p,pi,W,H,cls)=>pageHTML(p,pi,W,H,cls,false);
function turnCtx(){if($('#share').classList.contains('show')){if(!FL.a||FL.i<0)return null;return{stage:$('#shareStage'),pages:FL.a.pages,dims:dims(FL.a),idx:flipIdx(),go:t=>{FL.i=t;renderFlip()},back:()=>{FL.i=-1;renderFlip()}}}
  if(!ED.a||ED.mode!=='page')return null;return{stage:$('#stage'),pages:ED.a.pages,dims:dims(ED.a),idx:spreadIdx(),go:t=>{V.cur=t;ED.sel=null;closeSheet();ED.activeArr=null;renderStage()}}}
const motionOn=()=>document.documentElement.dataset.motion!=='reduced'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Build the leaf for direction dir (+1 next, -1 previous). Returns a controller or null. */
function makeLeaf(ctx,dir){const sp=ctx.stage.querySelector('.spread');if(!sp)return null;
  const[W,H]=ctx.dims,n=ctx.pages.length,idx=ctx.idx,dbl=idx.length>1,step=dbl?2:1,target=dir>0?idx[0]+step:idx[0]-step;
  if(target<0||target>n-1)return null;
  const slots=[...sp.querySelectorAll(':scope > .page')],P=ctx.pages;let front,back,origin='left',left=PAD,start=0,end=180,under=null,underHTML='';
  if(dbl&&dir>0){left=PAD+W;front=staticPage(P[idx[1]],idx[1],W,H,'r');back=staticPage(P[target],target,W,H,'l');under=slots[1];underHTML=staticPage(P[target+1],target+1,W,H,'r')}
  else if(dbl){origin='right';front=staticPage(P[idx[0]],idx[0],W,H,'l');back=staticPage(P[target+1],target+1,W,H,'r');under=slots[0];underHTML=staticPage(P[target],target,W,H,'l')}
  else if(dir>0){front=staticPage(P[idx[0]],idx[0],W,H,'solo');back='<div class="page solo blankleaf"></div>';under=slots[0];underHTML=staticPage(P[target],target,W,H,'solo')}
  else{front=staticPage(P[target],target,W,H,'solo');back='<div class="page solo blankleaf"></div>';start=180;end=0}
  if(under)under.outerHTML=underHTML;
  sp.querySelectorAll('.ribbon,.tz').forEach(x=>x.style.visibility='hidden');
  const leaf=document.createElement('div');leaf.className='leaf';leaf.style.cssText=`left:${left}px;top:${PAD}px;width:${W}px;height:${H}px;transform-origin:${origin} center`;
  leaf.innerHTML=`<div class="lf front">${front}<i class="lsh"></i></div><div class="lf back">${back}<i class="lsh"></i></div>`;
  const cast=document.createElement('i');cast.className='cast';cast.style.cssText=`top:${PAD}px;height:${H}px;width:${W}px;left:${dbl?(origin==='left'?PAD+W:PAD):PAD}px;background:linear-gradient(${origin==='left'?90:270}deg,rgba(0,0,0,.45),rgba(0,0,0,0) 55%)`;
  sp.append(cast,leaf);sp.classList.add('turning');
  const sign=origin==='left'?-1:1;
  const set=th=>{th=clamp(th,0,180);const sn=Math.sin(th*Math.PI/180);
    leaf.style.transform=`rotateY(${sign*th}deg)`;leaf.style.setProperty('--sh',(sn*.38).toFixed(3));leaf.style.setProperty('--edge',(th/180).toFixed(3));
    cast.style.opacity=(dbl?(th<90?sn*.55:0):sn*.35).toFixed(3);ctl.th=th};
  const ctl={th:start,start,end,target,set,leaf,
    finish(commit,ms){TURN.busy=true;const goal=commit?end:start,dur=ms??clamp(Math.abs(goal-ctl.th)*3.4,140,620);
      leaf.style.transition=`transform ${dur}ms cubic-bezier(.25,.7,.3,1)`;cast.style.transition=`opacity ${dur}ms`;set(goal);
      setTimeout(()=>{TURN.busy=false;if(commit)ctx.go(target);else ctx.go(idx[0])},dur+20)}};
  set(start);return ctl}

/* angle for pointer x: the free edge of the leaf follows the pointer */
function angleAt(ctx,x){const sp=ctx.stage.querySelector('.spread'),r=sp.getBoundingClientRect(),s=r.width/sp.offsetWidth,[W]=ctx.dims,dbl=ctx.idx.length>1;
  const spine=r.left+(dbl?PAD+W:PAD)*s,k=clamp((x-spine)/(W*s),-1,1);return Math.acos(k)*180/Math.PI}
function dragTurn(ctx,dir,ev){const c=makeLeaf(ctx,dir);if(!c){bounce(ctx,dir);return}
  const inv=ctx.idx.length>1&&dir<0,a0=angleAt(ctx,ev.clientX);let lastX=ev.clientX,lastT=performance.now(),vx=0;
  const mv=m=>{const d=angleAt(ctx,m.clientX)-a0;c.set(c.start+(inv?-d:d));const now=performance.now();vx=(m.clientX-lastX)/Math.max(1,now-lastT);lastX=m.clientX;lastT=now};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);
    const prog=Math.abs(c.th-c.start)/180,flick=(dir>0?vx<-.35:vx>.35)&&prog>.04;c.finish(prog>.5||flick)};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)}
function autoTurn(dir){const ctx=turnCtx();if(!ctx||TURN.busy)return false;if(!motionOn()){const n=ctx.pages.length,step=ctx.idx.length>1?2:1,t=ctx.idx[0]+dir*step;if(t>=0&&t<=n-1){ctx.go(t);return true}return false}
  const c=makeLeaf(ctx,dir);if(!c){bounce(ctx,dir);return false}requestAnimationFrame(()=>c.finish(true,640));return true}
function bounce(ctx,dir){const sp=ctx.stage.querySelector('.spread');if(!sp||!motionOn())return;sp.classList.remove('nudgeL','nudgeR');void sp.offsetWidth;sp.classList.add(dir>0?'nudgeR':'nudgeL')}

/* one capture-phase listener decides between "turn the page" and normal editing */
function turnPointerDown(ev){if(ev.button>0||TURN.busy)return;const ctx=turnCtx();if(!ctx)return;
  if(ctx.stage===$('#stage')&&(ED.draw||ED.lasso))return;if(ev.target.closest('.hd,.ctx,.sheet,.gbox,button,input,textarea,select'))return;
  const tz=ev.target.closest('.tz'),pageEl=ev.target.closest('.page'),onEl=ev.target.closest('.el');
  if(tz){ev.preventDefault();ev.stopPropagation();dragTurn(ctx,+tz.dataset.dir,ev);return}
  const readOnly=ctx.stage.id==='shareStage';
  if(pageEl&&!readOnly&&(onEl||ev.pointerType!=='touch'))return; // editing as usual
  ev.stopPropagation();const x0=ev.clientX,y0=ev.clientY;let decided=false;
  const mv=m=>{if(decided)return;const dx=m.clientX-x0,dy=m.clientY-y0;if(Math.hypot(dx,dy)<10)return;decided=true;cleanup();
    if(Math.abs(dx)>Math.abs(dy)*1.2)dragTurn(ctx,dx<0?1:-1,{clientX:x0})};
  const up=()=>{cleanup();if(!decided&&!readOnly){if(pageEl){const pi=+pageEl.dataset.pi;if(ED.a.pages[pi]){ED.activeSurf=pageEl;ED.activeArr=ED.a.pages[pi].elements}}deselect()}};
  const cleanup=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up)};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)}
$('#stage').addEventListener('pointerdown',turnPointerDown,true);
$('#shareStage').addEventListener('pointerdown',turnPointerDown,true);

/* edge strips with a grab cursor and the folded corner hint */
function turnZones(n,idx,W,H){const dbl=idx.length>1,last=idx[idx.length-1],x=PAD+W*idx.length;
  return `${idx[0]>0?`<i class="tz l" data-dir="-1" style="left:0;top:${PAD}px;height:${H}px" title="Arrastra para volver"></i>`:''}${last<n-1?`<i class="tz r" data-dir="1" style="left:${x-24}px;top:${PAD}px;height:${H}px" title="Arrastra para pasar la página"></i>`:''}`}
function ribbonHTML(a,W,H,dbl){const c=a.cover.ribbon;if(c==='none')return'';const col=c||'#b5646d';
  return `<i class="ribbon" style="left:${PAD+(dbl?W:0)+22}px;top:${PAD-6}px;height:${H+40}px;--rb:${col}"></i>`}
function stackEdges(n,idx){const before=idx[0],after=n-1-idx[idx.length-1],w=v=>clamp(Math.round(v*.7),0,7);
  return `${before?`<i class="stk l" style="width:${w(before)+1}px"></i>`:''}${after?`<i class="stk r" style="width:${w(after)+1}px"></i>`:''}`}
