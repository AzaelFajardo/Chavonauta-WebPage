"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  Monitor,
  Plus,
  Trash2,
  Sparkles,
  Check,
  AlertCircle,
  Tag,
  FolderPlus,
  Loader2,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import { CatalogItem, Category } from "@/types";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Tooltip, InfoTooltip } from "@/components/ui/Tooltip";

interface ItemFormModalProps {
  item: CatalogItem | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<CatalogItem>) => Promise<void>;
  isSaving: boolean;
  onCategoryCreated?: (newCategory: Category) => void;
}

// Etiquetas sugeridas por defecto
const DEFAULT_BADGES = [
  "Nuevo",
  "Oferta",
  "Más pedido",
  "Recomendado",
  "Gamer",
  "Popular",
];

export function ItemFormModal({
  item,
  categories,
  isOpen,
  onClose,
  onSave,
  isSaving,
  onCategoryCreated,
}: ItemFormModalProps) {
  const isEditing = Boolean(item && item.id);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"product" | "service">("product");
  const [categorySlug, setCategorySlug] = useState("");
  const [referencePrice, setReferencePrice] = useState<string>("");
  const [promotionalPrice, setPromotionalPrice] = useState<string>("");
  const [customPriceText, setCustomPriceText] = useState("");
  const [showPriceInStore, setShowPriceInStore] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [badges, setBadges] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  // Nueva categoría inline
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryCreateError, setCategoryCreateError] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (item && item.id) {
      setName(item.name || "");
      setSlug(item.slug || "");
      setType(item.type || "product");
      setCategorySlug(item.categorySlug || (categories[0]?.slug ?? ""));
      const hasRef = item.referencePrice !== undefined && item.referencePrice !== null;
      setReferencePrice(hasRef ? String(item.referencePrice) : "");
      const hasPromo = item.promotionalPrice !== undefined && item.promotionalPrice !== null;
      setPromotionalPrice(hasPromo ? String(item.promotionalPrice) : "");
      setCustomPriceText(item.priceLabel || "");
      setShowPriceInStore(Boolean(item.priceLabel && item.priceLabel !== "Consultar en mostrador"));
      setDescription(item.description || item.shortDescription || "");
      setImageUrl(item.imageUrl || "");
      setBadges(item.badges || []);
      setFeatured(Boolean(item.featured));
      setActive(item.active !== false);
    } else {
      setName("");
      setSlug("");
      setType("product");
      setCategorySlug(categories[0]?.slug ?? "");
      setReferencePrice("");
      setPromotionalPrice("");
      setCustomPriceText("");
      setShowPriceInStore(false);
      setDescription("");
      setImageUrl("");
      setBadges([]);
      setFeatured(false);
      setActive(true);
    }
    setErrorMessage(null);
    setShowNewCategoryInput(false);
    setNewCategoryName("");
    setCustomTagInput("");
  }, [item, categories, isOpen]);

  // Si se ingresa un precio numérico mayor a 0, marcar automáticamente "Mostrar el precio en la tienda"
  const handlePriceChange = (val: string) => {
    setReferencePrice(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setShowPriceInStore(true);
    }
  };

  const handlePromoPriceChange = (val: string) => {
    setPromotionalPrice(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setShowPriceInStore(true);
    }
  };

  // Manejar cambio de nombre y auto-generar slug simple
  const handleNameChange = (val: string) => {
    setName(val);
    const generated = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  // Alternar etiqueta de la lista sugerida
  const toggleBadge = (badge: string) => {
    if (badges.includes(badge)) {
      setBadges(badges.filter((b) => b !== badge));
    } else {
      setBadges([...badges, badge]);
    }
  };

  // Agregar etiqueta personalizada
  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tag = customTagInput.trim();
    if (!tag) return;
    if (!badges.includes(tag)) {
      setBadges([...badges, tag]);
    }
    setCustomTagInput("");
  };

  // Eliminar etiqueta
  const handleRemoveBadge = (badgeToRemove: string) => {
    setBadges(badges.filter((b) => b !== badgeToRemove));
  };

  // Crear categoría personalizada inline
  const handleCreateCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryCreateError("Ingresa un nombre para la categoría.");
      return;
    }

    setIsCreatingCategory(true);
    setCategoryCreateError(null);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "No se pudo crear la categoría");
      }

      const created: Category = await res.json();
      if (onCategoryCreated) {
        onCategoryCreated(created);
      }
      setCategorySlug(created.slug);
      setShowNewCategoryInput(false);
      setNewCategoryName("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear categoría";
      setCategoryCreateError(msg);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // Guardar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Por favor ingresa el nombre del producto o servicio.");
      return;
    }
    if (!categorySlug) {
      setErrorMessage("Por favor selecciona una categoría.");
      return;
    }

    const numRefPrice = referencePrice ? parseFloat(referencePrice) : undefined;
    const numPromoPrice = promotionalPrice ? parseFloat(promotionalPrice) : undefined;

    // Calcular etiqueta de precio visible
    let finalPriceLabel = customPriceText.trim();
    if (!finalPriceLabel) {
      if (!showPriceInStore) {
        finalPriceLabel = "Consultar en mostrador";
      } else if (numPromoPrice !== undefined && !isNaN(numPromoPrice)) {
        finalPriceLabel = `$${numPromoPrice.toFixed(2)} MXN`;
      } else if (numRefPrice !== undefined && !isNaN(numRefPrice)) {
        finalPriceLabel = `$${numRefPrice.toFixed(2)} MXN`;
      } else {
        finalPriceLabel = "Consultar en mostrador";
      }
    }

    const payload: Partial<CatalogItem> = {
      ...(item ? { id: item.id } : {}),
      name: name.trim(),
      slug: slug.trim() || `item-${Date.now()}`,
      type,
      categorySlug,
      priceLabel: finalPriceLabel,
      referencePrice: !isNaN(Number(numRefPrice)) ? numRefPrice : undefined,
      promotionalPrice: !isNaN(Number(numPromoPrice)) ? numPromoPrice : undefined,
      shortDescription: description.trim().slice(0, 160),
      description: description.trim(),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      badges,
      featured,
      active,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error al guardar el producto."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Barra superior estilo Tiendanube */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Editar "${item?.name}"` : "Agregar Producto"}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing
                ? "Modifica los datos, precios o fotos del producto seleccionado."
                : "Completa los datos del nuevo producto o servicio para el catálogo."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{isEditing ? "Guardar cambios" : "Agregar Producto"}</span>
              )}
            </button>
          </div>
        </header>

        {/* Contenido en Tarjetas Blancas (Estilo Tiendanube) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tarjeta 1: Nombre y descripción */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Nombre y descripción
              </h3>
              <InfoTooltip text="La información principal que tus clientes verán al buscar o abrir este artículo." />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span>Nombre del producto o servicio <span className="text-red-500">*</span></span>
                <InfoTooltip text="El título claro con el que tus clientes identificarán el producto en el catálogo." />
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Cable HDMI 2.0, Cuaderno profesional, Impresiones a color..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <span>Descripción</span>
                <InfoTooltip text="Explica detalles como marcas, características técnicas, qué incluye o tiempos de entrega." />
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Escribe aquí las características, detalles o especificaciones que el cliente debe saber..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 bg-white"
              />
            </div>
          </div>

          {/* Tarjeta 2: Fotos */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Fotos
              </h3>
              <InfoTooltip text="Sube fotos claras con buena iluminación. Formatos recomendados: JPG, PNG o WEBP." />
            </div>

            <ImageUploader
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              label="Foto del producto"
              helperText="Formatos recomendados: JPG, PNG, WEBP o GIF (hasta 10 MB)."
              placeholderText="Arrastra y suelta, o sube una foto del producto"
            />
          </div>

          {/* Tarjeta 3: Precios */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Precios
              </h3>
              <InfoTooltip text="Indica el precio habitual y opcionalmente un precio especial de oferta con descuento." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <span>Precio de venta ($)</span>
                  <InfoTooltip text="El precio habitual en pesos mexicanos que pagarán tus clientes." />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={referencePrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Precio normal del artículo</p>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <span>Precio promocional ($ oferta)</span>
                  <InfoTooltip text="Monto con descuento. El precio de venta regular se mostrará tachado para resaltar la oferta." />
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={promotionalPrice}
                    onChange={(e) => handlePromoPriceChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Opcional. Se mostrará con descuento</p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="showPriceInStore"
                checked={showPriceInStore}
                onChange={(e) => setShowPriceInStore(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="showPriceInStore" className="text-xs text-slate-700 cursor-pointer font-medium select-none flex items-center gap-1.5">
                <span>Mostrar el precio en la tienda</span>
                <InfoTooltip text="Desmárcalo si prefieres no mostrar el monto numérico y que indique 'Consultar en mostrador'." />
              </label>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <span>Texto personalizado de precio (opcional)</span>
                <InfoTooltip text="Ideal para tarifas especiales (ej: '$ 15 / hora', 'Desde $ 5.00', 'En mostrador')." />
              </label>
              <input
                type="text"
                value={customPriceText}
                onChange={(e) => setCustomPriceText(e.target.value)}
                placeholder="Ej: $ 15 / hora, Desde $ 5.00, En mostrador..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Tarjeta 4: Tipo de producto */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Tipo de producto
              </h3>
              <InfoTooltip text="Físico para productos tangibles (papelería, snacks, cables). Digital/Servicio para atención o trabajos en el cybercafé (impresiones, renta de PC)." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setType("product")}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  type === "product"
                    ? "border-blue-600 bg-blue-50/40 text-blue-950"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="radio"
                    name="productType"
                    checked={type === "product"}
                    onChange={() => setType("product")}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Package className="w-3.5 h-3.5 text-blue-600" />
                    <span>Físico</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Artículos tangibles (papelería, accesorios de cómputo, botanas, cables...)
                  </p>
                </div>
              </label>

              <label
                onClick={() => setType("service")}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  type === "service"
                    ? "border-blue-600 bg-blue-50/40 text-blue-950"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className="mt-0.5">
                  <input
                    type="radio"
                    name="productType"
                    checked={type === "service"}
                    onChange={() => setType("service")}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Monitor className="w-3.5 h-3.5 text-sky-600" />
                    <span>Digital / Servicio</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Servicios del cybercafé (impresiones, escaneo, renta de PC/consolas...)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Tarjeta 5: Categorías (Con opción de crear personalizada) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Categoría
                </h3>
                <InfoTooltip text="Agrupa tus artículos para que los clientes los encuentren con facilidad en los filtros de la tienda." />
              </div>

              {!showNewCategoryInput && (
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>+ Nueva categoría</span>
                </button>
              )}
            </div>

            {/* Selector de categoría */}
            <div className="space-y-1.5">
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mini formulario para agregar categoría personalizada */}
            {showNewCategoryInput && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
                <div className="text-xs font-bold text-slate-800">
                  Crear categoría personalizada:
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej: Snacks Fríos, Fotocopias, Reparación..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={isCreatingCategory}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isCreatingCategory ? "Creando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setCategoryCreateError(null);
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
                {categoryCreateError && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {categoryCreateError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tarjeta 6: Etiquetas (Default + Personalizables) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Etiquetas y Distintivos
              </h3>
              <InfoTooltip text="Insignias llamativas sobre la foto para resaltar cualidades (ej: 'Nuevo', 'Oferta', 'Gamer' o tus propias etiquetas)." />
            </div>

            {/* Etiquetas sugeridas con un clic */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                Etiquetas sugeridas:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {DEFAULT_BADGES.map((b) => {
                  const isSelected = badges.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBadge(b)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{b}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Creador de etiqueta personalizada */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                Añadir etiqueta personalizada:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  placeholder="Ej: 2x1, Edición Especial, Sin costo extra..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomTag()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>

            {/* Etiquetas activas asignadas a este producto */}
            {badges.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Etiquetas asignadas ({badges.length}):
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBadge(b)}
                        className="p-0.5 hover:bg-blue-200/60 rounded-full text-blue-600"
                        title="Quitar etiqueta"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta 7: Destacar y Visibilidad */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Destacar y Visibilidad
              </h3>
              <InfoTooltip text="Configura si el producto es visible de inmediato o si debe figurar en la portada de tu cybercafé." />
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/60 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Mostrar en la tienda (Activo)</span>
                    <InfoTooltip text="Desmárcalo si quieres pausar temporalmente el producto sin borrar sus datos." />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Si está desmarcado, el producto quedará pausado y no será visible para tus clientes.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/60 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Destacar en la página principal</span>
                    <InfoTooltip text="Muestra este producto en los escaparates y carruseles principales de la página web." />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Aparecerá en los bloques destacados del inicio de tu página para captar más atención.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </form>

        {/* Barra inferior fija de acciones */}
        <footer className="sticky bottom-0 z-20 bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-end gap-3 shadow-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>{isEditing ? "Guardar cambios" : "Agregar Producto"}</span>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
