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
  Plus,
  Trash2,
} from "lucide-react";
import {
  FaqItem,
  HeroFallingIconsConfig,
  HeroIconPackKey,
  SectionBlock,
  SectionType,
  ShowcaseCard,
} from "@/types";
import {
  DEFAULT_HERO_CARDS,
  DEFAULT_SERVICES_CARDS,
} from "@/lib/content-defaults";
import { CardsEditor } from "./CardsEditor";

interface SortableSectionItemProps {
  section: SectionBlock;
  onToggleEnabled: (id: string) => void;
  onUpdateContent: (id: string, updates: Partial<SectionBlock>) => void;
  onRemove?: (id: string) => void;
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
  onRemove,
}: SortableSectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOptional = section.type === "promo_banner" || section.type === "faq";

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

  const promoText =
    typeof section.content?.text === "string" ? section.content.text : "";
  const promoButtonLabel =
    typeof section.content?.buttonLabel === "string"
      ? section.content.buttonLabel
      : "";
  const promoButtonHref =
    typeof section.content?.buttonHref === "string"
      ? section.content.buttonHref
      : "";
  const promoBadge =
    typeof section.content?.badge === "string" ? section.content.badge : "";

  const faqItems: FaqItem[] = Array.isArray(section.content?.items)
    ? (section.content.items as FaqItem[])
    : [];

  const showcaseCards: ShowcaseCard[] = Array.isArray(section.content?.cards)
    ? (section.content.cards as ShowcaseCard[])
    : section.type === "services"
    ? DEFAULT_SERVICES_CARDS
    : DEFAULT_HERO_CARDS;

  const heroBadgeText =
    typeof section.content?.badgeText === "string"
      ? section.content.badgeText
      : "";
  const heroPrimaryCtaText =
    typeof section.content?.primaryCtaText === "string"
      ? section.content.primaryCtaText
      : "";
  const heroPrimaryCtaHref =
    typeof section.content?.primaryCtaHref === "string"
      ? section.content.primaryCtaHref
      : "";
  const heroSecondaryCtaText =
    typeof section.content?.secondaryCtaText === "string"
      ? section.content.secondaryCtaText
      : "";
  const heroSecondaryCtaHref =
    typeof section.content?.secondaryCtaHref === "string"
      ? section.content.secondaryCtaHref
      : "";
  const heroSideImageUrl =
    typeof section.content?.sideImageUrl === "string"
      ? section.content.sideImageUrl
      : "";
  const heroSideImageBadge =
    typeof section.content?.sideImageBadge === "string"
      ? section.content.sideImageBadge
      : "";
  const heroSideImageUseRate = section.content?.sideImageUseRate !== false;

  const updateContentField = (key: string, value: unknown) => {
    onUpdateContent(section.id, {
      content: { ...section.content, [key]: value },
    });
  };

  const updateShowcaseCards = (cards: ShowcaseCard[]) => {
    onUpdateContent(section.id, {
      content: { ...section.content, cards },
    });
  };

  const updatePromo = (key: string, value: string) => {
    onUpdateContent(section.id, {
      content: { ...section.content, [key]: value },
    });
  };

  const updateFaqItems = (items: FaqItem[]) => {
    onUpdateContent(section.id, {
      content: { ...section.content, items },
    });
  };

  const addFaqItem = () => {
    updateFaqItems([...faqItems, { question: "", answer: "" }]);
  };

  const updateFaqItem = (index: number, updates: Partial<FaqItem>) => {
    const items = [...faqItems];
    items[index] = { ...items[index], ...updates };
    updateFaqItems(items);
  };

  const removeFaqItem = (index: number) => {
    updateFaqItems(faqItems.filter((_, itemIndex) => itemIndex !== index));
  };

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

        {/* Botón Eliminar Sección Opcional */}
        {isOptional && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(section.id);
            }}
            title="Eliminar bloque (volverá a recomendadas)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

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

          {section.type === "hero" && (
            <div className="pt-3 border-t border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-800">
                Banner principal
              </span>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Texto de la etiqueta superior
                </label>
                <input
                  type="text"
                  value={heroBadgeText}
                  onChange={(e) =>
                    updateContentField("badgeText", e.target.value)
                  }
                  placeholder="Catálogo Oficial y Servicios en Sucursal"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Botón principal
                  </label>
                  <input
                    type="text"
                    value={heroPrimaryCtaText}
                    onChange={(e) =>
                      updateContentField("primaryCtaText", e.target.value)
                    }
                    placeholder="Ver Todo el Catálogo"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Enlace del botón principal
                  </label>
                  <input
                    type="text"
                    value={heroPrimaryCtaHref}
                    onChange={(e) =>
                      updateContentField("primaryCtaHref", e.target.value)
                    }
                    placeholder="/catalogo"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Botón secundario
                  </label>
                  <input
                    type="text"
                    value={heroSecondaryCtaText}
                    onChange={(e) =>
                      updateContentField("secondaryCtaText", e.target.value)
                    }
                    placeholder="Contactar por WhatsApp"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Enlace secundario
                  </label>
                  <input
                    type="text"
                    value={heroSecondaryCtaHref}
                    onChange={(e) =>
                      updateContentField("secondaryCtaHref", e.target.value)
                    }
                    placeholder="Vacío = WhatsApp"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Imagen lateral
                </label>
                <input
                  type="text"
                  value={heroSideImageUrl}
                  onChange={(e) =>
                    updateContentField("sideImageUrl", e.target.value)
                  }
                  placeholder="https://... o /uploads/..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Texto sobre la imagen lateral
                </label>
                <input
                  type="text"
                  value={heroSideImageBadge}
                  onChange={(e) =>
                    updateContentField("sideImageBadge", e.target.value)
                  }
                  placeholder="Opcional si no usas la tarifa automática"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <label className="flex items-center gap-2 text-[10px] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={heroSideImageUseRate}
                  onChange={(e) =>
                    updateContentField("sideImageUseRate", e.target.checked)
                  }
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Mostrar la tarifa actual de renta de PC sobre la imagen</span>
              </label>
            </div>
          )}

          {(section.type === "hero" || section.type === "services") && (
            <div className="pt-3 border-t border-slate-200/80">
              <CardsEditor
                cards={showcaseCards}
                onChange={updateShowcaseCards}
              />
            </div>
          )}

          {section.type === "promo_banner" && (
            <div className="pt-3 border-t border-slate-200/80 space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Texto del aviso
                </label>
                <textarea
                  rows={3}
                  value={promoText}
                  onChange={(e) => updatePromo("text", e.target.value)}
                  placeholder="Ej. Paquete estudiante: 50 copias + 1 hora de internet."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Texto del botón
                  </label>
                  <input
                    type="text"
                    value={promoButtonLabel}
                    onChange={(e) =>
                      updatePromo("buttonLabel", e.target.value)
                    }
                    placeholder="Ver promoción"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Etiqueta
                  </label>
                  <input
                    type="text"
                    value={promoBadge}
                    onChange={(e) => updatePromo("badge", e.target.value)}
                    placeholder="Oferta"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Enlace del botón (opcional)
                </label>
                <input
                  type="text"
                  value={promoButtonHref}
                  onChange={(e) => updatePromo("buttonHref", e.target.value)}
                  placeholder="/catalogo o https://wa.me/..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Déjalo vacío para mostrar el aviso sin botón.
                </span>
              </div>
            </div>
          )}

          {section.type === "faq" && (
            <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-800">
                  Preguntas y respuestas
                </span>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Añadir pregunta</span>
                </button>
              </div>

              {faqItems.length === 0 ? (
                <p className="text-[11px] text-slate-400">
                  Aún no hay preguntas. Añade la primera para mostrarla en el
                  escaparate.
                </p>
              ) : (
                faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-slate-500">
                        Pregunta {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFaqItem(index)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Eliminar pregunta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.question || ""}
                      onChange={(e) =>
                        updateFaqItem(index, { question: e.target.value })
                      }
                      placeholder="¿Pregunta?"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                    />
                    <textarea
                      rows={2}
                      value={item.answer || ""}
                      onChange={(e) =>
                        updateFaqItem(index, { answer: e.target.value })
                      }
                      placeholder="Respuesta"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 resize-none"
                    />
                  </div>
                ))
              )}
            </div>
          )}

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
                <div className="p-2.5 bg-slate-100/70 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={fallingIcons.enabled === true}
                      onChange={(e) => updateFallingIcons({ enabled: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Activar Cascada
                    </span>
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
                        <option value="auto">Automático (Según el tema activo)</option>
                        <option value="space">Espacial & Chavonauta (Cohetes, Planetas, Satélites, Estrellas)</option>
                        <option value="tech">Cómputo & Tech (Laptops, Chips, Wi-Fi, Monitores, Rayos)</option>
                        <option value="gaming">Gaming & Arcade (Mandos, Joysticks, Trofeos, Cartuchos)</option>
                        <option value="christmas">Navidad (Árboles de navidad, Copos, Regalos, Campanas)</option>
                        <option value="halloween">Halloween (Calabazas, Fantasmas, Murciélagos, Calaveras)</option>
                        <option value="ocean">Océano & Gotas (Olas, Gotas, Anclas)</option>
                        <option value="sparkles">Destellos Minimalistas (Estrellas de 4 y 8 puntas)</option>
                        <option value="winter">Invierno & Hielo (Copos de nieve cristalinos)</option>
                        <option value="autumn">Otoño (Hojas secas, Bellotas, Viento)</option>
                        <option value="spring">Primavera (Flores, Mariposas, Brotes)</option>
                        <option value="coffee">Café & Relax (Tazas de café, Granos, Tetera)</option>
                        <option value="romance">Romance & Amor (Corazones, Rosas, Cartas)</option>
                        <option value="patrio">Fiestas Patrias (Sombreros, Campanas, Destellos)</option>
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
          {/* Botón inferior para eliminar bloque opcional */}
          {isOptional && onRemove && (
            <div className="pt-2 border-t border-slate-200/80 flex justify-end">
              <button
                type="button"
                onClick={() => onRemove(section.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar bloque de la página</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
