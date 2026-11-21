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
        className={`hidden lg:flex fixed top-6 left-0 z-40 items-center gap-2 pl-2.5 pr-3 py-2 bg-zinc-900/95 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-l-0 border-zinc-700/60 rounded-r-xl shadow-lg shadow-black/25 cursor-pointer transition-all duration-300 backdrop-blur-sm select-none group ${
          isHovered
            ? "opacity-0 pointer-events-none -translate-x-full"
            : "opacity-100 translate-x-0"
        }`}
        title="Pasa el mouse para desplegar la barra lateral"
      >
        <Menu className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
        <span className="text-[11px] font-bold tracking-wider text-zinc-300 group-hover:text-white">
          MENÚ
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* Barra superior para móvil y tablet */}
      <header className="lg:hidden sticky top-0 z-40 bg-zinc-950 text-white border-b border-zinc-800/80 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          {/* Botón de Menú Hamburguesa a la IZQUIERDA para celulares y tablets */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all focus:outline-none"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-zinc-200" /> : <Menu className="w-5 h-5 text-zinc-200" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <Store className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <span className="font-heading font-black text-sm tracking-tight text-white block uppercase leading-tight">
                Chavonauta
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase leading-none">
                Panel de Control
              </span>
            </div>
          </div>
        </div>

        {/* Acceso directo a Ver Tienda en el extremo derecho */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all shrink-0 active:scale-95"
          title="Ver tienda pública en una pestaña nueva"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ver Tienda</span>
        </Link>
      </header>

      {/* Backdrop móvil */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Desplegable al Hover (Desktop) / Drawer móvil */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 text-white flex flex-col border-r border-zinc-800/80 shadow-2xl shadow-black/40 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen || isHovered ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Cabecera Sidebar */}
        <div className="p-5 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Store className="w-4.5 h-4.5 text-zinc-200" />
            </div>
            <div>
              <span className="font-heading font-black text-base tracking-tight text-white uppercase block leading-tight">
                Chavonauta
              </span>
              <p className="text-[11px] text-zinc-400">Administrador de Tienda</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsHovered(false);
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Cerrar barra lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de Navegación */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
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
                    ? "bg-zinc-900 text-white border border-zinc-700/70 shadow-xs"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-900/80 text-zinc-400 group-hover:text-zinc-200 group-hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold tracking-wider uppercase">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer del Sidebar con enlace a la tienda y cierre de sesión */}
        <div className="p-4 border-t border-zinc-850 bg-zinc-950 space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-zinc-400" />
              <span className="tracking-wider uppercase">TIENDA</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-red-950/20 text-zinc-400 hover:text-red-300 border border-zinc-800 hover:border-red-900/40 transition-colors text-xs font-bold cursor-pointer"
            title="Cerrar sesión actual de administrador"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
              <span className="tracking-wider uppercase">Cerrar Sesión</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
