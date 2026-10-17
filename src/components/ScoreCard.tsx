import type { Player } from "../game/logic";

type Props = { player: Player; score: number; active?: boolean };

export function ScoreCard({ player, score, active = false }: Props) {
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
