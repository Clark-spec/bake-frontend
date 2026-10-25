import { api } from "./api";
import type { PaginationMeta, Promotion } from "@/types";

export async function listPromotions(page = 1, limit = 20) {
  const { data } = await api.get<{ data: Promotion[]; meta: PaginationMeta }>("/promotions", {
    params: { page, limit },
  });
  return data;
}

export async function createPromotion(input: {
  channel: string;
  weekStart: string;
  spend: number;
  note?: string;
}) {
  const { data } = await api.post<{ data: Promotion }>("/promotions", input);
  return data.data;
}

export async function deletePromotion(id: number) {
  await api.delete(`/promotions/${id}`);
}
