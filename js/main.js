(() => {
  const pages = [...document.querySelectorAll('.page')];
  const links = [...document.querySelectorAll('nav a')];
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  /* Sahifalar orasida o'tish */
  function show() {
    let id = location.hash.slice(1);
    if (!pages.some(p => p.id === id)) id = 'home';
    pages.forEach(p => p.classList.toggle('active', p.id === id));
    links.forEach(a => a.classList.toggle('active', a.dataset.page === id));
    window.scrollTo({ top: 0 });
    closeMenu();
    if (id === 'home') { runCounters(); typeCode(); }
  }
  window.addEventListener('hashchange', show);

  /* Mobil menyu */
  const openMenu = () => { sidebar.classList.add('open'); overlay.classList.add('show'); };
  function closeMenu() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
  document.getElementById('menuBtn').addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

  /* Mavzu (kunduzgi / tungi) */
  const themeBtn = document.getElementById('themeBtn');
  const setTheme = t => {
    document.documentElement.dataset.theme = t;
    themeBtn.textContent = t === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim';
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', () =>
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* Raqamlar animatsiyasi */
  function runCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const end = +el.dataset.count, t0 = performance.now(), dur = 1200;
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? '+' : '');
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  /* Kod yozilish effekti */
  const code = [
    '<span class="k">const</span> <span class="p">developer</span> = {',
    '  name: <span class="s">"Ulug`bek Arifov"</span>,',
    '  role: <span class="s">"Frontend dasturchi"</span>,',
    '  stack: [<span class="s">"HTML"</span>, <span class="s">"CSS"</span>, <span class="s">"JS"</span>, <span class="s">"React"</span>],',
    '  location: <span class="s">"Toshkent"</span>,',
    '  available: <span class="k">true</span>',
    '};'
  ].join('\n');
  const out = document.getElementById('typed');
  let timer;
  function typeCode() {
    clearInterval(timer);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { out.innerHTML = code; return; }
    let i = 0;
    timer = setInterval(() => {
      // HTML teglarini butunligicha qo'shish
      if (code[i] === '<') i = code.indexOf('>', i);
      i++;
      out.innerHTML = code.slice(0, i);
      if (i >= code.length) clearInterval(timer);
    }, 28);
  }

  /* Loyihalarni filtrlash */
  const filters = document.getElementById('filters');
  filters.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    filters.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
    document.querySelectorAll('.project').forEach(p =>
      p.classList.toggle('hide', b.dataset.f !== 'all' && p.dataset.cat !== b.dataset.f));
  });

  /* Aloqa formasi */
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('error', bad);
      if (bad) ok = false;
    });
    msg.className = 'msg ' + (ok ? 'ok' : 'err');
    msg.textContent = ok
      ? 'Rahmat! Xabaringiz yuborildi, tez orada javob beraman.'
      : 'Iltimos, ism, to\'g\'ri email va xabar maydonlarini to\'ldiring.';
    if (ok) form.reset();
  });

  document.getElementById('cvBtn').addEventListener('click', e => {
    e.preventDefault();
    alert('Bu yerga o\'z CV faylingiz havolasini qo\'ying (masalan: assets/cv.pdf).');
  });

  show();
})();
