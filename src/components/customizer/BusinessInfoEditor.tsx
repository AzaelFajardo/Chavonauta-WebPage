"use client";

import React from "react";
import { BusinessInfo } from "@/types";
import { Store, Megaphone, Phone, MapPin, Mail, Clock } from "lucide-react";
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
      {/* Datos Principales */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-navy-800" />
          <span>Identidad de la Marca</span>
        </label>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Nombre Comercial
            </label>
            <input
              type="text"
              value={business.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Eslogan / Frase Descriptiva
            </label>
            <input
              type="text"
              value={business.slogan}
              onChange={(e) => onChange({ slogan: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
            />
          </div>

          {/* Subida de Logotipo Oficial */}
          <div className="pt-2">
            <ImageUploader
              value={business.logoUrl || ""}
              onChange={(url) => onChange({ logoUrl: url })}
              label="Logotipo"
              helperText="El logotipo aparecerá en la cabecera y en el pie de página del escaparate. Si no subes ninguno, se mostrará el nombre con la tipografía de la marca."
            />
          </div>
        </div>
      </div>

      {/* Barra de Anuncios Superior */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
          <Megaphone className="w-4 h-4 text-navy-800" />
          <span>Barra Superior de Aviso</span>
        </label>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={business.announcementEnabled}
              onChange={(e) =>
                onChange({ announcementEnabled: e.target.checked })
              }
              className="w-4 h-4 text-navy-800 rounded focus:ring-navy-800"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Mostrar barra de aviso en la cabecera
              </span>
              <span className="text-[11px] text-slate-500 block">
                Cintillo superior visible en toda la web.
              </span>
            </div>
          </label>

          {business.announcementEnabled && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Texto del Anuncio
              </label>
              <input
                type="text"
                value={business.announcementText || ""}
                onChange={(e) => onChange({ announcementText: e.target.value })}
                placeholder="Ej. Atención directa por WhatsApp • Impresiones, trámites y renta de PC."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
              />
            </div>
          )}
        </div>
      </div>

      {/* Contacto y Ubicación */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-navy-800" />
          <span>Contacto y Horarios</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              WhatsApp (Con clave de país)
            </label>
            <input
              type="text"
              value={business.whatsappNumber}
              onChange={(e) => onChange({ whatsappNumber: e.target.value })}
              placeholder="Ej. 5214494022163"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={business.email || ""}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="ciberchavonauta@gmail.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Dirección Completa
          </label>
          <input
            type="text"
            value={business.address}
            onChange={(e) => onChange({ address: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Horario Resumido
          </label>
          <input
            type="text"
            value={business.schedule}
            onChange={(e) => onChange({ schedule: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
          />
        </div>
      </div>
    </div>
  );
}
