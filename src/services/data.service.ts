import { api } from "./api";
import type { RecordCount } from "@/types";

export async function getRecordCounts() {
  const { data } = await api.get<{ data: { minimumRequired: number; tables: RecordCount[] } }>(
    "/data/counts",
  );
  return data.data.tables;
}
