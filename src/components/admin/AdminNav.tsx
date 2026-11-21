"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "CATÁLOGO",
    href: "/admin/catalogo",
    icon: Package,
    description: "Productos, servicios y categorías",
  },
  {
    label: "PERSONALIZAR",
    href: "/admin/personalizador",
    icon: Palette,
    description: "Colores, fuentes y secciones",
  },
  {
    label: "CONFIGURACIÓN",
    href: "/admin/configuracion",
    icon: Settings,
    description: "Sucursal, horarios y contacto",
  },
  {
    label: "SEGURIDAD",
    href: "/admin/seguridad",
    icon: Shield,
    description: "Whitelist y claves de acceso",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  // Si estamos en la página de inicio de sesión, no mostrar ninguna barra de navegación
  if (pathname === "/admin/login") {
    return null;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar timer si el componente se desmonta
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    // Breve margen de gracia para evitar que se cierre si el mouse sale accidentalmente unos milisegundos
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 220);
  };

  const handleItemClick = () => {
    setIsHovered(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignorar
    }
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Zona de activación hover en el borde izquierdo (Desktop) */}
      <div
        onMouseEnter={handleMouseEnter}
        className="hidden lg:block fixed left-0 top-0 bottom-0 w-3 z-40 cursor-pointer"
        aria-hidden="true"
      />

      {/* Pestaña flotante indicadora del menú en el borde izquierdo (Desktop) */}
      <div
        onMouseEnter={handleMouseEnter}
        onClick={() => setIsHovered(true)}
        className={`hidden lg:flex fixed top-6 left-0 z-40 items-center gap-2 pl-2.5 pr-3 py-2 bg-white/95 text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-l-0 border-slate-200/90 rounded-r-xl shadow-md shadow-slate-300/40 cursor-pointer transition-all duration-300 backdrop-blur-sm select-none group ${
          isHovered
            ? "opacity-0 pointer-events-none -translate-x-full"
            : "opacity-100 translate-x-0"
        }`}
        title="Pasa el mouse para desplegar la barra lateral"
      >
        <Menu className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
        <span className="text-[11px] font-bold tracking-wider text-slate-700 group-hover:text-slate-900">
          MENÚ
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* Barra superior para móvil y tablet */}
      <header className="lg:hidden sticky top-0 z-40 bg-white text-slate-900 border-b border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          {/* Botón de Menú Hamburguesa a la IZQUIERDA para celulares y tablets */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 active:scale-95 transition-all focus:outline-none"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Store className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="font-heading font-black text-sm tracking-tight text-slate-900 block uppercase leading-tight">
                Chavonauta
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase leading-none">
                Panel de Control
              </span>
            </div>
          </div>
        </div>

        {/* Acceso directo a Ver Tienda en el extremo derecho */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shrink-0 active:scale-95"
          title="Ver tienda pública en una pestaña nueva"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Ver Tienda</span>
        </Link>
      </header>

      {/* Backdrop móvil */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Desplegable al Hover (Desktop) / Drawer móvil */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-800 flex flex-col border-r border-slate-200 shadow-2xl shadow-slate-300/50 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen || isHovered ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Cabecera Sidebar */}
        <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Store className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <span className="font-heading font-black text-base tracking-tight text-slate-900 uppercase block leading-tight">
                Chavonauta
              </span>
              <p className="text-[11px] text-slate-500">Administrador de Tienda</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsHovered(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Cerrar barra lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de Navegación */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            SECCIONES
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleItemClick}
                className={`group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50/90 text-blue-900 border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:text-slate-700 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-bold tracking-wider uppercase ${
                      isActive ? "text-blue-900" : "text-slate-700 group-hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer del Sidebar con enlace a la tienda y cierre de sesión */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors text-xs font-bold shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-600" />
              <span className="tracking-wider uppercase">TIENDA</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 transition-colors text-xs font-bold cursor-pointer shadow-2xs"
            title="Cerrar sesión actual de administrador"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="tracking-wider uppercase">Cerrar Sesión</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
