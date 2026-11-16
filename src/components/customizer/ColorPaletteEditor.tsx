"use client";

import React from "react";
import { ThemeConfig, ThemePalette } from "@/types";
import { PRESET_PALETTES } from "@/lib/theme-engine";
import { Palette, Check, Sparkles, Sliders } from "lucide-react";

interface ColorPaletteEditorProps {
  theme: ThemeConfig;
  onChange: (updates: Partial<ThemeConfig>) => void;
}

const RADIUS_OPTIONS: { label: string; value: ThemeConfig["radius"] }[] = [
  { label: "Recto (0)", value: "0rem" },
  { label: "Suave (0.5rem)", value: "0.5rem" },
  { label: "Redondo (0.75rem)", value: "0.75rem" },
  { label: "Pronunciado (1rem)", value: "1rem" },
  { label: "Píldora (Max)", value: "9999px" },
];

const FONT_OPTIONS = [
  { label: "Inter (Moderna y Limpia)", value: "Inter, system-ui, sans-serif" },
  { label: "Space Grotesk (Tech / Espacial)", value: "'Space Grotesk', system-ui, sans-serif" },
  { label: "Roboto (Industrial y Clara)", value: "Roboto, system-ui, sans-serif" },
  { label: "Poppins (Amigable y Geométrica)", value: "Poppins, system-ui, sans-serif" },
];

export function ColorPaletteEditor({
  theme,
  onChange,
}: ColorPaletteEditorProps) {
  const currentPalette = theme.palette;

  const handlePaletteField = (field: keyof ThemePalette, value: string) => {
    onChange({
      palette: {
        ...currentPalette,
        [field]: value,
      },
    });
  };

  const applyPreset = (presetKey: string) => {
    const preset = PRESET_PALETTES[presetKey];
    if (preset) {
      onChange({
        mode: preset.mode,
        palette: { ...preset.palette },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Presets Oficiales */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-navy-800" />
          <span>Paletas Prediseñadas</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.entries(PRESET_PALETTES).map(([key, preset]) => {
            const isSelected =
              currentPalette.primary === preset.palette.primary &&
              currentPalette.background === preset.palette.background;

            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "border-navy-800 bg-navy-50/60 ring-2 ring-navy-800/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">
                    {preset.label}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-navy-800 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                {/* Muestra de colores del preset */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: preset.palette.primary }}
                    title="Primario"
                  />
                  <div
                    className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: preset.palette.secondary }}
                    title="Secundario"
                  />
                  <div
                    className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: preset.palette.accent }}
                    title="Acento"
                  />
                  <div
                    className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: preset.palette.background }}
                    title="Fondo"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Fino de Colores */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-navy-800" />
          <span>Ajuste de Colores Individuales</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* Color Primario */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <span className="block text-[11px] font-semibold text-slate-700">
              Color Primario
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.primary}
                onChange={(e) => handlePaletteField("primary", e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase">
                {currentPalette.primary}
              </span>
            </div>
          </div>

          {/* Color Acento */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <span className="block text-[11px] font-semibold text-slate-700">
              Color Acento
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.accent}
                onChange={(e) => handlePaletteField("accent", e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase">
                {currentPalette.accent}
              </span>
            </div>
          </div>

          {/* Color de Fondo */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <span className="block text-[11px] font-semibold text-slate-700">
              Fondo General
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.background}
                onChange={(e) => handlePaletteField("background", e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase">
                {currentPalette.background}
              </span>
            </div>
          </div>

          {/* Color de Texto */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <span className="block text-[11px] font-semibold text-slate-700">
              Texto Principal
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.foreground}
                onChange={(e) => handlePaletteField("foreground", e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase">
                {currentPalette.foreground}
              </span>
            </div>
          </div>

          {/* Fondo de Tarjetas */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <span className="block text-[11px] font-semibold text-slate-700">
              Fondo de Tarjetas
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.card}
                onChange={(e) => handlePaletteField("card", e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase">
                {currentPalette.card}
              </span>
            </div>
          </div>

          {/* Bordes */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <span className="block text-[11px] font-semibold text-slate-700">
              Bordes y Líneas
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.border}
                onChange={(e) => handlePaletteField("border", e.target.value)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase">
                {currentPalette.border}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Redondeo de Bordes */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-navy-800" />
          <span>Estilo de Bordes y Esquinas</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ radius: opt.value })}
              className={`p-2.5 text-xs font-semibold rounded-xl border transition-all text-center ${
                theme.radius === opt.value
                  ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipografía */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
          Tipografía de Títulos y Encabezados
        </label>
        <select
          value={theme.fonts?.heading || FONT_OPTIONS[0].value}
          onChange={(e) =>
            onChange({
              fonts: {
                ...theme.fonts,
                heading: e.target.value,
              },
            })
          }
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
