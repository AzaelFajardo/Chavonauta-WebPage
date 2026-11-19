"use client";

import React, { useState } from "react";
import {
  BarChart3,
  MessageCircle,
  Search,
  MapPin,
  Eye,
  Download,
  RotateCcw,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
  Layers,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { AnalyticsSummary, ItemClickStat } from "@/types";

interface AdminStatsManagerProps {
  initialStats: AnalyticsSummary;
}

export function AdminStatsManager({ initialStats }: AdminStatsManagerProps) {
  const [stats, setStats] = useState<AnalyticsSummary>(initialStats);
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("all");
  const [itemTypeFilter, setItemTypeFilter] = useState<"all" | "service" | "product">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        showToast("Estadísticas actualizadas");
      } else {
        showToast("Error al obtener estadísticas", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/analytics", { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsResetDialogOpen(false);
        showToast("Contadores reiniciados a cero correctamente");
      } else {
        showToast("No se pudo reiniciar", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportCSV = () => {
    const lines = [
      ["Reporte de Estadísticas - Cybercafé Chavonauta"],
      ["Fecha de generación", new Date().toLocaleString("es-MX")],
      ["Periodo seleccionado", period === "7d" ? "Últimos 7 días" : period === "30d" ? "Últimos 30 días" : "Histórico total"],
      [],
      ["MÉTRICAS PRINCIPALES"],
      ["Métrica", "Cantidad"],
      ["Consultas a WhatsApp", stats.totalWhatsappClicks],
      ["Búsquedas en el Catálogo", stats.totalSearches],
      ["Clics en Cómo Llegar (Google Maps)", stats.totalLocationClicks],
      ["Exploraciones del Catálogo", stats.totalCatalogViews],
      [],
      ["TOP PRODUCTOS Y SERVICIOS CONSULTADOS POR WHATSAPP"],
      ["Nombre", "Tipo", "Consultas WhatsApp", "Vistas"],
      ...stats.topItems.map((i) => [i.title, i.type === "service" ? "Servicio" : "Producto", i.whatsappClicks, i.views]),
      [],
      ["TÉRMINOS MÁS BUSCADOS POR LOS CLIENTES"],
      ["Término de Búsqueda", "Veces Buscado", "Resultados en Catálogo"],
      ...stats.topSearches.map((s) => [s.query, s.count, s.resultsCount]),
      [],
      ["INTERÉS POR CATEGORÍA"],
      ["Categoría", "Consultas", "Porcentaje"],
      ...stats.categoryInterest.map((c) => [c.label, c.clicks, `${c.percentage}%`]),
      [],
      ["DESGLOSE POR BOTÓN O CANAL CTA"],
      ["Ubicación / Botón", "Clics", "Porcentaje"],
      ...stats.ctaBreakdown.map((cta) => [cta.label, cta.clicks, `${cta.percentage}%`]),
      [],
      ["ACTIVIDAD DE LOS ÚLTIMOS DÍAS"],
      ["Fecha", "Día", "Consultas WhatsApp", "Búsquedas", "Vistas"],
      ...stats.dailyActivity.map((d) => [d.date, d.dayLabel, d.whatsappClicks, d.searches, d.views]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      lines
        .map((row) =>
          row
            .map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `estadisticas_chavonauta_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Reporte CSV descargado exitosamente");
  };

  // Filtrado de ítems por tipo
  const filteredTopItems = stats.topItems.filter((item) => {
    if (itemTypeFilter === "all") return true;
    return item.type === itemTypeFilter;
  });

  const maxItemClicks = Math.max(1, ...stats.topItems.map((i) => i.whatsappClicks));
  const maxSearchCount = Math.max(1, ...stats.topSearches.map((s) => s.count));

  // Cálculo de actividad de los últimos 7 días para el gráfico SVG
  const maxDailyActivity = Math.max(
    1,
    ...stats.dailyActivity.map((d) => Math.max(d.whatsappClicks, d.searches, Math.round(d.views / 10)))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast flotante */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all transform animate-in fade-in slide-in-from-bottom-4 ${
            toastMessage.type === "success"
              ? "bg-slate-900 border-sky-500/40 text-sky-400"
              : "bg-red-950 border-red-500/40 text-red-400"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-5 sm:p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-heading">
              Estadísticas del Escaparate
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Métricas de interés, consultas de WhatsApp y términos buscados por los clientes en Chavonauta.
          </p>
        </div>

        {/* Acciones de Cabecera */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Periodo */}
          <div className="flex items-center p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => setPeriod("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "7d"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "hover:text-slate-200"
              }`}
            >
              7 Días
            </button>
            <button
              type="button"
              onClick={() => setPeriod("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "30d"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "hover:text-slate-200"
              }`}
            >
              30 Días
            </button>
            <button
              type="button"
              onClick={() => setPeriod("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "all"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "hover:text-slate-200"
              }`}
            >
              Todo
            </button>
          </div>

          {/* Botón Actualizar */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
            title="Refrescar métricas en vivo"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-sky-400" : ""}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          {/* Botón Exportar CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-all active:scale-95"
            title="Descargar reporte en formato CSV (Excel)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          {/* Botón Reiniciar Métricas */}
          <button
            type="button"
            onClick={() => setIsResetDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/40 text-xs font-semibold transition-all active:scale-95"
            title="Reiniciar contadores a cero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* 4 Tarjetas de Métricas Principales (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Consultas a WhatsApp */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Consultas WhatsApp
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white font-heading">
              {stats.totalWhatsappClicks.toLocaleString("es-MX")}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              Alta intención
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400/90 leading-tight">
            Clientes que solicitaron producto, servicio o cotización directa al chat.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Canal preferido</span>
            <span className="text-emerald-400 font-bold">Mostrador & Chat</span>
          </div>
        </div>

        {/* KPI 2: Búsquedas de Clientes */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-sky-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Búsquedas Realizadas
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white font-heading">
              {stats.totalSearches.toLocaleString("es-MX")}
            </span>
            <span className="text-[11px] font-semibold text-sky-400 flex items-center">
              <Sparkles className="w-3 h-3 mr-0.5" />
              En catálogo
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400/90 leading-tight">
            Consultas ingresadas en la barra de búsqueda por los visitantes.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Término líder</span>
            <span className="text-sky-400 font-bold">
              {stats.topSearches[0]?.query ? `"${stats.topSearches[0].query}"` : "Ninguno"}
            </span>
          </div>
        </div>

        {/* KPI 3: Clics a Ubicación / Mapa */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cómo Llegar (Mapa)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white font-heading">
              {stats.totalLocationClicks.toLocaleString("es-MX")}
            </span>
            <span className="text-[11px] font-semibold text-amber-400 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              Visita física
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400/90 leading-tight">
            Clics al botón de Google Maps para abrir la ruta hacia el cybercafé.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Sucursal</span>
            <span className="text-amber-400 font-bold truncate max-w-[130px]">Haciendas Ags</span>
          </div>
        </div>

        {/* KPI 4: Exploraciones del Catálogo */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Exploraciones
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white font-heading">
              {stats.totalCatalogViews.toLocaleString("es-MX")}
            </span>
            <span className="text-[11px] font-semibold text-purple-400 flex items-center">
              <Layers className="w-3 h-3 mr-0.5" />
              Vistas
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400/90 leading-tight">
            Visitas a fichas de productos, servicios y secciones del catálogo.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Interacción</span>
            <span className="text-purple-400 font-bold">Escaparate Digital</span>
          </div>
        </div>
      </div>

      {/* Grid Principal: 2 Columnas de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda (7 cols): Productos y Servicios Más Solicitados */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Top Productos y Servicios */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/70">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  Más Consultados en WhatsApp
                </h2>
                <p className="text-xs text-slate-400">
                  Artículos y servicios que generan más interés directo de los clientes.
                </p>
              </div>

              {/* Filtro Tipo */}
              <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setItemTypeFilter("all")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    itemTypeFilter === "all"
                      ? "bg-sky-500 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setItemTypeFilter("service")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    itemTypeFilter === "service"
                      ? "bg-sky-500 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Servicios
                </button>
                <button
                  type="button"
                  onClick={() => setItemTypeFilter("product")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    itemTypeFilter === "product"
                      ? "bg-sky-500 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Productos
                </button>
              </div>
            </div>

            {/* Lista de Ítems */}
            <div className="mt-4 space-y-3.5">
              {filteredTopItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No hay registros en esta categoría aún.
                </div>
              ) : (
                filteredTopItems.slice(0, 7).map((item, index) => {
                  const percentage = Math.round((item.whatsappClicks / maxItemClicks) * 100);
                  const isPodium = index < 3;
                  const podiumBadges = [
                    "bg-amber-500/20 text-amber-300 border-amber-500/40",
                    "bg-slate-300/20 text-slate-200 border-slate-400/40",
                    "bg-amber-700/20 text-amber-400 border-amber-700/40",
                  ];

                  return (
                    <div
                      key={item.itemId || index}
                      className="p-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/60 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Número / Badge de Podio */}
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border ${
                              isPodium
                                ? podiumBadges[index]
                                : "bg-slate-900 text-slate-500 border-slate-800"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-semibold text-slate-100 truncate group-hover:text-sky-300 transition-colors">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                                  item.type === "service"
                                    ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}
                              >
                                {item.type === "service" ? "Servicio" : "Producto"}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {item.views} vistas en catálogo
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Cantidad de Clics WhatsApp */}
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-1 text-emerald-400 font-bold text-xs sm:text-sm">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{item.whatsappClicks}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">consultas</span>
                        </div>
                      </div>

                      {/* Barra de Progreso Relativa */}
                      <div className="mt-2.5 w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.type === "service" ? "bg-sky-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.max(8, percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card: Origen de Clitics WhatsApp (CTA Breakdown) */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              ¿Desde Dónde Contactan Más los Clientes?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Desglose de llamadas a la acción (botones) que convirtieron en el escaparate.
            </p>

            <div className="mt-4 space-y-3">
              {stats.ctaBreakdown.map((cta) => (
                <div key={cta.location} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cta.label}</span>
                    <span className="text-slate-400 font-bold">
                      {cta.clicks} clics ({cta.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/70 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${cta.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha (5 cols): Búsquedas de Clientes & Categorías */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Términos Más Buscados */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="pb-3 border-b border-slate-800/70">
              <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <Search className="w-4 h-4 text-sky-400" />
                Términos Más Buscados
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Palabras que los visitantes escriben en el catálogo digital.
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              {stats.topSearches.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  Aún no hay búsquedas registradas.
                </div>
              ) : (
                stats.topSearches.slice(0, 8).map((searchStat, idx) => {
                  const hasZeroResults = searchStat.resultsCount === 0;

                  return (
                    <div
                      key={searchStat.query || idx}
                      className={`p-3 rounded-xl border transition-all ${
                        hasZeroResults
                          ? "bg-amber-950/20 border-amber-900/40 hover:border-amber-800/60"
                          : "bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block capitalize truncate">
                            &quot;{searchStat.query}&quot;
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {searchStat.resultsCount}{" "}
                            {searchStat.resultsCount === 1 ? "resultado" : "resultados"}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-slate-800 text-sky-300 border border-slate-700">
                            {searchStat.count} {searchStat.count === 1 ? "vez" : "veces"}
                          </span>
                        </div>
                      </div>

                      {/* Alerta de Oportunidad de Negocio si no hay stock/resultados */}
                      {hasZeroResults && (
                        <div className="mt-2 pt-2 border-t border-amber-900/30 flex items-center gap-1.5 text-[10px] text-amber-300 font-semibold">
                          <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>Oportunidad: Clientes buscan esto y no hay resultados en el catálogo.</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card: Distribución por Categoría */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Filter className="w-4 h-4 text-sky-400" />
              Interés por Categoría
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Líneas de productos y servicios con mayor atracción.
            </p>

            <div className="mt-4 space-y-3">
              {stats.categoryInterest.map((cat, i) => {
                const colors = [
                  "bg-sky-500",
                  "bg-indigo-500",
                  "bg-emerald-500",
                  "bg-purple-500",
                  "bg-amber-500",
                ];
                const barColor = colors[i % colors.length];

                return (
                  <div key={cat.categorySlug} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium truncate max-w-[200px]">
                        {cat.label}
                      </span>
                      <span className="text-slate-400 font-bold">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800/70 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tendencia de Actividad de los Últimos 7 Días (Gráfico Visual SVG) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/70">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              Actividad Reciente (Últimos 7 Días)
            </h2>
            <p className="text-xs text-slate-400">
              Tendencia diaria de consultas a WhatsApp, búsquedas y visitas.
            </p>
          </div>

          {/* Leyenda de Colores */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span>WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
              <span>Búsquedas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
              <span>Vistas (/10)</span>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras Estilizado Responsivo */}
        <div className="mt-6 pt-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 px-2 border-b border-slate-800 pb-2">
            {stats.dailyActivity.map((day, idx) => {
              const waHeight = Math.max(8, Math.round((day.whatsappClicks / maxDailyActivity) * 100));
              const searchHeight = Math.max(8, Math.round((day.searches / maxDailyActivity) * 100));
              const viewsScaled = Math.round(day.views / 10);
              const viewsHeight = Math.max(8, Math.round((viewsScaled / maxDailyActivity) * 100));

              return (
                <div key={day.date || idx} className="flex flex-col items-center h-full justify-end group">
                  {/* Tooltip flotante con detalles al pasar el mouse */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-[10px] text-slate-200 pointer-events-none whitespace-nowrap shadow-xl z-20">
                    <p className="font-bold text-sky-400">{day.dayLabel} ({day.date})</p>
                    <p>WA: {day.whatsappClicks} | Búsquedas: {day.searches}</p>
                    <p>Vistas: {day.views}</p>
                  </div>

                  {/* Grupo de 3 Barras */}
                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                    {/* Barra WhatsApp */}
                    <div
                      className="w-1/3 bg-emerald-500/80 hover:bg-emerald-400 rounded-t-md transition-all duration-300"
                      style={{ height: `${waHeight}%` }}
                      title={`WhatsApp: ${day.whatsappClicks}`}
                    />
                    {/* Barra Búsquedas */}
                    <div
                      className="w-1/3 bg-sky-500/80 hover:bg-sky-400 rounded-t-md transition-all duration-300"
                      style={{ height: `${searchHeight}%` }}
                      title={`Búsquedas: ${day.searches}`}
                    />
                    {/* Barra Vistas */}
                    <div
                      className="w-1/3 bg-purple-500/80 hover:bg-purple-400 rounded-t-md transition-all duration-300"
                      style={{ height: `${viewsHeight}%` }}
                      title={`Vistas: ${day.views}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Eje X: Etiquetas de días */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mt-2 px-2 text-center">
            {stats.dailyActivity.map((day, idx) => (
              <div key={day.date || idx} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {day.dayLabel}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diálogo de Confirmación para Reiniciar */}
      {isResetDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  ¿Reiniciar estadísticas?
                </h3>
                <p className="text-xs text-slate-400">
                  Esta acción reiniciará los contadores de clics de WhatsApp, búsquedas y visitas a cero.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              💡 <span className="font-semibold text-slate-200">Recomendación:</span> Si deseas guardar un respaldo de los números actuales antes de reiniciar, cancela y usa el botón <span className="text-sky-400 font-bold">&quot;Exportar CSV&quot;</span>.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsResetDialogOpen(false)}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Reiniciando...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sí, reiniciar a cero</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
