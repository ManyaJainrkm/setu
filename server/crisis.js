// Crisis detection per personas.md Part 4: keyword/phrase monitoring for self-harm,
// suicide, or violence. This is a first-pass signal used to surface the crisis banner
// in the UI; the model's own system-prompt protocol handles the conversational side.

const CRISIS_PATTERNS = [
  /\bsuicid\w*/i,
  /\bkill(?:ing)?\s+myself\b/i,
  /\bend(?:ing)?\s+(?:my|it\s+all|my\s+own)\s*(?:life)?\b/i,
  /\btake\s+my\s+(?:own\s+)?life\b/i,
  /\b(?:don'?t|do\s+not)\s+want\s+to\s+(?:live|be\s+alive|exist|wake\s+up)\b/i,
  /\bbetter\s+off\s+(?:dead|without\s+me)\b/i,
  /\bself[\s-]?harm\w*/i,
  /\bhurt(?:ing)?\s+myself\b/i,
  /\bcut(?:ting)?\s+myself\b/i,
  /\boverdos\w+/i,
  /\bno\s+reason\s+to\s+(?:live|go\s+on)\b/i,
  /\bwant\s+to\s+d(?:ie|isappear)\b/i,
  /\bkill(?:ing)?\s+(?:him|her|them|someone)\b/i,
  /\bhurt(?:ing)?\s+(?:someone|somebody|others)\b/i,
];

export function detectCrisis(text) {
  if (!text) return false;
  return CRISIS_PATTERNS.some((re) => re.test(text));
}
