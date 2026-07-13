export enum ResearchApprovalStatus {
  Draft = "Draft",
  Submitted = "Submitted",
  UnderReview = "UnderReview",
  Approved = "Approved",
  RevisionRequested = "RevisionRequested",
  Rejected = "Rejected",
}

export const RESEARCH_STATUS_LABELS_AR: Record<ResearchApprovalStatus, string> = {
  [ResearchApprovalStatus.Draft]: "مسودة",
  [ResearchApprovalStatus.Submitted]: "بانتظار المراجعة",
  [ResearchApprovalStatus.UnderReview]: "قيد المراجعة",
  [ResearchApprovalStatus.Approved]: "معتمد",
  [ResearchApprovalStatus.RevisionRequested]: "يتطلب استكمال",
  [ResearchApprovalStatus.Rejected]: "مرفوض",
};

export const RESEARCH_STATUS_TONE: Record<ResearchApprovalStatus, "info" | "warning" | "success" | "danger" | "secondary"> = {
  [ResearchApprovalStatus.Draft]: "secondary",
  [ResearchApprovalStatus.Submitted]: "warning",
  [ResearchApprovalStatus.UnderReview]: "info",
  [ResearchApprovalStatus.Approved]: "success",
  [ResearchApprovalStatus.RevisionRequested]: "warning",
  [ResearchApprovalStatus.Rejected]: "danger",
};

/**
 * Business Rule: allowed approval-status transitions, enforced in
 * SocialResearchService. A Rejected or Approved research is terminal —
 * any further change requires creating a NEW versioned record.
 */
export const ALLOWED_RESEARCH_TRANSITIONS: Record<ResearchApprovalStatus, ResearchApprovalStatus[]> = {
  [ResearchApprovalStatus.Draft]: [ResearchApprovalStatus.Submitted],
  [ResearchApprovalStatus.Submitted]: [ResearchApprovalStatus.UnderReview],
  [ResearchApprovalStatus.UnderReview]: [
    ResearchApprovalStatus.Approved,
    ResearchApprovalStatus.RevisionRequested,
    ResearchApprovalStatus.Rejected,
  ],
  [ResearchApprovalStatus.Approved]: [],
  [ResearchApprovalStatus.RevisionRequested]: [],
  [ResearchApprovalStatus.Rejected]: [],
};
