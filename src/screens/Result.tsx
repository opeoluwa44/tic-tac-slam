import { Navigate, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { ScoreCard } from "../components/ScoreCard";
import { getWinner, isDraw } from "../game/logic";
import { useGame } from "../game/context";
import { gradientText } from "../ui";
import { motion } from "motion/react";
import { SlamMark } from "../components/SlamMark";

export function Result() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const winner = getWinner(state.board);
  const draw = isDraw(state.board);

  // Visiting /result with no finished round (or after "Next round"): go back to the game.
  if (!winner && !draw) return <Navigate to="/play" replace />;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-6 py-6">
      <header className="flex items-center justify-center">
        <div className="flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-5 text-[15px] font-bold">
          Round {state.round}
        </div>
      </header>

      <section className="mt-9 text-center">
        <p className="text-[15px] font-bold uppercase tracking-[3px] text-muted">
          {winner ? "Three in a row" : "Board full, no line"}
        </p>
        <motion.h1
          className="mt-2.5 font-display text-[116px] uppercase leading-[0.9]"
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 16 }}
        >
          {winner ? (
            <>
              {winner.player} <span className={gradientText}>wins</span>
            </>
          ) : (
            <span className={gradientText}>Draw</span>
          )}
        </motion.h1>
      </section>

      <div className="mx-auto mt-8 grid w-[270px] grid-cols-3 gap-2 rounded-[26px] border border-white/10 bg-black/35 p-2.5">
        {state.board.map((cell, i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-[18px] border bg-tile ${
              winner?.line.includes(i)
                ? "border-ember shadow-[0_0_18px_rgba(238,122,58,0.5)]"
                : "border-white/10"
            }`}
          >
            {cell && <SlamMark player={cell} size={34} />}
          </div>
        ))}
      </div>

      <div className="mt-7 flex gap-3">
        <ScoreCard player="X" score={state.scores.X} />
        <ScoreCard player="O" score={state.scores.O} />
      </div>

      <div className="mt-auto flex flex-col gap-3.5 pt-8">
        {/* No navigate() needed: the guard above redirects once the round resets. */}
        <Button onClick={() => dispatch({ type: "nextRound" })}>
          Next round
        </Button>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to menu
        </Button>
      </div>
    </main>
  );
}
