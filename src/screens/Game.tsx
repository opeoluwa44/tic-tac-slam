import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { ScoreCard } from "../components/ScoreCard";
import { getWinner, isDraw } from "../game/logic";
import { useGame } from "../game/context";
import { gradientText } from "../ui";

const RESULT_DELAY_MS = 1400;

export function Game() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const winner = getWinner(state.board);
  const draw = isDraw(state.board);
  const over = winner !== null || draw;

  // A timer is a real side effect, so this one belongs in an effect.
  useEffect(() => {
    if (!over) return;
    const id = setTimeout(
      () => navigate("/result", { replace: true }),
      RESULT_DELAY_MS,
    );
    return () => clearTimeout(id); // leave early (Back button) and the timer is cancelled
  }, [over, navigate]);

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
        <Button
          variant="secondary"
          size="md"
          disabled={over || state.moves.length === 0}
          onClick={() => dispatch({ type: "undo" })}
          className="disabled:opacity-40"
        >
          Undo
        </Button>
        <Button
          size="md"
          disabled={over}
          onClick={() => dispatch({ type: "restartRound" })}
          className="disabled:opacity-40"
        >
          Restart round
        </Button>
      </div>
    </main>
  );
}
