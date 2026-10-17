import type { Cell } from "./logic";
import type { GameState, Opponent } from "./reducer";

const KEY = "tic-tac-vinyl:match:v1";

const isPlayer = (v: unknown): v is "X" | "O" => v === "X" || v === "O";
const isCount = (v: unknown): v is number =>
  Number.isInteger(v) && (v as number) >= 0;
const isOpponent = (v: unknown): v is Opponent =>
  v === "human" || v === "easy" || v === "medium" || v === "hard";

export function parseState(raw: string | null): GameState | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    const {
      board,
      current,
      scores,
      round,
      moves,
      opponent = "human",
    } = data as Record<string, unknown>;

    if (!isOpponent(opponent)) return null;

    if (!Array.isArray(board) || board.length !== 9) return null;
    if (!board.every((c) => c === null || isPlayer(c))) return null;
    if (!isPlayer(current)) return null;
    if (typeof scores !== "object" || scores === null) return null;
    const { X, O } = scores as Record<string, unknown>;
    if (!isCount(X) || !isCount(O)) return null;
    if (!isCount(round) || round < 1) return null;
    if (!Array.isArray(moves)) return null;
    if (!moves.every((m) => Number.isInteger(m) && m >= 0 && m < 9))
      return null;
    if (moves.length !== board.filter((c) => c !== null).length) return null;

    return {
      board: board as Cell[],
      current,
      scores: { X, O },
      round,
      moves: moves as number[],
      opponent,
    };
  } catch {
    return null;
  }
}

export function loadState(): GameState | null {
  try {
    return parseState(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function saveState(state: GameState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // quota or private mode
  }
}
