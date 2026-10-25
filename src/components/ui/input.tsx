import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const fieldClassName =
  "w-full rounded-2xl border border-white/70 bg-white/55 px-3.5 py-2.5 text-base text-stone-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none backdrop-blur-md transition-all duration-200 placeholder:text-stone-400 focus:border-amber-400/80 focus:bg-white/85 focus:ring-4 focus:ring-amber-200/50";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClassName, className)} {...props} />;
}

export function Label({ children, className }: { children: string; className?: string }) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-stone-500",
        className,
      )}
    >
      {children}
    </label>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
