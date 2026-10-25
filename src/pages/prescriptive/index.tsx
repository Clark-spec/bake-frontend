import { useState } from "react";
import { usePrescriptive } from "@/hooks/useAnalytics";
import { useFetch } from "@/hooks/useFetch";
import { getPrescriptive } from "@/services/analytics.service";
import { getErrorMessage } from "@/services/api";
import { listResourceLimits, updateResourceLimit } from "@/services/resourceLimit.service";
import { PageHeader } from "@/components/common/PageHeader";
import { StepBadge } from "@/components/analytics/StepBadge";
import { CarriedOverPanel } from "@/components/analytics/CarriedOverPanel";
import { UtilizationBar } from "@/components/analytics/UtilizationBar";
import { BarChartCard } from "@/components/charts/BarChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { Field, Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { ChartSkeleton, KpiGridSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import { Table, Td, Th } from "@/components/ui/table";
import { ErrorState } from "@/components/ui/state";
import {
  IconBox,
  IconCoins,
  IconSave,
  IconSliders,
  IconSparkles,
  IconTrendingUp,
  IconWallet,
} from "@/components/ui/icons";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/format";
import type { PrescriptiveResult } from "@/types";

const RESOURCE_KEYS = ["OVEN_HOURS", "LABOR_HOURS", "FLOUR_KG"] as const;
const RESOURCE_LABELS: Record<string, string> = {
  OVEN_HOURS: "Oven hours",
  LABOR_HOURS: "Labor hours",
  FLOUR_KG: "Flour (kg)",
};

export default function PrescriptivePage() {
  const initial = usePrescriptive();
  const limitsQuery = useFetch(() => listResourceLimits(), "resource-limits");
  const toast = useToast();

  const [override, setOverride] = useState<PrescriptiveResult | null>(null);
  const [inputs, setInputs] = useState<Record<string, string> | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);
  const [confirmOptimize, setConfirmOptimize] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [saving, setSaving] = useState(false);

  const view = override ?? initial.data;
  const capacityValue = (key: string) => inputs?.[key] ?? String(view?.capacities[key] ?? "");

  const optimize = async () => {
    setOptimizing(true);
    setOptimizeError(null);
    try {
      const capacities = Object.fromEntries(RESOURCE_KEYS.map((key) => [key, Number(capacityValue(key) || 0)]));
      const next = await getPrescriptive(capacities);
      setOverride(next);
      setConfirmOptimize(false);
      toast({
        tone: "success",
        title: "Plan optimized",
        description: "The production mix was recalculated with the current capacities.",
      });
    } catch (error) {
      setOptimizeError(getErrorMessage(error));
    } finally {
      setOptimizing(false);
    }
  };

  const saveCapacities = async () => {
    setSaving(true);
    try {
      const limits = limitsQuery.data ?? [];
      await Promise.all(
        RESOURCE_KEYS.map((key) => {
          const limit = limits.find((item) => item.key === key);
          return limit ? updateResourceLimit(limit.id, Number(capacityValue(key) || 0)) : Promise.resolve();
        }),
      );
      limitsQuery.refetch();
      setConfirmSave(false);
      toast({
        tone: "success",
        title: "Capacities saved",
        description: "The monthly resource limits now match the optimizer inputs.",
      });
    } catch (error) {
      toast({
        tone: "error",
        title: "Could not save capacities",
        description: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Step 3 of 3"
        title="Prescriptive Analytics"
        description="What should we do? Optimize the product mix with limited oven, labor, and flour."
      >
        <StepBadge step={3} label="Prescriptive" />
      </PageHeader>

      <Reveal>
        <CarriedOverPanel fromStep={2} title="Monthly demand forecast used as demand limits">
          Each product&apos;s monthly forecast from Step 2 caps how many units can be produced. The optimizer chooses
          the most profitable mix within those caps and the resource limits below.
        </CarriedOverPanel>
      </Reveal>

      {initial.loading && !view && (
        <div className="mt-6 space-y-5" role="status" aria-busy="true">
          <div className="glass rounded-3xl p-5">
            <div className="skeleton h-4 w-56 rounded-full" />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="skeleton h-11 rounded-2xl" />
              <div className="skeleton h-11 rounded-2xl" />
              <div className="skeleton h-11 rounded-2xl" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="skeleton h-11 w-36 rounded-2xl" />
              <div className="skeleton h-11 w-40 rounded-2xl" />
            </div>
          </div>
          <KpiGridSkeleton count={3} />
          <ChartSkeleton height={260} />
          <TableSkeleton rows={5} columns={6} />
        </div>
      )}
      {initial.error && !view && (
        <div className="mt-6"><ErrorState message={initial.error} onRetry={initial.refetch} /></div>
      )}

      {view && (
        <div className="mt-6 space-y-5">
          <Reveal>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/70 bg-white/55 text-amber-700">
                  <IconSliders className="h-4 w-4" />
                </span>
                <CardTitle>Resource capacities</CardTitle>
              </div>
              <Badge variant="warning">Editable</Badge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {RESOURCE_KEYS.map((key) => (
                <Field key={key} label={RESOURCE_LABELS[key]}>
                  <Input
                    type="number"
                    min={0}
                    value={capacityValue(key)}
                    onChange={(event) => setInputs({ ...inputs, [key]: event.target.value })}
                  />
                </Field>
              ))}
            </div>
            {optimizeError && (
              <p className="mt-3 rounded-xl border border-rose-200/70 bg-rose-50/70 px-3 py-2 text-sm text-rose-700">
                {optimizeError}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  setOptimizeError(null);
                  setConfirmOptimize(true);
                }}
                loading={optimizing}
              >
                {!optimizing && <IconSparkles className="h-4 w-4" />}
                {optimizing ? "Optimizing…" : "Optimize plan"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setConfirmSave(true)}
                disabled={!limitsQuery.data || saving}
              >
                <IconSave className="h-4 w-4" />
                Save capacities
              </Button>
              <span className="text-xs text-stone-400">Optimize recalculates · Save writes to the database</span>
            </div>
          </Card>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            <Reveal delay={110}>
              <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/80 hover:bg-amber-50/25 hover:shadow-[0_30px_60px_-34px_rgba(180,83,9,0.55)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-amber-300/30 blur-2xl transition-transform duration-500 group-hover:scale-125"
                />
                <div className="relative flex items-start justify-between gap-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Optimal profit
                  </p>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/70 bg-white/55 text-amber-700 transition-colors duration-300 group-hover:border-amber-200/80 group-hover:bg-amber-50/80">
                    <IconCoins className="h-5 w-5" />
                  </span>
                </div>
                <p className="relative mt-3 text-[1.9rem] font-bold leading-none tracking-tight text-amber-700 tabular-nums">
                  <CountUp value={view.optimalProfit} format={formatCurrency} delay={110} />
                </p>
                <p className="relative mt-2 text-sm text-stone-500">Best mix within demand and capacity limits</p>
              </Card>
            </Reveal>
            <Reveal delay={160}>
              <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-300/70 hover:bg-stone-50/30 hover:shadow-[0_30px_60px_-34px_rgba(41,37,36,0.4)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-stone-300/30 blur-2xl transition-transform duration-500 group-hover:scale-125"
                />
                <div className="relative flex items-start justify-between gap-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Naive plan profit
                  </p>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/70 bg-white/55 text-stone-500 transition-colors duration-300 group-hover:border-stone-300/80 group-hover:bg-stone-100/70">
                    <IconWallet className="h-5 w-5" />
                  </span>
                </div>
                <p className="relative mt-3 text-[1.9rem] font-bold leading-none tracking-tight text-stone-700 tabular-nums">
                  <CountUp value={view.baselineProfit} format={formatCurrency} delay={160} />
                </p>
                <p className="relative mt-2 text-sm text-stone-500">A little of everything, unoptimized</p>
              </Card>
            </Reveal>
            <Reveal delay={210}>
              <Card className="group relative h-full overflow-hidden border-emerald-300/60 bg-gradient-to-br from-emerald-100/70 via-white/50 to-white/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-50/25 hover:shadow-[0_30px_60px_-34px_rgba(4,120,87,0.5)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-300/25 blur-2xl transition-transform duration-500 group-hover:scale-125"
                />
                <div className="relative flex items-start justify-between gap-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-800">
                    Improvement
                  </p>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl border border-emerald-200/70 bg-emerald-50/80 text-emerald-700">
                    <IconTrendingUp className="h-5 w-5" />
                  </span>
                </div>
                <p className="relative mt-3 text-[1.9rem] font-bold leading-none tracking-tight text-emerald-700 tabular-nums">
                  <CountUp value={view.improvement.amount} format={formatCurrency} delay={210} />
                </p>
                <p className="relative mt-2 text-sm text-emerald-800/70">
                  <CountUp
                    value={view.improvement.percent}
                    format={formatPercent}
                    decimals={1}
                  />{" "}
                  better than the naive plan
                </p>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <BarChartCard
              title="Profit: naive plan vs optimal plan"
              data={[
                { name: "Naive plan", profit: view.baselineProfit },
                { name: "Optimal plan", profit: view.optimalProfit },
              ]}
              xKey="name"
              barKey="profit"
              name="Profit"
              colorful
              height={240}
              valueFormatter={(value) => formatCurrency(value)}
            />
          </Reveal>

          <Reveal>
            <Card>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/70 bg-white/55 text-violet-700">
                  <IconBox className="h-4 w-4" />
                </span>
                <CardTitle>Optimal production plan</CardTitle>
              </div>
              <div className="mt-4">
                <Table>
                  <thead>
                    <tr>
                      <Th>Product</Th>
                      <Th className="text-right">Forecast demand</Th>
                      <Th className="text-right">Optimal units</Th>
                      <Th className="text-right">Naive units</Th>
                      <Th className="text-right">Unit margin</Th>
                      <Th className="text-right">Profit</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.plan.map((row) => (
                      <tr key={row.productId}>
                        <Td className="font-medium text-stone-800">{row.product}</Td>
                        <Td className="text-right tabular-nums">{formatNumber(row.forecastDemand)}</Td>
                        <Td className="text-right font-semibold tabular-nums text-amber-700">
                          {formatNumber(row.optimalUnits)}
                        </Td>
                        <Td className="text-right tabular-nums">{formatNumber(row.baselineUnits)}</Td>
                        <Td className="text-right tabular-nums">{formatCurrency(row.unitMargin)}</Td>
                        <Td className="text-right font-medium tabular-nums text-stone-800">
                          {formatCurrency(row.profit)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>Resource utilization</CardTitle>
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Binding = fully used
                </span>
              </div>
              <div className="mt-5 space-y-5">
                {view.resourceUsage.map((usage, index) => (
                  <UtilizationBar key={usage.key} usage={usage} delay={index * 130} />
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      )}

      <ConfirmDialog
        open={confirmOptimize}
        title="Optimize production plan?"
        description={
          <div className="space-y-3">
            <p>The optimizer will recalculate the most profitable production mix using these monthly capacities:</p>
            <dl className="rounded-2xl border border-white/70 bg-white/50 p-3">
              {RESOURCE_KEYS.map((key) => (
                <div key={key} className="flex items-center justify-between py-0.5 text-sm">
                  <dt className="text-stone-500">{RESOURCE_LABELS[key]}</dt>
                  <dd className="font-semibold tabular-nums text-stone-800">
                    {formatNumber(Number(capacityValue(key) || 0), 1)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-xs leading-relaxed text-stone-500">
              This updates the plan on screen only — use Save capacities to store these limits in the database.
            </p>
            {optimizeError && (
              <p className="rounded-xl border border-rose-200/70 bg-rose-50/70 px-3 py-2 text-sm text-rose-700">
                {optimizeError}
              </p>
            )}
          </div>
        }
        confirmLabel="Optimize plan"
        loading={optimizing}
        onConfirm={optimize}
        onCancel={() => setConfirmOptimize(false)}
      />

      <ConfirmDialog
        open={confirmSave}
        title="Save resource capacities?"
        description={
          <div className="space-y-3">
            <p>These values will replace the monthly limits used by the optimizer.</p>
            <dl className="rounded-2xl border border-white/70 bg-white/50 p-3">
              {RESOURCE_KEYS.map((key) => (
                <div key={key} className="flex items-center justify-between py-0.5 text-sm">
                  <dt className="text-stone-500">{RESOURCE_LABELS[key]}</dt>
                  <dd className="font-semibold tabular-nums text-stone-800">
                    {formatNumber(Number(capacityValue(key) || 0), 1)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        }
        confirmLabel="Save capacities"
        loading={saving}
        onConfirm={saveCapacities}
        onCancel={() => setConfirmSave(false)}
      />
    </div>
  );
}
