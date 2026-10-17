import { Bot, Users } from "lucide-react";
import { MODE_LABEL } from "../game/labels";
import type { Opponent } from "../game/reducer";

export function MatchBadge({
  round,
  opponent,
}: {
  round: number;
  opponent: Opponent;
}) {
  const Icon = opponent === "human" ? Users : Bot;
  return (
    <div className="flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-4 text-[15px] font-bold">
      <Icon size={16} className="text-amber" aria-hidden="true" />
      Round {round}
      <span aria-hidden="true" className="text-muted">
        ·
      </span>
      <span className="text-muted">{MODE_LABEL[opponent]}</span>
    </div>
  );
}
