import React, { useState } from "react";
import { Plus, Filter, Download, Search } from "lucide-react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useVisits } from "../hooks/useVisits";
import { Visit } from "../types/visit.types";
import { VISIT_STATUS_LABELS_AR, VISIT_STATUS_TONE, VISIT_TYPE_LABELS_AR } from "../constants/visit.constants";

export interface VisitsListPageProps {
  theme: ThemeMode;
  onOpenVisit: (visit: Visit) => void;
  onScheduleVisit: () => void;
}

const DEBOUNCE_MS = 300;

export function VisitsListPage({ theme, onOpenVisit, onScheduleVisit }: VisitsListPageProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useVisits({ search, page: 1, pageSize: 20 });

  const fieldStyle: React.CSSProperties = {
    background: theme === "dark" ? tokens.background : "#FFFFFF",
    color: tokens.textPrimary,
    border: `1px solid ${tokens.border}`,
  };

  return (
    <div className="rounded-2xl border p-5" style={{ background: tokens.card, borderColor: tokens.border }}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: tokens.textSecondary }} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث بكود الزيارة، الأسرة، أو المتطوع..."
            className="w-full h-11 rounded-xl pr-9 pl-4 text-sm outline-none"
            style={fieldStyle}
            aria-label="بحث في الزيارات"
          />
        </div>
        <button className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-medium" style={{ border: `1px solid ${tokens.border}`, color: tokens.textPrimary }}>
          <Filter size={16} /> فلاتر
        </button>
        <button className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-medium" style={{ border: `1px solid ${tokens.border}`, color: tokens.textPrimary }}>
          <Download size={16} /> تصدير
        </button>
        <button
          onClick={onScheduleVisit}
          className="h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-semibold text-white"
          style={{ background: tokens.primary }}
        >
          <Plus size={16} /> جدولة زيارة
        </button>
      </div>

      {isError && (
        <p role="alert" className="text-sm py-6 text-center" style={{ color: tokens.danger }}>
          حدث خطأ أثناء تحميل الزيارات. حاول مرة أخرى.
        </p>
      )}

      {isLoading ? (
        <div className="py-10 text-center text-sm" style={{ color: tokens.textSecondary }}>جارٍ التحميل...</div>
      ) : (
        <DataTable<Visit>
          theme={theme}
          onRowClick={onOpenVisit}
          emptyTitle="لا توجد زيارات"
          emptyMessage="لم يتم جدولة أي زيارات بعد. ابدأ بجدولة زيارة جديدة."
          columns={[
            { key: "code", label: "كود الزيارة" },
            { key: "familyHeadName", label: "الأسرة" },
            { key: "caseCode", label: "الحالة" },
            { key: "volunteerName", label: "المتطوع" },
            { key: "type", label: "النوع", render: (row) => VISIT_TYPE_LABELS_AR[row.type] },
            { key: "scheduledDate", label: "تاريخ الزيارة" },
            {
              key: "status",
              label: "الحالة",
              render: (row) => <StatusBadge label={VISIT_STATUS_LABELS_AR[row.status]} tone={VISIT_STATUS_TONE[row.status]} theme={theme} />,
            },
          ]}
          rows={data?.items ?? []}
        />
      )}

      {data && (
        <div className="text-xs pt-3" style={{ color: tokens.textSecondary }}>
          عرض {data.items.length} من أصل {data.total} زيارة
        </div>
      )}
    </div>
  );
}
