// admin-layout.js — Inject shared components (sidebar, topbar)
'use strict';

const AdminLayout = (() => {

  /**
   * Load an HTML partial and inject into a selector.
   * @param {string} selector  - target element selector
   * @param {string} url       - path to HTML partial
   * @param {string} position  - 'beforeend' | 'afterbegin' (default: replace innerHTML)
   */
  async function loadComponent(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.warn('[AdminLayout]', err.message);
    }
  }

  async function init() {
    // Inject sidebar and topbar if placeholders exist
    const jobs = [];

    if (document.querySelector('#sidebar-placeholder')) {
      jobs.push(loadComponent('#sidebar-placeholder', 'components/admin-sidebar.html'));
    }
    if (document.querySelector('#topbar-placeholder')) {
      jobs.push(loadComponent('#topbar-placeholder', 'components/admin-topbar.html'));
    }

    await Promise.all(jobs);

    // After injecting, initialise sidebar (active state, toggle etc.)
    if (window.AdminSidebar) AdminSidebar.init();
  }

  return { init, loadComponent };
})();

document.addEventListener('DOMContentLoaded', () => AdminLayout.init());
