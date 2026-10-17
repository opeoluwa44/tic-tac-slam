import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Screen } from "../components/Screen";
import { useGame } from "../game/context";
import type { Opponent } from "../game/reducer";
import { gradientText } from "../ui";

const OPTIONS: { opponent: Opponent; title: string; blurb: string }[] = [
  {
    opponent: "human",
    title: "A friend",
    blurb: "Pass the phone back and forth",
  },
  { opponent: "easy", title: "Computer: Easy", blurb: "Plays random moves" },
  {
    opponent: "medium",
    title: "Computer: Medium",
    blurb: "Takes wins and blocks yours",
  },
  {
    opponent: "hard",
    title: "Computer: Hard",
    blurb: "Unbeatable. The best you can do is draw",
  },
];

export function NewMatch() {
  const { dispatch } = useGame();
  const navigate = useNavigate();

  const start = (opponent: Opponent) => {
    dispatch({ type: "newMatch", opponent });
    navigate("/play");
  };

  return (
    <Screen>
      <header>
        <Link
          to="/"
          aria-label="Back to menu"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <ChevronLeft size={20} />
        </Link>
      </header>

      <h1 className="mt-7 font-display text-[64px] uppercase leading-[0.95]">
        Pick your <span className={gradientText}>opponent</span>
      </h1>

      <ul className="mt-8 flex flex-col gap-3">
        {OPTIONS.map(({ opponent, title, blurb }) => (
          <li key={opponent}>
            <button
              onClick={() => start(opponent)}
              className="w-full rounded-[22px] border border-white/10 bg-tile px-5 py-4 text-left"
            >
              <div className="text-lg font-bold">{title}</div>
              <div className="mt-0.5 text-sm text-muted">{blurb}</div>
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  );
}
