import type { ButtonHTMLAttributes } from "react";

export function Pill({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-[15px] font-bold text-cream ${className}`}
      {...props}
    />
  );
}
