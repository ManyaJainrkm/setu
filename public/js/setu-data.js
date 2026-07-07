// Loads the shared persona data (relative path so it works at /setu/ on GitHub
// Pages, at a custom domain root, or from a local server). Cached after first load.
let _cache = null;
window.loadSetuData = async function loadSetuData() {
  if (_cache) return _cache;
  const res = await fetch("data/personas.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load persona data (${res.status})`);
  _cache = await res.json();
  return _cache;
};
