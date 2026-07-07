// Persona definitions for Setu.
// Single source of truth is public/data/personas.json (also fetched directly by
// the static frontend). The server loads it here for the optional local API.
// Public metadata is sent to the frontend; the `system` prompt is design content.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = JSON.parse(
  readFileSync(path.join(__dirname, "..", "public", "data", "personas.json"), "utf8"),
);

export const SHARED_GUIDELINES = DATA.sharedGuidelines;
export const TOPIC_MAP = DATA.topicMap;
export const MODEL = DATA.model;

// The server historically used absolute avatar paths (leading slash); the JSON
// stores them relative for project-page hosting. Normalize back for the server.
export const PERSONAS = DATA.personas.map((p) => ({
  ...p,
  avatar: p.avatar.startsWith("/") ? p.avatar : `/${p.avatar}`,
}));

export function getPersona(id) {
  return PERSONAS.find((p) => p.id === id) || null;
}

export function publicPersona(p) {
  const { system, ...pub } = p;
  return pub;
}

export function buildSystemPrompt(persona) {
  return `${SHARED_GUIDELINES}\n\n---\n\n${persona.system}`;
}
