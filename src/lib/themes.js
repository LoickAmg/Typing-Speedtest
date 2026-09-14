/**
 * Gestion du thème clair/sombre.
 * Persiste le choix dans localStorage et applique data-theme sur <html>.
 */

const STORAGE_KEY = "typing-speedtest-theme";

/**
 * Détecte la préférence système.
 * @returns {"dark"|"light"}
 */
function systemPreference() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/**
 * Lit le thème depuis localStorage, sinon fallback système.
 * @returns {"dark"|"light"}
 */
export function getTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(STORAGE_KEY) || systemPreference();
}

/**
 * Applique le thème au document et persiste.
 * @param {"dark"|"light"} theme
 */
export function setTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Bascule entre clair et sombre.
 * @returns {"dark"|"light"} le nouveau thème
 */
export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/**
 * Initialise le thème au chargement (appeler une fois au démarrage).
 * @returns {"dark"|"light"}
 */
export function initTheme() {
  const theme = getTheme();
  setTheme(theme);
  return theme;
}
