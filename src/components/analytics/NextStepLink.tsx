import { Link } from "react-router";
import { IconArrowRight } from "@/components/ui/icons";

export function NextStepLink({ to, label }: { to: string; label: string }) {
  return (
    <div className="flex justify-end">
      <Link
        to={to}
        className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_36px_-18px_rgba(180,83,9,0.95)] transition-all duration-200 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
      >
        Next step
        <span className="text-white/60">·</span>
        {label}
        <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
