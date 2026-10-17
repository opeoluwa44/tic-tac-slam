import { createContext, useContext, type Dispatch } from "react";
import type { GameAction, GameState } from "./reducer";

type GameContextValue = { state: GameState; dispatch: Dispatch<GameAction> };

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
