# Zimsec AI Study Assistant

A full-stack educational assistant for Zimsec students that combines:
- WhatsApp coaching via Baileys
- AI subject tutoring with Gemini, Claude, OpenAI, Groq
- music generation via Suno
- syllabus and past paper analysis
- exam prediction engine
- grade-focused study support
- project assistant features for research and assignment help
- website dashboard for students and admins
- Ecocash payment stub for premium access

## Features

- WhatsApp bot with Baileys
- Image and audio analysis support
- Syllabus upload and document indexing
- Past paper upload and trend analysis
- Predicted exam papers generation
- Notes explanation and concept breakdown
- Study planner and revision guidance
- Subject-specific AI tutor
- Project assistant for school research work
- Music generation / audio summaries via Suno
- Student website UI
- Payment gateway integration placeholder for Ecocash

## Tech stack

- Node.js + Express
- Baileys for WhatsApp
- LowDB JSON file storage
- Gemini, Claude, OpenAI, Groq, and Suno API adapters
- Vanilla HTML/CSS/JS frontend

## Directory structure

- `server/` — backend API
- `bot/` — WhatsApp bot logic
- `web/` — frontend site
- `data/` — JSON persistence
- `uploads/` — uploaded files
- `README.md` — project guide

## Quick start

1. Install dependencies:
   npm install

2. Copy environment file:
   cp .env.example .env

3. Fill in API keys.

4. Start dev server:
   npm run dev

5. Visit the website at:
   http://localhost:5000

## WhatsApp bot

The bot is configured through `bot/whatsapp.js` and `bot/handlers/messageHandler.js`.
The app can answer:
- /start
- /subjects
- /predict
- /quiz
- /notes
- /past
- /project
- /help

## AI models

The project supports:
- Gemini
- Claude
- OpenAI / ChatGPT
- Groq
- Suno

Each model is routed via `server/services/aiRouter.js`.

## Deployment

See the deployment guide in this README and the production instructions below.

## Production deployment ideas

- Render
- Railway
- Fly.io
- Vercel or Cloudflare Pages for frontend
- Supabase or managed Postgres for DB if you grow later

## Android / Samsung M31 notes

For testing and local development, use Termux and run the app as a Node service. For production, use a hosting provider because WhatsApp bots should ideally run on a stable server.

## Important

This project is a strong starter, not a polished commercial product. It is designed to be expanded with your own syllabus documents, paid integrations, and real AI keys.

## Project assistant feature

This app includes a project assistant that can help students:
- choose a school project topic
- draft project titles
- generate project objectives and hypotheses
- describe methodology
- create project timelines
- produce references and summaries
- explain research steps

## Payment

The Ecocash flow is scaffolded, but you must connect it to a real provider or gateway for real payments.
