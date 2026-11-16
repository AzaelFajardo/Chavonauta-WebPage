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
} from "lucide-react";
import { SectionBlock, SectionType } from "@/types";

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
        </div>
      )}
    </div>
  );
}
