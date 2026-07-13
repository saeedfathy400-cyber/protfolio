import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { scheduleVisitSchema, ScheduleVisitFormValues } from "../validation/visit.validation";
import { useScheduleVisit } from "../hooks/useVisitMutations";
import { VISIT_TYPE_LABELS_AR, VisitType } from "../constants/visit.constants";

export interface NewVisitPageProps {
  theme: ThemeMode;
  onScheduled: () => void;
  onCancel: () => void;
}

export function NewVisitPage({ theme, onScheduled, onCancel }: NewVisitPageProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const scheduleVisit = useScheduleVisit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScheduleVisitFormValues>({ resolver: zodResolver(scheduleVisitSchema) });

  const fieldStyle: React.CSSProperties = {
    background: theme === "dark" ? tokens.background : "#FFFFFF",
    color: tokens.textPrimary,
    border: `1px solid ${tokens.border}`,
  };

  function onSubmit(values: ScheduleVisitFormValues): void {
    scheduleVisit.mutate(values, { onSuccess: onScheduled });
  }

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <button onClick={onCancel} className="flex items-center gap-2 text-sm font-semibold w-fit" style={{ color: tokens.primary }}>
        <ArrowRight size={16} /> إلغاء
      </button>
      <div className="rounded-2xl border p-5" style={{ background: tokens.card, borderColor: tokens.border }}>
        <h2 className="font-bold mb-4" style={{ color: tokens.textPrimary }}>جدولة زيارة ميدانية</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="caseCode" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>كود الحالة</label>
            <input id="caseCode" placeholder="CAS-SHQ-MQ-2026-000001" {...register("caseCode")} className="w-full h-11 rounded-xl px-3 text-sm outline-none" style={fieldStyle} />
            {errors.caseCode && <p role="alert" className="text-xs mt-1" style={{ color: tokens.danger }}>{errors.caseCode.message}</p>}
          </div>
          <div>
            <label htmlFor="volunteerCode" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>المتطوع المسؤول</label>
            <input id="volunteerCode" placeholder="VOL-SHQ-MQ-2026-000001" {...register("volunteerCode")} className="w-full h-11 rounded-xl px-3 text-sm outline-none" style={fieldStyle} />
            {errors.volunteerCode && <p role="alert" className="text-xs mt-1" style={{ color: tokens.danger }}>{errors.volunteerCode.message}</p>}
          </div>
          <div>
            <label htmlFor="type" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>نوع الزيارة</label>
            <select id="type" {...register("type")} className="w-full h-11 rounded-xl px-3 text-sm outline-none" style={fieldStyle}>
              <option value="">اختر نوعًا</option>
              {Object.values(VisitType).map((type) => (
                <option key={type} value={type}>{VISIT_TYPE_LABELS_AR[type]}</option>
              ))}
            </select>
            {errors.type && <p role="alert" className="text-xs mt-1" style={{ color: tokens.danger }}>{errors.type.message}</p>}
          </div>
          <div>
            <label htmlFor="scheduledDate" className="text-sm font-semibold block mb-1" style={{ color: tokens.textPrimary }}>تاريخ الزيارة</label>
            <input id="scheduledDate" type="date" {...register("scheduledDate")} className="w-full h-11 rounded-xl px-3 text-sm outline-none" style={fieldStyle} />
            {errors.scheduledDate && <p role="alert" className="text-xs mt-1" style={{ color: tokens.danger }}>{errors.scheduledDate.message}</p>}
          </div>
          <button
            type="submit"
            disabled={scheduleVisit.isPending}
            className="h-11 px-5 rounded-xl text-sm font-semibold text-white self-start disabled:opacity-60"
            style={{ background: tokens.primary }}
          >
            {scheduleVisit.isPending ? "جارٍ الحفظ..." : "جدولة الزيارة"}
          </button>
        </form>
      </div>
    </div>
  );
}
