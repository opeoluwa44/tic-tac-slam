import { describe, it, expect } from "vitest";
import { statusFor, statusText } from "./labels";
import type { Player, Winner } from "./logic";
import type { Opponent } from "./reducer";

const MAX_CHARS = 12; // the headline slot is one fixed-height line

describe("statusFor", () => {
  it("never produces a headline too long for its slot", () => {
    const opponents: Opponent[] = ["human", "easy", "medium", "hard"];
    const players: Player[] = ["X", "O"];
    const winners: (Winner | null)[] = [
      null,
      { player: "X", line: [0, 1, 2] },
      { player: "O", line: [0, 1, 2] },
    ];
    for (const opponent of opponents)
      for (const computer of players)
        for (const current of players)
          for (const winner of winners)
            for (const draw of [false, true])
              for (const thinking of [false, true]) {
                const text = statusText(
                  statusFor({
                    winner,
                    draw,
                    thinking,
                    current,
                    opponent,
                    computer,
                  }),
                );
                expect(text.length, text).toBeLessThanOrEqual(MAX_CHARS);
              }
  });

  it("speaks to the player when playing the computer", () => {
    const base = {
      draw: false,
      thinking: false,
      current: "X" as Player,
      opponent: "hard" as Opponent,
      computer: "O" as Player,
    };
    expect(statusText(statusFor({ ...base, winner: null }))).toBe("Your move");
    expect(
      statusText(statusFor({ ...base, winner: null, thinking: true })),
    ).toBe("Thinking");
    expect(
      statusText(
        statusFor({ ...base, winner: { player: "O", line: [0, 1, 2] } }),
      ),
    ).toBe("You lose");
  });
});
