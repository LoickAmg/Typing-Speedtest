/**
 * Génération de texte pour le test de frappe.
 * Deux modes :
 *   - coherent   : mots réels du dictionnaire de la langue sélectionnée
 *   - incoherent : séquences aléatoires de 3-8 caractères (difficulté accrue)
 *
 * Remplace l'ancien words.js. Aucune dépendance externe.
 */

import { getLanguage, getRandomWord, generateIncoherentWord } from "./languages.js";

/**
 * Génère un PRNG Mulberry32 déterministe à partir d'une graine.
 * @param {number} seed
 * @returns {function(): number} fonction retournant [0,1)
 */
export function createRNG(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Génère une chaîne de mots pour le test.
 * @param {object} options
 * @param {number} options.count        - Nombre de mots à générer (défaut: 25)
 * @param {string} options.langCode     - Code de langue (défaut: "en")
 * @param {"coherent"|"incoherent"} options.mode - Mode de génération (défaut: "coherent")
 * @param {number} options.seed         - Graine PRNG (défaut: Date.now())
 * @returns {{ text: string, words: string[], seed: number }}
 */
export function generateText({ count = 25, langCode = "en", mode = "coherent", seed } = {}) {
  const rng = createRNG(seed ?? Date.now());
  const lang = getLanguage(langCode) || getLanguage("en");
  const words = [];

  for (let i = 0; i < count; i++) {
    if (mode === "incoherent") {
      words.push(generateIncoherentWord(langCode, rng));
    } else {
      words.push(getRandomWord(langCode, rng));
    }
  }

  return { text: words.join(" "), words, seed: rng() };
}

/**
 * Retourne la liste des modes disponibles.
 * @returns {Array<{id: string, label: string, description: string}>}
 */
export function getModes() {
  return [
    { id: "coherent",   label: "Coherent",   description: "Real words and phrases" },
    { id: "incoherent", label: "Incoherent",  description: "Random character sequences" },
  ];
}
