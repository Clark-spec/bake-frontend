import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} aria-hidden="true" />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton h-3.5 rounded-full"
          style={{ width: index === lines - 1 ? "62%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function KpiSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-3xl p-5 sm:p-6", className)} aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton h-10 w-10 rounded-2xl" />
      </div>
      <div className="skeleton mt-4 h-8 w-32 rounded-xl" />
      <div className="skeleton mt-2.5 h-3 w-20 rounded-full" />
    </div>
  );
}

export function KpiGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <KpiSkeleton key={index} />
      ))}
    </div>
  );
}

export function ChartSkeleton({
  height = 340,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-3xl p-5 sm:p-6", className)} aria-hidden="true">
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-44 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="mt-5" style={{ height }}>
        <div className="skeleton h-full w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
  title = true,
  className,
}: {
  rows?: number;
  columns?: number;
  title?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-3xl p-5 sm:p-6", className)} aria-hidden="true">
      {title && <div className="skeleton h-4 w-52 rounded-full" />}
      <div className="mt-5 space-y-3">
        <div className="skeleton h-9 w-full rounded-xl opacity-70" />
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid items-center gap-3 border-b border-white/40 pb-3 last:border-0"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="skeleton h-3.5 rounded-full"
                style={{ width: columnIndex === 0 ? "82%" : `${58 + ((rowIndex + columnIndex) % 3) * 12}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton({ label = "Loading page" }: { label?: string }) {
  return (
    <StatusRegion label={label}>
      <div className="space-y-6">
        <div>
          <div className="skeleton h-5 w-40 rounded-full" />
          <div className="skeleton mt-4 h-10 w-72 max-w-full rounded-2xl" />
          <div className="skeleton mt-3 h-3.5 w-full max-w-xl rounded-full" />
        </div>
        <KpiGridSkeleton count={3} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartSkeleton height={280} />
          <ChartSkeleton height={280} />
        </div>
        <TableSkeleton rows={4} columns={5} />
      </div>
    </StatusRegion>
  );
}

function StatusRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
