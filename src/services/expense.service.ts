import { api } from "./api";
import type { Expense, PaginationMeta } from "@/types";

export async function listExpenses(page = 1, limit = 20) {
  const { data } = await api.get<{ data: Expense[]; meta: PaginationMeta }>("/expenses", {
    params: { page, limit },
  });
  return data;
}

export async function createExpense(input: {
  category: string;
  description: string;
  amount: number;
  expenseDate: string;
}) {
  const { data } = await api.post<{ data: Expense }>("/expenses", input);
  return data.data;
}

export async function deleteExpense(id: number) {
  await api.delete(`/expenses/${id}`);
}
