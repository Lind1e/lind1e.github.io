(() => {
  const diagrams = [...document.querySelectorAll('[data-diagram]')];
  const ns = 'http://www.w3.org/2000/svg';
  function draw(container) {
    container.querySelector(':scope > .connector-layer')?.remove();
    const bounds = container.getBoundingClientRect();
    const nodes = [...container.querySelectorAll('.diagram-node')];
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('connector-layer');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const rect = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - bounds.left, y: r.top - bounds.top, w: r.width, h: r.height };
    };
    const route = (d, i) => {
      ['connector-base', 'connector-flow'].forEach(cls => {
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', cls);
        path.dataset.node = i;
        if (cls === 'connector-base') path.setAttribute('pathLength', '1');
        svg.append(path);
      });
    };
    const type = container.dataset.diagram;
    const mobile = matchMedia('(max-width:700px)').matches;
    nodes.forEach((node, i) => {
      node.style.setProperty('--node-index', i);
      const r = rect(node);
      if (type === 'timeline') {
        const previousY = i ? rect(nodes[i - 1]).y + 35 : r.y + 35;
        route(`M 0 ${previousY} V ${r.y + 35} H ${r.x}`, i);
      } else if (type === 'education') {
        if (mobile) {
          const previousY = i ? rect(nodes[i - 1]).y + 28 : r.y + 28;
          route(`M 0 ${previousY} V ${r.y + 28} H ${r.x}`, i);
        } else {
          const x = r.x + r.w / 2;
          const previousX = i ? rect(nodes[i - 1]).x + rect(nodes[i - 1]).w / 2 : x;
          route(`M ${previousX} 7 H ${x} V ${r.y}`, i);
        }
      } else {
        if (i === 0) return;
        const twoColumns = !mobile && matchMedia('(max-width:1000px)').matches;
        const previous = rect(nodes[twoColumns && i === 2 ? 0 : i - 1]);
        if (mobile || (twoColumns && i === 2)) {
          const x = previous.x + previous.w / 2;
          const targetX = r.x + r.w / 2;
          const midway = (previous.y + previous.h + r.y) / 2;
          route(`M ${x} ${previous.y + previous.h} V ${midway} H ${targetX} V ${r.y}`, i);
        } else {
          const fromY = previous.y + previous.h / 2;
          const toY = r.y + r.h / 2;
          const midwayX = (previous.x + previous.w + r.x) / 2;
          route(`M ${previous.x + previous.w} ${fromY} H ${midwayX} V ${toY} H ${r.x}`, i);
        }
      }
    });
    container.prepend(svg);
  }
  diagrams.forEach(container => {
    draw(container);
    const nodes = [...container.querySelectorAll('.diagram-node')];
    function highlight(node, active) {
      const i = nodes.indexOf(node);
      container.querySelectorAll(`path[data-node="${i}"]`).forEach(p => p.classList.toggle('is-highlighted', active));
    }
    nodes.forEach(node => {
      node.addEventListener('pointerenter', () => highlight(node, true));
      node.addEventListener('pointerleave', () => highlight(node, false));
      node.addEventListener('focus', () => highlight(node, true));
      node.addEventListener('blur', () => highlight(node, false));
    });
  });
  document.documentElement.classList.add('diagram-ready');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }), { threshold: 0.08 });
    diagrams.forEach(d => observer.observe(d));
  } else diagrams.forEach(d => d.classList.add('is-visible'));
  let frame;
  function redraw() { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => diagrams.forEach(draw)); }
  window.addEventListener('resize', redraw);
  window.addEventListener('load', redraw);
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(redraw);
    diagrams.forEach(d => resizeObserver.observe(d));
  }
  document.fonts?.ready.then(redraw);
})();
