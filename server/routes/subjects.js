const express = require('express');
const router = express.Router();
const { getSubjects, getSubjectById } = require('../services/subjectKnowledge');

router.get('/', (req, res) => {
  try {
    const subjects = getSubjects();
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:subjectId', (req, res) => {
  try {
    const subject = getSubjectById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
