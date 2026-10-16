import { useReducer } from "react";
import { ChevronLeft } from "lucide-react";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { getWinner, isDraw, type Player } from "../game/logic";
import { createInitialState, gameReducer } from "../game/reducer";

function ScoreCard({
  player,
  score,
  active,
}: {
  player: Player;
  score: number;
  active: boolean;
}) {
  return (
    <div
      className={`flex-1 rounded-[20px] bg-tile px-4 py-3.5 ${
        active
          ? "border-[1.5px] border-ember shadow-[0_0_22px_rgba(238,122,58,0.25)]"
          : "border border-white/10"
      }`}
    >
      <div className="text-[13px] font-medium text-muted">Player {player}</div>
      <div
        className={`mt-1 font-display text-[44px] leading-none ${player === "O" ? "text-[#f59a45]" : ""}`}
      >
        {score}
      </div>
    </div>
  );
}

const gradientText =
  "bg-linear-to-b from-amber to-ember bg-clip-text text-transparent";

export function Game({ onExit }: { onExit: () => void }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState,
  );

  // Derived, not stored: always correct because it's computed from the board.
  const winner = getWinner(state.board);
  const draw = isDraw(state.board);
  const over = winner !== null || draw;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col gap-5 px-6 py-6">
      <header className="flex items-center justify-between">
        <button
          aria-label="Back to menu"
          onClick={onExit}
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-5 text-[15px] font-bold">
          Round {state.round}
        </div>
        <div className="size-11" />{" "}
        {/* balances the back button so the pill stays centered */}
      </header>

      <div className="flex gap-3">
        <ScoreCard
          player="X"
          score={state.scores.X}
          active={!over && state.current === "X"}
        />
        <ScoreCard
          player="O"
          score={state.scores.O}
          active={!over && state.current === "O"}
        />
      </div>

      <h2 className="text-center font-display text-[52px] uppercase leading-none">
        {winner ? (
          <>
            {winner.player} <span className={gradientText}>wins</span>
          </>
        ) : draw ? (
          <span className={gradientText}>Draw</span>
        ) : (
          <>
            {state.current} <span className={gradientText}>to move</span>
          </>
        )}
      </h2>

      <Board
        board={state.board}
        winLine={winner?.line}
        lastMove={state.moves.at(-1)}
        disabled={over}
        onPlay={(index) => dispatch({ type: "play", index })}
      />

      <div className="mt-auto flex gap-3 pt-2">
        {over ? (
          <Button
            onClick={() => dispatch({ type: "nextRound" })}
            className="w-full"
          >
            Next round
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              size="md"
              disabled={state.moves.length === 0}
              onClick={() => dispatch({ type: "undo" })}
              className="disabled:opacity-40"
            >
              Undo
            </Button>
            <Button
              size="md"
              onClick={() => dispatch({ type: "restartRound" })}
            >
              Restart round
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
