"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Monitor,
  Plus,
  Search,
  Filter,
  Star,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { CatalogItem, Category } from "@/types";
import { ItemFormModal } from "./ItemFormModal";
import { ItemDeleteDialog } from "./ItemDeleteDialog";

interface AdminCatalogManagerProps {
  initialItems: CatalogItem[];
  categories: Category[];
}

export function AdminCatalogManager({
  initialItems,
  categories: initialCategories,
}: AdminCatalogManagerProps) {
  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "product" | "service">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "featured">("all");
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc" | "name">("recent");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Dialog States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Metrics
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.active).length;
    const inactive = items.filter((i) => !i.active).length;
    const featured = items.filter((i) => i.featured).length;
    const products = items.filter((i) => i.type === "product").length;
    const services = items.filter((i) => i.type === "service").length;
    return { total, active, inactive, featured, products, services };
  }, [items]);

  // Filtered & Sorted Items
  const filteredItems = useMemo(() => {
    const result = items.filter((item) => {
      // Type
      if (typeFilter !== "all" && item.type !== typeFilter) return false;

      // Category
      if (categoryFilter !== "all" && item.categorySlug !== categoryFilter) return false;

      // Status
      if (statusFilter === "active" && !item.active) return false;
      if (statusFilter === "inactive" && item.active) return false;
      if (statusFilter === "featured" && !item.featured) return false;

      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSlug = item.slug.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesShort = item.shortDescription?.toLowerCase().includes(query);
        const matchesBadges = item.badges?.some((b) => b.toLowerCase().includes(query));
        if (!matchesName && !matchesSlug && !matchesDesc && !matchesShort && !matchesBadges) {
          return false;
        }
      }

      return true;
    });

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.referencePrice ?? 0) - (b.referencePrice ?? 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.referencePrice ?? 0) - (a.referencePrice ?? 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [items, search, typeFilter, categoryFilter, statusFilter, sortBy]);

  // Select all checkbox handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Open Form for Create
  const handleCreateNew = (defaultType: "product" | "service" = "product") => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Add newly created category to state
  const handleCategoryCreated = (newCat: Category) => {
    setCategories((prev) => {
      if (prev.some((c) => c.id === newCat.id || c.slug === newCat.slug)) return prev;
      return [...prev, newCat];
    });
    showToast(`Categoría "${newCat.name}" creada con éxito.`);
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (payload: Partial<CatalogItem>) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "No se pudo guardar el ítem");
      }

      const savedItem: CatalogItem = await res.json();

      setItems((prev) => {
        const index = prev.findIndex((i) => i.id === savedItem.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = savedItem;
          return updated;
        } else {
          return [savedItem, ...prev];
        }
      });

      showToast(
        editingItem?.id
          ? `"${savedItem.name}" actualizado con éxito.`
          : `"${savedItem.name}" creado con éxito.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido al guardar";
      showToast(msg, "error");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Open Delete Dialog
  const handleDeleteClick = (item: CatalogItem) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/catalog?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar del servidor");
      }

      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setIsDeleteOpen(false);
      showToast("Producto eliminado correctamente.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar el producto";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (item: CatalogItem) => {
    const updatedStatus = !item.active;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, active: updatedStatus } : i))
    );

    try {
      const res = await fetch("/api/catalog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, action: "toggleActive" }),
      });

      if (!res.ok) {
        throw new Error("Error al cambiar estado");
      }

      showToast(
        updatedStatus
          ? `"${item.name}" ahora está activo en el escaparate.`
          : `"${item.name}" fue pausado.`
      );
    } catch {
      // Revert optimistic update
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, active: item.active } : i))
      );
      showToast("No se pudo cambiar el estado.", "error");
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Flotante */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === "success"
              ? "bg-slate-900 text-white border-slate-800"
              : "bg-red-600 text-white border-red-700"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Encabezado Principal Estilo Tiendanube */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Productos
            </h1>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              ({filteredItems.length} productos)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleCreateNew("product")}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar producto</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda Estilo Tiendanube */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, código o tags..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 bg-white"
            />
          </div>

          {/* Filtros desplegables */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Categoría */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Estado */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive" | "featured")
              }
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo Activos</option>
              <option value="inactive">Solo Pausados</option>
              <option value="featured">Solo Destacados</option>
            </select>

            {/* Orden */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "recent" | "price-asc" | "price-desc" | "name")
              }
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            >
              <option value="recent">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Pestañas de tipo (Píldoras rápidas) */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              typeFilter === "all"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Todos ({items.length})
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("product")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              typeFilter === "product"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Físicos ({stats.products})</span>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("service")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              typeFilter === "service"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Servicios ({stats.services})</span>
          </button>
        </div>
      </div>

      {/* Tabla Limpia Estilo Tiendanube (Capturas 1 y 7) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              No se encontraron productos ni servicios
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Intenta cambiar los términos de búsqueda o limpiar los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredItems.length > 0 &&
                        selectedIds.length === filteredItems.length
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4 text-center">Disponibilidad</th>
                  <th className="py-3 px-4 text-center">Precio</th>
                  <th className="py-3 px-4 text-center">Promocional</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => {
                  const cat = categories.find((c) => c.slug === item.categorySlug);
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        !item.active ? "opacity-60 bg-slate-50/30" : ""
                      } ${isSelected ? "bg-blue-50/30" : ""}`}
                    >
                      {/* Checkbox de fila */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(item.id)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* Producto: Imagen + Nombre azul cliqueable + Categoría + Etiquetas */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            onClick={() => handleEdit(item)}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100 cursor-pointer hover:opacity-90 transition-opacity"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/100x100?text=Sin+Foto";
                            }}
                          />
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="font-semibold text-blue-600 hover:text-blue-800 text-left hover:underline truncate max-w-xs sm:max-w-md block"
                            >
                              {item.name}
                            </button>

                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {/* Chip de categoría */}
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                {cat?.name || item.categorySlug}
                              </span>

                              {/* Chip de tipo */}
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  item.type === "product"
                                    ? "bg-slate-100 text-slate-700"
                                    : "bg-sky-50 text-sky-700 border border-sky-100"
                                }`}
                              >
                                {item.type === "product" ? "Físico" : "Servicio"}
                              </span>

                              {/* Etiquetas personalizadas / default */}
                              {item.badges?.map((b) => (
                                <span
                                  key={b}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Disponibilidad estilo Tiendanube */}
                      <td className="py-3.5 px-4 text-center">
                        {item.active ? (
                          <span className="text-[11px] text-slate-600 font-medium">
                            ∞ Infinito
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            Pausado
                          </span>
                        )}
                      </td>

                      {/* Precio */}
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                        {item.referencePrice !== undefined ? (
                          <span>${item.referencePrice.toFixed(2)}</span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            {item.priceLabel || "—"}
                          </span>
                        )}
                      </td>

                      {/* Precio Promocional (Oferta) */}
                      <td className="py-3.5 px-4 text-center">
                        {item.promotionalPrice !== undefined ? (
                          <span className="inline-block font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
                            ${item.promotionalPrice.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Ver en tienda */}
                          <Link
                            href={`/item/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Ver en la tienda pública"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Pausar / Activar */}
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              item.active
                                ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                : "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                            }`}
                            title={item.active ? "Pausar producto" : "Activar producto"}
                          >
                            {item.active ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>

                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar producto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(item)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Creación / Edición estilo Tiendanube */}
      <ItemFormModal
        isOpen={isFormOpen}
        item={editingItem}
        categories={categories}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveItem}
        isSaving={isSaving}
        onCategoryCreated={handleCategoryCreated}
      />

      {/* Diálogo de Eliminación */}
      <ItemDeleteDialog
        isOpen={isDeleteOpen}
        item={deletingItem}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
