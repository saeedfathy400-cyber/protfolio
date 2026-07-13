import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { submitVisitReportSchema, SubmitVisitReportFormValues } from "../validation/visit.validation";

export interface VisitReportFormProps {
  theme: ThemeMode;
  onSubmit: (values: SubmitVisitReportFormValues) => void;
  isSubmitting?: boolean;
}

const ELIGIBILITY_OPTIONS: SubmitVisitReportFormValues["eligibilityAssessment"][] = [
  "مستحق",
  "مستحق جزئيًا",
  "غير مستحق",
];

/**
 * Visit Report form (Business Process, Stage 6). Submitting this form always
 * completes the visit and unlocks Social Research creation for the case —
 * see VisitService.submitReport.
 */
export function VisitReportForm({ theme, onSubmit, isSubmitting }: VisitReportFormProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitVisitReportFormValues>({
    resolver: zodResolver(submitVisitReportSchema),
    defaultValues: { photoUrls: [] },
  });

  const fieldStyle: React.CSSProperties = {
    background: theme === "dark" ? tokens.background : "#FFFFFF",
    color: tokens.textPrimary,
    border: `1px solid ${tokens.border}`,
  };

  function renderError(message?: string): JSX.Element | null {
    return message ? (
      <p role="alert" className="text-xs mt-1" style={{ color: tokens.danger }}>{message}</p>
    ) : null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="location" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>
          موقع الزيارة
        </label>
        <input id="location" {...register("location")} className="w-full h-11 rounded-xl px-3 text-sm outline-none" style={fieldStyle} />
        {renderError(errors.location?.message)}
      </div>

      <div>
        <label htmlFor="observations" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>
          الملاحظات الميدانية
        </label>
        <textarea id="observations" rows={4} {...register("observations")} className="w-full rounded-xl p-3 text-sm outline-none" style={fieldStyle} />
        {renderError(errors.observations?.message)}
      </div>

      <div>
        <label htmlFor="livingConditions" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>
          ظروف المعيشة
        </label>
        <textarea id="livingConditions" rows={3} {...register("livingConditions")} className="w-full rounded-xl p-3 text-sm outline-none" style={fieldStyle} />
        {renderError(errors.livingConditions?.message)}
      </div>

      <div>
        <label htmlFor="eligibilityAssessment" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>
          تقييم الاستحقاق
        </label>
        <select id="eligibilityAssessment" {...register("eligibilityAssessment")} className="w-full h-11 rounded-xl px-3 text-sm outline-none" style={fieldStyle}>
          <option value="">اختر تقييمًا</option>
          {ELIGIBILITY_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {renderError(errors.eligibilityAssessment?.message)}
      </div>

      <div>
        <label htmlFor="recommendation" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>
          التوصية
        </label>
        <textarea id="recommendation" rows={3} {...register("recommendation")} className="w-full rounded-xl p-3 text-sm outline-none" style={fieldStyle} />
        {renderError(errors.recommendation?.message)}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 px-5 rounded-xl text-sm font-semibold text-white self-start disabled:opacity-60"
        style={{ background: tokens.primary }}
      >
        {isSubmitting ? "جارٍ الحفظ..." : "حفظ التقرير وإنهاء الزيارة"}
      </button>
    </form>
  );
}
