// Landing page: render the persona showcase from the API.

// Darker text shades per persona for readable tags (per style-guide badge colors).
const TAG_TEXT = {
  elena: "#8B6A45", maya: "#3D7064", kwame: "#3D4560", samir: "#3D6A50",
  ayanna: "#A06050", fatima: "#5D4A60", jordan: "#9A7030",
};

async function loadPersonas() {
  const grid = document.getElementById("personaGrid");
  try {
    const res = await fetch("/api/personas");
    const { personas } = await res.json();
    grid.innerHTML = "";
    for (const p of personas) {
      const card = document.createElement("article");
      card.className = "persona-card-large";
      card.style.setProperty("--accent", p.color);
      card.style.setProperty("--accent-text", TAG_TEXT[p.id] || "inherit");
      card.innerHTML = `
        <div class="card-top">
          <img class="card-avatar" src="${p.avatar}" alt="${p.name}" loading="lazy">
          <div>
            <div class="card-name">${p.name}</div>
            <div class="card-orientation">${p.orientation}</div>
            <div class="card-tags">
              ${p.tags.map((t) => `<span class="card-tag">${t}</span>`).join("")}
            </div>
          </div>
        </div>
        <p class="card-quote">“${p.quote}”</p>
        <p class="card-desc">${p.description}</p>
        <a class="btn btn-primary card-btn" href="/app.html?guide=${p.id}">Connect →</a>
      `;
      grid.appendChild(card);
    }
  } catch {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--medium-stone)">
      Couldn't load the guides right now — <a href="/app.html">head to the app</a> instead.</p>`;
  }
}

loadPersonas();
