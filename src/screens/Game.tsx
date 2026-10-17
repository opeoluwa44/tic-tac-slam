import { ChevronLeft } from "lucide-react";
import { Link, Navigate } from "react-router";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { ScoreCard } from "../components/ScoreCard";
import { getWinner, isDraw } from "../game/logic";
import { useGame } from "../game/context";
import { gradientText } from "../ui";

export function Game() {
  const { state, dispatch } = useGame();
  const winner = getWinner(state.board);
  const draw = isDraw(state.board);

  if (winner || draw) return <Navigate to="/result" replace />;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col gap-5 px-6 py-6">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          aria-label="Back to menu"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-5 text-[15px] font-bold">
          Round {state.round}
        </div>
        <div className="size-11" />
      </header>

      <div className="flex gap-3">
        <ScoreCard
          player="X"
          score={state.scores.X}
          active={state.current === "X"}
        />
        <ScoreCard
          player="O"
          score={state.scores.O}
          active={state.current === "O"}
        />
      </div>

      <h2 className="text-center font-display text-[52px] uppercase leading-none">
        {state.current} <span className={gradientText}>to move</span>
      </h2>

      <Board
        board={state.board}
        lastMove={state.moves.at(-1)}
        onPlay={(index) => dispatch({ type: "play", index })}
      />

      <div className="mt-auto flex gap-3 pt-2">
        <Button
          variant="secondary"
          size="md"
          disabled={state.moves.length === 0}
          onClick={() => dispatch({ type: "undo" })}
          className="disabled:opacity-40"
        >
          Undo
        </Button>
        <Button size="md" onClick={() => dispatch({ type: "restartRound" })}>
          Restart round
        </Button>
      </div>
    </main>
  );
}
