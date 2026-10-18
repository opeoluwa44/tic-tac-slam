import type { Player, Winner } from "./logic";
import type { Opponent } from "./reducer";

export const labelFor = (
  player: Player,
  opponent: Opponent,
  computer: Player,
) =>
  opponent === "human"
    ? `Player ${player}`
    : player === computer
      ? "Computer"
      : "You";

export const MODE_LABEL: Record<Opponent, string> = {
  human: "2 players",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export type Status = { lead?: string; accent: string };

type StatusInput = {
  winner: Winner | null;
  draw: boolean;
  thinking: boolean;
  current: Player;
  opponent: Opponent;
  computer: Player;
};

export function statusFor({
  winner,
  draw,
  thinking,
  current,
  opponent,
  computer,
}: StatusInput): Status {
  if (draw) return { accent: "Draw" };
  if (opponent === "human") {
    return winner
      ? { lead: winner.player, accent: "wins" }
      : { lead: current, accent: "to move" };
  }
  if (winner)
    return { lead: "You", accent: winner.player === computer ? "lose" : "win" };
  return thinking ? { accent: "Thinking" } : { lead: "Your", accent: "turn" };
}

export const statusText = (s: Status) =>
  [s.lead, s.accent].filter(Boolean).join(" ");
