import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { IconArrowRight } from "@/components/ui/icons";

export function CarriedOverPanel({
  fromStep,
  title,
  children,
}: {
  fromStep: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden border-amber-300/50 bg-gradient-to-br from-amber-100/70 via-white/50 to-white/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-orange-300/15 blur-3xl"
      />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-[0_12px_24px_-14px_rgba(180,83,9,0.9)]">
            <IconArrowRight className="h-4 w-4" />
          </span>
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-amber-800/80">
            Carried over from Step {fromStep}
          </p>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-stone-900">
          {title}
        </h3>
        <div className="mt-1.5 text-[0.92rem] leading-relaxed text-stone-600">{children}</div>
      </div>
    </Card>
  );
}
