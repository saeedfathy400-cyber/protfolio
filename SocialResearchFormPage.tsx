import React from "react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SocialResearch } from "../types/socialResearch.types";
import { RESEARCH_STATUS_LABELS_AR, RESEARCH_STATUS_TONE } from "../constants/socialResearch.constants";

export interface ResearchCardProps {
  theme: ThemeMode;
  research: SocialResearch;
  onClick?: (research: SocialResearch) => void;
}

export function ResearchCard({ theme, research, onClick }: ResearchCardProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  return (
    <button
      type="button"
      onClick={() => onClick?.(research)}
      className="text-right rounded-2xl border p-4 flex flex-col gap-2 w-full transition-transform hover:-translate-y-0.5"
      style={{ background: tokens.card, borderColor: tokens.border }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: tokens.textSecondary }}>{research.code}</span>
        <StatusBadge
          label={RESEARCH_STATUS_LABELS_AR[research.approvalStatus]}
          tone={RESEARCH_STATUS_TONE[research.approvalStatus]}
          theme={theme}
        />
      </div>
      <div className="font-bold" style={{ color: tokens.textPrimary }}>حالة {research.caseCode}</div>
      <div className="text-xs" style={{ color: tokens.textSecondary }}>
        الإصدار رقم {research.version} · الباحث: {research.researcherName}
      </div>
    </button>
  );
}
