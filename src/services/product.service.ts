import { api } from "./api";
import type { Product } from "@/types";

export async function listProducts() {
  const { data } = await api.get<{ data: Product[] }>("/products");
  return data.data;
}
