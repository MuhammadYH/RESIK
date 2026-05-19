/**
 * modules/intentDetector.js
 * Klasifikasi intent sebelum LLM call.
 * Tidak perlu LLM — pattern matching + heuristics cukup akurat untuk domain spesifik.
 */

/* ─── Peta intent ─── */
const INTENT_PATTERNS = [
  {
    intent: 'onboarding',
    patterns: [
      /daftar|registrasi|bergabung|sign.?up|mulai|baru|cara pakai|pertama/i,
      /bagaimana cara (jadi|menjadi|mendaftar)/i
    ]
  },
  {
    intent: 'pickup_problem',
    patterns: [
      /pickup (gagal|error|masalah|tidak|belum|gak)/i,
      /gagal (klaim|pickup|ambil)/i,
      /driver (tidak|belum|gak) (datang|muncul|hadir)/i,
      /pickup (belum|tidak) (selesai|diproses)/i,
      /(klaim|ambil) (tidak bisa|gagal|error)/i
    ]
  },
  {
    intent: 'troubleshooting',
    patterns: [
      /error|bug|crash|tidak (bisa|jalan|muncul|tampil)|gagal|broken/i,
      /kenapa (tidak|gak|bisa|muncul)/i,
      /masalah|problem|issue|gangguan/i,
      /tidak (berfungsi|bekerja|loading)/i
    ]
  },
  {
    intent: 'pricing',
    patterns: [
      /harga|biaya|bayar|gratis|free|tarif|paket|langganan|berapa/i,
      /pro plan|paket bisnis|upgrade/i
    ]
  },
  {
    intent: 'verification',
    patterns: [
      /verifikasi|dokumen|akta|surat izin|KTP|approve|disetujui|pending/i,
      /akun (belum|tidak) (aktif|diverifikasi|disetujui)/i
    ]
  },
  {
    intent: 'complaint',
    patterns: [
      /kecewa|tidak puas|buruk|jelek|mengecewakan|lapor|komplain/i,
      /ini (payah|parah|gak benar|salah)/i,
      /tidak (profesional|bertanggung jawab)/i
    ]
  },
  {
    intent: 'escalation',
    patterns: [
      /eskalasi|supervisor|manajer|atasan|lapor|tidak terselesaikan/i,
      /sudah (lama|berulang|berkali-kali) (tapi|namun|dan)/i
    ]
  },
  {
    intent: 'emotional',
    patterns: [
      /frustasi|frustrasi|kesal|marah|bingung|putus asa|stres|capek/i,
      /sudah (coba|mencoba) (berkali|berulang|terus)/i
    ]
  },
  {
    intent: 'faq',
    patterns: [
      /apa itu|apa yang|bagaimana cara|gimana|jelaskan|ceritakan/i,
      /tentang resik|resik itu|platform ini/i,
      /badge|eco|warrior|reward|poin/i
    ]
  },
  {
    intent: 'operational',
    patterns: [
      /upload|listing|tambah (makanan|produk)|buat listing/i,
      /dashboard|kelola|manage|pantau|status/i,
      /notifikasi|laporan|riwayat|history/i
    ]
  },
  {
    intent: 'technical_issue',
    patterns: [
      /login|logout|password|reset|lupa sandi|akun (terkunci|tidak bisa masuk)/i,
      /tidak (bisa|dapat) (masuk|login|akses)/i,
      /email (tidak|belum) (masuk|diterima|terkirim)/i
    ]
  }
];

/* ─── Sinyal emosi ─── */
const EMOTION_SIGNALS = {
  frustrated: /kesal|frustrasi|marah|capek banget|sudah coba berkali|tidak mungkin|payah/i,
  confused:   /bingung|tidak mengerti|tidak paham|apa maksudnya|gimana|cara/i,
  urgent:     /segera|cepat|darurat|urgent|sekarang|penting banget/i,
  positive:   /terima kasih|makasih|bagus|keren|membantu|oke|siap/i
};

/**
 * @param {string} message
 * @param {object} memory - structured session memory
 * @returns {{ intent: string, confidence: number, emotion: string }}
 */
export function detectIntent(message, memory = {}) {
  const scores = {};

  // Score setiap intent berdasarkan pattern match
  for (const { intent, patterns } of INTENT_PATTERNS) {
    scores[intent] = patterns.filter(p => p.test(message)).length;
  }

  // Boost dari konteks memory (continuity)
  if (memory.currentIssue === 'pickup_failed') scores['pickup_problem'] += 1;
  if (memory.awaitingClarification) scores[memory.lastIntent] = (scores[memory.lastIntent] || 0) + 2;

  // Ambil intent tertinggi
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topIntent, topScore] = sorted[0] || ['faq', 0];

  const finalIntent = topScore > 0 ? topIntent : 'unclear';
  const confidence  = topScore === 0 ? 0.3 : Math.min(0.5 + topScore * 0.2, 0.95);

  // Detect emotion
  let emotion = 'neutral';
  for (const [emo, pattern] of Object.entries(EMOTION_SIGNALS)) {
    if (pattern.test(message)) { emotion = emo; break; }
  }

  return { intent: finalIntent, confidence, emotion };
}
