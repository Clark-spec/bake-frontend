import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  key: string;
  label: ReactNode;
}

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="glass flex flex-wrap gap-1 rounded-2xl p-1.5" role="tablist">
      {items.map((item) => {
        const selected = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.key)}
            className={cn(
              "cursor-pointer rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60",
              selected
                ? "bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-[0_14px_28px_-16px_rgba(180,83,9,0.95)]"
                : "text-stone-600 hover:bg-white/65 hover:text-stone-900",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
