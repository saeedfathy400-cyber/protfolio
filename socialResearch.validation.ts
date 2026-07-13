import { useQuery } from "@tanstack/react-query";
import { ListQuery } from "@/types/common.types";
import { socialResearchService } from "../services/socialResearch.service";

export const SOCIAL_RESEARCH_QUERY_KEY = "social-research" as const;

export function useSocialResearchList(query: ListQuery & { caseCode?: string; status?: string }) {
  return useQuery({
    queryKey: [SOCIAL_RESEARCH_QUERY_KEY, query],
    queryFn: () => socialResearchService.list(query),
    staleTime: 30_000,
  });
}
