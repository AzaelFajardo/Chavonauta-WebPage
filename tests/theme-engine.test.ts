import { describe, it, expect } from "vitest";
import { PRESET_PALETTES, themeToCssVars } from "@/lib/theme-engine";
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
