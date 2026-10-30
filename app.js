// Galénica · Invitación navideña · Interacciones y animaciones
for (const img of document.querySelectorAll('img[data-img]')) img.src=`assets/img/${img.dataset.img}.png`;
const sc=document.getElementById('scroll'), env=document.getElementById('envelope'),pages=[...document.querySelectorAll('.page')];
const music=document.getElementById('christmas-audio');
const musicToggle=document.getElementById('music-toggle');
function syncMusicButton(){const playing=!music.paused;musicToggle.textContent=playing?'♫ Música: encendida':'♫ Música: apagada';musicToggle.setAttribute('aria-pressed',String(playing));musicToggle.setAttribute('aria-label',playing?'Pausar música':'Reproducir música')}
music.addEventListener('play',syncMusicButton);music.addEventListener('pause',syncMusicButton);
musicToggle.addEventListener('click',()=>{if(music.paused){music.play().catch(()=>syncMusicButton())}else{music.pause()}});
document.getElementById('open').addEventListener('click',()=>{music.volume=.75;music.play().catch(()=>syncMusicButton());env.classList.add('reveal');document.body.classList.add('open');document.getElementById('nav').hidden=false;setTimeout(()=>env.classList.add('done'),1450)},{once:true});
const navbuttons=[...document.querySelectorAll('[data-page]')];const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{e.target.classList.toggle('in-view',e.isIntersecting);if(e.isIntersecting){let i=pages.indexOf(e.target);navbuttons.forEach((b,n)=>b.setAttribute('aria-current',String(n===i)))}})},{root:sc,threshold:.32});pages.forEach(p=>obs.observe(p));
navbuttons.forEach(b=>b.addEventListener('click',()=>pages[+b.dataset.page].scrollIntoView({behavior:'smooth'})));
document.getElementById('restart').addEventListener('click',()=>pages[0].scrollIntoView({behavior:'smooth'}));
document.getElementById('rsvp').addEventListener('submit',e=>{e.preventDefault();const attendance=new FormData(e.currentTarget).get('attendance');['yes','no','pending'].forEach(id=>document.getElementById(id).classList.remove('show'));document.getElementById(attendance==='si'?'yes':'no').classList.add('show');pages[4].scrollIntoView({behavior:'smooth'})});
const target=new Date('2026-12-24T20:00:00-03:00').getTime();function countdown(){let remaining=Math.max(0,target-Date.now());const vals=[Math.floor(remaining/86400000),Math.floor(remaining/3600000)%24,Math.floor(remaining/60000)%60,Math.floor(remaining/1000)%60];['days','hours','minutes','seconds'].forEach((x,i)=>document.getElementById(x).textContent=String(vals[i]).padStart(2,'0'))}countdown();setInterval(countdown,1000);
