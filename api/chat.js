import { detectIntent } from '../resik-ai-backend/modules/intentDetector.js';
import { retrieveContext } from '../resik-ai-backend/modules/ragRetriever.js';
import { buildMemory, updateMemory } from '../resik-ai-backend/modules/memoryManager.js';
import { buildSystemPrompt } from '../resik-ai-backend/modules/promptBuilder.js';
import { callGemini } from '../resik-ai-backend/modules/llmClient.js';

import {
  shouldClarify,
  buildClarificationPrompt
} from '../resik-ai-backend/modules/clarificationEngine.js';

const rateLimitMap = new Map();

export default async function handler(req, res) {

  // hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  // =========================
  // RATE LIMIT
  // =========================

  const ip =
    req.headers['x-forwarded-for'] ||
    'unknown';

  const now = Date.now();

  const windowMs = 60 * 1000;
  const maxRequests = 20;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests =
    rateLimitMap
      .get(ip)
      .filter(ts => now - ts < windowMs);

  if (requests.length >= maxRequests) {
    return res.status(429).json({
      error:
        'Terlalu banyak request. Coba lagi sebentar.'
    });
  }

  requests.push(now);
  rateLimitMap.set(ip, requests);

  // =========================
  // MAIN AI LOGIC
  // =========================

  try {

    const {
      message,
      sessionMemory = {}
    } = req.body;

    // validasi input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Pesan tidak valid'
      });
    }

    const userMessage =
      message.trim().slice(0, 1000);

    // =========================
    // INTENT DETECTION
    // =========================

    const intent =
      detectIntent(
        userMessage,
        sessionMemory
      );

    // =========================
    // CLARIFICATION
    // =========================

    const needsClarification =
      shouldClarify(
        userMessage,
        intent,
        sessionMemory
      );

    if (needsClarification) {

      const clarifyReply =
        buildClarificationPrompt(
          userMessage,
          intent,
          sessionMemory
        );

      const updatedMemory =
        updateMemory(sessionMemory, {
          userMessage,
          intent,
          awaitingClarification: true
        });

      return res.status(200).json({
        reply: clarifyReply,
        updatedMemory,
        intent,
        clarifying: true
      });
    }

    // =========================
    // RETRIEVE CONTEXT
    // =========================

    const retrievedContext =
      retrieveContext(
        userMessage,
        intent
      );

    // =========================
    // BUILD MEMORY
    // =========================

    const memory =
      buildMemory(sessionMemory, {
        userMessage,
        intent
      });

    // =========================
    // BUILD SYSTEM PROMPT
    // =========================

    const systemPrompt =
      buildSystemPrompt(
        intent,
        memory,
        retrievedContext
      );

    // =========================
    // BUILD MESSAGES
    // =========================

    const messages =
      buildMessages(
        memory.conversationHistory || [],
        userMessage
      );

    // =========================
    // CALL GEMINI
    // =========================

    const aiReply =
      await callGemini(
        systemPrompt,
        messages
      );

    // =========================
    // UPDATE MEMORY
    // =========================

    const updatedMemory =
      updateMemory(memory, {
        userMessage,
        aiReply,
        intent,
        awaitingClarification: false
      });

    // =========================
    // SUCCESS RESPONSE
    // =========================

    return res.status(200).json({
      reply: aiReply,
      updatedMemory,
      intent,
      clarifying: false
    });

  } catch (err) {

    console.error({
      message: err.message,
      stack: err.stack,
      time: new Date().toISOString()
    });

    return res.status(500).json({
      error: 'Internal server error',
      reply: getSmartFallback()
    });
  }
}

// ===================================
// HELPER: BUILD CHAT HISTORY
// ===================================

function buildMessages(history, userMessage) {

  const trimmedHistory =
    history.slice(-16);

  return [
    ...trimmedHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];
}

// ===================================
// HELPER: SMART FALLBACK
// ===================================

function getSmartFallback() {

  return `
Maaf, AI sedang sibuk sementara 🙏

Silakan coba lagi beberapa saat.
`;
}