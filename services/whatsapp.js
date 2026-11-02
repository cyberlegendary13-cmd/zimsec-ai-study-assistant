const { env } = require('../config/env');
const { makeWASocket, useMultiFileAuthState, disconnectReason, Browsers, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { handleIncomingText } = require('./commandHandler');
const qrcode = require('qrcode-terminal');

function extractText(message) {
  if (!message) return '';
  if (message.conversation) return message.conversation;
  if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
  return '';
}

async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState(`session/${env.WHATSAPP_SESSION_NAME || 'zimsec-bot'}`);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome')
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\nScan this WhatsApp QR code on your phone to pair the bot:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('WhatsApp bot connected successfully.');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.warn('Connection closed. Status code:', statusCode);
      console.warn('Reconnecting...');
      setTimeout(() => {
        startWhatsAppBot();
      }, 3000);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const message of messages) {
      if (!message.message || message.key && message.key.fromMe) continue;

      const sender = message.key.remoteJid;
      const text = extractText(message.message);

      if (!sender) continue;

      try {
        if (text) {
          const response = await handleIncomingText({ text, sender, from: sender, message: message.message });
          await sock.sendMessage(sender, { text: response });
          continue;
        }

        if (message.message?.imageMessage) {
          const reply = await handleIncomingText({ text: '', sender, from: sender, message: message.message });
          await sock.sendMessage(sender, { text: reply });
        }

        if (message.message?.audioMessage) {
          const reply = await handleIncomingText({ text: '', sender, from: sender, message: message.message });
          await sock.sendMessage(sender, { text: reply });
        }
      } catch (error) {
        console.error('Failed to process WhatsApp message:', error);
        try {
          await sock.sendMessage(sender, {
            text: 'The bot hit an error while processing your message. Please try again in a moment.'
          });
        } catch (sendErr) {
          console.error('Failed to send error message:', sendErr);
        }
      }
    }
  });

  return sock;
}

module.exports = {
  startWhatsAppBot,
  extractText
};
