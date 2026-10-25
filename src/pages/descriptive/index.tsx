import { useDescriptive } from "@/hooks/useAnalytics";
import { PageHeader } from "@/components/common/PageHeader";
import { StepBadge } from "@/components/analytics/StepBadge";
import { NextStepLink } from "@/components/analytics/NextStepLink";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { Card, CardTitle } from "@/components/ui/card";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { Table, Td, Th } from "@/components/ui/table";
import { ChartSkeleton, KpiGridSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import {
  IconBox,
  IconCalendar,
  IconCoins,
  IconReceipt,
  IconSparkles,
  IconUsers,
} from "@/components/ui/icons";
import { formatCurrency, formatDate, formatNumber } from "@/utils/format";

export default function DescriptivePage() {
  const { data, loading, error, refetch } = useDescriptive();
  const topProduct = data?.revenueByProduct[0] ?? null;
  const busiestChannel = data?.ordersByChannel[0] ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Step 1 of 3"
        title="Descriptive Analytics"
        description="What happened? Summaries and statistics of past sales."
      >
        <StepBadge step={1} label="Descriptive" />
      </PageHeader>

      {loading && (
        <div className="space-y-6" role="status" aria-busy="true">
          <KpiGridSkeleton count={3} />
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartSkeleton height={300} />
            <ChartSkeleton height={300} />
          </div>
          <TableSkeleton rows={5} columns={6} />
          <TableSkeleton rows={4} columns={3} />
        </div>
      )}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Reveal delay={60} className="h-full">
              <KpiCard
                label="Total revenue"
                value={<CountUp value={data.kpis.totalRevenue} format={formatCurrency} delay={60} />}
                hint="All recorded sales"
                icon={<IconCoins className="h-5 w-5" />}
                accent
              />
            </Reveal>
            <Reveal delay={110} className="h-full">
              <KpiCard
                label="Total units"
                value={<CountUp value={data.kpis.totalUnits} format={formatNumber} delay={110} />}
                hint="Across all products"
                icon={<IconBox className="h-5 w-5" />}
              />
            </Reveal>
            <Reveal
              delay={160}
              className="h-full sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)] xl:col-span-1 xl:mx-0 xl:w-auto"
            >
              <KpiCard
                label="Total orders"
                value={<CountUp value={data.kpis.totalOrders} format={formatNumber} delay={160} />}
                hint="Completed transactions"
                icon={<IconReceipt className="h-5 w-5" />}
              />
            </Reveal>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal delay={100}>
              <LineChartCard
                title="Revenue by week"
                data={data.revenueByWeek}
                xKey="weekStart"
                series={[{ key: "revenue", name: "Revenue", color: "#b45309" }]}
                valueFormatter={(value) => formatCurrency(value)}
              />
            </Reveal>
            <Reveal delay={150}>
              <BarChartCard
                title="Revenue by product"
                data={data.revenueByProduct}
                xKey="product"
                barKey="revenue"
                name="Revenue"
                colorful
                valueFormatter={(value) => formatCurrency(value)}
              />
            </Reveal>
          </div>

          <Reveal>
            <Card>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/70 bg-white/55 text-amber-700">
                  <IconBox className="h-4 w-4" />
                </span>
                <CardTitle>Weekly units per product — mean, median, standard deviation</CardTitle>
              </div>
              <div className="mt-4">
                <Table>
                  <thead>
                    <tr>
                      <Th>Product</Th>
                      <Th>Category</Th>
                      <Th className="text-right">Weeks</Th>
                      <Th className="text-right">Mean</Th>
                      <Th className="text-right">Median</Th>
                      <Th className="text-right">Std Dev</Th>
                      <Th className="text-right">Min</Th>
                      <Th className="text-right">Max</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.productStats.map((row) => (
                      <tr key={row.productId}>
                        <Td className="font-medium text-stone-800">{row.product}</Td>
                        <Td>
                          <span className="rounded-full border border-white/70 bg-white/50 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                            {row.category}
                          </span>
                        </Td>
                        <Td className="text-right tabular-nums">{row.weeks}</Td>
                        <Td className="text-right tabular-nums">{formatNumber(row.mean, 1)}</Td>
                        <Td className="text-right tabular-nums">{formatNumber(row.median, 1)}</Td>
                        <Td className="text-right tabular-nums">{formatNumber(row.stdDev, 1)}</Td>
                        <Td className="text-right tabular-nums">{formatNumber(row.min)}</Td>
                        <Td className="text-right tabular-nums">{formatNumber(row.max)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/70 bg-white/55 text-teal-700">
                  <IconUsers className="h-4 w-4" />
                </span>
                <CardTitle>Top 5 customers by total order amount</CardTitle>
              </div>
              <div className="mt-4">
                <Table>
                  <thead>
                    <tr>
                      <Th>Customer</Th>
                      <Th>Area</Th>
                      <Th className="text-right">Total amount</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topCustomers.map((row) => (
                      <tr key={row.customerId}>
                        <Td className="font-medium text-stone-800">{row.customer}</Td>
                        <Td>{row.area}</Td>
                        <Td className="text-right tabular-nums">{formatCurrency(row.totalAmount)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card className="relative overflow-hidden border-amber-300/50 bg-gradient-to-br from-amber-100/70 via-white/45 to-white/25">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-orange-300/15 blur-3xl"
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-500/20">
                    <IconSparkles className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-amber-800/70">
                      The story in the data
                    </p>
                    <CardTitle className="font-display text-xl font-semibold">What we learned</CardTitle>
                  </div>
                </div>

                <p className="mt-3 text-[0.95rem] leading-relaxed text-stone-700">
                  Knowing which products earn the most and when demand peaks gives the forecast in Step 2 a solid
                  baseline.
                </p>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                  <div className="relative rounded-2xl border border-amber-200/70 bg-white/55 px-3.5 py-3">
                    <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg bg-amber-100/80 text-amber-700">
                      <IconCoins className="h-3.5 w-3.5" />
                    </span>
                    <p className="pr-9 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-amber-800/70">
                      Top product
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-stone-800">
                      {topProduct?.product ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold tabular-nums text-amber-700">
                      {topProduct ? (
                        <CountUp value={topProduct.revenue} format={formatCurrency} delay={80} />
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>

                  <div className="relative rounded-2xl border border-amber-200/70 bg-white/55 px-3.5 py-3">
                    <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg bg-amber-100/80 text-amber-700">
                      <IconReceipt className="h-3.5 w-3.5" />
                    </span>
                    <p className="pr-9 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-amber-800/70">
                      Busiest channel
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-stone-800">
                      {busiestChannel?.channel ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold tabular-nums text-amber-700">
                      {busiestChannel ? (
                        <>
                          <CountUp value={busiestChannel.count} format={formatNumber} delay={160} /> orders
                        </>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>

                  <div className="relative rounded-2xl border border-amber-200/70 bg-white/55 px-3.5 py-3">
                    <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-lg bg-amber-100/80 text-amber-700">
                      <IconCalendar className="h-3.5 w-3.5" />
                    </span>
                    <p className="pr-9 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-amber-800/70">
                      Best week
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-stone-800">
                      {formatDate(data.bestWeek.weekStart)}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold tabular-nums text-amber-700">
                      <CountUp value={data.bestWeek.revenue} format={formatCurrency} delay={240} />
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <NextStepLink to="/predictive" label="Predictive" />
          </Reveal>
        </div>
      )}
    </div>
  );
}
