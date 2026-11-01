async function handleMediaMessage(sock, msg) {
  const sender = msg.key.remoteJid;
  const mediaData = msg.message?.imageMessage || msg.message?.audioMessage || msg.message?.documentMessage;

  if (!mediaData) {
    return;
  }

  await sock.sendMessage(sender, {
    text: 'I can read image, audio, and document content. Please add AI model keys and upload to the syllabus engine. For now, the media response is ready for integration.'
  });
}

module.exports = {
  handleMediaMessage
};
