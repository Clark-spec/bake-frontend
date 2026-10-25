import { Badge } from "@/components/ui/badge";

export function StepBadge({ step, label }: { step: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/70 bg-white/55 py-1 pl-1 pr-3.5 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur-md">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-[0.72rem] font-bold text-white shadow-[0_8px_18px_-10px_rgba(180,83,9,0.9)]">
        {step}
      </span>
      <span>
        Step {step} of 3
        {label && <span className="font-medium text-stone-400"> · {label}</span>}
      </span>
      <Badge variant="success" className="ml-0.5 px-1.5 py-0 text-[0.68rem]">
        Active
      </Badge>
    </span>
  );
}
