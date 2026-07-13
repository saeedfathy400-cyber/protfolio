import { ListQuery, PagedResult } from "@/types/common.types";
import { SocialResearch } from "../types/socialResearch.types";

export interface ISocialResearchRepository {
  list(query: ListQuery & { caseCode?: string; status?: string }): Promise<PagedResult<SocialResearch>>;
  getByCode(researchCode: string): Promise<SocialResearch | null>;
  /** All versions for a given case, newest first — powers the version history view. */
  listVersionsByCase(caseCode: string): Promise<SocialResearch[]>;
  create(research: SocialResearch): Promise<SocialResearch>;
  update(researchCode: string, changes: Partial<SocialResearch>): Promise<SocialResearch>;
}
