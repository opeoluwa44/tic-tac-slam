export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export type Winner = {
  player: Player;
  line: readonly [number, number, number];
};

export const emptyBoard = (): Board => Array<Cell>(9).fill(null);

export function getWinner(board: Board): Winner | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { player: mark, line };
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return getWinner(board) === null && board.every((cell) => cell !== null);
}

export function makeMove(board: Board, index: number, player: Player): Board {
  if (board[index] !== null || getWinner(board)) return board;
  return board.map((cell, i) => (i === index ? player : cell));
}

export const getAvailableMoves = (board: Board): number[] =>
  board.flatMap((cell, i) => (cell === null ? [i] : []));
