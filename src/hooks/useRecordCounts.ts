import { useFetch } from "./useFetch";
import { getRecordCounts } from "@/services/data.service";

export function useRecordCounts() {
  return useFetch(() => getRecordCounts(), "record-counts");
}
