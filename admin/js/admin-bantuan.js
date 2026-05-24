// admin-bantuan.js — Bantuan page logic
'use strict';

const AdminBantuan = (() => {

  // ── FAQ DATA ──
  const FAQS = [
    {
      q: 'Bagaimana cara menambahkan smart bin baru?',
      a: 'Untuk menambahkan smart bin baru, masuk ke halaman Smart Bin lalu klik tombol "Tambah Smart Bin" di pojok kanan atas. Isi formulir dengan informasi lokasi, kapasitas, dan ID perangkat. Setelah disimpan, smart bin akan aktif secara otomatis dan mulai mengirim data sensor.'
    },
    {
      q: 'Bagaimana cara melihat riwayat pengiriman?',
      a: 'Anda dapat melihat seluruh riwayat pengiriman di halaman Riwayat. Gunakan filter "Jenis Aktivitas" dan pilih "Pengiriman" untuk menampilkan hanya aktivitas pengiriman. Data dapat dieksport dalam format CSV atau PDF.'
    },
    {
      q: 'Bagaimana cara mengunduh laporan?',
      a: 'Buka halaman Laporan, pilih rentang tanggal dan jenis laporan yang diinginkan, lalu klik tombol "Unduh" atau "Export". Laporan tersedia dalam format PDF dan Excel. Laporan otomatis juga dikirim ke email admin setiap hari pada pukul 07.00 WIB.'
    },
    {
      q: 'Apa arti status smart bin (Online / Offline)?',
      a: 'Status Online berarti smart bin terhubung ke sistem dan mengirim data secara real-time. Status Offline berarti perangkat tidak terhubung — bisa disebabkan oleh masalah jaringan, daya, atau kerusakan sensor. Jika offline lebih dari 1 jam, sistem akan mengirim notifikasi otomatis.'
    },
    {
      q: 'Bagaimana jika sensor smart bin tidak berfungsi?',
      a: 'Pertama, periksa koneksi jaringan di lokasi smart bin. Jika koneksi baik namun sensor masih tidak berfungsi, hubungi tim teknisi melalui WhatsApp atau email support. Sertakan ID Smart Bin dan deskripsi masalah agar penanganan lebih cepat.'
    },
  ];

  // ── PANDUAN ──
  const PANDUAN = [
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>`,
      title: 'Tambah Smart Bin',
      desc: 'Pelajari cara menambahkan smart bin baru ke sistem.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
      title: 'Kelola Pengiriman',
      desc: 'Ketahui cara memantau dan mengelola pengiriman sampah.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      title: 'Lihat Laporan',
      desc: 'Pelajari cara melihat dan mengunduh laporan.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
      title: 'Kelola Notifikasi',
      desc: 'Atur preferensi notifikasi sesuai kebutuhan Anda.',
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      title: 'Pengaturan Akun',
      desc: 'Kelola informasi akun dan pengaturan sistem.',
    },
  ];

  // ── RENDER PANDUAN ──
  function renderPanduan() {
    const grid = document.getElementById('panduan-grid');
    if (!grid) return;
    grid.innerHTML = PANDUAN.map(item => `
      <div class="panduan-card">
        <div class="panduan-icon-wrap">${item.icon}</div>
        <div class="panduan-title">${item.title}</div>
        <div class="panduan-desc">${item.desc}</div>
        <span class="panduan-arrow">→</span>
      </div>
    `).join('');
  }

  // ── RENDER FAQ ──
  function renderFAQ() {
    const container = document.getElementById('faq-list');
    if (!container) return;
    container.innerHTML = FAQS.map((faq, i) => `
      <div class="faq-item" data-index="${i}">
        <div class="faq-question">
          <span>${faq.q}</span>
          <span class="faq-chevron">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
        <div class="faq-answer">${faq.a}</div>
      </div>
    `).join('');

    // Accordion toggle
    container.querySelectorAll('.faq-item').forEach(item => {
      item.querySelector('.faq-question').addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        container.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // ── SEARCH ──
  function initSearch() {
    const input = document.getElementById('bantuan-search');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      if (!q) {
        document.querySelectorAll('.faq-item').forEach(el => el.style.display = '');
        return;
      }
      document.querySelectorAll('.faq-item').forEach(el => {
        const text = el.textContent.toLowerCase();
        el.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // ── INIT ──
  function init() {
    renderPanduan();
    renderFAQ();
    initSearch();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => AdminBantuan.init());
