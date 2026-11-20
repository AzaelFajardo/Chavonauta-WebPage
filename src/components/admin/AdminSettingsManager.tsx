"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Calendar,
  AlertTriangle,
  X,
  Loader2,
  RotateCcw,
  Monitor,
} from "lucide-react";
import { BusinessInfo, ScheduleItem, ThemeConfig } from "@/types";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { AdminSecuritySettings } from "@/components/admin/AdminSecuritySettings";

interface AdminSettingsManagerProps {
  initialTheme: ThemeConfig;
}

const DEFAULT_DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export function AdminSettingsManager({
  initialTheme,
}: AdminSettingsManagerProps) {
  const router = useRouter();
  const [business, setBusiness] = useState<BusinessInfo>(initialTheme.business);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Estados para diálogo personalizado de confirmación de salida
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleFieldChange = (field: keyof BusinessInfo, value: unknown) => {
    setBusiness((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSocialChange = (
    network: "facebook" | "instagram" | "tiktok",
    value: string
  ) => {
    setBusiness((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleScheduleDetailChange = (day: string, hours: string) => {
    const existing = business.scheduleDetails || [];
    const index = existing.findIndex((s) => s.day.toLowerCase() === day.toLowerCase());

    let updated: ScheduleItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { day, hours };
    } else {
      updated = [...existing, { day, hours }];
    }

    setBusiness((prev) => ({
      ...prev,
      scheduleDetails: updated,
    }));
    setHasChanges(true);
  };

  const handleRatesChange = (field: "oneHour" | "halfHour", value: number) => {
    setBusiness((prev) => ({
      ...prev,
      computerRates: {
        oneHour: field === "oneHour" ? value : prev.computerRates?.oneHour ?? 7,
        halfHour: field === "halfHour" ? value : prev.computerRates?.halfHour ?? 4,
      },
    }));
    setHasChanges(true);
  };

  const handleDiscard = () => {
    setBusiness(initialTheme.business);
    setHasChanges(false);
    showToast("Cambios descartados.");
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const updatedSections = (initialTheme.sections || []).map((sec) => {
        if (sec.type === "rates") {
          return {
            ...sec,
            content: {
              ...sec.content,
              computerRates: business.computerRates || { oneHour: 7, halfHour: 4 },
            },
          };
        }
        return sec;
      });

      const payload: ThemeConfig = {
        ...initialTheme,
        business,
        sections: updatedSections,
      };

      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error al guardar la configuración");
      }

      setHasChanges(false);
      showToast("¡Configuración guardada con éxito!");
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error desconocido al guardar";
      showToast(msg, "error");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Interceptar navegación cuando hay cambios sin guardar
  useEffect(() => {
    if (!hasChanges) return;

    // 1. Interceptar clics en enlaces internos (por ejemplo el menú de navegación)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
      if (target.target === "_blank") return;

      e.preventDefault();
      e.stopPropagation();
      setPendingNavigationUrl(href);
      setIsLeaveConfirmOpen(true);
    };

    // 2. Interceptar botón "Atrás" del navegador
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setPendingNavigationUrl("BACK");
      setIsLeaveConfirmOpen(true);
    };

    // 3. Advertencia al cerrar pestaña o recargar página
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

  // Acciones del diálogo de confirmación
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

  // Enlace directo de prueba de WhatsApp
  const whatsappPreviewUrl = `https://wa.me/${business.whatsappNumber}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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

      {/* Cabecera Principal Sticky: Un único botón de guardado siempre accesible y con offset responsivo para no colisionar con la barra de navegación */}
      <div className="sticky top-[60px] sm:top-[66px] lg:top-3 z-30 flex flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl border border-slate-200/90 shadow-md transition-all">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
              Configuración
            </h1>
            {hasChanges && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse shrink-0">
                Pendiente
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden md:block">
            Administra los datos de sucursal, logotipo, números de contacto, horarios y redes sociales.
          </p>
        </div>

        {/* Botones de acción siempre visibles y compactos */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {hasChanges && (
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Descartar</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving || !hasChanges}
            className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs ${
              hasChanges
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95 cursor-pointer"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? "Guardando..." : "Guardar cambios"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
        {/* Bloque 1: Identidad y Sucursal */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Información de la Sucursal y Marca
              </h2>
              <p className="text-[11px] text-slate-500">
                Datos generales que identifican a tu negocio en la cabecera y pie de página.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre del Negocio *
              </label>
              <input
                type="text"
                value={business.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre de la Sucursal
              </label>
              <input
                type="text"
                value={business.branchName || ""}
                onChange={(e) => handleFieldChange("branchName", e.target.value)}
                placeholder="Ej. Haciendas de Aguascalientes"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Eslogan / Lema Comercial
              </label>
              <input
                type="text"
                value={business.slogan}
                onChange={(e) => handleFieldChange("slogan", e.target.value)}
                placeholder="Ej. Tecnología, accesorios y soluciones digitales"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            {/* Subida de Logotipo Oficial en Configuración */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <ImageUploader
                value={business.logoUrl || ""}
                onChange={(url) => handleFieldChange("logoUrl", url)}
                label="Logotipo"
                helperText="El logotipo aparecerá a 175px en la cabecera (con escalado responsivo para móviles) y en el pie de página de toda la web. Si no subes ninguno, se mostrará el nombre comercial con la tipografía de la marca."
              />
            </div>
          </div>
        </div>

        {/* Bloque 2: Contacto y Ubicación */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Contacto Directo y Ubicación
              </h2>
              <p className="text-[11px] text-slate-500">
                Medios para que tus clientes te escriban o te encuentren fácilmente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  WhatsApp Oficial *
                </label>
                <a
                  href={whatsappPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Probar Chat</span>
                </a>
              </div>
              <input
                type="text"
                value={business.whatsappNumber}
                onChange={(e) => handleFieldChange("whatsappNumber", e.target.value)}
                placeholder="5214494022163"
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Incluye la clave de país (ej. 521 para México + número a 10 dígitos).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={business.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="ciberchavonauta@gmail.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dirección Física Completa
              </label>
              <input
                type="text"
                value={business.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                placeholder="Calle, Número, Colonia, Ciudad, Estado"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Enlace de Google Maps
              </label>
              <input
                type="url"
                value={business.googleMapsUrl || ""}
                onChange={(e) => handleFieldChange("googleMapsUrl", e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Bloque 3: Horarios de Atención */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Horarios de Sucursal
              </h2>
              <p className="text-[11px] text-slate-500">
                Horario general resumido y desglose día por día.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Horario General (Visible en pie de página y cintillos)
            </label>
            <input
              type="text"
              value={business.schedule}
              onChange={(e) => handleFieldChange("schedule", e.target.value)}
              placeholder="Lunes a Viernes: 8:00 - 22:00 | Sábado y Domingo: 12:00 - 22:00"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
            />
          </div>

          {/* Horario detallado día por día */}
          <div className="pt-2">
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Horario Detallado por Día
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {DEFAULT_DAYS.map((day) => {
                const current = business.scheduleDetails?.find(
                  (s) => s.day.toLowerCase() === day.toLowerCase()
                )?.hours || "";

                return (
                  <div
                    key={day}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60"
                  >
                    <span className="block text-[11px] font-bold text-slate-800 mb-1">
                      {day}
                    </span>
                    <input
                      type="text"
                      value={current}
                      onChange={(e) => handleScheduleDetailChange(day, e.target.value)}
                      placeholder="8:00 - 22:00 o Cerrado"
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bloque 4: Redes Sociales */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Redes Sociales Oficiales
              </h2>
              <p className="text-[11px] text-slate-500">
                Enlaces a tus perfiles que se integran en el pie de página.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Facebook URL
              </label>
              <input
                type="url"
                value={business.socialLinks?.facebook || ""}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={business.socialLinks?.instagram || ""}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                TikTok URL
              </label>
              <input
                type="url"
                value={business.socialLinks?.tiktok || ""}
                onChange={(e) => handleSocialChange("tiktok", e.target.value)}
                placeholder="https://tiktok.com/@..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Bloque 5: Tarifas de Renta de Equipos */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Tarifas de Renta de Equipos (Computadoras)
              </h2>
              <p className="text-[11px] text-slate-500">
                Define el precio por hora y media hora. Se sincronizará automáticamente en la cabecera, pie de página y la sección de tarifas del escaparate.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <span>Tarifa 1 Hora (MXN) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={business.computerRates?.oneHour ?? 7}
                  onChange={(e) =>
                    handleRatesChange("oneHour", parseFloat(e.target.value) || 0)
                  }
                  required
                  className="w-full pl-7 pr-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Precio visible en la cabecera (ej. &quot;Renta PC $7/hr&quot;) y tarjetas principales.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <span>Tarifa Media Hora / 30 min (MXN) *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={business.computerRates?.halfHour ?? 4}
                  onChange={(e) =>
                    handleRatesChange("halfHour", parseFloat(e.target.value) || 0)
                  }
                  required
                  className="w-full pl-7 pr-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Fracción estándar para usuarios con necesidades cortas (30 minutos).
              </span>
            </div>
          </div>

          {/* Previsualización en Vivo de Tarifas */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 font-medium">Previsualización de Tarifas:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-blue-900 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                1 Hora: ${(business.computerRates?.oneHour ?? 7).toFixed(2)} MXN
              </span>
              <span className="font-bold text-slate-800 bg-slate-200/70 border border-slate-300 px-2.5 py-0.5 rounded-lg">
                Media Hora: ${(business.computerRates?.halfHour ?? 4).toFixed(2)} MXN
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* Bloque 6: Seguridad, Whitelist de Personal y Contraseña de Administración */}
      <AdminSecuritySettings />

      {/* Diálogo Personalizado de Confirmación para Salir sin Guardar (NUNCA el del navegador) */}
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
                  <p className="text-xs text-slate-500">Hay modificaciones pendientes</p>
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
                Has realizado cambios en la configuración que aún no se han guardado. Si sales ahora de esta página, se perderán todas las modificaciones.
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
