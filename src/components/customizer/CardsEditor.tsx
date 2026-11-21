"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  LayoutGrid,
  DollarSign,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { ShowcaseCard, ShowcaseGridItem } from "@/types";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface CardsEditorProps {
  cards: ShowcaseCard[];
  onChange: (cards: ShowcaseCard[]) => void;
}

const EMPTY_CARD: ShowcaseCard = {
  title: "Nueva tarjeta",
  description: "",
  imageUrl: "",
  badge: "",
  linkLabel: "Ver más",
  linkHref: "/catalogo",
  linkWhatsappMessage: "",
  imageLayout: "single",
  gridItems: [],
  showRentRates: false,
};

const CARD_DESTINATIONS = [
  { value: "/catalogo", label: "Catálogo completo de productos y servicios" },
  { value: "/#tarifas", label: "Bajar a: Tarifas de computadoras" },
  { value: "/#sec-services", label: "Bajar a: Servicios del Cyber" },
  { value: "/#ubicacion", label: "Bajar a: Ubicación y Horarios" },
  { value: "custom", label: "Enlace web externo personalizado..." },
];

export function CardsEditor({ cards, onChange }: CardsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editingIndex !== null) {
        setEditingIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingIndex]);

  const updateCard = (index: number, updates: Partial<ShowcaseCard>) => {
    const next = [...cards];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const addCard = () => {
    if (cards.length >= 8) return;
    const newCard: ShowcaseCard = { ...EMPTY_CARD };
    const next = [...cards, newCard];
    onChange(next);
    // Abre el popup inmediatamente para editar la tarjeta recién añadida
    setEditingIndex(next.length - 1);
  };

  const removeCard = (index: number) => {
    const next = cards.filter((_, cardIndex) => cardIndex !== index);
    onChange(next);
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const moveCard = (e: React.MouseEvent, index: number, direction: "up" | "down") => {
    e.stopPropagation();
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    const next = [...cards];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
    if (editingIndex === index) {
      setEditingIndex(targetIndex);
    }
  };

  const updateGridItem = (
    cardIndex: number,
    itemIndex: number,
    updates: Partial<ShowcaseGridItem>
  ) => {
    const items = [...(cards[cardIndex].gridItems || [])];
    items[itemIndex] = { ...items[itemIndex], ...updates };
    updateCard(cardIndex, { gridItems: items });
  };

  const addGridItem = (cardIndex: number) => {
    const items = [...(cards[cardIndex].gridItems || [])];
    if (items.length >= 6) return;
    items.push({ label: "Nuevo elemento", imageUrl: "", href: "/catalogo" });
    updateCard(cardIndex, { gridItems: items });
  };

  const removeGridItem = (cardIndex: number, itemIndex: number) => {
    const items = (cards[cardIndex].gridItems || []).filter(
      (_, index) => index !== itemIndex
    );
    updateCard(cardIndex, { gridItems: items });
  };

  const currentEditingCard =
    editingIndex !== null && cards[editingIndex] ? cards[editingIndex] : null;

  // Determinar si el destino actual del enlace es una opción conocida del selector
  const isKnownDest =
    currentEditingCard &&
    CARD_DESTINATIONS.some(
      (d) => d.value !== "custom" && d.value === currentEditingCard.linkHref
    );

  const modalContent =
    currentEditingCard !== null && editingIndex !== null ? (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={(e) => {
          if (e.target === e.currentTarget) setEditingIndex(null);
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="card-modal-title"
          className="w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del Modal */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <h3
                  id="card-modal-title"
                  className="font-bold text-sm text-slate-800 leading-tight"
                >
                  {currentEditingCard.title?.trim()
                    ? `Configurar: ${currentEditingCard.title}`
                    : "Nueva Tarjeta"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tarjeta {editingIndex + 1} de {cards.length}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditingIndex(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cuerpo del Modal (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Título de la tarjeta */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Título principal de la tarjeta *
              </label>
              <input
                type="text"
                value={currentEditingCard.title || ""}
                onChange={(e) =>
                  updateCard(editingIndex, { title: e.target.value })
                }
                placeholder="Ej. Renta de PC e Internet, Centro de Impresiones..."
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Descripción o texto explicativo
              </label>
              <textarea
                rows={2}
                value={currentEditingCard.description || ""}
                onChange={(e) =>
                  updateCard(editingIndex, { description: e.target.value })
                }
                placeholder="Explica brevemente los servicios o ventajas de esta tarjeta..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
              />
            </div>

            {/* Selector de Distribución Visual */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Tipo de presentación visual
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    updateCard(editingIndex, { imageLayout: "single" })
                  }
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    currentEditingCard.imageLayout !== "grid"
                      ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500 text-blue-900"
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <ImageIcon className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <span className="block font-bold text-xs">
                      Imagen única principal
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      Una sola fotografía destacada para el servicio o producto.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateCard(editingIndex, { imageLayout: "grid" })
                  }
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    currentEditingCard.imageLayout === "grid"
                      ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500 text-blue-900"
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <span className="block font-bold text-xs">
                      Cuadrícula de 4 fotos
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      Hasta 4 sub-elementos con miniaturas e hipervínculos independientes.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Contenido según distribución */}
            {currentEditingCard.imageLayout === "grid" ? (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-xs text-slate-800">
                      Elementos de la cuadrícula ({currentEditingCard.gridItems?.length || 0}/4)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Ideal para desglosar servicios con su propia foto (ej. B/N, Color, Escaneo, Enmicado).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addGridItem(editingIndex)}
                    disabled={(currentEditingCard.gridItems?.length || 0) >= 4}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir foto</span>
                  </button>
                </div>

                {(!currentEditingCard.gridItems ||
                  currentEditingCard.gridItems.length === 0) && (
                  <p className="text-[11px] text-slate-400 italic text-center py-3">
                    No hay elementos añadidos aún. Haz clic en &quot;Añadir foto&quot;.
                  </p>
                )}

                <div className="space-y-2.5">
                  {(currentEditingCard.gridItems || []).map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="p-3 rounded-lg border border-slate-200 bg-white space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-700">
                          Elemento {itemIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            removeGridItem(editingIndex, itemIndex)
                          }
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Eliminar elemento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                            Texto / Etiqueta
                          </label>
                          <input
                            type="text"
                            value={item.label || ""}
                            onChange={(e) =>
                              updateGridItem(editingIndex, itemIndex, {
                                label: e.target.value,
                              })
                            }
                            placeholder="Ej. Impresión B/N"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                            Enlace al hacer clic (opcional)
                          </label>
                          <input
                            type="text"
                            value={item.href || ""}
                            onChange={(e) =>
                              updateGridItem(editingIndex, itemIndex, {
                                href: e.target.value,
                              })
                            }
                            placeholder="/catalogo o https://..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          />
                        </div>
                      </div>

                      <ImageUploader
                        compact={true}
                        value={item.imageUrl || ""}
                        onChange={(url) =>
                          updateGridItem(editingIndex, itemIndex, {
                            imageUrl: url,
                          })
                        }
                        label="Fotografía del elemento"
                        helperText="Selecciona un archivo desde tu computadora (JPG, PNG, WEBP, JFIF, etc.)."
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <ImageUploader
                  compact={false}
                  value={currentEditingCard.imageUrl || ""}
                  onChange={(url) =>
                    updateCard(editingIndex, { imageUrl: url })
                  }
                  label="Fotografía principal de la tarjeta"
                  helperText="Selecciona o arrastra una imagen desde tu computadora (JPG, PNG, WEBP, JFIF, AVIF, etc.)."
                />

                <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={currentEditingCard.showRentRates === true}
                    onChange={(e) =>
                      updateCard(editingIndex, {
                        showRentRates: e.target.checked,
                      })
                    }
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block font-bold text-xs text-slate-800">
                      Mostrar tarifas de renta de computadoras
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      Muestra automáticamente la tarifa oficial configurada ($7.00/hr y $4.00/media hr).
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Etiqueta / Badge */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Etiqueta destacada en esquina (opcional)
              </label>
              <input
                type="text"
                value={currentEditingCard.badge || ""}
                onChange={(e) =>
                  updateCard(editingIndex, { badge: e.target.value })
                }
                placeholder="Ej. Oferta, Popular, Destacado..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            {/* Configuración de Enlace y Botón */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <span className="block font-bold text-xs text-slate-800">
                Botón o Enlace de Acción
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Texto del botón
                  </label>
                  <input
                    type="text"
                    value={currentEditingCard.linkLabel || ""}
                    onChange={(e) =>
                      updateCard(editingIndex, { linkLabel: e.target.value })
                    }
                    placeholder="Ej. Ver más, Ver tarifas, Ver catálogo..."
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Destino al hacer clic
                  </label>
                  <select
                    value={
                      isKnownDest
                        ? currentEditingCard.linkHref
                        : currentEditingCard.linkHref
                        ? "custom"
                        : "/catalogo"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "custom") {
                        if (isKnownDest) {
                          updateCard(editingIndex, { linkHref: "" });
                        }
                      } else {
                        updateCard(editingIndex, { linkHref: val });
                      }
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 cursor-pointer"
                  >
                    {CARD_DESTINATIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Si es enlace personalizado */}
              {!isKnownDest && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Enlace personalizado (URL completa o ruta)
                  </label>
                  <input
                    type="text"
                    value={currentEditingCard.linkHref || ""}
                    onChange={(e) =>
                      updateCard(editingIndex, { linkHref: e.target.value })
                    }
                    placeholder="https://... o /catalogo"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Contacto por WhatsApp directo */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Contacto directo por WhatsApp (opcional)</span>
              </div>
              <input
                type="text"
                value={currentEditingCard.linkWhatsappMessage || ""}
                onChange={(e) =>
                  updateCard(editingIndex, {
                    linkWhatsappMessage: e.target.value,
                  })
                }
                placeholder="Ej. Hola Chavonauta, deseo consultar o enviar archivos para este servicio..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-emerald-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-800"
              />
              <span className="text-[10px] text-emerald-700 block leading-relaxed">
                Si completas este mensaje, el enlace abrirá WhatsApp directamente con ese texto predefinido listo para enviar.
              </span>
            </div>
          </div>

          {/* Footer del Modal */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/90">
            <button
              type="button"
              onClick={() => removeCard(editingIndex)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar tarjeta</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Tarjeta</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-2.5">
      {/* Encabezado con contador y botón de añadir */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-slate-800 block">
            Tarjetas de Escaparate ({cards.length}/8)
          </span>
          <span className="text-[10px] text-slate-400">
            Haz clic sobre cualquier tarjeta para editarla.
          </span>
        </div>
        <button
          type="button"
          onClick={addCard}
          disabled={cards.length >= 8}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir tarjeta</span>
        </button>
      </div>

      {/* Lista de tarjetas */}
      {cards.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center bg-slate-50/50">
          <p className="text-xs text-slate-500 font-medium">
            No hay tarjetas configuradas.
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Haz clic en &quot;Añadir tarjeta&quot; para crear la primera.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {cards.map((card, index) => {
            const isSingle = card.imageLayout !== "grid";
            const hasThumbnail = isSingle && Boolean(card.imageUrl);

            return (
              <div
                key={index}
                onClick={() => setEditingIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEditingIndex(index);
                  }
                }}
                className="group relative flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer text-left"
              >
                {/* Miniatura / Icono */}
                <div className="w-11 h-11 rounded-lg shrink-0 overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {hasThumbnail ? (
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : card.imageLayout === "grid" ? (
                    <LayoutGrid className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Información de la tarjeta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {card.title?.trim() || `Tarjeta ${index + 1}`}
                    </span>
                    {card.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded shrink-0">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {card.imageLayout === "grid"
                      ? `Cuadrícula (${card.gridItems?.length || 0} fotos)`
                      : card.description || "Foto única principal"}
                  </p>

                  <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-400">
                    {card.showRentRates && (
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">
                        Tarifas PC
                      </span>
                    )}
                    {card.linkWhatsappMessage && (
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">
                        WhatsApp directo
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Reordenar */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => moveCard(e, index, "up")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                      title="Mover arriba"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === cards.length - 1}
                      onClick={(e) => moveCard(e, index, "down")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                      title="Mover abajo"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Botón editar */}
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 group-hover:bg-blue-100 rounded-md transition-colors">
                    <Pencil className="w-3 h-3" />
                    <span className="hidden sm:inline">Editar</span>
                  </span>

                  {/* Botón eliminar */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCard(index);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar tarjeta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Popup mediante Portal para escapar del contenedor del personalizador */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </div>
  );
}
