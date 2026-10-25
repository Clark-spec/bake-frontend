import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import { IconAlert, IconCheck } from "@/components/ui/icons";

export function CountBadge({
  count,
  minimum,
  meetsMinimum,
}: {
  count: number;
  minimum: number;
  meetsMinimum: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { threshold: 0.5, rootMargin: "0px 0px -4% 0px", once: false });
  const progress = minimum > 0 ? Math.min(100, (count / minimum) * 100) : 100;
  return (
    <div className="flex items-center gap-2">
      <span ref={ref} className="relative h-1.5 w-12 overflow-hidden rounded-full bg-stone-900/10">
        <span
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out",
            meetsMinimum ? "from-emerald-400 to-teal-500" : "from-rose-400 to-red-500",
          )}
          style={{ width: `${inView ? progress : 0}%` }}
        />
      </span>
      <span className="text-xs font-semibold tabular-nums text-stone-600">
        {count} / {minimum}
      </span>
      {meetsMinimum ? (
        <IconCheck className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <IconAlert className="h-3.5 w-3.5 text-rose-500" />
      )}
    </div>
  );
}
