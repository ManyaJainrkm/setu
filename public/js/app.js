// Setu app — static, bring-your-own-key.
// Persona data is loaded from data/personas.json; chat calls the Anthropic API
// directly from the browser using a key the visitor stores locally.

const TAG_TEXT = {
  elena: "#8B6A45", maya: "#3D7064", kwame: "#3D4560", samir: "#3D6A50",
  ayanna: "#A06050", fatima: "#5D4A60", jordan: "#9A7030",
};

const STORE = {
  accepted: "setu.accepted",
  convos: "setu.convos",
  quizDone: "setu.quizDone",
  apiKey: "setu.apiKey",
};

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

// First-pass crisis detection (mirrors the server's crisis.js) — surfaces the
// crisis-resources banner. Each guide also follows a crisis protocol in-prompt.
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
function detectCrisis(text) {
  return text ? CRISIS_PATTERNS.some((re) => re.test(text)) : false;
}

const state = {
  personas: [],
  topicMap: {},
  sharedGuidelines: "",
  model: "claude-opus-4-8",
  activeId: null,
  sending: false,
  recommended: [],
  pendingSend: false,
};

const $ = (id) => document.getElementById(id);

/* ---------------- storage ---------------- */

function loadConvos() {
  try { return JSON.parse(localStorage.getItem(STORE.convos)) || {}; }
  catch { return {}; }
}
function saveConvo(personaId, messages) {
  const all = loadConvos();
  all[personaId] = messages;
  localStorage.setItem(STORE.convos, JSON.stringify(all));
}
function getConvo(personaId) {
  return loadConvos()[personaId] || [];
}
function getKey() { return localStorage.getItem(STORE.apiKey) || ""; }
function setKey(k) { localStorage.setItem(STORE.apiKey, k.trim()); }
function clearKey() { localStorage.removeItem(STORE.apiKey); }

/* ---------------- screens ---------------- */

function showScreen(name) {
  $("screenQuiz").classList.toggle("hidden", name !== "quiz");
  $("screenSelect").classList.toggle("hidden", name !== "select");
  $("screenChat").classList.toggle("hidden", name !== "chat");
  $("sidebar").classList.remove("open");
}

/* ---------------- sidebar ---------------- */

function renderSidebar() {
  const list = $("personaList");
  list.innerHTML = "";
  const convos = loadConvos();
  for (const p of state.personas) {
    const btn = document.createElement("button");
    btn.className = "persona-card" + (p.id === state.activeId ? " active" : "");
    btn.style.setProperty("--accent", p.color);
    btn.setAttribute("aria-label", `Talk with ${p.name}`);

    const img = document.createElement("img");
    img.className = "persona-avatar";
    img.src = p.avatar;
    img.alt = "";

    const info = document.createElement("div");
    info.className = "persona-info";
    const name = document.createElement("div");
    name.className = "persona-name";
    name.textContent = p.name;
    const spec = document.createElement("div");
    spec.className = "persona-specialty";
    spec.textContent = p.specialty;
    info.append(name, spec);

    btn.append(img, info);
    const msgCount = (convos[p.id] || []).filter((m) => m.role === "user").length;
    if (msgCount > 0) {
      const badge = document.createElement("span");
      badge.className = "persona-unread";
      badge.textContent = "chat";
      btn.append(badge);
    }
    btn.addEventListener("click", () => openChat(p.id));
    list.appendChild(btn);
  }
  updateKeyStatus();
}

function updateKeyStatus() {
  const el = $("keyStatus");
  if (!el) return;
  el.textContent = getKey() ? "API key: saved ✓" : "API key: not set — add one to chat";
}

/* ---------------- API key modal ---------------- */

function openKeyModal(pending = false) {
  state.pendingSend = pending;
  $("keyInput").value = getKey();
  $("keyModal").classList.remove("hidden");
  setTimeout(() => $("keyInput").focus(), 50);
}
function closeKeyModal() {
  $("keyModal").classList.add("hidden");
  state.pendingSend = false;
}
function saveKeyFromModal() {
  const k = $("keyInput").value.trim();
  if (!k) return;
  setKey(k);
  updateKeyStatus();
  const wasPending = state.pendingSend;
  closeKeyModal();
  if (wasPending && state.activeId) sendMessage();
}

/* ---------------- quiz ---------------- */

const QUIZ = [
  {
    q: "What's weighing on you most right now?",
    key: "topic",
    options: [
      { label: "Anxiety, worry, or a racing mind", emoji: "🌀", value: "anxiety" },
      { label: "Low mood, no energy or motivation", emoji: "🌧️", value: "low_mood" },
      { label: "A breakup, divorce, or big life change", emoji: "🚪", value: "breakup" },
      { label: "Grief or losing someone", emoji: "🕯️", value: "grief" },
      { label: "Burnout or work stress", emoji: "🔥", value: "burnout" },
      { label: "Something painful that happened to me", emoji: "🛡️", value: "trauma" },
      { label: "Identity, coming out, or belonging", emoji: "🌈", value: "identity" },
      { label: "Loneliness or difficult relationships", emoji: "🫂", value: "loneliness" },
    ],
  },
  {
    q: "What kind of support sounds right today?",
    key: "style",
    options: [
      { label: "Practical steps I can actually take", emoji: "🧗", value: "practical", boosts: ["ayanna", "maya", "elena"] },
      { label: "Someone to really listen and understand", emoji: "👂", value: "listen", boosts: ["fatima", "jordan", "kwame"] },
      { label: "Tools and techniques for my mind", emoji: "🧰", value: "tools", boosts: ["elena", "samir"] },
      { label: "Perspective on the bigger picture", emoji: "🔭", value: "perspective", boosts: ["samir", "maya", "fatima"] },
    ],
  },
  {
    q: "Who would you find it easiest to open up to?",
    key: "vibe",
    options: [
      { label: "A credentialed professional", emoji: "🎓", value: "clinical", badges: ["Clinical"] },
      { label: "Someone who's lived through it", emoji: "🤝", value: "peer", badges: ["Coach", "Peer", "Certified"] },
      { label: "No preference — whoever fits best", emoji: "✨", value: "any", badges: [] },
    ],
  },
];

let quizStep = 0;
const quizAnswers = {};

function renderQuiz() {
  const card = $("quizCard");
  const item = QUIZ[quizStep];
  card.innerHTML = "";

  const progress = document.createElement("div");
  progress.className = "quiz-progress";
  progress.textContent = `Question ${quizStep + 1} of ${QUIZ.length}`;

  const q = document.createElement("h2");
  q.className = "quiz-question";
  q.textContent = item.q;

  const opts = document.createElement("div");
  opts.className = "quiz-options";
  for (const opt of item.options) {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.innerHTML = `<span class="emoji" aria-hidden="true"></span><span></span>`;
    btn.querySelector(".emoji").textContent = opt.emoji;
    btn.querySelector("span:last-child").textContent = opt.label;
    btn.addEventListener("click", () => {
      quizAnswers[item.key] = opt;
      quizStep += 1;
      if (quizStep < QUIZ.length) renderQuiz();
      else finishQuiz();
    });
    opts.appendChild(btn);
  }
  card.append(progress, q, opts);
}

function finishQuiz() {
  const scores = {};
  for (const p of state.personas) scores[p.id] = 0;

  const trio = state.topicMap[quizAnswers.topic?.value] || [];
  trio.forEach((id, i) => { scores[id] = (scores[id] || 0) + (5 - i); });

  for (const id of quizAnswers.style?.boosts || []) scores[id] += 2;

  const badges = quizAnswers.vibe?.badges || [];
  if (badges.length) {
    for (const p of state.personas) if (badges.includes(p.badge)) scores[p.id] += 1.5;
  }

  state.recommended = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  localStorage.setItem(STORE.quizDone, "1");
  renderSelect(true);
  showScreen("select");
}

/* ---------------- selection screen ---------------- */

function renderSelect(withRecommendations) {
  const grid = $("selectGrid");
  grid.innerHTML = "";
  $("selectTitle").textContent = withRecommendations && state.recommended.length
    ? "Here's who we'd suggest"
    : "Choose your guide";
  $("selectSub").textContent = withRecommendations && state.recommended.length
    ? "Based on your answers — but this is your call. Any guide will gladly talk with you."
    : "You can switch guides at any time — each keeps their own conversation with you.";

  const ordered = [...state.personas].sort((a, b) => {
    const ra = state.recommended.indexOf(a.id);
    const rb = state.recommended.indexOf(b.id);
    return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb);
  });

  for (const p of ordered) {
    const rec = withRecommendations && state.recommended.includes(p.id);
    const card = document.createElement("article");
    card.className = "persona-card-large" + (rec ? " recommended" : "");
    card.style.setProperty("--accent", p.color);
    card.style.setProperty("--accent-text", TAG_TEXT[p.id] || "inherit");

    if (rec) {
      const badge = document.createElement("span");
      badge.className = "recommended-badge";
      badge.textContent = state.recommended[0] === p.id ? "★ Best match" : "Suggested";
      card.appendChild(badge);
    }

    const top = document.createElement("div");
    top.className = "card-top";
    top.innerHTML = `
      <img class="card-avatar" alt="">
      <div>
        <div class="card-name"></div>
        <div class="card-orientation"></div>
        <div class="card-tags"></div>
      </div>`;
    top.querySelector("img").src = p.avatar;
    top.querySelector("img").alt = p.name;
    top.querySelector(".card-name").textContent = p.name;
    top.querySelector(".card-orientation").textContent = p.orientation;
    const tagWrap = top.querySelector(".card-tags");
    for (const t of p.tags) {
      const tag = document.createElement("span");
      tag.className = "card-tag";
      tag.textContent = t;
      tagWrap.appendChild(tag);
    }

    const quote = document.createElement("p");
    quote.className = "card-quote";
    quote.textContent = `“${p.quote}”`;

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = p.description;

    const btn = document.createElement("button");
    btn.className = "btn btn-primary card-btn";
    btn.textContent = "Connect →";
    btn.addEventListener("click", () => openChat(p.id));

    card.append(top, quote, desc, btn);
    grid.appendChild(card);
  }
}

/* ---------------- chat ---------------- */

function persona(id) {
  return state.personas.find((p) => p.id === id);
}

function openChat(id) {
  const p = persona(id);
  if (!p) return;
  state.activeId = id;

  $("chatAvatar").src = p.avatar;
  $("chatAvatar").alt = p.name;
  $("chatHeader").style.setProperty("--accent", p.color);
  $("chatName").textContent = p.name;
  $("chatStatus").textContent = `Online · ${p.specialty}`;

  let convo = getConvo(id);
  if (convo.length === 0) {
    convo = [{ role: "assistant", content: p.greeting, ts: Date.now() }];
    saveConvo(id, convo);
  }
  renderMessages(convo);
  renderSidebar();
  showScreen("chat");
  $("inputBox").focus();
}

function timeLabel(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function messageEl(msg, p) {
  const wrap = document.createElement("div");
  wrap.className = `message ${msg.role === "user" ? "user" : "persona"}`;
  wrap.style.setProperty("--accent", p.color);
  wrap.setAttribute("role", "article");

  if (msg.role !== "user") {
    const av = document.createElement("img");
    av.className = "message-avatar";
    av.src = p.avatar;
    av.alt = "";
    wrap.appendChild(av);
  }
  const inner = document.createElement("div");
  const bubble = document.createElement("div");
  bubble.className = "message-bubble" + (msg.error ? " error-bubble" : "");
  bubble.textContent = msg.content;
  if (msg.ts) {
    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = timeLabel(msg.ts);
    bubble.appendChild(time);
  }
  inner.appendChild(bubble);
  wrap.appendChild(inner);
  return wrap;
}

function renderMessages(convo) {
  const p = persona(state.activeId);
  const inner = $("messagesInner");
  inner.innerHTML = "";

  const sys = document.createElement("div");
  sys.className = "system-message";
  sys.textContent = `This is a private conversation with ${p.shortName} — an AI guide, saved only in your browser.`;
  inner.appendChild(sys);

  if (!getKey()) inner.appendChild(keyPromptEl());

  for (const msg of convo) inner.appendChild(messageEl(msg, p));
  scrollToBottom();
}

function keyPromptEl() {
  const el = document.createElement("div");
  el.className = "crisis-banner";
  el.style.borderLeftColor = "var(--butter-dark)";
  el.style.background = "var(--butter-light)";
  el.style.color = "var(--dark-stone)";
  el.innerHTML = `
    <span class="crisis-banner-icon" aria-hidden="true">🔑</span>
    <div>
      <strong>Add your Anthropic API key to start chatting.</strong>
      Setu runs on your own key, stored only in this browser — nothing is sent to us.
      <a href="#" id="inlineKeyLink">Add your key →</a>
    </div>`;
  el.querySelector("#inlineKeyLink").addEventListener("click", (e) => {
    e.preventDefault();
    openKeyModal(false);
  });
  return el;
}

function scrollToBottom() {
  const area = $("messagesArea");
  area.scrollTop = area.scrollHeight;
}

function showCrisisBanner() {
  const inner = $("messagesInner");
  if (inner.querySelector(".crisis-banner.crisis-real")) return;
  const banner = document.createElement("div");
  banner.className = "crisis-banner crisis-real pinned";
  banner.setAttribute("role", "alert");
  banner.innerHTML = `
    <span class="crisis-banner-icon" aria-hidden="true">⚠</span>
    <div>
      <strong>Need immediate support?</strong> If you're in crisis or thinking about harming yourself,
      please reach out to real humans right now —
      India: <a href="tel:14416">Tele-MANAS 14416</a> ·
      US: <a href="tel:988">call or text 988</a> ·
      elsewhere: <a href="https://findahelpline.com" target="_blank" rel="noopener">findahelpline.com</a>.
      Your guide is still here with you too.
    </div>`;
  inner.prepend(banner);
  $("messagesArea").scrollTop = 0;
}

function typingIndicator(p) {
  const el = document.createElement("div");
  el.className = "typing-indicator";
  el.style.setProperty("--accent", p.color);
  el.setAttribute("aria-label", `${p.shortName} is typing`);
  el.innerHTML = `
    <img class="typing-avatar" alt="" aria-hidden="true">
    <div class="typing-dots" aria-hidden="true">
      <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
    </div>`;
  el.querySelector("img").src = p.avatar;
  return el;
}

function buildSystemPrompt(p) {
  return `${state.sharedGuidelines}\n\n---\n\n${p.system}`;
}

async function sendMessage() {
  const box = $("inputBox");
  const text = box.value.trim();
  if (!text || state.sending || !state.activeId) return;

  if (!getKey()) { openKeyModal(true); return; }

  const p = persona(state.activeId);
  const convo = getConvo(state.activeId);
  convo.push({ role: "user", content: text, ts: Date.now() });
  saveConvo(state.activeId, convo);

  box.value = "";
  box.style.height = "auto";
  state.sending = true;
  $("btnSend").disabled = true;

  const inner = $("messagesInner");
  inner.appendChild(messageEl(convo[convo.length - 1], p));
  if (detectCrisis(text)) showCrisisBanner();
  const typing = typingIndicator(p);
  inner.appendChild(typing);
  scrollToBottom();

  // The API requires the first message to be from the user, so strip the
  // locally-inserted greeting (and any leading assistant turns).
  const firstUser = convo.findIndex((m) => m.role === "user");
  const apiMessages = convo.slice(firstUser).map(({ role, content }) => ({ role, content }));

  let streamBubble = null;
  let streamText = "";
  let gotError = false;

  const startStreamBubble = () => {
    typing.remove();
    const el = messageEl({ role: "assistant", content: "" }, p);
    streamBubble = el.querySelector(".message-bubble");
    inner.appendChild(el);
  };
  const fail = (message) => {
    gotError = true;
    typing.remove();
    inner.appendChild(messageEl({ role: "assistant", content: message, error: true, ts: Date.now() }, p));
    scrollToBottom();
  };

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": getKey(),
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: state.model,
        max_tokens: 2048,
        system: buildSystemPrompt(p),
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!res.ok) {
      let detail = "";
      try { detail = (await res.json())?.error?.message || ""; } catch { /* ignore */ }
      if (res.status === 401) {
        clearKey();
        updateKeyStatus();
        fail("Your API key was rejected. It may be wrong or revoked — add a valid key and try again.");
        openKeyModal(false);
      } else if (res.status === 429) {
        fail("Your Anthropic account is rate-limited or out of credit right now. Wait a moment, or check your usage, then try again.");
      } else if (res.status === 400 && /credit balance/i.test(detail)) {
        fail("Your Anthropic account has no credit balance. Add credit at console.anthropic.com, then try again.");
      } else {
        fail(`Something went wrong reaching Claude${detail ? ` — ${detail}` : ""}. Please try again.`);
      }
    } else if (res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let refused = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          for (const line of part.split("\n")) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            let ev;
            try { ev = JSON.parse(t.slice(5)); } catch { continue; }
            if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
              if (!streamBubble) startStreamBubble();
              streamText += ev.delta.text;
              streamBubble.textContent = streamText;
              scrollToBottom();
            } else if (ev.type === "message_delta" && ev.delta?.stop_reason === "refusal") {
              refused = true;
            } else if (ev.type === "error") {
              fail(`Claude returned an error${ev.error?.message ? ` — ${ev.error.message}` : ""}.`);
            }
          }
        }
      }
      if (refused && !streamText) {
        streamText =
          "I'm not able to continue with that particular topic, but I'm still here with you. Is there something else on your mind we could sit with together?";
        startStreamBubble();
        streamBubble.textContent = streamText;
      }
    }
  } catch {
    fail("I couldn't reach Claude just now — check your internet connection and try again. Your message is saved.");
  }

  typing.remove();
  if (streamText) {
    convo.push({ role: "assistant", content: streamText, ts: Date.now() });
    saveConvo(state.activeId, convo);
    renderMessages(convo); // re-render so the streamed bubble gains its timestamp
  } else if (!gotError) {
    fail("Hmm, no response came through. Please try sending that again.");
  }

  state.sending = false;
  $("btnSend").disabled = false;
  renderSidebar();
  $("inputBox").focus();
}

/* ---------------- wiring ---------------- */

function wireEvents() {
  const box = $("inputBox");
  box.addEventListener("input", () => {
    box.style.height = "auto";
    box.style.height = Math.min(box.scrollHeight, 140) + "px";
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  $("btnSend").addEventListener("click", sendMessage);

  $("btnSkipQuiz").addEventListener("click", () => {
    state.recommended = [];
    renderSelect(false);
    showScreen("select");
  });
  $("btnFindGuide").addEventListener("click", () => {
    quizStep = 0;
    renderQuiz();
    showScreen("quiz");
  });
  $("btnSwitch").addEventListener("click", () => {
    renderSelect(state.recommended.length > 0);
    showScreen("select");
  });
  $("btnNewSession").addEventListener("click", () => {
    if (!state.activeId) return;
    const p = persona(state.activeId);
    const fresh = [{ role: "assistant", content: p.greeting, ts: Date.now() }];
    saveConvo(state.activeId, fresh);
    renderMessages(fresh);
  });

  $("btnAbout").addEventListener("click", () => {
    $("disclaimerModal").classList.remove("hidden");
    $("btnAcceptDisclaimer").textContent = "Got it";
  });
  $("btnAcceptDisclaimer").addEventListener("click", () => {
    localStorage.setItem(STORE.accepted, "1");
    $("disclaimerModal").classList.add("hidden");
  });

  $("btnApiKey").addEventListener("click", () => openKeyModal(false));
  $("btnSaveKey").addEventListener("click", saveKeyFromModal);
  $("btnCloseKey").addEventListener("click", closeKeyModal);
  $("btnClearKey").addEventListener("click", () => {
    clearKey();
    $("keyInput").value = "";
    updateKeyStatus();
    if (state.activeId) renderMessages(getConvo(state.activeId));
  });
  $("keyInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); saveKeyFromModal(); }
  });

  $("btnClearData").addEventListener("click", () => $("clearModal").classList.remove("hidden"));
  $("btnCancelClear").addEventListener("click", () => $("clearModal").classList.add("hidden"));
  $("btnConfirmClear").addEventListener("click", () => {
    localStorage.removeItem(STORE.convos);
    $("clearModal").classList.add("hidden");
    renderSidebar();
    if (state.activeId) openChat(state.activeId);
  });

  $("btnMenu").addEventListener("click", () => $("sidebar").classList.add("open"));
  $("sidebarClose").addEventListener("click", () => $("sidebar").classList.remove("open"));
}

async function init() {
  wireEvents();
  let data;
  try {
    data = await window.loadSetuData();
  } catch {
    $("quizCard").innerHTML =
      `<p style="color:var(--crisis-text)">Couldn't load Setu's guide data. If you're opening the file directly, use a web server (or the live site) instead.</p>`;
    return;
  }
  state.personas = data.personas;
  state.topicMap = data.topicMap;
  state.sharedGuidelines = data.sharedGuidelines;
  state.model = data.model || state.model;

  renderSidebar();

  if (!localStorage.getItem(STORE.accepted)) {
    $("disclaimerModal").classList.remove("hidden");
  }

  const guideParam = new URLSearchParams(location.search).get("guide");
  if (guideParam && persona(guideParam)) {
    openChat(guideParam);
  } else if (localStorage.getItem(STORE.quizDone) || Object.keys(loadConvos()).length) {
    renderSelect(false);
    showScreen("select");
  } else {
    renderQuiz();
    showScreen("quiz");
  }
}

init();
