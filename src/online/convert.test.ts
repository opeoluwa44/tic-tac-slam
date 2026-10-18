import { describe, it, expect } from "vitest";
import { statusText } from "../game/labels";
import { getWinner, isDraw } from "../game/logic";
import {
  boardFromString,
  matchWinner,
  newestMark,
  onlineStatus,
} from "./convert";

describe("boardFromString", () => {
  it("turns the database string into a board", () => {
    expect(boardFromString("XO.......")).toEqual([
      "X",
      "O",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
  });
});

describe("newestMark", () => {
  it("finds the cell that was just filled", () => {
    expect(newestMark("X........", "XO.......")).toBe(1);
  });
  it("returns undefined when nothing was added", () => {
    expect(newestMark("XO.......", "XO.......")).toBeUndefined();
  });
  it("returns undefined when the board was reset for a new round", () => {
    expect(newestMark("XOXOXOXOX", ".........")).toBeUndefined();
  });
});

describe("matchWinner", () => {
  it.each([
    [5, 3, 1, "X"],
    [5, 1, 3, "O"],
    [5, 2, 2, null],
    [3, 2, 0, "X"],
    [3, 1, 1, null],
    [7, 4, 3, "X"],
    [7, 3, 3, null],
  ])(
    "best of %i, score %i-%i → %s",
    (best_of, scores_x, scores_o, expected) => {
      expect(matchWinner({ best_of, scores_x, scores_o })).toBe(expected);
    },
  );
});

describe("onlineStatus", () => {
  it("speaks to the player", () => {
    expect(statusText(onlineStatus({ result: null, turn: "X" }, "X"))).toBe(
      "Your turn",
    );
    expect(statusText(onlineStatus({ result: null, turn: "O" }, "X"))).toBe(
      "Their turn",
    );
    expect(statusText(onlineStatus({ result: "X", turn: "O" }, "X"))).toBe(
      "You win",
    );
    expect(statusText(onlineStatus({ result: "X", turn: "O" }, "O"))).toBe(
      "You lose",
    );
    expect(statusText(onlineStatus({ result: "draw", turn: "O" }, "O"))).toBe(
      "Draw",
    );
  });

  it("never produces a headline too long for its fixed-height slot", () => {
    for (const result of [null, "X", "O", "draw"] as const)
      for (const turn of ["X", "O"] as const)
        for (const me of ["X", "O"] as const)
          expect(
            statusText(onlineStatus({ result, turn }, me)).length,
          ).toBeLessThanOrEqual(12);
  });
});

describe("rules agree with the database", () => {
  it("classifies every possible board", () => {
    const counts = { X: 0, O: 0, draw: 0, "in progress": 0 };
    for (let n = 0; n < 3 ** 9; n++) {
      let m = n;
      let s = "";
      for (let i = 0; i < 9; i++) {
        s += ".XO"[m % 3];
        m = Math.floor(m / 3);
      }
      const board = boardFromString(s);
      const winner = getWinner(board);
      if (winner) counts[winner.player]++;
      else if (isDraw(board)) counts.draw++;
      else counts["in progress"]++;
    }
    expect(counts).toEqual({
      X: 4279,
      O: 4279,
      draw: 32,
      "in progress": 11093,
    });
  });
});
