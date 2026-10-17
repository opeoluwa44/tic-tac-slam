import { useEffect, useReducer, type ReactNode } from "react";
import { GameContext } from "./context";
import { createInitialState, gameReducer } from "./reducer";
import { loadState, saveState } from "./storage";

const init = () => loadState() ?? createInitialState();

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, init);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
