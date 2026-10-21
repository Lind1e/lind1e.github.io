(() => {
  const header = document.querySelector('.header');
  const toggle = header.querySelector('.nav-toggle');
  const nav = header.querySelector('#main-navigation');
  const mobile = matchMedia('(max-width:700px)');
  function setOpen(open, restoreFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('nav-open', open);
    if (restoreFocus) toggle.focus();
  }
  header.classList.add('nav-enhanced');
  toggle.hidden = false;
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (!mobile.matches) return;
    setOpen(false);
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll:true});
    }
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  document.addEventListener('pointerdown', e => {
    if (mobile.matches && !header.contains(e.target)) setOpen(false);
  });
  header.addEventListener('focusout', () => setTimeout(() => {
    if (mobile.matches && !header.contains(document.activeElement)) setOpen(false);
  }, 0));
  mobile.addEventListener('change', () => setOpen(false));
})();
