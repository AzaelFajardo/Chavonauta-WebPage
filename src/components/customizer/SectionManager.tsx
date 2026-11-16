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
import { Layers, RotateCcw } from "lucide-react";

interface SectionManagerProps {
  sections: SectionBlock[];
  onChange: (sections: SectionBlock[]) => void;
  onResetDefaultSections?: () => void;
}

export function SectionManager({
  sections,
  onChange,
  onResetDefaultSections,
}: SectionManagerProps) {
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

        {onResetDefaultSections && (
          <button
            type="button"
            onClick={onResetDefaultSections}
            title="Restablecer orden predeterminado"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

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
