(() => {
  const trigger = document.querySelector('.portrait-zoom-trigger');
  const preview = document.querySelector('.portrait-preview');
  const frame = preview.querySelector('.portrait-preview-frame');
  const closeButton = preview.querySelector('button');
  const hover = matchMedia('(hover:hover) and (pointer:fine)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let opened = false, pinned = false, timer, generation = 0;
  function originTransform() {
    const from = trigger.getBoundingClientRect();
    const to = frame.getBoundingClientRect();
    // The frame itself stays untransformed, so its geometry remains stable.
    return `translate(${from.left + from.width / 2 - to.left - to.width / 2}px, ${from.top + from.height / 2 - to.top - to.height / 2}px) scale(${from.width / to.width})`;
  }
  const photo = frame.querySelector('img');
  function open(pin = false) {
    pinned = pinned || pin;
    if (opened) return;
    opened = true; clearTimeout(timer); const id = ++generation;
    preview.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    photo.style.transition = 'none';
    photo.style.transform = reduced.matches ? 'none' : originTransform();
    photo.getBoundingClientRect();
    requestAnimationFrame(() => {
      if (!opened || id !== generation) return;
      photo.style.transition = '';
      preview.classList.add('is-open');
      photo.style.transform = 'translate(0,0) scale(1)';
    });
  }
  function close() {
    if (!opened) return;
    opened = false; pinned = false; ++generation;
    trigger.setAttribute('aria-expanded', 'false');
    preview.classList.remove('is-open');
    photo.style.transform = reduced.matches ? 'none' : originTransform();
    timer = setTimeout(() => { preview.hidden = true; }, reduced.matches ? 0 : 450);
  }
  trigger.addEventListener('pointerenter', () => { if (hover.matches) open(); });
  trigger.addEventListener('click', () => { if (pinned) close(); else open(true); });
  closeButton.addEventListener('click', () => { close(); trigger.focus({preventScroll:true}); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && opened) { close(); trigger.focus({preventScroll:true}); } });
  function inside(r, x, y) { return x >= r.left - 18 && x <= r.right + 18 && y >= r.top - 18 && y <= r.bottom + 18; }
  document.addEventListener('pointermove', e => {
    if (!opened || pinned || !hover.matches) return;
    if (!inside(trigger.getBoundingClientRect(), e.clientX, e.clientY) && !inside(frame.getBoundingClientRect(), e.clientX, e.clientY)) close();
  }, {passive:true});
  document.addEventListener('pointerdown', e => {
    if (opened && !trigger.contains(e.target) && !inside(frame.getBoundingClientRect(), e.clientX, e.clientY)) close();
  });
  window.addEventListener('resize', close);
  window.addEventListener('scroll', close, {passive:true});
})();
