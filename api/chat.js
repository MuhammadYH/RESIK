import { detectIntent } from '../resik-ai-backend/modules/intentDetector.js';
import { retrieveContext } from '../resik-ai-backend/modules/ragRetriever.js';
import { buildMemory, updateMemory } from '../resik-ai-backend/modules/memoryManager.js';
import { buildSystemPrompt } from '../resik-ai-backend/modules/promptBuilder.js';
import { callGemini } from '../resik-ai-backend/modules/llmClient.js';
import {
  shouldClarify,
  buildClarificationPrompt
} from '../resik-ai-backend/modules/clarificationEngine.js';

export default async function handler(req, res) {

  // hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {

    const { message, sessionMemory = {} } = req.body;

    // validasi input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Pesan tidak valid'
      });
    }

    const userMessage = message.trim().slice(0, 1000);

    // 1. intent detection
    const intent = detectIntent(
      userMessage,
      sessionMemory
    );

    // 2. clarification
    const needsClarification = shouldClarify(
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

    // 3. retrieve context
    const retrievedContext =
      retrieveContext(
        userMessage,
        intent
      );

    // 4. build memory
    const memory =
      buildMemory(sessionMemory, {
        userMessage,
        intent
      });

    // 5. build system prompt
    const systemPrompt =
      buildSystemPrompt(
        intent,
        memory,
        retrievedContext
      );

    // 6. build messages
    const messages =
      buildMessages(
        memory.conversationHistory || [],
        userMessage
      );

    // 7. call Gemini
    const aiReply =
      await callGemini(
        systemPrompt,
        messages
      );

    // 8. update memory
    const updatedMemory =
      updateMemory(memory, {
        userMessage,
        aiReply,
        intent,
        awaitingClarification: false
      });

    // response sukses
    return res.status(200).json({
      reply: aiReply,
      updatedMemory,
      intent,
      clarifying: false
    });

  } catch (err) {

    console.error('[RESIK AI ERROR]', err);

    return res.status(500).json({
      error: 'Internal server error',
      reply:
        'Maaf, AI sedang mengalami gangguan sementara.'
    });
  }
}

// helper messages
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