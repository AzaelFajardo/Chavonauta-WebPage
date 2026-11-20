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
import { SectionBlock } from "@/types";
import { SortableSectionItem } from "./SortableSectionItem";
import { HelpCircle, Layers, Megaphone, Plus } from "lucide-react";

const OPTIONAL_SECTIONS: Array<Omit<SectionBlock, "order">> = [
  {
    id: "sec-promo-banner",
    type: "promo_banner",
    title: "Promociones y Avisos",
    subtitle: "Ofertas y novedades temporales de la sucursal.",
    enabled: false,
    content: {
      text: "",
      buttonLabel: "",
      buttonHref: "",
      badge: "",
    },
  },
  {
    id: "sec-faq",
    type: "faq",
    title: "Preguntas Frecuentes",
    subtitle: "Resolvemos las dudas más comunes antes de tu visita.",
    enabled: false,
    content: {
      items: [],
    },
  },
];

interface SectionManagerProps {
  sections: SectionBlock[];
  onChange: (sections: SectionBlock[]) => void;
}

export function SectionManager({ sections, onChange }: SectionManagerProps) {
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

  const availableSections = OPTIONAL_SECTIONS.filter(
    (template) => !sections.some((section) => section.type === template.type)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-navy-800" />
            <span>Bloques de la Página de Inicio</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Arrastra para reordenar o usa el ojo para activar u ocultar bloques.
          </p>
        </div>
      </div>

      {availableSections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableSections.map((template) => {
            const Icon =
              template.type === "promo_banner" ? Megaphone : HelpCircle;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleAddSection(template)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <Icon className="w-3.5 h-3.5" />
                <span>
                  {template.type === "promo_banner"
                    ? "Añadir promociones"
                    : "Añadir preguntas frecuentes"}
                </span>
              </button>
            );
          })}
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
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
