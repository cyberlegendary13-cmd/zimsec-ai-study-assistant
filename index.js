const express = require('express');
const { startWhatsAppBot } = require('./services/whatsapp');
const { getEnvSummary } = require('./config/env');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Zimsec Tutor Bot',
    models: getEnvSummary()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    app: 'Zimsec Tutor Bot',
    models: getEnvSummary(),
    note: 'WhatsApp pairing is handled by the bot service.'
  });
});

app.get('/', (req, res) => {
  res.send('ZIMSEC Tutor Bot is running.');
});

const server = app.listen(port, async () => {
  console.log(`ZIMSEC Tutor Bot HTTP server started on port ${port}`);

  try {
    await startWhatsAppBot();
  } catch (err) {
    console.error('Failed to start WhatsApp bot:', err.message || err);
  }
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
