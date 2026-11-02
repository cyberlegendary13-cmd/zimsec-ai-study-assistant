const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const axios = require('axios');
require('dotenv').config();

async function askAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing. Add it to your local .env file.');
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data?.choices?.[0]?.message?.content || 'No AI response';
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
      console.log('If your app supports pairing code, use the 8-digit code shown on your phone.');
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
      console.log('New login started.');
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
      const reply = await askAI(text);
      await sock.sendMessage(msg.key.remoteJid, { text: reply });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `AI failed: ${error.message}`
      });
    }
  });
}

connectWhatsApp();
