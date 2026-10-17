import {
  getAvailableMoves,
  getWinner,
  isDraw,
  makeMove,
  type Board,
  type Player,
} from "./logic";

export type Difficulty = "easy" | "medium" | "hard";
type Rng = () => number;

const opponentOf = (p: Player): Player => (p === "X" ? "O" : "X");
const pickRandom = <T>(items: T[], rng: Rng): T =>
  items[Math.floor(rng() * items.length)];

// A move that wins immediately for `player`, if there is one.
function findWinningMove(board: Board, player: Player): number | null {
  for (const i of getAvailableMoves(board)) {
    if (getWinner(makeMove(board, i, player))?.player === player) return i;
  }
  return null;
}

function minimax(
  board: Board,
  turn: Player,
  me: Player,
  depth: number,
): number {
  const winner = getWinner(board);
  if (winner) return winner.player === me ? 10 - depth : depth - 10;
  if (isDraw(board)) return 0;

  const scores = getAvailableMoves(board).map((i) =>
    minimax(makeMove(board, i, turn), opponentOf(turn), me, depth + 1),
  );
  return turn === me ? Math.max(...scores) : Math.min(...scores);
}

function bestMoves(board: Board, me: Player): number[] {
  const scored = getAvailableMoves(board).map((i) => ({
    i,
    score: minimax(makeMove(board, i, me), opponentOf(me), me, 1),
  }));
  const best = Math.max(...scored.map((s) => s.score));
  return scored.filter((s) => s.score === best).map((s) => s.i);
}

export function pickMove(
  board: Board,
  me: Player,
  difficulty: Difficulty,
  rng: Rng = Math.random,
): number {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) throw new Error("No moves available");

  if (difficulty === "easy") return pickRandom(moves, rng);

  if (difficulty === "medium") {
    return (
      findWinningMove(board, me) ??
      findWinningMove(board, opponentOf(me)) ??
      pickRandom(moves, rng)
    );
  }

  if (moves.length === 9) return pickRandom([0, 2, 4, 6, 8], rng);
  return pickRandom(bestMoves(board, me), rng);
}
