import { ThemeConfig, ThemePalette } from "@/types";

export const PRESET_PALETTES: Record<
  string,
  { label: string; mode: "dark" | "light"; palette: ThemePalette }
> = {
  chavonauta_navy: {
    label: "Chavonauta Oficial (Navy & Slate)",
    mode: "light",
    palette: {
      background: "#f8fafc", // slate-50
      foreground: "#0f172a", // slate-900
      primary: "#1c38a8", // navy-800
      primaryForeground: "#ffffff",
      secondary: "#eef6ff", // navy-50
      secondaryForeground: "#1a2f85", // navy-900
      accent: "#336dff", // navy-500
      accentForeground: "#ffffff",
      card: "#ffffff", // white
      cardForeground: "#1e293b", // slate-800
      muted: "#f1f5f9", // slate-100
      mutedForeground: "#64748b", // slate-500
      border: "#e2e8f0", // slate-200
    },
  },
  chavonauta_dark: {
    label: "Chavonauta Noche Espacial",
    mode: "dark",
    palette: {
      background: "#0b1120",
      foreground: "#f8fafc",
      primary: "#5c93ff",
      primaryForeground: "#0b1120",
      secondary: "#162035",
      secondaryForeground: "#f8fafc",
      accent: "#38bdf8",
      accentForeground: "#0b1120",
      card: "#111b2e",
      cardForeground: "#f8fafc",
      muted: "#1e293b",
      mutedForeground: "#94a3b8",
      border: "#1e2c45",
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
