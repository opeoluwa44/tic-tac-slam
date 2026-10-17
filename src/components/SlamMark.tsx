import { motion } from "motion/react";
import type { Player } from "../game/logic";

const DEPTH = 5;

function Shape({ player, stroke }: { player: Player; stroke: string }) {
  return player === "X" ? (
    <path
      d="M14 14L46 46M46 14L14 46"
      stroke={stroke}
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
  ) : (
    <circle
      cx="30"
      cy="30"
      r="17"
      stroke={stroke}
      strokeWidth="9"
      fill="none"
    />
  );
}

type Props = {
  player: Player;
  size?: number;
  animate?: boolean;
  dim?: boolean;
};

export function SlamMark({
  player,
  size = 60,
  animate = false,
  dim = false,
}: Props) {
  const face = player === "X" ? "#fcf5e8" : "#f59a45";
  const side = player === "X" ? "#8f7a5a" : "#a8481b";

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={player}
      initial={animate ? { scale: 1.9, y: -24, opacity: 0 } : false}
      animate={{ scale: 1, y: 0, opacity: dim ? 0.35 : 1 }}
      transition={{
        type: "spring",
        stiffness: 520,
        damping: 20,
        opacity: { delay: dim ? 0.3 : 0, duration: 0.3 },
      }}
    >
      {Array.from({ length: DEPTH }, (_, i) => (
        <g key={i} transform={`translate(${(i + 1) * 0.9} ${(i + 1) * 1.2})`}>
          <Shape player={player} stroke={side} />
        </g>
      ))}
      <Shape player={player} stroke={face} />
    </motion.svg>
  );
}
