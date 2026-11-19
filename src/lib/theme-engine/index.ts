import { HeroIconPackKey, ThemeConfig, ThemePalette } from "@/types";

export const PRESET_PALETTES: Record<
  string,
  {
    label: string;
    category?: "oficial" | "temporada" | "estilos";
    mode: "dark" | "light";
    palette: ThemePalette;
  }
> = {
  chavonauta_navy: {
    label: "Oficial",
    category: "oficial",
    mode: "light",
    palette: {
      background: "#f8fafc",
      foreground: "#0f172a",
      primary: "#1c38a8",
      primaryForeground: "#ffffff",
      secondary: "#eef6ff",
      secondaryForeground: "#1a2f85",
      accent: "#336dff",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#1e293b",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      border: "#e2e8f0",
    },
  },
  chavonauta_dark: {
    label: "Espacial",
    category: "estilos",
    mode: "dark",
    palette: {
      background: "#0b1120",
      foreground: "#f8fafc",
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
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
  cyberpunk: {
    label: "Cyber",
    category: "estilos",
    mode: "dark",
    palette: {
      background: "#09090b",
      foreground: "#fafafa",
      primary: "#7c3aed",
      primaryForeground: "#ffffff",
      secondary: "#18181b",
      secondaryForeground: "#e4e4e7",
      accent: "#06b6d4",
      accentForeground: "#09090b",
      card: "#18181b",
      cardForeground: "#fafafa",
      muted: "#27272a",
      mutedForeground: "#a1a1aa",
      border: "#3f3f46",
    },
  },
  oceano: {
    label: "Océano",
    category: "estilos",
    mode: "light",
    palette: {
      background: "#f0f9ff",
      foreground: "#082f49",
      primary: "#0284c7",
      primaryForeground: "#ffffff",
      secondary: "#e0f2fe",
      secondaryForeground: "#0369a1",
      accent: "#06b6d4",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#082f49",
      muted: "#e0f2fe",
      mutedForeground: "#0284c7",
      border: "#bae6fd",
    },
  },
  esmeralda: {
    label: "Esmeralda",
    category: "estilos",
    mode: "light",
    palette: {
      background: "#f0fdf4",
      foreground: "#052e16",
      primary: "#059669",
      primaryForeground: "#ffffff",
      secondary: "#dcfce7",
      secondaryForeground: "#047857",
      accent: "#10b981",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#052e16",
      muted: "#dcfce7",
      mutedForeground: "#059669",
      border: "#bbf7d0",
    },
  },
  lavanda: {
    label: "Lavanda",
    category: "estilos",
    mode: "light",
    palette: {
      background: "#faf5ff",
      foreground: "#3b0764",
      primary: "#8b5cf6",
      primaryForeground: "#ffffff",
      secondary: "#f3e8ff",
      secondaryForeground: "#6d28d9",
      accent: "#c084fc",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#3b0764",
      muted: "#f3e8ff",
      mutedForeground: "#8b5cf6",
      border: "#e9d5ff",
    },
  },
  atardecer: {
    label: "Atardecer",
    category: "estilos",
    mode: "light",
    palette: {
      background: "#fff7ed",
      foreground: "#431407",
      primary: "#ea580c",
      primaryForeground: "#ffffff",
      secondary: "#ffedd5",
      secondaryForeground: "#c2410c",
      accent: "#f97316",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#431407",
      muted: "#ffedd5",
      mutedForeground: "#ea580c",
      border: "#fed7aa",
    },
  },
  titanio: {
    label: "Titanio",
    category: "estilos",
    mode: "dark",
    palette: {
      background: "#0f172a",
      foreground: "#f8fafc",
      primary: "#475569",
      primaryForeground: "#ffffff",
      secondary: "#1e293b",
      secondaryForeground: "#f1f5f9",
      accent: "#38bdf8",
      accentForeground: "#0f172a",
      card: "#1e293b",
      cardForeground: "#f8fafc",
      muted: "#334155",
      mutedForeground: "#94a3b8",
      border: "#334155",
    },
  },
  minimalista: {
    label: "Minimal",
    category: "estilos",
    mode: "light",
    palette: {
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#18181b",
      primaryForeground: "#ffffff",
      secondary: "#f4f4f5",
      secondaryForeground: "#18181b",
      accent: "#52525b",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#09090b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      border: "#e4e4e7",
    },
  },
  cafe: {
    label: "Moca",
    category: "estilos",
    mode: "light",
    palette: {
      background: "#fffbeb",
      foreground: "#291809",
      primary: "#78350f",
      primaryForeground: "#ffffff",
      secondary: "#fef3c7",
      secondaryForeground: "#78350f",
      accent: "#b45309",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#291809",
      muted: "#fef3c7",
      mutedForeground: "#92400e",
      border: "#fde68a",
    },
  },
  neon: {
    label: "Neón",
    category: "estilos",
    mode: "dark",
    palette: {
      background: "#030712",
      foreground: "#f9fafb",
      primary: "#10b981",
      primaryForeground: "#030712",
      secondary: "#111827",
      secondaryForeground: "#34d399",
      accent: "#f43f5e",
      accentForeground: "#ffffff",
      card: "#111827",
      cardForeground: "#f9fafb",
      muted: "#1f2937",
      mutedForeground: "#9ca3af",
      border: "#1f2937",
    },
  },
  dorado: {
    label: "Dorado",
    category: "estilos",
    mode: "dark",
    palette: {
      background: "#18181b",
      foreground: "#fafaf9",
      primary: "#d97706",
      primaryForeground: "#18181b",
      secondary: "#27272a",
      secondaryForeground: "#fbbf24",
      accent: "#f59e0b",
      accentForeground: "#18181b",
      card: "#27272a",
      cardForeground: "#fafaf9",
      muted: "#3f3f46",
      mutedForeground: "#a1a1aa",
      border: "#3f3f46",
    },
  },
  glaciar: {
    label: "Glaciar",
    category: "estilos",
    mode: "light",
    palette: {
      background: "#f8fafc",
      foreground: "#0f172a",
      primary: "#0ea5e9",
      primaryForeground: "#ffffff",
      secondary: "#f0f9ff",
      secondaryForeground: "#0369a1",
      accent: "#38bdf8",
      accentForeground: "#0f172a",
      card: "#ffffff",
      cardForeground: "#0f172a",
      muted: "#e2e8f0",
      mutedForeground: "#64748b",
      border: "#e2e8f0",
    },
  },
  navidad: {
    label: "Navidad",
    category: "temporada",
    mode: "light",
    palette: {
      background: "#fafaf9",
      foreground: "#1c1917",
      primary: "#991b1b",
      primaryForeground: "#ffffff",
      secondary: "#fef2f2",
      secondaryForeground: "#7f1d1d",
      accent: "#166534",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#1c1917",
      muted: "#f5f5f4",
      mutedForeground: "#78716c",
      border: "#fed7aa",
    },
  },
  halloween: {
    label: "Halloween",
    category: "temporada",
    mode: "dark",
    palette: {
      background: "#0c0a09",
      foreground: "#fafaf9",
      primary: "#ea580c",
      primaryForeground: "#ffffff",
      secondary: "#2e1065",
      secondaryForeground: "#f3e8ff",
      accent: "#84cc16",
      accentForeground: "#0c0a09",
      card: "#18141f",
      cardForeground: "#fafaf9",
      muted: "#262033",
      mutedForeground: "#a8a29e",
      border: "#3b2d54",
    },
  },
  patrio: {
    label: "Patrio",
    category: "temporada",
    mode: "light",
    palette: {
      background: "#ffffff",
      foreground: "#052e16",
      primary: "#15803d",
      primaryForeground: "#ffffff",
      secondary: "#f0fdf4",
      secondaryForeground: "#14532d",
      accent: "#dc2626",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#052e16",
      muted: "#f8fafc",
      mutedForeground: "#64748b",
      border: "#bbf7d0",
    },
  },
  otono: {
    label: "Otoño",
    category: "temporada",
    mode: "light",
    palette: {
      background: "#fffbeb",
      foreground: "#451a03",
      primary: "#b45309",
      primaryForeground: "#ffffff",
      secondary: "#fef3c7",
      secondaryForeground: "#78350f",
      accent: "#c2410c",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#451a03",
      muted: "#fef3c7",
      mutedForeground: "#92400e",
      border: "#fde68a",
    },
  },
  febrero: {
    label: "Romance",
    category: "temporada",
    mode: "light",
    palette: {
      background: "#fff5f7",
      foreground: "#881337",
      primary: "#e11d48",
      primaryForeground: "#ffffff",
      secondary: "#ffe4e6",
      secondaryForeground: "#9f1239",
      accent: "#db2777",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#881337",
      muted: "#ffe4e6",
      mutedForeground: "#be123c",
      border: "#fecdd3",
    },
  },
  primavera: {
    label: "Primavera",
    category: "temporada",
    mode: "light",
    palette: {
      background: "#f8fafc",
      foreground: "#0f172a",
      primary: "#059669",
      primaryForeground: "#ffffff",
      secondary: "#ecfdf5",
      secondaryForeground: "#065f46",
      accent: "#0284c7",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      border: "#cbd5e1",
    },
  },
};

export function themeToCssVars(theme: ThemeConfig): Record<string, string> {
  const { palette, radius, fonts } = theme;
  const isPill = radius === "9999px";

  // En modo píldora, las tarjetas se mantienen armónicas (1.25rem = 20px) con esquinas redondeadas
  // para que los textos, imágenes y botones NUNCA se salgan de los bordes contorneados.
  const safeCardRadius = isPill ? "1.25rem" : radius;

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
    "--radius": safeCardRadius,
    "--radius-card": safeCardRadius,
    "--radius-pill": isPill ? "9999px" : radius,
    "--font-heading": fonts.heading,
    "--font-body": fonts.body,
  };
}

export const THEME_DEFAULT_ICON_PACK: Record<string, HeroIconPackKey> = {
  chavonauta_navy: "tech",
  chavonauta_dark: "space",
  cyberpunk: "gaming",
  oceano: "ocean",
  esmeralda: "spring",
  lavanda: "sparkles",
  atardecer: "sparkles",
  titanio: "tech",
  minimalista: "sparkles",
  cafe: "coffee",
  neon: "gaming",
  dorado: "sparkles",
  glaciar: "winter",
  navidad: "christmas",
  halloween: "halloween",
  patrio: "patrio",
  otono: "autumn",
  febrero: "romance",
  primavera: "spring",
};

/**
 * Determina la clave de preset oficial según los colores primario y fondo
 */
export function getThemePresetKey(palette?: ThemePalette): string {
  if (!palette) return "chavonauta_navy";
  for (const [key, p] of Object.entries(PRESET_PALETTES)) {
    if (
      p.palette.primary.toLowerCase() === palette.primary?.toLowerCase() &&
      p.palette.background.toLowerCase() === palette.background?.toLowerCase()
    ) {
      return key;
    }
  }
  return "";
}

/**
 * Obtiene el paquete de iconos de cascada correspondiente según el tema
 */
export function resolveHeroIconPack(
  packKey?: HeroIconPackKey,
  palette?: ThemePalette,
  themeName?: string
): HeroIconPackKey {
  if (packKey && packKey !== "auto") {
    return packKey;
  }

  // 1. Intento por clave de preset exacto
  const presetKey = getThemePresetKey(palette);
  if (presetKey && THEME_DEFAULT_ICON_PACK[presetKey]) {
    return THEME_DEFAULT_ICON_PACK[presetKey];
  }

  // 2. Intento por nombre del tema (ej. "Navidad", "Halloween")
  if (themeName) {
    const lowerName = themeName.toLowerCase();
    if (lowerName.includes("navidad")) return "christmas";
    if (lowerName.includes("halloween")) return "halloween";
    if (lowerName.includes("espacial") || lowerName.includes("space")) return "space";
    if (lowerName.includes("cyber") || lowerName.includes("gaming")) return "gaming";
    if (lowerName.includes("oceano") || lowerName.includes("mar")) return "ocean";
    if (lowerName.includes("otoño") || lowerName.includes("otono")) return "autumn";
    if (lowerName.includes("primavera")) return "spring";
    if (lowerName.includes("romance") || lowerName.includes("febrero") || lowerName.includes("amor")) return "romance";
    if (lowerName.includes("glaciar") || lowerName.includes("hielo") || lowerName.includes("invierno")) return "winter";
    if (lowerName.includes("café") || lowerName.includes("cafe") || lowerName.includes("moca")) return "coffee";
    if (lowerName.includes("patrio") || lowerName.includes("méxico") || lowerName.includes("mexico")) return "patrio";
  }

  return "tech";
}
