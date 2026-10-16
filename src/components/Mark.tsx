import type { ReactNode } from "react";

export function Vinyl({ children }: { children?: ReactNode }) {
  return (
    <div
      className="vinyl-grooves flex size-52 items-center justify-center rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_0_0_3px_#050505]"
      aria-hidden="true"
    >
      <div className="flex size-[72px] items-center justify-center rounded-full bg-linear-to-br from-amber to-ember">
        {children}
      </div>
    </div>
  );
}
