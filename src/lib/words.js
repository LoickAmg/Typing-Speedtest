/**
 * Banque de mots anglais courants utilisée pour générer le texte à taper.
 * Volontairement simple (mots courts, fréquents) pour rester proche d'un
 * vrai test de vitesse de frappe (type monkeytype/10fastfingers).
 */
export const WORD_BANK = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
  "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "code",
  "keyboard", "speed", "test", "type", "quick", "brown", "fox", "jumps", "over", "lazy",
  "dog", "python", "script", "logic", "array", "string", "number", "object", "function", "class",
];

/**
 * Générateur pseudo-aléatoire déterministe (mulberry32), injecté à la place
 * de `Math.random` dans les tests pour obtenir un résultat reproductible.
 */
export function mulberry32(seed) {
  let state = seed | 0;
  return function rng() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Tire `count` mots au hasard dans `bank` (avec remise), via `rng` (par
 * défaut `Math.random`, remplaçable pour des tests déterministes).
 */
export function pickWords(count, rng = Math.random, bank = WORD_BANK) {
  if (count < 1) {
    throw new Error("count doit être >= 1");
  }
  if (bank.length === 0) {
    throw new Error("bank ne doit pas être vide");
  }
  const words = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(rng() * bank.length);
    words.push(bank[index]);
  }
  return words;
}

/** Construit le texte cible (mots séparés par des espaces) à faire taper. */
export function buildTargetText(count, rng = Math.random, bank = WORD_BANK) {
  return pickWords(count, rng, bank).join(" ");
}
