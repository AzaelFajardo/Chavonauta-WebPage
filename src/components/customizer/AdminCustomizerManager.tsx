"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  Palette,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Check,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  X,
  Settings,
  Store,
} from "lucide-react";
import { CatalogItem, Category, SectionBlock, ThemeConfig } from "@/types";
import { SectionManager } from "./SectionManager";
import { ColorPaletteEditor } from "./ColorPaletteEditor";
import { BusinessInfoEditor } from "./BusinessInfoEditor";
import { LivePreview } from "./LivePreview";

interface AdminCustomizerManagerProps {
  initialTheme: ThemeConfig;
  items: CatalogItem[];
  categories: Category[];
}

export function AdminCustomizerManager({
  initialTheme,
  items,
  categories,
}: AdminCustomizerManagerProps) {
  const router = useRouter();

  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [activeTab, setActiveTab] = useState<"logo" | "colors" | "sections">("logo");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Estados para Diálogo de Salida con Cambios sin Guardar
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);

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

  const handleUpdateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme((prev) => ({
      ...prev,
      ...updates,
    }));
    setHasChanges(true);
  };

  const handleSectionsChange = (newSections: SectionBlock[]) => {
    setTheme((prev) => ({
      ...prev,
      sections: newSections,
    }));
    setHasChanges(true);
  };

  // Guardar configuración del tema en la API
  const handleSave = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });

      if (!res.ok) {
        throw new Error("No se pudo guardar la configuración");
      }

      const saved: ThemeConfig = await res.json();
      setTheme(saved);
      setHasChanges(false);
      showToast("¡Diseño y configuración guardados con éxito!");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar el tema";
      showToast(msg, "error");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setTheme(initialTheme);
    setHasChanges(false);
    showToast("Cambios descartados.");
  };

  // Intercepción de salida si hay cambios sin guardar
  useEffect(() => {
    if (!hasChanges) return;

    // 1. Interceptar clics en enlaces (<a>)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      // Si el enlace abre en una nueva pestaña (ej. Ver Tienda), no interceptar
      if (anchor.getAttribute("target") === "_blank") return;

      const href = anchor.getAttribute("href");
      if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
        e.preventDefault();
        e.stopPropagation();
        setPendingNavigationUrl(href);
        setIsLeaveConfirmOpen(true);
      }
    };

    // 2. Interceptar botón atrás del navegador
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setPendingNavigationUrl("BACK");
      setIsLeaveConfirmOpen(true);
    };

    // 3. Advertencia al cerrar pestaña o recargar navegador
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [hasChanges]);

  // Acciones del Diálogo de Salida
  const handleCancelLeave = () => {
    setIsLeaveConfirmOpen(false);
    setPendingNavigationUrl(null);
  };

  const handleConfirmLeaveWithoutSaving = () => {
    setIsLeaveConfirmOpen(false);
    setHasChanges(false);

    if (pendingNavigationUrl === "BACK") {
      window.history.back();
    } else if (pendingNavigationUrl) {
      router.push(pendingNavigationUrl);
    }
  };

  const handleSaveAndLeave = async () => {
    const success = await handleSave();
    if (success) {
      setIsLeaveConfirmOpen(false);
      setHasChanges(false);

      if (pendingNavigationUrl === "BACK") {
        window.history.back();
      } else if (pendingNavigationUrl) {
        router.push(pendingNavigationUrl);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-5rem)] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
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

      {/* Barra Superior del Personalizador */}
      <header className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-sm sm:text-base text-slate-900 tracking-tight">
                Personalizador Visual
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-100 text-navy-800 uppercase tracking-wider">
                En vivo
              </span>
              {hasChanges && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Cambios pendientes
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Edita paletas de color, estilo de bordes, tipografías y orden de bloques
            </p>
          </div>
        </div>

        {/* Selector de Dispositivo (Desktop / Tablet / Mobile) */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewport === "desktop"
                ? "bg-white text-navy-900 shadow-2xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Vista de Computadora"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewport === "tablet"
                ? "bg-white text-navy-900 shadow-2xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Vista de Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewport === "mobile"
                ? "bg-white text-navy-900 shadow-2xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Vista de Celular"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Acciones: Descartar, Guardar y Ver Escaparate */}
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Descartar
            </button>
          )}

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Tienda</span>
          </Link>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving || !hasChanges}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
              hasChanges
                ? "bg-navy-900 hover:bg-navy-800 text-white shadow-navy-900/20"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4 text-sky-300" />
            )}
            <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>
      </header>

      {/* Cuerpo Principal Dividido: Controles a la Izquierda / Preview a la Derecha */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Panel de Controles / Sidebar del Editor */}
        <div className="w-full lg:w-[410px] border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col shrink-0">
          {/* Pestañas de Navegación del Editor */}
          <div className="p-2 border-b border-slate-200 bg-slate-50/70 grid grid-cols-3 gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("logo")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === "logo"
                  ? "bg-white text-blue-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Store className="w-3.5 h-3.5 text-blue-600" />
              <span>Identidad</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("colors")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === "colors"
                  ? "bg-white text-blue-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>Colores</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sections")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === "sections"
                  ? "bg-white text-blue-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Secciones</span>
            </button>
          </div>

          {/* Contenido de la Pestaña Activa con Scroll */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "logo" && (
              <BusinessInfoEditor
                business={theme.business}
                onChange={(updates) => {
                  setTheme((prev) => ({
                    ...prev,
                    business: {
                      ...prev.business,
                      ...updates,
                    },
                  }));
                  setHasChanges(true);
                }}
              />
            )}

            {activeTab === "colors" && (
              <ColorPaletteEditor
                theme={theme}
                onChange={handleUpdateTheme}
              />
            )}

            {activeTab === "sections" && (
              <SectionManager
                sections={theme.sections}
                onChange={handleSectionsChange}
              />
            )}
          </div>

          {/* Pie informativo para redirigir a Configuración */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0">
            <p className="text-[11px] text-slate-500">
              ¿Deseas editar horarios detallados, redes sociales o mapa?
            </p>
            <Link
              href="/admin/configuracion"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline mt-0.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Ir a Configuración</span>
            </Link>
          </div>
        </div>

        {/* Vista Previa en Vivo (Live Preview) */}
        <LivePreview
          theme={theme}
          items={items}
          categories={categories}
          viewport={viewport}
        />
      </div>

      {/* Diálogo Personalizado de Confirmación para Salir sin Guardar */}
      {isLeaveConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    ¿Salir sin guardar los cambios?
                  </h3>
                  <p className="text-xs text-slate-500">Hay modificaciones de diseño pendientes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelLeave}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Has realizado ajustes de color, estilo o secciones que aún no se han guardado. Si sales ahora de esta pantalla, se perderán todas las modificaciones.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelLeave}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors order-2 sm:order-1"
              >
                Seguir editando
              </button>
              <button
                type="button"
                onClick={handleConfirmLeaveWithoutSaving}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors order-3 sm:order-2"
              >
                Salir sin guardar
              </button>
              <button
                type="button"
                onClick={handleSaveAndLeave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs order-1 sm:order-3 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? "Guardando..." : "Guardar y salir"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
