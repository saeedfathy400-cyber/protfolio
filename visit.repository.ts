import { z } from "zod";
import { ResearchApprovalStatus } from "../constants/socialResearch.constants";

const MIN_SECTION_LENGTH = 15;

export const createSocialResearchSchema = z.object({
  caseCode: z.string().min(1, "كود الحالة إلزامي"),
  sourceVisitCode: z.string().min(1, "لا يمكن إنشاء بحث اجتماعي بدون زيارة مكتملة"),
  incomeAnalysis: z.string().min(MIN_SECTION_LENGTH, "تحليل الدخل مطلوب بتفصيل كافٍ"),
  expensesAnalysis: z.string().min(MIN_SECTION_LENGTH, "تحليل المصروفات مطلوب بتفصيل كافٍ"),
  housingCondition: z.string().min(MIN_SECTION_LENGTH, "وصف حالة السكن مطلوب"),
  healthAssessment: z.string().min(MIN_SECTION_LENGTH, "التقييم الصحي مطلوب"),
  educationAssessment: z.string().min(MIN_SECTION_LENGTH, "التقييم التعليمي مطلوب"),
  recommendation: z.string().min(MIN_SECTION_LENGTH, "التوصية النهائية مطلوبة"),
});

export type CreateSocialResearchFormValues = z.infer<typeof createSocialResearchSchema>;

export const reviewSocialResearchSchema = z.object({
  researchCode: z.string().min(1),
  decision: z.enum([
    ResearchApprovalStatus.Approved,
    ResearchApprovalStatus.RevisionRequested,
    ResearchApprovalStatus.Rejected,
  ]),
  reviewNotes: z.string().min(10, "يجب توضيح سبب القرار في 10 أحرف على الأقل"),
});

export type ReviewSocialResearchFormValues = z.infer<typeof reviewSocialResearchSchema>;
