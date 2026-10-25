import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/cn";
import { formatNumber, formatPercent } from "@/utils/format";
import type { ResourceUsage } from "@/types";

export function UtilizationBar({ usage, delay = 0 }: { usage: ResourceUsage; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.3, rootMargin: "0px 0px -4% 0px", once: false });
  const target = Math.min(100, Math.max(0, usage.utilizationPercent));

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[0.95rem]">
        <span className="flex items-center gap-2 font-medium text-stone-700">
          {usage.label}
          {usage.binding && <Badge variant="warning">Binding</Badge>}
        </span>
        <span className="tabular-nums text-stone-500">
          {formatNumber(usage.used, 1)} / {formatNumber(usage.capacity, 1)} {usage.unit} (
          <CountUp
            value={usage.utilizationPercent}
            format={formatPercent}
            duration={1300}
            delay={delay}
          />
          )
        </span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-stone-900/10">
        <div
          className={cn(
            "util-bar h-full rounded-full",
            usage.binding
              ? "bg-gradient-to-r from-amber-400 to-orange-600"
              : "bg-gradient-to-r from-emerald-400 to-teal-500",
          )}
          style={{
            width: `${inView ? target : 0}%`,
            transitionProperty: "width",
            transitionDuration: "1300ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
