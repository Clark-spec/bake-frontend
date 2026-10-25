import { api } from "./api";
import type { ResourceLimit } from "@/types";

export async function listResourceLimits() {
  const { data } = await api.get<{ data: ResourceLimit[] }>("/resource-limits");
  return data.data;
}

export async function updateResourceLimit(id: number, monthlyCapacity: number) {
  const { data } = await api.put<{ data: ResourceLimit }>(`/resource-limits/${id}`, {
    monthlyCapacity,
  });
  return data.data;
}
