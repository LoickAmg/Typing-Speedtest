/**
 * Clavier visuel multi-layout : QWERTY + AZERTY.
 * Chaque layout définit les rangées, le mapping caractère→touche,
 * et le mapping touche→doigt. Toutes les API prennent un paramètre
 * layoutName ("qwerty" ou "azerty") pour rester pures et testables.
 *
 * Aucune dépendance DOM — couche pure de données.
 */

// ─── Layout QWERTY US ─────────────────────────────────────────────

const QWERTY_ROWS = [
  [
    { id: "Backquote", label: "`" },
    { id: "Digit1", label: "1" },
    { id: "Digit2", label: "2" },
    { id: "Digit3", label: "3" },
    { id: "Digit4", label: "4" },
    { id: "Digit5", label: "5" },
    { id: "Digit6", label: "6" },
    { id: "Digit7", label: "7" },
    { id: "Digit8", label: "8" },
    { id: "Digit9", label: "9" },
    { id: "Digit0", label: "0" },
    { id: "Minus", label: "-" },
    { id: "Equal", label: "=" },
  ],
  [
    { id: "KeyQ", label: "Q" },
    { id: "KeyW", label: "W" },
    { id: "KeyE", label: "E" },
    { id: "KeyR", label: "R" },
    { id: "KeyT", label: "T" },
    { id: "KeyY", label: "Y" },
    { id: "KeyU", label: "U" },
    { id: "KeyI", label: "I" },
    { id: "KeyO", label: "O" },
    { id: "KeyP", label: "P" },
    { id: "BracketLeft", label: "[" },
    { id: "BracketRight", label: "]" },
    { id: "Backslash", label: "\\" },
  ],
  [
    { id: "KeyA", label: "A" },
    { id: "KeyS", label: "S" },
    { id: "KeyD", label: "D" },
    { id: "KeyF", label: "F", homing: true },
    { id: "KeyG", label: "G" },
    { id: "KeyH", label: "H" },
    { id: "KeyJ", label: "J", homing: true },
    { id: "KeyK", label: "K" },
    { id: "KeyL", label: "L" },
    { id: "Semicolon", label: ";" },
    { id: "Quote", label: "'" },
  ],
  [
    { id: "KeyZ", label: "Z" },
    { id: "KeyX", label: "X" },
    { id: "KeyC", label: "C" },
    { id: "KeyV", label: "V" },
    { id: "KeyB", label: "B" },
    { id: "KeyN", label: "N" },
    { id: "KeyM", label: "M" },
    { id: "Comma", label: "," },
    { id: "Period", label: "." },
    { id: "Slash", label: "/" },
  ],
  [{ id: "Space", label: "", width: 6 }],
];

const QWERTY_CHAR_TO_CODE = {
  a: "KeyA", b: "KeyB", c: "KeyC", d: "KeyD", e: "KeyE", f: "KeyF",
  g: "KeyG", h: "KeyH", i: "KeyI", j: "KeyJ", k: "KeyK", l: "KeyL",
  m: "KeyM", n: "KeyN", o: "KeyO", p: "KeyP", q: "KeyQ", r: "KeyR",
  s: "KeyS", t: "KeyT", u: "KeyU", v: "KeyV", w: "KeyW", x: "KeyX",
  y: "KeyY", z: "KeyZ",
  "1": "Digit1", "2": "Digit2", "3": "Digit3", "4": "Digit4", "5": "Digit5",
  "6": "Digit6", "7": "Digit7", "8": "Digit8", "9": "Digit9", "0": "Digit0",
  "-": "Minus", "=": "Equal", "[": "BracketLeft", "]": "BracketRight",
  "\\": "Backslash", ";": "Semicolon", "'": "Quote", ",": "Comma",
  ".": "Period", "/": "Slash", "`": "Backquote", " ": "Space",
};

// ─── Layout AZERTY French ─────────────────────────────────────────

const AZERTY_ROWS = [
  [
    { id: "Backquote", label: "²" },
    { id: "Digit1", label: "1" },
    { id: "Digit2", label: "2" },
    { id: "Digit3", label: "3" },
    { id: "Digit4", label: "4" },
    { id: "Digit5", label: "5" },
    { id: "Digit6", label: "6" },
    { id: "Digit7", label: "7" },
    { id: "Digit8", label: "8" },
    { id: "Digit9", label: "9" },
    { id: "Digit0", label: "0" },
    { id: "Minus", label: "°" },
    { id: "Equal", label: "+" },
  ],
  [
    { id: "KeyA", label: "A" },
    { id: "KeyZ", label: "Z" },
    { id: "KeyE", label: "E" },
    { id: "KeyR", label: "R" },
    { id: "KeyT", label: "T" },
    { id: "KeyY", label: "Y" },
    { id: "KeyU", label: "U" },
    { id: "KeyI", label: "I" },
    { id: "KeyO", label: "O" },
    { id: "KeyP", label: "P" },
    { id: "BracketLeft", label: "^" },
    { id: "BracketRight", label: "$" },
    { id: "Backslash", label: "*" },
  ],
  [
    { id: "KeyQ", label: "Q" },
    { id: "KeyS", label: "S" },
    { id: "KeyD", label: "D" },
    { id: "KeyF", label: "F", homing: true },
    { id: "KeyG", label: "G" },
    { id: "KeyH", label: "H" },
    { id: "KeyJ", label: "J", homing: true },
    { id: "KeyK", label: "K" },
    { id: "KeyL", label: "L" },
    { id: "Semicolon", label: "M" },
    { id: "Quote", label: "ù" },
  ],
  [
    { id: "KeyW", label: "W" },
    { id: "KeyX", label: "X" },
    { id: "KeyC", label: "C" },
    { id: "KeyV", label: "V" },
    { id: "KeyB", label: "B" },
    { id: "KeyN", label: "N" },
    { id: "KeyM", label: "," },
    { id: "Comma", label: ";" },
    { id: "Period", label: ":" },
    { id: "Slash", label: "!" },
  ],
  [{ id: "Space", label: "", width: 6 }],
];

const AZERTY_CHAR_TO_CODE = {
  a: "KeyQ", b: "KeyB", c: "KeyC", d: "KeyD", e: "KeyE", f: "KeyF",
  g: "KeyG", h: "KeyH", i: "KeyI", j: "KeyJ", k: "KeyK", l: "KeyL",
  m: "Semicolon", n: "KeyN", o: "KeyO", p: "KeyP", q: "KeyA", r: "KeyR",
  s: "KeyS", t: "KeyT", u: "KeyU", v: "KeyV", w: "KeyW", x: "KeyX",
  y: "KeyY", z: "KeyZ",
  "1": "Digit1", "2": "Digit2", "3": "Digit3", "4": "Digit4", "5": "Digit5",
  "6": "Digit6", "7": "Digit7", "8": "Digit8", "9": "Digit9", "0": "Digit0",
  "-": "Minus", "=": "Equal", "[": "BracketLeft", "]": "BracketRight",
  "\\": "Backslash", ";": "Comma", "'": "Quote", ",": "Period",
  ".": "Slash", "/": "Semicolon", "`": "Backquote", " ": "Space",
};

// ─── Finger mapping (shared between layouts) ──────────────────────

const CODE_TO_FINGER = {
  Backquote: 0, Digit1: 0, KeyQ: 0, KeyA: 0, KeyZ: 0,
  Digit2: 1, KeyW: 1, KeyS: 1, KeyX: 1,
  Digit3: 2, KeyE: 2, KeyD: 2, KeyC: 2,
  Digit4: 3, Digit5: 3, KeyR: 3, KeyT: 3, KeyF: 3, KeyG: 3, KeyV: 3, KeyB: 3,
  Digit6: 4, Digit7: 4, KeyY: 4, KeyU: 4, KeyH: 4, KeyJ: 4, KeyN: 4, KeyM: 4,
  Digit8: 5, KeyI: 5, KeyK: 5, Comma: 5,
  Digit9: 6, KeyO: 6, KeyL: 6, Period: 6,
  Digit0: 7, KeyP: 7, Semicolon: 7, Slash: 7,
  Minus: 7, Equal: 7, BracketLeft: 7, BracketRight: 7, Backslash: 7,
  Quote: 7,
  Space: 3,
};

// ─── Registre de layouts ──────────────────────────────────────────

const LAYOUTS = {
  qwerty: { rows: QWERTY_ROWS, charToCode: QWERTY_CHAR_TO_CODE },
  azerty: { rows: AZERTY_ROWS, charToCode: AZERTY_CHAR_TO_CODE },
};

// ─── API publiques ────────────────────────────────────────────────

/**
 * Retourne les données d'un layout.
 * @param {"qwerty"|"azerty"} name
 * @returns {{ rows: Array, charToCode: object }}
 */
export function getLayout(name) {
  return LAYOUTS[name] ?? LAYOUTS.qwerty;
}

/**
 * Liste des noms de layouts disponibles.
 * @returns {string[]}
 */
export function getLayoutNames() {
  return Object.keys(LAYOUTS);
}

/**
 * Mapping caractère → code de touche pour un layout donné.
 * @param {string} char
 * @param {"qwerty"|"azerty"} layoutName
 * @returns {string|null}
 */
export function codeForChar(char, layoutName = "qwerty") {
  const layout = getLayout(layoutName);
  return layout.charToCode[char.toLowerCase()] ?? null;
}

/**
 * Mapping touche → doigt (indépendant du layout, basé sur position physique).
 * @param {string} char
 * @param {"qwerty"|"azerty"} layoutName
 * @returns {number|null}
 */
export function fingerForChar(char, layoutName = "qwerty") {
  const code = codeForChar(char, layoutName);
  if (!code) return null;
  return CODE_TO_FINGER[code] ?? null;
}

/**
 * Noms des doigts (pour débogage ou affichage).
 */
export const FINGER_NAMES = [
  "Auriculaire G",
  "Annulaire G",
  "Majeur G",
  "Index G",
  "Index D",
  "Majeur D",
  "Annulaire D",
  "Auriculaire D",
];

/**
 * Aplati le layout en un Map<code, touche>.
 * @param {"qwerty"|"azerty"} layoutName
 * @returns {Map<string, object>}
 */
export function buildKeyMap(layoutName = "qwerty") {
  const { rows } = getLayout(layoutName);
  const map = new Map();
  for (const row of rows) {
    for (const key of row) {
      map.set(key.id, key);
    }
  }
  return map;
}

/**
 * Génère le HTML du clavier pour un layout donné.
 * @param {"qwerty"|"azerty"} layoutName
 * @returns {string}
 */
export function renderKeyboardHTML(layoutName = "qwerty") {
  const { rows, charToCode } = getLayout(layoutName);
  const codeToChar = {};
  for (const [char, code] of Object.entries(charToCode)) {
    if (!codeToChar[code]) codeToChar[code] = char;
  }

  const lines = [];
  for (const row of rows) {
    const keys = row.map((k) => {
      const w = k.width ? ` style="flex:${k.width}"` : "";
      const homing = k.homing ? " homing" : "";
      const char = codeToChar[k.id] ?? "";
      return `<kbd class="key${homing}" data-code="${k.id}" data-char="${char}"${w}>${k.label}</kbd>`;
    });
    lines.push(`<div class="keyboard-row">${keys.join("")}</div>`);
  }
  return lines.join("");
}

/**
 * Retourne la position du doigt pour une touche physique (code).
 * Utile pour le highlighting pendant la frappe.
 * @param {string} code - event.code (ex: "KeyA")
 * @returns {number|null}
 */
export function fingerForCode(code) {
  return CODE_TO_FINGER[code] ?? null;
}
