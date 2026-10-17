import { Globe, Trophy, User } from "lucide-react";
import { Button } from "../components/Button";
import { SlamHero } from "../components/SlamHero";
import { useNavigate } from "react-router";
import { useGame } from "../game/context";
import { hasMatchInProgress } from "../game/reducer";

export function Home() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const resumable = hasMatchInProgress(state);

  const startNew = () => {
    dispatch({ type: "newMatch" });
    navigate("/play");
  };

  return (
    <main className="relative isolate mx-auto flex min-h-dvh max-w-[430px] flex-col overflow-hidden px-6 py-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_38%,rgba(238,122,58,0.22),transparent_60%)]" />

      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[13px] font-bold tracking-[4px] text-muted">
          <span className="size-2 rounded-full bg-ember" />
          TIC TAC TOE
        </div>
        <button
          aria-label="Sign in"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <User size={20} />
        </button>
      </header>

      <SlamHero />

      <h1 className="text-center font-display text-[54px] uppercase leading-[0.98]">
        Slam three
        <br />
        <span className="bg-linear-to-b from-amber to-ember bg-clip-text text-transparent">
          in a row.
        </span>
      </h1>
      <p className="mt-2.5 text-center text-base text-muted">
        Two players. One grid. No mercy.
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        {resumable ? (
          <>
            <Button onClick={() => navigate("/play")}>
              Resume match · Round {state.round}
            </Button>
            <Button variant="secondary" onClick={startNew}>
              New match
            </Button>
          </>
        ) : (
          <Button onClick={startNew}>Play on one phone</Button>
        )}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/online")}
          >
            <Globe size={18} /> Play online
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/leaderboard")}
          >
            <Trophy size={18} className="text-amber" /> Leaderboards
          </Button>
        </div>
      </div>
    </main>
  );
}
