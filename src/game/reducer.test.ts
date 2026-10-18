import { describe, it, expect } from "vitest";
import { createInitialState, gameReducer, hasMatchInProgress } from "./reducer";
import { isComputerTurn } from "./reducer";

const play = (...cells: number[]) =>
  cells.reduce(
    (s, index) => gameReducer(s, { type: "play", index }),
    createInitialState(),
  );

describe("gameReducer", () => {
  it("alternates players", () => {
    const s = play(0, 1);
    expect(s.board[0]).toBe("X");
    expect(s.board[1]).toBe("O");
    expect(s.current).toBe("X");
  });

  it("ignores a move on an occupied cell", () => {
    const s = play(0);
    expect(gameReducer(s, { type: "play", index: 0 })).toBe(s);
  });

  it("scores a win once and ignores later moves", () => {
    const won = play(0, 3, 1, 4, 2); // X takes the top row
    expect(won.scores).toEqual({ X: 1, O: 0 });
    expect(gameReducer(won, { type: "play", index: 8 })).toBe(won);
  });

  it("undoes the last move and hands the turn back", () => {
    const s = gameReducer(play(0, 1), { type: "undo" });
    expect(s.board[1]).toBeNull();
    expect(s.current).toBe("O");
  });

  it("does not undo after the round is over", () => {
    const won = play(0, 3, 1, 4, 2);
    expect(gameReducer(won, { type: "undo" })).toBe(won);
  });

  it("nextRound clears the board, keeps scores and swaps the starter", () => {
    const next = gameReducer(play(0, 3, 1, 4, 2), { type: "nextRound" });
    expect(next.round).toBe(2);
    expect(next.current).toBe("O");
    expect(next.board.every((c) => c === null)).toBe(true);
    expect(next.scores.X).toBe(1);
  });

  it("nextRound does nothing mid-round", () => {
    const s = play(0);
    expect(gameReducer(s, { type: "nextRound" })).toBe(s);
  });
  it("newMatch resets everything", () => {
    const won = play(0, 3, 1, 4, 2);
    expect(gameReducer(won, { type: "newMatch" })).toEqual(
      createInitialState(),
    );
  });
  it("hasMatchInProgress is false for a fresh match and true after a move", () => {
    expect(hasMatchInProgress(createInitialState())).toBe(false);
    expect(hasMatchInProgress(play(4))).toBe(true);
  });
});

const vsComputer = (...cells: number[]) =>
  cells.reduce(
    (s, index) => gameReducer(s, { type: "play", index }),
    createInitialState("hard"),
  );

it("undo against the computer takes back both moves", () => {
  const undone = gameReducer(vsComputer(0, 4), { type: "undo" });
  expect(undone.board.every((c) => c === null)).toBe(true);
  expect(undone.current).toBe("X");
});

it("isComputerTurn is true only for a live round on the computer's turn", () => {
  expect(isComputerTurn(createInitialState("hard"))).toBe(false);
  expect(isComputerTurn(vsComputer(0))).toBe(true);
  expect(
    isComputerTurn(
      gameReducer(createInitialState(), { type: "play", index: 0 }),
    ),
  ).toBe(false);
});

it("the computer opens when it plays X", () => {
  expect(isComputerTurn(createInitialState("hard", "X"))).toBe(true);
});

it("undo keeps the computer's opening move when it plays X", () => {
  let s = createInitialState("hard", "X");
  for (const index of [4, 0, 8]) s = gameReducer(s, { type: "play", index });
  const undone = gameReducer(s, { type: "undo" });
  expect(undone.board[4]).toBe("X");
  expect(undone.board[0]).toBeNull();
  expect(undone.board[8]).toBeNull();
  expect(undone.current).toBe("O");
});

it("undo is blocked when only the computer's opening move exists", () => {
  let s = createInitialState("hard", "X");
  s = gameReducer(s, { type: "play", index: 4 });
  expect(gameReducer(s, { type: "undo" })).toBe(s);
});
