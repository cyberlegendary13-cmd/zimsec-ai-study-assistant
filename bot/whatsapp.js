const axios = require('axios');
const { ECOCASH_API_KEY, ECOCASH_API_URL, PAYMENT_PROVIDER } = require('../config');

async function createEcocashPayment({ studentId, amount, plan }) {
  if (!ECOCASH_API_KEY) {
    return {
      success: false,
      provider: PAYMENT_PROVIDER,
      message: 'Ecocash API key missing. Add it to your .env file for real payments.'
    };
  }

  try {
    const response = await axios.post(
      ECOCASH_API_URL,
      {
        studentId,
        amount,
        plan,
        provider: PAYMENT_PROVIDER
      },
      {
        headers: {
          Authorization: `Bearer ${ECOCASH_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      provider: PAYMENT_PROVIDER,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      provider: PAYMENT_PROVIDER,
      message: error.message
    };
  }
}

async function verifyEcocashPayment(reference) {
  if (!ECOCASH_API_KEY) {
    return {
      success: false,
      provider: PAYMENT_PROVIDER,
      message: 'Ecocash verification is not configured yet.'
    };
  }

  try {
    const response = await axios.get(`${ECOCASH_API_URL}/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${ECOCASH_API_KEY}`
      }
    });

    return {
      success: true,
      provider: PAYMENT_PROVIDER,
      verification: response.data
    };
  } catch (error) {
    return {
      success: false,
      provider: PAYMENT_PROVIDER,
      message: error.message
    };
  }
}

module.exports = {
  createEcocashPayment,
  verifyEcocashPayment
};
