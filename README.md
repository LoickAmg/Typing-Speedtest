# Typing Speedtest

Test de vitesse de frappe minimaliste dans le navigateur : mots aléatoires,
mesure du WPM (mots par minute) et de la précision en temps réel — Astro +
JavaScript vanilla, sans framework front (React/Vue...).

## Fonctionnalités

- Génération d'un texte aléatoire (10 / 25 / 50 mots) à partir d'une banque
  de mots anglais courants
- Comparaison caractère par caractère pendant la frappe : correct / incorrect
  / pas encore atteint, avec surlignage live
- Calcul en direct du **WPM** (formule standard : caractères corrects / 5,
  divisé par les minutes écoulées) et de la **précision** (% de caractères
  corrects parmi ceux tapés)
- Chronomètre démarré au premier caractère tapé (pas avant, pour ne pas
  fausser la mesure)
- Le test se termine automatiquement une fois le texte entièrement couvert ;
  Échap permet de recommencer à tout moment
- Toute la logique de comparaison/calcul (`src/lib/`) est **pure JS**, sans
  DOM ni horloge globale (le temps écoulé est toujours passé en paramètre) :
  testable unitairement sans navigateur

## Structure du projet

```
typing-speedtest/
├── src/
│   ├── lib/
│   │   ├── words.js          # banque de mots + tirage aléatoire (rng injectable)
│   │   └── typing.js         # diff caractère par caractère, calcul WPM/précision
│   └── pages/
│       └── index.astro       # page + UI + script de câblage DOM
├── tests/
│   ├── words.test.js
│   └── typing.test.js
├── .github/workflows/ci.yml  # lint (eslint) + tests (vitest) + build sur push/PR
├── package.json
├── astro.config.mjs
├── eslint.config.js
└── vitest.config.js
```

## Installation

```bash
npm install
```

## Utilisation

```bash
# Serveur de dev (http://localhost:4321)
npm run dev

# Build de production dans dist/
npm run build

# Prévisualiser le build de production
npm run preview
```

## Lancer les tests

```bash
npm test
```

Les tests (`tests/`) ne portent que sur `src/lib/` : logique pure, aucune
dépendance au DOM. `words.js` utilise un générateur pseudo-aléatoire
(`mulberry32`) injectable, ce qui permet des tests déterministes sur le
tirage des mots sans mocker `Math.random`.

## Lint

```bash
npm run lint
```

ESLint (config plate `eslint.config.js`) avec `eslint-plugin-astro` pour les
fichiers `.astro`.

## Notes d'implémentation

- Le WPM utilise la formule standard des tests de frappe :
  `(caractères corrects / 5) / minutes écoulées`, arrondie à l'entier. Le
  chronomètre ne démarre qu'à la première frappe, jamais à l'affichage de la
  page.
- Les caractères tapés au-delà de la longueur du texte cible sont ignorés
  dans le calcul (le champ de saisie a un `maxlength` dynamique égal à la
  longueur du texte à taper).
- La saisie passe par un `<input>` invisible (hors écran) qui reste focus :
  approche classique des sites de test de frappe (monkeytype, 10fastfingers),
  qui gère nativement le clavier, la casse, les touches mortes, etc. sans
  réinventer la capture clavier bas niveau.

## Prochaines étapes possibles

- Historique des scores (stocké en mémoire, pas de `localStorage` sur une
  page publiée en artifact — voir la note sur le stockage navigateur)
- Mode "temps limité" (ex. 30/60 secondes, texte généré à la volée)
- Conteneuriser avec Docker (voir le projet transversal #25 de la roadmap)
