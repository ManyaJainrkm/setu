# Setu: Bridge to Better

**Setu** (Sanskrit: सेतु, "bridge") is a website for unbiased, judgment-free counselling
support. It connects you with seven specialized AI guides, each modeled with a distinct
persona, counselling methodology, and area of focus, so you can talk things through with
someone who can't possibly have an ulterior motive.

Setu is a **static site that runs on your own AI provider API key.** Your messages go
straight from your browser to the model provider; there's no Setu server in the middle,
and your conversations live only in your browser.

> Setu's guides are AI personas, not licensed clinicians, and Setu is not a replacement
> for professional therapy. Every conversation has crisis support resources built in.

## Features

- **Landing page** introducing the concept, the seven guides, and Setu's honesty policy
- **Onboarding quiz** (3 questions) that recommends your top 3 guides, or skip and browse
- **Seven specialized guides** (CBT, trauma informed care, ACT/mindfulness, behavioral
  activation, grief/IPT, life transitions, LGBTQ+ peer support), each with its own
  system prompt, voice, methodology, and referral boundaries
- **Real time streaming chat** with a large language model, called directly from the browser
- **Bring your own key**: each visitor supplies their own API key, stored only in
  their browser (localStorage). No accounts, no shared secret, no Setu backend
- **Crisis detection**: flagged messages surface a crisis resources banner, and every
  guide follows a crisis first protocol in its system prompt
- Dark mode, reduced motion support, mobile responsive layout

## Live site

Setu is deployed and live on GitHub Pages.

## Project structure

```
public/                 The static site (this is what GitHub Pages serves)
  index.html            Landing page
  app.html               The app: quiz, guide selection, chat
  data/personas.json    Single source of truth for persona data (guides + prompts)
  js/                     setu data.js (loader), landing.js, app.js (chat + BYOK)
  css/styles.css         Design system
  img/personas/           Guide avatars
.github/workflows/pages.yml   GitHub Pages deploy
server/                 Optional local Node server (reads public/data/personas.json)
design/                 Original design artifacts (style guide, personas spec, mockup)
personas.md             Full persona and session structure specification
```

## Privacy model

No Setu server is involved in the deployment. The browser calls the model provider's
API directly using a direct browser access header. The API key and all conversations
are stored only in the visitor's browser (localStorage). "Clear all my conversations"
and "Remove saved key" wipe them.

## Design credits

Built from the product artifacts in this repo: `personas.md` (persona and session design)
and `design/style guide.md` (visual system: pastel/creamy palette, bridge motif,
WCAG 2.1 AA targets).