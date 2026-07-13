import { ListQuery, PagedResult } from "@/types/common.types";
import { generateEnterpriseCode, EntityPrefix } from "@/constants/enterprise-coding.constants";
import { Visit, ScheduleVisitInput, SubmitVisitReportInput } from "../types/visit.types";
import { ALLOWED_VISIT_TRANSITIONS, VisitStatus } from "../constants/visit.constants";
import { IVisitRepository } from "./visit.repository";
import { visitRepository } from "./visit.mock-repository";

/**
 * All business rules for visits live here — never in a component or hook.
 * The repository stays a dumb data-access layer; this service is where
 * status-transition rules and domain invariants are enforced.
 */
export class VisitService {
  constructor(private readonly repository: IVisitRepository = visitRepository) {}

  list(query: ListQuery & { caseCode?: string; status?: string }): Promise<PagedResult<Visit>> {
    return this.repository.list(query);
  }

  getByCode(visitCode: string): Promise<Visit | null> {
    return this.repository.getByCode(visitCode);
  }

  async schedule(input: ScheduleVisitInput, actorUserCode: string): Promise<Visit> {
    const sequence = Math.floor(Math.random() * 900000) + 100000; // replaced by a Firestore counter in Sprint 10
    const now = new Date().toISOString();
    const visit: Visit = {
      id: `visit-${sequence}`,
      code: generateEnterpriseCode(EntityPrefix.Visit, sequence),
      caseCode: input.caseCode,
      familyCode: "", // resolved from the Case at write-time once Case service is wired in
      familyHeadName: "",
      volunteerCode: input.volunteerCode,
      volunteerName: "",
      type: input.type,
      status: VisitStatus.Scheduled,
      scheduledDate: input.scheduledDate,
      completedDate: null,
      report: null,
      createdAt: now,
      updatedAt: now,
      createdBy: actorUserCode,
      updatedBy: actorUserCode,
    };
    return this.repository.create(visit);
  }

  /**
   * Business Rule: status can only move along ALLOWED_VISIT_TRANSITIONS.
   * Throws rather than silently ignoring an illegal transition so the UI
   * can surface a clear error instead of showing a stale state.
   */
  async changeStatus(visitCode: string, nextStatus: VisitStatus, actorUserCode: string): Promise<Visit> {
    const current = await this.repository.getByCode(visitCode);
    if (!current) throw new Error(`الزيارة ${visitCode} غير موجودة`);

    const allowed = ALLOWED_VISIT_TRANSITIONS[current.status];
    if (!allowed.includes(nextStatus)) {
      throw new Error(`لا يمكن نقل الزيارة من "${current.status}" إلى "${nextStatus}"`);
    }

    return this.repository.update(visitCode, {
      status: nextStatus,
      updatedBy: actorUserCode,
      completedDate: nextStatus === VisitStatus.Completed ? new Date().toISOString() : current.completedDate,
    });
  }

  /**
   * Business Rule: a report can only be submitted for a visit that is
   * InProgress, and submitting one always transitions the visit to Completed.
   * This is what unlocks Social Research creation for the parent case.
   */
  async submitReport(input: SubmitVisitReportInput, actorUserCode: string): Promise<Visit> {
    const current = await this.repository.getByCode(input.visitCode);
    if (!current) throw new Error(`الزيارة ${input.visitCode} غير موجودة`);
    if (current.status !== VisitStatus.InProgress) {
      throw new Error("لا يمكن رفع تقرير إلا لزيارة قيد التنفيذ");
    }

    return this.repository.update(input.visitCode, {
      status: VisitStatus.Completed,
      completedDate: new Date().toISOString(),
      updatedBy: actorUserCode,
      report: {
        location: input.location,
        observations: input.observations,
        livingConditions: input.livingConditions,
        recommendation: input.recommendation,
        eligibilityAssessment: input.eligibilityAssessment,
        photoUrls: input.photoUrls,
        gpsLatitude: null,
        gpsLongitude: null,
        submittedAt: new Date().toISOString(),
      },
    });
  }
}

export const visitService = new VisitService();
