/* provider-kontribusi.js — Dampak & Kontribusi interactions */
(function () {

  /* ── Count-up animation ── */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();
    const isDecimal = String(target).includes('.');
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(2) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('[data-count]').forEach(animateCount);

  /* ── Animate progress bars ── */
  requestAnimationFrame(() => {
    document.querySelectorAll('.impact-bar-fill[data-width]').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200);
    });
    // rank progress
    const rankFill = document.querySelector('.rank-bar-fill[data-width]');
    if (rankFill) setTimeout(() => { rankFill.style.width = rankFill.dataset.width + '%'; }, 300);
  });

  /* ── Monthly chart bars ── */
  const monthlyData = [320, 410, 380, 490, 560, 620, 510, 580, 650, 720, 690, 760]; // kg
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  const max = Math.max(...monthlyData);
  const container = document.getElementById('monthlyBarsContainer');
  if (container) {
    container.innerHTML = monthlyData.map((val, i) => {
      const heightPct = (val / max) * 100;
      const isActive = i === 10; // November as current
      return `
        <div class="monthly-bar-col">
          <div class="monthly-bar${isActive ? ' active' : ''}"
               style="height:${heightPct}%;"
               title="${val} kg — ${months[i]}"></div>
          <span class="monthly-bar-lbl">${months[i]}</span>
        </div>`;
    }).join('');
  }

})();
