const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const { PORT, UPLOAD_DIR, DATA_DIR } = require('./config');

async function initDirectories() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/health', require('./routes/health'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/models', require('./routes/models'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/students', require('./routes/students'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

app.use(express.static(path.join(__dirname, '..', 'web')));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  return res.sendFile(path.join(__dirname, '..', 'web', 'index.html'));
});

const startServer = async () => {
  await initDirectories();

  app.listen(PORT, () => {
    console.log(`Zimsec AI assistant running on http://localhost:${PORT}`);
  });
};

module.exports = { app, startServer };