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
  Layers,
  ArrowUpDown,
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
  categories,
}: AdminCatalogManagerProps) {
  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "product" | "service">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "featured">("all");

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

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
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
        if (!matchesName && !matchesSlug && !matchesDesc && !matchesShort) {
          return false;
        }
      }

      return true;
    });
  }, [items, search, typeFilter, categoryFilter, statusFilter]);

  // Open Form for Create
  const handleCreateNew = (defaultType?: "product" | "service") => {
    setEditingItem(defaultType ? ({ type: defaultType } as CatalogItem) : null);
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
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
      setIsDeleteOpen(false);
      showToast("Ítem eliminado correctamente.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar el ítem";
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

  // Toggle Featured
  const handleToggleFeatured = async (item: CatalogItem) => {
    const updatedFeatured = !item.featured;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, featured: updatedFeatured } : i))
    );

    try {
      const res = await fetch("/api/catalog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, action: "toggleFeatured" }),
      });

      if (!res.ok) {
        throw new Error("Error al cambiar destacado");
      }

      showToast(
        updatedFeatured
          ? `"${item.name}" marcado como destacado.`
          : `"${item.name}" desmarcado de destacados.`
      );
    } catch {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, featured: item.featured } : i))
      );
      showToast("No se pudo actualizar el destacado.", "error");
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
              Catálogo de Productos y Servicios
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-navy-100 text-navy-800">
              {stats.total}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Crea, edita, pausa o elimina productos físicos y servicios digitales para tu cybercafé.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleCreateNew("product")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-navy-800 hover:bg-navy-900 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
          <button
            type="button"
            onClick={() => handleCreateNew("service")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-navy-900 bg-navy-50 hover:bg-navy-100 border border-navy-200 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4 text-navy-700" />
            <span>Nuevo Servicio</span>
          </button>
        </div>
      </div>

      {/* Métricas / Chips rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-slate-500">
              Activos en Tienda
            </div>
            <div className="text-xl font-heading font-bold text-slate-900 mt-0.5">
              {stats.active}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-slate-500">
              Pausados
            </div>
            <div className="text-xl font-heading font-bold text-slate-900 mt-0.5">
              {stats.inactive}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-slate-500">
              Destacados
            </div>
            <div className="text-xl font-heading font-bold text-slate-900 mt-0.5">
              {stats.featured}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-slate-500">
              Servicios Digitales
            </div>
            <div className="text-xl font-heading font-bold text-slate-900 mt-0.5">
              {stats.services}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Monitor className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, código o descripción..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Filtro por Categoría */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-600"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive" | "featured")
              }
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-600"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo Activos</option>
              <option value="inactive">Solo Pausados</option>
              <option value="featured">Solo Destacados</option>
            </select>
          </div>
        </div>

        {/* Pestañas de Tipo */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              typeFilter === "all"
                ? "bg-navy-900 text-white"
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
                ? "bg-navy-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Productos ({stats.products})</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("service")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              typeFilter === "service"
                ? "bg-navy-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Servicios ({stats.services})</span>
          </button>
        </div>
      </div>

      {/* Lista de Ítems */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
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
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-navy-800 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Ítem / Tipo</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Precio Mostrado</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Destacado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => {
                  const cat = categories.find((c) => c.slug === item.categorySlug);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        !item.active ? "opacity-60 bg-slate-50/30" : ""
                      }`}
                    >
                      {/* Ítem & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/100x100?text=No+Img";
                            }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  item.type === "product"
                                    ? "bg-navy-100 text-navy-800"
                                    : "bg-sky-100 text-sky-800"
                                }`}
                              >
                                {item.type === "product" ? "Producto" : "Servicio"}
                              </span>
                              {item.badges?.map((b) => (
                                <span
                                  key={b}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-800"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                            <div className="font-semibold text-slate-900 mt-1 truncate max-w-xs sm:max-w-md">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                              /{item.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {cat?.name || item.categorySlug}
                        </span>
                      </td>

                      {/* Precio */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.priceLabel}</div>
                        {item.referencePrice && (
                          <div className="text-[10px] text-slate-400">
                            Ref: ${item.referencePrice}
                          </div>
                        )}
                      </td>

                      {/* Estado: Switch Activo / Pausado */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          title={
                            item.active
                              ? "Pausar ítem (ocultar del catálogo público)"
                              : "Activar ítem (mostrar en catálogo público)"
                          }
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            item.active
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                          }`}
                        >
                          {item.active ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Pausado</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Destacado: Toggle Estrella */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          title={
                            item.featured
                              ? "Quitar de destacados en inicio"
                              : "Marcar como destacado en inicio"
                          }
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.featured
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              item.featured ? "fill-amber-400 text-amber-500" : ""
                            }`}
                          />
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/item/${item.slug}`}
                            target="_blank"
                            title="Ver en escaparate público"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            title="Editar ítem"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-navy-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(item)}
                            title="Eliminar ítem"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

      {/* Modal Formulario de Creación / Edición */}
      <ItemFormModal
        isOpen={isFormOpen}
        item={editingItem}
        categories={categories}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        isSaving={isSaving}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <ItemDeleteDialog
        isOpen={isDeleteOpen}
        item={deletingItem}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
