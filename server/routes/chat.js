const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Zimsec AI Study Assistant',
    features: [
      'WhatsApp coaching',
      'Exam prediction',
      'Notes explanation',
      'Past papers',
      'Project assistant',
      'Syllabus intelligence'
    ]
  });
});

module.exports = router;
