"use client";

import React from "react";
import { BusinessInfo } from "@/types";
import { Store, Megaphone } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface BusinessInfoEditorProps {
  business: BusinessInfo;
  onChange: (updates: Partial<BusinessInfo>) => void;
}

export function BusinessInfoEditor({
  business,
  onChange,
}: BusinessInfoEditorProps) {
  return (
    <div className="space-y-5">
      {/* 1. Logotipo Oficial */}
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
          helperText="Sube tu imagen (PNG transparente, SVG, JPG o WEBP). Se mostrará a 175px en escritorio con escalado responsivo automático en dispositivos móviles."
        />
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
