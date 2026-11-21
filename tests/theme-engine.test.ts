import { describe, it, expect } from "vitest";
import {
  DEFAULT_AUTO_SCHEDULE,
  findMatchingSeasonalRule,
  formatNewYearText,
  getNewYearTargetYear,
  isDateInSeasonalRange,
  PRESET_PALETTES,
  resolveEffectiveTheme,
  resolveHeroIconPack,
  themeToCssVars,
} from "@/lib/theme-engine";
import { DEFAULT_THEME_CONFIG } from "@/lib/data/seed";
import { ThemeConfig, ThemePalette } from "@/types";

describe("Theme Engine - Automated Tests", () => {
  it("generates all required CSS variables for default theme", () => {
    const cssVars = themeToCssVars(DEFAULT_THEME_CONFIG);

    expect(cssVars).toBeDefined();
    expect(typeof cssVars).toBe("object");

    const requiredKeys = [
      "--background",
      "--foreground",
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--accent",
      "--accent-foreground",
      "--card",
      "--card-foreground",
      "--muted",
      "--muted-foreground",
      "--border",
      "--radius",
      "--radius-card",
      "--radius-pill",
      "--font-heading",
      "--font-body",
    ];

    for (const key of requiredKeys) {
      expect(cssVars[key], `CSS variable ${key} should be defined and non-empty`).toBeTruthy();
      expect(typeof cssVars[key]).toBe("string");
    }
  });

  it("safeguards card radius when mode is pill (9999px)", () => {
    const pillTheme: ThemeConfig = {
      ...DEFAULT_THEME_CONFIG,
      radius: "9999px",
    };

    const vars = themeToCssVars(pillTheme);

    // En modo píldora, las tarjetas se mantienen a 1.25rem para evitar desbordes
    expect(vars["--radius"]).toBe("1.25rem");
    expect(vars["--radius-card"]).toBe("1.25rem");
    expect(vars["--radius-pill"]).toBe("9999px");
  });

  it("respects standard border radius values", () => {
    const radii: Array<"0rem" | "0.5rem" | "0.75rem" | "1rem"> = ["0rem", "0.5rem", "0.75rem", "1rem"];

    for (const r of radii) {
      const theme: ThemeConfig = {
        ...DEFAULT_THEME_CONFIG,
        radius: r,
      };
      const vars = themeToCssVars(theme);
      expect(vars["--radius"]).toBe(r);
      expect(vars["--radius-card"]).toBe(r);
      expect(vars["--radius-pill"]).toBe(r);
    }
  });

  it("validates all built-in color presets dynamically", () => {
    const presetKeys = Object.keys(PRESET_PALETTES);
    expect(presetKeys.length).toBeGreaterThan(0);

    const requiredPaletteKeys: Array<keyof ThemePalette> = [
      "background",
      "foreground",
      "primary",
      "primaryForeground",
      "secondary",
      "secondaryForeground",
      "accent",
      "accentForeground",
      "card",
      "cardForeground",
      "muted",
      "mutedForeground",
      "border",
    ];

    for (const [key, preset] of Object.entries(PRESET_PALETTES)) {
      expect(preset.label, `Preset ${key} must have a label`).toBeTruthy();
      expect(["dark", "light"]).toContain(preset.mode);

      for (const field of requiredPaletteKeys) {
        const val = preset.palette[field];
        expect(val, `Preset ${key} field ${field} must exist`).toBeTruthy();
        expect(typeof val).toBe("string");
        // Debe ser un código de color hex válido
        expect(val).toMatch(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
      }

      // Probar que el preset genera variables CSS válidas sin errores
      const mockTheme: ThemeConfig = {
        ...DEFAULT_THEME_CONFIG,
        mode: preset.mode,
        palette: preset.palette,
      };

      const vars = themeToCssVars(mockTheme);
      expect(vars["--primary"]).toBe(preset.palette.primary);
      expect(vars["--background"]).toBe(preset.palette.background);
    }
  });

  it("includes Año Nuevo preset and switches themes automatically by date with dynamic year transition", () => {
    // 1. Verificar que existe el nuevo tema de Año Nuevo y su paquete de iconos
    expect(PRESET_PALETTES.ano_nuevo).toBeDefined();
    expect(PRESET_PALETTES.ano_nuevo.label).toBe("Año Nuevo");
    expect(
      resolveHeroIconPack("auto", PRESET_PALETTES.ano_nuevo.palette, "Año Nuevo")
    ).toBe("new_year");

    // 2. Verificar cálculo dinámico de transición de año (Nov/Dic -> año entrante, Ene -> año nuevo actual)
    expect(getNewYearTargetYear(new Date(2026, 11, 31))).toBe(2027); // 31 Dic 2026 -> pasa a 2027
    expect(getNewYearTargetYear(new Date(2027, 0, 2))).toBe(2027); // 2 Ene 2027 -> se mantiene en 2027
    expect(getNewYearTargetYear(new Date(2027, 11, 29))).toBe(2028); // 29 Dic 2027 -> pasa a 2028
    expect(getNewYearTargetYear(new Date(2026, 11, 31), "custom", 2030)).toBe(2030);
    expect(formatNewYearText("¡Feliz Año Nuevo {year}!", 2027)).toBe(
      "¡Feliz Año Nuevo 2027!"
    );

    // 3. Verificar rangos de fechas (incluyendo rangos que cruzan de Noviembre/Diciembre a Enero)
    expect(
      isDateInSeasonalRange(
        new Date(2026, 10, 25),
        { month: 11, day: 15 },
        { month: 1, day: 10 }
      )
    ).toBe(true);
    expect(
      isDateInSeasonalRange(
        new Date(2027, 0, 5),
        { month: 11, day: 15 },
        { month: 1, day: 10 }
      )
    ).toBe(true);
    expect(
      isDateInSeasonalRange(
        new Date(2027, 5, 15),
        { month: 11, day: 15 },
        { month: 1, day: 10 }
      )
    ).toBe(false);

    // 4. Verificar resolución automática de tema según fecha
    const scheduledTheme: ThemeConfig = {
      ...DEFAULT_THEME_CONFIG,
      autoSchedule: {
        ...DEFAULT_AUTO_SCHEDULE,
        enabled: true,
        defaultPresetKey: "chavonauta_navy",
      },
    };

    // 31 de Diciembre de 2026 -> Año Nuevo 2027 (tiene prioridad sobre Navidad)
    const newYearResolved = resolveEffectiveTheme(
      scheduledTheme,
      new Date(2026, 11, 31)
    );
    expect(newYearResolved.palette.primary).toBe(
      PRESET_PALETTES.ano_nuevo.palette.primary
    );
    expect(newYearResolved.name).toBe("Año Nuevo 2027");
    const heroSecNY = newYearResolved.sections.find((s) => s.type === "hero");
    expect(String(heroSecNY?.content?.badgeText)).toContain("2027");

    // 1 de Enero de 2028 -> Año Nuevo 2028
    const newYear2028 = resolveEffectiveTheme(
      scheduledTheme,
      new Date(2028, 0, 1)
    );
    expect(newYear2028.name).toBe("Año Nuevo 2028");
    const heroSecNY2028 = newYear2028.sections.find((s) => s.type === "hero");
    expect(String(heroSecNY2028?.content?.badgeText)).toContain("2028");

    // 10 de Diciembre -> Navidad
    const christmasResolved = resolveEffectiveTheme(
      scheduledTheme,
      new Date(2026, 11, 10)
    );
    expect(christmasResolved.palette.primary).toBe(
      PRESET_PALETTES.navidad.palette.primary
    );

    // 14 de Febrero -> Amor y Amistad (Romance)
    const valentineResolved = resolveEffectiveTheme(
      scheduledTheme,
      new Date(2027, 1, 14)
    );
    expect(valentineResolved.palette.primary).toBe(
      PRESET_PALETTES.febrero.palette.primary
    );
    expect(
      findMatchingSeasonalRule(scheduledTheme.autoSchedule, new Date(2027, 1, 14))
        ?.presetKey
    ).toBe("febrero");

    // 15 de Julio -> Fuera de temporada -> Tema base (Oficial)
    const normalDayResolved = resolveEffectiveTheme(
      scheduledTheme,
      new Date(2027, 6, 15)
    );
    expect(normalDayResolved.palette.primary).toBe(
      PRESET_PALETTES.chavonauta_navy.palette.primary
    );
  });

  it("handles dynamic color mutations without runtime failure", () => {
    // Generar 10 combinaciones aleatorias de colores hex
    for (let i = 0; i < 10; i++) {
      const randomHex = () =>
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");

      const dynamicPalette: ThemePalette = {
        ...DEFAULT_THEME_CONFIG.palette,
        primary: randomHex(),
        secondary: randomHex(),
        accent: randomHex(),
        background: randomHex(),
      };

      const dynamicTheme: ThemeConfig = {
        ...DEFAULT_THEME_CONFIG,
        palette: dynamicPalette,
      };

      const css = themeToCssVars(dynamicTheme);
      expect(css["--primary"]).toBe(dynamicPalette.primary);
      expect(css["--secondary"]).toBe(dynamicPalette.secondary);
      expect(css["--accent"]).toBe(dynamicPalette.accent);
      expect(css["--background"]).toBe(dynamicPalette.background);
    }
  });
});
