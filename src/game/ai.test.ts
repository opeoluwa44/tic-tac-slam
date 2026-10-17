import { describe, it, expect } from "vitest";
import { pickMove } from "./ai";
import {
  emptyBoard,
  getAvailableMoves,
  getWinner,
  isDraw,
  makeMove,
  type Board,
  type Player,
} from "./logic";

const parse = (s: string): Board =>
  s
    .replace(/\s/g, "")
    .split("")
    .map((ch) => (ch === "X" || ch === "O" ? ch : null));
const opp = (p: Player): Player => (p === "X" ? "O" : "X");

describe("easy", () => {
  it("only ever picks an empty cell", () => {
    const board = parse(`
      XO.
      .X.
      O..
    `);
    const legal = getAvailableMoves(board);
    for (let n = 0; n < 50; n++) {
      expect(legal).toContain(pickMove(board, "O", "easy", () => n / 50));
    }
  });
});

describe("medium", () => {
  it("takes a win over blocking", () => {
    const board = parse(`
      XX.
      OO.
      X..
    `);
    expect(pickMove(board, "O", "medium", () => 0)).toBe(5); // wins, rather than blocking at 2
  });

  it("blocks when it cannot win", () => {
    const board = parse(`
      XX.
      .O.
      ...
    `);
    expect(pickMove(board, "O", "medium", () => 0)).toBe(2);
  });
});

describe("hard", () => {
  it("takes an available win", () => {
    const board = parse(`
      XX.
      OO.
      X..
    `);
    expect(pickMove(board, "O", "hard", () => 0)).toBe(5);
  });

  // The game is small enough to check EVERY line of play. `me` plays 'hard';
  // the opponent tries all possible moves. `me` must never lose.
  function neverLoses(board: Board, turn: Player, me: Player): boolean {
    const winner = getWinner(board);
    if (winner) return winner.player === me;
    if (isDraw(board)) return true;
    if (turn === me) {
      return neverLoses(
        makeMove(
          board,
          pickMove(board, me, "hard", () => 0),
          me,
        ),
        opp(turn),
        me,
      );
    }
    return getAvailableMoves(board).every((i) =>
      neverLoses(makeMove(board, i, turn), opp(turn), me),
    );
  }

  it("never loses playing second", () => {
    expect(neverLoses(emptyBoard(), "X", "O")).toBe(true);
  });

  it("never loses playing first", () => {
    expect(neverLoses(emptyBoard(), "X", "X")).toBe(true);
  });
});

// Can `player` force a win from here if both sides play their best?
function forcedWin(board: Board, turn: Player, player: Player): boolean {
  const winner = getWinner(board);
  if (winner) return winner.player === player;
  if (isDraw(board)) return false;
  const next = getAvailableMoves(board).map((i) => makeMove(board, i, turn));
  return turn === player
    ? next.some((b) => forcedWin(b, opp(turn), player))
    : next.every((b) => forcedWin(b, opp(turn), player));
}

describe("the fork test", () => {
  const board = parse(`
    X..
    .O.
    ..X
  `);

  it("medium walks into the fork", () => {
    const move = pickMove(board, "O", "medium", () => 0);
    expect([0, 2, 6, 8]).toContain(move); // it likes corners
    expect(forcedWin(makeMove(board, move, "O"), "X", "X")).toBe(true); // and that loses by force
  });

  it("hard defends with an edge", () => {
    const move = pickMove(board, "O", "hard", () => 0);
    expect([1, 3, 5, 7]).toContain(move);
    expect(forcedWin(makeMove(board, move, "O"), "X", "X")).toBe(false);
  });
});

describe("medium positional play", () => {
  it("prefers the center when nothing is urgent", () => {
    expect(pickMove(parse("X........"), "O", "medium", () => 0)).toBe(4);
  });

  it("prefers a corner when the center is taken", () => {
    const board = parse(`
      ...
      .X.
      ...
    `);
    expect([0, 2, 6, 8]).toContain(pickMove(board, "O", "medium", () => 0));
  });
});
