"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  Monitor,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { CatalogItem, Category, ItemBadge } from "@/types";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface ItemFormModalProps {
  item: CatalogItem | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<CatalogItem>) => Promise<void>;
  isSaving: boolean;
}

const AVAILABLE_BADGES: ItemBadge[] = ["Nuevo", "Oferta", "Popular", "Destacado"];

const QUICK_IMAGE_PRESETS = [
  {
    label: "Accesorios Cómputo",
    url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Audio & Diademas",
    url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Servicios & Impresión",
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Gaming & Consolas",
    url: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1200&q=85",
  },
];

export function ItemFormModal({
  item,
  categories,
  isOpen,
  onClose,
  onSave,
  isSaving,
}: ItemFormModalProps) {
  const isEditing = Boolean(item);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [type, setType] = useState<"product" | "service">("product");
  const [categorySlug, setCategorySlug] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [referencePrice, setReferencePrice] = useState<string>("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [badges, setBadges] = useState<ItemBadge[]>([]);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setSlug(item.slug || "");
      setSlugManual(true);
      setType(item.type || "product");
      setCategorySlug(item.categorySlug || (categories[0]?.slug ?? ""));
      setPriceLabel(item.priceLabel || "");
      setReferencePrice(
        item.referencePrice !== undefined && item.referencePrice !== null
          ? String(item.referencePrice)
          : ""
      );
      setShortDescription(item.shortDescription || "");
      setDescription(item.description || "");
      setImageUrl(item.imageUrl || "");
      setBadges(item.badges || []);
      setFeatured(Boolean(item.featured));
      setActive(item.active !== false);
      setSpecs(item.specs || []);
    } else {
      setName("");
      setSlug("");
      setSlugManual(false);
      setType("product");
      setCategorySlug(categories[0]?.slug ?? "");
      setPriceLabel("");
      setReferencePrice("");
      setShortDescription("");
      setDescription("");
      setImageUrl("");
      setBadges([]);
      setFeatured(false);
      setActive(true);
      setSpecs([]);
    }
    setErrorMessage(null);
  }, [item, categories, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManual) {
      const generated = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const toggleBadge = (badge: ItemBadge) => {
    if (badges.includes(badge)) {
      setBadges(badges.filter((b) => b !== badge));
    } else {
      setBadges([...badges, badge]);
    }
  };

  const addSpec = () => {
    setSpecs([...specs, { label: "", value: "" }]);
  };

  const updateSpec = (index: number, key: "label" | "value", value: string) => {
    const updated = [...specs];
    updated[index][key] = value;
    setSpecs(updated);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("El nombre del ítem es obligatorio.");
      return;
    }
    if (!categorySlug) {
      setErrorMessage("Por favor selecciona una categoría.");
      return;
    }

    const cleanedSpecs = specs.filter(
      (s) => s.label.trim() !== "" || s.value.trim() !== ""
    );

    const numPrice = referencePrice ? parseFloat(referencePrice) : undefined;

    const payload: Partial<CatalogItem> = {
      ...(item ? { id: item.id } : {}),
      name: name.trim(),
      slug: slug.trim(),
      type,
      categorySlug,
      priceLabel: priceLabel.trim() || "Consultar en mostrador",
      referencePrice: !isNaN(Number(numPrice)) ? numPrice : undefined,
      shortDescription: shortDescription.trim(),
      description: description.trim() || shortDescription.trim(),
      imageUrl: imageUrl.trim() || QUICK_IMAGE_PRESETS[0].url,
      badges,
      featured,
      active,
      specs: cleanedSpecs,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error al guardar el ítem."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 text-white flex items-center justify-center shadow-xs">
              {type === "product" ? (
                <Package className="w-5 h-5 text-sky-300" />
              ) : (
                <Monitor className="w-5 h-5 text-sky-300" />
              )}
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                {isEditing ? "Editar Ítem del Catálogo" : "Nuevo Ítem en Catálogo"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Modificando: ${item?.name}`
                  : "Añade un nuevo producto físico o servicio del cybercafé"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tipo de Ítem (Producto vs Servicio) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Tipo de Ítem
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("product")}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  type === "product"
                    ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Producto Físico</span>
              </button>
              <button
                type="button"
                onClick={() => setType("service")}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  type === "service"
                    ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Servicio Digital / Cyber</span>
              </button>
            </div>
          </div>

          {/* Nombre y Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre del {type === "product" ? "Producto" : "Servicio"} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={
                  type === "product"
                    ? "Ej. Combo Teclado y Mouse Inalámbrico"
                    : "Ej. Impresiones a Color por Hoja"
                }
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent text-slate-900"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Slug URL (Identificador)
                </label>
                {!slugManual && (
                  <span className="text-[10px] text-slate-400">Automático</span>
                )}
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(e.target.value);
                }}
                placeholder="ej-nombre-del-item"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-700 font-mono"
              />
            </div>
          </div>

          {/* Categoría y Precios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Categoría *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Texto de Precio (Visible)
              </label>
              <input
                type="text"
                value={priceLabel}
                onChange={(e) => setPriceLabel(e.target.value)}
                placeholder="Ej. $249.00 MXN o $15 / hr"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Precio Numérico (Ref.)
              </label>
              <input
                type="number"
                step="0.5"
                value={referencePrice}
                onChange={(e) => setReferencePrice(e.target.value)}
                placeholder="Ej. 249"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
              />
            </div>
          </div>

          {/* Descripción Corta */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Descripción Corta (Para tarjetas)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Resumen conciso de 1 línea..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
            />
          </div>

          {/* Descripción Completa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Descripción Detallada
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica las características, condiciones, materiales o detalles del servicio..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 resize-none"
            />
          </div>

          {/* Imagen: Subida de archivo o URL */}
          <div className="space-y-2">
            <ImageUploader
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              label="Fotografía del Producto o Servicio"
              placeholderText="Arrastra una foto aquí o haz clic para subir imagen"
              helperText="Formatos: PNG, JPG, SVG, WEBP, GIF, AVIF. O elige una de las fotos de ejemplo abajo."
            />

            {/* Presets Rápidos */}
            <div className="pt-1 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-slate-400 font-medium">Fotos de ejemplo:</span>
              {QUICK_IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges / Etiquetas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Etiquetas Visuales (Badges)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_BADGES.map((badge) => {
                const isSelected = badges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-navy-800 text-white border-navy-800 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-300" />}
                    <span>{badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Especificaciones Clave-Valor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Especificaciones / Características
              </label>
              <button
                type="button"
                onClick={addSpec}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy-800 hover:text-navy-900"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Característica</span>
              </button>
            </div>

            {specs.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">
                Sin especificaciones añadidas. Pulsa el botón de arriba si deseas agregar atributos como &quot;Conexión&quot;, &quot;Garantía&quot;, etc.
              </p>
            ) : (
              <div className="space-y-2">
                {specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Atributo (ej. Conector)"
                      value={spec.label}
                      onChange={(e) => updateSpec(idx, "label", e.target.value)}
                      className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-600 text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Valor (ej. USB-C)"
                      value={spec.value}
                      onChange={(e) => updateSpec(idx, "value", e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-600 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Switches de Estado: Activo y Destacado */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-navy-800 rounded focus:ring-navy-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Activo en el Escaparate
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Visible para los visitantes de la página.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-navy-800 rounded focus:ring-navy-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Destacado en Portada
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Aparece en la sección de Productos Destacados.
                </span>
              </div>
            </label>
          </div>

          {/* Footer del Modal */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-sky-400" />
              <span>{isSaving ? "Guardando..." : isEditing ? "Actualizar Ítem" : "Crear Ítem"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
