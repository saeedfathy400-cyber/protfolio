import { useQuery } from "@tanstack/react-query";
import { socialResearchService } from "../services/socialResearch.service";

export function useSocialResearch(researchCode: string | undefined) {
  return useQuery({
    queryKey: ["social-research", researchCode],
    queryFn: () => socialResearchService.getByCode(researchCode as string),
    enabled: Boolean(researchCode),
  });
}

export function useSocialResearchVersionHistory(caseCode: string | undefined) {
  return useQuery({
    queryKey: ["social-research-versions", caseCode],
    queryFn: () => socialResearchService.getVersionHistory(caseCode as string),
    enabled: Boolean(caseCode),
  });
}
