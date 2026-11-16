import { ThemeConfig, ThemePalette } from "@/types";

export const PRESET_PALETTES: Record<string, { label: string; mode: "dark" | "light"; palette: ThemePalette }> = {
  chavonauta_space: {
    label: "Chavonauta Espacial (Oscuro)",
    mode: "dark",
    palette: {
      background: "#0b0f19",
      foreground: "#f8fafc",
      primary: "#6366f1",
      primaryForeground: "#ffffff",
      secondary: "#1e293b",
      secondaryForeground: "#f8fafc",
      accent: "#06b6d4",
      accentForeground: "#0f172a",
      card: "#111827",
      cardForeground: "#f8fafc",
      muted: "#1e293b",
      mutedForeground: "#94a3b8",
      border: "#1e293b",
    },
  },
  neon_arcade: {
    label: "Arcade Neón (Oscuro)",
    mode: "dark",
    palette: {
      background: "#09090b",
      foreground: "#fafafa",
      primary: "#a855f7",
      primaryForeground: "#ffffff",
      secondary: "#18181b",
      secondaryForeground: "#f4f4f5",
      accent: "#22d3ee",
      accentForeground: "#09090b",
      card: "#121217",
      cardForeground: "#fafafa",
      muted: "#27272a",
      mutedForeground: "#a1a1aa",
      border: "#27272a",
    },
  },
  clean_daylight: {
    label: "Estación Clara (Claro)",
    mode: "light",
    palette: {
      background: "#f8fafc",
      foreground: "#0f172a",
      primary: "#4f46e5",
      primaryForeground: "#ffffff",
      secondary: "#e2e8f0",
      secondaryForeground: "#0f172a",
      accent: "#0891b2",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#475569",
      border: "#e2e8f0",
    },
  },
};

export function themeToCssVars(theme: ThemeConfig): Record<string, string> {
  const { palette, radius, fonts } = theme;
  return {
    "--background": palette.background,
    "--foreground": palette.foreground,
    "--primary": palette.primary,
    "--primary-foreground": palette.primaryForeground,
    "--secondary": palette.secondary,
    "--secondary-foreground": palette.secondaryForeground,
    "--accent": palette.accent,
    "--accent-foreground": palette.accentForeground,
    "--card": palette.card,
    "--card-foreground": palette.cardForeground,
    "--muted": palette.muted,
    "--muted-foreground": palette.mutedForeground,
    "--border": palette.border,
    "--radius": radius,
    "--font-heading": fonts.heading,
    "--font-body": fonts.body,
  };
}
