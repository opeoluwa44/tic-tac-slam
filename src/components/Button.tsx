import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "lg" | "md";
};

const variants = {
  primary: "border-0 bg-linear-to-b from-amber to-ember text-ink shadow-press",
  secondary: "border border-white/15 bg-tile text-cream",
};

const sizes = {
  lg: "h-16 text-xl",
  md: "h-[60px] flex-1 text-base",
};

export function Button({
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-full font-bold ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
