import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { ResearchApprovalStatus } from "../constants/socialResearch.constants";

export interface ResearchApprovalPanelProps {
  theme: ThemeMode;
  onDecision: (decision: ResearchApprovalStatus.Approved | ResearchApprovalStatus.RevisionRequested | ResearchApprovalStatus.Rejected, notes: string) => void;
  isSubmitting?: boolean;
}

/**
 * Review widget for Case Managers (Business Process Stage 8). Every
 * decision requires notes — enforced here so a decision is never recorded
 * without a documented reason (Audit Log requirement).
 */
export function ResearchApprovalPanel({ theme, onDecision, isSubmitting }: ResearchApprovalPanelProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleDecision(decision: ResearchApprovalStatus.Approved | ResearchApprovalStatus.RevisionRequested | ResearchApprovalStatus.Rejected): void {
    if (notes.trim().length < 10) {
      setError("يجب توضيح سبب القرار في 10 أحرف على الأقل");
      return;
    }
    setError(null);
    onDecision(decision, notes.trim());
  }

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="reviewNotes" className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>
        ملاحظات المراجعة
      </label>
      <textarea
        id="reviewNotes"
        rows={3}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        className="w-full rounded-xl p-3 text-sm outline-none"
        style={{ background: theme === "dark" ? tokens.background : "#FFFFFF", color: tokens.textPrimary, border: `1px solid ${tokens.border}` }}
      />
      {error && <p role="alert" className="text-xs" style={{ color: tokens.danger }}>{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          disabled={isSubmitting}
          onClick={() => handleDecision(ResearchApprovalStatus.Approved)}
          className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: tokens.success }}
        >
          <CheckCircle2 size={16} /> اعتماد
        </button>
        <button
          disabled={isSubmitting}
          onClick={() => handleDecision(ResearchApprovalStatus.RevisionRequested)}
          className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-semibold disabled:opacity-60"
          style={{ background: tokens.warningLight, color: "#92600A" }}
        >
          <AlertTriangle size={16} /> طلب استكمال
        </button>
        <button
          disabled={isSubmitting}
          onClick={() => handleDecision(ResearchApprovalStatus.Rejected)}
          className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: tokens.danger }}
        >
          <XCircle size={16} /> رفض
        </button>
      </div>
    </div>
  );
}
