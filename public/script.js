document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('promptInput');
  const sendButton = document.getElementById('sendPrompt');
  const chatOutput = document.getElementById('chatOutput');

  const appendMessage = (text, sender = 'assistant') => {
    const row = document.createElement('div');
    row.className = sender === 'user' ? 'user-message' : 'assistant-message';
    row.textContent = text;
    chatOutput.appendChild(row);
    chatOutput.scrollTop = chatOutput.scrollHeight;
  };

  const sendPrompt = async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    appendMessage(prompt, 'user');
    promptInput.value = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        appendMessage(data.error || 'Something went wrong.', 'assistant');
        return;
      }

      appendMessage(data.answer || 'No answer returned.', 'assistant');
    } catch (error) {
      appendMessage('Unable to reach the AI service right now. Please add your environment variables.', 'assistant');
    }
  };

  sendButton.addEventListener('click', sendPrompt);

  promptInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      sendPrompt();
    }
  });
});
