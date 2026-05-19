# 🌿 Panduan Pemasangan RESIK AI Assistant

## File yang Kamu Terima

| File | Peran |
|------|-------|
| `01CONTACT.html` | Halaman kontak yang sudah dimodifikasi (siap pakai) |
| `resik-ai.css`   | Style tambahan untuk AI (tidak mengubah desain lama) |
| `resik-ai.js`    | Logika AI assistant + integrasi Gemini API |
| `PANDUAN.md`     | File ini |

---

## Cara 1 — Langsung Pakai (Paling Mudah)

Cukup **ganti** file `01CONTACT.html` lama kamu dengan file baru ini,
lalu **tambahkan** `resik-ai.css` dan `resik-ai.js` ke folder yang sama.

Struktur folder kamu seharusnya:
```
📁 project/
  ├── 01CONTACT.html      ← ganti dengan versi baru
  ├── resik-ai.css        ← file baru, tambahkan
  ├── resik-ai.js         ← file baru, tambahkan
  ├── resik-main.css      ← tidak berubah
  ├── resik-shared.js     ← tidak berubah
  └── image_0.png         ← tidak berubah
```

---

## Cara 2 — Pasang Manual ke HTML Lama (Jika Tidak Ingin Ganti File)

Jika kamu ingin memodifikasi file HTML lama sendiri, ikuti 4 langkah ini:

### Langkah 1 — Tambahkan link CSS di `<head>`
Cari baris ini di `<head>`:
```html
<link rel="stylesheet" href="resik-main.css">
```
Tambahkan tepat **di bawahnya**:
```html
<link rel="stylesheet" href="resik-ai.css">
```

---

### Langkah 2 — Tambahkan label AI di atas search bar
Cari bagian hero section, tepat **di atas** `<div class="hero-search">`:
```html
<div class="hero-search fu fu-4">
```
Sisipkan blok ini tepat di atasnya:
```html
<!-- [RESIK AI] Label -->
<div class="ai-label-wrap fu fu-4">
  <div class="ai-label">
    <span class="ai-label-dot"></span>
    RESIK AI — Online
  </div>
</div>
```

---

### Langkah 3 — Ubah input & tambahkan area response
**Ganti** blok hero-search lama:
```html
<div class="hero-search fu fu-4">
  <input type="text" placeholder="Cari pertanyaan..." id="searchInput" oninput="searchFAQ(this.value)">
  <button class="hero-search-btn">Cari</button>
</div>
</section>
```
**Dengan** blok baru ini:
```html
<div class="hero-search fu fu-4">
  <input type="text" placeholder="Tanya RESIK AI — &quot;Bagaimana cara daftar?&quot;" id="searchInput">
  <button class="hero-search-btn">Tanya AI</button>
</div>

<!-- [RESIK AI] Area response AI -->
<div class="ai-response-area" id="aiResponseArea">
  <div class="ai-response-card">
    <div class="ai-response-header">
      <div class="ai-avatar">🌿</div>
      <div>
        <div class="ai-name">RESIK AI</div>
        <div class="ai-tagline">Asisten virtual platform RESIK</div>
      </div>
    </div>
    <div class="ai-loading" id="aiLoading">
      <div class="ai-loading-dot"></div>
      <div class="ai-loading-dot"></div>
      <div class="ai-loading-dot"></div>
      <span class="ai-loading-text">Sedang berpikir...</span>
    </div>
    <div class="ai-response-body" id="aiResponseBody"></div>
  </div>
</div>

</section>
```

---

### Langkah 4 — Tambahkan script sebelum `</body>`
Cari baris ini di bagian bawah file, sebelum `</body>`:
```html
<script src="resik-shared.js"></script>
```
Tambahkan **di atasnya**:
```html
<script src="resik-ai.js" defer></script>
```

---

## Langkah 5 — Pasang API Key Gemini (Wajib untuk AI Sungguhan)

1. Buka file `resik-ai.js`
2. Cari baris ini di bagian atas:
   ```js
   const GEMINI_API_KEY = 'GANTI_DENGAN_API_KEY_KAMU';
   ```
3. Ganti `GANTI_DENGAN_API_KEY_KAMU` dengan API key-mu dari:
   👉 https://aistudio.google.com/app/apikey
4. Simpan file.

> **Tanpa API key**, RESIK AI tetap bekerja menggunakan
> **fallback responses** (jawaban lokal berbasis kata kunci).
> Cocok untuk testing sebelum API key siap.

---

## Yang Tidak Berubah ✅

| Fitur | Status |
|-------|--------|
| FAQ accordion (buka/tutup) | ✅ Tidak berubah |
| Filter FAQ per kategori | ✅ Tidak berubah |
| Formulir kontak + Supabase | ✅ Tidak berubah |
| Navbar + Hamburger mobile | ✅ Tidak berubah |
| Footer | ✅ Tidak berubah |
| Animasi scroll (resik-shared.js) | ✅ Tidak berubah |
| Semua class CSS existing | ✅ Tidak berubah |

---

## Cara Kerja Singkat

```
Pengguna ketik pertanyaan
        ↓
Klik "Tanya AI" atau tekan Enter
        ↓
Loading animation muncul (tiga titik)
        ↓
     API key ada?
    ↙          ↘
  Ya             Tidak / Error
  ↓                    ↓
Gemini API        Fallback lokal
  ↓                    ↓
     Jawaban muncul di card
        ↓
Tombol "Tanya pertanyaan lain" → reset
```

---

## Pertanyaan Umum

**Q: Apakah FAQ search masih bisa dipakai?**
A: Ya. Fungsi `searchFAQ()` masih ada di kode. AI tidak menghapusnya,
hanya melepas koneksi `oninput` dari input agar tidak dipicu setiap ketikan.
Kamu masih bisa memanggil `searchFAQ()` secara manual.

**Q: Apakah ada biaya Gemini API?**
A: Gemini 2.0 Flash memiliki free tier yang cukup besar untuk website
skala kecil-menengah. Cek detailnya di https://ai.google.dev/pricing

**Q: Bagaimana cara menambah jawaban fallback?**
A: Buka `resik-ai.js`, temukan array `FALLBACK_RESPONSES`, dan
tambahkan objek baru dengan format:
```js
{
  keywords: ['kata1', 'kata2'],
  answer: 'Jawaban kamu di sini.'
}
```

**Q: Bisakah diubah ke AI lain selain Gemini?**
A: Bisa. Ubah fungsi `callGeminiAPI()` di `resik-ai.js` untuk
memanggil endpoint API yang berbeda (OpenAI, Claude, dll).
Struktur kode sudah dirancang mudah diganti.
