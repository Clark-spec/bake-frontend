import { api } from "./api";
import type { Order, PaginationMeta } from "@/types";

export async function listOrders(page = 1, limit = 20) {
  const { data } = await api.get<{ data: Order[]; meta: PaginationMeta }>("/orders", {
    params: { page, limit },
  });
  return data;
}

export async function createOrder(input: {
  customerId: number;
  productId: number;
  quantity: number;
  channel: string;
  orderDate: string;
}) {
  const { data } = await api.post<{ data: Order }>("/orders", input);
  return data.data;
}

export async function deleteOrder(id: number) {
  await api.delete(`/orders/${id}`);
}
