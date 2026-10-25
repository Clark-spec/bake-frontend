import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="data-table w-full border-collapse text-base">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "border-b border-stone-300/40 px-3.5 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-stone-500",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td
      className={cn(
        "border-b border-white/50 px-3.5 py-3 align-middle text-[0.95rem] text-stone-700",
        className,
      )}
    >
      {children}
    </td>
  );
}
