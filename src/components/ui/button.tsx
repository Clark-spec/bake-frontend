import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "solidDanger";
  size?: "sm" | "md";
  loading?: boolean;
  children: ReactNode;
};

const variants = {
  primary:
    "bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-[0_16px_32px_-18px_rgba(180,83,9,0.95)] hover:brightness-[1.04] hover:shadow-[0_20px_38px_-18px_rgba(180,83,9,1)]",
  secondary:
    "border border-white/70 bg-white/55 text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md hover:border-white/90 hover:bg-white/80",
  ghost: "text-stone-600 hover:bg-white/60 hover:text-stone-900",
  danger:
    "border border-rose-200/80 bg-rose-50/80 text-rose-700 hover:border-rose-300 hover:bg-rose-100",
  solidDanger:
    "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_16px_32px_-18px_rgba(190,18,60,0.9)] hover:brightness-[1.05]",
};

const sizes = {
  md: "rounded-2xl px-4 py-2.5 text-[0.95rem]",
  sm: "rounded-xl px-3 py-1.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          className={cn(
            "inline-block h-4 w-4 animate-spin rounded-full border-2",
            variant === "primary" || variant === "solidDanger"
              ? "border-white/35 border-t-white"
              : "border-stone-400/40 border-t-stone-600",
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
