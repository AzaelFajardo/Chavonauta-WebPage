"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Palette,
  Settings,
  ExternalLink,
  Menu,
  X,
  Store,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Catálogo y Servicios",
    href: "/admin/catalogo",
    icon: Package,
    description: "Productos, servicios y categorías",
  },
  {
    label: "Personalizador Visual",
    href: "/admin/personalizador",
    icon: Palette,
    description: "Colores, fuentes y secciones",
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
    description: "Sucursal, horarios y contacto",
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Barra superior para móvil */}
      <header className="lg:hidden sticky top-0 z-40 bg-navy-950 text-white border-b border-navy-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-accent">
            <Store className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <span className="font-heading font-black text-sm tracking-tight text-white block uppercase">
              Chavonauta
            </span>
            <span className="text-[10px] text-navy-300 font-medium tracking-wide uppercase">
              Panel de Control
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-navy-900 border border-navy-800 text-slate-200 hover:text-white"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Backdrop móvil */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar fijo (Desktop) / Drawer móvil */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-950 text-white flex flex-col border-r border-navy-900 shadow-xl transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Cabecera Sidebar */}
        <div className="p-5 border-b border-navy-900/80 bg-navy-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 flex items-center justify-center shadow-inner">
              <Store className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-base tracking-tight text-white uppercase">
                  Chavonauta
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-navy-800 text-sky-300 border border-navy-700">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-navy-300">Administrador de Tienda</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de Navegación */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-navy-300">
            Gestión
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-start gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-navy-800/90 text-white border border-navy-700 shadow-sm shadow-navy-950/30"
                    : "text-slate-300 hover:bg-navy-900 hover:text-white border border-transparent"
                }`}
              >
                <div
                  className={`mt-0.5 p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-navy-700 text-sky-300"
                      : "bg-navy-900/80 text-navy-300 group-hover:text-white group-hover:bg-navy-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[11px] text-navy-300/80 truncate">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer del Sidebar con enlace a la tienda */}
        <div className="p-4 border-t border-navy-900 bg-navy-950/95">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 hover:text-white border border-navy-800 hover:border-navy-700 transition-colors text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-sky-400" />
              <span>Ver Tienda Pública</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>
    </>
  );
}
