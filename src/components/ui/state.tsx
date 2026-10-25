import { Button } from "@/components/ui/button";
import { IconAlert, IconInfo } from "@/components/ui/icons";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-amber-300/50 border-t-amber-600 ${className ?? ""}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="glass flex items-center justify-center gap-3 rounded-3xl py-14 text-sm font-medium text-stone-500">
      <Spinner />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="glass flex flex-col items-center justify-center gap-3 rounded-3xl border-rose-300/50 bg-rose-50/50 px-6 py-10 text-center"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-rose-200/70 bg-rose-100/80 text-rose-600">
        <IconAlert className="h-5 w-5" />
      </span>
      <p className="max-w-md text-sm leading-relaxed text-rose-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="glass-soft flex flex-col items-center justify-center gap-2 rounded-3xl border-dashed border-stone-300/60 px-6 py-12 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/50 text-stone-400">
        <IconInfo className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-stone-600">{message}</p>
      {hint && <p className="text-sm text-stone-400">{hint}</p>}
    </div>
  );
}
