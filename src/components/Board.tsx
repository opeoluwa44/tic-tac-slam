import { motion } from "motion/react";
import type { Board as BoardState } from "../game/logic";
import { SlamMark } from "./SlamMark";

type Props = {
  board: BoardState;
  winLine?: readonly number[];
  lastMove?: number;
  disabled?: boolean;
  onPlay: (index: number) => void;
};

// Cell index → center point, in a 3×3 coordinate space.
const center = (i: number) => ({
  x: (i % 3) + 0.5,
  y: Math.floor(i / 3) + 0.5,
});

function WinLine({ line }: { line: readonly number[] }) {
  const a = center(line[0]);
  const b = center(line[2]);
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const pad = 0.3; // overshoot past the end cells so it reads as a strike-through

  return (
    <svg
      viewBox="0 0 3 3"
      aria-hidden="true"
      className="pointer-events-none absolute inset-3 drop-shadow-[0_0_8px_rgba(238,122,58,0.9)]"
    >
      {/* dark underlay first so the line stays visible over cream and orange marks */}
      {[
        { w: 0.2, c: "#0f0907" },
        { w: 0.11, c: "#f8bf5a" },
      ].map(({ w, c }) => (
        <motion.line
          key={c}
          x1={a.x - ux * pad}
          y1={a.y - uy * pad}
          x2={b.x + ux * pad}
          y2={b.y + uy * pad}
          stroke={c}
          strokeWidth={w}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { delay: 0.3, duration: 0.45, ease: "easeOut" },
            opacity: { delay: 0.3, duration: 0.05 },
          }}
        />
      ))}
    </svg>
  );
}

export function Board({
  board,
  winLine = [],
  lastMove,
  disabled = false,
  onPlay,
}: Props) {
  return (
    <div className="relative grid grid-cols-3 gap-2.5 rounded-[30px] border border-white/10 bg-black/35 p-3">
      {board.map((cell, i) => {
        const highlight = winLine.includes(i) || i === lastMove;
        return (
          <button
            key={i}
            aria-label={`Cell ${i + 1}, ${cell ?? "empty"}`}
            disabled={disabled || cell !== null}
            onClick={() => onPlay(i)}
            className={`flex aspect-square items-center justify-center rounded-[22px] border bg-tile ${
              highlight
                ? "border-ember shadow-[0_0_22px_rgba(238,122,58,0.45)]"
                : "border-white/10"
            }`}
          >
            {cell && <SlamMark player={cell} animate={i === lastMove} />}
          </button>
        );
      })}
      {winLine.length === 3 && <WinLine line={winLine} />}
    </div>
  );
}
