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
  MessageCircle,
  Star,
} from "lucide-react";
import {
  FaqItem,
  HeroCtaButton,
  SectionBlock,
  SectionType,
  ShowcaseCard,
} from "@/types";
import {
  DEFAULT_HERO_CARDS,
  DEFAULT_SERVICES_CARDS,
} from "@/lib/content-defaults";
import { CardsEditor } from "./CardsEditor";
import { ImageUploader } from "@/components/ui/ImageUploader";

const HERO_DESTINATIONS = [
  { value: "/catalogo", label: "Catálogo completo de productos y servicios" },
  { value: "#sec-services", label: "Bajar a: Servicios Digitales" },
  { value: "#sec-rates", label: "Bajar a: Tarifas de Equipos y Consolas" },
  { value: "#sec-location", label: "Bajar a: Ubicación y Horarios" },
  { value: "#sec-promo-banner", label: "Bajar a: Promociones y Avisos" },
  { value: "#sec-faq", label: "Bajar a: Preguntas Frecuentes" },
  { value: "custom", label: "Enlace web externo personalizado..." },
];

interface SortableSectionItemProps {
  section: SectionBlock;
  onToggleEnabled: (id: string) => void;
  onUpdateContent: (id: string, updates: Partial<SectionBlock>) => void;
  onRemove?: (id: string) => void;
  featuredProductsCount?: number;
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
    label: "Servicios Digitales",
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
  featuredProductsCount,
}: SortableSectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOptional = section.type === "promo_banner" || section.type === "faq";
  const isFeaturedSection = section.type === "featured_catalog";
  const hasNoFeaturedProducts = isFeaturedSection && featuredProductsCount === 0;
  const isEffectivelyEnabled = hasNoFeaturedProducts ? false : section.enabled;

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
  const showWhatsAppButton = section.content?.showWhatsAppButton !== false;

  const heroCustomButtons: HeroCtaButton[] = Array.isArray(section.content?.customButtons)
    ? (section.content.customButtons as HeroCtaButton[])
    : [
        {
          id: "btn-primary",
          label: heroPrimaryCtaText || "Ver Todo el Catálogo",
          destination: heroPrimaryCtaHref || "/catalogo",
        },
      ];

  const updateHeroButtons = (newButtons: HeroCtaButton[]) => {
    const primary = newButtons[0];
    onUpdateContent(section.id, {
      content: {
        ...section.content,
        customButtons: newButtons,
        primaryCtaText: primary ? primary.label : "",
        primaryCtaHref: primary
          ? primary.destination === "custom"
            ? primary.customUrl || ""
            : primary.destination
          : "",
      },
    });
  };

  const addHeroButton = () => {
    if (heroCustomButtons.length >= 4) return;
    const newBtn: HeroCtaButton = {
      id: `btn-${Date.now()}`,
      label: "Nuevo Botón",
      destination: "/catalogo",
    };
    updateHeroButtons([...heroCustomButtons, newBtn]);
  };

  const removeHeroButton = (id: string) => {
    updateHeroButtons(heroCustomButtons.filter((b) => b.id !== id));
  };

  const updateHeroButton = (id: string, updates: Partial<HeroCtaButton>) => {
    const next = heroCustomButtons.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    updateHeroButtons(next);
  };

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
            isEffectivelyEnabled
              ? "bg-blue-50 text-blue-800"
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
            {!isEffectivelyEnabled && (
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
          title={
            hasNoFeaturedProducts
              ? "Oculto automáticamente porque no hay productos destacados en el catálogo"
              : section.enabled
              ? "Ocultar sección"
              : "Mostrar sección"
          }
          className={`p-1.5 rounded-lg transition-colors ${
            isEffectivelyEnabled
              ? "text-emerald-600 hover:bg-emerald-50"
              : "text-slate-400 hover:bg-slate-200"
          }`}
        >
          {isEffectivelyEnabled ? (
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

          {/* Subtítulo únicamente para secciones que efectivamente lo usan en portada (Hero, Promociones y FAQ) */}
          {(section.type === "hero" ||
            section.type === "promo_banner" ||
            section.type === "faq") && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {section.type === "hero"
                  ? "Descripción o Mensaje del Banner"
                  : "Subtítulo de la Sección"}
              </label>
              <textarea
                rows={2}
                value={section.subtitle || ""}
                onChange={(e) =>
                  onUpdateContent(section.id, { subtitle: e.target.value })
                }
                placeholder={
                  section.type === "hero"
                    ? "Texto explicativo principal visible debajo del título..."
                    : "Breve explicación visible debajo del título..."
                }
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 resize-none"
              />
            </div>
          )}

          {/* Información específica para Productos Destacados: SOLO aparece si no hay ninguno */}
          {isFeaturedSection && hasNoFeaturedProducts && (
            <div className="pt-2.5 border-t border-slate-200/80">
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-900">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Productos Destacados en Portada</span>
                </div>
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  Esta sección muestra automáticamente los productos marcados con la estrella de <strong>Destacado</strong> en el panel de Catálogo.
                </p>
                <p className="text-[10px] text-amber-900 font-semibold leading-relaxed">
                  Si no hay ningún producto marcado como destacado, la sección se oculta automáticamente de la página.
                </p>
              </div>
            </div>
          )}

          {section.type === "hero" && (
            <div className="pt-3 border-t border-slate-200/80 space-y-3.5">
              <span className="text-[11px] font-bold text-slate-800 block">
                Contenido del Banner Principal (Hero)
              </span>

              {/* Etiqueta superior */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Texto de la etiqueta superior (Badge)
                </label>
                <input
                  type="text"
                  value={heroBadgeText}
                  onChange={(e) =>
                    updateContentField("badgeText", e.target.value)
                  }
                  placeholder="Ej. Catálogo Oficial y Servicios en Sucursal"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              {/* Botón directo de WhatsApp */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Botón directo de WhatsApp</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showWhatsAppButton}
                      onChange={(e) =>
                        updateContentField("showWhatsAppButton", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-[11px] font-semibold text-slate-700">
                      {showWhatsAppButton ? "Visible" : "Oculto"}
                    </span>
                  </label>
                </div>
                <p className="text-[11px] text-slate-500">
                  Muestra un botón destacado en el hero que abre directamente WhatsApp para consultas rápidas.
                </p>
                {showWhatsAppButton && (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Texto del botón de WhatsApp
                    </label>
                    <input
                      type="text"
                      value={heroSecondaryCtaText || "Contactar por WhatsApp"}
                      onChange={(e) =>
                        updateContentField("secondaryCtaText", e.target.value)
                      }
                      placeholder="Contactar por WhatsApp"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* Botones de Acción Personalizados */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-800">
                      Botones de Acción ({heroCustomButtons.length})
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Configura hacia dónde llevan los botones del banner
                    </span>
                  </div>
                  {heroCustomButtons.length < 4 && (
                    <button
                      type="button"
                      onClick={addHeroButton}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir botón</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {heroCustomButtons.map((btn, idx) => {
                    const isKnownDest = HERO_DESTINATIONS.some((d) => d.value === btn.destination && d.value !== "custom");
                    const isCustom = btn.destination === "custom" || !isKnownDest;

                    return (
                      <div
                        key={btn.id || idx}
                        className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Botón {idx + 1} {idx === 0 && "(Principal)"}
                          </span>
                          {heroCustomButtons.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHeroButton(btn.id)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Eliminar botón"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Texto del botón
                            </label>
                            <input
                              type="text"
                              value={btn.label}
                              onChange={(e) =>
                                updateHeroButton(btn.id, { label: e.target.value })
                              }
                              placeholder="Ej. Ver Todo el Catálogo"
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Destino del botón
                            </label>
                            <select
                              value={isCustom ? "custom" : btn.destination}
                              onChange={(e) => {
                                const dest = e.target.value;
                                updateHeroButton(btn.id, {
                                  destination: dest,
                                  customUrl: dest === "custom" ? (btn.customUrl || "") : undefined,
                                });
                              }}
                              className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 cursor-pointer"
                            >
                              {HERO_DESTINATIONS.map((dest) => (
                                <option key={dest.value} value={dest.value}>
                                  {dest.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {isCustom && (
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              URL personalizada (ej: https://... o enlace externo)
                            </label>
                            <input
                              type="text"
                              value={btn.customUrl ?? btn.destination}
                              onChange={(e) =>
                                updateHeroButton(btn.id, {
                                  destination: "custom",
                                  customUrl: e.target.value,
                                })
                              }
                              placeholder="https://..."
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fotografía de la Sucursal (Lado Derecho del Banner) */}
              <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-2.5 shadow-2xs">
                <ImageUploader
                  value={heroSideImageUrl}
                  onChange={(url) => updateContentField("sideImageUrl", url)}
                  label="Fotografía de la sucursal (Lado derecho del banner)"
                  helperText="Se muestra al lado derecho del banner principal en computadoras. Sube una foto de tus computadoras, consolas o instalaciones."
                  placeholderText="Haz clic o arrastra una foto desde tu equipo"
                />

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Texto sobre la fotografía (opcional)
                  </label>
                  <input
                    type="text"
                    value={heroSideImageBadge}
                    onChange={(e) =>
                      updateContentField("sideImageBadge", e.target.value)
                    }
                    placeholder="Ej. Equipos Gamer, Renta de PC, Alta Velocidad..."
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
                  <span>Mostrar automáticamente la tarifa actual de renta de PC ($X / hora)</span>
                </label>
              </div>
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
