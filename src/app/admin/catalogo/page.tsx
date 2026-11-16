"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Star,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpDown,
  X,
} from "lucide-react";
import { CatalogItem, Category } from "@/types";
import { CatalogItemModal } from "@/components/admin/CatalogItemModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

export default function AdminCatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros y Búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "product" | "service">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "featured">("all");
  const [sortOption, setSortOption] = useState<"newest" | "name_asc" | "price_asc" | "price_desc">("newest");

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null);

  // Feedback Toast
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/catalog?all=true");
      if (!res.ok) throw new Error("No se pudo cargar el catálogo");
      const data = await res.json();
      setItems(data.items || []);
      setCategories(data.categories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar catálogo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Guardar (Crear o Actualizar)
  const handleSaveItem = async (itemData: Partial<CatalogItem>) => {
    if (editingItem) {
      // Actualizar existente
      const res = await fetch(`/api/catalog/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al actualizar artículo");
      }

      const { item: updatedItem } = await res.json();
      setItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
      showToast("success", `"${updatedItem.name}" actualizado correctamente.`);
    } else {
      // Crear nuevo
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al crear artículo");
      }

      const { item: createdItem } = await res.json();
      setItems((prev) => [createdItem, ...prev]);
      showToast("success", `"${createdItem.name}" creado y agregado al catálogo.`);
    }
  };

  // Alternar Activo / Pausado
  const handleToggleActive = async (item: CatalogItem) => {
    const updatedStatus = !item.active;
    // Actualización optimista
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, active: updatedStatus } : it))
    );

    try {
      const res = await fetch(`/api/catalog/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: updatedStatus }),
      });

      if (!res.ok) throw new Error("Error al cambiar estado");
      showToast(
        "info",
        `"${item.name}" ahora está ${updatedStatus ? "ACTIVO en la tienda" : "PAUSADO (oculto)"}.`
      );
    } catch {
      // Revertir en fallo
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, active: item.active } : it))
      );
      showToast("error", "No se pudo actualizar el estado.");
    }
  };

  // Alternar Destacado
  const handleToggleFeatured = async (item: CatalogItem) => {
    const updatedFeatured = !item.featured;
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, featured: updatedFeatured } : it))
    );

    try {
      const res = await fetch(`/api/catalog/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: updatedFeatured }),
      });

      if (!res.ok) throw new Error("Error al cambiar destacado");
      showToast(
        "info",
        `"${item.name}" ${updatedFeatured ? "destacado en portada" : "retirado de destacados"}.`
      );
    } catch {
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, featured: item.featured } : it))
      );
      showToast("error", "No se pudo actualizar el estado de destacado.");
    }
  };

  // Eliminar
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    const res = await fetch(`/api/catalog/${deletingItem.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      showToast("error", "No se pudo eliminar el artículo.");
      return;
    }

    setItems((prev) => prev.filter((it) => it.id !== deletingItem.id));
    showToast("success", `"${deletingItem.name}" ha sido eliminado del catálogo.`);
    setDeletingItem(null);
  };

  // Restaurar Catálogo por Defecto (Seguridad)
  const handleResetCatalog = async () => {
    if (!window.confirm("¿Estás seguro de restaurar el catálogo a los datos semilla iniciales de Chavonauta? Esto sobrescribirá los cambios no guardados.")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (!res.ok) throw new Error("Error al restaurar catálogo");
      const data = await res.json();
      setItems(data.items || []);
      showToast("success", "Catálogo restaurado a valores por defecto con éxito.");
    } catch (err) {
      showToast("error", "No se pudo restaurar el catálogo.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrado y Ordenamiento
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Tipo
        if (typeFilter !== "all" && item.type !== typeFilter) return false;

        // Categoría
        if (categoryFilter !== "all" && item.categorySlug !== categoryFilter) return false;

        // Estatus
        if (statusFilter === "active" && !item.active) return false;
        if (statusFilter === "inactive" && item.active) return false;
        if (statusFilter === "featured" && !item.featured) return false;

        // Búsqueda
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.shortDescription?.toLowerCase().includes(q);
          const matchSlug = item.slug?.toLowerCase().includes(q);
          const matchPrice = item.priceLabel?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchSlug && !matchPrice) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortOption === "price_asc") {
          const priceA = a.referencePrice ?? 999999;
          const priceB = b.referencePrice ?? 999999;
          return priceA - priceB;
        }
        if (sortOption === "price_desc") {
          const priceA = a.referencePrice ?? 0;
          const priceB = b.referencePrice ?? 0;
          return priceB - priceA;
        }
        // Por defecto: más reciente (conserva orden original o id)
        return 0;
      });
  }, [items, typeFilter, categoryFilter, statusFilter, searchQuery, sortOption]);

  // Contadores para métricas
  const stats = useMemo(() => {
    const total = items.length;
    const products = items.filter((i) => i.type === "product" && i.active).length;
    const services = items.filter((i) => i.type === "service" && i.active).length;
    const paused = items.filter((i) => !i.active).length;
    const featured = items.filter((i) => i.featured && i.active).length;
    return { total, products, services, paused, featured };
  }, [items]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Flotante */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold border transition-all animate-in slide-in-from-bottom-3 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : toast.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-navy-50 text-navy-800 border-navy-200"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toast.type === "error" && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
          {toast.type === "info" && <Sparkles className="w-4 h-4 text-navy-600 shrink-0" />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Encabezado Principal y Botón de Creación */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Catálogo de Productos y Servicios
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administra los productos en venta, servicios del cybercafé, precios y visibilidad en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Artículos
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 font-heading">{stats.total}</span>
            <span className="text-[11px] text-slate-400">registrados</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-navy-700 uppercase tracking-wider block">
            Productos Activos
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-navy-800 font-heading">{stats.products}</span>
            <span className="text-[11px] text-slate-400">en venta</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
            Servicios Activos
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-indigo-800 font-heading">{stats.services}</span>
            <span className="text-[11px] text-slate-400">disponibles</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
            Pausados
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-700 font-heading">{stats.paused}</span>
            <span className="text-[11px] text-slate-400">ocultos</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Destacados Inicio
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-700 font-heading">{stats.featured}</span>
            <span className="text-[11px] text-slate-400">en portada</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros, Búsqueda y Orden */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Campo de Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción, precio o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro por Tipo (Pestañas) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === "all"
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Todos ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("product")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === "product"
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Productos ({items.filter((i) => i.type === "product").length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("service")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                typeFilter === "service"
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Servicios ({items.filter((i) => i.type === "service").length})
            </button>
          </div>
        </div>

        {/* Segunda línea de filtros: Categoría, Estado y Orden */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Selector de Categoría */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Categoría:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Estado */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo Activos</option>
              <option value="inactive">Solo Pausados</option>
              <option value="featured">Solo Destacados</option>
            </select>
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Ordenar:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy-500"
            >
              <option value="newest">Más recientes</option>
              <option value="name_asc">Nombre (A-Z)</option>
              <option value="price_asc">Precio (Menor a Mayor)</option>
              <option value="price_desc">Precio (Mayor a Menor)</option>
            </select>
          </div>

          {/* Botón de limpiar filtros si hay alguno activo */}
          {(searchQuery || typeFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="text-xs text-navy-700 hover:text-navy-900 font-semibold underline ml-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Contenido: Tabla y Lista */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-3 border-navy-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Cargando catálogo...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center text-red-700 text-xs shadow-sm">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <p className="font-bold">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No se encontraron artículos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery || typeFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all"
              ? "Prueba cambiando o limpiando los filtros de búsqueda."
              : "Tu catálogo está vacío actualmente. Haz clic en '+ Nuevo Artículo' para agregar el primero."}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 text-white text-xs font-bold rounded-lg hover:bg-navy-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Primer Artículo</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Artículo</th>
                  <th className="py-3 px-3">Tipo</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Precio / Tarifa</th>
                  <th className="py-3 px-3 text-center">Destacado</th>
                  <th className="py-3 px-3 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredItems.map((item) => {
                  const isService = item.type === "service";
                  const categoryObj = categories.find((c) => c.slug === item.categorySlug);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !item.active ? "opacity-65 bg-slate-50/40" : ""
                      }`}
                    >
                      {/* Imagen y Nombre */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 truncate block">
                                {item.name}
                              </span>
                              {item.badges?.map((b) => (
                                <span
                                  key={b}
                                  className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-navy-100 text-navy-800 border border-navy-200"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.shortDescription}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              slug: /{item.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${
                            isService
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-navy-50 text-navy-800 border-navy-200"
                          }`}
                        >
                          {isService ? <Wrench className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                          <span>{isService ? "Servicio" : "Producto"}</span>
                        </span>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        <span className="text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                          {categoryObj ? categoryObj.name : item.categorySlug}
                        </span>
                      </td>

                      {/* Precio */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.priceLabel}
                        </span>
                      </td>

                      {/* Destacado en Inicio */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          title={item.featured ? "Quitar de destacados" : "Destacar en inicio"}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            item.featured
                              ? "bg-amber-50 text-amber-600 border-amber-300 hover:bg-amber-100"
                              : "bg-slate-50 text-slate-300 border-slate-200 hover:text-slate-500"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${item.featured ? "fill-amber-500" : ""}`} />
                        </button>
                      </td>

                      {/* Estado: Activo / Pausado */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                            item.active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                          }`}
                          title={
                            item.active
                              ? "Clic para pausar (ocultar de la tienda)"
                              : "Clic para activar (mostrar en la tienda)"
                          }
                        >
                          {item.active ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-amber-600" />
                              <span>Pausado</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Ver en tienda */}
                          <Link
                            href={`/item/${item.slug}`}
                            target="_blank"
                            title="Ver en el escaparate público"
                            className="p-1.5 rounded-md text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(item);
                              setIsModalOpen(true);
                            }}
                            title="Editar artículo"
                            className="p-1.5 rounded-md text-slate-600 hover:text-navy-800 hover:bg-navy-50 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingItem(item);
                              setIsDeleteModalOpen(true);
                            }}
                            title="Eliminar del catálogo"
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pie de tabla con conteo y botón de reseed */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>
              Mostrando <strong>{filteredItems.length}</strong> de <strong>{items.length}</strong> artículos registrados
            </span>
            <button
              type="button"
              onClick={handleResetCatalog}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer catálogo a valores de muestra</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal para Crear y Editar */}
      <CatalogItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
        categories={categories}
      />

      {/* Modal para Confirmar Eliminación */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemTitle={deletingItem?.name || ""}
        itemType={deletingItem?.type || "product"}
      />
    </div>
  );
}
