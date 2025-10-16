const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear().toString();

document.querySelectorAll('[data-copy]').forEach((el)=>{
  el.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(el.getAttribute('data-copy') || '');
      el.textContent = 'Copied!';
      setTimeout(()=> el.textContent = el.getAttribute('data-label') || 'Copy', 1200);
    }catch(e){}
  });
});

(function(){
  const els = Array.from(document.querySelectorAll('.reveal'));
  function showIfInView(el){
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh * 0.9 && r.bottom > 0) el.classList.add('show');
  }

  els.forEach(showIfInView);

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if (e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -10% 0px'});
    els.forEach(el=> io.observe(el));
  } else {

    els.forEach(el=> el.classList.add('show'));
    window.addEventListener('scroll', ()=> els.forEach(showIfInView), {passive:true});
  }
})();

const c = document.getElementById('stars');
if (c) {
  const ctx = c.getContext('2d');
  let w, h, dpr = Math.max(1, window.devicePixelRatio||1);
  const N = 160;
  let stars = [];
  function resize(){ w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr; c.style.width = innerWidth+'px'; c.style.height = innerHeight+'px'; }
  function rand(a,b){ return a + Math.random()*(b-a); }
  function init(){ stars = []; for(let i=0;i<N;i++){ stars.push({ x: rand(0,w), y: rand(0,h), z: rand(.2,1), r: rand(.6,2.2), vx: rand(-.05,.05), vy: rand(-.05,.05) }); } }
  function tick(){ ctx.clearRect(0,0,w,h); for(const s of stars){ s.x+=s.vx; s.y+=s.vy; if(s.x<0||s.x>w) s.vx*=-1; if(s.y<0||s.y>h) s.vy*=-1; const alpha = .3 + .7*s.z; ctx.beginPath(); ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`; ctx.arc(s.x, s.y, s.r*dpr, 0, Math.PI*2); ctx.fill(); } requestAnimationFrame(tick); }
  addEventListener('resize', ()=>{ resize(); init(); });
  resize(); init(); tick();
}

(function(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  const statusEl = document.getElementById('contactStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Sending...';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        statusEl.textContent = 'Message sent! I’ll reply soon.';
      } else {
        statusEl.textContent = 'Something went wrong. Please try again.';
      }
    } catch {
      statusEl.textContent = 'Network error. Please try again.';
    }
  });
})();
