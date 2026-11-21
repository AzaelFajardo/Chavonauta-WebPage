"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
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
  linkLabel: "",
  linkHref: "",
  linkWhatsappMessage: "",
  imageLayout: "single",
  gridItems: [],
  showRentRates: false,
};

export function CardsEditor({ cards, onChange }: CardsEditorProps) {
  const updateCard = (index: number, updates: Partial<ShowcaseCard>) => {
    const next = [...cards];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const addCard = () => {
    if (cards.length >= 8) return;
    onChange([...cards, { ...EMPTY_CARD }]);
  };

  const removeCard = (index: number) => {
    onChange(cards.filter((_, cardIndex) => cardIndex !== index));
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
    items.push({ label: "Nuevo enlace", imageUrl: "", href: "" });
    updateCard(cardIndex, { gridItems: items });
  };

  const removeGridItem = (cardIndex: number, itemIndex: number) => {
    const items = (cards[cardIndex].gridItems || []).filter(
      (_, index) => index !== itemIndex
    );
    updateCard(cardIndex, { gridItems: items });
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-800">
          Tarjetas ({cards.length})
        </span>
        <button
          type="button"
          onClick={addCard}
          disabled={cards.length >= 8}
          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus className="w-3 h-3" />
          <span>Añadir tarjeta</span>
        </button>
      </div>

      {cards.length === 0 ? (
        <p className="text-[11px] text-slate-400">
          No hay tarjetas. Añade una para mostrarla en esta sección.
        </p>
      ) : (
        cards.map((card, index) => (
          <details
            key={index}
            className="rounded-lg border border-slate-200 bg-white"
          >
            <summary className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer text-[11px] font-semibold text-slate-800">
              <span className="truncate">
                {card.title?.trim() || `Tarjeta ${index + 1}`}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  removeCard(index);
                }}
                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors shrink-0"
                title="Eliminar tarjeta"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </summary>

            <div className="px-3 pb-3 space-y-2.5 border-t border-slate-100 pt-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={card.title || ""}
                  onChange={(e) => updateCard(index, { title: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={card.description || ""}
                  onChange={(e) =>
                    updateCard(index, { description: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Distribución
                  </label>
                  <select
                    value={card.imageLayout || "single"}
                    onChange={(e) =>
                      updateCard(index, {
                        imageLayout: e.target.value as "single" | "grid",
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 cursor-pointer"
                  >
                    <option value="single">Imagen única</option>
                    <option value="grid">Cuadrícula de 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Etiqueta
                  </label>
                  <input
                    type="text"
                    value={card.badge || ""}
                    onChange={(e) => updateCard(index, { badge: e.target.value })}
                    placeholder="Oferta, Nuevo..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
              </div>

              {card.imageLayout === "grid" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-slate-600">
                      Enlaces de la cuadrícula
                    </span>
                    <button
                      type="button"
                      onClick={() => addGridItem(index)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Añadir</span>
                    </button>
                  </div>
                  {(card.gridItems || []).map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-slate-500">
                          Elemento {itemIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeGridItem(index, itemIndex)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Eliminar elemento"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.label || ""}
                        onChange={(e) =>
                          updateGridItem(index, itemIndex, {
                            label: e.target.value,
                          })
                        }
                        placeholder="Etiqueta"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                      />
                      <ImageUploader
                        compact={true}
                        value={item.imageUrl || ""}
                        onChange={(url) =>
                          updateGridItem(index, itemIndex, {
                            imageUrl: url,
                          })
                        }
                        label="Foto del elemento"
                      />
                      <input
                        type="text"
                        value={item.href || ""}
                        onChange={(e) =>
                          updateGridItem(index, itemIndex, {
                            href: e.target.value,
                          })
                        }
                        placeholder="Enlace (opcional)"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageUploader
                    compact={true}
                    value={card.imageUrl || ""}
                    onChange={(url) =>
                      updateCard(index, { imageUrl: url })
                    }
                    label="Imagen o fotografía de la tarjeta"
                    helperText="Selecciona un archivo desde tu equipo (JPG, PNG, JFIF, WEBP, GIF, etc.)."
                  />
                  <label className="flex items-center gap-2 text-[10px] text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={card.showRentRates === true}
                      onChange={(e) =>
                        updateCard(index, { showRentRates: e.target.checked })
                      }
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Mostrar tarifa de renta de PC actualizada</span>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Texto del enlace
                  </label>
                  <input
                    type="text"
                    value={card.linkLabel || ""}
                    onChange={(e) =>
                      updateCard(index, { linkLabel: e.target.value })
                    }
                    placeholder="Ver más"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Enlace
                  </label>
                  <input
                    type="text"
                    value={card.linkHref || ""}
                    onChange={(e) =>
                      updateCard(index, { linkHref: e.target.value })
                    }
                    placeholder="/catalogo o https://..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Mensaje de WhatsApp (opcional)
                </label>
                <input
                  type="text"
                  value={card.linkWhatsappMessage || ""}
                  onChange={(e) =>
                    updateCard(index, {
                      linkWhatsappMessage: e.target.value,
                    })
                  }
                  placeholder="Hola, deseo consultar..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">
                  Si lo completas, el enlace abrirá WhatsApp con ese mensaje.
                </span>
              </div>
            </div>
          </details>
        ))
      )}
    </div>
  );
}
