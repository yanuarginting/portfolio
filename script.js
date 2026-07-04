  // ===== Theme Toggle (Light / Dark) =====
  const themeToggleBtn = document.getElementById('themeToggle');

  const sunIcon = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5V5M12 19V21.5M4.5 12H2M22 12H19.5M5.6 5.6L7.4 7.4M18.4 18.4L16.6 16.6M18.4 5.6L16.6 7.4M5.6 18.4L7.4 16.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const moonIcon = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 14.5C18.7 15.2 17.2 15.6 15.6 15.6C10.5 15.6 6.4 11.5 6.4 6.4C6.4 4.8 6.8 3.3 7.5 2C4.2 3.4 2 6.7 2 10.5C2 15.7 6.3 20 11.5 20C15.3 20 18.6 17.8 20 14.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';

  function applyTheme(theme){
    if (theme === 'dark'){
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtn.innerHTML = sunIcon;
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtn.innerHTML = moonIcon;
    }
    try { localStorage.setItem('portfolio-theme', theme); } catch (e) {}
  }

  const savedTheme = (function(){
    try { return localStorage.getItem('portfolio-theme'); } catch (e) { return null; }
  })() || 'light';

  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });

  const nav = document.getElementById('pillNav');
  const indicator = document.getElementById('indicator');

  const items = Array.from(nav.querySelectorAll('.nav-item'));

  function moveIndicatorTo(el){
    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    indicator.style.width = rect.width + 'px';
    indicator.style.transform = `translateX(${rect.left - navRect.left - 6}px)`;
  }

  window.addEventListener('load', () => {
    const active = nav.querySelector('.nav-item.active') || items[0];
    moveIndicatorTo(active);
  });

  items.forEach(item => {
    item.addEventListener('mouseenter', () => moveIndicatorTo(item));
  });

  nav.addEventListener('mouseleave', () => {
    const active = nav.querySelector('.nav-item.active') || items[0];
    moveIndicatorTo(active);
  });

  let isProgrammaticScroll = false;
  let programmaticScrollTimeout = null;

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      moveIndicatorTo(item);

      // Suppress scroll-spy while the smooth-scroll animation is in
      // transit, so passing over an in-between section (e.g. Skills ->
      // Experience -> Education) doesn't yank the indicator back and forth.
      isProgrammaticScroll = true;
      clearTimeout(programmaticScrollTimeout);

      if ('onscrollend' in window){
        const onScrollEnd = () => {
          isProgrammaticScroll = false;
          window.removeEventListener('scrollend', onScrollEnd);
        };
        window.addEventListener('scrollend', onScrollEnd);
        // Safety net in case scrollend doesn't fire (e.g. click on current section)
        programmaticScrollTimeout = setTimeout(() => { isProgrammaticScroll = false; }, 1200);
      } else {
        programmaticScrollTimeout = setTimeout(() => { isProgrammaticScroll = false; }, 700);
      }
    });
  });

  window.addEventListener('resize', () => {
    const active = nav.querySelector('.nav-item.active') || items[0];
    moveIndicatorTo(active);
  });

  // Scroll-spy: highlight nav item matching the section in view
  const sections = items
    .map(item => document.querySelector(item.getAttribute('href')))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    if (isProgrammaticScroll) return;
    entries.forEach(entry => {
      if (isProgrammaticScroll) return;
      if (entry.isIntersecting){
        const id = '#' + entry.target.id;
        const match = items.find(i => i.getAttribute('href') === id);
        if (match){
          items.forEach(i => i.classList.remove('active'));
          match.classList.add('active');
          moveIndicatorTo(match);
        }
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(sec => spyObserver.observe(sec));

  // Portfolio image carousel: activates automatically for any project
  // thumbnail that has more than one <img>. To add more photos to a
  // project, just add extra <img> tags inside its .portfolio-thumb div —
  // the arrows and dots will appear on their own.
  function initPortfolioCarousels(){
    document.querySelectorAll('.portfolio-thumb').forEach(thumb => {
      const imgs = Array.from(thumb.querySelectorAll(':scope > img'));
      if (imgs.length < 2) return;

      const track = document.createElement('div');
      track.className = 'carousel-track';
      imgs.forEach(img => track.appendChild(img));
      thumb.appendChild(track);

      const prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-btn prev';
      prevBtn.setAttribute('aria-label', 'Previous image');
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      const nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-btn next';
      nextBtn.setAttribute('aria-label', 'Next image');
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'carousel-dots';
      const dots = imgs.map((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dotsWrap.appendChild(dot);
        return dot;
      });

      thumb.appendChild(prevBtn);
      thumb.appendChild(nextBtn);
      thumb.appendChild(dotsWrap);

      let index = 0;
      function goTo(i){
        index = (i + imgs.length) % imgs.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, di) => d.classList.toggle('active', di === index));
      }

      prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(index - 1); });
      nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(index + 1); });
      dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.stopPropagation(); goTo(i); }));
    });
  }

  initPortfolioCarousels();

  // Back-to-home floating button
  const backToHomeBtn = document.getElementById('backToHome');
  const homeSection = document.getElementById('home');
  const educationSection = document.getElementById('education');

  function toggleBackToHome(){
    const educationTop = educationSection.getBoundingClientRect().top;
    backToHomeBtn.classList.toggle('visible', educationTop <= window.innerHeight - 80);
  }

  window.addEventListener('scroll', toggleBackToHome);
  toggleBackToHome();

  backToHomeBtn.addEventListener('click', () => {
    homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
