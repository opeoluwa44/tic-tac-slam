export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[]; // always length 9, index 0 = top-left, 8 = bottom-right

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
] as const;

export type Winner = {
  player: Player;
  line: readonly [number, number, number]; // the UI will use this to highlight the win
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

// Returns a NEW board. Invalid moves return the board unchanged.
export function makeMove(board: Board, index: number, player: Player): Board {
  if (board[index] !== null || getWinner(board)) return board;
  return board.map((cell, i) => (i === index ? player : cell));
}
