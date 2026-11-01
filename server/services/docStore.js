const axios = require('axios');
const { GEMINI_API_KEY, OPENAI_API_KEY, CLAUDE_API_KEY, GROQ_API_KEY, SUNO_API_KEY } = require('../config');

async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    return { answer: 'Gemini API key missing. Add it to your .env file to enable Gemini.' };
  }

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        params: { key: GEMINI_API_KEY }
      }
    );

    const value = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return { answer: value || 'No Gemini response available.' };
  } catch (error) {
    return { answer: `Gemini failed: ${error.message}` };
  }
}

async function callClaude(prompt) {
  if (!CLAUDE_API_KEY) {
    return { answer: 'Claude API key missing. Add it to your .env file to enable Claude.' };
  }

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    const value = response.data?.content?.[0]?.text;
    return { answer: value || 'No Claude response available.' };
  } catch (error) {
    return { answer: `Claude failed: ${error.message}` };
  }
}

async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    return { answer: 'OpenAI API key missing. Add it to your .env file to enable ChatGPT.' };
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const value = response.data?.choices?.[0]?.message?.content;
    return { answer: value || 'No OpenAI response available.' };
  } catch (error) {
    return { answer: `OpenAI failed: ${error.message}` };
  }
}

async function callGroq(prompt) {
  if (!GROQ_API_KEY) {
    return { answer: 'Groq API key missing. Add it to your .env file to enable Groq.' };
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const value = response.data?.choices?.[0]?.message?.content;
    return { answer: value || 'No Groq response available.' };
  } catch (error) {
    return { answer: `Groq failed: ${error.message}` };
  }
}

async function callSuno(prompt) {
  if (!SUNO_API_KEY) {
    return { answer: 'Suno API key missing. Add it to your .env file to enable music generation.' };
  }

  try {
    const response = await axios.post(
      'https://api.suno.ai/v1/generate',
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${SUNO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return { result: response.data || { message: 'Suno request submitted.' } };
  } catch (error) {
    return { answer: `Suno failed: ${error.message}` };
  }
}

async function generateAssistantReply({ message, subject, examType }) {
  const prompt = `You are a supportive Zimsec tutor and exam coach for Zimbabwean students. Explain the topic clearly and simply. Subject: ${subject || 'General'}; Exam type: ${examType || 'general'}; Student question: ${message}. Use exam-focused guidance, short explanations, step-by-step examples, and encouraging tone.`;

  const modelResponses = await Promise.all([
    callGemini(prompt),
    callClaude(prompt),
    callOpenAI(prompt),
    callGroq(prompt)
  ]);

  const finalAnswer = modelResponses
    .map((item) => item.answer)
    .filter(Boolean)
    .join('\n\n---\n\n');

  return {
    success: true,
    mode: 'assistant',
    subject: subject || 'General',
    answer: finalAnswer || 'No model response available. Add API keys and try again.',
    modelResponses
  };
}

async function generatePrediction({ subject, examType, message }) {
  const prompt = `You are a Zimsec exam prediction engine. Based on the syllabus and likely exam patterns, predict the most likely topics, questions, and exam structure. Subject: ${subject || 'General'}; Exam type: ${examType || 'general'}; Student note: ${message}. Return a prediction with likely topics, 5 likely questions, and revision priorities.`;

  const geminiResult = await callGemini(prompt);

  return {
    success: true,
    mode: 'prediction',
    subject: subject || 'General',
    examType: examType || 'general',
    prediction: geminiResult.answer || 'No prediction generated. Add API keys.'
  };
}

async function generateProjectPlan(prompt) {
  const projectPrompt = `You are a Zimsec project assistant. Help a student create a school project plan. The student says: ${prompt}. Give: a project title, objectives, methodology, materials, steps, timeline, and expected results.`;

  const response = await callOpenAI(projectPrompt);

  return {
    success: true,
    mode: 'project',
    plan: response.answer || 'No project plan available.'
  };
}

module.exports = {
  generateAssistantReply,
  generatePrediction,
  generateProjectPlan,
  callGemini,
  callClaude,
  callOpenAI,
  callGroq,
  callSuno
};
