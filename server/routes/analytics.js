const express = require('express');
const router = express.Router();
const { getUsageStats } = require('../services/subjectKnowledge');

router.get('/', (req, res) => {
  try {
    res.json({ success: true, analytics: getUsageStats() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;