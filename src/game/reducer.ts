import {
  emptyBoard,
  getWinner,
  isDraw,
  makeMove,
  type Board,
  type Player,
} from "./logic";

export type GameState = {
  board: Board;
  current: Player;
  scores: Record<Player, number>;
  round: number;
  moves: number[];
};

export type GameAction =
  | { type: "play"; index: number }
  | { type: "undo" }
  | { type: "restartRound" }
  | { type: "nextRound" }
  | { type: "newMatch" };

const other = (p: Player): Player => (p === "X" ? "O" : "X");
const starterFor = (round: number): Player => (round % 2 === 1 ? "X" : "O");
const isOver = (board: Board) => getWinner(board) !== null || isDraw(board);

export function createInitialState(): GameState {
  return {
    board: emptyBoard(),
    current: "X",
    scores: { X: 0, O: 0 },
    round: 1,
    moves: [],
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "play": {
      const board = makeMove(state.board, action.index, state.current);
      if (board === state.board) return state;
      const winner = getWinner(board);
      return {
        ...state,
        board,
        moves: [...state.moves, action.index],
        current: other(state.current),
        scores: winner
          ? {
              ...state.scores,
              [winner.player]: state.scores[winner.player] + 1,
            }
          : state.scores,
      };
    }
    case "undo": {
      const last = state.moves.at(-1);
      if (last === undefined || isOver(state.board)) return state;
      return {
        ...state,
        board: state.board.map((cell, i) => (i === last ? null : cell)),
        moves: state.moves.slice(0, -1),
        current: other(state.current),
      };
    }
    case "restartRound": {
      if (isOver(state.board)) return state; // a finished round has already been scored
      return {
        ...state,
        board: emptyBoard(),
        moves: [],
        current: starterFor(state.round),
      };
    }
    case "nextRound": {
      if (!isOver(state.board)) return state;
      const round = state.round + 1;
      return {
        ...state,
        board: emptyBoard(),
        moves: [],
        round,
        current: starterFor(round),
      };
    }
    case "newMatch":
      return createInitialState();
  }
}

export const hasMatchInProgress = (s: GameState) =>
  s.moves.length > 0 || s.round > 1;
