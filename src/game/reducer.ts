import type { Difficulty } from "./ai";
import {
  emptyBoard,
  getWinner,
  isDraw,
  makeMove,
  type Board,
  type Player,
} from "./logic";

export type Opponent = "human" | Difficulty;

export type GameState = {
  board: Board;
  current: Player;
  scores: Record<Player, number>;
  round: number;
  moves: number[];
  opponent: Opponent;
  computer: Player;
};

export type GameAction =
  | { type: "play"; index: number }
  | { type: "undo" }
  | { type: "restartRound" }
  | { type: "nextRound" }
  | { type: "newMatch"; opponent?: Opponent; computer?: Player };

const other = (p: Player): Player => (p === "X" ? "O" : "X");
const starterFor = (round: number): Player => (round % 2 === 1 ? "X" : "O");
const isOver = (board: Board) => getWinner(board) !== null || isDraw(board);

export const hasMatchInProgress = (s: GameState) =>
  s.moves.length > 0 || s.round > 1;

export const isComputerTurn = (s: GameState) =>
  s.opponent !== "human" && s.current === s.computer && !isOver(s.board);

export function createInitialState(
  opponent: Opponent = "human",
  computer: Player = "O",
): GameState {
  return {
    board: emptyBoard(),
    current: "X",
    scores: { X: 0, O: 0 },
    round: 1,
    moves: [],
    opponent,
    computer,
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
      if (isOver(state.board)) return state;

      const vsComputer = state.opponent !== "human";
      const count = vsComputer ? 2 : 1;
      if (state.moves.length < count) return state;
      if (vsComputer && state.current === state.computer) return state;
      const removed = state.moves.slice(-count);
      return {
        ...state,
        board: state.board.map((cell, i) =>
          removed.includes(i) ? null : cell,
        ),
        moves: state.moves.slice(0, -count),
        current: count === 1 ? other(state.current) : state.current,
      };
    }
    case "restartRound": {
      if (isOver(state.board)) return state;
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
      return createInitialState(
        action.opponent ?? state.opponent,
        action.computer ?? state.computer,
      );
  }
}
