import { Link } from "react-router";
import { useCaseSummary } from "@/hooks/useAnalytics";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardTitle } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import {
  IconArrowRight,
  IconChartBars,
  IconCheck,
  IconDatabase,
  IconInfo,
  IconSliders,
  IconSparkles,
  IconTrendingUp,
  IconWheat,
} from "@/components/ui/icons";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/utils/format";

const STEPS = [
  {
    title: "1. Descriptive",
    text: "Summaries, charts, and statistics show what happened: top products, customers, and revenue trends.",
    output: "Weekly sales history",
    icon: IconChartBars,
    href: "/descriptive",
    chip: "from-amber-400 to-orange-500",
    tint: "from-amber-100/70",
    hoverBorder: "group-hover:border-amber-300/80",
    glow: "bg-amber-300/30",
  },
  {
    title: "2. Predictive",
    text: "Three forecasting models are validated with MAPE on the last 8 weeks; the best one forecasts weekly demand.",
    output: "Monthly demand forecast",
    icon: IconSparkles,
    href: "/predictive",
    chip: "from-teal-400 to-emerald-500",
    tint: "from-teal-100/70",
    hoverBorder: "group-hover:border-teal-300/80",
    glow: "bg-teal-300/30",
  },
  {
    title: "3. Prescriptive",
    text: "Linear programming uses forecast demand and limited oven, labor, and flour to find the most profitable plan.",
    output: "Optimal production plan",
    icon: IconSliders,
    href: "/prescriptive",
    chip: "from-violet-400 to-purple-500",
    tint: "from-violet-100/70",
    hoverBorder: "group-hover:border-violet-300/80",
    glow: "bg-violet-300/30",
  },
];

const RESOURCE_LABELS: Record<string, string> = {
  OVEN_HOURS: "Oven hours",
  LABOR_HOURS: "Labor hours",
  FLOUR_KG: "Flour",
};

export default function OverviewPage() {
  const { data, loading, error, refetch } = useCaseSummary();
  const bindingResources = data?.prescriptive.bindingResources.filter((resource) => resource !== "None") ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Business Analytics Final Project"
        title="Bake & Batch"
        description="A neighborhood bakery that sells pandesal, Spanish bread, ensaymada, cakes, and more."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="relative h-full overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-amber-300/25 blur-3xl"
          />
          <div className="relative">
            <p className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-amber-800/70">
              <IconWheat className="h-3.5 w-3.5" />
              Context
            </p>
            <CardTitle className="mt-1.5 font-display text-xl font-semibold">Problem Background</CardTitle>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-stone-600">
              Bake &amp; Batch can only bake for a limited number of oven hours, labor hours, and kilos of flour
              each month. Demand for some products is higher than it can produce, so the owner bakes a little of
              everything without knowing which products to prioritize.
            </p>
            <div className="mt-5 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 to-orange-50/40 p-4">
              <p className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-amber-800">
                <IconInfo className="h-3.5 w-3.5" />
                Business question
              </p>
              <p className="mt-1.5 text-base font-semibold leading-snug text-stone-800">
                How many units of each product should we bake next month to maximize profit, given forecasted
                demand and limited resources?
              </p>
            </div>
          </div>
          </Card>
        </Reveal>

        <Reveal delay={100}>
          <Card className="relative h-full overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl"
          />
          <CardTitle className="font-display text-xl font-semibold">The BA Process</CardTitle>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-stone-600">
            Three connected steps turn raw sales data into a monthly production decision.
          </p>
          <div className="mt-5 space-y-3.5">
            {STEPS.map((step, index) => (
              <div key={step.title} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br ${step.chip} text-[0.7rem] font-bold text-white shadow-sm`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{step.title.replace(/^\d+\.\s*/, "")}</p>
                  <p className="text-xs text-stone-500">{step.output}</p>
                </div>
              </div>
            ))}
          </div>
          </Card>
        </Reveal>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const cleanTitle = step.title.replace(/^\d+\.\s*/, "");
          return (
            <Reveal key={step.title} delay={index * 90} className="h-full">
              <Link
                to={step.href}
                className="group block h-full rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <Card
                  className={`relative h-full overflow-hidden bg-gradient-to-br ${step.tint} via-white/40 to-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_36px_70px_-36px_rgba(84,54,22,0.55)] ${step.hoverBorder}`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full ${step.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white/60 text-stone-400 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:text-white group-hover:shadow-md ${step.chip}`}
                  >
                    <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                  <div className="relative">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${step.chip} text-white shadow-lg`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </span>
                    <CardTitle className="mt-4 font-display text-lg font-semibold">{cleanTitle}</CardTitle>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.text}</p>
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-1 text-xs font-semibold text-stone-600 transition-colors duration-300 group-hover:border-white/90 group-hover:bg-white/80 group-hover:text-stone-800">
                      <IconArrowRight className="h-3.5 w-3.5 text-amber-600" />
                      Hands over {step.output}
                    </p>
                  </div>
                </Card>
              </Link>
            </Reveal>
          );
        })}
      </section>

      <Reveal>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900">
              Case Study Summary
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              A live summary of the three analytics steps, structured like the book&apos;s Chapter 8.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-stone-500 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live results
          </span>
        </div>
      </Reveal>

      {error && <div className="mt-4"><ErrorState message={error} onRetry={refetch} /></div>}

      {loading && (
        <div className="mt-4 grid gap-4 md:grid-cols-2" role="status" aria-busy="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass rounded-3xl p-5 sm:p-6">
              <Skeleton className="h-4 w-48" />
              <SkeletonText lines={4} className="mt-5" />
            </div>
          ))}
        </div>
      )}

      {data && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Reveal className="h-full">
            <Card className="h-full">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/70 bg-white/55 text-stone-500">
                  <IconDatabase className="h-4 w-4" />
                </span>
                <CardTitle>8.2 Problem Background and Data</CardTitle>
              </div>
              <ul className="mt-4 space-y-1 text-[0.95rem] text-stone-600">
                {Object.entries(data.background.recordCounts).map(([key, count]) => (
                  <li
                    key={key}
                    className="flex justify-between border-b border-white/60 py-1.5 last:border-0"
                  >
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-semibold text-stone-800">{formatNumber(count)} records</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <Link
              to="/descriptive"
              className="group block h-full rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
            >
              <Card className="h-full transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-amber-200/80 group-hover:shadow-[0_30px_60px_-34px_rgba(180,83,9,0.45)]">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/70 bg-white/55 text-amber-700">
                    <IconTrendingUp className="h-4 w-4" />
                  </span>
                  <CardTitle className="min-w-0">8.3 Descriptive Analytics</CardTitle>
                  <IconArrowRight className="ml-auto h-4 w-4 shrink-0 text-stone-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-amber-600" />
                </div>
                <ul className="mt-4 space-y-1 text-[0.95rem] text-stone-600">
                  <li className="flex justify-between border-b border-white/60 py-1.5">
                    <span>Total revenue</span>
                    <span className="font-semibold text-stone-800">
                      <CountUp value={data.descriptive.totalRevenue} format={formatCurrency} />
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/60 py-1.5">
                    <span>Top product</span>
                    <span className="text-right font-semibold text-stone-800">
                      {data.descriptive.topProduct} (
                      <CountUp value={data.descriptive.topProductRevenue} format={formatCurrency} />)
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/60 py-1.5">
                    <span>Best week</span>
                    <span className="font-semibold text-stone-800">{formatDate(data.descriptive.bestWeek)}</span>
                  </li>
                  <li className="flex justify-between py-1.5">
                    <span>Estimated net profit</span>
                    <span className="font-semibold text-stone-800">
                      <CountUp value={data.descriptive.netProfitEstimate} format={formatCurrency} />
                    </span>
                  </li>
                </ul>
              </Card>
            </Link>
          </Reveal>

          <Reveal delay={160} className="h-full">
            <Link
              to="/predictive"
              className="group block h-full rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-teal-300/60"
            >
              <Card className="h-full transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-teal-200/80 group-hover:shadow-[0_30px_60px_-34px_rgba(15,118,110,0.45)]">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/70 bg-white/55 text-teal-700">
                    <IconSparkles className="h-4 w-4" />
                  </span>
                  <CardTitle className="min-w-0">8.4 Demand Forecasts</CardTitle>
                  <IconArrowRight className="ml-auto h-4 w-4 shrink-0 text-stone-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-teal-600" />
                </div>
                <ul className="mt-4 space-y-1 text-[0.95rem] text-stone-600">
                  <li className="flex justify-between border-b border-white/60 py-1.5">
                    <span>Monthly forecast units</span>
                    <span className="font-semibold text-stone-800">
                      <CountUp value={data.predictive.totalMonthlyForecastUnits} format={formatNumber} />
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/60 py-1.5">
                    <span>Average MAPE (best models)</span>
                    <span className="font-semibold text-stone-800">
                      <CountUp
                        value={data.predictive.averageMape}
                        format={formatPercent}
                        decimals={1}
                      />
                    </span>
                  </li>
                  <li className="border-b-0 py-1.5">
                    <span>Best models chosen</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {Object.entries(data.predictive.bestModelCounts).map(([model, count]) => (
                        <span
                          key={model}
                          className="rounded-full border border-white/70 bg-white/55 px-2.5 py-0.5 text-xs font-medium text-stone-600"
                        >
                          {model}: {count}
                        </span>
                      ))}
                    </div>
                  </li>
                </ul>
              </Card>
            </Link>
          </Reveal>

          <Reveal delay={240} className="h-full">
            <Link
              to="/prescriptive"
              className="group block h-full rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60"
            >
              <Card className="h-full transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-violet-200/80 group-hover:shadow-[0_30px_60px_-34px_rgba(109,40,217,0.4)]">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/70 bg-white/55 text-violet-700">
                    <IconSliders className="h-4 w-4" />
                  </span>
                  <CardTitle className="min-w-0">8.5 Optimal Plan</CardTitle>
                  <IconArrowRight className="ml-auto h-4 w-4 shrink-0 text-stone-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-violet-600" />
                </div>
                <ul className="mt-4 space-y-1 text-[0.95rem] text-stone-600">
                  <li className="flex justify-between border-b border-white/60 py-1.5">
                    <span>Optimal profit</span>
                    <span className="font-semibold text-stone-800">
                      <CountUp value={data.prescriptive.optimalProfit} format={formatCurrency} />
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/60 py-1.5">
                    <span>Naive plan profit</span>
                    <span className="font-semibold text-stone-800">
                      <CountUp value={data.prescriptive.baselineProfit} format={formatCurrency} />
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/60 py-1.5">
                    <span>Improvement</span>
                    <span className="font-semibold text-emerald-700">
                      <CountUp
                        value={data.prescriptive.improvementPercent}
                        format={formatPercent}
                        decimals={1}
                      />
                    </span>
                  </li>
                  <li className="flex justify-between py-1.5">
                    <span>Binding resources</span>
                    <span className="text-right font-semibold text-stone-800">
                      {bindingResources.map((resource) => RESOURCE_LABELS[resource] ?? resource).join(", ") ||
                        "None"}
                    </span>
                  </li>
                </ul>
              </Card>
            </Link>
          </Reveal>
        </div>
      )}

      <Reveal className="mt-6">
        <Card className="relative overflow-hidden border-emerald-300/60 bg-gradient-to-br from-emerald-100/70 via-white/50 to-white/25">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl"
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                <IconCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <CardTitle className="font-display text-xl font-semibold">Conclusion</CardTitle>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-emerald-800/60">
                  The payoff of the three steps
                </p>
              </div>
            </div>

            <p className="mt-4 text-[0.95rem] leading-relaxed text-stone-700">
              Forecasting demand first, then optimizing within limited oven, labor, and flour, lets Bake &amp;
              Batch bake more of what actually earns the most. The prescriptive plan beats the naive
              &quot;a little of everything&quot; schedule, proving the value of connecting all three analytics
              steps.
            </p>

            {data && (
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-emerald-200/60 bg-white/50 px-3.5 py-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-emerald-800/60">
                    Profit uplift
                  </p>
                  <p className="mt-1 text-2xl font-bold leading-tight tracking-tight text-emerald-700 tabular-nums sm:text-3xl">
                    <CountUp
                      value={data.prescriptive.optimalProfit - data.prescriptive.baselineProfit}
                      format={formatCurrency}
                    />
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200/60 bg-white/50 px-3.5 py-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-emerald-800/60">
                    Improvement
                  </p>
                  <p className="mt-1 text-2xl font-bold leading-tight tracking-tight text-emerald-700 tabular-nums sm:text-3xl">
                    <CountUp
                      value={data.prescriptive.improvementPercent}
                      format={formatPercent}
                      decimals={1}
                    />
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200/60 bg-white/50 px-3.5 py-3 sm:col-span-2 xl:col-span-1">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-emerald-800/60">
                    Binding resources
                  </p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-2xl font-bold leading-tight tracking-tight text-emerald-700 tabular-nums sm:text-3xl">
                    <CountUp value={bindingResources.length} format={formatNumber} />
                    <span className="text-[0.68rem] font-semibold text-emerald-800/60">
                      of 3 fully used
                    </span>
                  </p>
                  {bindingResources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {bindingResources.map((resource) => (
                        <span
                          key={resource}
                          className="rounded-full border border-emerald-200/70 bg-emerald-50/80 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-800"
                        >
                          {RESOURCE_LABELS[resource] ?? resource}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </Reveal>
    </div>
  );
}
