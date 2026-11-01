const express = require('express');
const router = express.Router();
const { generateAssistantReply, generatePrediction, generateProjectPlan } = require('../services/aiRouter');

router.post('/', async (req, res) => {
  try {
    const { message, subject, examType, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (mode === 'predict') {
      const result = await generatePrediction({ subject, examType, message });
      return res.json(result);
    }

    if (mode === 'project') {
      const result = await generateProjectPlan(message);
      return res.json(result);
    }

    const result = await generateAssistantReply({ message, subject, examType });
    res.json(result);
  } catch (error) {
    console.error('Chat error', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

module.exports = router;
