import { ListQuery, PagedResult } from "@/types/common.types";
import { generateEnterpriseCode, EntityPrefix } from "@/constants/enterprise-coding.constants";
import { SocialResearch } from "../types/socialResearch.types";
import { ResearchApprovalStatus } from "../constants/socialResearch.constants";
import { ISocialResearchRepository } from "./socialResearch.repository";

const DEFAULT_PAGE_SIZE = 20;
const RESEARCHERS = [
  { code: "USR-SHQ-MQ-2026-000004", name: "هبة كريم" },
  { code: "USR-SHQ-MQ-2026-000005", name: "محمود طه" },
];

function buildSeedResearch(count: number): SocialResearch[] {
  const statuses = Object.values(ResearchApprovalStatus);
  return Array.from({ length: count }, (_, index) => {
    const sequence = index + 1;
    const researcher = RESEARCHERS[sequence % RESEARCHERS.length];
    return {
      id: `research-${sequence}`,
      code: generateEnterpriseCode(EntityPrefix.SocialResearch, sequence),
      caseCode: generateEnterpriseCode(EntityPrefix.Case, (sequence % 80) + 1),
      familyCode: generateEnterpriseCode(EntityPrefix.Family, (sequence % 60) + 1),
      researcherCode: researcher.code,
      researcherName: researcher.name,
      sourceVisitCode: generateEnterpriseCode(EntityPrefix.Visit, (sequence % 45) + 1),
      version: 1,
      incomeAnalysis: "دخل الأسرة غير منتظم ويعتمد على عمل يومي غير ثابت.",
      expensesAnalysis: "المصروفات الشهرية تتجاوز الدخل بسبب الالتزامات العلاجية.",
      housingCondition: "منزل إيجار من غرفتين بحالة متوسطة.",
      healthAssessment: "وجود حالة مرضية مزمنة لدى رب الأسرة تستلزم متابعة دورية.",
      educationAssessment: "الأبناء ملتحقون بالتعليم الحكومي بانتظام.",
      recommendation: "التوصية باعتماد الحالة ونشرها للتبرع بأولوية متوسطة.",
      approvalStatus: statuses[sequence % statuses.length],
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
      createdAt: "2026-06-15T10:00:00.000Z",
      updatedAt: "2026-06-15T10:00:00.000Z",
      createdBy: researcher.code,
      updatedBy: researcher.code,
    };
  });
}

export class MockSocialResearchRepository implements ISocialResearchRepository {
  private records: SocialResearch[] = buildSeedResearch(30);

  async list(query: ListQuery & { caseCode?: string; status?: string }): Promise<PagedResult<SocialResearch>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;

    let filtered = this.records.filter((record) => !record.deletedAt);
    if (query.search) {
      const term = query.search.trim();
      filtered = filtered.filter((record) => record.code.includes(term) || record.caseCode.includes(term));
    }
    if (query.caseCode) filtered = filtered.filter((record) => record.caseCode === query.caseCode);
    if (query.status) filtered = filtered.filter((record) => record.approvalStatus === query.status);

    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
  }

  async getByCode(researchCode: string): Promise<SocialResearch | null> {
    return this.records.find((record) => record.code === researchCode) ?? null;
  }

  async listVersionsByCase(caseCode: string): Promise<SocialResearch[]> {
    return this.records
      .filter((record) => record.caseCode === caseCode)
      .sort((a, b) => b.version - a.version);
  }

  async create(research: SocialResearch): Promise<SocialResearch> {
    this.records = [research, ...this.records];
    return research;
  }

  async update(researchCode: string, changes: Partial<SocialResearch>): Promise<SocialResearch> {
    const index = this.records.findIndex((record) => record.code === researchCode);
    if (index === -1) throw new Error(`البحث الاجتماعي ${researchCode} غير موجود`);
    const updated = { ...this.records[index], ...changes, updatedAt: new Date().toISOString() };
    this.records[index] = updated;
    return updated;
  }
}

export const socialResearchRepository: ISocialResearchRepository = new MockSocialResearchRepository();
