import { api } from "./api";
import type { PaginationMeta, WeeklySale } from "@/types";

export async function listWeeklySales(page = 1, limit = 20) {
  const { data } = await api.get<{ data: WeeklySale[]; meta: PaginationMeta }>("/weekly-sales", {
    params: { page, limit },
  });
  return data;
}

export async function createWeeklySale(input: { productId: number; weekStart: string; unitsSold: number }) {
  const { data } = await api.post<{ data: WeeklySale }>("/weekly-sales", input);
  return data.data;
}

export async function deleteWeeklySale(id: number) {
  await api.delete(`/weekly-sales/${id}`);
}
