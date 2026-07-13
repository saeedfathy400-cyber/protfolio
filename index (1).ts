import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socialResearchService } from "../services/socialResearch.service";
import { CreateSocialResearchInput, ReviewSocialResearchInput } from "../types/socialResearch.types";
import { SOCIAL_RESEARCH_QUERY_KEY } from "./useSocialResearchList";

// Replaced by the authenticated user's identity from AuthContext (Sprint 1) once wired in.
const CURRENT_ACTOR_CODE = "USR-SHQ-MQ-2026-000004";
const CURRENT_ACTOR_NAME = "هبة كريم";

export function useCreateSocialResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSocialResearchInput) =>
      socialResearchService.create(input, CURRENT_ACTOR_CODE, CURRENT_ACTOR_NAME),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: [SOCIAL_RESEARCH_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["social-research-versions", created.caseCode] });
    },
  });
}

export function useReviewSocialResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReviewSocialResearchInput) => socialResearchService.review(input, CURRENT_ACTOR_CODE),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: [SOCIAL_RESEARCH_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["social-research", updated.code] });
      queryClient.invalidateQueries({ queryKey: ["social-research-versions", updated.caseCode] });
    },
  });
}
