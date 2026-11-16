"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Clock,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";
import { ThemeConfig, ScheduleItem } from "@/types";

export default function AdminSettingsPage() {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [branchName, setBranchName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [address, setAddress] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [generalSchedule, setGeneralSchedule] = useState("");
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleItem[]>([]);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [rateHour, setRateHour] = useState<number>(7);
  const [rateHalfHour, setRateHalfHour] = useState<number>(4);

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

        // Prellenar campos
        setName(data.business?.name || "CHAVONAUTA");
        setSlogan(data.business?.slogan || "");
        setBranchName(data.business?.branchName || "Haciendas de Aguascalientes");
        setLogoUrl(data.business?.logoUrl || "");
        setAddress(data.business?.address || "");
        setWhatsappNumber(data.business?.whatsappNumber || "4494022163");
        setEmail(data.business?.email || "ciberchavonauta@gmail.com");
        setGeneralSchedule(data.business?.schedule || "");
        setScheduleDetails(data.business?.scheduleDetails || []);
        setGoogleMapsUrl(data.business?.googleMapsUrl || "");
        setAnnouncementText(data.business?.announcementText || "");
        setAnnouncementEnabled(Boolean(data.business?.announcementEnabled));

        // Tarifas desde sec-rates
        const ratesSection = data.sections?.find((s) => s.id === "sec-rates");
        if (ratesSection && ratesSection.content?.computerRates) {
          const rates = ratesSection.content.computerRates as { oneHour: number; halfHour: number };
          setRateHour(rates.oneHour ?? 7);
          setRateHalfHour(rates.halfHour ?? 4);
        }
      } catch (err) {
        showToast("error", "No se pudo cargar la configuración de la sucursal.");
      } finally {
        setLoading(false);
      }
    }

    fetchTheme();
  }, []);

  const handleUpdateScheduleDetail = (index: number, hours: string) => {
    const updated = [...scheduleDetails];
    updated[index].hours = hours;
    setScheduleDetails(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;

    setSaving(true);
    try {
      // Limpiar número de WhatsApp para enlace
      const cleanWa = whatsappNumber.replace(/\D/g, "");

      // Actualizar tarifas en sección sec-rates
      const updatedSections = theme.sections.map((sec) => {
        if (sec.id === "sec-rates") {
          return {
            ...sec,
            content: {
              ...sec.content,
              computerRates: {
                oneHour: Number(rateHour) || 7,
                halfHour: Number(rateHalfHour) || 4,
              },
            },
          };
        }
        return sec;
      });

      const updatedPayload: Partial<ThemeConfig> = {
        business: {
          ...theme.business,
          name: name.trim(),
          slogan: slogan.trim(),
          branchName: branchName.trim(),
          logoUrl: logoUrl.trim(),
          address: address.trim(),
          whatsappNumber: cleanWa,
          email: email.trim(),
          schedule: generalSchedule.trim(),
          scheduleDetails,
          googleMapsUrl: googleMapsUrl.trim(),
          announcementText: announcementText.trim(),
          announcementEnabled,
        },
        sections: updatedSections,
      };

      const res = await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al guardar");
      }

      const { theme: savedTheme } = await res.json();
      setTheme(savedTheme);
      showToast("success", "Configuración de sucursal y tarifas guardada correctamente.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-8 h-8 border-3 border-navy-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Cargando configuración de la sucursal...</p>
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
            Sucursal, Horarios y Contacto
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personaliza los datos públicos del cybercafé: dirección, horarios por día, WhatsApp y tarifas de computadoras.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Bloque 1: Identidad de Marca y Sucursal */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building2 className="w-4 h-4 text-navy-800" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
              1. Identidad del Negocio y Sucursal
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Negocio
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de la Sucursal
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="ej. Haciendas de Aguascalientes"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Eslogan o Descripción Corta
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="ej. Cybercafé, papelería y soluciones tecnológicas"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL del Logo (Opcional)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="Deja vacío para mostrar texto sobrio 'CHAVONAUTA' sin imágenes"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-navy-600 shrink-0" />
              <span>
                Si no se coloca ningún enlace de logo, el encabezado mostrará únicamente el nombre estilizado &quot;CHAVONAUTA&quot;.
              </span>
            </p>
          </div>
        </div>

        {/* Bloque 2: Tarifas de Computadoras */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <DollarSign className="w-4 h-4 text-navy-800" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
              2. Tarifas de Renta de Equipos (PC / Internet)
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            Ajusta los precios de renta de computadoras por hora y por media hora que se muestran en el banner superior y en la sección de tarifas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Precio por 1 Hora Completa (MXN)
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.5"
                  value={rateHour}
                  onChange={(e) => setRateHour(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 font-bold"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Valor actual: ${rateHour.toFixed(2)} MXN
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Precio por Media Hora (30 min) (MXN)
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.5"
                  value={rateHalfHour}
                  onChange={(e) => setRateHalfHour(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 font-bold"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Valor actual: ${rateHalfHour.toFixed(2)} MXN
              </span>
            </div>
          </div>
        </div>

        {/* Bloque 3: Ubicación y Contacto Directo */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <MapPin className="w-4 h-4 text-navy-800" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
              3. Ubicación y Contacto de WhatsApp
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dirección de la Sucursal
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Hacienda las Amarillas #44, Haciendas de Aguascalientes, Aguascalientes, Ags."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono de WhatsApp (Solo números)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="4494022163"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500 font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Se usará para todos los botones de contacto directo por WhatsApp del catálogo.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ciberchavonauta@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enlace de Google Maps (Ubicación)
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
        </div>

        {/* Bloque 4: Horarios de Atención Detallados */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Clock className="w-4 h-4 text-navy-800" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
              4. Horarios de Atención
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resumen General de Horario (Se muestra en la barra de navegación)
            </label>
            <input
              type="text"
              value={generalSchedule}
              onChange={(e) => setGeneralSchedule(e.target.value)}
              placeholder="Lunes a Viernes: 8:00 - 22:00 | Sábado y Domingo: 12:00 - 22:00"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Horario Específico por Día de la Semana
            </label>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 divide-y divide-slate-200">
              {scheduleDetails.map((item, idx) => (
                <div key={item.day} className="py-2 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <span className="text-xs font-bold text-slate-800 w-28 shrink-0">
                    {item.day}
                  </span>
                  <input
                    type="text"
                    value={item.hours}
                    onChange={(e) => handleUpdateScheduleDetail(idx, e.target.value)}
                    placeholder="ej. 8:00 - 22:00"
                    className="flex-1 max-w-xs px-2.5 py-1 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-500 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botón flotante o inferior para guardar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Toda la Configuración</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
