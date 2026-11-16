"use client";

import React, { useState, useEffect } from "react";
import { CatalogItem, Category, ItemBadge } from "@/types";
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";

interface CatalogItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<CatalogItem>) => Promise<void>;
  item: CatalogItem | null; // null means creating new
  categories: Category[];
}

const AVAILABLE_BADGES: ItemBadge[] = ["Nuevo", "Oferta", "Popular", "Destacado"];

const IMAGE_PRESETS = [
  {
    label: "Computadora / Cyber",
    url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Impresora / Papelería",
    url: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Teclado",
    url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Mouse",
    url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Memoria USB",
    url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Audífonos",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Cables y Carga",
    url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Reparación y Soporte",
    url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
  },
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CatalogItemModal({
  isOpen,
  onClose,
  onSave,
  item,
  categories,
}: CatalogItemModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [customSlug, setCustomSlug] = useState(false);
  const [type, setType] = useState<"product" | "service">("product");
  const [categorySlug, setCategorySlug] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [referencePrice, setReferencePrice] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [badges, setBadges] = useState<ItemBadge[]>([]);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setSlug(item.slug || "");
      setCustomSlug(true);
      setType(item.type || "product");
      setCategorySlug(item.categorySlug || (categories[0]?.slug as string) || "accesorios-computo");
      setPriceLabel(item.priceLabel || "");
      setReferencePrice(item.referencePrice !== undefined ? String(item.referencePrice) : "");
      setImageUrl(item.imageUrl || "");
      setShortDescription(item.shortDescription || "");
      setDescription(item.description || "");
      setBadges(item.badges || []);
      setFeatured(Boolean(item.featured));
      setActive(item.active !== undefined ? item.active : true);
      setSpecs(item.specs || []);
    } else {
      // Defaults for new item
      setName("");
      setSlug("");
      setCustomSlug(false);
      setType("product");
      setCategorySlug(categories[0]?.slug ? String(categories[0].slug) : "accesorios-computo");
      setPriceLabel("");
      setReferencePrice("");
      setImageUrl(IMAGE_PRESETS[2].url); // Default keyboard/peripheral
      setShortDescription("");
      setDescription("");
      setBadges([]);
      setFeatured(false);
      setActive(true);
      setSpecs([]);
    }
    setErrorMessage(null);
  }, [item, categories, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!customSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleBadgeToggle = (badge: ItemBadge) => {
    if (badges.includes(badge)) {
      setBadges(badges.filter((b) => b !== badge));
    } else {
      setBadges([...badges, badge]);
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: "", value: "" }]);
  };

  const handleUpdateSpec = (index: number, field: "label" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("El nombre es obligatorio.");
      return;
    }

    if (!categorySlug) {
      setErrorMessage("Debes seleccionar una categoría.");
      return;
    }

    if (!priceLabel.trim()) {
      setErrorMessage("El precio o tarifa es obligatorio (ej. $150.00 o $7.00 / hr).");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanSpecs = specs
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
        .filter((s) => s.label.length > 0 && s.value.length > 0);

      const payload: Partial<CatalogItem> = {
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        type,
        categorySlug,
        priceLabel: priceLabel.trim(),
        referencePrice: referencePrice.trim() ? parseFloat(referencePrice) : undefined,
        imageUrl: imageUrl.trim() || IMAGE_PRESETS[0].url,
        shortDescription: shortDescription.trim() || name.trim(),
        description: description.trim() || shortDescription.trim() || name.trim(),
        badges,
        featured,
        active,
        specs: cleanSpecs,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error al guardar los cambios.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Encabezado del Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              {item ? "Editar Artículo del Catálogo" : "Nuevo Producto o Servicio"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {item
                ? `Modifica los datos de "${item.name}"`
                : "Agrega un nuevo producto o servicio para mostrar en el catálogo"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario con Scroll */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sección 1: Información Básica */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">
              1. Información Principal
            </h3>

            {/* Tipo: Producto vs Servicio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tipo de Artículo <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("product")}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    type === "product"
                      ? "bg-navy-50 border-navy-600 text-navy-800 ring-1 ring-navy-500"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-navy-600" />
                  <span>Producto Físico (Accesorio, Snack, etc.)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType("service")}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    type === "service"
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 ring-1 ring-indigo-500"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Servicio (Renta PC, Impresión, Mantenimiento)</span>
                </button>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del {type === "product" ? "Producto" : "Servicio"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={
                  type === "product"
                    ? "ej. Mouse Inalámbrico Ergonómico USB"
                    : "ej. Renta de Computadora por Hora"
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                required
              />
            </div>

            {/* Categoría y Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 bg-white"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Slug URL (identificador)
                  </label>
                  {!customSlug && (
                    <button
                      type="button"
                      onClick={() => setCustomSlug(true)}
                      className="text-[11px] text-navy-600 hover:underline"
                    >
                      Editar manual
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setCustomSlug(true);
                    setSlug(e.target.value);
                  }}
                  readOnly={!customSlug}
                  placeholder="ej. mouse-ergonomico-usb"
                  className={`w-full px-3 py-2 text-sm rounded-lg border text-xs font-mono ${
                    customSlug
                      ? "border-slate-300 bg-white focus:ring-2 focus:ring-navy-500"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Precios y Visibilidad */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">
              2. Precios y Visibilidad en Tienda
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Etiqueta de Precio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texto de Precio / Tarifa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={priceLabel}
                  onChange={(e) => setPriceLabel(e.target.value)}
                  placeholder={
                    type === "product"
                      ? "ej. $180.00 ó $15.00 c/u"
                      : "ej. $7.00 / hr ó Desde $150.00"
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Es el texto exacto que verá el cliente en la tarjeta y detalle.
                </p>
              </div>

              {/* Precio Numérico de Referencia */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Precio Numérico (opcional, para ordenar)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.5"
                    value={referencePrice}
                    onChange={(e) => setReferencePrice(e.target.value)}
                    placeholder="ej. 7.00 ó 180"
                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Permite ordenar en el catálogo por precio de menor a mayor.
                </p>
              </div>
            </div>

            {/* Switches de Activo y Destacado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {active ? "Activo en el Catálogo" : "Pausado (Oculto al público)"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Si está pausado, no aparecerá en el catálogo ni en búsquedas.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-navy-600 rounded border-slate-300 focus:ring-navy-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Destacar en Portada de Inicio
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Aparecerá en la sección de productos y servicios destacados del inicio.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Sección 3: Imagen y Multimedia */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">
              3. Fotografía o Imagen
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL de la Imagen
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                />
              </div>
            </div>

            {/* Presets rápidos de imágenes */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                Fotos de muestra rápidas (puedes hacer clic en una para usarla):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-navy-50 hover:text-navy-700 text-slate-700 border border-slate-200 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview de la imagen */}
            {imageUrl && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Vista previa de imagen</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-sm">{imageUrl}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sección 4: Descripciones */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">
              4. Descripciones
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción Corta (1-2 oraciones para la tarjeta)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="ej. Fibra óptica simétrica, paquetería Office e impresión directa desde tu estación."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción Detallada (Página de detalle del producto/servicio)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los beneficios, compatibilidad, alcances del servicio, recomendaciones, etc."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              />
            </div>
          </div>

          {/* Sección 5: Etiquetas (Badges) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">
              5. Etiquetas Visuales (Badges)
            </h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_BADGES.map((b) => {
                const isSelected = badges.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBadgeToggle(b)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all border ${
                      isSelected
                        ? "bg-navy-800 text-white border-navy-800 shadow-sm"
                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sección 6: Ficha Técnica / Especificaciones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
                6. Ficha Técnica o Características Específicas
              </h3>
              <button
                type="button"
                onClick={handleAddSpec}
                className="inline-flex items-center gap-1 text-xs font-semibold text-navy-700 hover:text-navy-900"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar campo</span>
              </button>
            </div>

            {specs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Sin especificaciones técnicas adicionales. Puedes agregar pares como
                &quot;Garantía: 30 días&quot; o &quot;Conexión: USB 3.0&quot;.
              </p>
            ) : (
              <div className="space-y-2">
                {specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Característica (ej. Garantía)"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(idx, "label", e.target.value)}
                      className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-500"
                    />
                    <input
                      type="text"
                      placeholder="Valor (ej. 30 días con nosotros)"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer del Modal con Acciones */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-navy-800 hover:bg-navy-700 text-white shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>{item ? "Guardar Cambios" : "Crear Artículo"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
