(() => {
  const button = document.querySelector('.mobile-avatar-button');
  const dialog = document.querySelector('#mobile-portrait-dialog');
  const mobile = matchMedia('(max-width:700px)');
  button.addEventListener('click', () => {
    if (mobile.matches) dialog.showModal();
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { if (mobile.matches) button.focus({preventScroll:true}); });
  mobile.addEventListener('change', () => { if (!mobile.matches && dialog.open) dialog.close(); });
})();
