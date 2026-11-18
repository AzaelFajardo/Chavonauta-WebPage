"use client";

import React from "react";
import Link from "next/link";
import { BusinessInfo } from "@/types";
import { Store, Megaphone, ArrowUpRight } from "lucide-react";

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
      {/* Aviso informativo de Logotipo */}
      <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-[11px] font-medium leading-relaxed">
            El logotipo oficial se administra desde <strong>Configuración</strong>.
          </span>
        </div>
        <Link
          href="/admin/configuracion"
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs"
        >
          <span>Ir</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 1. Identidad del Negocio */}
      <div className="space-y-3">
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

      {/* 2. Barra Superior de Anuncios */}
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
