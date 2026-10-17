import type { Board as BoardState } from "../game/logic";
import { OMark, XMark } from "./Mark";

type Props = {
  board: BoardState;
  winLine?: readonly number[];
  lastMove?: number;
  disabled?: boolean;
  onPlay: (index: number) => void;
};

export function Board({
  board,
  winLine = [],
  lastMove,
  disabled = false,
  onPlay,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-2.5 rounded-[30px] border border-white/10 bg-black/35 p-3">
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
            {cell === "X" && <XMark />}
            {cell === "O" && <OMark />}
          </button>
        );
      })}
    </div>
  );
}
