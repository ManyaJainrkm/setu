import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { PERSONAS, TOPIC_MAP, getPersona, publicPersona, buildSystemPrompt } from "./personas.js";
import { detectCrisis } from "./crisis.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MODEL = process.env.SETU_MODEL || "claude-opus-4-8";

const MAX_HISTORY = 40; // messages sent to the model per request
const MAX_MESSAGE_CHARS = 4000;

const app = express();
app.use(express.json({ limit: "256kb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

const anthropic = new Anthropic();

app.get("/api/personas", (_req, res) => {
  res.json({ personas: PERSONAS.map(publicPersona), topicMap: TOPIC_MAP });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: hasCredentials() });
});

function hasCredentials() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const messages = [];
  for (const m of raw.slice(-MAX_HISTORY)) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return null;
    if (typeof m.content !== "string" || !m.content.trim()) return null;
    messages.push({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) });
  }
  if (messages.length === 0 || messages[0].role !== "user") return null;
  return messages;
}

// POST /api/chat  { personaId, messages: [{role, content}, ...] }
// Responds with an SSE stream of {type: "crisis" | "text" | "done" | "error"} events.
app.post("/api/chat", async (req, res) => {
  const persona = getPersona(req.body?.personaId);
  if (!persona) return res.status(400).json({ error: "Unknown persona" });

  const messages = sanitizeMessages(req.body?.messages);
  if (!messages) return res.status(400).json({ error: "Invalid messages" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  const send = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const crisis = detectCrisis(lastUserMessage?.content);
  if (crisis) send({ type: "crisis" });

  if (!hasCredentials()) {
    send({
      type: "error",
      message:
        "The server is missing an Anthropic API key. Copy .env.example to .env and set ANTHROPIC_API_KEY, then restart.",
    });
    send({ type: "done" });
    return res.end();
  }

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system: [
        {
          type: "text",
          text: buildSystemPrompt(persona),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    req.on("close", () => stream.abort());

    stream.on("text", (delta) => send({ type: "text", text: delta }));

    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") {
      send({
        type: "text",
        text: "I'm not able to continue with that particular topic, but I'm still here with you. Is there something else on your mind we could sit with together?",
      });
    }
    send({ type: "done" });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`Anthropic API error ${err.status}: ${err.message}`);
      send({
        type: "error",
        message:
          err instanceof Anthropic.AuthenticationError
            ? "The server's API key was rejected. Check ANTHROPIC_API_KEY in .env."
            : err instanceof Anthropic.RateLimitError
              ? "We're getting a lot of messages right now. Please wait a moment and try again."
              : "Something went wrong reaching your guide. Please try again.",
      });
    } else if (err?.name !== "AbortError" && !(err instanceof Anthropic.APIUserAbortError)) {
      console.error("Chat error:", err);
      send({ type: "error", message: "Something went wrong. Please try again." });
    }
    send({ type: "done" });
  }
  res.end();
});

app.listen(PORT, () => {
  console.log(`Setu running at http://localhost:${PORT}`);
  if (!hasCredentials()) {
    console.warn(
      "⚠ ANTHROPIC_API_KEY is not set — the site will load, but chat will show a setup message.\n  Copy .env.example to .env and add your key.",
    );
  }
});
