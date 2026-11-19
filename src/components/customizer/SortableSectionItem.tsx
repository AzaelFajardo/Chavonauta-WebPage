"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  Monitor,
  Package,
  DollarSign,
  MapPin,
  HelpCircle,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { HeroFallingIconsConfig, HeroIconPackKey, SectionBlock, SectionType } from "@/types";

interface SortableSectionItemProps {
  section: SectionBlock;
  onToggleEnabled: (id: string) => void;
  onUpdateContent: (id: string, updates: Partial<SectionBlock>) => void;
}

const SECTION_METADATA: Record<
  SectionType,
  { label: string; icon: React.ElementType; description: string }
> = {
  hero: {
    label: "Banner Hero Principal",
    icon: LayoutTemplate,
    description: "Encabezado visual con llamada a la acción y accesos rápidos.",
  },
  featured_catalog: {
    label: "Productos Destacados",
    icon: Package,
    description: "Vitrina de artículos seleccionados en el inicio.",
  },
  services: {
    label: "Servicios del Cyber",
    icon: Monitor,
    description: "Cuadrícula informativa de servicios ofrecidos.",
  },
  rates: {
    label: "Tarifas de Equipos",
    icon: DollarSign,
    description: "Precios de renta de PC, consolas e impresiones.",
  },
  promo_banner: {
    label: "Banner Promocional",
    icon: Megaphone,
    description: "Aviso destacado de ofertas o promociones de temporada.",
  },
  location: {
    label: "Ubicación y Horarios",
    icon: MapPin,
    description: "Dirección, mapa interactivo y horas de servicio.",
  },
  faq: {
    label: "Preguntas Frecuentes",
    icon: HelpCircle,
    description: "Respuestas a dudas comunes de clientes.",
  },
};

export function SortableSectionItem({
  section,
  onToggleEnabled,
  onUpdateContent,
}: SortableSectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = SECTION_METADATA[section.type] || {
    label: section.title,
    icon: LayoutTemplate,
    description: "Bloque de sección modular",
  };
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all duration-150 ${
        isDragging
          ? "opacity-50 border-sky-400 bg-sky-50/50 shadow-md z-30"
          : section.enabled
          ? "bg-white border-slate-200/90 shadow-2xs hover:border-slate-300"
          : "bg-slate-50/80 border-slate-200/60 opacity-65"
      }`}
    >
      {/* Barra de la sección */}
      <div className="p-3 flex items-center gap-2.5">
        {/* Handle de arrastre */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-grab active:cursor-grabbing touch-none"
          title="Arrastrar para reordenar"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Ícono de sección */}
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            section.enabled
              ? "bg-navy-50 text-navy-800"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900 truncate">
              {meta.label}
            </span>
            {!section.enabled && (
              <span className="text-[10px] font-medium text-slate-400 bg-slate-200/80 px-1.5 py-0.2 rounded">
                Oculto
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {section.title || meta.description}
          </p>
        </div>

        {/* Switch Visible / Oculto */}
        <button
          type="button"
          onClick={() => onToggleEnabled(section.id)}
          title={section.enabled ? "Ocultar sección" : "Mostrar sección"}
          className={`p-1.5 rounded-lg transition-colors ${
            section.enabled
              ? "text-emerald-600 hover:bg-emerald-50"
              : "text-slate-400 hover:bg-slate-200"
          }`}
        >
          {section.enabled ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>

        {/* Botón expandir editor */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Editor de Contenido de la Sección */}
      {isExpanded && (
        <div className="p-3.5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3 rounded-b-xl animate-in slide-in-from-top-1 duration-150">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Título de la Sección
            </label>
            <input
              type="text"
              value={section.title || ""}
              onChange={(e) =>
                onUpdateContent(section.id, { title: e.target.value })
              }
              placeholder="Ej. Tecnología y servicios en un solo lugar"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Subtítulo / Descripción
            </label>
            <textarea
              rows={2}
              value={section.subtitle || ""}
              onChange={(e) =>
                onUpdateContent(section.id, { subtitle: e.target.value })
              }
              placeholder="Breve explicación visible debajo del título..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-600 text-slate-800 resize-none"
            />
          </div>

          {/* Configuración de Cascada de Iconos Animados para el Hero Banner */}
          {section.type === "hero" && (() => {
            const fallingIcons = (section.content?.fallingIcons as HeroFallingIconsConfig | undefined) || {
              enabled: true,
              pack: "auto",
              density: "balanced",
              speed: "normal",
            };

            const updateFallingIcons = (updates: Partial<HeroFallingIconsConfig>) => {
              onUpdateContent(section.id, {
                content: {
                  ...section.content,
                  fallingIcons: {
                    ...fallingIcons,
                    ...updates,
                  },
                },
              });
            };

            return (
              <div className="pt-3 border-t border-slate-200/80 space-y-3">
                {/* Casilla de verificación (Check) para activar la cascada de forma opcional */}
                <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={fallingIcons.enabled === true}
                      onChange={(e) => updateFallingIcons({ enabled: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Activar Cascada</span>
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Lluvia suave de figuras minimalistas alusivas al tema sobre el fondo del Hero
                      </span>
                    </div>
                  </label>
                </div>

                {fallingIcons.enabled === true && (
                  <div className="space-y-3 pt-2 bg-slate-100/70 p-3 rounded-xl border border-slate-200 animate-in fade-in duration-150">
                    {/* Selector de Paquete de Iconos */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Paquete de Iconos Alegóricos
                      </label>
                      <select
                        value={fallingIcons.pack || "auto"}
                        onChange={(e) =>
                          updateFallingIcons({
                            pack: e.target.value as HeroIconPackKey,
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 cursor-pointer shadow-2xs"
                      >
                        <option value="auto">✨ Automático (Según el tema activo)</option>
                        <option value="christmas">🎄 Navidad (Árboles de navidad, Copos, Regalos, Campanas)</option>
                        <option value="halloween">🎃 Halloween (Calabazas, Fantasmas, Murciélagos, Calaveras)</option>
                        <option value="space">🚀 Espacial & Chavonauta (Cohetes, Planetas, Satélites, Estrellas)</option>
                        <option value="tech">💻 Cómputo & Tech (Laptops, Chips, Wi-Fi, Monitores, Rayos)</option>
                        <option value="gaming">🎮 Gaming & Arcade (Mandos, Joysticks, Trofeos, Cartuchos)</option>
                        <option value="romance">💖 Romance & Amor (Corazones, Rosas, Cartas)</option>
                        <option value="autumn">🍂 Otoño (Hojas secas, Bellotas, Viento)</option>
                        <option value="spring">🌸 Primavera (Flores, Mariposas, Brotes)</option>
                        <option value="winter">❄️ Invierno & Hielo (Copos de nieve cristalinos)</option>
                        <option value="ocean">🌊 Océano & Gotas (Olas, Gotas, Anclas)</option>
                        <option value="coffee">☕ Café & Relax (Tazas de café, Granos, Tetera)</option>
                        <option value="sparkles">✨ Destellos Minimalistas (Estrellas de 4 y 8 puntas)</option>
                        <option value="patrio">🇲🇽 Fiestas Patrias (Sombreros, Campanas, Destellos)</option>
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
                                updateFallingIcons({
                                  density: d.key as "subtle" | "balanced" | "lively",
                                })
                              }
                              className={`py-1 text-[10px] font-semibold rounded-md border text-center transition-all ${
                                (fallingIcons.density || "balanced") === d.key
                                  ? "border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs"
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
                                updateFallingIcons({
                                  speed: s.key as "slow" | "normal" | "fast",
                                })
                              }
                              className={`py-1 text-[10px] font-semibold rounded-md border text-center transition-all ${
                                (fallingIcons.speed || "normal") === s.key
                                  ? "border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs"
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
            );
          })()}

          {/* Configuración específica para tarifas de renta de computadoras */}
          {section.type === "rates" && (
            <div className="pt-2.5 border-t border-slate-200/80 space-y-2">
              <span className="block text-[11px] font-bold text-slate-800">
                Tarifas de Renta de Equipos (MXN)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    Tarifa 1 Hora ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={
                      (section.content?.computerRates as { oneHour?: number } | undefined)?.oneHour ?? 7
                    }
                    onChange={(e) => {
                      const currentRates =
                        (section.content?.computerRates as { oneHour?: number; halfHour?: number } | undefined) || {};
                      onUpdateContent(section.id, {
                        content: {
                          ...section.content,
                          computerRates: {
                            ...currentRates,
                            oneHour: parseFloat(e.target.value) || 0,
                          },
                        },
                      });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    Tarifa Media Hora ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={
                      (section.content?.computerRates as { halfHour?: number } | undefined)?.halfHour ?? 4
                    }
                    onChange={(e) => {
                      const currentRates =
                        (section.content?.computerRates as { oneHour?: number; halfHour?: number } | undefined) || {};
                      onUpdateContent(section.id, {
                        content: {
                          ...section.content,
                          computerRates: {
                            ...currentRates,
                            halfHour: parseFloat(e.target.value) || 0,
                          },
                        },
                      });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
