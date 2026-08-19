import { describe, expect, it } from "vitest";
import { computeStats, diffChars, isComplete } from "../src/lib/typing.js";

describe("diffChars", () => {
  it("marks untyped characters as pending", () => {
    const result = diffChars("hello", "");
    expect(result).toHaveLength(5);
    expect(result.every((entry) => entry.status === "pending")).toBe(true);
  });

  it("marks matching characters as correct", () => {
    const result = diffChars("hello", "hel");
    expect(result.slice(0, 3).map((e) => e.status)).toEqual(["correct", "correct", "correct"]);
    expect(result.slice(3).map((e) => e.status)).toEqual(["pending", "pending"]);
  });

  it("marks mismatched characters as incorrect", () => {
    const result = diffChars("hello", "hxllo");
    expect(result.map((e) => e.status)).toEqual([
      "correct",
      "incorrect",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("preserves the target character even when a mismatch occurs", () => {
    const result = diffChars("cat", "cxx");
    expect(result.map((e) => e.char)).toEqual(["c", "a", "t"]);
  });
});

describe("computeStats", () => {
  it("returns 0 wpm and 100% accuracy before anything is typed", () => {
    const stats = computeStats("hello world", "", 0);
    expect(stats.wpm).toBe(0);
    expect(stats.accuracy).toBe(100);
  });

  it("computes wpm using the standard (chars / 5) / minutes formula", () => {
    // 25 caractères corrects tapés en 30 secondes (0.5 min) -> (25/5)/0.5 = 10 wpm
    const target = "a".repeat(25);
    const typed = "a".repeat(25);
    const stats = computeStats(target, typed, 30);
    expect(stats.wpm).toBe(10);
  });

  it("computes accuracy as the percentage of correct characters typed", () => {
    const stats = computeStats("aaaa", "aabb", 10);
    expect(stats.accuracy).toBe(50);
    expect(stats.correctChars).toBe(2);
    expect(stats.incorrectChars).toBe(2);
  });

  it("ignores characters typed beyond the target length", () => {
    const stats = computeStats("ab", "abcdef", 10);
    expect(stats.typedLength).toBe(2);
    expect(stats.correctChars).toBe(2);
  });

  it("rejects a negative elapsed time", () => {
    expect(() => computeStats("hello", "he", -1)).toThrow();
  });
});

describe("isComplete", () => {
  it("is false while the typed text is shorter than the target", () => {
    expect(isComplete("hello", "hel")).toBe(false);
  });

  it("is true once the typed text covers the target length", () => {
    expect(isComplete("hello", "hello")).toBe(true);
  });

  it("is true even if the typed text overshoots the target length", () => {
    expect(isComplete("hi", "hi there")).toBe(true);
  });
});
