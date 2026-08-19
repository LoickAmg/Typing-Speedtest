import { describe, expect, it } from "vitest";
import { WORD_BANK, buildTargetText, mulberry32, pickWords } from "../src/lib/words.js";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const sequenceA = [a(), a(), a()];
    const sequenceB = [b(), b(), b()];
    expect(sequenceA).toEqual(sequenceB);
  });

  it("produces values in [0, 1)", () => {
    const rng = mulberry32(1);
    for (let i = 0; i < 50; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("produces different sequences for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });
});

describe("pickWords", () => {
  it("returns the requested number of words", () => {
    const words = pickWords(10, mulberry32(0));
    expect(words).toHaveLength(10);
  });

  it("only picks words from the given bank", () => {
    const bank = ["alpha", "beta", "gamma"];
    const words = pickWords(20, mulberry32(7), bank);
    expect(words.every((word) => bank.includes(word))).toBe(true);
  });

  it("is deterministic for a given rng", () => {
    const first = pickWords(15, mulberry32(123));
    const second = pickWords(15, mulberry32(123));
    expect(first).toEqual(second);
  });

  it("rejects a count below 1", () => {
    expect(() => pickWords(0)).toThrow();
  });

  it("rejects an empty bank", () => {
    expect(() => pickWords(5, mulberry32(1), [])).toThrow();
  });
});

describe("buildTargetText", () => {
  it("joins the picked words with single spaces", () => {
    const text = buildTargetText(5, mulberry32(3));
    const words = text.split(" ");
    expect(words).toHaveLength(5);
    expect(words.every((word) => WORD_BANK.includes(word))).toBe(true);
  });
});
