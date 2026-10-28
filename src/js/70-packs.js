
/* ================= themed stickers, handwriting fonts and template packs ================= */
STICKERS.push(
 {id:'maple',n:'Hoja de maple',c:'otoño botánico',col:'#d0813f',s:c=>`<path d="M50 70v24" stroke="${shade(c,-.35)}" stroke-width="4" stroke-linecap="round"/><path ${W} fill="${c}" d="M50 6l7 16 12-7-3 17 17-3-7 12 15 8-17 6 5 12-17-4-3 13-9-10-9 10-3-13-17 4 5-12-17-6 15-8-7-12 17 3-3-17 12 7z"/><path d="M50 22v48M50 50l16-14M50 50L34 36" stroke="${shade(c,-.3)}" stroke-width="2" fill="none"/>`},
 {id:'acorn',n:'Bellota',c:'otoño',col:'#b07a4a',s:c=>`<path ${W} fill="${c}" d="M24 44h52c0 26-12 44-26 48-14-4-26-22-26-48z"/><path ${W} fill="${shade(c,-.35)}" d="M18 44c0-14 14-24 32-24s32 10 32 24z"/><path d="M50 20c0-8 4-12 10-14" stroke="${shade(c,-.45)}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 36l8-8M44 36l8-10M58 36l8-8" stroke="rgba(255,255,255,.25)" stroke-width="2"/>`},
 {id:'mushroom',n:'Hongo',c:'otoño botánico kawaii',col:'#c9584f',s:c=>`<path ${W} fill="#f3e6d3" d="M38 52h24l4 36H34z"/><path ${W} fill="${c}" d="M8 54C8 28 28 12 50 12s42 16 42 42z"/><g fill="#fff"><circle cx="30" cy="34" r="6"/><circle cx="56" cy="24" r="5"/><circle cx="72" cy="42" r="6"/><circle cx="46" cy="44" r="4"/></g>`},
 {id:'pumpkin',n:'Calabaza',c:'otoño',col:'#e08a3c',s:c=>`<path d="M50 26c0-8 4-14 12-16" stroke="#6f7d4c" stroke-width="5" fill="none" stroke-linecap="round"/><g ${W} fill="${c}"><ellipse cx="34" cy="58" rx="22" ry="30"/><ellipse cx="66" cy="58" rx="22" ry="30"/></g><ellipse cx="34" cy="58" rx="22" ry="30" fill="${c}"/><ellipse cx="66" cy="58" rx="22" ry="30" fill="${c}"/><ellipse cx="50" cy="58" rx="20" ry="32" fill="${shade(c,.12)}"/><path d="M50 28v60" stroke="${shade(c,-.2)}" stroke-width="2"/>`},
 {id:'snowflake',n:'Copo de nieve',c:'invierno minimal',col:'#9fbcd4',s:c=>`<g stroke="#fff" stroke-width="9" stroke-linecap="round">${Array.from({length:6},(_,i)=>`<path d="M50 50V10M50 24l-10-8M50 24l10-8" transform="rotate(${i*60} 50 50)"/>`).join('')}</g><g stroke="${c}" stroke-width="4.5" stroke-linecap="round" fill="none">${Array.from({length:6},(_,i)=>`<path d="M50 50V10M50 24l-10-8M50 24l10-8" transform="rotate(${i*60} 50 50)"/>`).join('')}</g>`},
 {id:'pine',n:'Pino',c:'invierno botánico',col:'#5f7f5c',s:c=>`<rect x="44" y="76" width="12" height="16" fill="#8a5a3c"/><path ${W} fill="${c}" d="M50 6l20 26H58l20 24H62l22 22H16l22-22H22l20-24H30z"/><g fill="#f3e6b0"><circle cx="40" cy="44" r="3"/><circle cx="60" cy="58" r="3"/><circle cx="44" cy="68" r="3"/></g>`},
 {id:'gift',n:'Regalo',c:'invierno romántico',col:'#c66b6b',s:c=>`<path ${W} fill="${c}" d="M14 40h72v48H14z"/><rect x="10" y="30" width="80" height="14" rx="2" fill="${shade(c,-.15)}"/><rect x="45" y="30" width="10" height="58" fill="#f3d27a"/><path d="M50 30c-8-18-30-16-22-4 4 5 14 4 22 4zM50 30c8-18 30-16 22-4-4 5-14 4-22 4z" fill="#f3d27a"/>`},
 {id:'book',n:'Libro abierto',c:'lectura estudio vintage',col:'#8e6b9e',s:c=>`<path ${W} fill="${c}" d="M6 30c16-6 30-6 44 4 14-10 28-10 44-4v52c-16-6-30-6-44 4-14-10-28-10-44-4z"/><path d="M12 34c12-4 26-4 36 4v42c-10-7-24-8-36-4zM88 34c-12-4-26-4-36 4v42c10-7 24-8 36-4z" fill="#fbf4e8"/><path d="M18 46h22M18 54h22M18 62h18M60 46h22M60 54h22M60 62h18" stroke="#cdbfae" stroke-width="2"/>`},
 {id:'pencil',n:'Lápiz',c:'estudio',col:'#efc15a',s:c=>`<g transform="rotate(-40 50 50)"><path ${W} fill="${c}" d="M20 40h56v20H20z"/><path d="M76 40l18 10-18 10z" fill="#f2d7b5"/><path d="M88 46.5l6 3.5-6 3.5z" fill="#3b2d26"/><rect x="8" y="40" width="12" height="20" rx="3" fill="#e9a3a8"/><rect x="18" y="40" width="5" height="20" fill="#b9b9b9"/><path d="M24 47h52" stroke="${shade(c,-.2)}" stroke-width="2"/></g>`},
 {id:'plane',n:'Avión de papel',c:'viajes minimal',col:'#9fb7d4',s:c=>`<path ${W} fill="#fff" d="M8 48L92 14 70 86 50 62z"/><path d="M8 48L92 14 50 62z" fill="${c}"/><path d="M50 62l42-48-30 58z" fill="${shade(c,-.15)}"/><path d="M14 74q14 2 22-10" stroke="${c}" stroke-width="2.5" stroke-dasharray="4 4" fill="none"/>`},
 {id:'camera',n:'Cámara',c:'viajes vintage',col:'#7d7470',s:c=>`<path ${W} fill="${c}" d="M10 32h20l6-10h28l6 10h20v52H10z"/><circle cx="50" cy="56" r="18" fill="#f3ece0"/><circle cx="50" cy="56" r="12" fill="#4a4a52"/><circle cx="45" cy="51" r="4" fill="#fff" opacity=".6"/><rect x="72" y="38" width="10" height="6" rx="1" fill="#f3d27a"/>`},
 {id:'wave',n:'Ola',c:'verano',col:'#6fa3c1',s:c=>`<path ${W} fill="${c}" d="M6 70c14-30 40-48 66-40-16 2-24 14-14 24 8 8 22 4 30-6 2 18-8 36-30 40H6z"/><path d="M6 86c14-6 28-6 42 0s28 6 46 0" stroke="#fff" stroke-width="4" fill="none"/>`},
 {id:'icecream',n:'Helado',c:'verano kawaii',col:'#f0a6b5',s:c=>`<path ${W} fill="#e1b47a" d="M30 48h40L50 94z"/><path d="M34 52l28 0M38 62h24M42 72h16" stroke="#c4904f" stroke-width="2"/><circle ${W} cx="50" cy="36" r="22" fill="${c}"/><circle cx="50" cy="36" r="22" fill="${c}"/><circle cx="50" cy="12" r="5" fill="#d9555f"/><g fill="#fff"><rect x="40" y="28" width="5" height="2" rx="1"/><rect x="56" y="36" width="5" height="2" rx="1"/></g>`},
 {id:'lemon',n:'Limón',c:'verano botánico',col:'#f2d25c',s:c=>`<circle ${W} cx="50" cy="50" r="40" fill="${c}"/><circle cx="50" cy="50" r="33" fill="#fbf1b8"/><g stroke="${c}" stroke-width="3">${Array.from({length:8},(_,i)=>`<path d="M50 50V19" transform="rotate(${i*45} 50 50)"/>`).join('')}</g>`},
 {id:'lotus',n:'Loto',c:'bienestar botánico',col:'#d9a1c4',s:c=>`<g ${W} fill="${c}"><path d="M50 22c12 14 12 36 0 52-12-16-12-38 0-52z"/><path d="M50 74C34 70 22 56 20 38c16 4 28 18 30 36z"/><path d="M50 74c16-4 28-18 30-36-16 4-28 18-30 36z"/></g><path d="M50 22c12 14 12 36 0 52-12-16-12-38 0-52z" fill="${shade(c,.15)}"/><path d="M14 80q36 10 72 0" stroke="#8fae7f" stroke-width="4" fill="none" stroke-linecap="round"/>`},
 {id:'drop',n:'Gota',c:'bienestar minimal',col:'#8fbcd8',s:c=>`<path ${W} fill="${c}" d="M50 8C66 32 78 48 78 64a28 28 0 0 1-56 0C22 48 34 32 50 8z"/><path d="M36 62a14 14 0 0 0 10 14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`}
);
FONTS.push(['Gochi','"Gochi Hand", cursive'],['Patrick','"Patrick Hand", cursive'],['Kalam','Kalam, cursive'],['Sombras','"Shadows Into Light", cursive'],['Lápiz','"Reenie Beanie", cursive'],['Caligrafía','"Dancing Script", cursive'],['Cuaderno','"Indie Flower", cursive'],['Firma','Sacramento, cursive'],['Pincel','"Nanum Pen Script", cursive']);
const HAND_FONTS=FONTS.filter(f=>/Caveat|Amatic|Homemade|Gochi|Patrick|Kalam|Shadows|Reenie|Dancing|Indie|Sacramento|Nanum/.test(f[1]));

const F={dance:'"Dancing Script", cursive',patrick:'"Patrick Hand", cursive',gochi:'"Gochi Hand", cursive',kalam:'Kalam, cursive',reenie:'"Reenie Beanie", cursive',sacra:'Sacramento, cursive',indie:'"Indie Flower", cursive',type:'"Special Elite", monospace',serif:'"Young Serif", serif',play:'"Playfair Display", serif',amatic:'"Amatic SC", cursive'};
const tl=(text,W,o={})=>T(text,40,36,W-80,70,{fs:44,...o});
const PACKS=[
 {id:'otono',n:'Otoño',st:['maple','acorn','mushroom','pumpkin','leaf','cup'],pages:[
  ['Lista de otoño',(W,H)=>({bg:'dots',bgc:'#fbf4ea',els:[tl('Lista de otoño',W,{font:F.dance,color:'#9c4f2e'}),ST('maple',W-130,30,90,{r:15}),
    T('[ ] Tomar un café de canela\n[ ] Leer bajo una cobija\n[ ] Hornear pan de banano\n[ ] Caminar entre hojas secas\n[ ] Escribir una carta a mano',50,128,W-100,260,{fs:26,font:F.patrick}),
    PP('torn',W*.3,H*.55,W*.62,190,{r:-3,color:'#f3e3cc'}),TP(W*.48,H*.55-14,120,4,{color:'#e3b05c',pat:'diag'}),T('Lo que más me gusta de esta estación:',W*.34,H*.55+24,W*.54,140,{fs:22,font:F.gochi,color:'#7a4a32'}),
    ST('mushroom',46,H-190,96,{r:-6}),ST('acorn',W-120,H-150,72,{r:12})]})],
  ['Hojas que caen',(W,H)=>({bg:'vintage',els:[PP('polaroid',46,56,W*.48,W*.58,{r:-6,color:'#d9b48f'}),TP(90,44,130,-12,{color:'#c9d6bd'}),
    T('Hoy…',W*.58,70,W*.36,60,{font:F.reenie,fs:52}),PP('lined',W*.56,140,W*.38,260,{r:3}),ST('maple',W*.42,H*.5,70,{r:-20,color:'#e3b05c'}),ST('leaf',W*.78,H*.52,60,{r:40,color:'#c7793f'}),
    NT('Gratitud de hoy:\n',46,H-280,210,{bgc:'#f3dcc0',r:-3,font:F.gochi}),T('Canción del día:',W*.52,H-210,W*.42,40,{font:F.patrick,fs:24}),ST('pumpkin',W-150,H-150,100,{r:6})]})]]},
 {id:'invierno',n:'Invierno',st:['snowflake','pine','gift','cup','star','moon'],pages:[
  ['Mi diciembre',(W,H)=>({bg:'plain',bgc:'#f3f5f7',els:[tl('Mi diciembre',W,{font:F.sacra,fs:64,color:'#3f5f7a',h:80}),ST('snowflake',W-120,40,60),ST('snowflake',W-170,96,34,{r:20}),
    T('Planes\n[ ] Cena con amigas\n[ ] Intercambio de regalos\n[ ] Película navideña\n[ ] Galletas de jengibre',50,150,W*.52,230,{fs:25,font:F.patrick}),ST('pine',W*.6,150,170),
    NT('Lista de regalos\n',50,H*.56,210,{bgc:'#d6e3ea',r:-2,font:F.gochi}),ST('gift',W*.56,H*.6,100,{r:-6}),TP(70,H*.56-12,110,-8,{color:'#bcd1de',pat:'dots'}),ST('snowflake',W-110,H-120,50,{r:12})]})],
  ['Metas del año nuevo',(W,H)=>({bg:'grid',els:[tl('Metas para el nuevo año',W,{font:F.dance,fs:40,color:'#3f5f7a'}),ST('sparkle',W-110,40,50,{color:'#e3b75c'}),
    T('1.\n\n2.\n\n3.\n\n4.',50,130,W-100,300,{fs:28,font:F.kalam}),PP('torn',50,H*.62,W-100,170,{r:-1,color:'#fffdf6'}),T('Mi palabra del año:',74,H*.62+26,W-150,40,{fs:22,font:F.type}),
    T('_______________',74,H*.62+76,W-150,60,{fs:36,font:F.sacra,color:'#6c5e91'}),ST('star',W-120,H-140,70,{r:12})]})]]},
 {id:'primavera',n:'Primavera',st:['tulip','daisy','butterfly','flower','sprig','bow'],pages:[
  ['Jardín de ideas',(W,H)=>({bg:'lines',bgc:'#f8f3f5',els:[tl('Jardín de ideas',W,{font:F.dance,color:'#b5646d'}),ST('tulip',W-120,30,86,{r:8}),
    NT('Quiero aprender…',46,140,190,{bgc:'#f3c8cc',r:-4,font:F.gochi}),NT('Quiero visitar…',W-240,180,190,{bgc:'#cfe0c4',r:3,font:F.gochi}),NT('Quiero crear…',W/2-100,H*.52,200,{bgc:'#d9d0ec',r:-2,font:F.gochi}),
    ST('butterfly',W*.42,120,70,{r:-10}),ST('daisy',50,H-160,90),ST('sprig',W-150,H-180,120,{r:-20})]})],
  ['Hábitos de primavera',(W,H)=>({bg:'grid',els:[tl('Hábitos',W,{font:F.amatic,fs:56,color:'#6f8566'}),ST('flower',W-110,36,70),
    T('              L M M J V S D\nAgua          ○ ○ ○ ○ ○ ○ ○\nLeer          ○ ○ ○ ○ ○ ○ ○\nMoverme       ○ ○ ○ ○ ○ ○ ○\nDormir 8 h    ○ ○ ○ ○ ○ ○ ○\nSin pantallas ○ ○ ○ ○ ○ ○ ○',40,130,W-80,240,{fs:18,font:F.type}),
    T('Cómo me sentí esta semana:',44,H*.58,W-88,40,{fs:24,font:F.patrick}),PP('lined',44,H*.58+46,W-88,170,{r:0}),ST('sprig',W-140,H-120,100,{r:-30})]})]]},
 {id:'verano',n:'Verano',st:['sun','wave','icecream','lemon','rainbow','camera'],pages:[
  ['Días de playa',(W,H)=>({bg:'plain',bgc:'#fbf6ec',els:[tl('días de playa',W,{font:F.kalam,fs:46,color:'#3f7a96'}),ST('sun',W-120,26,90),
    PP('polaroid',44,130,W*.46,W*.55,{r:-5,color:'#bcd1de'}),PP('polaroid',W*.47,170,W*.46,W*.55,{r:4,color:'#f0dcae'}),TP(80,120,110,-10,{color:'#f0dcae',pat:'stripes'}),TP(W*.6,160,110,8,{color:'#bcd1de',pat:'dots'}),
    T('Lo mejor del día:',50,H*.7,W-100,40,{fs:26,font:F.patrick}),ST('wave',W-140,H-150,110),ST('icecream',40,H-130,80,{r:-10})]})],
  ['Lista de verano',(W,H)=>({bg:'dots',els:[tl('Verano por hacer',W,{font:F.dance,color:'#d9822b'}),ST('lemon',W-110,30,70),
    T('[ ] Ver un atardecer completo\n[ ] Picnic con amigas\n[ ] Nadar en un lago\n[ ] Probar un helado nuevo\n[ ] Leer un libro en un día\n[ ] Dormir bajo las estrellas',50,130,W-100,300,{fs:26,font:F.patrick}),
    ST('rainbow',W/2-60,H-210,120),ST('icecream',W-130,H-150,90,{r:10})]})]]},
 {id:'lectura',n:'Lectura',st:['book','cup','stamp','pencil','moon','bow'],pages:[
  ['Reseña de libro',(W,H)=>({bg:'lines',els:[tl('Reseña',W,{font:F.play,it:true,fs:42}),PP('polaroid',W-230,40,180,220,{r:4,color:'#e6dccb'}),T('Portada',W-200,190,120,30,{fs:18,font:F.gochi,color:'#8a7366',al:'center'}),
    T('Título:\nAutora:\nEmpecé:\nTerminé:\nCalificación: ☆ ☆ ☆ ☆ ☆',44,120,W-300,200,{fs:24,font:F.patrick}),
    NT('Cita favorita\n',44,H*.45,220,{bgc:'#e6e0f0',r:-3,font:F.gochi}),T('Lo que pensé…',W*.5,H*.45,W*.45,40,{fs:26,font:F.reenie}),ST('book',W*.62,H-150,110,{r:-6})]})],
  ['Club de lectura',(W,H)=>({bg:'dots',els:[tl('Club de lectura',W,{font:F.dance}),ST('cup',W-120,30,80),
    T('Fecha:\nLibro:\nCasa de:\nQuién lleva botana:',44,120,W-88,160,{fs:24,font:F.patrick}),PP('torn',36,H*.42,W-72,220,{r:-1,color:'#fffdf6'}),
    T('Preguntas para comentar\n1.\n2.\n3.',60,H*.42+20,W-120,190,{fs:22,font:F.kalam}),T('Próximo libro:',44,H-130,W-150,40,{fs:24,font:F.patrick}),ST('book',W-140,H-150,100,{r:8})]})],
  ['Libros del año',(W,H)=>{const cs=['#c4878c','#97a88c','#ad9fc6','#e3b75c','#7d9ab3','#c7793f','#d9a1c4','#8e6b9e'],els=[tl('Mi estantería del año',W,{font:F.amatic,fs:50})];
    for(let r=0;r<2;r++){const y=140+r*(H*.38);els.push(PP('kraft',30,y+H*.3,W-60,14,{color:'#9a6a46'}));for(let i=0;i<8;i++){const w=(W-80)/8-6;els.push(PP('note',40+i*(w+6),y+(i%3)*10,w,H*.3-(i%3)*10,{color:cs[(i+r*3)%8]}))}}
    els.push(T('Escribe cada título en su lomo con un texto vertical',40,H-60,W-80,30,{fs:16,font:F.patrick,color:'#8a7366'}));return{bg:'plain',bgc:'#f7f1e7',els}}]]},
 {id:'bienestar',n:'Bienestar',st:['lotus','drop','happy','sleepy','love','sparkle'],pages:[
  ['Check-in emocional',(W,H)=>({bg:'plain',bgc:'#f6f3f8',els:[tl('¿Cómo estoy hoy?',W,{font:F.dance,color:'#6c5e91'}),
    ST('happy',50,120,72),ST('love',140,120,72),ST('sleepy',230,120,72),ST('cloud',320,126,72),T('Rodea con un círculo cómo te sientes',50,200,W-100,30,{fs:18,font:F.patrick,color:'#8a7366'}),
    T('Lo que pasó:',50,250,W-100,40,{fs:24,font:F.kalam}),PP('lined',50,292,W-100,160,{r:0}),T('Lo que necesito:',50,H*.64,W-100,40,{fs:24,font:F.kalam}),NT('Un gesto amable conmigo:\n',W-250,H-260,200,{bgc:'#e6e0f0',r:3,font:F.gochi}),ST('lotus',50,H-170,120)]})],
  ['Rutina de autocuidado',(W,H)=>({bg:'dots',els:[tl('Autocuidado',W,{font:F.sacra,fs:60,color:'#b5646d'}),
    T('Mañana\n[ ] Vaso de agua\n[ ] Estirarme 5 min\n[ ] Escribir 3 intenciones',50,130,W/2-60,200,{fs:22,font:F.patrick}),T('Noche\n[ ] Apagar pantallas\n[ ] Té caliente\n[ ] Leer 20 páginas',W/2+10,130,W/2-60,200,{fs:22,font:F.patrick}),
    ST('drop',W/2-30,140,50),PP('torn',50,H*.5,W-100,170,{r:-2,color:'#fffdf6'}),T('Hoy me cuidé cuando…',74,H*.5+26,W-150,120,{fs:22,font:F.gochi}),ST('lotus',W-150,H-150,110),ST('sparkle',60,H-110,50,{color:'#e3b75c'})]})]]},
 {id:'estudio',n:'Estudio',st:['pencil','book','star','pin','cup','sparkle'],pages:[
  ['Notas Cornell',(W,H)=>({bg:'lines',els:[T('Tema:',40,30,W-80,46,{fs:28,font:F.kalam}),T('Fecha:',W-200,34,160,40,{fs:20,font:F.patrick,color:'#8a7366'}),
    PP('note',W*.3,90,3,H*.66,{color:'#e6a3a8'}),PP('note',30,90+H*.66,W-60,3,{color:'#e6a3a8'}),
    T('Ideas clave\ny preguntas',40,100,W*.3-56,80,{fs:20,font:F.patrick,color:'#8a7366'}),T('Notas de clase',W*.3+16,100,W*.6,40,{fs:20,font:F.patrick,color:'#8a7366'}),
    T('Resumen',40,H*.66+104,W-80,40,{fs:22,font:F.patrick,color:'#8a7366'}),ST('pencil',W-110,H-110,80)]})],
  ['Plan de estudio',(W,H)=>({bg:'grid',els:[tl('Semana de estudio',W,{font:'Figtree, sans-serif',b:true,fs:30}),
    ...['Lunes','Martes','Miércoles','Jueves','Viernes'].map((d,i)=>T(`${d}\n[ ] `,40,110+i*((H-300)/5),W*.62,(H-300)/5-8,{fs:20,font:F.patrick,bg:'cinta',bgc:['#f3dfe1','#e3ead9','#e6e0f0','#f3e7c9','#dbe7ee'][i]})),
    NT('Exámenes\n',W*.7,110,W*.26,{bgc:'#f3c8cc',r:3,font:F.gochi,fs:18}),NT('Entregas\n',W*.7,120+W*.28,W*.26,{bgc:'#cfe2ec',r:-3,font:F.gochi,fs:18}),
    T('Recompensa al terminar:',40,H-150,W-80,40,{fs:22,font:F.kalam}),ST('star',W-120,H-140,70,{color:'#e3b75c'})]})]]},
 {id:'viajes',n:'Viajes',st:['plane','camera','ticket','postmark','pin','stamp'],pages:[
  ['Itinerario',(W,H)=>({bg:'plain',bgc:'#f7f2e8',els:[T('Destino:',40,30,W-160,60,{font:F.amatic,fs:50}),ST('plane',W-130,24,96,{r:-8}),
    ...[0,1,2].map(i=>T(`Día ${i+1}\nMañana:\nTarde:\nNoche:`,40,120+i*((H-220)/3),W*.6,(H-220)/3-10,{fs:20,font:F.patrick,bg:'papel'})),
    ST('pin',W*.7,140,60,{color:'#c97e6d'}),NT('No olvidar\n[ ] Pasaporte\n[ ] Cargador',W*.66,230,W*.3,{bgc:'#f0dcae',r:4,font:F.gochi,fs:18}),ST('ticket',W*.64,H*.62,150,{r:8})]})],
  ['Recuerdos del viaje',(W,H)=>({bg:'kraft',els:[PP('polaroid',36,40,W*.5,W*.6,{r:-5,color:'#d9c9b4'}),PP('polaroid',W*.48,90,W*.46,W*.55,{r:6,color:'#bcd1de'}),TP(70,30,130,-10,{color:'#f0dcae'}),
    ST('postmark',W*.5,H*.54,140,{color:'#6f5a7e'}),ST('stamp',40,H*.56,110,{r:-6}),PP('torn',40,H*.72,W-80,170,{r:-1,color:'#fffdf6'}),T('Un momento que no quiero olvidar:',64,H*.72+24,W-130,120,{fs:22,font:F.gochi}),ST('camera',W-140,H*.5,90,{r:10})]})]]}
];
const BASICS=TEMPLATES.filter(t=>t[0]!=='blank');
const tplNames=pk=>pk==='basicas'?BASICS.map(t=>t[1]):PACKS.find(p=>p.id===pk).pages.map(p=>p[0]);
function packPage(pk,i,W,H){if(pk==='basicas'){const p=templatePages(BASICS[i][0],ED.a?.pageBg||'lines',W,H)[0];p.id=uid();return p}
  const t=PACKS.find(p=>p.id===pk).pages[i][1](W,H);const p=pg(t.bg,t.els);if(t.bgc)p.bg.color=t.bgc;return p}
function insertTemplatePage(pk,i){const a=ED.a,[W,H]=dims(a),p=packPage(pk,i,W,H),at=activePageIndex()+1;a.pages.splice(at,0,p);V.cur=at;ED.activeArr=p.elements;ED.sel=null;commit();renderStage();refreshThumbs();renderLib();
  toast(`Página “${tplNames(pk)[i]}” agregada`);if(innerWidth<=820)$('#lib').classList.remove('openp')}
const typeLabel=t=>t?.startsWith('pack:')?'Paquete '+(PACKS.find(p=>'pack:'+p.id===t)?.n||''):(TEMPLATES.find(x=>x[0]===t)||['','En blanco'])[1];
let curPack='basicas';
function packItems(){const a=ED.a,[W,H]=dims(a),pk={st:curPack==='basicas'?['star','heart','flower','sparkle','leaf','cup']:PACKS.find(p=>p.id===curPack).st,pages:tplNames(curPack).map(n=>[n])},w=122,h=w*H/W;
  return `<div class="chips">${[{id:'basicas',n:'Básicas'},...PACKS].map(p=>`<button class="chip${p.id===curPack?' on':''}" data-pack="${p.id}">${p.n}</button>`).join('')}</div>
   <span class="lbl">Páginas · se agregan después de la actual</span>
   <div class="grid c2">${pk.pages.map(([n],i)=>`<button class="tpl" data-tpl="${i}" style="padding:0;border:1px solid var(--line);border-radius:10px;background:var(--panel-2);overflow:hidden;display:flex;flex-direction:column;align-items:center;gap:4px;padding-bottom:6px"><span style="position:relative;display:block;width:${w}px;height:${h}px;overflow:hidden;margin-top:6px;box-shadow:0 2px 5px rgba(0,0,0,.15)">${miniPage(packPage(curPack,i,W,H),W,H,w)}</span><span class="hint" style="color:var(--ink)">${n}</span></button>`).join('')}</div>
   <span class="lbl">Stickers del paquete</span><div class="grid">${pk.st.map(id=>STICKERS.find(s=>s.id===id)).filter(Boolean).map(stickerTile).join('')}</div>`}

/* ================= Delulu sticker sheet + Halloween ================= */
{const G=BRAND.green,P=BRAND.pink,Y=BRAND.yellow,WN=BRAND.wine,CR='#FBF7F0',BOD='Bodoni Moda, Georgia, serif',BR='Caveat Brush, cursive',SANS='Figtree, sans-serif';
 const O='stroke="#fff" stroke-width="5" stroke-linejoin="round" paint-order="stroke"';
 const tx=(x,y,t,o)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="${o.f||SANS}" font-size="${o.s||16}" fill="${o.c||G}"${o.i?' font-style="italic"':''}${o.w?` font-weight="${o.w}"`:''}${o.ls?` letter-spacing="${o.ls}"`:''}>${t}</text>`;
 const label=(id,n,t,bg,fg)=>({id,n,c:'delulu etiquetas',col:bg,vb:'0 0 150 56',s:c=>`<rect ${O} x="4" y="4" width="142" height="48" rx="12" fill="${c}"/>${tx(75,34,t,{s:15,c:fg,w:600,ls:3})}`});
 STICKERS.push(
  {id:'dl-logo',n:'Logo Delulu',c:'delulu',col:G,vb:'0 0 120 120',s:c=>`<circle ${O} cx="60" cy="60" r="56" fill="${c}"/><image href="${BRAND.logo}" x="13" y="40" width="94" height="41"/>`},
  {id:'dl-sona',n:'Soñá. Planeá. Repetí.',c:'delulu frases',col:G,vb:'0 0 160 124',s:c=>`<rect ${O} x="4" y="4" width="152" height="116" rx="14" fill="${c}"/>${tx(80,42,'Soñá.',{f:BOD,s:22,c:CR})}${tx(80,72,'Planeá.',{f:BOD,s:22,c:P,i:1})}${tx(80,102,'Repetí.',{f:BR,s:24,c:Y})}`},
  {id:'dl-solulu',n:'delulu is the solulu',c:'delulu frases',col:P,vb:'0 0 240 64',s:c=>`<path ${O} d="M4 6h232l-14 26 14 26H4l14-26z" fill="${c}"/>${tx(120,40,'delulu is the solulu',{f:BR,s:22,c:WN})}`},
  {id:'dl-hoysi',n:'hoy sí',c:'delulu frases',col:Y,vb:'0 0 140 64',s:c=>`<rect ${O} x="4" y="4" width="132" height="56" rx="28" fill="${c}"/>${tx(70,41,'hoy sí ✦',{f:BR,s:24,c:G})}`},
  {id:'dl-manifiesto',n:'Manifiesto del día',c:'delulu frases',col:'#ffffff',vb:'0 0 200 120',s:c=>`<rect ${O} x="4" y="4" width="192" height="112" rx="10" fill="${c}"/><rect x="11" y="11" width="178" height="98" rx="6" fill="none" stroke="${BRAND.gold}" stroke-width="1.2"/>${tx(100,38,'MANIFIESTO DEL DÍA',{s:8,c:WN,w:600,ls:2})}${tx(100,64,'“Si cabe en la página,',{f:BOD,s:15,c:G,i:1})}${tx(100,84,'cabe en tu vida.”',{f:BOD,s:15,c:G,i:1})}`},
  {id:'dl-manifestado',n:'¡manifestado!',c:'delulu sellos',col:WN,vb:'0 0 120 120',s:c=>`<circle ${O} cx="60" cy="60" r="56" fill="${c}"/><circle cx="60" cy="60" r="46" fill="none" stroke="${CR}" stroke-width="1.2" stroke-dasharray="3 3" opacity=".8"/>${tx(60,44,'✦ OFICIALMENTE ✦',{s:7,c:CR,w:600,ls:1.5})}${tx(60,67,'¡manifestado!',{f:BR,s:19,c:P})}${tx(60,84,'DELULU CERTIFIED',{s:6.5,c:CR,w:600,ls:1.5})}`},
  label('dl-todo','TO DO','TO DO',G,CR),label('dl-metas','METAS','METAS',P,WN),label('dl-ideas','IDEAS','IDEAS',Y,G),label('dl-ojo','¡OJO!','¡OJO!',WN,CR),
  {id:'dl-secret',n:'top secret',c:'delulu frases',col:WN,vb:'0 0 170 60',s:c=>`<path ${O} d="M30 4h108a28 28 0 0 1 0 52H30C14 56 4 44 4 30S14 4 30 4z" fill="${c}"/><circle cx="26" cy="30" r="6" fill="${CR}"/>${tx(96,39,'top secret',{f:BR,s:24,c:CR})}`},
  {id:'dl-logre',n:'¡lo logré!',c:'delulu frases',col:P,vb:'0 0 150 76',s:c=>`<rect ${O} x="6" y="8" width="138" height="60" rx="30" fill="${c}" transform="rotate(-4 75 38)"/>${tx(75,46,'¡lo logré!',{f:BR,s:27,c:WN})}`},
  {id:'dl-modo',n:'Modo delulu ON',c:'delulu frases',col:G,vb:'0 0 214 64',s:c=>`<rect ${O} x="4" y="4" width="206" height="56" rx="28" fill="${c}"/>${tx(70,37,'MODO DELULU',{s:11,c:CR,w:600,ls:2})}<rect x="132" y="12" width="70" height="40" rx="20" fill="${Y}"/>${tx(152,37,'ON',{s:11,c:G,w:700})}<circle cx="182" cy="32" r="15" fill="#fff"/>`},
  {id:'dl-reina',n:'mi reina, vos podés',c:'delulu frases',col:'#ffffff',vb:'0 0 214 60',s:c=>`<rect ${O} x="4" y="4" width="206" height="52" rx="26" fill="${c}"/><rect x="8" y="8" width="198" height="44" rx="22" fill="none" stroke="${G}" stroke-width="2"/>${tx(107,38,'mi reina ✦ vos podés',{f:BR,s:21,c:G})}`},
  {id:'dl-hecho',n:'Hecho a mano',c:'delulu etiquetas',col:Y,vb:'0 0 190 52',s:c=>`<rect ${O} x="4" y="4" width="182" height="44" rx="10" fill="${c}"/>${tx(95,31,'HECHO A MANO ✦',{s:12,c:WN,w:600,ls:2.5})}`},
  {id:'dl-check',n:'Casilla marcada',c:'delulu',col:G,s:c=>`<rect ${O} x="12" y="12" width="76" height="76" rx="18" fill="${c}"/><path d="M32 52l12 12 24-28" stroke="${c.toLowerCase()===Y.toLowerCase()?G:Y}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`},
  {id:'dl-casilla',n:'Casilla',c:'delulu',col:'#F4E3DE',s:c=>`<rect x="10" y="10" width="80" height="80" rx="18" fill="${c}" stroke="${G}" stroke-width="3.5" stroke-dasharray="7 6"/>`},
  {id:'dl-premio',n:'Casilla estrella',c:'delulu estrellas',col:G,s:c=>`<rect ${O} x="10" y="10" width="80" height="80" rx="18" fill="${c}"/><path d="M50 26l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="${Y}"/>`},
  {id:'ghost',n:'Fantasma',c:'halloween kawaii',col:'#F7F3EE',s:c=>`<path ${O} d="M24 86V44a26 26 0 0 1 52 0v42l-9-7-8 8-9-8-9 8-8-8z" fill="${c}"/><ellipse cx="41" cy="48" rx="4" ry="6" fill="#2e2236"/><ellipse cx="59" cy="48" rx="4" ry="6" fill="#2e2236"/><ellipse cx="50" cy="62" rx="5" ry="4" fill="#2e2236"/><circle cx="34" cy="58" r="4" fill="#f3b5b9" opacity=".7"/><circle cx="66" cy="58" r="4" fill="#f3b5b9" opacity=".7"/>`},
  {id:'bat',n:'Murciélago',c:'halloween',col:'#3D3346',s:c=>`<path ${O} d="M50 40c6 0 10 4 10 10 6-8 18-12 34-8-8 4-10 12-8 20-8-6-16-4-22 2-4-2-8-3-14-3s-10 1-14 3c-6-6-14-8-22-2 2-8 0-16-8-20 16-4 28 0 34 8 0-6 4-10 10-10z" fill="${c}"/><path d="M44 36l2-8 4 6 4-6 2 8" fill="${c}"/><circle cx="46" cy="48" r="2.2" fill="#F6E08A"/><circle cx="54" cy="48" r="2.2" fill="#F6E08A"/>`},
  {id:'witchhat',n:'Sombrero de bruja',c:'halloween',col:'#4A3560',s:c=>`<path ${O} d="M10 78c20-8 60-8 80 0-20 8-60 8-80 0z" fill="${c}"/><path ${O} d="M30 74c4-22 10-42 30-60-4 14 0 22 6 28 4 6 4 22 4 32z" fill="${c}"/><path d="M31 68c12-3 28-3 39 0v-7c-11-3-27-3-38 0z" fill="#E07B39"/><rect x="45" y="60" width="10" height="10" rx="1" fill="#F6E08A"/>`},
  {id:'candy',n:'Dulce',c:'halloween kawaii',col:'#E07B39',s:c=>`<path ${O} d="M14 34l18 10-18 16zM86 34L68 44l18 16z" fill="${c}"/><circle ${O} cx="50" cy="50" r="20" fill="${c}"/><path d="M36 42c8 4 20 4 28 0M34 52c10 4 22 4 32 0" stroke="#fff" stroke-width="4" fill="none" opacity=".85"/>`},
  {id:'web',n:'Telaraña',c:'halloween minimal',col:'#9F93AE',s:c=>`<g stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M10 10L90 90M10 10L90 50M10 10L50 90M10 10L90 22M10 10L22 90"/><path d="M34 14q4 12-8 20 14-2 14 12 6-14 20-12-8-8 6-20M26 24q10 6 2 22"/><path d="M58 14q4 22-16 34 22-2 24 22 10-20 24-22"/></g>`},
  {id:'spider',n:'Araña',c:'halloween',col:'#2B2530',s:c=>`<path d="M50 6v34" stroke="#9F93AE" stroke-width="1.6"/><g stroke="${c}" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M42 52l-14-10-8 8M42 58l-16 2-8 10M58 52l14-10 8 8M58 58l16 2 8 10M44 64l-10 12M56 64l10 12"/></g><ellipse ${O} cx="50" cy="56" rx="12" ry="14" fill="${c}"/><circle cx="46" cy="52" r="2.4" fill="#fff"/><circle cx="54" cy="52" r="2.4" fill="#fff"/>`},
  {id:'cauldron',n:'Caldero',c:'halloween',col:'#2F2A35',s:c=>`<circle cx="38" cy="30" r="7" fill="#8FCB6B"/><circle cx="56" cy="22" r="5" fill="#8FCB6B" opacity=".8"/><circle cx="64" cy="34" r="6" fill="#8FCB6B"/><path ${O} d="M14 44h72c0 28-14 42-36 42S14 72 14 44z" fill="${c}"/><rect x="10" y="38" width="80" height="10" rx="5" fill="#8FCB6B"/><path d="M28 86l-6 8M72 86l6 8" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`},
  {id:'skull',n:'Calaverita',c:'halloween kawaii',col:'#F4ECDF',s:c=>`<path ${O} d="M50 12c22 0 36 14 36 32 0 12-6 20-14 24v12H28V68c-8-4-14-12-14-24 0-18 14-32 36-32z" fill="${c}"/><circle cx="37" cy="48" r="8" fill="#2E2236"/><circle cx="63" cy="48" r="8" fill="#2E2236"/><path d="M46 62l4-6 4 6z" fill="#2E2236"/><path d="M38 72v8M46 72v8M54 72v8M62 72v8" stroke="#2E2236" stroke-width="2"/><circle cx="26" cy="58" r="4" fill="#f3b5b9" opacity=".7"/><circle cx="74" cy="58" r="4" fill="#f3b5b9" opacity=".7"/>`},
  {id:'boo',n:'¡BUU!',c:'halloween frases',col:'#E07B39',vb:'0 0 130 70',s:c=>`<path ${O} d="M14 10h102a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10H50l-16 12 2-12H14A10 10 0 0 1 4 46V20a10 10 0 0 1 10-10z" fill="${c}"/>${tx(65,43,'¡BUU!',{f:BR,s:28,c:'#2E2236'})}`}
 );
 ['pumpkin','cat','moon'].forEach(id=>{const s=STICKERS.find(x=>x.id===id);if(s)s.c+=' halloween'});
 ['star','sparkle','heart'].forEach(id=>{const s=STICKERS.find(x=>x.id===id);if(s)s.c+=' delulu'});
 F.bodoni='"Bodoni Moda", serif';F.brush='"Caveat Brush", cursive';
 PACKS.unshift(
  {id:'delulu',n:'Delulu',st:['dl-logo','dl-sona','dl-solulu','dl-hoysi','dl-manifiesto','dl-manifestado','dl-todo','dl-metas','dl-ideas','dl-ojo','dl-secret','dl-logre','dl-modo','dl-reina','dl-hecho','dl-check','dl-casilla','dl-premio','sparkle','star'],pages:[
   ['Tarjeta de soñadora frecuente',(W,H)=>{const els=[T('Tarjeta de soñadora frecuente',30,40,W-60,90,{font:F.bodoni,it:true,fs:Math.round(W*.068),color:G,al:'center'}),
      T('marcá una casilla cada vez que soñés, planeés y… repetí ✦',40,132,W-80,70,{font:F.brush,fs:Math.round(W*.04),color:WN,al:'center'})],s=Math.round(W*.2),gap=Math.round(W*.06),x0=(W-3*s-2*gap)/2,y0=H*.3;
     for(let i=0;i<9;i++){const x=x0+(i%3)*(s+gap),y=y0+Math.floor(i/3)*(s+gap);els.push(ST('dl-casilla',x,y,s),T(String(i+1),x+10,y+6,30,24,{font:'Figtree, sans-serif',fs:13,color:'#8a9a92'}))}
     els.push(ST('dl-premio',W/2-s/2,y0+3*(s+gap),s),T('NOMBRE ______________',40,H-110,W*.6,34,{font:'Figtree, sans-serif',fs:15,color:G,b:true}),T('delulu is the solulu',W*.45,H-70,W*.5,40,{font:F.brush,fs:24,color:WN,al:'right'}));
     return{bg:'plain',bgc:'#F2CFCB',els}}],
   ['Manifiesto del día',(W,H)=>({bg:'dots',bgc:'#F7F2EA',els:[ST('dl-sona',W/2-90,26,180),T('Hoy soñé con…',44,190,W-88,40,{font:F.bodoni,it:true,fs:24,color:G}),PP('lined',40,232,W-80,110,{r:0}),
     T('Lo planeé así:',44,H*.47,W-88,40,{font:F.bodoni,it:true,fs:24,color:G}),T('[ ] \n[ ] \n[ ] ',54,H*.47+44,W-120,110,{font:F.brush,fs:24,color:G}),
     T('Y lo voy a repetir porque…',44,H*.7,W-88,40,{font:F.bodoni,it:true,fs:24,color:G}),ST('dl-hoysi',W-170,H-110,130),ST('dl-manifestado',40,H-150,110,{r:-8})]})],
   ['Metas delulu',(W,H)=>({bg:'grid',bgc:'#FBF7F0',els:[T('Metas delulu',40,34,W-160,70,{font:F.bodoni,it:true,fs:44,color:G}),ST('dl-modo',W-200,46,170,{r:4}),
     ST('dl-todo',40,140,120),T('[ ] \n[ ] \n[ ] ',50,192,W/2-70,130,{font:F.brush,fs:22,color:G}),ST('dl-metas',W/2+10,140,120),T('[ ] \n[ ] \n[ ] ',W/2+20,192,W/2-70,130,{font:F.brush,fs:22,color:G}),
     ST('dl-ideas',40,H*.5,120),NT('',44,H*.5+56,W/2-80,{bgc:'#F6E08A',r:-2}),ST('dl-ojo',W/2+10,H*.5,120),NT('',W/2+14,H*.5+56,W/2-80,{bgc:'#EDB8B7',r:2}),
     ST('dl-reina',W/2-105,H-90,210)]})]]},
  {id:'halloween',n:'Halloween',st:['pumpkin','ghost','bat','witchhat','candy','web','spider','cauldron','skull','cat','moon','boo'],pages:[
   ['Noche de brujas',(W,H)=>({bg:'plain',bgc:'#2B2433',els:[ST('web',W-150,0,150),T('Noche de brujas',40,48,W-150,80,{font:F.brush,fs:52,color:'#F08A3E'}),ST('moon',40,130,70,{color:'#F6E08A'}),ST('bat',W*.55,140,90,{r:-12}),
     T('[ ] Disfraz listo\n[ ] Dulces para compartir\n[ ] Maratón de pelis de miedo\n[ ] Calabaza tallada\n[ ] Fotos con mi aquelarre',50,250,W-100,260,{font:F.brush,fs:28,color:'#F6ECDF'}),
     ST('pumpkin',40,H-190,130,{r:-6}),ST('ghost',W/2-50,H-210,110,{r:6}),ST('candy',W-150,H-170,100,{r:-14}),ST('boo',W-200,H-300,150,{r:6})]})],
   ['Pelis de miedo',(W,H)=>({bg:'grid',bgc:'#F6EFE4',els:[T('Pelis de miedo',40,36,W-80,70,{font:F.brush,fs:50,color:'#4A3560'}),ST('skull',W-130,30,90,{r:10}),
     T('Peli · ¿con quién? · ★★★★★',44,130,W-88,34,{font:'Figtree, sans-serif',fs:15,color:'#806E73',b:true}),
     T('1.\n\n2.\n\n3.\n\n4.\n\n5.',50,172,W-100,H*.5,{font:F.brush,fs:26,color:'#2E2236'}),ST('spider',W-120,H*.42,90),ST('cauldron',50,H-170,120),ST('candy',W-160,H-150,90,{r:20})]})]]}
 );
 CATS.splice(1,0,['delulu','Delulu'],['halloween','Halloween']);
}
