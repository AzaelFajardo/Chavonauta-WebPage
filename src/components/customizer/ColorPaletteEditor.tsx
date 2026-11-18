"use client";

import React, { useState, useMemo } from "react";
import { CustomPreset, ThemeConfig, ThemePalette } from "@/types";
import { PRESET_PALETTES } from "@/lib/theme-engine";
import {
  Palette,
  Check,
  Sparkles,
  Sliders,
  Plus,
  Trash2,
  X,
  Type,
  Search,
  Sun,
  Moon,
  Gift,
  Star,
  Info,
} from "lucide-react";

interface ColorPaletteEditorProps {
  theme: ThemeConfig;
  onChange: (updates: Partial<ThemeConfig>) => void;
}

const RADIUS_OPTIONS: { label: string; desc: string; value: ThemeConfig["radius"] }[] = [
  { label: "Recto", desc: "0px", value: "0rem" },
  { label: "Suave", desc: "8px", value: "0.5rem" },
  { label: "Redondo", desc: "12px", value: "0.75rem" },
  { label: "Curvo", desc: "16px", value: "1rem" },
  { label: "Píldora", desc: "Cápsula", value: "9999px" },
];

const FONT_OPTIONS = [
  { label: "Inter (Moderna y Limpia)", value: "'Inter', sans-serif" },
  { label: "Space Grotesk (Tech / Espacial)", value: "'Space Grotesk', sans-serif" },
  { label: "Roboto (Industrial y Clara)", value: "'Roboto', sans-serif" },
  { label: "Poppins (Amigable y Geométrica)", value: "'Poppins', sans-serif" },
];

function getContrastForeground(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  if (hex.length < 6) return "#ffffff";
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#0f172a" : "#ffffff";
}

export function ColorPaletteEditor({
  theme,
  onChange,
}: ColorPaletteEditorProps) {
  const currentPalette = theme.palette;
  const customPresets = theme.customPresets || [];

  // Filtros de categoría: todas, claras, oscuras, festivas, custom
  const [filterMode, setFilterMode] = useState<"all" | "light" | "dark" | "temporada" | "custom">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Estado del creador de preset personalizado
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetMode, setNewPresetMode] = useState<"light" | "dark">(theme.mode || "light");

  const handlePaletteField = (field: keyof ThemePalette, value: string) => {
    const updatedPalette = {
      ...currentPalette,
      [field]: value,
    };

    // Ajuste automático de contraste inteligente para legibilidad óptima
    if (field === "primary") {
      updatedPalette.primaryForeground = getContrastForeground(value);
    } else if (field === "secondary") {
      updatedPalette.secondaryForeground = getContrastForeground(value);
    } else if (field === "accent") {
      updatedPalette.accentForeground = getContrastForeground(value);
    } else if (field === "card") {
      updatedPalette.cardForeground = getContrastForeground(value);
    } else if (field === "background") {
      updatedPalette.foreground = getContrastForeground(value);
    }

    onChange({
      palette: updatedPalette,
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

    // Asegurar que el nombre sea conciso (1 palabra preferente o corto)
    const cleanName = newPresetName.trim().split(" ")[0];

    const newPreset: CustomPreset = {
      id: `custom-preset-${Date.now()}`,
      label: cleanName,
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
    setFilterMode("custom");
  };

  const handleDeleteCustomPreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter((p) => p.id !== id);
    onChange({
      customPresets: updated,
    });
  };

  // Filtrado reactivo de presets oficiales
  const filteredOfficialEntries = useMemo(() => {
    return Object.entries(PRESET_PALETTES).filter(([key, p]) => {
      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.label.toLowerCase().includes(q) || key.toLowerCase().includes(q);
        if (!matchesName) return false;
      }

      // Filtro por categoría o modo
      if (filterMode === "all") return true;
      if (filterMode === "light") return p.mode === "light";
      if (filterMode === "dark") return p.mode === "dark";
      if (filterMode === "temporada") return p.category === "temporada";
      if (filterMode === "custom") return false;
      return true;
    });
  }, [filterMode, searchQuery]);

  // Filtrado de presets personalizados
  const filteredCustomPresets = useMemo(() => {
    if (filterMode !== "all" && filterMode !== "custom") return [];
    if (!searchQuery.trim()) return customPresets;
    return customPresets.filter((p) =>
      p.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [filterMode, searchQuery, customPresets]);

  return (
    <div className="space-y-5">
      {/* 1. Selector de Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Paletas Prediseñadas</span>
          </label>

          <button
            type="button"
            onClick={() => setIsCreatingPreset(!isCreatingPreset)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors border border-blue-200 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva paleta</span>
          </button>
        </div>

        {/* Buscador + Píldoras compactas de categoría */}
        <div className="space-y-2">
          {/* Buscador rápido */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar paleta (ej. Océano, Cyber, Oficial)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categorías en fila horizontal limpia */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
                filterMode === "all"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todas ({Object.keys(PRESET_PALETTES).length + customPresets.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode("light")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
                filterMode === "light"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Sun className="w-3 h-3 text-amber-500" />
              <span>Claras</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterMode("dark")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
                filterMode === "dark"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Moon className="w-3 h-3 text-indigo-400" />
              <span>Oscuras</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterMode("temporada")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
                filterMode === "temporada"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Gift className="w-3 h-3 text-emerald-500" />
              <span>Festivas</span>
            </button>

            {customPresets.length > 0 && (
              <button
                type="button"
                onClick={() => setFilterMode("custom")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${
                  filterMode === "custom"
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <Star className="w-3 h-3 text-amber-400" />
                <span>Mis Paletas ({customPresets.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Formulario Inline para Crear Nuevo Preset Personalizado */}
        {isCreatingPreset && (
          <form
            onSubmit={handleSaveCustomPreset}
            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 space-y-3 animate-in fade-in zoom-in-98 duration-150 shadow-xs"
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
                Nombre (1 palabra preferente):
              </label>
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Ej. Galaxy, Menta, Fuego..."
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 mr-1">Colores:</span>
                <div
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: currentPalette.primary }}
                  title="Primario"
                />
                <div
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: currentPalette.accent }}
                  title="Acento"
                />
                <div
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: currentPalette.background }}
                  title="Fondo"
                />
                <div
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
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
                  Guardar
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Cuadrícula Compacta y Ergonómica de Presets (Diseño Swatch-Chip) */}
        <div className="grid grid-cols-2 gap-2 max-h-[290px] overflow-y-auto pr-1">
          {/* Presets Personalizados */}
          {filteredCustomPresets.map((preset) => {
            const isSelected =
              currentPalette.primary === preset.palette.primary &&
              currentPalette.background === preset.palette.background;

            return (
              <div
                key={preset.id}
                onClick={() => applyCustomPreset(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {preset.label}
                    </span>
                    {isSelected && (
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2" />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                    className="text-slate-400 hover:text-red-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar preset"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* 4 puntos de color en cadena */}
                <div className="flex items-center -space-x-1">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: preset.palette.primary }}
                    title="Primario"
                  />
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: preset.palette.secondary }}
                    title="Secundario"
                  />
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: preset.palette.accent }}
                    title="Acento"
                  />
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: preset.palette.background }}
                    title="Fondo"
                  />
                </div>
              </div>
            );
          })}

          {/* Presets Oficiales */}
          {filteredOfficialEntries.map(([key, preset]) => {
            const isSelected =
              currentPalette.primary === preset.palette.primary &&
              currentPalette.background === preset.palette.background;

            return (
              <button
                key={key}
                type="button"
                onClick={() => applyOfficialPreset(key)}
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {preset.label}
                    </span>
                    {isSelected && (
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2" />
                      </div>
                    )}
                  </div>

                  {preset.mode === "dark" ? (
                    <span title="Modo oscuro">
                      <Moon className="w-3 h-3 text-indigo-400 shrink-0" />
                    </span>
                  ) : (
                    <span title="Modo claro">
                      <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                    </span>
                  )}
                </div>

                {/* 4 puntos de color en cadena horizontal compacta */}
                <div className="flex items-center -space-x-1">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: preset.palette.primary }}
                    title="Primario"
                  />
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: preset.palette.secondary }}
                    title="Secundario"
                  />
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: preset.palette.accent }}
                    title="Acento"
                  />
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: preset.palette.background }}
                    title="Fondo"
                  />
                </div>
              </button>
            );
          })}

          {filteredOfficialEntries.length === 0 && filteredCustomPresets.length === 0 && (
            <div className="col-span-2 py-6 text-center text-xs text-slate-400">
              No se encontraron paletas con el filtro aplicado.
            </div>
          )}
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
              Color Primario (Header/Botones)
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

          {/* Color Secundario */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Color Secundario (Subnavbar)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentPalette.secondary}
                onChange={(e) => handlePaletteField("secondary", e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-transparent"
              />
              <span className="text-[11px] font-mono text-slate-600 uppercase font-semibold">
                {currentPalette.secondary}
              </span>
            </div>
          </div>

          {/* Color de Fondo */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Fondo General
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

          {/* Color de Tarjetas */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Fondo de Tarjetas
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

          {/* Color de Acento */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Color de Acento (Badges)
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

          {/* Color de Bordes */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
            <span className="block text-[11px] font-semibold text-slate-700">
              Bordes y Líneas
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
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Estilo de Bordes y Esquinas</span>
        </label>

        <div className="grid grid-cols-5 gap-1.5">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ radius: opt.value })}
              className={`p-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                theme.radius === opt.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="block text-xs font-bold">{opt.label}</span>
              <span className="block text-[10px] opacity-70 mt-0.5 font-mono">{opt.desc}</span>
            </button>
          ))}
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2 text-[11px] text-slate-500">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            {theme.radius === "9999px"
              ? "En modo Píldora, los botones y badges toman forma de cápsula y las tarjetas se redondean armoniosamente para que el contenido nunca se salga de los bordes."
              : "Afecta a todas las tarjetas, contenedores, botones y campos de búsqueda de la tienda."}
          </span>
        </div>
      </div>

      {/* 4. Tipografía Global y Títulos */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-blue-600" />
          <span>Familia Tipográfica (En Vivo)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((font) => {
            const isSelected =
              theme.fonts?.heading === font.value ||
              (!theme.fonts?.heading && font.value.includes("Inter"));

            return (
              <button
                key={font.value}
                type="button"
                onClick={() =>
                  onChange({
                    fonts: {
                      heading: font.value,
                      body: font.value,
                    },
                  })
                }
                style={{ fontFamily: font.value }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="block text-xs font-bold leading-tight">
                  {font.label.split(" (")[0]}
                </span>
                <span className="block text-[10px] opacity-75 mt-0.5">
                  {font.label.split(" (")[1]?.replace(")", "") || ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
