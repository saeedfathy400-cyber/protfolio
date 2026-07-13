import { BaseEntity } from "@/types/common.types";
import { VisitStatus, VisitType } from "../constants/visit.constants";

export interface Visit extends BaseEntity {
  caseCode: string; // CAS-... — the case this visit belongs to (Database Blueprint: Visits.CaseID)
  familyCode: string; // denormalized for display-only convenience, never edited directly
  familyHeadName: string;
  volunteerCode: string; // VOL-... assigned volunteer
  volunteerName: string;
  type: VisitType;
  status: VisitStatus;
  scheduledDate: string; // ISO 8601
  completedDate?: string | null;

  // Visit Report (populated once status = Completed)
  report?: VisitReport | null;
}

export interface VisitReport {
  location: string;
  observations: string;
  livingConditions: string;
  recommendation: string;
  eligibilityAssessment: "مستحق" | "مستحق جزئيًا" | "غير مستحق";
  photoUrls: string[]; // Firebase Storage URLs once connected
  gpsLatitude?: number | null;
  gpsLongitude?: number | null;
  submittedAt: string;
}

/** Payload for scheduling a new visit — intentionally excludes server-owned fields. */
export interface ScheduleVisitInput {
  caseCode: string;
  volunteerCode: string;
  type: VisitType;
  scheduledDate: string;
}

/** Payload for submitting a completed visit report. */
export interface SubmitVisitReportInput {
  visitCode: string;
  location: string;
  observations: string;
  livingConditions: string;
  recommendation: string;
  eligibilityAssessment: VisitReport["eligibilityAssessment"];
  photoUrls: string[];
}
