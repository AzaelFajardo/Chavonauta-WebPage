"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Palette, Store, ExternalLink, SlidersHorizontal, MapPin } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Catálogo y Servicios",
      href: "/admin/catalogo",
      icon: Package,
      description: "Gestionar productos, servicios y precios",
    },
    {
      name: "Personalizador Visual",
      href: "/admin/personalizador",
      icon: Palette,
      description: "Tema, colores, fuentes y secciones",
    },
    {
      name: "Sucursal y Horarios",
      href: "/admin/configuracion",
      icon: MapPin,
      description: "Ubicación, horarios y WhatsApp",
    },
  ];

  return (
    <header className="bg-navy-900 text-white shadow-md border-b border-navy-800">
      {/* Barra superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título del panel */}
          <div className="flex items-center gap-3">
            <Link href="/admin/catalogo" className="flex items-center gap-2 group">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-navy-100 transition-colors">
                CHAVONAUTA
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-navy-800 text-navy-200 border border-navy-700">
                Panel de Control
              </span>
            </Link>
          </div>

          {/* Acceso directo a tienda pública */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-md bg-navy-800 hover:bg-navy-700 text-navy-100 border border-navy-700 transition-colors"
            >
              <Store className="w-4 h-4 text-navy-300" />
              <span>Ver Tienda Pública</span>
              <ExternalLink className="w-3.5 h-3.5 text-navy-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Barra secundaria con pestañas de navegación */}
      <div className="bg-navy-950/70 border-t border-navy-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin/catalogo"
                  ? pathname === "/admin" || pathname === "/admin/catalogo"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-navy-700 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-navy-800/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-navy-200" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
