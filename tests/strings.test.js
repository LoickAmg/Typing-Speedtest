import { describe, expect, it } from "vitest";
import { createRNG, generateText, getModes } from "../src/lib/strings.js";
import { getLanguage, LANGUAGES, generateIncoherentWord } from "../src/lib/languages.js";

describe("createRNG", () => {
  it("is deterministic for a given seed", () => {
    const a = createRNG(42);
    const b = createRNG(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces values in [0, 1)", () => {
    const rng = createRNG(1);
    for (let i = 0; i < 50; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("produces different sequences for different seeds", () => {
    const a = createRNG(1);
    const b = createRNG(2);
    expect(a()).not.toBe(b());
  });
});

describe("generateText", () => {
  it("returns requested number of words in coherent mode", () => {
    const result = generateText({ count: 10, langCode: "en", mode: "coherent", seed: 42 });
    expect(result.words).toHaveLength(10);
    expect(result.text.split(" ")).toHaveLength(10);
  });

  it("returns requested number of words in incoherent mode", () => {
    const result = generateText({ count: 8, langCode: "en", mode: "incoherent", seed: 42 });
    expect(result.words).toHaveLength(8);
  });

  it("is deterministic for a given seed", () => {
    const a = generateText({ count: 15, langCode: "en", seed: 99 });
    const b = generateText({ count: 15, langCode: "en", seed: 99 });
    expect(a.text).toBe(b.text);
  });

  it("produces different text for different seeds", () => {
    const a = generateText({ count: 10, seed: 1 });
    const b = generateText({ count: 10, seed: 2 });
    expect(a.text).not.toBe(b.text);
  });

  it("uses the correct language bank", () => {
    const result = generateText({ count: 20, langCode: "fr", seed: 42 });
    const lang = getLanguage("fr");
    result.words.forEach((w) => {
      expect(lang.words).toContain(w);
    });
  });

  it("generates incoherent words with valid characters", () => {
    const result = generateText({ count: 20, langCode: "en", mode: "incoherent", seed: 42 });
    result.words.forEach((w) => {
      expect(w.length).toBeGreaterThanOrEqual(3);
      expect(w.length).toBeLessThanOrEqual(8);
      expect(/^[a-z]+$/.test(w)).toBe(true);
    });
  });

  it("generates incoherent words using language alphabet", () => {
    const result = generateText({ count: 20, langCode: "fr", mode: "incoherent", seed: 42 });
    const lang = getLanguage("fr");
    result.words.forEach((w) => {
      for (const ch of w) {
        expect(lang.alphabet).toContain(ch);
      }
    });
  });

  it("defaults to English with 25 words", () => {
    const result = generateText({ seed: 42 });
    expect(result.words).toHaveLength(25);
    const lang = getLanguage("en");
    result.words.forEach((w) => {
      expect(lang.words).toContain(w);
    });
  });
});

describe("getModes", () => {
  it("returns two modes", () => {
    const modes = getModes();
    expect(modes).toHaveLength(2);
    expect(modes.map((m) => m.id)).toContain("coherent");
    expect(modes.map((m) => m.id)).toContain("incoherent");
  });
});

describe("languages", () => {
  it("has 24 languages", () => {
    expect(LANGUAGES.length).toBe(24);
  });

  it("each language has required fields", () => {
    LANGUAGES.forEach((lang) => {
      expect(typeof lang.code).toBe("string");
      expect(typeof lang.name).toBe("string");
      expect(typeof lang.flag).toBe("string");
      expect(Array.isArray(lang.words)).toBe(true);
      expect(lang.words.length).toBeGreaterThanOrEqual(70);
      expect(typeof lang.alphabet).toBe("string");
      expect(lang.alphabet.length).toBeGreaterThan(10);
    });
  });

  it("getLanguage returns undefined for unknown code", () => {
    expect(getLanguage("zzz")).toBeUndefined();
  });

  it("generateIncoherentWord produces valid strings", () => {
    const rng = createRNG(42);
    for (let i = 0; i < 20; i++) {
      const w = generateIncoherentWord("en", rng);
      expect(w.length).toBeGreaterThanOrEqual(3);
      expect(w.length).toBeLessThanOrEqual(8);
    }
  });
});
