import { ListQuery, PagedResult } from "@/types/common.types";
import { generateEnterpriseCode, EntityPrefix } from "@/constants/enterprise-coding.constants";
import { visitService } from "@/features/visits/services/visit.service";
import { VisitStatus } from "@/features/visits/constants/visit.constants";
import { SocialResearch, CreateSocialResearchInput, ReviewSocialResearchInput } from "../types/socialResearch.types";
import { ALLOWED_RESEARCH_TRANSITIONS, ResearchApprovalStatus } from "../constants/socialResearch.constants";
import { ISocialResearchRepository } from "./socialResearch.repository";
import { socialResearchRepository } from "./socialResearch.mock-repository";

/**
 * All Social Research business rules live here:
 *  1. A research record can only be created from a Completed visit
 *     (Business Process Document, Stage 7).
 *  2. Each new record for a case is a new VERSION, never an overwrite —
 *     the version number is derived from `listVersionsByCase`.
 *  3. Approval decisions follow ALLOWED_RESEARCH_TRANSITIONS strictly.
 */
export class SocialResearchService {
  constructor(private readonly repository: ISocialResearchRepository = socialResearchRepository) {}

  list(query: ListQuery & { caseCode?: string; status?: string }): Promise<PagedResult<SocialResearch>> {
    return this.repository.list(query);
  }

  getByCode(researchCode: string): Promise<SocialResearch | null> {
    return this.repository.getByCode(researchCode);
  }

  getVersionHistory(caseCode: string): Promise<SocialResearch[]> {
    return this.repository.listVersionsByCase(caseCode);
  }

  async create(input: CreateSocialResearchInput, actorUserCode: string, actorName: string): Promise<SocialResearch> {
    const sourceVisit = await visitService.getByCode(input.sourceVisitCode);
    if (!sourceVisit) throw new Error(`الزيارة ${input.sourceVisitCode} غير موجودة`);
    if (sourceVisit.status !== VisitStatus.Completed) {
      throw new Error("لا يمكن إنشاء بحث اجتماعي إلا من زيارة مكتملة");
    }

    const previousVersions = await this.repository.listVersionsByCase(input.caseCode);
    const nextVersion = previousVersions.length > 0 ? previousVersions[0].version + 1 : 1;
    const sequence = Math.floor(Math.random() * 900000) + 100000; // replaced by a Firestore counter in Sprint 10
    const now = new Date().toISOString();

    const research: SocialResearch = {
      id: `research-${sequence}`,
      code: generateEnterpriseCode(EntityPrefix.SocialResearch, sequence),
      caseCode: input.caseCode,
      familyCode: sourceVisit.familyCode,
      researcherCode: actorUserCode,
      researcherName: actorName,
      sourceVisitCode: input.sourceVisitCode,
      version: nextVersion,
      incomeAnalysis: input.incomeAnalysis,
      expensesAnalysis: input.expensesAnalysis,
      housingCondition: input.housingCondition,
      healthAssessment: input.healthAssessment,
      educationAssessment: input.educationAssessment,
      recommendation: input.recommendation,
      approvalStatus: ResearchApprovalStatus.Submitted,
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
      createdAt: now,
      updatedAt: now,
      createdBy: actorUserCode,
      updatedBy: actorUserCode,
    };

    return this.repository.create(research);
  }

  /**
   * Business Rule: Reviewer decision. Moves Submitted/UnderReview research
   * to a terminal state (Approved / RevisionRequested / Rejected). This
   * feeds the Case's VerificationStatus once Cases and Social Research
   * are wired together at the Case 360 layer.
   */
  async review(input: ReviewSocialResearchInput, reviewerUserCode: string): Promise<SocialResearch> {
    const current = await this.repository.getByCode(input.researchCode);
    if (!current) throw new Error(`البحث الاجتماعي ${input.researchCode} غير موجود`);

    const effectiveCurrentStatus =
      current.approvalStatus === ResearchApprovalStatus.Submitted
        ? ResearchApprovalStatus.UnderReview
        : current.approvalStatus;

    const allowed = ALLOWED_RESEARCH_TRANSITIONS[effectiveCurrentStatus];
    if (!allowed.includes(input.decision)) {
      throw new Error(`لا يمكن نقل البحث الاجتماعي من "${effectiveCurrentStatus}" إلى "${input.decision}"`);
    }

    return this.repository.update(input.researchCode, {
      approvalStatus: input.decision,
      reviewedBy: reviewerUserCode,
      reviewedAt: new Date().toISOString(),
      reviewNotes: input.reviewNotes,
    });
  }
}

export const socialResearchService = new SocialResearchService();
