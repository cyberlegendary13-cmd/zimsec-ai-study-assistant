const axios = require('axios');
const { env } = require('../config/env');

const DEFAULT_FALLBACK = 'OpenAI model is unavailable right now. Please add your API key or try again later.';

function getAvailableModels() {
  const list = [];
  if (env.OPENAI_API_KEY) list.push('openai');
  if (env.GEMINI_API_KEY) list.push('gemini');
  if (env.CLAUDE_API_KEY) list.push('claude');
  if (env.GROQ_API_KEY) list.push('groq');
  if (env.SUNO_API_KEY) list.push('suno');
  return list; 
}

function buildPrompt(type, input, subject = 'General') {
  const cleanInput = String(input || '').trim();
  const intro = `You are a ZIMSEC O-Level tutor and study coach. Respond in a simple, clear, student-friendly manner. Topic: ${subject}. Purpose: ${type}.`;
  return `${intro}\n\nStudent request:\n${cleanInput}`;
}

async function callOpenAI(prompt) {
  if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data?.choices?.[0]?.message?.content || 'No response from OpenAI.';
}

async function callGemini(prompt) {
  if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');

  const model = env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7 }
  });

  const parts = response.data?.candidates?.[0]?.content?.parts || [];
  const text = parts.map(item => item.text || '').join('\n');
  if (!text) throw new Error('Gemini returned no content.');
  return text;
}

async function callClaude(prompt) {
  if (!env.CLAUDE_API_KEY) throw new Error('CLAUDE_API_KEY missing');

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'x-api-key': env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    }
  );

  const blocks = response.data?.content || [];
  const text = blocks.map(block => block.text || '').join('\n');
  if (!text) throw new Error('Claude returned no content.');
  return text;
}

async function callGroq(prompt) {
  if (!env.GROQ_API_KEY) throw new Error('GROQ_API_KEY missing');

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data?.choices?.[0]?.message?.content || 'No response from Groq.';
}

async function callSuno(prompt) {
  if (!env.SUNO_API_KEY) throw new Error('SUNO_API_KEY missing');

  return `Suno is configured for media generation, but the starter bot is using the model router for study tasks. Request received: "${prompt.slice(0, 120)}"`;
}

async function routeAI(task, input, subject = 'General') {
  const prompt = buildPrompt(task, input, subject);
  const available = getAvailableModels();

  if (!available.length) {
    return {
      model: 'none',
      answer: 'No AI API keys are configured yet. Add your model keys in the environment and restart the bot.'
    };
  }

  const strategy = ['openai', 'gemini', 'claude', 'groq'];
  let lastError = null;

  for (const modelName of strategy) {
    if (!available.includes(modelName)) continue;

    try {
      let answer = '';
      if (modelName === 'openai') answer = await callOpenAI(prompt);
      if (modelName === 'gemini') answer = await callGemini(prompt);
      if (modelName === 'claude') answer = await callClaude(prompt);
      if (modelName === 'groq') answer = await callGroq(prompt);
      if (modelName === 'suno') answer = await callSuno(prompt);

      return { model: modelName, answer: answer.trim() || DEFAULT_FALLBACK };
    } catch (error) {
      lastError = error;
      console.warn(`Model ${modelName} failed: ${error.message || error}`);
    }
  }

  return {
    model: 'fallback',
    answer: `The AI models are not responding right now. Please check your API keys and deployment configuration. Last error: ${lastError ? lastError.message : 'unknown'}`
  };
}

module.exports = {
  routeAI,
  getAvailableModels,
  callOpenAI,
  callGemini,
  callClaude,
  callGroq,
  callSuno,
  buildPrompt
};
