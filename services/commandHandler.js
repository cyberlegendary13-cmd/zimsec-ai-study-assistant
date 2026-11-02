const { routeAI } = require('./aiRouter');
const { buildTwoWeekPlan, buildStudySummary, buildQuiz, analyzeSubject } = require('./studyEngine');
const { env } = require('../config/env');

function getHelpText() {
  return [
    'ZIMSEC Tutor Bot Commands:',
    '/start - welcome message',
    '/help - show this menu',
    '/plan <subject> - generate a 2-week exam plan',
    '/quiz <subject> - generate a quick quiz',
    '/analyze <subject> - identify high-priority topics',
    '/summary <subject> <topic> - concise topic overview',
    '/status - show active AI model config',
    '/model - show which model keys are configured',
    'You can also send normal questions like: “Explain algebra in simple terms”'
  ].join('\n');
}

async function handleIncomingText({ text, sender, from, message }) {
  const clean = String(text || '').trim();
  if (!clean) return 'Please send a message or command.';

  const lower = clean.toLowerCase();

  if (lower === '/start' || lower === 'start' || lower === 'hi' || lower === 'hello') {
    return [
      'Welcome to the ZIMSEC Tutor Bot.',
      'I help with O-Level tutoring, revision plans, Exam analysis, and topic explanations.',
      'Try: /help, /plan mathematics, /quiz biology, /analyze geography',
      'You can also send a question, upload an image/PDF, or send a voice note for help.'
    ].join('\n');
  }

  if (lower === '/help' || lower === '!help') {
    return getHelpText();
  }

  if (lower === '/status' || lower === '!status') {
    const status = [
      'Bot status: online',
      `Session name: ${env.WHATSAPP_SESSION_NAME || 'zimsec-bot'}`,
      `Port: ${env.PORT || 3000}`,
      `AI keys active: OpenAI=${!!env.OPENAI_API_KEY}, Gemini=${!!env.GEMINI_API_KEY}, Claude=${!!env.CLAUDE_API_KEY}, Groq=${!!env.GROQ_API_KEY}, Suno=${!!env.SUNO_API_KEY}`
    ].join('\n');
    return status;
  }

  if (lower === '/model' || lower === '!model') {
    const active = [];
    if (env.OPENAI_API_KEY) active.push('OpenAI');
    if (env.GEMINI_API_KEY) active.push('Gemini');
    if (env.CLAUDE_API_KEY) active.push('Claude');
    if (env.GROQ_API_KEY) active.push('Groq');
    if (env.SUNO_API_KEY) active.push('Suno');
    return active.length ? `Active models: ${active.join(', ')}` : 'No AI model keys are configured yet.';
  }

  if (lower.startsWith('/plan ')) {
    const subject = clean.replace(/^\/plan\s+/i, '').trim() || 'mathematics';
    return buildTwoWeekPlan(subject);
  }

  if (lower.startsWith('/quiz ')) {
    const subject = clean.replace(/^\/quiz\s+/i, '').trim() || 'mathematics';
    return buildQuiz(subject, 5);
  }

  if (lower.startsWith('/analyze ')) {
    const subject = clean.replace(/^\/analyze\s+/i, '').trim() || 'mathematics';
    return analyzeSubject(subject);
  }

  if (lower.startsWith('/summary ')) {
    const rest = clean.replace(/^\/summary\s+/i, '').trim();
    if (!rest) return 'Usage: /summary biology photosynthesis';
    const [subject, ...topicParts] = rest.split(' ');
    const topic = topicParts.join(' ') || 'general topic';
    return buildStudySummary(subject, topic);
  }

  if (lower.startsWith('/suno ')) {
    const prompt = clean.replace(/^\/suno\s+/i, '').trim();
    return `Suno is available for creative media generation in a full deployment, but this starter bot keeps the media feature ready for expansion. Requested creative prompt: ${prompt || 'general creative study visual'}`;
  }

  if (message?.imageMessage || message?.videoMessage) {
    return 'I can help with image-based study questions. Please send the image and ask: “Explain this diagram”, “Solve this question”, or “Summarize this image”.';
  }

  if (message?.audioMessage) {
    return 'I can help with audio notes and voice explanations. Please send a voice note and ask, “Explain this in simple terms” or “Turn this into study notes”.';
  }

  if (message?.documentMessage) {
    return 'I can help with PDF or document uploads. Send the document and ask for a summary, explanation, or exam-focused notes.';
  }

  const detectedSubject = inferSubject(clean);
  const reply = await routeAI('general tutoring + study support', clean, detectedSubject);
  return reply.answer;
}

function inferSubject(text) {
  const lower = String(text).toLowerCase();
  const map = [
    ['math', 'Mathematics'],
    ['biology', 'Biology'],
    ['chemistry', 'Chemistry'],
    ['physics', 'Physics'],
    ['english', 'English Language'],
    ['geography', 'Geography'],
    ['history', 'History'],
    ['commerce', 'Commerce'],
    ['accounts', 'Accounting'],
    ['agriculture', 'Agriculture']
  ];

  for (const [keyword, subject] of map) {
    if (lower.includes(keyword)) return subject;
  }

  return 'General Study';
}

module.exports = {
  handleIncomingText,
  getHelpText,
  inferSubject
};
