import React from "react";
import { ArrowRight } from "lucide-react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { ResearchForm } from "../components/ResearchForm";
import { useCreateSocialResearch } from "../hooks/useSocialResearchMutations";

export interface SocialResearchFormPageProps {
  theme: ThemeMode;
  caseCode: string;
  sourceVisitCode: string;
  onCreated: () => void;
  onCancel: () => void;
}

export function SocialResearchFormPage({ theme, caseCode, sourceVisitCode, onCreated, onCancel }: SocialResearchFormPageProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const createResearch = useCreateSocialResearch();

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <button onClick={onCancel} className="flex items-center gap-2 text-sm font-semibold w-fit" style={{ color: tokens.primary }}>
        <ArrowRight size={16} /> إلغاء
      </button>
      <div className="rounded-2xl border p-5" style={{ background: tokens.card, borderColor: tokens.border }}>
        <h2 className="font-bold mb-1" style={{ color: tokens.textPrimary }}>بحث اجتماعي جديد</h2>
        <p className="text-xs mb-4" style={{ color: tokens.textSecondary }}>حالة {caseCode} · مبني على الزيارة {sourceVisitCode}</p>
        <ResearchForm
          theme={theme}
          caseCode={caseCode}
          sourceVisitCode={sourceVisitCode}
          onSubmit={(values) => createResearch.mutate(values, { onSuccess: onCreated })}
        />
      </div>
    </div>
  );
}
