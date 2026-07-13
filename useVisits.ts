import { useQuery } from "@tanstack/react-query";
import { ListQuery } from "@/types/common.types";
import { visitService } from "../services/visit.service";

export const VISITS_QUERY_KEY = "visits" as const;

export function useVisits(query: ListQuery & { caseCode?: string; status?: string }) {
  return useQuery({
    queryKey: [VISITS_QUERY_KEY, query],
    queryFn: () => visitService.list(query),
    staleTime: 30_000,
  });
}
