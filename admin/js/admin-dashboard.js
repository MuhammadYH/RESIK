// admin-dashboard.js — Dashboard page logic
'use strict';

const AdminDashboard = (() => {

  /** Animate stat numbers counting up */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const duration = 800;
      const start    = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const current  = target * ease;
        el.textContent = Number.isInteger(target)
          ? Math.round(current) + suffix
          : current.toFixed(2) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  /** Simple SVG donut (no external library) */
  function renderDonut(svgSelector, segments) {
    const svg = document.querySelector(svgSelector);
    if (!svg) return;

    const R   = 60;
    const CX  = 80;
    const CY  = 80;
    let total = segments.reduce((s, x) => s + x.value, 0);
    let angle = -90; // start top

    svg.innerHTML = '';

    // Background circle
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bg.setAttribute('cx', CX); bg.setAttribute('cy', CY);
    bg.setAttribute('r', R); bg.setAttribute('fill', 'none');
    bg.setAttribute('stroke', '#F0F0F0'); bg.setAttribute('stroke-width', '18');
    svg.appendChild(bg);

    segments.forEach(seg => {
      const pct   = seg.value / total;
      const sweep = pct * 360;
      const rad   = (a) => (a * Math.PI) / 180;
      const x1 = CX + R * Math.cos(rad(angle));
      const y1 = CY + R * Math.sin(rad(angle));
      const x2 = CX + R * Math.cos(rad(angle + sweep));
      const y2 = CY + R * Math.sin(rad(angle + sweep));
      const large = sweep > 180 ? 1 : 0;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', seg.color);
      path.setAttribute('stroke-width', '18');
      path.setAttribute('stroke-linecap', 'round');
      svg.appendChild(path);

      angle += sweep;
    });

    // Center text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', CX); text.setAttribute('y', CY - 6);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '22'); text.setAttribute('font-weight', '800');
    text.setAttribute('fill', '#1A1A2E'); text.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
    text.textContent = total;
    svg.appendChild(text);

    const sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sub.setAttribute('x', CX); sub.setAttribute('y', CY + 14);
    sub.setAttribute('text-anchor', 'middle');
    sub.setAttribute('font-size', '11'); sub.setAttribute('fill', '#9CA3AF');
    sub.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
    sub.textContent = 'Total';
    svg.appendChild(sub);
  }

  function init() {
    animateCounters();

    // Example donut — pengiriman bulan ini
    renderDonut('#donut-pengiriman', [
      { value: 12, color: '#2E7D32' },
      { value: 4,  color: '#F57C00' },
      { value: 2,  color: '#1565C0' },
    ]);
  }

  return { init, renderDonut };
})();

document.addEventListener('DOMContentLoaded', () => AdminDashboard.init());
