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
    label: "PERSONALIZADOR",
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
        className={`hidden lg:flex fixed top-6 left-0 z-40 items-center gap-2 pl-2.5 pr-3.5 py-2 bg-navy-950/95 text-sky-400 hover:text-white hover:bg-navy-900 border border-l-0 border-navy-800 rounded-r-xl shadow-xl shadow-navy-950/30 cursor-pointer transition-all duration-300 backdrop-blur-sm select-none group ${
          isHovered
            ? "opacity-0 pointer-events-none -translate-x-full"
            : "opacity-100 translate-x-0"
        }`}
        title="Pasa el mouse para desplegar la barra lateral"
      >
        <Menu className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
        <span className="text-[11px] font-black tracking-wider text-slate-200">
          MENÚ
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-navy-400 group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* Barra superior para móvil y tablet */}
      <header className="lg:hidden sticky top-0 z-40 bg-navy-950 text-white border-b border-navy-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          {/* Botón de Menú Hamburguesa a la IZQUIERDA para celulares y tablets */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-navy-900 border border-navy-800 text-slate-200 hover:text-white hover:bg-navy-850 active:scale-95 transition-all focus:outline-none"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-sky-400" /> : <Menu className="w-5 h-5 text-sky-400" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-accent shrink-0">
              <Store className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <span className="font-heading font-black text-sm tracking-tight text-white block uppercase leading-tight">
                Chavonauta
              </span>
              <span className="text-[10px] text-navy-300 font-medium tracking-wide uppercase leading-none">
                Panel de Control
              </span>
            </div>
          </div>
        </div>

        {/* Acceso directo a Ver Tienda en el extremo derecho */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 border border-navy-800 text-sky-400 hover:text-white text-xs font-semibold transition-all shrink-0 active:scale-95"
          title="Ver tienda pública en una pestaña nueva"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ver Tienda</span>
        </Link>
      </header>

      {/* Backdrop móvil */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Desplegable al Hover (Desktop) / Drawer móvil */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-950 text-white flex flex-col border-r border-navy-850 shadow-2xl shadow-navy-950/80 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen || isHovered ? "translate-x-0" : "-translate-x-full"
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
            onClick={() => {
              setMobileMenuOpen(false);
              setIsHovered(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
            title="Cerrar barra lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de Navegación */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-navy-400">
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
                  <div className="text-xs font-black tracking-wider uppercase">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-navy-300/80 truncate">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer del Sidebar con enlace a la tienda y cierre de sesión */}
        <div className="p-4 border-t border-navy-900 bg-navy-950/95 space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 hover:text-white border border-navy-800 hover:border-navy-700 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-sky-400" />
              <span className="tracking-wider uppercase">TIENDA</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-900/30 text-red-300 hover:text-red-200 border border-red-900/40 hover:border-red-800/60 transition-colors text-xs font-bold cursor-pointer"
            title="Cerrar sesión actual de administrador"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="tracking-wider uppercase">Cerrar Sesión</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
