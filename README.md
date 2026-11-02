# ZIMSEC Tutor Bot

A WhatsApp study assistant for ZIMSEC O-Level revision and exam preparation.

Features
- WhatsApp pairing and session persistence
- multi-model AI routing using OpenAI, Gemini, Claude, and Groq
- Suno-ready media generation placeholder for future expansion
- exam-focused commands for revision planning and topic analysis
- support for image and audio message handling in the bot flow
- syllabus-style study suggestions and 2-week readiness planning
- simple HTTP health/status endpoint for panel monitoring

Project structure
- index.js - starts the Express app and bot lifecycle
- services/aiRouter.js - model routing and OpenAI/Gemini/Claude/Groq request logic
- services/commandHandler.js - parsing commands and study prompts
- services/studyEngine.js - 2-week plan, quiz, summary, topic analysis helpers
- services/whatsapp.js - WhatsApp connection with QR pairing and message listener
- config/env.js - environment handling

Environment variables
Create a .env file using .env.example and add your keys.

Minimum working setup
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=3000

Run locally
npm install
npm start

Deployment
Deploy this project as a Node.js app on a hosting platform. Keep the bot process alive and use your environment variables for all secrets.

Main commands
- /start
- /help
- /plan mathematics
- /quiz biology
- /analyze geography
- /summary chemistry organic chemistry
- /status
- /model

Good next steps
- add real PDF analysis support
- add stronger image/audio understanding using model vision features
- add a database for user progress tracking
- add flashcards, timed tests, and revision reminders
- add a payment layer later
