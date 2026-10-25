import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import type { DescriptiveResult } from "@/types";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBox,
  IconChartBars,
  IconClose,
  IconCoins,
  IconReceipt,
  IconTrendingUp,
  IconWallet,
} from "@/components/ui/icons";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/utils/format";

export type KpiMetric = "revenue" | "units" | "orders" | "aov" | "expenses" | "profit";

type DetailStat = { label: string; value: string; note?: string };

type DetailRow = {
  label: string;
  value: number;
  display: string;
  note?: string;
  barClass?: string;
};

type DetailContent = {
  title: string;
  value: string;
  definition: string;
  accent: string;
  icon: ReactNode;
  stats: DetailStat[];
  sectionTitle: string;
  rows: DetailRow[];
  sparkline?: number[];
  link?: { href: string; label: string };
};

const EMPTY = "—";

function buildContent(metric: KpiMetric, data: DescriptiveResult): DetailContent {
  const { kpis, revenueByWeek, revenueByProduct, expensesByCategory, ordersByChannel } = data;
  const weeks = revenueByWeek.length;
  const expenseTotal = expensesByCategory.reduce((sum, row) => sum + row.amount, 0);
  const expenseRatio = kpis.totalRevenue > 0 ? (kpis.totalExpenses / kpis.totalRevenue) * 100 : 0;
  const margin = kpis.totalRevenue > 0 ? (kpis.estimatedNetProfit / kpis.totalRevenue) * 100 : 0;
  const topExpense = [...expensesByCategory].sort((a, b) => b.amount - a.amount)[0];
  const productsByUnits = [...revenueByProduct].sort((a, b) => b.units - a.units);
  const channelsByCount = [...ordersByChannel].sort((a, b) => b.count - a.count);
  const channelsByAov = [...ordersByChannel]
    .map((row) => ({ ...row, aov: row.count > 0 ? row.amount / row.count : 0 }))
    .sort((a, b) => b.aov - a.aov);
  const orderRevenue = ordersByChannel.reduce((sum, row) => sum + row.amount, 0);

  switch (metric) {
    case "revenue":
      return {
        title: "Total revenue",
        value: formatCurrency(kpis.totalRevenue),
        definition: "Recorded sales revenue for the current filter, summed across every product and week.",
        accent: "from-amber-400 to-orange-500",
        icon: <IconCoins className="h-5 w-5" />,
        stats: [
          { label: "Revenue / week", value: weeks ? formatCurrency(kpis.totalRevenue / weeks) : EMPTY },
          {
            label: "Best week",
            value: weeks ? formatCurrency(data.bestWeek.revenue) : EMPTY,
            note: weeks ? formatDate(data.bestWeek.weekStart) : undefined,
          },
          {
            label: "Top product",
            value: revenueByProduct[0]?.product ?? EMPTY,
            note: revenueByProduct[0] ? formatCurrency(revenueByProduct[0].revenue) : undefined,
          },
        ],
        sectionTitle: "Top products by revenue",
        rows: revenueByProduct.slice(0, 5).map((row) => ({
          label: row.product,
          value: row.revenue,
          display: formatCurrency(row.revenue),
          note:
            kpis.totalRevenue > 0
              ? `${formatPercent((row.revenue / kpis.totalRevenue) * 100)} of revenue`
              : undefined,
        })),
        sparkline: revenueByWeek.slice(-12).map((row) => row.revenue),
        link: { href: "/descriptive", label: "Open Descriptive" },
      };
    case "units":
      return {
        title: "Total units sold",
        value: `${formatNumber(kpis.totalUnits)} units`,
        definition: "Total units sold across every product and week in the current filter.",
        accent: "from-teal-400 to-emerald-500",
        icon: <IconBox className="h-5 w-5" />,
        stats: [
          { label: "Units / week", value: weeks ? formatNumber(kpis.totalUnits / weeks) : EMPTY },
          {
            label: "Units per order",
            value:
              kpis.totalOrders > 0 ? formatNumber(kpis.totalUnits / kpis.totalOrders, 1) : EMPTY,
          },
          {
            label: "Top product",
            value: productsByUnits[0]?.product ?? EMPTY,
            note: productsByUnits[0] ? `${formatNumber(productsByUnits[0].units)} units` : undefined,
          },
        ],
        sectionTitle: "Top products by units",
        rows: productsByUnits.slice(0, 5).map((row) => ({
          label: row.product,
          value: row.units,
          display: `${formatNumber(row.units)} units`,
          note:
            kpis.totalUnits > 0
              ? `${formatPercent((row.units / kpis.totalUnits) * 100)} of units`
              : undefined,
        })),
        link: { href: "/descriptive", label: "Open Descriptive" },
      };
    case "orders":
      return {
        title: "Orders",
        value: `${formatNumber(kpis.totalOrders)} orders`,
        definition: "Recorded orders for the current filter, grouped by sales channel below.",
        accent: "from-violet-400 to-purple-500",
        icon: <IconReceipt className="h-5 w-5" />,
        stats: [
          { label: "Orders", value: formatNumber(kpis.totalOrders) },
          { label: "Average value", value: formatCurrency(kpis.averageOrderValue), note: "per order" },
          {
            label: "Busiest channel",
            value: channelsByCount[0]?.channel ?? EMPTY,
            note: channelsByCount[0]
              ? `${formatNumber(channelsByCount[0].count)} orders`
              : undefined,
          },
        ],
        sectionTitle: "Orders by channel",
        rows: channelsByCount.map((row) => ({
          label: row.channel,
          value: row.count,
          display: `${formatNumber(row.count)} orders`,
          note: formatCurrency(row.amount),
        })),
      };
    case "aov":
      return {
        title: "Average order value",
        value: formatCurrency(kpis.averageOrderValue),
        definition: "Total order amount divided by the number of recorded orders for the current filter.",
        accent: "from-sky-400 to-blue-500",
        icon: <IconChartBars className="h-5 w-5" />,
        stats: [
          { label: "Average value", value: formatCurrency(kpis.averageOrderValue) },
          { label: "Order revenue", value: formatCurrency(orderRevenue) },
          { label: "Orders", value: formatNumber(kpis.totalOrders) },
        ],
        sectionTitle: "Average value by channel",
        rows: channelsByAov.map((row) => ({
          label: row.channel,
          value: row.aov,
          display: formatCurrency(row.aov),
          note: `${formatNumber(row.count)} orders · ${formatCurrency(row.amount)}`,
        })),
      };
    case "expenses":
      return {
        title: "Total expenses",
        value: formatCurrency(kpis.totalExpenses),
        definition: "Recorded operating expenses for the current filter, grouped by expense category.",
        accent: "from-rose-400 to-red-500",
        icon: <IconWallet className="h-5 w-5" />,
        stats: [
          { label: "Total expenses", value: formatCurrency(kpis.totalExpenses) },
          {
            label: "Largest category",
            value: topExpense?.category ?? EMPTY,
            note: topExpense ? formatCurrency(topExpense.amount) : undefined,
          },
          { label: "Of revenue", value: formatPercent(expenseRatio), note: "expenses ÷ revenue" },
        ],
        sectionTitle: "Expenses by category",
        rows: [...expensesByCategory]
          .sort((a, b) => b.amount - a.amount)
          .map((row) => ({
            label: row.category,
            value: row.amount,
            display: formatCurrency(row.amount),
            note:
              expenseTotal > 0
                ? `${formatPercent((row.amount / expenseTotal) * 100)} of expenses`
                : undefined,
          })),
      };
    case "profit":
      return {
        title: "Estimated net profit",
        value: formatCurrency(kpis.estimatedNetProfit),
        definition:
          "Estimated net profit = recorded revenue minus recorded expenses. It is a simple estimate for this dataset, not an accounting profit.",
        accent: "from-emerald-400 to-teal-500",
        icon: <IconTrendingUp className="h-5 w-5" />,
        stats: [
          { label: "Net profit", value: formatCurrency(kpis.estimatedNetProfit) },
          { label: "Profit margin", value: formatPercent(margin), note: "of revenue" },
          {
            label: "Expenses",
            value: formatCurrency(kpis.totalExpenses),
            note: `${formatPercent(expenseRatio)} of revenue`,
          },
        ],
        sectionTitle: "Revenue, expenses, and profit",
        rows: [
          {
            label: "Revenue",
            value: kpis.totalRevenue,
            display: formatCurrency(kpis.totalRevenue),
            barClass: "from-amber-400 to-orange-500",
          },
          {
            label: "Expenses",
            value: kpis.totalExpenses,
            display: formatCurrency(kpis.totalExpenses),
            barClass: "from-rose-400 to-red-500",
          },
          {
            label: "Net profit",
            value: Math.abs(kpis.estimatedNetProfit),
            display: formatCurrency(kpis.estimatedNetProfit),
            note:
              kpis.estimatedNetProfit < 0
                ? "Loss — expenses exceed revenue"
                : "Estimated revenue − expenses",
            barClass:
              kpis.estimatedNetProfit < 0
                ? "from-rose-400 to-red-500"
                : "from-emerald-400 to-teal-500",
          },
        ],
        link: { href: "/prescriptive", label: "Open Prescriptive" },
      };
  }
}

function RevenueSparkline({ values }: { values: number[] }) {
  const gradientId = useId().replace(/:/g, "");

  if (values.length < 2) return null;

  const width = 320;
  const height = 64;
  const pad = 6;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = pad + (index / (values.length - 1)) * (width - pad * 2);
      const y = height - pad - ((value - min) / span) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="mt-5 rounded-2xl border border-white/70 bg-white/45 p-3">
      <div className="flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-stone-500">
        <span>Last {values.length} weeks</span>
        <span className="tabular-nums">Peak {formatCurrency(max)}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="mt-2 h-16 w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${pad},${height - pad} ${points} ${width - pad},${height - pad}`}
          fill={`url(#${gradientId})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke="#f97316"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export function KpiDetailDialog({
  metric,
  data,
  onClose,
}: {
  metric: KpiMetric | null;
  data: DescriptiveResult;
  onClose: () => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const leaveTimer = useRef<number | null>(null);
  const closingRef = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setLeaving(true);
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      closingRef.current = false;
      setLeaving(false);
      onClose();
    }, 180);
  }, [onClose]);

  useEffect(() => {
    if (!metric) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [metric, requestClose]);

  useEffect(
    () => () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  if (!metric) return null;

  const content = buildContent(metric, data);
  const maxRow = content.rows.reduce((max, row) => Math.max(max, row.value), 0);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className={cn(
          "absolute inset-0 bg-stone-950/45 backdrop-blur-[6px]",
          leaving ? "animate-backdrop-out" : "animate-backdrop-in",
        )}
        onClick={requestClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "glass-strong relative max-h-[90vh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-h-[85vh] sm:rounded-[1.75rem] sm:p-7",
          leaving ? "animate-modal-out" : "animate-modal-in",
        )}
      >
        <span
          aria-hidden="true"
          className="mx-auto mb-4 block h-1 w-10 rounded-full bg-stone-400/50 sm:hidden"
        />
        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          aria-label="Close KPI details"
          className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-stone-400 transition-colors hover:bg-stone-900/5 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 sm:right-5 sm:top-5"
        >
          <IconClose className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-10">
          <span
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
              content.accent,
            )}
          >
            {content.icon}
          </span>
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
              KPI breakdown
            </p>
            <h2
              id={titleId}
              className="mt-0.5 font-display text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl"
            >
              {content.title}
            </h2>
            <p className="mt-1 text-[0.7rem] text-stone-500">
              Current filter · {formatNumber(data.revenueByWeek.length)} weeks
            </p>
          </div>
        </div>

        <p className="mt-5 text-[clamp(2rem,5vw,2.7rem)] font-bold leading-none tracking-tight text-stone-900 tabular-nums">
          {content.value}
        </p>
        <p id={descriptionId} className="mt-3 text-sm leading-relaxed text-stone-600">
          {content.definition}
        </p>

        {content.sparkline && <RevenueSparkline values={content.sparkline} />}

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {content.stats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-2xl border border-white/70 bg-white/45 p-3"
            >
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-stone-500">
                {stat.label}
              </p>
              <p className="mt-1 break-words text-sm font-semibold leading-snug text-stone-800 tabular-nums">
                {stat.value}
              </p>
              {stat.note && (
                <p className="mt-0.5 break-words text-[0.7rem] leading-snug text-stone-500">
                  {stat.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-stone-500">
            {content.sectionTitle}
          </h3>
          {content.rows.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-white/70 bg-white/40 px-4 py-3 text-sm text-stone-500">
              No breakdown data for the current filter.
            </p>
          ) : (
            <ul className="mt-4 space-y-3.5">
              {content.rows.map((row, index) => (
                <li key={`${row.label}-${index}`}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium text-stone-700">{row.label}</span>
                    <span className="shrink-0 font-semibold tabular-nums text-stone-900">
                      {row.display}
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-900/8"
                  >
                    <div
                      className={cn(
                        "animate-detail-bar h-full origin-left rounded-full bg-gradient-to-r",
                        row.barClass ?? content.accent,
                      )}
                      style={{
                        width:
                          maxRow > 0 && row.value > 0
                            ? `${Math.max((row.value / maxRow) * 100, 2)}%`
                            : "0%",
                        animationDelay: `${index * 55}ms`,
                      }}
                    />
                  </div>
                  {row.note && <p className="mt-1 text-[0.7rem] text-stone-500">{row.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {content.link ? (
            <Link
              to={content.link.href}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 transition-colors hover:text-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
            >
              {content.link.label}
              <IconArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          <Button variant="secondary" onClick={requestClose} className="w-full sm:w-auto">
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
