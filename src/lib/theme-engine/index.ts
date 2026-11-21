import {
  AutoThemeScheduleConfig,
  HeroFallingIconsConfig,
  HeroIconPackKey,
  SeasonalDatePoint,
  SeasonalThemeRule,
  ThemeConfig,
  ThemePalette,
} from "@/types";

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
  ano_nuevo: {
    label: "Año Nuevo",
    category: "temporada",
    mode: "dark",
    palette: {
      background: "#0a0e1a",
      foreground: "#f8fafc",
      primary: "#172554",
      primaryForeground: "#ffffff",
      secondary: "#1e293b",
      secondaryForeground: "#fde047",
      accent: "#eab308",
      accentForeground: "#0a0e1a",
      card: "#111827",
      cardForeground: "#f8fafc",
      muted: "#1e293b",
      mutedForeground: "#94a3b8",
      border: "#334155",
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
  ano_nuevo: "new_year",
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

  // 2. Intento por nombre del tema (ej. "Navidad", "Año Nuevo", "Halloween")
  if (themeName) {
    const lowerName = themeName.toLowerCase();
    if (
      lowerName.includes("año nuevo") ||
      lowerName.includes("ano nuevo") ||
      lowerName.includes("new year")
    ) {
      return "new_year";
    }
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

export const MONTH_NAMES_ES: Record<number, string> = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

/**
 * Calcula dinámicamente a qué año pasamos o estamos recibiendo en Año Nuevo.
 * - Si la fecha está en noviembre o diciembre (meses 11 o 12), el año nuevo al que pasamos es `year + 1`.
 * - Si la fecha está en enero o resto del año, el año nuevo en curso es `year`.
 */
export function getNewYearTargetYear(
  date: Date = new Date(),
  mode: "auto" | "custom" = "auto",
  customYear?: number
): number {
  if (
    mode === "custom" &&
    typeof customYear === "number" &&
    Number.isFinite(customYear) &&
    customYear >= 2020 &&
    customYear <= 2100
  ) {
    return Math.floor(customYear);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 11 ? year + 1 : year;
}

/**
 * Reemplaza marcadores {year} o {año} por el año calculado de transición.
 */
export function formatNewYearText(template: string, targetYear: number): string {
  if (!template) return "";
  return template.replace(/\{(year|año|ano)\}/gi, String(targetYear));
}

/**
 * Verifica si una fecha cae dentro de un rango [start, end] (día y mes),
 * soportando rangos que cruzan el fin de año (ej. Noviembre a Enero o Diciembre a Enero).
 */
export function isDateInSeasonalRange(
  date: Date,
  start: SeasonalDatePoint,
  end: SeasonalDatePoint
): boolean {
  const currentMd = (date.getMonth() + 1) * 100 + date.getDate();
  const startMd = start.month * 100 + start.day;
  const endMd = end.month * 100 + end.day;

  if (startMd <= endMd) {
    return currentMd >= startMd && currentMd <= endMd;
  }
  // Rango que cruza de fin de año a principio del siguiente
  return currentMd >= startMd || currentMd <= endMd;
}

const DAYS_BEFORE_MONTH = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

function dayOfYear(pt: SeasonalDatePoint): number {
  return (DAYS_BEFORE_MONTH[pt.month] || 0) + pt.day;
}

/**
 * Calcula la duración en días de un rango de temporada (1 a 366).
 * Permite dar prioridad automática a celebraciones más específicas cuando dos rangos se superponen
 * (ej. Año Nuevo de 11 días dentro de una temporada navideña de 55 días).
 */
export function getSeasonalRangeDurationDays(
  start: SeasonalDatePoint,
  end: SeasonalDatePoint
): number {
  const startDay = dayOfYear(start);
  const endDay = dayOfYear(end);
  if (endDay >= startDay) {
    return endDay - startDay + 1;
  }
  return 365 - startDay + endDay + 1;
}

/**
 * Ordena las reglas de temporada cronológicamente por fecha de inicio (Enero a Diciembre)
 */
export function sortSeasonalRulesByDate(
  rules: SeasonalThemeRule[]
): SeasonalThemeRule[] {
  return [...rules].sort((a, b) => {
    const startA = a.startDate.month * 100 + a.startDate.day;
    const startB = b.startDate.month * 100 + b.startDate.day;
    if (startA !== startB) return startA - startB;
    const endA = a.endDate.month * 100 + a.endDate.day;
    const endB = b.endDate.month * 100 + b.endDate.day;
    return endA - endB;
  });
}

export const DEFAULT_SEASONAL_RULES: SeasonalThemeRule[] = [
  {
    id: "season-valentine",
    name: "Romance",
    presetKey: "febrero",
    startDate: { month: 2, day: 1 },
    endDate: { month: 2, day: 28 },
    enabled: true,
    fallingIconsEnabled: true,
    fallingIconsPack: "romance",
  },
  {
    id: "season-spring",
    name: "Primavera",
    presetKey: "primavera",
    startDate: { month: 3, day: 21 },
    endDate: { month: 5, day: 31 },
    enabled: true,
    fallingIconsEnabled: true,
    fallingIconsPack: "spring",
  },
  {
    id: "season-patrio",
    name: "Patrio",
    presetKey: "patrio",
    startDate: { month: 9, day: 1 },
    endDate: { month: 9, day: 30 },
    enabled: true,
    fallingIconsEnabled: true,
    fallingIconsPack: "patrio",
  },
  {
    id: "season-halloween",
    name: "Halloween",
    presetKey: "halloween",
    startDate: { month: 10, day: 20 },
    endDate: { month: 11, day: 4 },
    enabled: true,
    fallingIconsEnabled: true,
    fallingIconsPack: "halloween",
  },
  {
    id: "season-christmas",
    name: "Navidad",
    presetKey: "navidad",
    startDate: { month: 11, day: 15 },
    endDate: { month: 1, day: 10 },
    enabled: true,
    fallingIconsEnabled: true,
    fallingIconsPack: "christmas",
  },
  {
    id: "season-new-year",
    name: "Año Nuevo",
    presetKey: "ano_nuevo",
    startDate: { month: 12, day: 27 },
    endDate: { month: 1, day: 6 },
    enabled: true,
    fallingIconsEnabled: true,
    fallingIconsPack: "new_year",
    heroBadgeTemplate: "¡Feliz Año Nuevo {year} — Catálogo Oficial y Servicios!",
    newYearMode: "auto",
  },
];

export const DEFAULT_AUTO_SCHEDULE: AutoThemeScheduleConfig = {
  enabled: false,
  defaultPresetKey: "chavonauta_navy",
  rules: DEFAULT_SEASONAL_RULES,
};

/**
 * Encuentra la regla de temporada activa para una fecha dada.
 * Si dos rangos coinciden en la misma fecha (ej. Navidad de Nov a Ene y Año Nuevo a fin de Dic),
 * selecciona automáticamente la celebración más específica (menor duración en días).
 */
export function findMatchingSeasonalRule(
  schedule?: AutoThemeScheduleConfig,
  date: Date = new Date()
): SeasonalThemeRule | null {
  if (!schedule || !schedule.enabled || !Array.isArray(schedule.rules)) {
    return null;
  }

  const matchingRules = schedule.rules.filter(
    (rule) =>
      rule &&
      rule.enabled &&
      isDateInSeasonalRange(date, rule.startDate, rule.endDate)
  );

  if (matchingRules.length === 0) return null;
  if (matchingRules.length === 1) return matchingRules[0];

  return [...matchingRules].sort(
    (a, b) =>
      getSeasonalRangeDurationDays(a.startDate, a.endDate) -
      getSeasonalRangeDurationDays(b.startDate, b.endDate)
  )[0];
}

/**
 * Resuelve el tema efectivo aplicando programación automática por fecha si está activa,
 * así como el cálculo dinámico del año entrante en el tema de Año Nuevo.
 */
export function resolveEffectiveTheme(
  theme: ThemeConfig,
  date: Date = new Date()
): ThemeConfig {
  const schedule = theme.autoSchedule;
  const customPresets = theme.customPresets || [];

  // Si el modo automático NO está habilitado, aún resolvemos {year} y targetYear si el tema activo es Año Nuevo
  if (!schedule?.enabled) {
    const currentKey = getThemePresetKey(theme.palette);
    const isNewYearTheme =
      currentKey === "ano_nuevo" ||
      theme.name.toLowerCase().includes("año nuevo") ||
      theme.name.toLowerCase().includes("ano nuevo");

    const targetYear = getNewYearTargetYear(date, "auto");

    const updatedSections = theme.sections.map((sec) => {
      if (sec.type !== "hero") return sec;
      const content = { ...(sec.content || {}) };
      const falling = (content.fallingIcons as HeroFallingIconsConfig | undefined) || {
        enabled: false,
        pack: "auto",
      };

      if (typeof content.badgeText === "string" && /\{(year|año|ano)\}/i.test(content.badgeText)) {
        content.badgeText = formatNewYearText(content.badgeText, targetYear);
      }

      if (isNewYearTheme || falling.pack === "new_year") {
        content.fallingIcons = {
          ...falling,
          targetYear,
        };
      }

      return { ...sec, content };
    });

    return {
      ...theme,
      sections: updatedSections,
    };
  }

  // Modo automático habilitado
  const matchedRule = findMatchingSeasonalRule(schedule, date);
  const targetPresetKey = matchedRule
    ? matchedRule.presetKey
    : schedule.defaultPresetKey || "chavonauta_navy";

  let resolvedPalette = theme.palette;
  let resolvedMode = theme.mode;
  let resolvedName = theme.name;
  let presetFallingEnabled: boolean | undefined = undefined;
  let presetFallingPack: HeroIconPackKey | undefined = undefined;

  if (targetPresetKey.startsWith("custom:")) {
    const customId = targetPresetKey.replace("custom:", "");
    const foundCustom = customPresets.find((cp) => cp.id === customId);
    if (foundCustom) {
      resolvedPalette = { ...foundCustom.palette };
      resolvedMode = foundCustom.mode;
      resolvedName = foundCustom.label;
      presetFallingEnabled = foundCustom.fallingIconsEnabled;
      presetFallingPack = foundCustom.fallingIconsPack;
    }
  } else if (PRESET_PALETTES[targetPresetKey]) {
    const foundOfficial = PRESET_PALETTES[targetPresetKey];
    resolvedPalette = { ...foundOfficial.palette };
    resolvedMode = foundOfficial.mode;
    resolvedName = foundOfficial.label;
    presetFallingPack = THEME_DEFAULT_ICON_PACK[targetPresetKey] || "auto";
  }

  const targetYear = getNewYearTargetYear(
    date,
    matchedRule?.newYearMode || "auto",
    matchedRule?.customYear
  );

  const isNewYearRule =
    targetPresetKey === "ano_nuevo" ||
    matchedRule?.fallingIconsPack === "new_year" ||
    resolvedName.toLowerCase().includes("año nuevo");

  if (isNewYearRule) {
    resolvedName = `Año Nuevo ${targetYear}`;
  }

  const updatedSections = theme.sections.map((sec) => {
    if (sec.type !== "hero") return sec;
    const content = { ...(sec.content || {}) };
    const currentFalling = (content.fallingIcons as HeroFallingIconsConfig | undefined) || {
      enabled: true,
      pack: "auto",
      density: "balanced",
      speed: "normal",
    };

    const nextFallingEnabled =
      matchedRule?.fallingIconsEnabled !== undefined
        ? matchedRule.fallingIconsEnabled
        : presetFallingEnabled !== undefined
        ? presetFallingEnabled
        : currentFalling.enabled;

    const nextFallingPack: HeroIconPackKey =
      matchedRule?.fallingIconsPack ||
      presetFallingPack ||
      THEME_DEFAULT_ICON_PACK[targetPresetKey] ||
      currentFalling.pack ||
      "auto";

    content.fallingIcons = {
      ...currentFalling,
      enabled: nextFallingEnabled,
      pack: nextFallingPack,
      targetYear,
    };

    if (matchedRule?.heroBadgeTemplate?.trim()) {
      content.badgeText = formatNewYearText(
        matchedRule.heroBadgeTemplate.trim(),
        targetYear
      );
    } else if (isNewYearRule) {
      const existingBadge =
        typeof content.badgeText === "string" ? content.badgeText : "";
      if (/\{(year|año|ano)\}/i.test(existingBadge)) {
        content.badgeText = formatNewYearText(existingBadge, targetYear);
      } else {
        content.badgeText = `¡Feliz Año Nuevo ${targetYear} — Catálogo Oficial y Servicios!`;
      }
    } else if (
      typeof content.badgeText === "string" &&
      /\{(year|año|ano)\}/i.test(content.badgeText)
    ) {
      content.badgeText = formatNewYearText(content.badgeText, targetYear);
    }

    return {
      ...sec,
      content,
    };
  });

  return {
    ...theme,
    name: resolvedName,
    mode: resolvedMode,
    palette: resolvedPalette,
    sections: updatedSections,
  };
}

export interface HeroParticle {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
  swayDuration: number;
  swayX: number;
  opacity: number;
  rotateDeg: number;
}

/**
 * Genera partículas distribuidas equitativamente a lo largo de TODO el ancho del Hero (de 3% a 97%).
 * De esta manera, sin importar la densidad (suave, media o viva), las partículas cubren
 * de extremo a extremo el banner y nunca quedan concentradas en solo una mitad.
 */
export function getParticlesForDensity(density: "subtle" | "balanced" | "lively"): HeroParticle[] {
  const count = density === "subtle" ? 12 : density === "lively" ? 28 : 20;
  const particles: HeroParticle[] = [];
  const usableWidth = 94.0; // entre 3% y 97%
  const bucketWidth = usableWidth / count;

  for (let i = 0; i < count; i++) {
    // Variación sutil dentro de cada franja para naturalidad orgánica sin amontonarse
    const jitterFactor = (((i * 13) % 7) - 3) / 10.0; // -0.3 a +0.3
    const leftVal = (3.0 + (i + 0.5 + jitterFactor) * bucketWidth).toFixed(1);

    const size = 20 + ((i * 11) % 13); // entre 20px y 32px
    const duration = +(8.5 + ((i * 17) % 45) / 10).toFixed(1); // entre 8.5s y 13.0s
    // Delays intercalados no lineales para que ya se encuentren a diferentes alturas en vuelo
    const delay = -+(0.8 + ((i * 31 + 17) % 120) / 10).toFixed(1); // entre -0.8s y -12.8s
    const swayDuration = +(3.2 + ((i * 13) % 16) / 10).toFixed(1); // entre 3.2s y 4.8s
    const swayX = (i % 2 === 0 ? 1 : -1) * (11 + ((i * 7) % 9)); // entre 11px y 19px
    const opacity = +(0.44 + ((i * 19) % 20) / 100).toFixed(2); // entre 0.44 y 0.64
    const rotateDeg = 180 + ((i * 43) % 190);

    particles.push({
      id: i + 1,
      left: `${leftVal}%`,
      size,
      delay,
      duration,
      swayDuration,
      swayX,
      opacity,
      rotateDeg,
    });
  }

  return particles;
}
