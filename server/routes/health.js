const { startServer } = require('./app');
const { initializeWhatsApp } = require('../bot/whatsapp');

(async () => {
  try {
    await startServer();
    await initializeWhatsApp();
    console.log('System ready');
  } catch (err) {
    console.error('Error starting app', err);
    process.exit(1);
  }
})();
