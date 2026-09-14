/**
 * État centralisé des paramètres de l'application.
 * Persiste dans localStorage sous la clé "typing-speedtest-settings".
 * Fournit un système d'événements simple pour réagir aux changements.
 */

const STORAGE_KEY = "typing-speedtest-settings";

/** @type {{ langCode: string, layout: string, mode: string, theme: string, wordCount: number }} */
const defaults = {
  langCode: "en",
  layout: "qwerty",
  mode: "coherent",
  theme: "dark",
  wordCount: 25,
};

/** @type {Map<string, Set<function>>} */
const listeners = new Map();

/** @type {object} */
let state = { ...defaults };

/**
 * Charge l'état depuis localStorage (côté client uniquement).
 */
export function loadSettings() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...defaults, ...parsed };
    }
  } catch {
    state = { ...defaults };
  }
}

/**
 * Sauvegarde l'état dans localStorage.
 */
function saveSettings() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

/**
 * Retourne l'état courant (lecture seule).
 * @returns {object}
 */
export function getSettings() {
  return { ...state };
}

/**
 * Met à jour un ou plusieurs paramètres et notifie les listeners.
 * @param {Partial<typeof defaults>} patch
 */
export function updateSettings(patch) {
  const prev = { ...state };
  Object.assign(state, patch);
  saveSettings();
  for (const [key, value] of Object.entries(patch)) {
    if (prev[key] !== value) {
      const fns = listeners.get(key);
      if (fns) fns.forEach((fn) => fn(value, prev[key], key));
    }
  }
}

/**
 * Réinitialise tous les paramètres aux valeurs par défaut.
 */
export function resetSettings() {
  updateSettings(defaults);
}

/**
 * Abonne une callback à un changement de paramètre.
 * @param {string} key - Nom du paramètre (ex: "langCode")
 * @param {function} fn - Callback(value, oldValue, key)
 * @returns {function} fonction de désabonnement
 */
export function onSettingChange(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  return () => listeners.get(key)?.delete(fn);
}
