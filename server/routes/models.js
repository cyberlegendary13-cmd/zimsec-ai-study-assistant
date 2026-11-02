const express = require('express');
const router = express.Router();
const {
  callGemini,
  callClaude,
  callOpenAI,
  callGroq,
  callSuno,
  generateAssistantReply
} = require('../services/aiRouter');
const {
  GEMINI_API_KEY,
  CLAUDE_API_KEY,
  OPENAI_API_KEY,
  GROQ_API_KEY,
  SUNO_API_KEY
} = require('../config');

function buildStatus(name, key) {
  return {
    enabled: Boolean(key),
    keyConfigured: Boolean(key),
    status: key ? 'ready' : 'missing'
  };
}

router.get('/status', async (req, res) => {
  try {
    res.json({
      success: true,
      models: {
        gemini: buildStatus('gemini', GEMINI_API_KEY),
        claude: buildStatus('claude', CLAUDE_API_KEY),
        openai: buildStatus('openai', OPENAI_API_KEY),
        groq: buildStatus('groq', GROQ_API_KEY),
        suno: buildStatus('suno', SUNO_API_KEY)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/test', async (req, res) => {
  try {
    const prompt = req.body?.prompt || 'Explain in one short sentence what a ZIMSEC O Level study plan is.';
    const targetModel = (req.body?.model || 'all').toLowerCase();

    const runModel = async (name, handler) => {
      try {
        const result = await handler(prompt);
        return {
          name,
          enabled: Boolean(result && result.answer !== undefined) || Boolean(result && result.result !== undefined),
          status: 'ok',
          response: result
        };
      } catch (error) {
        return {
          name,
          enabled: false,
          status: 'error',
          error: error.message
        };
      }
    };

    const selectedModels = {
      gemini: () => runModel('gemini', callGemini),
      claude: () => runModel('claude', callClaude),
      openai: () => runModel('openai', callOpenAI),
      chatgpt: () => runModel('chatgpt', callOpenAI),
      groq: () => runModel('groq', callGroq),
      suno: () => runModel('suno', callSuno),
      all: async () => {
        const results = {};
        results.gemini = await runModel('gemini', callGemini);
        results.claude = await runModel('claude', callClaude);
        results.openai = await runModel('openai', callOpenAI);
        results.groq = await runModel('groq', callGroq);
        results.suno = await runModel('suno', callSuno);
        return results;
      }
    };

    const result = selectedModels[targetModel]
      ? await selectedModels[targetModel]()
      : await selectedModels.all();

    res.json({ success: true, result, model: targetModel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, subject, examType, model } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const answer = await generateAssistantReply({
      message,
      subject,
      examType,
      model
    });

    res.json({ success: true, result: answer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;