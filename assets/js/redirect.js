/**
 * redirect.js
 * Location: /assets/js/redirect.js
 *
 * Transit routing logic. Reads session, determines role,
 * and sends the user to the correct dashboard.
 *
 * Dependencies:
 *   - /assets/js/resik-supabase.js  (exposes getSupabase() function)
 */

(function () {
  'use strict';

  /* ─── Role → default landing page map ──────────────────────────── */
  const ROLE_DEFAULTS = {
    admin:    '/admin/admin-dashboard.html',
    provider: '/provider/provider-dashboard.html',
    pengolah: '/pengolah/pengolah-dashboard.html',
    buyer:    '/buyer/buyer-marketplace.html',
  };

  /* ─── DOM helpers ───────────────────────────────────────────────── */
  const $loading  = document.getElementById('loadingState');
  const $error    = document.getElementById('errorState');
  const $status   = document.getElementById('statusMsg');
  const $errTitle = document.getElementById('errorTitle');
  const $errMsg   = document.getElementById('errorMsg');

  function setStatus(msg) {
    if ($status) $status.textContent = msg;
  }

  function showError(title, msg) {
    if ($loading)  $loading.classList.add('hidden');
    if ($error)    $error.classList.add('visible');
    if ($errTitle) $errTitle.textContent = title || 'Akses Ditolak';
    if ($errMsg)   $errMsg.textContent   = msg   || 'Terjadi kesalahan.';
  }

  /* ─── Safe redirect (prevents open-redirect abuse) ─────────────── */
  function safeRedirect(url) {
    if (!url || !url.startsWith('/')) {
      showError('Redirect Tidak Valid', 'URL tujuan tidak dikenali.');
      return;
    }
    window.location.replace(url);
  }

  /* ─── Main routing entry point ──────────────────────────────────── */
  async function routeByRole() {
    try {
      setStatus('Memeriksa sesi…');

      // ── 1. Gunakan getSupabase() dari resik-supabase.js ──────────
      if (typeof getSupabase !== 'function') {
        throw new Error('getSupabase tidak ditemukan. Pastikan resik-supabase.js dimuat sebelum redirect.js.');
      }
      const client = await getSupabase();

      // ── 2. Get session ───────────────────────────────────────────
      const { data: { session } } = await client.auth.getSession();

      if (!session || !session.user) {
        setStatus('Sesi tidak ditemukan, mengalihkan ke login…');
        setTimeout(() => safeRedirect('/login.html'), 800);
        return;
      }

      setStatus('Membaca role pengguna…');

      // ── 3. Read role from session metadata ───────────────────────
      const role =
        session.user?.user_metadata?.role ||
        session.user?.app_metadata?.role   ||
        null;

      if (!role) {
        showError('Role Tidak Ditemukan', 'Akun Anda belum memiliki role. Hubungi administrator.');
        return;
      }

      const normalizedRole = role.toLowerCase().trim();

      // ── 4. Look up destination ───────────────────────────────────
      const destination = ROLE_DEFAULTS[normalizedRole];

      if (!destination) {
        showError(
          'Role Tidak Dikenal',
          `Role "${role}" tidak terdaftar dalam sistem. Hubungi administrator.`
        );
        return;
      }

      setStatus(`Mengalihkan sebagai ${normalizedRole}…`);

      // ── 5. Honour ?next= param (for post-login deep links) ───────
      const params     = new URLSearchParams(window.location.search);
      const nextRaw    = params.get('next');
      const roleFolder = `/${normalizedRole}/`;

      let target = destination;

      if (nextRaw && nextRaw.startsWith(roleFolder)) {
        target = nextRaw;
      }

      setTimeout(() => safeRedirect(target), 300);

    } catch (err) {
      console.error('[redirect.js]', err);
      showError('Terjadi Kesalahan', err.message || 'Gagal memuat sesi. Coba lagi.');
    }
  }

  /* ─── Boot ──────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', routeByRole);
  } else {
    routeByRole();
  }

})();
