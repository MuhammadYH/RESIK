/**
 * pengolah-notification-badge.js
 * ─────────────────────────────────────────────────────────────
 * Global realtime notification badge untuk semua halaman Pengolah.
 *
 * Cara kerja:
 *  1. Ambil roleId dari getUserContext() (disediakan oleh role-check.js)
 *  2. Hitung jumlah baris waste_provider dengan:
 *       - target_role_id = roleId
 *       - status         = 'incoming'
 *  3. Tampilkan / sembunyikan #sidebar-notif-badge
 *  4. Subscribe realtime event='*' → refresh badge setiap ada perubahan
 *
 * Dipanggil oleh SEMUA halaman Pengolah — cukup sertakan file ini
 * setelah role-check.js dimuat.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── State ────────────────────────────────────────────────── */
  let _roleId          = null;
  let _realtimeChannel = null;
  let _refreshTimer    = null;   // debounce handle

  /* ── DOM helper ───────────────────────────────────────────── */
  function _updateBadgeDOM(count) {
    const badge = document.getElementById('sidebar-notif-badge');
    if (!badge) return;

    if (count > 0) {
      badge.textContent    = count;
      badge.style.display  = '';          // tampilkan
    } else {
      badge.textContent    = '';
      badge.style.display  = 'none';      // sembunyikan
    }
  }

  /* ── Fetch & update badge ─────────────────────────────────── */
  async function refreshBadge() {
    if (!_roleId) return;

    try {
      const sb = await getSupabase();   // dari resik-supabase.js

      const { count, error } = await sb
        .from('waste_provider')
        .select('id', { count: 'exact', head: true })
        .eq('target_role_id', _roleId)
        .eq('status', 'incoming');

      if (error) {
        console.warn('[notification-badge] query error:', error.message);
        return;
      }

      _updateBadgeDOM(count ?? 0);

    } catch (err) {
      console.warn('[notification-badge] refreshBadge error:', err);
    }
  }

  /* ── Debounced refresh (hindari burst dari realtime) ─────── */
  function _debouncedRefresh(delay) {
    clearTimeout(_refreshTimer);
    _refreshTimer = setTimeout(refreshBadge, delay ?? 300);
  }

  /* ── Realtime subscription ────────────────────────────────── */
  async function _subscribeRealtime() {
    if (!_roleId) return;

    try {
      const sb = await getSupabase();

      // Bersihkan channel lama bila ada (misal halaman di-reload lunak)
      if (_realtimeChannel) {
        await sb.removeChannel(_realtimeChannel);
        _realtimeChannel = null;
      }

      _realtimeChannel = sb
        .channel('global-notif-badge-' + _roleId)
        .on(
          'postgres_changes',
          {
            event:  '*',              // INSERT, UPDATE, DELETE
            schema: 'public',
            table:  'waste_provider',
            filter: `target_role_id=eq.${_roleId}`,
          },
          (payload) => {
            /*
             * Refresh badge pada setiap perubahan yang berhubungan
             * dengan status 'incoming' — baik record baru (INSERT),
             * perubahan status (UPDATE), maupun penghapusan (DELETE).
             *
             * Karena 1 BIN = 1 RECORD, tombol Simpan Provider bisa
             * melakukan INSERT atau UPDATE; keduanya ditangkap di sini.
             */
            const newStatus = payload.new  && payload.new.status;
            const oldStatus = payload.old  && payload.old.status;

            const relevant  =
              newStatus === 'incoming' ||   // record baru / status berubah menjadi incoming
              oldStatus === 'incoming';     // record yang tadinya incoming berubah / dihapus

            if (relevant) {
              _debouncedRefresh(250);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.info('[notification-badge] realtime connected, roleId =', _roleId);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.warn('[notification-badge] realtime status:', status, '— akan retry…');
            // Coba reconnect setelah jeda singkat
            setTimeout(_subscribeRealtime, 5000);
          }
        });

    } catch (err) {
      console.warn('[notification-badge] subscribe error:', err);
    }
  }

  /* ── Bootstrap ────────────────────────────────────────────── */
  async function _init() {
    try {
      /*
       * getUserContext() disediakan oleh role-check.js.
       * Pastikan role-check.js sudah dimuat sebelum file ini.
       */
      if (typeof getUserContext !== 'function') {
        console.warn('[notification-badge] getUserContext() tidak ditemukan. ' +
                     'Pastikan role-check.js dimuat sebelum pengolah-notification-badge.js.');
        return;
      }

      const ctx = await getUserContext();
      _roleId   = ctx && ctx.roleId;

      if (!_roleId) {
        console.warn('[notification-badge] roleId kosong — badge tidak diaktifkan.');
        return;
      }

      // Langsung fetch satu kali saat halaman terbuka
      await refreshBadge();

      // Kemudian subscribe realtime
      await _subscribeRealtime();

    } catch (err) {
      console.warn('[notification-badge] init error:', err);
    }
  }

  /* ── Jalankan setelah DOM siap ────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  /* ── Ekspor publik (opsional, untuk debugging) ───────────── */
  window.PengolahNotifBadge = {
    refresh: refreshBadge,
  };

})();
