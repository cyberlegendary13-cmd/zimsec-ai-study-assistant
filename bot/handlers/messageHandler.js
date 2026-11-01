const makeWASocket = require('@whiskeysockets/baileys').default;
const { default: makeWASocketCore } = require('@whiskeysockets/baileys');
const qrCode = require('qrcode-terminal');
const { handleIncomingMessage } = require('./handlers/messageHandler');
const { WHATSAPP_SESSION_NAME } = require('../server/config');

let sock;

async function initializeWhatsApp() {
  console.log('Initializing Baileys WhatsApp bot...');

  try {
    sock = makeWASocket({
      printQRInTerminal: true,
      auth: undefined,
      browser: ['Zimsec Bot', 'Chrome', '1.0.0']
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('Scan this QR code with your WhatsApp app');
        qrCode.generate(qr, { small: true });
      }

      if (connection === 'open') {
        console.log('WhatsApp connected successfully');
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
        console.log('Connection closed, reconnecting...', shouldReconnect);
        if (shouldReconnect) {
          setTimeout(() => initializeWhatsApp(), 5000);
        }
      }
    });

    sock.ev.on('messages.upsert', async (messages) => {
      const msg = messages.messages[0];
      if (!msg || msg.key.fromMe) return;
      await handleIncomingMessage(sock, msg);
    });

    return sock;
  } catch (error) {
    console.error('Could not initialize WhatsApp bot:', error.message);
    return null;
  }
}

module.exports = {
  initializeWhatsApp,
  getSocket: () => sock
};
