const fs = require('fs');
const path = require('path');

function readBoolean(value) {
  if (value === undefined || value === null || value === '') return false;
  return String(value).toLowerCase() === 'true' || String(value) === '1';
}

const env = {
  PORT: process.env.PORT || 3000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  SUNO_API_KEY: process.env.SUNO_API_KEY || '',
  WHATSAPP_SESSION_NAME: process.env.WHATSAPP_SESSION_NAME || 'zimsec-bot',
  SESSION_ID: process.env.SESSION_ID || ''
};

function getEnvSummary() {
  return {
    openai: !!env.OPENAI_API_KEY,
    gemini: !!env.GEMINI_API_KEY,
    claude: !!env.CLAUDE_API_KEY,
    groq: !!env.GROQ_API_KEY,
    suno: !!env.SUNO_API_KEY,
    whatsappSession: env.WHATSAPP_SESSION_NAME || 'zimsec-bot'
  };
}

function getModelConfig() {
  return env;
}

module.exports = {
  env,
  getEnvSummary,
  getModelConfig,
  readBoolean
};
