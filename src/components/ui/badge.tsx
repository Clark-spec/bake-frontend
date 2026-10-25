import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = {
  children: ReactNode;
  variant?: "neutral" | "success" | "danger" | "warning" | "accent";
  className?: string;
};

const variants = {
  neutral: "border border-white/70 bg-white/50 text-stone-600 backdrop-blur-sm",
  success: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  danger: "border border-rose-500/20 bg-rose-500/10 text-rose-700",
  warning: "border border-amber-500/25 bg-amber-500/15 text-amber-800",
  accent:
    "border border-amber-400/40 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_10px_20px_-14px_rgba(180,83,9,0.9)]",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
