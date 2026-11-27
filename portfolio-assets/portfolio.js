(()=>{'use strict';const reduced=matchMedia('(prefers-reduced-motion: reduce)');const small=matchMedia('(max-width:760px)');const progress=document.querySelector('.pf-scroll-progress');const art=document.querySelector('.pf-hero-art');const links=[...document.querySelectorAll('.pf-nav>div a')];const sections=links.map(a=>document.querySelector(a.getAttribute('href')));const media=[...document.querySelectorAll('.ps-photo,.ps-video')];let ticking=false;
function paint(){ticking=false;const y=scrollY;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max?Math.min(1,y/max):0})`;if(!reduced.matches&&!small.matches){if(art){art.style.setProperty('--pf-front',`${Math.min(35,y*.07)}px`);art.style.setProperty('--pf-mid',`${-Math.min(28,y*.055)}px`);art.style.setProperty('--pf-back',`${Math.min(18,y*.035)}px`);}media.forEach((el,i)=>{const r=el.getBoundingClientRect();if(r.bottom>-100&&r.top<innerHeight+100){const shift=Math.max(-10,Math.min(10,(innerHeight*.5-(r.top+r.height*.5))*.025));el.style.setProperty('--pf-y',`${shift*(i%2?-1:1)}px`);}});}else media.forEach(el=>el.style.removeProperty('--pf-y'));let active=-1;sections.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)active=i;});links.forEach((a,i)=>a.classList.toggle('is-active',i===active));}
function request(){if(!ticking){ticking=true;requestAnimationFrame(paint);}}addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});reduced.addEventListener('change',request);request();
if(!reduced.matches&&'IntersectionObserver'in window){document.documentElement.classList.add('pf-motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('pf-visible');observer.unobserve(e.target);}}),{threshold:.03,rootMargin:'0px 0px -24px 0px'});document.querySelectorAll('.ps-heading,.ps-intro,.ps-media,.decklead,.casehead,.pf-outro').forEach(el=>{el.setAttribute('data-pf-reveal','');observer.observe(el);});}
})();
(()=>{const scenes=[...document.querySelectorAll('.pf-scroll-scene')];const off=matchMedia('(prefers-reduced-motion:reduce)');const small=matchMedia('(max-width:760px)');const clamp=x=>Math.max(0,Math.min(1,x));const E=x=>{x=clamp(x);return x*x*(3-2*x)};let queued=false;scenes.forEach((s,i)=>{const bg=document.createElement('div');bg.className='pf-scene-atmosphere';bg.setAttribute('aria-hidden','true');const title=document.createElement('strong');title.textContent=['ТВОЙ СТИЛЬ','BAGGY','DEEP FRAME'][i];const glow=document.createElement('i');bg.append(title,glow);s.insertBefore(bg,s.firstChild);s.style.setProperty('--scene-light',['#6f92a8','#89724f','#08758c'][i]);});function paint(){queued=false;if(off.matches||small.matches)return;scenes.forEach((s,i)=>{const r=s.getBoundingClientRect(),travel=r.height-innerHeight*.5,p=clamp((innerHeight*.73-r.top)/travel);const enter=E(p/.16),split=E((p-.2)/.38),a=E((p-.27)/.31),c=E((p-.43)/.3),hold=E((p-.7)/.1);const set=(k,v)=>s.style.setProperty(k,v);set('--pf-va',enter);set('--pf-vx',`${(i===1?180:245)*(1-split)}px`);set('--pf-vy',`${80*(1-enter)}px`);set('--pf-vs',1+.28*(1-split));set('--pf-video-bright',.65+.35*enter);set('--pf-a1',a);set('--pf-a2',c);set('--pf-x1',`${(-230+(i===1?-100:0))*(1-a)}px`);set('--pf-y1',`${(i===2?0:90)*(1-a)}px`);set('--pf-r1',`${(i===1?10:-12)*(1-a)}deg`);set('--pf-s1',.77+.23*a);set('--pf-x2',`${-510*(1-c)}px`);set('--pf-y2',`${50*(1-c)}px`);set('--pf-r2',`${15*(1-c)}deg`);set('--pf-s2',.75+.25*c);set('--pf-bright1',.55+.45*a);set('--pf-bright2',.55+.45*c);set('--pf-captions',hold);set('--pf-word-x',`${(p-.5)*-220}px`);set('--pf-word-a',.25+.55*(1-hold));set('--pf-glow-a',.12+.23*Math.sin(p*Math.PI));set('--pf-glow-x',`${(p-.5)*250}px`);set('--pf-clip1',i===2?`circle(${20+90*a}% at 50% 50%)`:'inset(0)');});}function request(){if(!queued){queued=true;requestAnimationFrame(paint)}}addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});paint();})();

(()=>{
 const videos=[...document.querySelectorAll('.ps-video')];
 const visible=new Set();
 let soundUnlocked=false;
 const soundButton=document.createElement('button');
 soundButton.type='button';soundButton.className='pf-enable-sound';soundButton.textContent='Запустить со звуком · 50%';soundButton.hidden=true;
 document.body.append(soundButton);
 videos.forEach(v=>{v.muted=false;v.defaultMuted=false;v.volume=.5;v.playsInline=true;});
 function unlockSound(){
  soundUnlocked=true;soundButton.hidden=true;
  videos.forEach(v=>{v.muted=false;v.volume=.5;if(visible.has(v))start(v);});
 }
 soundButton.addEventListener('click',unlockSound);
 document.addEventListener('click',()=>{if(!soundUnlocked)unlockSound();},{once:true});
 function start(v){
  if(document.hidden||!visible.has(v))return;
  if(v.ended)v.currentTime=0;
  const attempt=v.play();
  if(attempt)attempt.then(()=>{soundButton.hidden=true;if(document.hidden||!visible.has(v))v.pause();}).catch(()=>{
   if(!visible.has(v)||document.hidden)return;
   v.muted=false;v.volume=.5;soundButton.hidden=false;
  });
 }
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(({target:v,isIntersecting,intersectionRatio})=>{
   const entering=isIntersecting&&intersectionRatio>=.35;
   if(entering&&!visible.has(v)){visible.add(v);start(v);}
   else if(!entering&&visible.delete(v)){v.pause();if(!visible.size)soundButton.hidden=true;}
  }),{threshold:[0,.35],rootMargin:'-82px 0px 0px 0px'});
  videos.forEach(v=>observer.observe(v));
 }
 document.addEventListener('visibilitychange',()=>videos.forEach(v=>{if(document.hidden)v.pause();else if(visible.has(v))start(v);}));
})();
;(()=>{
 const deck=document.querySelector('.pf-hero-art');if(!deck)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const pictures=[...deck.querySelectorAll('.pf-art')];
 const cards=pictures.map((img,i)=>{
  const button=document.createElement('button');button.type='button';button.className='pf-deck-card';
  button.setAttribute('aria-label',`Показать карточку: ${img.alt}`);
  const copy=img.cloneNode();copy.className='';button.append(copy);deck.append(button);
  button.addEventListener('click',()=>{if(changing)return;front=i===front?(front+1)%cards.length:i;arrange();restart();});
  return button;
 });
 let front=0,changing=false,timer=null,phase=null,inView=true;
 deck.classList.add('pf-card-deck');
 function arrange(){cards.forEach((card,i)=>{const slot=(i-front+cards.length)%cards.length;card.dataset.slot=slot;card.setAttribute('aria-pressed',String(slot===0));});}
 function stop(){clearTimeout(timer);timer=null;}
 function paused(){return reduced.matches||document.hidden||!inView||deck.matches(':hover')||deck.contains(document.activeElement);}
 function restart(){stop();if(!paused())timer=setTimeout(next,3000);}
 function next(){if(paused())return;changing=true;const outgoing=cards[front];outgoing.classList.add('is-dealing');phase=setTimeout(()=>{front=(front+1)%cards.length;arrange();outgoing.classList.remove('is-dealing');changing=false;restart();},440);}
 deck.addEventListener('pointerenter',stop);deck.addEventListener('pointerleave',restart);
 deck.addEventListener('focusin',stop);deck.addEventListener('focusout',()=>queueMicrotask(restart));
 document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',restart);
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{inView=e.isIntersecting;restart();},{threshold:.1}).observe(deck);
 arrange();restart();
})();
