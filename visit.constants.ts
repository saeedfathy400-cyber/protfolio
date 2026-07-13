export enum VisitStatus {
  Scheduled = "Scheduled",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
  Rescheduled = "Rescheduled",
}

export enum VisitType {
  InitialAssessment = "InitialAssessment",
  FollowUp = "FollowUp",
  Emergency = "Emergency",
  Verification = "Verification",
}

export const VISIT_STATUS_LABELS_AR: Record<VisitStatus, string> = {
  [VisitStatus.Scheduled]: "مجدولة",
  [VisitStatus.InProgress]: "جارية",
  [VisitStatus.Completed]: "مكتملة",
  [VisitStatus.Cancelled]: "ملغاة",
  [VisitStatus.Rescheduled]: "معاد جدولتها",
};

export const VISIT_TYPE_LABELS_AR: Record<VisitType, string> = {
  [VisitType.InitialAssessment]: "زيارة تقييم أولي",
  [VisitType.FollowUp]: "زيارة متابعة",
  [VisitType.Emergency]: "زيارة طارئة",
  [VisitType.Verification]: "زيارة تحقق",
};

/** Badge tone mapping — reused by VisitCard and the Visits list table. */
export const VISIT_STATUS_TONE: Record<VisitStatus, "info" | "warning" | "success" | "danger" | "secondary"> = {
  [VisitStatus.Scheduled]: "info",
  [VisitStatus.InProgress]: "warning",
  [VisitStatus.Completed]: "success",
  [VisitStatus.Cancelled]: "danger",
  [VisitStatus.Rescheduled]: "secondary",
};

/**
 * Business Rule: allowed status transitions. Enforced in VisitService,
 * not in the UI, so the rule can never be bypassed by a different screen.
 */
export const ALLOWED_VISIT_TRANSITIONS: Record<VisitStatus, VisitStatus[]> = {
  [VisitStatus.Scheduled]: [VisitStatus.InProgress, VisitStatus.Cancelled, VisitStatus.Rescheduled],
  [VisitStatus.InProgress]: [VisitStatus.Completed, VisitStatus.Cancelled],
  [VisitStatus.Completed]: [],
  [VisitStatus.Cancelled]: [VisitStatus.Rescheduled],
  [VisitStatus.Rescheduled]: [VisitStatus.Scheduled],
};
