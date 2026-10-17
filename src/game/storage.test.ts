import { describe, it, expect } from "vitest";
import { createInitialState, gameReducer, type GameState } from "./reducer";
import { parseState } from "./storage";

const midGame = (): GameState =>
  [0, 4, 8].reduce(
    (s, index) => gameReducer(s, { type: "play", index }),
    createInitialState(),
  );

const parseObj = (obj: unknown) => parseState(JSON.stringify(obj));

describe("parseState", () => {
  it("round-trips a valid state", () => {
    const s = midGame();
    expect(parseObj(s)).toEqual(s);
  });

  it.each([
    ["null", null],
    ["empty string", ""],
    ["not JSON", "{oops"],
    ["a JSON array", "[]"],
  ])("rejects %s", (_name, raw) => {
    expect(parseState(raw)).toBeNull();
  });

  it.each([
    ["short board", { ...midGame(), board: ["X", "O"] }],
    ["bad cell value", { ...midGame(), board: Array(9).fill("Z") }],
    ["bad player", { ...midGame(), current: "Q" }],
    ["negative score", { ...midGame(), scores: { X: -1, O: 0 } }],
    ["round zero", { ...midGame(), round: 0 }],
    ["move out of range", { ...midGame(), moves: [0, 4, 9] }],
    ["moves not matching board", { ...midGame(), moves: [0] }],
  ])("rejects a tampered state: %s", (_name, bad) => {
    expect(parseObj(bad)).toBeNull();
  });

  it("treats a save from before opponents existed as a human match", () => {
    const legacy = { ...midGame() } as Record<string, unknown>;
    delete legacy.opponent;
    expect(parseObj(legacy)?.opponent).toBe("human");
  });

  it("round-trips a computer opponent", () => {
    const s = { ...midGame(), opponent: "hard" as const };
    expect(parseObj(s)).toEqual(s);
  });

  it("rejects an unknown opponent", () => {
    expect(parseObj({ ...midGame(), opponent: "godlike" })).toBeNull();
  });
});
