import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { Wizard, WizardStep } from "@/components/common/Wizard";
import { createSocialResearchSchema, CreateSocialResearchFormValues } from "../validation/socialResearch.validation";

export interface ResearchFormProps {
  theme: ThemeMode;
  caseCode: string;
  sourceVisitCode: string;
  onSubmit: (values: CreateSocialResearchFormValues) => void;
}

const SECTION_FIELDS = [
  { key: "incomeAnalysis", label: "تحليل الدخل", hint: "مصادر الدخل، انتظامها، ومدى كفايتها." },
  { key: "expensesAnalysis", label: "تحليل المصروفات", hint: "المصروفات الشهرية والالتزامات والديون." },
  { key: "housingCondition", label: "حالة السكن", hint: "نوع السكن، عدد الغرف، المرافق المتوفرة." },
  { key: "healthAssessment", label: "التقييم الصحي", hint: "الحالات المرضية أو الإعاقات داخل الأسرة." },
  { key: "educationAssessment", label: "التقييم التعليمي", hint: "الوضع التعليمي لأبناء الأسرة." },
  { key: "recommendation", label: "التوصية النهائية", hint: "توصية الباحث الاجتماعي بشأن استحقاق الحالة." },
] as const;

/**
 * Social Research form — Business Process Stage 7. Uses the shared Wizard
 * component (introduced this sprint) rather than a flat form, matching the
 * Design Bible rule that any large form is broken into steps.
 */
export function ResearchForm({ theme, caseCode, sourceVisitCode, onSubmit }: ResearchFormProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSocialResearchFormValues>({
    resolver: zodResolver(createSocialResearchSchema),
    defaultValues: { caseCode, sourceVisitCode },
  });

  const fieldStyle: React.CSSProperties = {
    background: theme === "dark" ? tokens.background : "#FFFFFF",
    color: tokens.textPrimary,
    border: `1px solid ${tokens.border}`,
  };

  const steps: WizardStep[] = SECTION_FIELDS.map((section) => ({
    key: section.key,
    label: section.label,
    validate: () => {
      const value = getValues(section.key);
      return value && value.length >= 15 ? null : `${section.label} مطلوب بتفصيل لا يقل عن 15 حرفًا`;
    },
    content: (
      <div>
        <label htmlFor={section.key} className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>
          {section.label}
        </label>
        <p className="text-xs mb-2" style={{ color: tokens.textSecondary }}>{section.hint}</p>
        <textarea
          id={section.key}
          rows={5}
          {...register(section.key)}
          className="w-full rounded-xl p-3 text-sm outline-none"
          style={fieldStyle}
        />
        {errors[section.key] && (
          <p role="alert" className="text-xs mt-1" style={{ color: tokens.danger }}>{errors[section.key]?.message}</p>
        )}
      </div>
    ),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Wizard theme={theme} steps={steps} completeLabel="إرسال البحث الاجتماعي للمراجعة" onComplete={() => trigger().then((valid) => valid && handleSubmit(onSubmit)())} />
    </form>
  );
}
