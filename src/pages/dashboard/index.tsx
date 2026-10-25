import { useCallback, useState } from "react";
import { useDescriptive } from "@/hooks/useAnalytics";
import { useFetch } from "@/hooks/useFetch";
import { listProducts } from "@/services/product.service";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar, type DashboardFilters } from "@/components/dashboard/FilterBar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { KpiDetailDialog, type KpiMetric } from "@/components/dashboard/KpiDetailDialog";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { PieChartCard } from "@/components/charts/PieChartCard";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { ChartSkeleton, KpiGridSkeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state";
import {
  IconBox,
  IconChartBars,
  IconCoins,
  IconReceipt,
  IconTrendingUp,
  IconWallet,
} from "@/components/ui/icons";
import { formatCurrency, formatNumber } from "@/utils/format";

const EMPTY_FILTERS: DashboardFilters = { from: "", to: "", productId: "" };

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS);
  const [detailMetric, setDetailMetric] = useState<KpiMetric | null>(null);
  const closeDetail = useCallback(() => setDetailMetric(null), []);
  const productsQuery = useFetch(() => listProducts(), "products");
  const { data, loading, error, refetch } = useDescriptive({
    from: filters.from || undefined,
    to: filters.to || undefined,
    productId: filters.productId ? Number(filters.productId) : undefined,
  });

  return (
    <div>
      <PageHeader
        eyebrow="Graphical output of all 5 variables"
        title="Dashboard"
        description="Revenue, orders, customers, expenses, and promotions at a glance. Filter the data below."
      />

      <Reveal delay={60}>
        <FilterBar
          filters={filters}
          products={productsQuery.data ?? []}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      </Reveal>

      {loading && (
        <div className="mt-6 space-y-4" role="status" aria-busy="true">
          <KpiGridSkeleton count={6} />
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <ChartSkeleton key={index} height={300} />
            ))}
          </div>
        </div>
      )}
      {error && <div className="mt-6"><ErrorState message={error} onRetry={refetch} /></div>}

      {data && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Reveal delay={120} className="h-full">
              <KpiCard
                label="Total revenue"
                value={<CountUp value={data.kpis.totalRevenue} format={formatCurrency} delay={120} />}
                hint="All recorded sales"
                icon={<IconCoins className="h-5 w-5" />}
                onClick={() => setDetailMetric("revenue")}
                accent
              />
            </Reveal>
            <Reveal delay={170} className="h-full">
              <KpiCard
                label="Total units sold"
                value={<CountUp value={data.kpis.totalUnits} format={formatNumber} delay={170} />}
                hint="Across all products"
                icon={<IconBox className="h-5 w-5" />}
                onClick={() => setDetailMetric("units")}
              />
            </Reveal>
            <Reveal delay={220} className="h-full">
              <KpiCard
                label="Orders"
                value={<CountUp value={data.kpis.totalOrders} format={formatNumber} delay={220} />}
                hint="Completed transactions"
                icon={<IconReceipt className="h-5 w-5" />}
                onClick={() => setDetailMetric("orders")}
              />
            </Reveal>
            <Reveal delay={270} className="h-full">
              <KpiCard
                label="Average order value"
                value={<CountUp value={data.kpis.averageOrderValue} format={formatCurrency} delay={270} />}
                hint="Average per order"
                icon={<IconChartBars className="h-5 w-5" />}
                onClick={() => setDetailMetric("aov")}
              />
            </Reveal>
            <Reveal delay={320} className="h-full">
              <KpiCard
                label="Total expenses"
                value={<CountUp value={data.kpis.totalExpenses} format={formatCurrency} delay={320} />}
                hint="COGS + overhead"
                icon={<IconWallet className="h-5 w-5" />}
                onClick={() => setDetailMetric("expenses")}
              />
            </Reveal>
            <Reveal delay={370} className="h-full">
              <KpiCard
                label="Estimated net profit"
                value={<CountUp value={data.kpis.estimatedNetProfit} format={formatCurrency} delay={370} />}
                hint="Revenue − expenses"
                icon={<IconTrendingUp className="h-5 w-5" />}
                onClick={() => setDetailMetric("profit")}
              />
            </Reveal>
          </div>

          <KpiDetailDialog metric={detailMetric} data={data} onClose={closeDetail} />

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Reveal delay={120}>
              <LineChartCard
                title="Weekly revenue trend (Weekly Sales)"
                data={data.revenueByWeek}
                xKey="weekStart"
                series={[{ key: "revenue", name: "Revenue", color: "#b45309" }]}
                valueFormatter={(value) => formatCurrency(value)}
              />
            </Reveal>
            <Reveal delay={170}>
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
            <Reveal delay={220}>
              <PieChartCard
                title="Customers by type"
                data={data.customersByType.map((row) => ({ name: row.type, value: row.count }))}
              />
            </Reveal>
            <Reveal delay={270}>
              <BarChartCard
                title="Orders by channel"
                data={data.ordersByChannel}
                xKey="channel"
                barKey="count"
                name="Orders"
                colorful
              />
            </Reveal>
            <Reveal delay={320}>
              <BarChartCard
                title="Expenses by category"
                data={data.expensesByCategory}
                xKey="category"
                barKey="amount"
                name="Amount"
                colorful
                valueFormatter={(value) => formatCurrency(value)}
              />
            </Reveal>
            <Reveal delay={370}>
              <BarChartCard
                title="Promotion spend by channel"
                data={data.promotionSpendByChannel}
                xKey="channel"
                barKey="spend"
                name="Spend"
                colorful
                valueFormatter={(value) => formatCurrency(value)}
              />
            </Reveal>
          </div>
        </>
      )}

      {!loading && !error && data && data.revenueByWeek.length === 0 && (
        <div className="mt-6">
          <EmptyState
            message="No data for the selected filters."
            hint="Try widening the date range or choosing all products."
          />
        </div>
      )}
    </div>
  );
}
