import { api } from "./api";
import type { CaseSummaryResult, DescriptiveResult, PredictiveResult, PrescriptiveResult } from "@/types";

export interface DescriptiveFilters {
  from?: string;
  to?: string;
  productId?: number;
}

export async function getDescriptive(filters: DescriptiveFilters = {}) {
  const { data } = await api.get<{ data: DescriptiveResult }>("/analytics/descriptive", {
    params: filters,
  });
  return data.data;
}

export async function getPredictive(horizon = 4) {
  const { data } = await api.get<{ data: PredictiveResult }>("/analytics/predictive", {
    params: { horizon },
  });
  return data.data;
}

export async function getPrescriptive(capacities?: Record<string, number>) {
  const { data } = await api.post<{ data: PrescriptiveResult }>("/analytics/prescriptive", {
    capacities,
  });
  return data.data;
}

export async function getCaseSummary() {
  const { data } = await api.get<{ data: CaseSummaryResult }>("/analytics/case-summary");
  return data.data;
}
