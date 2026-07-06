# Setu — Bridge to Better

**Setu** (Sanskrit: सेतु, "bridge") is a website for unbiased, judgment-free counselling
support. It connects you with seven specialized AI guides — each modeled with a distinct
persona, counselling methodology, and area of focus — so you can talk things through with
someone who can't possibly have an ulterior motive.

> Setu's guides are AI personas, not licensed clinicians, and Setu is not a replacement
> for professional therapy. Every conversation has crisis-support resources built in.

## Features

- **Landing page** introducing the concept, the seven guides, and Setu's honesty policy
- **Onboarding quiz** (3 questions) that recommends your top-3 guides — or skip and browse
- **Seven specialized guides** (CBT, trauma-informed care, ACT/mindfulness, behavioral
  activation, grief/IPT, life transitions, LGBTQ+ peer support), each with its own
  system prompt, voice, methodology, and referral boundaries
- **Real-time streaming chat** powered by the Claude API (Claude Opus 4.8)
- **Crisis detection** — flagged messages surface a crisis-resources banner, and every
  guide follows a crisis-first protocol in its system prompt
- **Privacy by design** — conversations are stored only in your browser (localStorage);
  the server is stateless and stores nothing
- Dark mode, reduced-motion support, mobile-responsive layout per `design/style-guide.md`

## Quick start

```bash
npm install
cp .env.example .env      # add your ANTHROPIC_API_KEY
npm start                 # http://localhost:3000
```

Without an API key the site still runs; chat shows a setup message instead of replies.

## Project structure

```
server/
  index.js       Express server: static hosting + streaming /api/chat (SSE)
  personas.js    Persona definitions, system prompts, quiz topic mapping
  crisis.js      Keyword-based crisis detection (first-pass signal for the UI banner)
public/
  index.html     Landing page
  app.html       The app: quiz → guide selection → chat
  js/, css/      Vanilla JS + design-system CSS (no build step)
  img/personas/  Guide avatars
design/          Original design artifacts (style guide, personas spec, chat mockup)
personas.md      Full persona & session-structure specification
```

## API

- `GET /api/personas` — public persona metadata + quiz topic map
- `POST /api/chat` — `{ personaId, messages: [{role, content}] }` → Server-Sent Events
  stream of `{type: "crisis" | "text" | "error" | "done"}` events
- `GET /api/health` — `{ ok, configured }`

## Configuration

| Variable            | Default            | Purpose                        |
| ------------------- | ------------------ | ------------------------------ |
| `ANTHROPIC_API_KEY` | —                  | Required for chat              |
| `PORT`              | `3000`             | Server port                    |
| `SETU_MODEL`        | `claude-opus-4-8`  | Claude model used for guides   |

## Design credits

Built from the product artifacts in this repo: `personas.md` (persona & session design)
and `design/style-guide.md` (visual system — pastel/creamy palette, bridge motif,
WCAG 2.1 AA targets).
