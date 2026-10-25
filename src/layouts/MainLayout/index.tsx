import { Suspense, useState } from "react";
import type { ComponentType } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { NAV_ITEMS } from "@/utils/constants";
import { cn } from "@/lib/cn";
import { PageSkeleton } from "@/components/ui/skeleton";
import {
  IconChartBars,
  IconClose,
  IconDatabase,
  IconHome,
  IconMenu,
  IconSliders,
  IconSparkles,
  IconTrendingUp,
  IconWheat,
  type IconProps,
} from "@/components/ui/icons";

const NAV_ICONS: Record<string, ComponentType<IconProps>> = {
  "/": IconHome,
  "/dashboard": IconChartBars,
  "/descriptive": IconTrendingUp,
  "/predictive": IconSparkles,
  "/prescriptive": IconSliders,
  "/data": IconDatabase,
};

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const nav = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1.5">
      {NAV_ITEMS.map((item) => {
        const NavIcon = NAV_ICONS[item.to] ?? IconHome;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[0.95rem] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40",
                isActive
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-stone-950 shadow-[0_16px_32px_-16px_rgba(245,158,11,0.9)]"
                  : "text-stone-300/80 hover:translate-x-0.5 hover:bg-white/10 hover:text-white",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                    isActive
                      ? "bg-stone-950/10 text-stone-950"
                      : "bg-white/5 text-stone-400 group-hover:text-amber-200",
                  )}
                >
                  <NavIcon className="h-[1.15rem] w-[1.15rem]" />
                </span>
                <span className="flex-1">{item.label}</span>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-opacity duration-300",
                    isActive ? "bg-stone-950/60 opacity-100" : "opacity-0",
                  )}
                />
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const statusCard = (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
      <p className="flex items-center gap-2 text-[0.7rem] font-semibold text-stone-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Live analytics
      </p>
      <p className="mt-1.5 text-[0.68rem] leading-relaxed text-stone-500">
        Descriptive → Predictive → Prescriptive
      </p>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-[18.5rem] shrink-0 p-4 lg:block">
        <div className="glass-dark sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[2rem] p-5 relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl"
          />
          <div className="relative px-1 py-1">
            <Brand />
          </div>
          <p className="mb-2 mt-7 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
            Workspace
          </p>
          <div className="relative">{nav()}</div>
          <div className="relative mt-auto">{statusCard}</div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-backdrop-in bg-stone-950/45 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="glass-dark absolute bottom-3 left-3 top-3 flex w-[min(19rem,calc(100vw-1.5rem))] animate-drawer-in flex-col overflow-hidden rounded-[1.75rem] p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-stone-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-2 mt-7 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Workspace
            </p>
            <div className="overflow-y-auto">{nav(() => setOpen(false))}</div>
            <div className="mt-auto pt-4">{statusCard}</div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/50 bg-white/55 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Brand dark />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            aria-expanded={open}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-2xl border border-white/70 bg-white/60 text-stone-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
          >
            <IconMenu className="h-5 w-5" />
          </button>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8"
        >
          <div key={location.pathname} className="page-enter">
            <Suspense fallback={<PageSkeleton label="Loading page" />}>
              <Outlet />
            </Suspense>
          </div>
          <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/50 pt-4 text-xs text-stone-400">
            <span>Bake &amp; Batch · Business Analytics final project</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
              Live data
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 text-stone-950 shadow-[0_14px_30px_-12px_rgba(251,191,36,0.9)]">
        <IconWheat className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "font-display text-[1.15rem] font-semibold leading-tight tracking-tight",
            dark ? "text-stone-900" : "text-white",
          )}
        >
          Bake &amp; Batch
        </p>
        <p
          className={cn(
            "text-[0.62rem] font-semibold uppercase tracking-[0.18em]",
            dark ? "text-stone-500" : "text-amber-200/60",
          )}
        >
          Product mix optimizer
        </p>
      </div>
    </div>
  );
}
