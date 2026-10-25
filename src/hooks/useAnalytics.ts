import { useFetch } from "./useFetch";
import {
  getCaseSummary,
  getDescriptive,
  getPredictive,
  getPrescriptive,
  type DescriptiveFilters,
} from "@/services/analytics.service";

export function useDescriptive(filters: DescriptiveFilters = {}) {
  const key = `descriptive:${filters.from ?? ""}:${filters.to ?? ""}:${filters.productId ?? ""}`;
  return useFetch(() => getDescriptive(filters), key);
}

export function usePredictive(horizon = 4) {
  return useFetch(() => getPredictive(horizon), `predictive:${horizon}`);
}

export function usePrescriptive() {
  return useFetch(() => getPrescriptive(), "prescriptive");
}

export function useCaseSummary() {
  return useFetch(() => getCaseSummary(), "case-summary");
}
