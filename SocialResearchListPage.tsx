import React, { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSocialResearchList } from "../hooks/useSocialResearchList";
import { SocialResearch } from "../types/socialResearch.types";
import { RESEARCH_STATUS_LABELS_AR, RESEARCH_STATUS_TONE } from "../constants/socialResearch.constants";

export interface SocialResearchListPageProps {
  theme: ThemeMode;
  onOpenResearch: (research: SocialResearch) => void;
}

export function SocialResearchListPage({ theme, onOpenResearch }: SocialResearchListPageProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSocialResearchList({ search, page: 1, pageSize: 20 });

  return (
    <div className="rounded-2xl border p-5" style={{ background: tokens.card, borderColor: tokens.border }}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: tokens.textSecondary }} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث بكود البحث الاجتماعي أو الحالة..."
            className="w-full h-11 rounded-xl pr-9 pl-4 text-sm outline-none"
            style={{ background: theme === "dark" ? tokens.background : "#FFFFFF", color: tokens.textPrimary, border: `1px solid ${tokens.border}` }}
          />
        </div>
        <button className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-medium" style={{ border: `1px solid ${tokens.border}`, color: tokens.textPrimary }}>
          <Filter size={16} /> فلاتر
        </button>
        <button className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-medium" style={{ border: `1px solid ${tokens.border}`, color: tokens.textPrimary }}>
          <Download size={16} /> تصدير
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-sm" style={{ color: tokens.textSecondary }}>جارٍ التحميل...</div>
      ) : (
        <DataTable<SocialResearch>
          theme={theme}
          onRowClick={onOpenResearch}
          emptyTitle="لا توجد أبحاث اجتماعية"
          emptyMessage="لا يمكن إنشاء بحث اجتماعي إلا بعد اكتمال زيارة ميدانية للحالة."
          columns={[
            { key: "code", label: "كود البحث" },
            { key: "caseCode", label: "الحالة" },
            { key: "version", label: "الإصدار", render: (row) => `#${row.version}` },
            { key: "researcherName", label: "الباحث" },
            {
              key: "approvalStatus",
              label: "الحالة",
              render: (row) => <StatusBadge label={RESEARCH_STATUS_LABELS_AR[row.approvalStatus]} tone={RESEARCH_STATUS_TONE[row.approvalStatus]} theme={theme} />,
            },
          ]}
          rows={data?.items ?? []}
        />
      )}

      {data && (
        <div className="text-xs pt-3" style={{ color: tokens.textSecondary }}>
          عرض {data.items.length} من أصل {data.total} بحث اجتماعي
        </div>
      )}
    </div>
  );
}
