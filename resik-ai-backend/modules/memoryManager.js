/**
 * modules/memoryManager.js
 * Structured conversational memory — bukan raw history dump.
 *
 * Memory dikirim dari frontend (per session) dan dikembalikan setiap respons.
 * Server stateless — memory disimpan di client (sessionStorage), bukan server.
 */

const MAX_HISTORY_TURNS = 8; // 8 pasang = 16 pesan

/**
 * Buat atau update structured memory dari state sebelumnya.
 * @param {object} prevMemory - memory dari request sebelumnya
 * @param {object} ctx - { userMessage, intent, aiReply? }
 * @returns {object} updatedMemory
 */
export function buildMemory(prevMemory, ctx) {
  const { userMessage, intent } = ctx;
  const { intent: detectedIntent, emotion } = intent;

  // Detect user role dari pesan jika belum ada
  const userRole = prevMemory.userRole || detectRole(userMessage);

  return {
    // Identitas & role
    userRole,

    // Issue tracking
    currentIssue: resolveCurrentIssue(prevMemory, detectedIntent, userMessage),
    lastIntent: detectedIntent,
    unresolved: prevMemory.unresolved !== false, // default true sampai diselesaikan

    // Emosi & tone
    emotionalTone: emotion || prevMemory.emotionalTone || 'neutral',
    frustrationLevel: updateFrustrationLevel(prevMemory, emotion),

    // Workflow tracking
    awaitingClarification: prevMemory.awaitingClarification || false,
    clarificationCount: (prevMemory.clarificationCount || 0),

    // Topik tracking
    topicsDiscussed: addTopic(prevMemory.topicsDiscussed || [], detectedIntent),

    // Conversation history (trimmed)
    conversationHistory: (prevMemory.conversationHistory || []).slice(-(MAX_HISTORY_TURNS * 2))
  };
}

/**
 * Update memory setelah AI menjawab.
 */
export function updateMemory(memory, ctx) {
  const { userMessage, aiReply, awaitingClarification } = ctx;

  const newHistory = [
    ...(memory.conversationHistory || []),
    { role: 'user', content: userMessage }
  ];

  if (aiReply) {
    newHistory.push({ role: 'assistant', content: aiReply });
  }

  return {
    ...memory,
    awaitingClarification: awaitingClarification ?? memory.awaitingClarification,
    clarificationCount: awaitingClarification
      ? (memory.clarificationCount || 0) + 1
      : memory.clarificationCount,
    // Anggap resolved jika AI sudah menjawab (bukan klarifikasi)
    unresolved: awaitingClarification ? true : false,
    conversationHistory: newHistory.slice(-(MAX_HISTORY_TURNS * 2))
  };
}

/* ─── Helpers ─── */

function detectRole(message) {
  if (/pengelola|bank sampah|organisasi|panti|komunitas/.test(message)) return 'Pengelola';
  if (/provider|restoran|kantin|hotel|catering|makanan sisa/.test(message)) return 'Food Provider';
  return null; // belum diketahui
}

function resolveCurrentIssue(prevMemory, intent, message) {
  // Pertahankan issue sebelumnya jika masih relevan
  if (intent === 'pickup_problem') return 'pickup_failed';
  if (intent === 'technical_issue') return 'technical_issue';
  if (intent === 'complaint') return 'complaint';
  if (intent === 'troubleshooting') return 'troubleshooting';
  return prevMemory.currentIssue || null;
}

function updateFrustrationLevel(prevMemory, emotion) {
  const prev = prevMemory.frustrationLevel || 0;
  if (emotion === 'frustrated') return Math.min(prev + 1, 3);
  if (emotion === 'positive') return Math.max(prev - 1, 0);
  return prev;
}

function addTopic(existing, intent) {
  if (!intent || intent === 'unclear') return existing;
  if (existing.includes(intent)) return existing;
  return [...existing, intent].slice(-5); // max 5 topik
}
