import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("glass rounded-3xl p-5 sm:p-6", className)} style={style}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-[0.95rem] font-semibold tracking-tight text-stone-800", className)}>
      {children}
    </h3>
  );
}
