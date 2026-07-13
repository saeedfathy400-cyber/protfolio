import React from "react";
import { MapPin, User, Calendar } from "lucide-react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Visit } from "../types/visit.types";
import { VISIT_STATUS_LABELS_AR, VISIT_STATUS_TONE, VISIT_TYPE_LABELS_AR } from "../constants/visit.constants";

export interface VisitCardProps {
  theme: ThemeMode;
  visit: Visit;
  onClick?: (visit: Visit) => void;
}

export function VisitCard({ theme, visit, onClick }: VisitCardProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  return (
    <button
      type="button"
      onClick={() => onClick?.(visit)}
      className="text-right rounded-2xl border p-4 flex flex-col gap-3 w-full transition-transform hover:-translate-y-0.5"
      style={{ background: tokens.card, borderColor: tokens.border }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: tokens.textSecondary }}>{visit.code}</span>
        <StatusBadge label={VISIT_STATUS_LABELS_AR[visit.status]} tone={VISIT_STATUS_TONE[visit.status]} theme={theme} />
      </div>
      <div className="font-bold" style={{ color: tokens.textPrimary }}>{visit.familyHeadName || "—"}</div>
      <div className="text-xs" style={{ color: tokens.textSecondary }}>{VISIT_TYPE_LABELS_AR[visit.type]} · حالة {visit.caseCode}</div>
      <div className="flex items-center gap-4 text-xs pt-2" style={{ borderTop: `1px solid ${tokens.border}`, color: tokens.textSecondary }}>
        <span className="flex items-center gap-1"><User size={13} /> {visit.volunteerName || "غير معيّن"}</span>
        <span className="flex items-center gap-1"><Calendar size={13} /> {visit.scheduledDate}</span>
      </div>
    </button>
  );
}
