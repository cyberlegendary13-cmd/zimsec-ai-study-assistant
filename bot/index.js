const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const axios = require('axios');
require('dotenv').config();

function chooseRoute(text) {
  const lower = (text || '').toLowerCase();

  if (/(music|song|voice|rap|beat|suno|generate audio|play song)/.test(lower)) {
    return 'suno';
  }

  if (/(explain deeply|hard concept|very difficult|theory|prove|why|analyze deeply|compare)/.test(lower)) {
    return 'claude';
  }

  if (/(pdf|document|paper|image|photo|scan|upload|notes|exam paper|past paper|file)/.test(lower)) {
    return 'gemini';
  }

  if (/(quick|short|summary|summarize|brief|very fast)/.test(lower)) {
    return 'groq';
  }

  return 'openai';
}

async function askOpenAI(prompt) {
  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return res.data.choices[0].message.content;
}

async function askClaude(prompt) {
  const res = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    }
  );

  return res.data.content[0].text;
}

async function askGemini(prompt) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No Gemini response';
}

async function askGroq(prompt) {
  const res = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return res.data.choices[0].message.content;
}

async function generateSunoTrack(prompt) {
  const res = await axios.post(
    'https://api.sunoapi.com/v1/generate',
    {
      prompt,
      model: 'v4'
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return res.data?.data?.[0]?.audio_url || 'Suno generation started. Please check your Suno dashboard.';
}

async function routePrompt(prompt) {
  const route = chooseRoute(prompt);

  if (route === 'claude') {
    if (!process.env.CLAUDE_API_KEY) throw new Error('CLAUDE_API_KEY missing');
    return askClaude(prompt);
  }

  if (route === 'gemini') {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');
    return askGemini(prompt);
  }

  if (route === 'groq') {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY missing');
    return askGroq(prompt);
  }

  if (route === 'suno') {
    if (!process.env.SUNO_API_KEY) throw new Error('SUNO_API_KEY missing');
    return generateSunoTrack(prompt);
  }

  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
  return askOpenAI(prompt);
}

async function connectWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: undefined,
    auth: state,
    printQRInTerminal: false,
    mobile: false,
    browser: ['Chrome (Windows)', '', ''],
    pairingCode: true
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr, isNewLogin } = update;

    if (qr) {
      console.log('PAIRING CODE / QR READY');
      console.log(qr);
    }

    if (connection === 'open') {
      console.log('Connected to WhatsApp successfully.');
    }

    if (connection === 'close') {
      const shouldReconnect = !(lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut);
      if (shouldReconnect) {
        setTimeout(() => connectWhatsApp(), 1000);
      }
    }

    if (isNewLogin) {
      console.log('New login started');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      '';

    if (!text) return;

    try {
      const aiReply = await routePrompt(text);
      await sock.sendMessage(msg.key.remoteJid, { text: aiReply });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `AI error: ${error.message}`
      });
    }
  });
}

connectWhatsApp();
