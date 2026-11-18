"use client";

import React, { useState } from "react";
import { CustomPreset, ThemeConfig, ThemePalette } from "@/types";
import { PRESET_PALETTES } from "@/lib/theme-engine";
import {
  Palette,
  Check,
  Sparkles,
  Sliders,
  Plus,
  Trash2,
  Calendar,
  Layers,
  X,
  Type,
} from "lucide-react";

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
  const customPresets = theme.customPresets || [];

  // Filtro de categorías para los presets
  const [filterCategory, setFilterCategory] = useState<"all" | "temporada" | "estilos" | "custom">("all");

  // Estado del creador de preset personalizado
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetMode, setNewPresetMode] = useState<"light" | "dark">(theme.mode || "light");

  const handlePaletteField = (field: keyof ThemePalette, value: string) => {
    onChange({
      palette: {
        ...currentPalette,
        [field]: value,
      },
    });
  };

  const applyOfficialPreset = (presetKey: string) => {
    const preset = PRESET_PALETTES[presetKey];
    if (preset) {
      onChange({
        mode: preset.mode,
        palette: { ...preset.palette },
      });
    }
  };

  const applyCustomPreset = (preset: CustomPreset) => {
    onChange({
      mode: preset.mode,
      palette: { ...preset.palette },
    });
  };

  const handleSaveCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newPreset: CustomPreset = {
      id: `custom-preset-${Date.now()}`,
      label: newPresetName.trim(),
      mode: newPresetMode,
      palette: { ...currentPalette },
      createdAt: new Date().toISOString(),
    };

    const updated = [newPreset, ...customPresets];
    onChange({
      customPresets: updated,
    });

    setNewPresetName("");
    setIsCreatingPreset(false);
    setFilterCategory("custom");
  };

  const handleDeleteCustomPreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter((p) => p.id !== id);
    onChange({
      customPresets: updated,
    });
  };

  // Filtrar los presets oficiales según pestaña activa
  const officialEntries = Object.entries(PRESET_PALETTES).filter(([, p]) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "temporada") return p.category === "temporada";
    if (filterCategory === "estilos") return p.category === "estilos" || p.category === "oficial";
    return false;
  });

  return (
    <div className="space-y-6">
      {/* 1. Selector de Presets y Filtros */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Paletas y Temas Prediseñados</span>
          </label>

          <button
            type="button"
            onClick={() => setIsCreatingPreset(!isCreatingPreset)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear mi paleta</span>
          </button>
        </div>

        {/* Píldoras de filtrado de presets */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
              filterCategory === "all"
                ? "bg-slate-900 text-white font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todas ({Object.keys(PRESET_PALETTES).length + customPresets.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory("temporada")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
              filterCategory === "temporada"
                ? "bg-slate-900 text-white font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Festivas & Temporadas (5)
          </button>

          <button
            type="button"
            onClick={() => setFilterCategory("estilos")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
              filterCategory === "estilos"
                ? "bg-slate-900 text-white font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Estilos & Modo Oscuro (5)
          </button>

          {customPresets.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterCategory("custom")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
                filterCategory === "custom"
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Mis Creadas ({customPresets.length})
            </button>
          )}
        </div>

        {/* Formulario Inline para Crear Nuevo Preset Personalizado */}
        {isCreatingPreset && (
          <form
            onSubmit={handleSaveCustomPreset}
            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 space-y-3 animate-in fade-in zoom-in-98 duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                <span>Guardar combinación actual como nuevo Preset</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingPreset(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nombre de tu nueva paleta:
              </label>
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Ej. Mi Estilo Gamer, Verano Chavonauta..."
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              {/* Muestra de los colores actuales que se guardarán */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 mr-1">Colores:</span>
                <div
                  className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: currentPalette.primary }}
                  title="Primario"
                />
                <div
                  className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: currentPalette.accent }}
                  title="Acento"
                />
                <div
                  className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: currentPalette.background }}
                  title="Fondo"
                />
                <div
                  className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: currentPalette.card }}
                  title="Tarjetas"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsCreatingPreset(false)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                >
                  Guardar paleta
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Cuadrícula de Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {/* Presets Personalizados Creados por el Usuario */}
          {(filterCategory === "all" || filterCategory === "custom") &&
            customPresets.map((preset) => {
              const isSelected =
                currentPalette.primary === preset.palette.primary &&
                currentPalette.background === preset.palette.background;

              return (
                <div
                  key={preset.id}
                  onClick={() => applyCustomPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer group ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {preset.label}
                        </span>
                        {isSelected && (
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2 h-2" />
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded inline-block mt-0.5">
                        Personalizada
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
                      title="Eliminar preset personal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Muestra de 4 colores */}
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
                </div>
              );
            })}

          {/* Presets Oficiales (Festivos, Estilos, etc.) */}
          {filterCategory !== "custom" &&
            officialEntries.map(([key, preset]) => {
              const isSelected =
                currentPalette.primary === preset.palette.primary &&
                currentPalette.background === preset.palette.background;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyOfficialPreset(key)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0 pr-1">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {preset.label}
                      </span>
                      {preset.mode === "dark" && (
                        <span className="text-[9px] font-semibold text-slate-500">
                          Modo oscuro
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Muestra de 4 colores del preset */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: preset.palette.primary }}
                      title="Color Primario"
                    />
                    <div
                      className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: preset.palette.secondary }}
                      title="Color Secundario"
                    />
                    <div
                      className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: preset.palette.accent }}
                      title="Color de Acento"
                    />
                    <div
                      className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: preset.palette.background }}
                      title="Color de Fondo"
                    />
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* 2. Ajuste Fino de Colores Individuales */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-blue-600" />
          <span>Ajuste de Colores Individuales</span>
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Color Primario */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Color Primario (Header y Botones)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.primary}
                onChange={(e) => handlePaletteField("primary", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase font-semibold">
                {currentPalette.primary}
              </span>
            </div>
          </div>

          {/* Color Acento */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Color Acento (Destacados y Ofertas)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.accent}
                onChange={(e) => handlePaletteField("accent", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase font-semibold">
                {currentPalette.accent}
              </span>
            </div>
          </div>

          {/* Color de Fondo General */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Fondo General de la Web
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.background}
                onChange={(e) => handlePaletteField("background", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase font-semibold">
                {currentPalette.background}
              </span>
            </div>
          </div>

          {/* Color de Texto */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Texto Principal
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.foreground}
                onChange={(e) => handlePaletteField("foreground", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase font-semibold">
                {currentPalette.foreground}
              </span>
            </div>
          </div>

          {/* Fondo de Tarjetas */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Fondo de Tarjetas y Secciones
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.card}
                onChange={(e) => handlePaletteField("card", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase font-semibold">
                {currentPalette.card}
              </span>
            </div>
          </div>

          {/* Bordes y Líneas */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Bordes y Divisiones
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.border}
                onChange={(e) => handlePaletteField("border", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase font-semibold">
                {currentPalette.border}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Estilo de Bordes y Esquinas */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-blue-600" />
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
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tipografía de Títulos */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-blue-600" />
          <span>Tipografía de Títulos y Encabezados</span>
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
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
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
