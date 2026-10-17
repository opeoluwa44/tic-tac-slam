import { COMPUTER, type Opponent } from "./reducer";
import type { Player } from "./logic";

export const labelFor = (player: Player, opponent: Opponent) =>
  opponent === "human"
    ? `Player ${player}`
    : player === COMPUTER
      ? "Computer"
      : "You";
