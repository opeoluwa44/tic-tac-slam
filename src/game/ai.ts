import {
  getAvailableMoves,
  getWinner,
  isDraw,
  makeMove,
  type Board,
  type Player,
} from "./logic";

export const stats = { nodes: 0 };

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
  alpha = -Infinity, // best score `me` is already guaranteed elsewhere
  beta = Infinity, // best score the opponent is already guaranteed elsewhere
): number {
  const winner = getWinner(board);
  if (winner) return winner.player === me ? 10 - depth : depth - 10;
  if (isDraw(board)) return 0;

  if (turn === me) {
    let best = -Infinity;
    for (const i of getAvailableMoves(board)) {
      best = Math.max(
        best,
        minimax(
          makeMove(board, i, turn),
          opponentOf(turn),
          me,
          depth + 1,
          alpha,
          beta,
        ),
      );
      alpha = Math.max(alpha, best);
      if (alpha >= beta) break; // the opponent would never let us reach this branch
    }
    return best;
  }

  let best = Infinity;
  for (const i of getAvailableMoves(board)) {
    best = Math.min(
      best,
      minimax(
        makeMove(board, i, turn),
        opponentOf(turn),
        me,
        depth + 1,
        alpha,
        beta,
      ),
    );
    beta = Math.min(beta, best);
    if (alpha >= beta) break; // we would never choose a path that lets them do this
  }
  return best;
}

function bestMoves(board: Board, me: Player): number[] {
  const scored = getAvailableMoves(board).map((i) => ({
    i,
    score: minimax(makeMove(board, i, me), opponentOf(me), me, 1),
  }));
  const best = Math.max(...scored.map((s) => s.score));
  return scored.filter((s) => s.score === best).map((s) => s.i);
}

const PREFERENCE = [[4], [0, 2, 6, 8], [1, 3, 5, 7]]; // center, corners, edges

function pickPositional(moves: number[], rng: Rng): number {
  for (const group of PREFERENCE) {
    const open = group.filter((i) => moves.includes(i));
    if (open.length > 0) return pickRandom(open, rng);
  }
  return pickRandom(moves, rng); // unreachable, but keeps TypeScript satisfied
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
      pickPositional(moves, rng) // was pickRandom
    );
  }

  if (moves.length === 9) return pickRandom([0, 2, 4, 6, 8], rng);
  return pickRandom(bestMoves(board, me), rng);
}
