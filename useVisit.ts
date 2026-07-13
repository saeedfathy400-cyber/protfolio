import { useQuery } from "@tanstack/react-query";
import { visitService } from "../services/visit.service";

export function useVisit(visitCode: string | undefined) {
  return useQuery({
    queryKey: ["visit", visitCode],
    queryFn: () => visitService.getByCode(visitCode as string),
    enabled: Boolean(visitCode),
  });
}
