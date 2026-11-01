const express = require('express');
const router = express.Router();
const { registerStudent, logActivity, getUsageStats, getAllStudents } = require('../services/subjectKnowledge');

router.post('/register', (req, res) => {
  try {
    const { name, phone, subjects } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const student = registerStudent({ name, phone, subjects: subjects || [] });
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/students', (req, res) => {
  try {
    res.json({ success: true, students: getAllStudents() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/activity', (req, res) => {
  try {
    const entry = req.body || {};
    const item = logActivity(entry);
    res.json({ success: true, activity: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', (req, res) => {
  try {
    res.json({ success: true, stats: getUsageStats() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
