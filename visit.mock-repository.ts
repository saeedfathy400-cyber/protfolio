import { ListQuery, PagedResult } from "@/types/common.types";
import { generateEnterpriseCode, EntityPrefix } from "@/constants/enterprise-coding.constants";
import { Visit } from "../types/visit.types";
import { VisitStatus, VisitType } from "../constants/visit.constants";
import { IVisitRepository } from "./visit.repository";

const DEFAULT_PAGE_SIZE = 20;

const FAMILY_HEADS = ["محمد السيد", "أحمد عبدالله", "فاطمة إبراهيم", "مريم حسن", "خالد منصور"];
const VOLUNTEERS = [
  { code: "VOL-SHQ-MQ-2026-000001", name: "سارة فؤاد" },
  { code: "VOL-SHQ-MQ-2026-000002", name: "محمود طه" },
  { code: "VOL-SHQ-MQ-2026-000003", name: "هبة كريم" },
];

function buildSeedVisits(count: number): Visit[] {
  const statuses = Object.values(VisitStatus);
  const types = Object.values(VisitType);
  return Array.from({ length: count }, (_, index) => {
    const sequence = index + 1;
    const status = statuses[sequence % statuses.length];
    const volunteer = VOLUNTEERS[sequence % VOLUNTEERS.length];
    const isCompleted = status === VisitStatus.Completed;
    return {
      id: `visit-${sequence}`,
      code: generateEnterpriseCode(EntityPrefix.Visit, sequence),
      caseCode: generateEnterpriseCode(EntityPrefix.Case, (sequence % 80) + 1),
      familyCode: generateEnterpriseCode(EntityPrefix.Family, (sequence % 60) + 1),
      familyHeadName: FAMILY_HEADS[sequence % FAMILY_HEADS.length],
      volunteerCode: volunteer.code,
      volunteerName: volunteer.name,
      type: types[sequence % types.length],
      status,
      scheduledDate: `2026-07-${String((sequence % 27) + 1).padStart(2, "0")}`,
      completedDate: isCompleted ? `2026-07-${String((sequence % 27) + 1).padStart(2, "0")}` : null,
      report: isCompleted
        ? {
            location: "منزل الأسرة - القرية",
            observations: "تم الاطلاع على ظروف السكن ومقابلة أفراد الأسرة والتأكد من البيانات المقدمة.",
            livingConditions: "منزل من غرفتين، مرافق أساسية متوفرة جزئيًا.",
            recommendation: "التوصية بالموافقة على الحالة وتحويلها للبحث الاجتماعي.",
            eligibilityAssessment: "مستحق",
            photoUrls: [],
            gpsLatitude: null,
            gpsLongitude: null,
            submittedAt: `2026-07-${String((sequence % 27) + 1).padStart(2, "0")}`,
          }
        : null,
      createdAt: "2026-06-01T09:00:00.000Z",
      updatedAt: "2026-06-01T09:00:00.000Z",
      createdBy: "USR-SHQ-MQ-2026-000001",
      updatedBy: "USR-SHQ-MQ-2026-000001",
    };
  });
}

/**
 * In-memory repository used until Sprint 10. Mutates a module-level array so
 * the demo behaves like a real backend across navigations within a session.
 */
export class MockVisitRepository implements IVisitRepository {
  private visits: Visit[] = buildSeedVisits(45);

  async list(query: ListQuery & { caseCode?: string; status?: string }): Promise<PagedResult<Visit>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;

    let filtered = this.visits.filter((visit) => !visit.deletedAt);
    if (query.search) {
      const term = query.search.trim();
      filtered = filtered.filter(
        (visit) =>
          visit.code.includes(term) ||
          visit.familyHeadName.includes(term) ||
          visit.caseCode.includes(term) ||
          visit.volunteerName.includes(term)
      );
    }
    if (query.caseCode) filtered = filtered.filter((visit) => visit.caseCode === query.caseCode);
    if (query.status) filtered = filtered.filter((visit) => visit.status === query.status);

    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  async getByCode(visitCode: string): Promise<Visit | null> {
    return this.visits.find((visit) => visit.code === visitCode) ?? null;
  }

  async create(visit: Visit): Promise<Visit> {
    this.visits = [visit, ...this.visits];
    return visit;
  }

  async update(visitCode: string, changes: Partial<Visit>): Promise<Visit> {
    const index = this.visits.findIndex((visit) => visit.code === visitCode);
    if (index === -1) throw new Error(`الزيارة ${visitCode} غير موجودة`);
    const updated: Visit = { ...this.visits[index], ...changes, updatedAt: new Date().toISOString() };
    this.visits[index] = updated;
    return updated;
  }
}

export const visitRepository: IVisitRepository = new MockVisitRepository();
