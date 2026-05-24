// admin-sidebar.js — Sidebar logic (active menu, mobile toggle)
'use strict';

const AdminSidebar = (() => {

  /** Mark active nav item based on current page filename */
  function setActiveNav() {
    const currentPage = location.pathname.split('/').pop() || 'admin-dashboard.html';
    document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === currentPage);
    });
  }

  /** Mobile sidebar toggle */
  function initToggle() {
    const sidebar  = document.querySelector('.admin-sidebar');
    const overlay  = document.querySelector('.sidebar-overlay');
    const menuBtn  = document.querySelector('.mobile-menu-btn');

    if (!sidebar) return;

    function open()  { sidebar.classList.add('open');  overlay?.classList.add('active'); }
    function close() { sidebar.classList.remove('open'); overlay?.classList.remove('active'); }

    menuBtn?.addEventListener('click', open);
    overlay?.addEventListener('click', close);

    // Close on nav click (mobile)
    sidebar.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1024) close();
      });
    });
  }

  /** Navigate to page on nav click */
  function initNavigation() {
    document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page && !item.classList.contains('active')) {
          window.location.href = page;
        }
      });
    });
  }

  function init() {
    setActiveNav();
    initToggle();
    initNavigation();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  // setActiveNav and initNavigation don't depend on navbar DOM
  AdminSidebar.init();
});

// Re-init toggle after admin-navbar.js injects the hamburger button
document.addEventListener('navbar:ready', () => {
  const sidebar = document.querySelector('.admin-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const menuBtn = document.querySelector('.mobile-menu-btn');

  if (!sidebar || !menuBtn) return;

  function open()  { sidebar.classList.add('open');    overlay?.classList.add('active'); }
  function close() { sidebar.classList.remove('open'); overlay?.classList.remove('active'); }

  menuBtn.addEventListener('click', open);
  overlay?.addEventListener('click', close);

  sidebar.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => { if (window.innerWidth <= 1024) close(); });
  });
});
