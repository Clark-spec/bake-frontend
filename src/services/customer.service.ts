import { api } from "./api";
import type { Customer, PaginationMeta } from "@/types";

export async function listCustomers(page = 1, limit = 20) {
  const { data } = await api.get<{ data: Customer[]; meta: PaginationMeta }>("/customers", {
    params: { page, limit },
  });
  return data;
}

export async function createCustomer(input: { name: string; type: string; area: string }) {
  const { data } = await api.post<{ data: Customer }>("/customers", input);
  return data.data;
}

export async function deleteCustomer(id: number) {
  await api.delete(`/customers/${id}`);
}
