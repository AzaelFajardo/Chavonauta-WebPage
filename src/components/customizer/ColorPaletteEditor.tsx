"use client";

import React, { useState, useMemo } from "react";
import {
  CustomPreset,
  HeroFallingIconsConfig,
  HeroIconPackKey,
  ThemeConfig,
  ThemePalette,
} from "@/types";
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

const HERO_ICON_PACK_OPTIONS: { value: HeroIconPackKey; label: string; desc: string }[] = [
  { value: "auto", label: "Automático", desc: "Según el tema activo" },
  { value: "space", label: "Espacial & Chavonauta", desc: "Cohetes, Planetas, Satélites, Estrellas" },
  { value: "tech", label: "Cómputo & Tech", desc: "Laptops, Chips, Wi-Fi, Monitores, Rayos" },
  { value: "gaming", label: "Gaming & Arcade", desc: "Mandos, Joysticks, Trofeos, Cartuchos" },
  { value: "christmas", label: "Navidad", desc: "Árboles de navidad, Copos, Regalos, Campanas" },
  { value: "halloween", label: "Halloween", desc: "Calabazas, Fantasmas, Murciélagos, Calaveras" },
  { value: "ocean", label: "Océano & Gotas", desc: "Olas, Gotas, Anclas" },
  { value: "sparkles", label: "Destellos Minimalistas", desc: "Estrellas geométricas y destellos" },
  { value: "winter", label: "Invierno & Hielo", desc: "Copos de nieve cristalinos" },
  { value: "autumn", label: "Otoño", desc: "Hojas secas, Bellotas, Viento" },
  { value: "spring", label: "Primavera", desc: "Flores, Mariposas, Brotes" },
  { value: "coffee", label: "Café & Relax", desc: "Tazas de café, Granos, Tetera" },
  { value: "romance", label: "Romance & Amor", desc: "Corazones, Rosas, Cartas" },
  { value: "patrio", label: "Fiestas Patrias", desc: "Sombreros, Campanas, Destellos" },
];

interface FontOption {
  name: string;
  desc: string;
  value: string;
}

const FONT_OPTIONS: FontOption[] = [
  { name: "Inter", desc: "Moderna y Versátil", value: "'Inter', sans-serif" },
  { name: "Space Grotesk", desc: "Tech y Futurista", value: "'Space Grotesk', sans-serif" },
  { name: "Outfit", desc: "Comercial y Limpia", value: "'Outfit', sans-serif" },
  { name: "Poppins", desc: "Geométrica y Redonda", value: "'Poppins', sans-serif" },
  { name: "Montserrat", desc: "Urbana y Elegante", value: "'Montserrat', sans-serif" },
  { name: "Plus Jakarta", desc: "Corporativa y Nítida", value: "'Plus Jakarta Sans', sans-serif" },
  { name: "Orbitron", desc: "Espacial y Cyber", value: "'Orbitron', sans-serif" },
  { name: "Chakra Petch", desc: "Arcade y Gaming", value: "'Chakra Petch', sans-serif" },
  { name: "Syne", desc: "Creativa y Expresiva", value: "'Syne', sans-serif" },
  { name: "DM Sans", desc: "Minimalista y Clara", value: "'DM Sans', sans-serif" },
  { name: "Roboto", desc: "Industrial y Neutra", value: "'Roboto', sans-serif" },
  { name: "Playfair", desc: "Editorial y Clásica", value: "'Playfair Display', serif" },
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

  // Filtros de categoría: populares, estilos, temporada, custom, all
  const [filterMode, setFilterMode] = useState<
    "populares" | "estilos" | "temporada" | "custom" | "all"
  >("populares");
  const [searchQuery, setSearchQuery] = useState("");

  const POPULAR_KEYS = ["chavonauta_navy", "chavonauta_dark", "cyberpunk", "oceano"];

  // Detección automática del preset activo para sincronizar el selector desplegable
  const activePresetKey = useMemo(() => {
    for (const [key, preset] of Object.entries(PRESET_PALETTES)) {
      if (
        preset.palette.primary === currentPalette.primary &&
        preset.palette.background === currentPalette.background
      ) {
        return key;
      }
    }
    for (const cp of customPresets) {
      if (
        cp.palette.primary === currentPalette.primary &&
        cp.palette.background === currentPalette.background
      ) {
        return `custom:${cp.id}`;
      }
    }
    return "";
  }, [currentPalette, customPresets]);

  // Estado del creador de preset personalizado
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetMode, setNewPresetMode] = useState<"light" | "dark">(theme.mode || "light");

  // Estado y actualización reactiva para la cascada de iconos en el Hero
  const heroSection = theme.sections.find((s) => s.type === "hero");
  const heroFallingIcons: HeroFallingIconsConfig =
    (heroSection?.content?.fallingIcons as HeroFallingIconsConfig | undefined) || {
      enabled: false,
      pack: "auto",
      density: "balanced",
      speed: "normal",
    };

  const [newPresetFallingPack, setNewPresetFallingPack] = useState<HeroIconPackKey>(
    heroFallingIcons.pack || "auto"
  );
  const [newPresetFallingEnabled, setNewPresetFallingEnabled] = useState<boolean>(
    heroFallingIcons.enabled === true
  );

  const updateHeroFallingIcons = (updates: Partial<HeroFallingIconsConfig>) => {
    const updatedSections = theme.sections.map((s) => {
      if (s.type === "hero") {
        const currentContent = s.content || {};
        const currentFalling =
          (currentContent.fallingIcons as HeroFallingIconsConfig | undefined) || {
            enabled: true,
            pack: "auto",
            density: "balanced",
            speed: "normal",
          };
        return {
          ...s,
          content: {
            ...currentContent,
            fallingIcons: {
              ...currentFalling,
              ...updates,
            },
          },
        };
      }
      return s;
    });
    onChange({ sections: updatedSections });
  };

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
        name: preset.label,
        mode: preset.mode,
        palette: { ...preset.palette },
      });
    }
  };

  const applyCustomPreset = (preset: CustomPreset) => {
    let updatedSections = theme.sections;
    if (preset.fallingIconsEnabled !== undefined || preset.fallingIconsPack !== undefined) {
      updatedSections = theme.sections.map((s) => {
        if (s.type === "hero") {
          const currentContent = s.content || {};
          const currentFalling =
            (currentContent.fallingIcons as HeroFallingIconsConfig | undefined) || {
              enabled: true,
              pack: "auto",
              density: "balanced",
              speed: "normal",
            };
          return {
            ...s,
            content: {
              ...currentContent,
              fallingIcons: {
                ...currentFalling,
                ...(preset.fallingIconsEnabled !== undefined
                  ? { enabled: preset.fallingIconsEnabled }
                  : {}),
                ...(preset.fallingIconsPack !== undefined
                  ? { pack: preset.fallingIconsPack }
                  : {}),
              },
            },
          };
        }
        return s;
      });
    }

    onChange({
      mode: preset.mode,
      palette: { ...preset.palette },
      sections: updatedSections,
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
      fallingIconsPack: newPresetFallingPack,
      fallingIconsEnabled: newPresetFallingEnabled,
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
      // Si el usuario escribe una búsqueda, busca en todo el catálogo
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return p.label.toLowerCase().includes(q) || key.toLowerCase().includes(q);
      }

      // Filtro por categoría seleccionada
      if (filterMode === "populares") return POPULAR_KEYS.includes(key);
      if (filterMode === "estilos") return p.category === "estilos" && !POPULAR_KEYS.includes(key);
      if (filterMode === "temporada") return p.category === "temporada";
      if (filterMode === "custom") return false;
      return true; // "all"
    });
  }, [filterMode, searchQuery]);

  // Filtrado de presets personalizados
  const filteredCustomPresets = useMemo(() => {
    if (filterMode !== "all" && filterMode !== "custom" && filterMode !== "populares") return [];
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

        {/* Selector Desplegable Rápido (1 Clic, Sin Scroll) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Tema activo:</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {activePresetKey && !activePresetKey.startsWith("custom:")
                ? PRESET_PALETTES[activePresetKey]?.label || "Personalizado"
                : activePresetKey
                  ? customPresets.find((c) => `custom:${c.id}` === activePresetKey)?.label || "Personalizado"
                  : "Personalizado (manual)"}
            </span>
          </div>

          <div className="relative">
            <select
              value={activePresetKey}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                if (val.startsWith("custom:")) {
                  const id = val.replace("custom:", "");
                  const p = customPresets.find((cp) => cp.id === id);
                  if (p) applyCustomPreset(p);
                } else {
                  applyOfficialPreset(val);
                }
              }}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 shadow-2xs hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition-colors"
            >
              <option value="" disabled>
                {activePresetKey ? "Cambiar de tema..." : "Personalizado (ajuste manual)"}
              </option>
              <optgroup label="Populares & Oficiales">
                <option value="chavonauta_navy">Oficial — Azul Marino</option>
                <option value="chavonauta_dark">Espacial — Modo Oscuro</option>
                <option value="cyberpunk">Cyber — Neón Gamer</option>
                <option value="oceano">Océano — Azul Celeste</option>
              </optgroup>
              <optgroup label="Estilos & Tendencias">
                <option value="esmeralda">Esmeralda — Verde Fresco</option>
                <option value="lavanda">Lavanda — Violeta Suave</option>
                <option value="atardecer">Atardecer — Naranja Cálido</option>
                <option value="titanio">Titanio — Gris Oscuro Pro</option>
                <option value="minimalista">Minimal — Monocromático</option>
                <option value="cafe">Moca — Café y Ámbar</option>
                <option value="neon">Neón — Negro y Verde Esmeralda</option>
                <option value="dorado">Dorado — Negro y Oro</option>
                <option value="glaciar">Glaciar — Azul Hielo</option>
              </optgroup>
              <optgroup label="Temporadas & Festivos">
                <option value="navidad">Navidad — Rojo y Verde Pino</option>
                <option value="halloween">Halloween — Negro y Naranja</option>
                <option value="patrio">Patrio — Verde y Rojo</option>
                <option value="otono">Otoño — Ámbar y Canela</option>
                <option value="febrero">Romance — Rosa y Carmesí</option>
                <option value="primavera">Primavera — Verde Menta</option>
              </optgroup>
              {customPresets.length > 0 && (
                <optgroup label="Mis Paletas Guardadas">
                  {customPresets.map((cp) => (
                    <option key={cp.id} value={`custom:${cp.id}`}>
                      {cp.label}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
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
              placeholder="Buscar paleta por nombre..."
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
              onClick={() => setFilterMode("populares")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${filterMode === "populares" && !searchQuery
                ? "bg-blue-600 text-white font-bold shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Populares
            </button>

            <button
              type="button"
              onClick={() => setFilterMode("estilos")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${filterMode === "estilos" && !searchQuery
                ? "bg-blue-600 text-white font-bold shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Estilos
            </button>

            <button
              type="button"
              onClick={() => setFilterMode("temporada")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${filterMode === "temporada" && !searchQuery
                ? "bg-blue-600 text-white font-bold shadow-2xs"
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
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${filterMode === "custom" && !searchQuery
                  ? "bg-blue-600 text-white font-bold shadow-2xs"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
              >
                <Star className="w-3 h-3 text-amber-400" />
                <span>Mis Paletas ({customPresets.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-[11px] ${filterMode === "all" && !searchQuery
                ? "bg-blue-600 text-white font-bold shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Todas (19)
            </button>
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

            {/* Cascada de Iconos para el nuevo tema */}
            <div className="pt-2 border-t border-blue-200/80 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newPresetFallingEnabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    setNewPresetFallingEnabled(enabled);
                    updateHeroFallingIcons({ enabled });
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-800">
                  Activar Cascada para este tema
                </span>
              </label>

              {newPresetFallingEnabled && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Tipo de Cascada:
                  </label>
                  <select
                    value={newPresetFallingPack}
                    onChange={(e) => {
                      const pack = e.target.value as HeroIconPackKey;
                      setNewPresetFallingPack(pack);
                      updateHeroFallingIcons({ pack, enabled: true });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 cursor-pointer shadow-2xs"
                  >
                    {HERO_ICON_PACK_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.desc})
                      </option>
                    ))}
                  </select>
                </div>
              )}
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

        {/* Cuadrícula Ergonómica de Presets en Flujo Natural (Sin scroll anidado) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Presets Personalizados */}
          {filteredCustomPresets.map((preset) => {
            const isSelected =
              currentPalette.primary === preset.palette.primary &&
              currentPalette.background === preset.palette.background;

            return (
              <div
                key={preset.id}
                onClick={() => applyCustomPreset(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer group flex flex-col justify-between ${isSelected
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
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${isSelected
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

        {/* Casilla de Verificación y Opciones de Personalización para la Cascada de Iconos en el Hero */}
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 shadow-2xs space-y-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={heroFallingIcons.enabled === true}
              onChange={(e) => updateHeroFallingIcons({ enabled: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
            />
            <span className="text-xs font-bold text-slate-800">
              Activar Cascada
            </span>
          </label>

          {heroFallingIcons.enabled === true && (
            <div className="space-y-3 pt-2 border-t border-blue-200/70 animate-in fade-in duration-150">
              {/* Selector de Paquete de Iconos */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Paquete de Iconos Alegóricos
                </label>
                <select
                  value={heroFallingIcons.pack || "auto"}
                  onChange={(e) =>
                    updateHeroFallingIcons({
                      pack: e.target.value as HeroIconPackKey,
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 cursor-pointer shadow-2xs"
                >
                  {HERO_ICON_PACK_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.desc})
                    </option>
                  ))}
                </select>
              </div>

              {/* Densidad y Velocidad en 2 columnas */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Densidad */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Cantidad de Iconos
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: "subtle", label: "Suave" },
                      { key: "balanced", label: "Media" },
                      { key: "lively", label: "Viva" },
                    ].map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() =>
                          updateHeroFallingIcons({
                            density: d.key as "subtle" | "balanced" | "lively",
                          })
                        }
                        className={`py-1 text-[10px] font-semibold rounded-md border text-center transition-all ${
                          (heroFallingIcons.density || "balanced") === d.key
                            ? "border-blue-600 bg-blue-600 text-white font-bold shadow-2xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Velocidad */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Velocidad de Caída
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: "slow", label: "Serena" },
                      { key: "normal", label: "Normal" },
                      { key: "fast", label: "Rápida" },
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() =>
                          updateHeroFallingIcons({
                            speed: s.key as "slow" | "normal" | "fast",
                          })
                        }
                        className={`py-1 text-[10px] font-semibold rounded-md border text-center transition-all ${
                          (heroFallingIcons.speed || "normal") === s.key
                            ? "border-blue-600 bg-blue-600 text-white font-bold shadow-2xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
          {RADIUS_OPTIONS.map((opt) => {
            const isSelected = theme.radius === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ radius: opt.value })}
                className={`p-2 text-xs font-semibold rounded-xl border transition-all text-center relative ${isSelected
                  ? "border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/20 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
                  }`}
              >
                <span className={`block text-xs font-bold ${isSelected ? "text-blue-950" : "text-slate-800"}`}>
                  {opt.label}
                </span>
                <span
                  className={`block text-[10px] mt-0.5 font-mono ${isSelected ? "text-blue-700 font-semibold" : "opacity-70 text-slate-500"
                    }`}
                >
                  {opt.desc}
                </span>
              </button>
            );
          })}
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
          <span>Familia Tipográfica</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((font) => {
            const isSelected =
              theme.fonts?.heading === font.value ||
              (theme.fonts?.heading &&
                theme.fonts.heading.toLowerCase().includes(font.name.toLowerCase())) ||
              (!theme.fonts?.heading && font.name === "Inter");

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
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${isSelected
                  ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 shadow-xs"
                  : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
                  }`}
              >
                <div className="flex items-start justify-between gap-1 w-full">
                  <div>
                    <span
                      style={{ fontFamily: font.value }}
                      className={`block text-xs font-bold leading-tight ${isSelected ? "text-blue-950" : "text-slate-900"
                        }`}
                    >
                      {font.name}
                    </span>
                    <span
                      className={`block text-[10px] mt-0.5 leading-snug ${isSelected ? "text-blue-700 font-medium" : "text-slate-500 opacity-70"
                        }`}
                    >
                      {font.desc}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div
                  style={{ fontFamily: font.value }}
                  className={`mt-2 pt-1.5 border-t text-xs font-semibold truncate tracking-wide ${isSelected ? "border-blue-200 text-blue-900" : "border-slate-100 text-slate-600"
                    }`}
                >
                  Aa Bb 123
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
