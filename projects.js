(() => {
  const triggers = [...document.querySelectorAll('.year-trigger')];
  const hover = matchMedia('(hover:hover) and (pointer:fine)');
  function closePreviews(except) {
    triggers.forEach(t => {
      if (t === except) return;
      document.getElementById(t.getAttribute('aria-controls')).hidden = true;
      t.setAttribute('aria-expanded', 'false');
      t.closest('.education-node').classList.remove('preview-open');
    });
  }
  triggers.forEach(trigger => {
    const node = trigger.closest('.education-node');
    node.removeAttribute('tabindex');
    const popup = document.getElementById(trigger.getAttribute('aria-controls'));
    let timer;
    function open() {
      popup.style.top = matchMedia('(max-width:700px)').matches ? '' : `${trigger.offsetTop + trigger.offsetHeight + 8}px`;
      clearTimeout(timer); closePreviews(trigger); popup.hidden = false;
      trigger.setAttribute('aria-expanded','true'); node.classList.add('preview-open');
    }
    trigger.addEventListener('pointerenter', () => { if (hover.matches) open(); });
    trigger.addEventListener('focus', open);
    trigger.addEventListener('click', open);
    node.addEventListener('pointerenter', () => clearTimeout(timer));
    node.addEventListener('pointerleave', () => {
      if (hover.matches && !node.contains(document.activeElement)) timer = setTimeout(() => {
        popup.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        node.classList.remove('preview-open');
      }, 320);
    });
    node.addEventListener('focusout', () => setTimeout(() => {
      if (!node.contains(document.activeElement)) closePreviews();
    },0));
    popup.querySelector('.popover-close').addEventListener('click', () => { closePreviews(); trigger.focus(); closePreviews(); });
  });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.education-node')) closePreviews(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePreviews(); });
  let returnFocus;
  document.querySelectorAll('[data-gallery]').forEach(button => {
    button.addEventListener('click', () => {
      returnFocus = button.closest('.education-node').querySelector('.year-trigger');
      closePreviews();
      const dialog = document.getElementById('gallery-' + button.dataset.gallery);
      dialog.showModal(); dialog.scrollTop = 0;
      document.body.classList.add('gallery-open');
    });
  });
  document.querySelectorAll('.project-dialog').forEach(dialog => {
    dialog.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('gallery-open'); returnFocus?.focus(); closePreviews();
    });
    dialog.querySelectorAll('.gallery-project-nav a').forEach(link => link.addEventListener('click', e => {
      e.preventDefault();
      const section = document.getElementById(link.getAttribute('href').slice(1));
      dialog.scrollTo({top: section.offsetTop - 115, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
    }));
  });
})();
