const { generateAssistantReply, generatePrediction, generateProjectPlan } = require('../../server/services/aiRouter');

async function handleIncomingMessage(sock, msg) {
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
  const sender = msg.key.remoteJid;

  if (!text) {
    await sock.sendMessage(sender, { text: 'I can read text, images, and audio. Send a message like: /predict Math, /quiz Biology, or /project.' });
    return;
  }

  const normalized = text.trim();

  if (normalized.toLowerCase() === '/start') {
    await sock.sendMessage(sender, {
      text: 'Welcome to Zimsec AI Study Assistant!\n\nCommands:\n/start\n/subjects\n/predict\n/quiz\n/notes\n/project\n/help'
    });
    return;
  }

  if (normalized.toLowerCase() === '/help') {
    await sock.sendMessage(sender, {
      text: 'Examples:\n- /predict Mathematics\n- Explain photosynthesis\n- /project design a biology project\n- /notes Chemistry Chapter 2'
    });
    return;
  }

  if (normalized.toLowerCase().startsWith('/predict')) {
    const subject = normalized.replace('/predict', '').trim() || 'Mathematics';
    const result = await generatePrediction({ subject, examType: 'zimsec', message: `Predict likely topics for ${subject}` });
    await sock.sendMessage(sender, { text: result.prediction });
    return;
  }

  if (normalized.toLowerCase().startsWith('/project')) {
    const value = normalized.replace('/project', '').trim() || 'Create a biology project';
    const result = await generateProjectPlan(value);
    await sock.sendMessage(sender, { text: result.plan });
    return;
  }

  if (normalized.toLowerCase().startsWith('/quiz')) {
    const subject = normalized.replace('/quiz', '').trim() || 'General';
    const result = await generateAssistantReply({ message: `Generate 5 short quiz questions on ${subject} for Zimsec students`, subject, examType: 'zimsec' });
    await sock.sendMessage(sender, { text: result.answer });
    return;
  }

  const result = await generateAssistantReply({ message: normalized, subject: 'General', examType: 'zimsec' });
  await sock.sendMessage(sender, { text: result.answer || 'I am here to help with your Zimsec study questions.' });
}

module.exports = {
  handleIncomingMessage
};
