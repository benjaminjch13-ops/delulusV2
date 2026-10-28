
/* ================= closed notebook as a real 3D object =================
   Six faces in CSS 3D: front cover (the editable design), back, spine, and the page block
   on the three open sides. The elastic wraps over the top, bottom and back too. */
const depthOf=a=>Math.round(clamp(30+a.pages.length*2.4,34,72));
function bandFill(e,horiz){const c=e.color;const g=e.style==='plano'?`linear-gradient(${horiz?180:90}deg,${shade(c,-.25)},${c} 20%,${c} 80%,${shade(c,-.25)})`
  :e.style==='trenzado'?`repeating-linear-gradient(35deg,${shade(c,.15)} 0 3px,${shade(c,-.25)} 3px 6px)`:`linear-gradient(${horiz?180:90}deg,${shade(c,-.45)},${shade(c,.25)} 45%,${c} 60%,${shade(c,-.45)})`;return g}
function leatherFace(c,extra=''){return `<div class="tex" style="background:${texVar(c.texture||'liso')};mix-blend-mode:overlay;opacity:${c.texture==='liso'?.5:.85}"></div><div class="pat" style="background:${(PATTERNS[c.pattern]||PATTERNS.none)()}"></div>${extra}`}
function book3D(a,width,o={}){const[W,H]=dims(a),s=width/W,D=depthOf(a),c=a.cover,e=c.elastic,t=e.width||9,vert=e.orient!=='horizontal',pos=e.pos??(vert?.84:.6);
  const ry=o.ry??-26,rx=o.rx??8,spineTitle=(c.elements||[]).find(x=>x.type==='text');
  const strip=(x,y,w,h)=>`<i class="b3band" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bandFill(e,!vert)}"></i>`;
  const bx=W*pos-t/2,by=H*pos-t/2;
  return `<div class="b3wrap" style="width:${width}px;height:${H*s}px;${o.style||''}" ${o.attrs||''}>
   <div class="b3shadow" style="width:${W*s*.92}px"></div>
   <div class="b3" style="width:${W}px;height:${H}px;margin:${-H/2}px 0 0 ${-W/2}px;--d:${D}px;--s:${s};--rx:${rx}deg;--ry:${ry}deg">
    <div class="b3f book" style="width:${W}px;height:${H}px;transform:translateZ(${D/2}px)">${coverFace(a,W,H)}${bandHTML(a,W,H)}${charmsHTML(a,W,H)}</div>
    <div class="b3b" style="width:${W}px;height:${H}px;background:${c.color};transform:rotateY(180deg) translateZ(${D/2}px)">${leatherFace(c,'<div class="stitch"></div>')}${vert?strip(W*(1-pos)-t/2,-2,t,H+4):strip(-2,by,W+4,t)}</div>
    <div class="b3s" style="width:${D}px;height:${H}px;left:${(W-D)/2}px;background:${c.color};transform:rotateY(-90deg) translateZ(${W/2}px)">${leatherFace(c)}${spineTitle?`<span class="b3t" style="font-family:${spineTitle.font||'serif'}">${esc(spineTitle.text.split('\n')[0])}</span>`:''}${vert?'':strip(-2,by,D+4,t)}</div>
    <div class="b3p r" style="width:${D-4}px;height:${H-8}px;left:${(W-D)/2+2}px;top:4px;transform:rotateY(90deg) translateZ(${W/2-4}px)">${vert?'':strip(-2,by-4,D,t)}</div>
    <div class="b3p t" style="width:${W-10}px;height:${D-4}px;left:6px;top:${(H-D)/2+2}px;transform:rotateX(90deg) translateZ(${H/2-4}px)">${vert?strip(bx-6,-2,t,D):''}</div>
    <div class="b3p b" style="width:${W-10}px;height:${D-4}px;left:6px;top:${(H-D)/2+2}px;transform:rotateX(-90deg) translateZ(${H/2-4}px)">${vert?strip(bx-6,-2,t,D):''}</div>
   </div></div>`}
