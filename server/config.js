const dotenv = require('dotenv');

dotenv.config();

const config = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.APP_NAME || 'Zimsec AI Study Assistant',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5000',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  DATA_DIR: process.env.DATA_DIR || './data',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  SUNO_API_KEY: process.env.SUNO_API_KEY || '',
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || 'ecocash',
  ECOCASH_API_KEY: process.env.ECOCASH_API_KEY || '',
  ECOCASH_API_URL: process.env.ECOCASH_API_URL || 'https://example.com/ecocash',
  DEFAULT_SUBJECTS: process.env.DEFAULT_SUBJECTS || 'Mathematics,Combined Science,Geography,Shona,English,Heritage,Commerce,Accounts',
};

module.exports = config;
