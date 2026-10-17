import { ChevronLeft } from "lucide-react";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { ScoreCard } from "../components/ScoreCard";
import { getWinner, isDraw } from "../game/logic";
import { useGame } from "../game/context";
import { gradientText } from "../ui";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Screen } from "../components/Screen";
import { pickMove } from "../game/ai";
import { isComputerTurn } from "../game/reducer";
import { labelFor } from "../game/labels";
import { statusFor } from "../game/labels";
import { MatchBadge } from "../components/MacthBadge";

const RESULT_DELAY_MS = 1400;

export function Game() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const winner = getWinner(state.board);
  const draw = isDraw(state.board);
  const over = winner !== null || draw;

  const { board, opponent } = state;
  const computerTurn = isComputerTurn(state);

  const status = statusFor({
    winner,
    draw,
    thinking: computerTurn,
    current: state.current,
    opponent,
    computer: state.computer,
  });

  const THINK_MS = 600;

  useEffect(() => {
    if (!computerTurn || opponent === "human") return;
    // A beat of "thinking" feels natural. An instant reply feels robotic.
    const id = setTimeout(() => {
      dispatch({
        type: "play",
        index: pickMove(board, state.computer, opponent),
      });
    }, THINK_MS);
    return () => clearTimeout(id);
  }, [computerTurn, board, opponent, dispatch]);

  const [arrivedFinished] = useState(over);

  useEffect(() => {
    if (!over || arrivedFinished) return;
    const id = setTimeout(
      () => navigate("/result", { replace: true }),
      RESULT_DELAY_MS,
    );
    return () => clearTimeout(id);
  }, [over, arrivedFinished, navigate]);

  if (arrivedFinished) return <Navigate to="/result" replace />;

  return (
    <Screen className="mx-auto flex min-h-dvh max-w-[430px] flex-col gap-5 px-6 py-6">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          aria-label="Back to menu"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <ChevronLeft size={20} />
        </Link>
        <MatchBadge round={state.round} opponent={opponent} />{" "}
        <div className="size-11" />
      </header>

      <div className="flex gap-3">
        <ScoreCard
          player="X"
          label={labelFor("X", state.opponent, state.computer)}
          score={state.scores.X}
          active={!over && state.current === "X"}
        />

        <ScoreCard
          player="O"
          label={labelFor("O", state.opponent, state.computer)}
          score={state.scores.O}
          active={!over && state.current === "O"}
        />
      </div>

      <h2 className="flex h-14 items-center justify-center whitespace-nowrap font-display text-[52px] uppercase leading-none">
        {status.lead && <>{status.lead}&nbsp;</>}
        <span className={gradientText}>{status.accent}</span>
      </h2>

      <Board
        board={state.board}
        winLine={winner?.line}
        lastMove={state.moves.at(-1)}
        disabled={over || computerTurn}
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
    </Screen>
  );
}
