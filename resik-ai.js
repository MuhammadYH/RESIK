/* ════════════════════════════════════════════════════════
   resik-ai.js — RESIK AI Assistant v2.0 (Vanilla JavaScript)
   Fitur baru v2:
   ✅ Multi-turn conversation (riwayat percakapan)
   ✅ Quick question chips (pertanyaan cepat satu klik)
   ✅ Typing effect pada teks jawaban
   ✅ Markdown sederhana (bold, bullet)
   ✅ Tombol scroll-to-response otomatis
   ✅ Fallback cerdas jika API gagal
   ════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     ▶ KONFIGURASI
     ══════════════════════════════════════════════════════ */

  // 🔑 API KEY GEMINI — RESIK AI Project
  const GEMINI_API_KEY = 'AIzaSyDZWghhq3lrvJHy9wZKrDgPlLy7JmAG5IE';

  // Model Gemini yang digunakan
  const GEMINI_MODEL = 'gemini-2.0-flash';

  // Endpoint API
  const GEMINI_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // Kecepatan efek mengetik (ms per karakter). Kecilkan = lebih cepat.
  const TYPING_SPEED_MS = 12;

  /* ══════════════════════════════════════════════════════
     ▶ STATE — riwayat percakapan multi-turn
     ══════════════════════════════════════════════════════ */

  // Array ini menyimpan seluruh riwayat chat dalam sesi ini.
  // Format: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
  let conversationHistory = [];

  /* ══════════════════════════════════════════════════════
     ▶ SYSTEM PROMPT
     ══════════════════════════════════════════════════════ */
  const SYSTEM_PROMPT = `
You are RESIK AI, the official AI assistant of RESIK,
an Indonesian climate-tech platform focused on intelligent
food waste management and sustainable urban operations.

Your role is NOT merely answering FAQs.

Your role is to:
- guide users intelligently
- diagnose problems
- reduce confusion
- make users feel assisted by a smart human operator
- adapt communication style dynamically
- think before responding
- maintain conversational continuity
- provide operational clarity
- increase user trust toward the RESIK platform

==================================================
CORE BEHAVIOR
==================================================

Always behave like:
- an experienced operations assistant
- a product expert
- a support specialist
- and a calm human guide

Never sound robotic, generic, repetitive, or scripted.

Avoid:
- overly formal language
- repetitive greetings
- shallow answers
- vague instructions
- unnecessary apologies
- answering too quickly without understanding intent

==================================================
RESPONSE STRATEGY
==================================================

Before answering:
1. infer user intent
2. infer emotional state
3. infer technical understanding
4. identify what the user actually needs
5. decide the best response strategy

Possible response strategies:
- educate
- reassure
- troubleshoot
- simplify
- summarize
- ask clarification
- step-by-step guidance
- operational instruction
- escalation suggestion

Never use the same strategy for every question.

==================================================
WHEN USERS HAVE PROBLEMS
==================================================

If user reports an issue:
- do NOT instantly blame the system
- do NOT instantly give generic fixes

Instead:
1. identify likely causes
2. narrow possibilities
3. guide progressively
4. explain WHY something may happen
5. provide actionable next steps

Good support feels diagnostic, not scripted.

==================================================
WHEN USER IS CONFUSED
==================================================

If the user seems confused:
- simplify explanations
- avoid jargon
- use examples or analogies
- break answers into small steps

==================================================
WHEN USER IS UPSET
==================================================

If the user sounds frustrated:
- remain calm
- acknowledge the inconvenience naturally
- focus on solutions quickly
- avoid corporate-style empathy

Do not over-apologize.

==================================================
CONVERSATION MEMORY
==================================================

Always remember:
- previous messages
- unresolved issues
- user goals
- previous recommendations

Maintain continuity naturally.

==================================================
ANSWER STRUCTURE
==================================================

Preferred structure:
1. direct answer
2. brief explanation
3. actionable next step
4. optional follow-up question

Avoid long walls of text.

==================================================
STYLE
==================================================

Language:
- Indonesian
- natural
- modern
- intelligent
- concise
- warm but professional

Use formatting when useful:
- bullet points
- numbered steps
- short paragraphs

Use emojis sparingly and intentionally.

==================================================
DOMAIN KNOWLEDGE
==================================================

About RESIK:
- climate-tech startup Indonesia
- connects food providers and waste managers
- supports food redistribution
- AI-based food verification
- pickup coordination system
- dashboard management
- sustainability ecosystem

Supported user types:
- Food Provider
- Pengelola
- Admin
- Public users

Contact:
- Email: admin@resik.id (response < 24 hours)
- WhatsApp: +6281234567890 (response < 2 hours)
- Contact form on the website

Badge system:
- Green Beginner: first donation
- Eco Helper: 10+ successful donations
- Waste Warrior: 50+ successful donations

==================================================
IMPORTANT RULES
==================================================

If information is uncertain:
- say so honestly
- avoid hallucinating

If user asks outside RESIK scope:
- gently redirect back

If user asks ambiguous questions:
- ask focused clarification questions

Never fabricate:
- policies
- features
- pricing
- technical capabilities

==================================================
HIGH INTELLIGENCE CONVERSATION RULES
==================================================

A smart assistant:
- anticipates user needs
- answers beyond literal wording
- detects hidden intent
- proactively guides users
- reduces user effort
- thinks step-by-step internally
- adapts dynamically

Your goal is:
make users say:
"This AI actually understands me."
`.trim();

  /* ══════════════════════════════════════════════════════
     ▶ QUICK QUESTIONS — pertanyaan populer satu klik
     ══════════════════════════════════════════════════════ */
  const QUICK_QUESTIONS = [
    { label: '🌿 Apa itu RESIK?',          text: 'Apa itu RESIK dan bagaimana cara kerjanya?' },
    { label: '📋 Cara daftar',              text: 'Bagaimana cara mendaftar di RESIK?' },
    { label: '💰 Apakah gratis?',           text: 'Apakah RESIK gratis untuk digunakan?' },
    { label: '🚚 Sistem pickup',            text: 'Bagaimana sistem pickup food waste di RESIK?' },
    { label: '🏅 Badge & reward',           text: 'Apa itu badge Eco Contributor dan bagaimana cara mendapatkannya?' },
    { label: '🔒 Keamanan pangan',          text: 'Bagaimana RESIK memastikan keamanan makanan yang didistribusikan?' },
  ];

  /* ══════════════════════════════════════════════════════
     ▶ FALLBACK RESPONSES — jika API gagal
     ══════════════════════════════════════════════════════ */
  const FALLBACK_RESPONSES = [
    {
      keywords: ['daftar', 'registrasi', 'register', 'mulai', 'bergabung', 'signup'],
      answer: 'Untuk mendaftar, klik tombol **Daftar Gratis** di halaman utama RESIK:\n• Pilih peranmu: Food Provider atau Pengelola\n• Isi data dasar dan verifikasi email\n• Proses hanya 2–3 menit, bisa juga lewat akun Google 🎉'
    },
    {
      keywords: ['gratis', 'biaya', 'bayar', 'harga', 'tarif', 'free', 'bayar'],
      answer: '✅ RESIK **sepenuhnya gratis** untuk perorangan dan organisasi nirlaba.\n\nUntuk bisnis (restoran, kantin, hotel) tersedia **paket Pro** dengan fitur analitik lanjutan dan dukungan prioritas. Hubungi admin@resik.id untuk info lebih lanjut.'
    },
    {
      keywords: ['pickup', 'ambil', 'klaim', 'jemput', 'ambil'],
      answer: 'Alur pickup di RESIK:\n• Pengelola temukan listing di peta dashboard\n• Klik **Klaim** dan pilih jadwal pickup\n• Provider dapat notifikasi otomatis\n• Pantau status real-time: Waiting → Accepted → On the Way → ✅ Completed'
    },
    {
      keywords: ['keamanan', 'aman', 'food safety', 'layak', 'bahaya', 'basi'],
      answer: '🔒 Keamanan pangan dijaga berlapis:\n• Verifikasi AI berbasis foto setiap listing\n• Review manual oleh admin RESIK\n• Fitur **Report Listing** untuk pengguna\n• Laporan ditangani dalam < 2 jam'
    },
    {
      keywords: ['provider', 'upload', 'listing', 'makanan sisa', 'donasi'],
      answer: 'Food Provider bisa mengupload:\n• 🍱 Makanan layak konsumsi (masih baik)\n• 🕐 Makanan mendekati expired tapi aman\n• 🥦 Bahan mentah berlebih\n• 🌱 Sisa organik untuk kompos\n\nListing aktif **24 jam** dan bisa diperpanjang dari dasbor.'
    },
    {
      keywords: ['pengelola', 'verifikasi', 'organisasi', 'dokumen', 'bank sampah'],
      answer: 'Akun Pengelola memerlukan verifikasi dokumen:\n• Akta pendirian / surat izin operasional\n• KTP untuk pengelola perorangan\n• Proses verifikasi: **1–2 hari kerja** oleh tim admin RESIK ✅'
    },
    {
      keywords: ['badge', 'eco', 'warrior', 'kontributor', 'reward', 'poin'],
      answer: '🏅 Sistem badge RESIK:\n• 🌱 **Green Beginner** — donasi pertama\n• 🤝 **Eco Helper** — 10+ donasi sukses\n• ⚔️ **Waste Warrior** — 50+ donasi sukses\n\nBadge ditampilkan di profil publik dan bisa dibagikan ke media sosial!'
    },
    {
      keywords: ['kontak', 'hubungi', 'email', 'whatsapp', 'wa', 'admin', 'tim'],
      answer: 'Hubungi tim RESIK melalui:\n• 📧 Email: admin@resik.id *(< 24 jam)*\n• 💬 WhatsApp: +6281234567890 *(< 2 jam)*\n• 📋 Formulir kontak di halaman ini\n\nTim kami siap membantu 7 hari seminggu 🌿'
    },
    {
      keywords: ['resik', 'apa', 'tentang', 'platform', 'startup', 'climate'],
      answer: '🌿 **RESIK** adalah platform climate-tech Indonesia yang menghubungkan:\n• **Food Provider** (restoran, kantin, hotel) → sumber sisa makanan\n• **Pengelola** (bank sampah, panti asuhan) → penerima & pengelola\n\nTujuannya: mengurangi food waste dan mendukung kota yang lebih berkelanjutan.'
    }
  ];

  /* ══════════════════════════════════════════════════════
     ▶ HELPER: Markdown sederhana → HTML
     Mendukung: **bold**, *italic*, bullet (•/-), \n→<br>
     ══════════════════════════════════════════════════════ */
  function markdownToHtml(text) {
    // Escape karakter HTML berbahaya dulu
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold: **teks**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic: *teks*
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Bullet points: baris yang diawali • atau -
    // Kumpulkan dulu semua baris
    const lines = html.split('\n');
    let result = [];
    let inList = false;

    for (let line of lines) {
      const isBullet = /^[•\-]\s+/.test(line.trim());
      if (isBullet) {
        if (!inList) { result.push('<ul class="ai-list">'); inList = true; }
        result.push(`<li>${line.trim().replace(/^[•\-]\s+/, '')}</li>`);
      } else {
        if (inList) { result.push('</ul>'); inList = false; }
        if (line.trim()) result.push(`<p>${line}</p>`);
      }
    }
    if (inList) result.push('</ul>');

    return result.join('');
  }

  /* ══════════════════════════════════════════════════════
     ▶ HELPER: Efek mengetik (typewriter)
     ══════════════════════════════════════════════════════ */
  function typewriterEffect(container, html, onDone) {
    // Masukkan HTML ke elemen tersembunyi untuk ukur panjangnya
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const fullText = temp.innerHTML;

    container.innerHTML = '';
    let i = 0;

    // Kita "tulis" karakter per karakter — tapi karena HTML punya tag,
    // kita gunakan pendekatan: reveal innerHTML bertahap via slice
    const total = fullText.length;

    function step() {
      if (i >= total) {
        container.innerHTML = fullText; // pastikan final sempurna
        if (onDone) onDone();
        return;
      }
      // Maju 3 karakter per frame agar terasa cepat tapi smooth
      i = Math.min(i + 3, total);
      // Sementara tulis — browser akan auto-close tag terbuka
      container.innerHTML = fullText.slice(0, i);
      setTimeout(step, TYPING_SPEED_MS);
    }
    step();
  }

  /* ══════════════════════════════════════════════════════
     ▶ FALLBACK
     ══════════════════════════════════════════════════════ */
  function getFallbackAnswer(query) {
    const q = query.toLowerCase();
    for (const item of FALLBACK_RESPONSES) {
      if (item.keywords.some(k => q.includes(k))) return item.answer;
    }
    return 'Terima kasih sudah bertanya! 🌿 Untuk jawaban lebih lengkap, silakan isi formulir kontak di bawah atau hubungi kami via:\n• 📧 admin@resik.id *(< 24 jam)*\n• 💬 WA +6281234567890 *(< 2 jam)*';
  }

  /* ══════════════════════════════════════════════════════
     ▶ GEMINI API — multi-turn
     ══════════════════════════════════════════════════════ */
  async function callGeminiAPI(userQuestion) {
    // Tambahkan pesan user ke riwayat
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userQuestion }]
    });

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        // Kirim seluruh riwayat percakapan agar AI ingat konteks
        contents: conversationHistory,
        generationConfig: {
          maxOutputTokens: 512,   // lebih luas untuk jawaban diagnostik & multi-langkah
          temperature: 0.6        // lebih deliberate, kurang random
        }
      })
    });

    if (!response.ok) {
      // Keluarkan pesan user dari history jika gagal
      conversationHistory.pop();
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Respons AI kosong');

    const answer = text.trim();

    // Simpan jawaban AI ke riwayat untuk konteks berikutnya
    conversationHistory.push({
      role: 'model',
      parts: [{ text: answer }]
    });

    // Batasi riwayat max 10 pasang tanya-jawab agar tidak overload
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20);
    }

    return answer;
  }

  /* ══════════════════════════════════════════════════════
     ▶ RENDER: Buat bubble percakapan
     ══════════════════════════════════════════════════════ */
  function appendMessage(role, text, useTyping = false) {
    const chatLog = document.getElementById('aiChatLog');
    if (!chatLog) return;

    const bubble = document.createElement('div');
    bubble.className = role === 'user' ? 'ai-bubble ai-bubble-user' : 'ai-bubble ai-bubble-model';

    if (role === 'user') {
      bubble.innerHTML = `<span class="ai-bubble-text">${escapeHtml(text)}</span>`;
      chatLog.appendChild(bubble);
    } else {
      const textEl = document.createElement('span');
      textEl.className = 'ai-bubble-text';
      bubble.appendChild(textEl);
      chatLog.appendChild(bubble);

      const htmlContent = markdownToHtml(text);
      if (useTyping) {
        typewriterEffect(textEl, htmlContent, () => scrollChatToBottom());
      } else {
        textEl.innerHTML = htmlContent;
      }
    }

    scrollChatToBottom();
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function scrollChatToBottom() {
    const chatLog = document.getElementById('aiChatLog');
    if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
  }

  /* ══════════════════════════════════════════════════════
     ▶ HANDLER UTAMA: proses pertanyaan
     ══════════════════════════════════════════════════════ */
  async function handleAIQuery(questionOverride) {
    const input   = document.getElementById('searchInput');
    const sendBtn = document.querySelector('.hero-search-btn');
    const responseArea  = document.getElementById('aiResponseArea');
    const loadingBubble = document.getElementById('aiLoadingBubble');

    const question = (questionOverride || input.value).trim();
    if (!question) { input.focus(); return; }

    // Tampilkan panel jika belum terbuka
    responseArea.classList.add('ai-open');

    // Scroll hero ke panel response
    setTimeout(() => {
      responseArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    // Tampilkan bubble user
    appendMessage('user', question);

    // Kosongkan input & disable tombol
    input.value = '';
    sendBtn.disabled = true;
    sendBtn.textContent = '...';

    // Tampilkan loading bubble
    if (loadingBubble) loadingBubble.style.display = 'flex';

    let answer = '';
    try {
      answer = await callGeminiAPI(question);
    } catch (err) {
      console.warn('[RESIK AI] API gagal, fallback:', err.message);
      answer = getFallbackAnswer(question);
    }

    // Sembunyikan loading
    if (loadingBubble) loadingBubble.style.display = 'none';

    // Tampilkan jawaban AI dengan efek mengetik
    appendMessage('model', answer, true);

    // Pulihkan tombol
    sendBtn.disabled = false;
    sendBtn.textContent = 'Kirim';
    input.focus();
  }

  /* ══════════════════════════════════════════════════════
     ▶ RENDER: Bangun seluruh UI di dalam #aiResponseArea
     ══════════════════════════════════════════════════════ */
  function buildUI() {
    const area = document.getElementById('aiResponseArea');
    if (!area) return;

    // Kosongkan konten lama (dari HTML placeholder)
    area.innerHTML = '';

    area.innerHTML = `
      <div class="ai-response-card">

        <!-- Header -->
        <div class="ai-response-header">
          <div class="ai-avatar">🌿</div>
          <div class="ai-header-info">
            <div class="ai-name">RESIK AI</div>
            <div class="ai-tagline">Asisten virtual platform RESIK</div>
          </div>
          <button class="ai-clear-btn" id="aiClearBtn" title="Mulai percakapan baru">
            🔄 Reset
          </button>
        </div>

        <!-- Quick Questions chips -->
        <div class="ai-quick-wrap" id="aiQuickWrap">
          <div class="ai-quick-label">Pertanyaan populer:</div>
          <div class="ai-quick-chips" id="aiQuickChips"></div>
        </div>

        <!-- Chat log -->
        <div class="ai-chat-log" id="aiChatLog">
          <!-- Pesan pertama dari AI -->
          <div class="ai-bubble ai-bubble-model ai-bubble-greeting">
            <span class="ai-bubble-text">
              Halo! Saya <strong>RESIK AI</strong> 🌿<br>
              Ada yang ingin kamu tanyakan tentang platform RESIK,
              food waste management, atau cara bergabung?
            </span>
          </div>

          <!-- Loading bubble -->
          <div class="ai-loading-bubble" id="aiLoadingBubble" style="display:none">
            <div class="ai-loading-dot"></div>
            <div class="ai-loading-dot"></div>
            <div class="ai-loading-dot"></div>
          </div>
        </div>

      </div>
    `;

    // Render quick question chips
    const chipsContainer = document.getElementById('aiQuickChips');
    QUICK_QUESTIONS.forEach(q => {
      const chip = document.createElement('button');
      chip.className = 'ai-chip';
      chip.textContent = q.label;
      chip.addEventListener('click', () => {
        // Sembunyikan quick questions setelah dipakai
        const qw = document.getElementById('aiQuickWrap');
        if (qw) qw.style.display = 'none';
        handleAIQuery(q.text);
      });
      chipsContainer.appendChild(chip);
    });

    // Tombol reset/clear percakapan
    document.getElementById('aiClearBtn').addEventListener('click', () => {
      conversationHistory = [];
      buildUI(); // Rebuild dari awal
      const responseArea = document.getElementById('aiResponseArea');
      if (responseArea) responseArea.classList.add('ai-open');
    });
  }

  /* ══════════════════════════════════════════════════════
     ▶ INISIALISASI
     ══════════════════════════════════════════════════════ */
  function init() {
    const input   = document.getElementById('searchInput');
    const sendBtn = document.querySelector('.hero-search-btn');

    if (!input || !sendBtn) {
      console.warn('[RESIK AI] Elemen tidak ditemukan.');
      return;
    }

    // Bangun UI chat di dalam area response
    buildUI();

    // Sesuaikan placeholder & tombol
    input.setAttribute('placeholder', 'Ketik pertanyaan tentang RESIK...');
    input.classList.add('ai-mode');
    input.removeAttribute('oninput'); // lepas searchFAQ dari oninput
    sendBtn.textContent = 'Kirim';

    // Event: klik tombol
    sendBtn.addEventListener('click', e => {
      e.preventDefault();
      handleAIQuery();
    });

    // Event: tekan Enter
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAIQuery();
      }
    });

    // Event: klik area response → tampilkan jika belum
    input.addEventListener('focus', () => {
      const area = document.getElementById('aiResponseArea');
      if (area) area.classList.add('ai-open');
    });

    console.log('[RESIK AI v2] Siap. Multi-turn conversation aktif. 🌿');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
