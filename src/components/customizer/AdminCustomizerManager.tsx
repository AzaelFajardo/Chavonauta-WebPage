"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Palette,
  Store,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Check,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
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
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [activeTab, setActiveTab] = useState<"sections" | "colors" | "identity">("sections");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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

  const handleSave = async () => {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar el tema";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setTheme(initialTheme);
    setHasChanges(false);
    showToast("Cambios descartados.");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
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
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Edita colores, secciones e identidad al estilo Tiendanube
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
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
              hasChanges
                ? "bg-navy-900 hover:bg-navy-800 text-white shadow-navy-900/20"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4 text-sky-300" />
            <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>
      </header>

      {/* Cuerpo Principal Dividido: Controles a la Izquierda / Preview a la Derecha */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Panel de Controles / Sidebar del Editor */}
        <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col shrink-0">
          {/* Pestañas de Navegación del Editor */}
          <div className="p-2 border-b border-slate-200 bg-slate-50/70 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("sections")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "sections"
                  ? "bg-white text-navy-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Secciones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("colors")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "colors"
                  ? "bg-white text-navy-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colores</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("identity")}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "identity"
                  ? "bg-white text-navy-900 shadow-2xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Identidad</span>
            </button>
          </div>

          {/* Contenido de la Pestaña Activa con Scroll */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "sections" && (
              <SectionManager
                sections={theme.sections}
                onChange={handleSectionsChange}
              />
            )}

            {activeTab === "colors" && (
              <ColorPaletteEditor
                theme={theme}
                onChange={handleUpdateTheme}
              />
            )}

            {activeTab === "identity" && (
              <BusinessInfoEditor
                business={theme.business}
                onChange={(updates) =>
                  handleUpdateTheme({
                    business: {
                      ...theme.business,
                      ...updates,
                    },
                  })
                }
              />
            )}
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
    </div>
  );
}
