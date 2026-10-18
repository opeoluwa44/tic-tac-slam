import type { Status } from "../game/labels";
import type { Board, Cell } from "../game/logic";
import type { Mark, Room } from "./rooms";

export const boardFromString = (s: string): Board =>
  [...s].map((ch): Cell => (ch === "X" || ch === "O" ? ch : null));

export function newestMark(prev: string, next: string): number | undefined {
  const i = [...next].findIndex((ch, idx) => ch !== "." && prev[idx] === ".");
  return i === -1 ? undefined : i;
}

export const winsNeeded = (bestOf: number) => Math.ceil(bestOf / 2);

export function matchWinner(
  room: Pick<Room, "best_of" | "scores_x" | "scores_o">,
): Mark | null {
  const need = winsNeeded(room.best_of);
  if (room.scores_x >= need) return "X";
  if (room.scores_o >= need) return "O";
  return null;
}

export function onlineStatus(
  room: Pick<Room, "result" | "turn">,
  me: Mark,
): Status {
  if (room.result === "draw") return { accent: "Draw" };
  if (room.result)
    return { lead: "You", accent: room.result === me ? "win" : "lose" };
  return { lead: room.turn === me ? "Your" : "Their", accent: "turn" };
}
