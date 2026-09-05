/**
 * Logique pure du test de vitesse de frappe : comparaison caractère par
 * caractère et calcul des statistiques (WPM, précision). Aucune dépendance
 * au DOM ni à `Date.now`/`performance.now` directement : le temps écoulé est
 * toujours passé en paramètre, ce qui rend ces fonctions testables sans
 * navigateur.
 */

/**
 * Compare le texte tapé au texte cible, caractère par caractère.
 *
 * Renvoie un tableau de `{ char, status }` où `status` vaut :
 * - "correct"   : caractère tapé identique au caractère cible
 * - "incorrect" : caractère tapé différent du caractère cible
 * - "pending"   : caractère pas encore atteint
 */
export function diffChars(target, typed) {
  const chars = [];
  for (let i = 0; i < target.length; i++) {
    if (i >= typed.length) {
      chars.push({ char: target[i], status: "pending" });
    } else if (typed[i] === target[i]) {
      chars.push({ char: target[i], status: "correct" });
    } else {
      chars.push({ char: target[i], status: "incorrect" });
    }
  }
  return chars;
}

/**
 * Calcule les statistiques du test à un instant donné.
 *
 * - `wpm` : mots par minute, formule standard (caractères corrects / 5) /
 *   minutes écoulées, arrondi à l'entier. 0 tant qu'aucun temps ne s'est
 *   écoulé (évite une division par zéro).
 * - `accuracy` : pourcentage de caractères corrects parmi ceux tapés
 *   (bornés à la longueur du texte cible). 100 tant que rien n'a été tapé.
 *
 * Les caractères tapés au-delà de la longueur du texte cible ne comptent
 * pas (le test s'arrête dès que le texte cible est entièrement couvert).
 */
export function computeStats(target, typed, elapsedSeconds) {
  if (elapsedSeconds < 0) {
    throw new Error("elapsedSeconds doit être >= 0");
  }

  const typedLength = Math.min(typed.length, target.length);
  let correctChars = 0;
  for (let i = 0; i < typedLength; i++) {
    if (typed[i] === target[i]) {
      correctChars += 1;
    }
  }
  const incorrectChars = typedLength - correctChars;

  const elapsedMinutes = elapsedSeconds / 60;
  const wpm = elapsedMinutes > 0 ? Math.round(correctChars / 5 / elapsedMinutes) : 0;
  const accuracy = typedLength > 0 ? Math.round((correctChars / typedLength) * 100) : 100;

  return {
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    typedLength,
    targetLength: target.length,
  };
}

/** Le test est terminé dès que le texte tapé couvre tout le texte cible. */
export function isComplete(target, typed) {
  return typed.length >= target.length;
}
