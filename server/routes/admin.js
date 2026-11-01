const express = require('express');
const router = express.Router();
const { createEcocashPayment, verifyEcocashPayment } = require('../services/paymentService');

router.post('/create', async (req, res) => {
  try {
    const { studentId, amount, plan } = req.body;

    const response = await createEcocashPayment({ studentId, amount, plan });
    res.json(response);
  } catch (error) {
    console.error('Payment creation error', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { reference } = req.body;
    const result = await verifyEcocashPayment(reference);
    res.json(result);
  } catch (error) {
    console.error('Payment verification error', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

module.exports = router;
