const express = require('express');
const router = express.Router();
const { getAllDocuments, getStudentSummary } = require('../services/docStore');

router.get('/documents', async (req, res) => {
  try {
    const docs = await getAllDocuments();
    res.json(docs);
  } catch (error) {
    console.error('Admin docs error', error);
    res.status(500).json({ error: 'Unable to load documents' });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const summary = await getStudentSummary();
    res.json(summary);
  } catch (error) {
    console.error('Dashboard error', error);
    res.status(500).json({ error: 'Unable to load dashboard summary' });
  }
});

module.exports = router;
