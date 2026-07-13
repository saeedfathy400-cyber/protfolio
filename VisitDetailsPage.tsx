import React from "react";
import { ArrowRight, MapPin, User, Calendar } from "lucide-react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useVisit } from "../hooks/useVisit";
import { useChangeVisitStatus, useSubmitVisitReport } from "../hooks/useVisitMutations";
import { VisitReportForm } from "../components/VisitReportForm";
import { VISIT_STATUS_LABELS_AR, VISIT_STATUS_TONE, VISIT_TYPE_LABELS_AR, VisitStatus } from "../constants/visit.constants";

export interface VisitDetailsPageProps {
  theme: ThemeMode;
  visitCode: string;
  onBack: () => void;
}

export function VisitDetailsPage({ theme, visitCode, onBack }: VisitDetailsPageProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const { data: visit, isLoading } = useVisit(visitCode);
  const changeStatus = useChangeVisitStatus();
  const submitReport = useSubmitVisitReport();

  if (isLoading) {
    return <div className="py-10 text-center text-sm" style={{ color: tokens.textSecondary }}>جارٍ التحميل...</div>;
  }

  if (!visit) {
    return <div className="py-10 text-center text-sm" style={{ color: tokens.textSecondary }}>لم يتم العثور على الزيارة.</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold w-fit" style={{ color: tokens.primary }}>
        <ArrowRight size={16} /> العودة لقائمة الزيارات
      </button>

      <div className="rounded-2xl border p-5 flex flex-wrap items-center gap-6" style={{ background: tokens.card, borderColor: tokens.border }}>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-bold" style={{ color: tokens.textPrimary }}>{visit.familyHeadName || "—"}</h2>
          <div className="text-xs mt-1" style={{ color: tokens.textSecondary }}>{visit.code} · حالة {visit.caseCode}</div>
        </div>
        <span className="flex items-center gap-1 text-xs" style={{ color: tokens.textSecondary }}><User size={14} /> {visit.volunteerName}</span>
        <span className="flex items-center gap-1 text-xs" style={{ color: tokens.textSecondary }}><Calendar size={14} /> {visit.scheduledDate}</span>
        <span className="text-xs" style={{ color: tokens.textSecondary }}>{VISIT_TYPE_LABELS_AR[visit.type]}</span>
        <StatusBadge label={VISIT_STATUS_LABELS_AR[visit.status]} tone={VISIT_STATUS_TONE[visit.status]} theme={theme} />
      </div>

      {visit.status === VisitStatus.Scheduled && (
        <div className="rounded-2xl border p-5 flex items-center justify-between" style={{ background: tokens.card, borderColor: tokens.border }}>
          <span className="text-sm" style={{ color: tokens.textPrimary }}>بدء تنفيذ الزيارة الميدانية</span>
          <button
            onClick={() => changeStatus.mutate({ visitCode: visit.code, nextStatus: VisitStatus.InProgress })}
            className="h-10 px-4 rounded-xl text-sm font-semibold text-white"
            style={{ background: tokens.primary }}
          >
            بدء الزيارة
          </button>
        </div>
      )}

      {visit.status === VisitStatus.InProgress && (
        <div className="rounded-2xl border p-5" style={{ background: tokens.card, borderColor: tokens.border }}>
          <h3 className="font-bold mb-4" style={{ color: tokens.textPrimary }}>تقرير الزيارة</h3>
          <VisitReportForm
            theme={theme}
            isSubmitting={submitReport.isPending}
            onSubmit={(values) => submitReport.mutate({ visitCode: visit.code, ...values })}
          />
        </div>
      )}

      {visit.status === VisitStatus.Completed && visit.report && (
        <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: tokens.card, borderColor: tokens.border }}>
          <h3 className="font-bold" style={{ color: tokens.textPrimary }}>تقرير الزيارة المعتمد</h3>
          {[
            ["الموقع", visit.report.location],
            ["الملاحظات", visit.report.observations],
            ["ظروف المعيشة", visit.report.livingConditions],
            ["تقييم الاستحقاق", visit.report.eligibilityAssessment],
            ["التوصية", visit.report.recommendation],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-xs mb-1" style={{ color: tokens.textSecondary }}>{label}</div>
              <div className="text-sm" style={{ color: tokens.textPrimary }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
