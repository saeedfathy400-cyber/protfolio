import { BaseEntity } from "@/types/common.types";
import { ResearchApprovalStatus } from "../constants/socialResearch.constants";

/**
 * Business Rule: Social Research is versioned per case. Each new research
 * cycle (e.g. family circumstances changed, or a prior one was sent back
 * for revision) creates a NEW record with an incremented `version` rather
 * than mutating the previous one — full history is preserved.
 */
export interface SocialResearch extends BaseEntity {
  caseCode: string;
  familyCode: string;
  researcherCode: string; // VOL-... or USR-... who conducted the research
  researcherName: string;
  sourceVisitCode: string; // the completed Visit this research was created from
  version: number; // 1, 2, 3... per case

  incomeAnalysis: string;
  expensesAnalysis: string;
  housingCondition: string;
  healthAssessment: string;
  educationAssessment: string;
  recommendation: string;

  approvalStatus: ResearchApprovalStatus;
  reviewedBy?: string | null; // USR-...
  reviewedAt?: string | null;
  reviewNotes?: string | null;
}

export interface CreateSocialResearchInput {
  caseCode: string;
  sourceVisitCode: string;
  incomeAnalysis: string;
  expensesAnalysis: string;
  housingCondition: string;
  healthAssessment: string;
  educationAssessment: string;
  recommendation: string;
}

export interface ReviewSocialResearchInput {
  researchCode: string;
  decision: ResearchApprovalStatus.Approved | ResearchApprovalStatus.RevisionRequested | ResearchApprovalStatus.Rejected;
  reviewNotes: string;
}
