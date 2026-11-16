"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit3,
  Sliders,
} from "lucide-react";
import { ThemeConfig, SectionBlock } from "@/types";

export default function AdminCustomizerPage() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [sections, setSections] = useState<SectionBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    async function fetchTheme() {
      try {
        setLoading(true);
        const res = await fetch("/api/theme");
        if (!res.ok) throw new Error("Error al obtener datos");
        const data: ThemeConfig = await res.json();
        setTheme(data);
        const sorted = [...(data.sections || [])].sort((a, b) => a.order - b.order);
        setSections(sorted);
      } catch (err) {
        showToast("error", "No se pudo cargar la configuración de secciones.");
      } finally {
        setLoading(false);
      }
    }

    fetchTheme();
  }, []);

  const handleToggleEnabled = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Reasignar orden numérico
    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(reordered);
  };

  const handleUpdateSectionText = (id: string, title: string, subtitle?: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title, subtitle } : s))
    );
  };

  const handleSave = async () => {
    if (!theme) return;
    setSaving(true);
    try {
      const res = await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al guardar");
      }

      showToast("success", "Estructura y secciones de la página guardadas correctamente.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-3 border-navy-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Cargando personalizador de secciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold border transition-all animate-in slide-in-from-bottom-3 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Personalizador de Secciones (Inicio)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organiza, activa, oculta o renombra los bloques modulares que tus clientes ven en la página principal.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Ver Portada</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-navy-800 hover:bg-navy-700 text-white shadow-sm transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lista de Secciones Reordenables */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-navy-800" />
            <span className="text-xs font-bold uppercase tracking-wider text-navy-900">
              Bloques Modulares de la Página Principal
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Usa las flechas para cambiar el orden de aparición
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {sections.map((section, idx) => {
            const isEditing = editingSectionId === section.id;

            return (
              <div
                key={section.id}
                className={`p-4 transition-colors ${
                  !section.enabled ? "bg-slate-50/70 opacity-60" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Reordenar y número */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-navy-900 hover:bg-slate-200 disabled:opacity-20 transition-colors"
                        title="Mover arriba"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-navy-900 hover:bg-slate-200 disabled:opacity-20 transition-colors"
                        title="Mover abajo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {section.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                          {section.type}
                        </span>
                      </div>
                      {section.subtitle && (
                        <p className="text-[11px] text-slate-500 mt-0.5 max-w-md truncate">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Acciones de la sección */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingSectionId(isEditing ? null : section.id)
                      }
                      className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEditing ? "Cerrar" : "Editar texto"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(section.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                        section.enabled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                      }`}
                    >
                      {section.enabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Oculta</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Formulario desplegable para editar título y subtítulo */}
                {isEditing && (
                  <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 p-3 rounded-lg space-y-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Título de la Sección
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleUpdateSectionText(section.id, e.target.value, section.subtitle)
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Subtítulo o Descripción
                      </label>
                      <input
                        type="text"
                        value={section.subtitle || ""}
                        onChange={(e) =>
                          handleUpdateSectionText(section.id, section.title, e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-500 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-navy-800 hover:bg-navy-700 text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios de Secciones</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
