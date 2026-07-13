import { z } from "zod";
import { VisitType } from "../constants/visit.constants";

const MIN_OBSERVATION_LENGTH = 20;
const MAX_OBSERVATION_LENGTH = 2000;

export const scheduleVisitSchema = z.object({
  caseCode: z.string().min(1, "اختيار الحالة إلزامي"),
  volunteerCode: z.string().min(1, "اختيار المتطوع إلزامي"),
  type: z.nativeEnum(VisitType, { errorMap: () => ({ message: "نوع الزيارة غير صحيح" }) }),
  scheduledDate: z
    .string()
    .min(1, "تاريخ الزيارة إلزامي")
    .refine((value) => !Number.isNaN(Date.parse(value)), "صيغة التاريخ غير صحيحة"),
});

export type ScheduleVisitFormValues = z.infer<typeof scheduleVisitSchema>;

export const submitVisitReportSchema = z.object({
  location: z.string().min(3, "الموقع مطلوب").max(300, "الموقع طويل جدًا"),
  observations: z
    .string()
    .min(MIN_OBSERVATION_LENGTH, `الملاحظات يجب ألا تقل عن ${MIN_OBSERVATION_LENGTH} حرفًا`)
    .max(MAX_OBSERVATION_LENGTH, "الملاحظات طويلة جدًا"),
  livingConditions: z.string().min(10, "وصف ظروف المعيشة مطلوب"),
  recommendation: z.string().min(10, "التوصية مطلوبة"),
  eligibilityAssessment: z.enum(["مستحق", "مستحق جزئيًا", "غير مستحق"], {
    errorMap: () => ({ message: "تقييم الاستحقاق مطلوب" }),
  }),
  photoUrls: z.array(z.string().url()).default([]),
});

export type SubmitVisitReportFormValues = z.infer<typeof submitVisitReportSchema>;
