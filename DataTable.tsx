import React from "react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { EmptyState } from "./EmptyState";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  theme: ThemeMode;
  columns: DataTableColumn<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyMessage?: string;
}

/**
 * Generic enterprise data table. Every list screen (Families, Cases, Visits,
 * Social Research, Donations...) must reuse this instead of hand-rolling
 * a <table>. Sorting/pagination controls are composed around it by the
 * page, keeping this component presentation-only (SRP).
 */
export function DataTable<T extends { id?: string }>({
  theme,
  columns,
  rows,
  onRowClick,
  emptyTitle = "لا توجد بيانات",
  emptyMessage = "لا توجد سجلات مطابقة لمعايير البحث الحالية.",
}: DataTableProps<T>): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;

  if (rows.length === 0) {
    return <EmptyState theme={theme} title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" role="table">
        <thead>
          <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="text-right py-3 px-3 font-semibold whitespace-nowrap"
                style={{ color: tokens.textSecondary }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id ?? index}
              onClick={() => onRowClick?.(row)}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(event) => {
                if (onRowClick && (event.key === "Enter" || event.key === " ")) onRowClick(row);
              }}
              className={onRowClick ? "cursor-pointer focus:outline-none focus-visible:ring-2" : ""}
              style={{ borderBottom: `1px solid ${tokens.border}` }}
            >
              {columns.map((column) => (
                <td key={column.key} className="py-3 px-3 whitespace-nowrap" style={{ color: tokens.textPrimary }}>
                  {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
