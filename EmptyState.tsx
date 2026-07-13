import React from "react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";

export interface EmptyStateProps {
  theme: ThemeMode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Reused by every list/detail screen for the "no data" state. */
export function EmptyState({ theme, title, message, actionLabel, onAction }: EmptyStateProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  return (
    <div className="flex flex-col items-center text-center gap-2 py-12">
      <h3 className="font-bold" style={{ color: tokens.textPrimary }}>{title}</h3>
      <p className="text-sm max-w-sm" style={{ color: tokens.textSecondary }}>{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 h-10 px-4 rounded-xl text-sm font-semibold text-white"
          style={{ background: tokens.primary }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
