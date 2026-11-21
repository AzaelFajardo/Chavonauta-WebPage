"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CatalogItem, SectionBlock } from "@/types";
import { SortableSectionItem } from "./SortableSectionItem";
import { HelpCircle, Layers, Megaphone, Plus } from "lucide-react";

const OPTIONAL_SECTIONS: Array<Omit<SectionBlock, "order">> = [
  {
    id: "sec-promo-banner",
    type: "promo_banner",
    title: "Promociones y Avisos",
    subtitle: "Ofertas y novedades temporales de la sucursal.",
    enabled: true,
    content: {
      text: "Aprovecha nuestras promociones especiales en tienda y servicios digitales.",
      buttonLabel: "Consultar por WhatsApp",
      buttonHref: "",
      badge: "Promoción Especial",
    },
  },
  {
    id: "sec-faq",
    type: "faq",
    title: "Preguntas Frecuentes",
    subtitle: "Resolvemos las dudas más comunes antes de tu visita.",
    enabled: true,
    content: {
      items: [
        {
          question: "¿Cuáles son los horarios de atención de la sucursal?",
          answer: "Lunes a Viernes de 8:00 a 22:00, Sábados y Domingos de 12:00 a 22:00.",
        },
        {
          question: "¿Tienen servicio de impresiones y trámites digitales?",
          answer: "Sí, contamos con impresiones a color y blanco/negro, escaneo, trámites y soporte.",
        },
      ],
    },
  },
];

interface SectionManagerProps {
  sections: SectionBlock[];
  onChange: (sections: SectionBlock[]) => void;
  items?: CatalogItem[];
}

export function SectionManager({ sections, onChange, items }: SectionManagerProps) {
  const featuredProductsCount = items
    ? items.filter(
        (i) => i.type === "product" && i.featured === true && i.active !== false
      ).length
    : undefined;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(sections, oldIndex, newIndex).map(
        (sec, index) => ({
          ...sec,
          order: index + 1,
        })
      );
      onChange(reordered);
    }
  };

  const handleToggleEnabled = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    onChange(updated);
  };

  const handleUpdateContent = (id: string, updates: Partial<SectionBlock>) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    onChange(updated);
  };

  const handleAddSection = (template: Omit<SectionBlock, "order">) => {
    if (sections.some((section) => section.type === template.type)) return;
    const nextOrder =
      sections.reduce((max, section) => Math.max(max, section.order), 0) + 1;
    onChange([...sections, { ...template, order: nextOrder }]);
  };

  const handleRemoveSection = (id: string) => {
    const updated = sections
      .filter((s) => s.id !== id)
      .map((sec, index) => ({
        ...sec,
        order: index + 1,
      }));
    onChange(updated);
  };

  const availableSections = OPTIONAL_SECTIONS.filter(
    (template) => !sections.some((section) => section.type === template.type)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-700" />
            <span>Bloques de la Página de Inicio</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Arrastra para reordenar o usa el ojo para activar u ocultar bloques.
          </p>
        </div>
      </div>

      {availableSections.length > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Bloques recomendados para añadir:
          </span>
          <div className="flex flex-wrap gap-2">
            {availableSections.map((template) => {
              const Icon =
                template.type === "promo_banner" ? Megaphone : HelpCircle;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleAddSection(template)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <Icon className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {template.type === "promo_banner"
                      ? "Añadir Promociones"
                      : "Añadir Preguntas Frecuentes"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                onToggleEnabled={handleToggleEnabled}
                onUpdateContent={handleUpdateContent}
                onRemove={handleRemoveSection}
                featuredProductsCount={featuredProductsCount}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
