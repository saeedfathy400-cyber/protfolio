import React from "react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";
import { TimelineEntry } from "@/types/common.types";

export interface VisitTimelineProps {
  theme: ThemeMode;
  entries: TimelineEntry[];
}

/**
 * Generic vertical timeline renderer. Consumes the shared TimelineEntry
 * shape so Cases, Families, and Social Research can all feed this same
 * component instead of each building their own timeline UI.
 */
export function VisitTimeline({ theme, entries }: VisitTimelineProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  return (
    <ol className="flex flex-col gap-4 relative pr-4" style={{ borderRight: `2px solid ${tokens.border}` }}>
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -right-[21px] top-1 w-3 h-3 rounded-full" style={{ background: tokens.primary }} />
          <div className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>{entry.action}</div>
          <div className="text-xs" style={{ color: tokens.textSecondary }}>
            {entry.performedByName} · {new Date(entry.occurredAt).toLocaleDateString("ar-EG")}
          </div>
        </li>
      ))}
    </ol>
  );
}
