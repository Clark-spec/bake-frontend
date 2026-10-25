import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-7 flex animate-fade-up flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-800 shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_0_3px_rgba(245,158,11,0.16)]" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-stone-900 sm:text-[2.6rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-3xl text-[0.95rem] leading-relaxed text-stone-600">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </header>
  );
}
