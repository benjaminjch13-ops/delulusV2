
/* ================= themes & personalization =================
   A theme is a hand-tuned palette for light and dark. Prefs layered on top:
   mode (system/light/dark), desk pattern, accent, title font, motion and the viewer's name. */
const THEMES={
  delulu:{n:'Delulu',desk:'estrellas',font:'"Bodoni Moda", Georgia, serif',hand:'"Caveat Brush", cursive',
    light:{desk:'#F3EEE6',desk2:'#ECE3D5',grain:'rgba(224,176,74,.75)',grain2:'rgba(237,184,183,.9)',shelf:'#386660',panel:'#FFFCF7',panel2:'#F1E9DD',ink:'#22403B',muted:'#7C7066',accent:'#386660',paper:'#FBF7F0'},
    dark:{desk:'#386660',desk2:'#2F5852',grain:'rgba(246,224,138,.8)',grain2:'rgba(237,184,183,.85)',shelf:'#C99A52',panel:'#2B4E49',panel2:'#355E58',ink:'#F6F1E8',muted:'#C6D6D1',accent:'#EDB8B7',paper:'#FBF7F0'}},
  halloween:{n:'Halloween',desk:'estrellas',hand:'"Caveat Brush", cursive',
    light:{desk:'#F4E9DA',desk2:'#EADCC6',grain:'rgba(224,123,57,.6)',grain2:'rgba(106,74,122,.45)',shelf:'#6B4A7A',panel:'#FFF9F2',panel2:'#F3E6D6',ink:'#2E2236',muted:'#806E73',accent:'#D9692A',paper:'#FBF5EC'},
    dark:{desk:'#241C2E',desk2:'#1A1422',grain:'rgba(242,170,90,.75)',grain2:'rgba(200,170,230,.45)',shelf:'#4B3560',panel:'#2F2539',panel2:'#3A2F46',ink:'#F6ECDF',muted:'#BBA9C2',accent:'#F08A3E',paper:'#F6EFE4'}},
  madera:{n:'Madera',desk:'madera',
    light:{desk:'#dcc8ac',desk2:'#cdb48f',grain:'rgba(110,78,50,.10)',shelf:'#a87650',panel:'#fffaf3',panel2:'#f4eadc',ink:'#3b2d26',muted:'#8a7366',accent:'#c4878c',paper:'#fbf7f0'},
    dark:{desk:'#2b221d',desk2:'#221a16',grain:'rgba(0,0,0,.28)',shelf:'#5c3e2a',panel:'#382c26',panel2:'#44362e',ink:'#f3e7da',muted:'#bfa999',accent:'#d99ca2',paper:'#f6f0e6'}},
  lino:{n:'Lino',desk:'lino',
    light:{desk:'#ece4d6',desk2:'#e1d6c3',grain:'rgba(120,100,70,.09)',shelf:'#c4a47c',panel:'#fffdf8',panel2:'#f2ece1',ink:'#3a332c',muted:'#857a6c',accent:'#8fa382',paper:'#fdfaf3'},
    dark:{desk:'#2a2723',desk2:'#22201c',grain:'rgba(0,0,0,.25)',shelf:'#5b4a37',panel:'#35312c',panel2:'#403b35',ink:'#efe8dc',muted:'#b5ab9b',accent:'#a6b998',paper:'#f5f0e6'}},
  rosa:{n:'Rosa empolvado',desk:'cuadros',
    light:{desk:'#f3e0dc',desk2:'#ebd2cd',grain:'rgba(196,135,140,.14)',shelf:'#c99a91',panel:'#fffafa',panel2:'#f8eceb',ink:'#4a3036',muted:'#9a7880',accent:'#cf8592',paper:'#fffaf8'},
    dark:{desk:'#2f2326',desk2:'#271d20',grain:'rgba(217,156,162,.045)',shelf:'#6a4148',panel:'#3a2d31',panel2:'#46363b',ink:'#f6e6e8',muted:'#c4a5ab',accent:'#e3a3ad',paper:'#fbf3f2'}},
  salvia:{n:'Salvia',desk:'lino',
    light:{desk:'#dfe5d8',desk2:'#d2dac8',grain:'rgba(90,110,80,.09)',shelf:'#9fa98a',panel:'#fbfcf8',panel2:'#eef1e8',ink:'#2f382c',muted:'#74806c',accent:'#7f9474',paper:'#fbfaf4'},
    dark:{desk:'#232822',desk2:'#1c201b',grain:'rgba(0,0,0,.25)',shelf:'#46503e',panel:'#2f352d',panel2:'#3a4137',ink:'#e8eee2',muted:'#a9b5a0',accent:'#a3b896',paper:'#f4f4ec'}},
  lavanda:{n:'Lavanda',desk:'puntos',
    light:{desk:'#e7e2f0',desk2:'#dcd5ea',grain:'rgba(120,100,160,.16)',shelf:'#a99bbf',panel:'#fdfcff',panel2:'#f1edf8',ink:'#352f45',muted:'#7d7590',accent:'#9586b8',paper:'#fcfaff'},
    dark:{desk:'#26232f',desk2:'#1f1c27',grain:'rgba(173,159,198,.10)',shelf:'#4c4362',panel:'#312d3c',panel2:'#3c3749',ink:'#ece8f5',muted:'#b2aac4',accent:'#b6a8d8',paper:'#f7f5fb'}},
  cielo:{n:'Cielo',desk:'papel',
    light:{desk:'#dde8ef',desk2:'#cfdde7',grain:'rgba(70,100,130,.08)',shelf:'#94a9b8',panel:'#fbfdff',panel2:'#ecf2f6',ink:'#2c3742',muted:'#6f8090',accent:'#7d9ab3',paper:'#fbfcfc'},
    dark:{desk:'#1f252c',desk2:'#191e24',grain:'rgba(0,0,0,.25)',shelf:'#3f4d5a',panel:'#2a3139',panel2:'#343c45',ink:'#e6edf3',muted:'#a3b1bd',accent:'#9db8cf',paper:'#f3f6f8'}},
  cafe:{n:'Noche de café',desk:'liso',
    light:{desk:'#e6d9c9',desk2:'#d9c8b3',grain:'rgba(90,60,40,.08)',shelf:'#8c6447',panel:'#fffaf4',panel2:'#f1e6d8',ink:'#33261f',muted:'#806a5c',accent:'#b07a52',paper:'#fbf6ee'},
    dark:{desk:'#1d1714',desk2:'#15100e',grain:'rgba(255,220,180,.03)',shelf:'#4a3326',panel:'#2b221d',panel2:'#362a24',ink:'#f2e3d3',muted:'#b39a87',accent:'#d39a6a',paper:'#f4ece0'}},
};
const DESKS=[['estrellas','Estrellas'],['madera','Madera'],['lino','Lino'],['papel','Papel'],['puntos','Puntos'],['cuadros','Vichy'],['liso','Liso']];
const ACCENTS=['#c4878c','#cf8592','#d39a6a','#c9a24a','#8fa382','#7d9ab3','#9586b8','#a07a9e','#8a6a55'];
const TITLE_FONTS=[['"Young Serif", Georgia, serif','Young Serif'],['"Playfair Display", Georgia, serif','Playfair'],['"Cormorant Garamond", Georgia, serif','Cormorant'],['"Dancing Script", cursive','Caligrafía'],['"Amatic SC", cursive','Amatic'],['Figtree, system-ui, sans-serif','Figtree']];
function hostDark(){const h=document.documentElement.dataset.theme;if(h==='dark')return true;if(h==='light')return false;try{return matchMedia('(prefers-color-scheme: dark)').matches}catch(e){return false}}
function isDark(){const m=S?.prefs?.mode||'system';return m==='dark'||(m==='system'&&hostDark())}
const lum=hex=>{const n=parseInt(hex.slice(1),16),f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(n>>16)+.7152*f(n>>8&255)+.0722*f(n&255)};
function applyPrefs(){if(!S)return;const p=S.prefs,th=THEMES[p.theme]||THEMES.delulu,dark=isDark(),t=th[dark?'dark':'light'],r=document.documentElement,st=r.style;
  const acc=p.accent||t.accent;
  const vars={desk:t.desk,'desk-2':t.desk2,grain:t.grain,grain2:t.grain2||t.grain,shelf:t.shelf,panel:t.panel,'panel-2':t.panel2,ink:t.ink,muted:t.muted,accent:acc,paper:t.paper,
    'accent-ink':lum(acc)>.45?'#2b1c1c':'#ffffff','accent-soft':acc+'2e',line:dark?'rgba(255,245,235,.13)':'rgba(59,45,38,.13)',
    shadow:dark?'0 22px 44px -20px rgba(0,0,0,.85)':'0 22px 44px -22px rgba(70,40,25,.45)','shadow-sm':dark?'0 6px 16px -8px rgba(0,0,0,.7)':'0 6px 16px -10px rgba(70,40,25,.35)'};
  for(const[k,v]of Object.entries(vars))st.setProperty('--'+k,v);
  const fd=p.fontD||th.font;if(fd)st.setProperty('--f-display',fd);else st.removeProperty('--f-display');if(th.hand)st.setProperty('--f-hand',th.hand);else st.removeProperty('--f-hand');r.dataset.dark=dark?'1':'0';
  st.colorScheme=dark?'dark':'light';r.dataset.desk=p.desk||th.desk;r.dataset.motion=p.motion==='reducida'?'reduced':'full';
  if(p.desk==='papel'||(!p.desk&&th.desk==='papel'))texVar('liso')}
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyPrefs)}catch(e){}
new MutationObserver(()=>applyPrefs()).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
/* old prefs (pal/theme) -> new ones */
function migratePrefs(p){if(p.pal&&!p.accent)p.accent={salvia:'#7f9474',lavanda:'#9586b8',cuero:'#9a6244'}[p.pal]||'';delete p.pal;
  if(p.theme==='light'||p.theme==='dark'){p.mode=p.theme;p.theme='madera'}if(!THEMES[p.theme])p.theme='delulu';if(p.theme==='madera'&&!p.themePicked)p.theme='delulu';return p}

function greeting(){const h=new Date().getHours(),n=(S.prefs.name||'').trim();const g=h<12?'Buenos días':h<19?'Buenas tardes':'Buenas noches';return n?`${g}, ${n}`:'Tu estantería'}
function todayLabel(){return new Date().toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long'})}

function themeCard(id){const th=THEMES[id],t=th[isDark()?'dark':'light'];
  return `<button type="button" class="themecard${(S.prefs.theme||'delulu')===id?' on':''}" data-theme-id="${id}" aria-label="Tema ${th.n}">
   <span class="tc-desk" data-desk="${th.desk}" style="--desk:${t.desk};--desk-2:${t.desk2};--grain:${t.grain}"><span class="tc-panel" style="background:${t.panel}"><i style="background:${t.accent}"></i><i style="background:${t.ink};opacity:.5"></i></span><span class="tc-book" style="background:${t.shelf}"></span></span>
   <span class="tc-name">${th.n}</span></button>`}
function openSettings(){const p=S.prefs;
  const m=modal(`<header><h2>Personalizar</h2><div class="spacer"></div><button class="btn ghost icon" data-x aria-label="Cerrar">${ico('x')}</button></header>
  <div class="content one settings">
   <section><span class="lbl">Tema</span><div class="themegrid">${Object.keys(THEMES).map(themeCard).join('')}</div></section>
   <section class="two"><div class="field"><span class="lbl">Modo</span>${chipRow('mode',[['system','Como el sistema'],['light','Claro'],['dark','Oscuro']],p.mode||'system')}</div>
    <div class="field"><span class="lbl">Animaciones</span>${chipRow('motion',[['suave','Suaves'],['reducida','Reducidas']],p.motion||'suave')}</div></section>
   <section><span class="lbl">Fondo del escritorio</span><div class="deskgrid">${[['','Del tema'],...DESKS].map(([v,l])=>`<button type="button" class="desktile${(p.desk||'')===v?' on':''}" data-desk-id="${v}"><span data-desk="${v||(THEMES[p.theme]||THEMES.delulu).desk}"></span>${l}</button>`).join('')}</div></section>
   <section><span class="lbl">Color de acento</span><div class="swrow" id="accRow"><button type="button" class="sw def${p.accent?'':' on'}" data-acc="" aria-label="Del tema" title="Del tema"></button>${ACCENTS.map(c=>`<button type="button" class="sw${p.accent===c?' on':''}" data-acc="${c}" style="background:${c}" aria-label="Acento ${c}"></button>`).join('')}<input type="color" id="accCustom" value="${p.accent||'#c4878c'}" aria-label="Otro color"></div></section>
   <section><span class="lbl">Letra de los títulos</span><div class="fontrow">${[['','Del tema'],...TITLE_FONTS].map(([v,l])=>`<button type="button" class="fontopt${(p.fontD||'')===v?' on':''}" data-font="${esc(v)}" style="${v?`font-family:${esc(v)}`:''}">${l}</button>`).join('')}</div></section>
   <section><div class="field"><label class="lbl" for="prefName">Tu nombre</label><input type="text" id="prefName" maxlength="24" placeholder="Para saludarte en la estantería" value="${esc(p.name||'')}"></div>
</section>

  </div><footer><button class="btn primary" data-x>Listo</button></footer>`,'md');
  const set=(k,v)=>{S.prefs[k]=v;applyPrefs();persist()};
  m.addEventListener('click',e=>{const t=e.target;
    const th=t.closest('[data-theme-id]');if(th){S.prefs.themePicked=1;set('theme',th.dataset.themeId);set('accent','');$$('.themecard',m).forEach(x=>x.classList.toggle('on',x===th));$$('[data-acc]',m).forEach(x=>x.classList.toggle('on',x.dataset.acc===''));$$('.desktile span',m)[0].dataset.desk=(THEMES[S.prefs.theme]||THEMES.delulu).desk;renderHomeSoon();return}
    const ch=t.closest('[data-v]');if(ch&&ch.parentElement.dataset.f){const f=ch.parentElement.dataset.f;set(f,ch.dataset.v);$$('[data-v]',ch.parentElement).forEach(x=>x.classList.toggle('on',x===ch));if(f==='mode')$('.themegrid',m).innerHTML=Object.keys(THEMES).map(themeCard).join('');return}
    const dk=t.closest('[data-desk-id]');if(dk){set('desk',dk.dataset.deskId);$$('.desktile',m).forEach(x=>x.classList.toggle('on',x===dk));return}
    const ac=t.closest('[data-acc]');if(ac){set('accent',ac.dataset.acc);$$('[data-acc]',m).forEach(x=>x.classList.toggle('on',x===ac));return}
    const fo=t.closest('[data-font]');if(fo){set('fontD',fo.dataset.font);$$('.fontopt',m).forEach(x=>x.classList.toggle('on',x===fo));return}
    if(t.closest('[data-x]')){m.remove();renderHome();return}
  });
  m.addEventListener('input',e=>{if(e.target.id==='accCustom'){set('accent',e.target.value);$$('[data-acc]',m).forEach(x=>x.classList.remove('on'))}if(e.target.id==='prefName'){S.prefs.name=e.target.value;persist();renderHomeSoon()}})}
let hsT;function renderHomeSoon(){clearTimeout(hsT);hsT=setTimeout(()=>{if($('#home').classList.contains('show'))renderHome()},150)}
