import type { ReactNode } from "react";
import { motion } from "motion/react";

export function Screen({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.main
      className={`mx-auto flex min-h-dvh max-w-[430px] flex-col px-6 py-6 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  );
}
