import { useReducer, type ReactNode } from "react";
import { createInitialState, gameReducer } from "./reducer";
import { GameContext } from "./context";

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState,
  );
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
