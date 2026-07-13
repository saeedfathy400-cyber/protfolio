import React from "react";
import { ArrowRight } from "lucide-react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSocialResearch, useSocialResearchVersionHistory } from "../hooks/useSocialResearch";
import { useReviewSocialResearch } from "../hooks/useSocialResearchMutations";
import { ResearchApprovalPanel } from "../components/ResearchApprovalPanel";
import { RESEARCH_STATUS_LABELS_AR, RESEARCH_STATUS_TONE, ResearchApprovalStatus } from "../constants/socialResearch.constants";

export interface SocialResearchDetailsPageProps {
  theme: ThemeMode;
  researchCode: string;
  onBack: () => void;
}

const SECTIONS: { key: keyof import("../types/socialResearch.types").SocialResearch; label: string }[] = [
  { key: "incomeAnalysis", label: "تحليل الدخل" },
  { key: "expensesAnalysis", label: "تحليل المصروفات" },
  { key: "housingCondition", label: "حالة السكن" },
  { key: "healthAssessment", label: "التقييم الصحي" },
  { key: "educationAssessment", label: "التقييم التعليمي" },
  { key: "recommendation", label: "التوصية النهائية" },
];

export function SocialResearchDetailsPage({ theme, researchCode, onBack }: SocialResearchDetailsPageProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const { data: research, isLoading } = useSocialResearch(researchCode);
  const { data: versions } = useSocialResearchVersionHistory(research?.caseCode);
  const review = useReviewSocialResearch();

  if (isLoading) return <div className="py-10 text-center text-sm" style={{ color: tokens.textSecondary }}>جارٍ التحميل...</div>;
  if (!research) return <div className="py-10 text-center text-sm" style={{ color: tokens.textSecondary }}>لم يتم العثور على البحث الاجتماعي.</div>;

  const isReviewable =
    research.approvalStatus === ResearchApprovalStatus.Submitted ||
    research.approvalStatus === ResearchApprovalStatus.UnderReview;

  return (
    <div className="flex flex-col gap-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold w-fit" style={{ color: tokens.primary }}>
        <ArrowRight size={16} /> العودة لقائمة الأبحاث
      </button>

      <div className="rounded-2xl border p-5 flex flex-wrap items-center gap-6" style={{ background: tokens.card, borderColor: tokens.border }}>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-bold" style={{ color: tokens.textPrimary }}>{research.code}</h2>
          <div className="text-xs mt-1" style={{ color: tokens.textSecondary }}>حالة {research.caseCode} · الإصدار #{research.version} · الباحث: {research.researcherName}</div>
        </div>
        <StatusBadge label={RESEARCH_STATUS_LABELS_AR[research.approvalStatus]} tone={RESEARCH_STATUS_TONE[research.approvalStatus]} theme={theme} />
      </div>

      {versions && versions.length > 1 && (
        <div className="rounded-2xl border p-5" style={{ background: tokens.card, borderColor: tokens.border }}>
          <h3 className="font-bold mb-3 text-sm" style={{ color: tokens.textPrimary }}>سجل الإصدارات لهذه الحالة</h3>
          <div className="flex flex-col gap-2">
            {versions.map((version) => (
              <div key={version.code} className="flex items-center justify-between text-xs py-2" style={{ borderBottom: `1px solid ${tokens.border}` }}>
                <span style={{ color: tokens.textPrimary }}>الإصدار #{version.version} · {version.code}</span>
                <StatusBadge label={RESEARCH_STATUS_LABELS_AR[version.approvalStatus]} tone={RESEARCH_STATUS_TONE[version.approvalStatus]} theme={theme} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border p-5 flex flex-col gap-4" style={{ background: tokens.card, borderColor: tokens.border }}>
        {SECTIONS.map((section) => (
          <div key={section.key}>
            <div className="text-xs mb-1" style={{ color: tokens.textSecondary }}>{section.label}</div>
            <div className="text-sm" style={{ color: tokens.textPrimary }}>{String(research[section.key])}</div>
          </div>
        ))}
      </div>

      {isReviewable && (
        <div className="rounded-2xl border p-5" style={{ background: tokens.card, borderColor: tokens.border }}>
          <h3 className="font-bold mb-3" style={{ color: tokens.textPrimary }}>قرار المراجعة</h3>
          <ResearchApprovalPanel
            theme={theme}
            isSubmitting={review.isPending}
            onDecision={(decision, notes) => review.mutate({ researchCode: research.code, decision, reviewNotes: notes })}
          />
        </div>
      )}

      {research.reviewNotes && (
        <div className="rounded-2xl border p-5" style={{ background: tokens.card, borderColor: tokens.border }}>
          <div className="text-xs mb-1" style={{ color: tokens.textSecondary }}>ملاحظات المراجعة السابقة</div>
          <div className="text-sm" style={{ color: tokens.textPrimary }}>{research.reviewNotes}</div>
        </div>
      )}
    </div>
  );
}
