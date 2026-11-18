"use client";

import React from "react";
import { BusinessInfo } from "@/types";
import { Store, Megaphone, Phone, MapPin, Mail, Clock, Maximize2, Smartphone } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface BusinessInfoEditorProps {
  business: BusinessInfo;
  onChange: (updates: Partial<BusinessInfo>) => void;
}

export function BusinessInfoEditor({
  business,
  onChange,
}: BusinessInfoEditorProps) {
  const currentLogoWidth = business.logoWidth || 130;

  return (
    <div className="space-y-5">
      {/* 1. Logotipo y Tamaño Responsivo */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-blue-600" />
          <span>Logotipo Oficial de la Tienda</span>
        </label>

        {/* Componente Uploader de Imagen */}
        <ImageUploader
          value={business.logoUrl || ""}
          onChange={(url) => onChange({ logoUrl: url })}
          label="Archivo del Logotipo"
          helperText="Sube tu imagen (PNG transparente, SVG, JPG o WEBP). Aparecerá en la cabecera y pie de página de todo el escaparate."
        />

        {/* Controles de Tamaño (solo visibles si se ha cargado un logotipo) */}
        {business.logoUrl && (
          <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-3 animate-in fade-in duration-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Tamaño del Logotipo</span>
              </label>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                {currentLogoWidth}px
              </span>
            </div>

            {/* Slider continuo de escala */}
            <div>
              <input
                type="range"
                min={60}
                max={240}
                step={5}
                value={currentLogoWidth}
                onChange={(e) => onChange({ logoWidth: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>Chico (60px)</span>
                <span>Estándar (130px)</span>
                <span>Grande (240px)</span>
              </div>
            </div>

            {/* Presets rápidos de tamaño */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "Chico", px: 90 },
                { label: "Medio", px: 130 },
                { label: "Grande", px: 175 },
                { label: "Máx", px: 220 },
              ].map((preset) => {
                const isActive = currentLogoWidth === preset.px;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onChange({ logoWidth: preset.px })}
                    className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg border transition-all text-center ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label} ({preset.px}px)
                  </button>
                );
              })}
            </div>

            {/* Previsualización en caja de contraste */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-1.5">
              <span className="text-[10px] font-medium text-slate-400">
                Previsualización a escala real:
              </span>
              <div className="h-12 flex items-center justify-center max-w-full overflow-hidden">
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  style={{
                    width: `${currentLogoWidth}px`,
                    maxHeight: "44px",
                  }}
                  className="h-auto max-h-11 object-contain transition-all duration-150"
                />
              </div>
            </div>

            {/* Alerta de Adaptabilidad Responsiva */}
            <div className="p-2.5 bg-blue-50/80 border border-blue-200/80 rounded-lg text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
              <Smartphone className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Diseño Responsivo:</strong> En escritorio tu logo se ajusta al ancho elegido. En celulares se escala de forma inteligente para que nunca desborde la cabecera ni tape los accesos de menú o WhatsApp.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Identidad del Negocio */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-blue-600" />
          <span>Datos de la Marca</span>
        </label>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Nombre Comercial *
          </label>
          <input
            type="text"
            value={business.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Eslogan / Frase Comercial
          </label>
          <input
            type="text"
            value={business.slogan}
            onChange={(e) => onChange({ slogan: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Nombre de Sucursal
          </label>
          <input
            type="text"
            value={business.branchName || ""}
            onChange={(e) => onChange({ branchName: e.target.value })}
            placeholder="Ej. Haciendas de Aguascalientes"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
        </div>
      </div>

      {/* 3. Barra Superior de Anuncios */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <Megaphone className="w-4 h-4 text-blue-600" />
          <span>Barra Superior de Aviso</span>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            checked={business.announcementEnabled}
            onChange={(e) =>
              onChange({ announcementEnabled: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600"
          />
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Mostrar barra de aviso en la cabecera
            </span>
            <span className="text-[11px] text-slate-500 block">
              Cintillo informativo visible para todos los visitantes.
            </span>
          </div>
        </label>

        {business.announcementEnabled && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Texto del Aviso
            </label>
            <input
              type="text"
              value={business.announcementText || ""}
              onChange={(e) => onChange({ announcementText: e.target.value })}
              placeholder="Ej. Atención directa por WhatsApp • Impresiones, trámites y renta de PC."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>
        )}
      </div>
    </div>
  );
}
