import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { gradientText } from "../ui";
import { Screen } from "../components/Screen";

const TABS = ["Today", "This week", "All time"] as const;
const ROWS = [
  { name: "mic_drop", wins: 142 },
  { name: "groovequeen", wins: 128 },
  { name: "vinylvic", wins: 117 },
  { name: "n8_the_great", wins: 96 },
  { name: "tacticoe", wins: 88 },
];

export function Leaderboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("This week");

  return (
    <Screen className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-6 py-6">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          aria-label="Back to menu"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-5 text-[15px] font-bold">
          Sample data
        </div>
      </header>

      <h1 className="mt-7 font-display text-[62px] uppercase leading-[0.95]">
        Leader<span className={gradientText}>boards</span>
      </h1>

      <div
        role="tablist"
        className="mt-5 flex rounded-full border border-white/10 bg-black/35 p-1"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`h-11 flex-1 rounded-full text-[15px] font-bold ${
              tab === t
                ? "bg-linear-to-b from-amber to-ember text-ink"
                : "text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ol className="mt-4 flex flex-col gap-2">
        {ROWS.map((row, i) => (
          <li
            key={row.name}
            className={`flex h-[60px] items-center gap-3.5 rounded-[20px] border bg-tile px-4 ${
              i === 0 ? "border-ember" : "border-white/10"
            }`}
          >
            <span
              className={`flex size-[34px] items-center justify-center rounded-full font-display text-lg ${
                i < 3
                  ? "bg-linear-to-br from-amber to-ember text-ink"
                  : "bg-ink text-cream"
              }`}
            >
              {i + 1}
            </span>
            <span className="flex-1 font-bold">{row.name}</span>
            <span className="font-display text-2xl text-[#f59a45]">
              {row.wins}
            </span>
          </li>
        ))}
      </ol>
    </Screen>
  );
}
