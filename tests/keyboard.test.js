import { describe, expect, it } from "vitest";
import {
  getLayout,
  getLayoutNames,
  codeForChar,
  fingerForChar,
  fingerForCode,
  buildKeyMap,
  renderKeyboardHTML,
  FINGER_NAMES,
} from "../src/lib/keyboard.js";

describe("getLayout", () => {
  it("returns qwerty layout by default", () => {
    const layout = getLayout();
    expect(layout.rows).toBeDefined();
    expect(layout.charToCode).toBeDefined();
    expect(layout.rows.length).toBe(5);
  });

  it("returns azerty layout", () => {
    const layout = getLayout("azerty");
    expect(layout.rows.length).toBe(5);
  });

  it("falls back to qwerty for unknown layout", () => {
    const layout = getLayout("dvorak");
    expect(layout).toBe(getLayout("qwerty"));
  });
});

describe("getLayoutNames", () => {
  it("returns qwerty and azerty", () => {
    const names = getLayoutNames();
    expect(names).toContain("qwerty");
    expect(names).toContain("azerty");
    expect(names.length).toBe(2);
  });
});

describe("codeForChar", () => {
  it("maps 'a' to KeyA on qwerty", () => {
    expect(codeForChar("a", "qwerty")).toBe("KeyA");
  });

  it("maps 'a' to KeyQ on azerty", () => {
    expect(codeForChar("a", "azerty")).toBe("KeyQ");
  });

  it("maps 'q' to KeyQ on qwerty", () => {
    expect(codeForChar("q", "qwerty")).toBe("KeyQ");
  });

  it("maps 'q' to KeyA on azerty", () => {
    expect(codeForChar("q", "azerty")).toBe("KeyA");
  });

  it("maps space to Space on both layouts", () => {
    expect(codeForChar(" ", "qwerty")).toBe("Space");
    expect(codeForChar(" ", "azerty")).toBe("Space");
  });

  it("is case insensitive", () => {
    expect(codeForChar("A", "qwerty")).toBe("KeyA");
    expect(codeForChar("A", "azerty")).toBe("KeyQ");
  });

  it("returns null for unknown characters", () => {
    expect(codeForChar("@", "qwerty")).toBeNull();
  });
});

describe("fingerForChar", () => {
  it("returns finger index for valid characters", () => {
    expect(fingerForChar("a", "qwerty")).toBe(0);
    expect(fingerForChar("s", "qwerty")).toBe(1);
    expect(fingerForChar("d", "qwerty")).toBe(2);
    expect(fingerForChar("f", "qwerty")).toBe(3);
  });

  it("returns correct finger on azerty", () => {
    expect(fingerForChar("a", "azerty")).toBe(0);
    expect(fingerForChar("q", "azerty")).toBe(0);
  });

  it("returns null for unknown characters", () => {
    expect(fingerForChar("@", "qwerty")).toBeNull();
  });
});

describe("fingerForCode", () => {
  it("returns finger for KeyA", () => {
    expect(fingerForCode("KeyA")).toBe(0);
  });

  it("returns finger for Space", () => {
    expect(fingerForCode("Space")).toBe(3);
  });

  it("returns null for unknown codes", () => {
    expect(fingerForCode("F13")).toBeNull();
  });
});

describe("buildKeyMap", () => {
  it("returns a Map with all keys for qwerty", () => {
    const map = buildKeyMap("qwerty");
    expect(map).toBeInstanceOf(Map);
    expect(map.has("KeyA")).toBe(true);
    expect(map.has("Space")).toBe(true);
  });

  it("returns a Map with all keys for azerty", () => {
    const map = buildKeyMap("azerty");
    expect(map).toBeInstanceOf(Map);
    expect(map.has("KeyA")).toBe(true);
    expect(map.has("Space")).toBe(true);
  });
});

describe("renderKeyboardHTML", () => {
  it("returns HTML string for qwerty", () => {
    const html = renderKeyboardHTML("qwerty");
    expect(html).toContain("keyboard-row");
    expect(html).toContain("data-code");
    expect(html).toContain("KeyA");
  });

  it("returns HTML string for azerty", () => {
    const html = renderKeyboardHTML("azerty");
    expect(html).toContain("keyboard-row");
    expect(html).toContain("KeyA");
    expect(html).toContain("²");
  });

  it("includes homing markers", () => {
    const html = renderKeyboardHTML("qwerty");
    expect(html).toContain('homing');
  });

  it("defaults to qwerty when no argument", () => {
    const html = renderKeyboardHTML();
    expect(html).toContain("KeyA");
    expect(html).toContain("data-char=\"a\"");
  });
});

describe("FINGER_NAMES", () => {
  it("has 8 finger names", () => {
    expect(FINGER_NAMES).toHaveLength(8);
  });
});

describe("QWERTY layout structure", () => {
  it("has 5 rows", () => {
    const layout = getLayout("qwerty");
    expect(layout.rows.length).toBe(5);
  });

  it("first row has 13 keys", () => {
    const layout = getLayout("qwerty");
    expect(layout.rows[0].length).toBe(13);
  });

  it("space bar has width 6", () => {
    const layout = getLayout("qwerty");
    const space = layout.rows[4][0];
    expect(space.width).toBe(6);
  });
});

describe("AZERTY layout structure", () => {
  it("has 5 rows", () => {
    const layout = getLayout("azerty");
    expect(layout.rows.length).toBe(5);
  });

  it("first row starts with ²", () => {
    const layout = getLayout("azerty");
    expect(layout.rows[0][0].label).toBe("²");
  });

  it("second row starts with A (physical KeyA)", () => {
    const layout = getLayout("azerty");
    expect(layout.rows[1][0].id).toBe("KeyA");
    expect(layout.rows[1][0].label).toBe("A");
  });

  it("third row starts with Q (physical KeyQ)", () => {
    const layout = getLayout("azerty");
    expect(layout.rows[2][0].id).toBe("KeyQ");
    expect(layout.rows[2][0].label).toBe("Q");
  });
});
