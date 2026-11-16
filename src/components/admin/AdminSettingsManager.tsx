"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  Megaphone,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { BusinessInfo, ScheduleItem, ThemeConfig } from "@/types";

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
  const [business, setBusiness] = useState<BusinessInfo>(initialTheme.business);
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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const payload: ThemeConfig = {
        ...initialTheme,
        business,
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
      showToast("¡Configuración de sucursal guardada con éxito!");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error desconocido al guardar";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
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

      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
            Configuración del Cybercafé
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administra los datos de sucursal, números de contacto, horarios y redes sociales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving || !hasChanges}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 ${
            hasChanges
              ? "bg-navy-900 hover:bg-navy-800 text-white shadow-navy-900/20"
              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          }`}
        >
          <Save className="w-4 h-4 text-sky-300" />
          <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Bloque 1: Identidad y Sucursal */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Información de la Sucursal y Marca
              </h2>
              <p className="text-[11px] text-slate-500">
                Datos generales que identifican al negocio en la cabecera y pie de página.
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-slate-800 text-xs block">
                  ¿Deseas subir o modificar el Logotipo?
                </span>
                <span className="text-[11px] text-slate-500 block">
                  El logotipo y la identidad visual se gestionan con previsualización en vivo desde el Personalizador Visual.
                </span>
              </div>
              <Link
                href="/admin/personalizador"
                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-navy-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shrink-0 shadow-2xs"
              >
                Personalizador Visual →
              </Link>
            </div>
          </div>
        </div>

        {/* Bloque 2: Contacto y Ubicación */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Bloque 3: Horarios de Atención */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
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
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
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
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-600 text-slate-800"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bloque 4: Redes Sociales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
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
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Bloque 5: Barra de Anuncio Superior */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Barra de Anuncios Superior
              </h2>
              <p className="text-[11px] text-slate-500">
                Aviso destacado en el encabezado de toda la página para avisar promociones o cierres.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <input
              type="checkbox"
              checked={business.announcementEnabled}
              onChange={(e) =>
                handleFieldChange("announcementEnabled", e.target.checked)
              }
              className="w-4 h-4 text-navy-800 rounded focus:ring-navy-800"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Activar barra de anuncio en la parte superior
              </span>
              <span className="text-[11px] text-slate-500 block">
                Si está desactivado, el banner no se mostrará a los visitantes.
              </span>
            </div>
          </label>

          {business.announcementEnabled && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Texto del Anuncio
              </label>
              <input
                type="text"
                value={business.announcementText || ""}
                onChange={(e) =>
                  handleFieldChange("announcementText", e.target.value)
                }
                placeholder="Ej. Atención directa por WhatsApp • Impresiones, trámites, soporte y renta de PC."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900"
              />
            </div>
          )}
        </div>

        {/* Botón inferior fijo/de cierre */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-xl transition-all shadow-sm ${
              hasChanges
                ? "bg-navy-900 hover:bg-navy-800 text-white shadow-navy-900/20"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4 text-sky-300" />
            <span>{isSaving ? "Guardando..." : "Guardar Toda la Configuración"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
