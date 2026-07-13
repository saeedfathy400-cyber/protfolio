import React from "react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";

export type BadgeTone = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

export interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  theme: ThemeMode;
}

/**
 * Generic status pill used by Families, Cases, Visits, Social Research,
 * Donations, and every future module. Do not create a per-feature badge —
 * pass the tone that matches your domain's status mapping instead.
 */
export function StatusBadge({ label, tone, theme }: StatusBadgeProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const backgroundKey = `${tone}Light` as keyof typeof tokens;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: tokens[backgroundKey], color: tokens[tone] }}
    >
      {label}
    </span>
  );
}
