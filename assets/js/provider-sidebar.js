/* provider-sidebar.js — Sidebar toggle for provider role */
(function () {
  const sidebar  = document.getElementById('adminSidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const menuBtns = document.querySelectorAll('.mobile-menu-btn');

  function openSidebar()  { sidebar?.classList.add('open');    overlay?.classList.add('active'); }
  function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('active'); }

  menuBtns.forEach(btn => btn.addEventListener('click', openSidebar));
  overlay?.addEventListener('click', closeSidebar);

  // Active nav highlight
  const currentPage = location.pathname.split('/').pop() || 'provider-dashboard.html';
  document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
    if (item.dataset.page === currentPage) item.classList.add('active');
    else item.classList.remove('active');
  });
})();
