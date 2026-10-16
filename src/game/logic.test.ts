import { describe, it, expect } from "vitest";
import { emptyBoard, getWinner, isDraw, makeMove, type Board } from "./logic";

// Readable boards: X, O, and "." for empty. Whitespace is ignored.
const parse = (s: string): Board =>
  s
    .replace(/\s/g, "")
    .split("")
    .map((ch) => (ch === "X" || ch === "O" ? ch : null));

describe("getWinner", () => {
  it("returns null on an empty board", () => {
    expect(getWinner(emptyBoard())).toBeNull();
  });

  it("finds a row", () => {
    const board = parse(`
      XXX
      O.O
      ...
    `);
    expect(getWinner(board)).toEqual({ player: "X", line: [0, 1, 2] });
  });

  it("finds a diagonal", () => {
    const board = parse(`
      O.X
      .OX
      ..O
    `);
    expect(getWinner(board)).toEqual({ player: "O", line: [0, 4, 8] });
  });
});

describe("isDraw", () => {
  it("is true when the board is full with no line", () => {
    const board = parse(`
      XOX
      XOO
      OXX
    `);
    expect(isDraw(board)).toBe(true);
  });

  it("is false when the last move wins", () => {
    const board = parse(`
      XOX
      OXO
      OXX
    `);
    expect(isDraw(board)).toBe(false);
  });
});

describe("makeMove", () => {
  it("places a mark without changing the original board", () => {
    const before = emptyBoard();
    const after = makeMove(before, 4, "X");
    expect(after[4]).toBe("X");
    expect(before[4]).toBeNull();
  });

  it("ignores a move on an occupied cell", () => {
    const board = makeMove(emptyBoard(), 0, "X");
    expect(makeMove(board, 0, "O")).toBe(board);
  });

  it("ignores moves after someone has won", () => {
    const board = parse(`
      XXX
      OO.
      ...
    `);
    expect(makeMove(board, 5, "O")).toBe(board);
  });
});
