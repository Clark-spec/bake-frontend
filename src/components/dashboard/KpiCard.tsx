import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { IconArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function KpiCard({
  label,
  value,
  hint,
  accent = false,
  icon,
  onClick,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}) {
  const card = (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-34px_rgba(84,54,22,0.6)]",
        accent &&
          "border-amber-300/60 bg-gradient-to-br from-amber-100/80 via-white/55 to-white/35",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-amber-300/40 to-orange-400/5 blur-2xl transition-transform duration-500 group-hover:scale-125"
      />
      <div className="@container relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.16em] text-stone-500">
            {label}
          </p>
          {icon && (
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/70 bg-white/55 text-stone-500 shadow-sm backdrop-blur-md transition-colors duration-300",
                accent && "text-orange-700",
              )}
            >
              {icon}
            </span>
          )}
        </div>
        <p className="mt-3 whitespace-nowrap text-[clamp(1.4rem,12.5cqi,2.1rem)] font-bold leading-none tracking-tight text-stone-900 tabular-nums">
          {value}
        </p>
        {(hint || onClick) && (
          <div className="mt-auto flex items-center gap-2 pt-2">
            {hint && <p className="text-sm text-stone-500">{hint}</p>}
            {onClick && (
              <IconArrowRight
                aria-hidden="true"
                className="ml-auto h-3.5 w-3.5 shrink-0 text-stone-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-amber-700"
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );

  if (!onClick) return card;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="block h-full w-full cursor-pointer rounded-3xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {card}
      <span className="sr-only">View details</span>
    </button>
  );
}
