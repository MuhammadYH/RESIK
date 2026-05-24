
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();

  // Auto active navbar
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Simple session persistence
  const protectedPages = ['dashboard.html'];
  const token = localStorage.getItem('resik_session');

  if (protectedPages.includes(currentPage) && !token) {
    window.location.href = 'login.html';
  }

  if ((currentPage === 'login.html' || currentPage === 'register.html') && token) {
    window.location.href = 'dashboard.html';
  }

  // Better logout handler
  const logoutBtn = document.querySelector('[data-resik-logout]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('resik_session');
      window.location.href = 'login.html';
    });
  }

  // Smooth page transition
  document.body.classList.add('resik-loaded');
});
