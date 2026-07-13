/**
 * LCMS Design Bible v1.0 — token source of truth.
 * No component may hardcode a hex value; import from here (Rule: No magic numbers).
 */
export const LightTheme = {
  primary: "#0E5A9C",
  primaryDark: "#0A4478",
  primaryLight: "#EAF2FA",
  secondary: "#F59E42",
  secondaryLight: "#FEF3E7",
  success: "#22C55E",
  successLight: "#EAFBF0",
  warning: "#FACC15",
  warningLight: "#FEFAE6",
  danger: "#EF4444",
  dangerLight: "#FDEDED",
  info: "#7C3AED",
  infoLight: "#F3EBFD",
  background: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E5E7EB",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
} as const;

export const DarkTheme = {
  ...LightTheme,
  background: "#0F1720",
  card: "#17212C",
  border: "#28323C",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  primaryLight: "#152C42",
  secondaryLight: "#3A2A17",
  successLight: "#123424",
  warningLight: "#33290E",
  dangerLight: "#3A1A1A",
  infoLight: "#241B3A",
} as const;

export type ThemeTokens = typeof LightTheme;
export type ThemeMode = "light" | "dark";

export const RADIUS = { button: 12, card: 16, dialog: 20, input: 10 } as const;
export const SPACING_GRID = 8;
export const TRANSITION_MS = 200;
