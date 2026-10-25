import { useMemo, useState } from "react";
import { usePredictive } from "@/hooks/useAnalytics";
import { PageHeader } from "@/components/common/PageHeader";
import { StepBadge } from "@/components/analytics/StepBadge";
import { CarriedOverPanel } from "@/components/analytics/CarriedOverPanel";
import { NextStepLink } from "@/components/analytics/NextStepLink";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { Card, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Field } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { IconCalendar, IconSparkles, IconTrendingUp } from "@/components/ui/icons";
import { formatNumber, formatPercent } from "@/utils/format";
import { cn } from "@/lib/cn";
import type { ForecastModelName } from "@/types";

const MODEL_LABELS: Record<ForecastModelName, string> = {
  MOVING_AVERAGE: "Moving average (3 wk)",
  EXP_SMOOTHING: "Exponential smoothing (0.3)",
  LINEAR_TREND: "Linear trend",
};

export default function PredictivePage() {
  const { data, loading, error, refetch } = usePredictive(4);
  const [productId, setProductId] = useState<number | null>(null);
  const [modelName, setModelName] = useState<ForecastModelName | null>(null);

  const product = data?.products.find((item) => item.productId === productId) ?? data?.products[0] ?? null;
  const activeModel =
    product?.models.find((model) => model.name === modelName) ??
    product?.models.find((model) => model.name === product.bestModel) ??
    product?.models[0] ??
    null;

  const chartData = useMemo(() => {
    if (!product || !activeModel) return [];
    const rows: Array<Record<string, string | number>> = product.history.map((point) => ({
      week: point.weekStart,
      actual: point.units,
    }));
    const last = product.history[product.history.length - 1]?.weekStart;
    if (last) {
      activeModel.forecast.forEach((value, index) => {
        const date = new Date(last);
        date.setDate(date.getDate() + (index + 1) * 7);
        rows.push({ week: date.toISOString().slice(0, 10), forecast: value });
      });
    }
    return rows;
  }, [product, activeModel]);

  return (
    <div>
      <PageHeader
        eyebrow="Step 2 of 3"
        title="Predictive Analytics"
        description="What will happen? Forecast weekly demand with three models and pick the best by MAPE."
      >
        <StepBadge step={2} label="Predictive" />
      </PageHeader>

      <Reveal>
        <CarriedOverPanel fromStep={1} title="Weekly sales history per product">
          The 52 weekly unit totals from Step 1 are the time series used to fit each forecasting model. The last 8
          weeks are held out for validation.
        </CarriedOverPanel>
      </Reveal>

      {loading && (
        <div className="mt-6 space-y-5" role="status" aria-busy="true">
          <div className="glass rounded-3xl p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="skeleton h-11 rounded-2xl" />
              <div className="skeleton h-11 rounded-2xl" />
            </div>
          </div>
          <ChartSkeleton height={340} />
          <div className="grid gap-4 lg:grid-cols-2">
            <TableSkeleton rows={3} columns={5} />
            <TableSkeleton rows={5} columns={4} />
          </div>
        </div>
      )}
      {error && <div className="mt-6"><ErrorState message={error} onRetry={refetch} /></div>}

      {data && product && (
        <div className="mt-6 space-y-5">
          <Card className="animate-fade-up p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Product">
                <Select
                  value={product.productId}
                  onChange={(event) => setProductId(Number(event.target.value))}
                >
                  {data.products.map((item) => (
                    <option key={item.productId} value={item.productId}>
                      {item.product}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Forecast model">
                <Select
                  value={activeModel?.name ?? ""}
                  onChange={(event) => setModelName(event.target.value as ForecastModelName)}
                >
                  {product.models.map((model) => (
                    <option key={model.name} value={model.name}>
                      {MODEL_LABELS[model.name]} (MAPE {model.mape}%)
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Card>

          <Reveal delay={80}>
            <LineChartCard
              title={`${product.product}: actuals and ${activeModel ? MODEL_LABELS[activeModel.name] : ""} forecast`}
              data={chartData}
              xKey="week"
              zoomToData
              series={[
                { key: "actual", name: "Actual units", color: "#57534e" },
                { key: "forecast", name: "Forecast", color: "#b45309", dashed: true },
              ]}
            />
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal delay={130} className="h-full">
              <Card className="flex h-full min-w-0 flex-col">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/70 bg-white/55 text-teal-700">
                    <IconTrendingUp className="h-4 w-4" />
                  </span>
                  <CardTitle className="min-w-0">
                    Model comparison — MAPE on the last {data.validationWeeks} weeks
                  </CardTitle>
                </div>

                <div className="mt-4 space-y-2.5 2xl:hidden">
                  {product.models.map((model) => {
                    const isBest = model.name === product.bestModel;
                    return (
                      <div
                        key={model.name}
                        className={cn(
                          "group relative min-w-0 overflow-hidden rounded-2xl border p-3.5 pl-4 transition-all duration-300 hover:-translate-y-0.5",
                          isBest
                            ? "border-emerald-300/70 bg-emerald-50/60 hover:border-emerald-400/80 hover:bg-emerald-50/90 hover:shadow-[0_18px_36px_-24px_rgba(4,120,87,0.5)]"
                            : "border-white/60 bg-white/45 hover:border-amber-300/80 hover:bg-amber-50/70 hover:shadow-[0_18px_36px_-24px_rgba(180,83,9,0.45)]",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-y-3 left-0 w-[3px] rounded-full bg-gradient-to-b opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                            isBest ? "from-emerald-400 to-teal-500" : "from-amber-400 to-orange-500",
                          )}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                          <p className="min-w-0 flex-1 text-sm font-semibold text-stone-800">
                            {MODEL_LABELS[model.name]}
                          </p>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-xs tabular-nums text-stone-500">MAPE {model.mape}%</span>
                            {isBest && <Badge variant="success">Best</Badge>}
                          </div>
                        </div>
                        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                          {model.forecast.map((value, index) => (
                            <div key={index} className="rounded-lg bg-white/65 px-1 py-1 text-center">
                              <p className="text-[0.6rem] uppercase tracking-wide text-stone-400">
                                Wk {index + 1}
                              </p>
                              <p className="text-xs font-medium tabular-nums text-stone-700">
                                {formatNumber(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-stone-500">
                          4-week total{" "}
                          <span className="font-semibold tabular-nums text-stone-800">
                            {formatNumber(model.forecast.reduce((sum, value) => sum + value, 0))}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 hidden 2xl:block">
                  <Table>
                    <thead>
                      <tr>
                        <Th>Model</Th>
                        <Th className="text-right">MAPE</Th>
                        <Th className="text-right">Next 4 weeks</Th>
                        <Th className="text-right">4-wk total</Th>
                        <Th className="text-right">Result</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.models.map((model) => (
                        <tr key={model.name}>
                          <Td className="font-medium text-stone-800">{MODEL_LABELS[model.name]}</Td>
                          <Td className="text-right tabular-nums">{model.mape}%</Td>
                          <Td className="text-right align-top">
                            <div className="ml-auto flex w-fit flex-col gap-0.5 text-sm tabular-nums text-stone-600">
                              {model.forecast.map((value, index) => (
                                <span key={index}>{formatNumber(value)}</span>
                              ))}
                            </div>
                          </Td>
                          <Td className="text-right font-semibold tabular-nums">
                            {formatNumber(model.forecast.reduce((sum, value) => sum + value, 0))}
                          </Td>
                          <Td className="text-right">
                            {model.name === product.bestModel ? (
                              <Badge variant="success">Best</Badge>
                            ) : (
                              <span className="text-sm text-stone-400">—</span>
                            )}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <p className="mt-auto pt-4 text-sm leading-relaxed text-stone-500">
                  Lower MAPE (mean absolute percentage error) means a better fit. The best model is refit on all
                  weeks to produce the demand limit for Step 3.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={180} className="h-full">
              <Card className="flex h-full min-w-0 flex-col">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/70 bg-white/55 text-violet-700">
                    <IconCalendar className="h-4 w-4" />
                  </span>
                  <CardTitle className="min-w-0">
                    Monthly forecast for all products (next {data.horizon} weeks)
                  </CardTitle>
                </div>

                <div className="mt-4 space-y-2.5 2xl:hidden">
                  {data.products.map((item) => (
                    <div
                      key={item.productId}
                      className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/60 bg-white/45 p-3.5 pl-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/80 hover:bg-amber-50/70 hover:shadow-[0_18px_36px_-24px_rgba(180,83,9,0.45)]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-gradient-to-b from-amber-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-stone-800">{item.product}</p>
                          <p className="mt-0.5 text-xs text-stone-500">
                            {MODEL_LABELS[item.bestModel]} · MAPE {formatPercent(item.bestMape)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold tabular-nums text-stone-900 transition-colors duration-300 group-hover:text-amber-800">
                            {formatNumber(item.monthlyForecast)}
                          </p>
                          <p className="text-[0.6rem] uppercase tracking-wide text-stone-400">units / mo</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 hidden 2xl:block">
                  <Table>
                    <thead>
                      <tr>
                        <Th>Product</Th>
                        <Th>Best model</Th>
                        <Th className="text-right">MAPE</Th>
                        <Th className="text-right">Monthly forecast</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.products.map((item) => (
                        <tr key={item.productId}>
                          <Td className="font-medium text-stone-800">{item.product}</Td>
                          <Td className="text-sm text-stone-500">{MODEL_LABELS[item.bestModel]}</Td>
                          <Td className="text-right tabular-nums">{formatPercent(item.bestMape)}</Td>
                          <Td className="text-right font-semibold tabular-nums">
                            {formatNumber(item.monthlyForecast)}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <p className="mt-auto flex items-center gap-2 pt-4 text-sm text-stone-500">
                  <IconSparkles className="h-4 w-4 shrink-0 text-amber-600" />
                  These monthly totals become the demand limits in Step 3.
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <CarriedOverPanel fromStep={2} title="Monthly demand forecast used as the demand limit">
              The total forecast units above become the maximum this bakery should bake per product next month.
            </CarriedOverPanel>
          </Reveal>

          <Reveal delay={80}>
            <NextStepLink to="/prescriptive" label="Prescriptive" />
          </Reveal>
        </div>
      )}
    </div>
  );
}
