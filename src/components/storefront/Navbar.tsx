"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageCircle,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Clock,
  Phone,
  Monitor,
  FolderOpen,
} from "lucide-react";
import { BusinessInfo, Category } from "@/types";

interface NavbarProps {
  business: BusinessInfo;
  categories: Category[];
}

export function Navbar({ business, categories }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const whatsappHref = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    `Hola ${business.name}, deseo consultar la disponibilidad de un producto o cotizar un servicio.`
  )}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategory && selectedCategory !== "todas") {
      params.set("categoria", selectedCategory);
    }
    setDrawerOpen(false);
    router.push(`/catalogo?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 1. Header Principal reactivo al tema */}
      <div style={{ backgroundColor: "var(--primary, #1a2f85)" }} className="text-white transition-colors duration-200">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 h-[60px] flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2">
            {/* Botón de Menú Hamburguesa visible en Móviles */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded hover:bg-navy-800 text-white focus:outline-none focus:ring-1 focus:ring-navy-300"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logotipo Personalizado */}
            <Link
              href="/"
              className="flex items-center px-1.5 py-1 rounded hover:ring-1 hover:ring-navy-300 transition-all shrink-0"
            >
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              ) : (
                <span className="font-heading font-black text-xl sm:text-2xl tracking-tight text-white uppercase">
                  {business.name}
                </span>
              )}
            </Link>
          </div>

          {/* Sucursal (visible en desktop) */}
          <Link
            href="/#ubicacion"
            style={{ borderRadius: "var(--radius)" }}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-white/10 transition-all shrink-0 text-left"
          >
            <MapPin className="w-4 h-4 opacity-80 shrink-0 mt-1" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] opacity-75">Atención en</span>
              <span className="text-xs font-bold max-w-[160px] truncate">
                {business.branchName || "Sucursal"}
              </span>
            </div>
          </Link>

          {/* Barra de Búsqueda (Desktop) */}
          <form
            onSubmit={handleSearch}
            style={{ borderRadius: "var(--radius)" }}
            className="hidden sm:flex flex-1 max-w-3xl items-center h-10 bg-white overflow-hidden shadow-inner border border-black/10 focus-within:ring-2 focus-within:ring-white/40"
          >
            {/* Dropdown de departamentos */}
            <div className="relative h-full flex items-center bg-slate-50 hover:bg-slate-100 border-r border-slate-200 transition-colors">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none h-full bg-transparent text-slate-800 text-xs font-medium pl-3 pr-7 cursor-pointer focus:outline-none"
                aria-label="Seleccionar categoría"
              >
                <option value="todas">Todos los departamentos</option>
                <option value="servicios-cyber">Servicios del Cyber</option>
                {categories
                  .filter((c) => c.slug !== "servicios-cyber")
                  .map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
            </div>

            {/* Input de texto */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en Chavonauta..."
              className="flex-1 h-full px-3 text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none"
            />

            {/* Botón de búsqueda */}
            <button
              type="submit"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
              className="h-full px-4 flex items-center justify-center transition-opacity hover:opacity-90 shrink-0 font-bold"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Accesos a la Derecha */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Contacto WhatsApp */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: "var(--radius)" }}
              className="flex items-center sm:flex-col leading-tight px-2.5 py-1.5 hover:bg-white/10 transition-all text-left"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400 sm:hidden" />
              <span className="hidden sm:inline text-[11px] opacity-75">Contacto</span>
              <span className="hidden sm:flex text-xs font-bold items-center gap-1">
                <span>WhatsApp</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </span>
            </a>

            {/* Tarifas / Renta PC de 2 líneas (Desktop) */}
            <Link
              href="/#tarifas"
              style={{ borderRadius: "var(--radius)" }}
              className="hidden lg:flex flex-col leading-tight px-2.5 py-1.5 hover:bg-white/10 transition-all text-left"
            >
              <span className="text-[11px] opacity-75">Tarifas</span>
              <span className="text-xs font-bold">Renta PC $7/hr</span>
            </Link>

            {/* Catálogo */}
            <Link
              href="/catalogo"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
                borderRadius: "var(--radius)",
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 transition-all text-xs font-bold shadow-2xs hover:opacity-90"
            >
              <span>Catálogo</span>
            </Link>
          </div>
        </div>

        {/* Buscador en versión Móvil (debajo de la barra principal) */}
        <div className="sm:hidden px-3 pb-3">
          <form
            onSubmit={handleSearch}
            style={{ borderRadius: "var(--radius)" }}
            className="flex items-center h-9 bg-white overflow-hidden shadow-inner border border-black/10"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos o servicios..."
              className="flex-1 h-full px-3 text-xs text-slate-900 placeholder-slate-400 bg-white focus:outline-none"
            />
            <button
              type="submit"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
              className="h-full px-3 flex items-center justify-center shrink-0 font-bold"
              aria-label="Buscar"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Sub-Navbar reactivo al tema secundario */}
      <div
        style={{
          backgroundColor: "var(--secondary, #1c38a8)",
          color: "var(--secondary-foreground, #ffffff)",
        }}
        className="hidden md:block text-xs font-medium border-t border-black/10 transition-colors duration-200"
      >
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 flex items-center gap-1 sm:gap-2 h-10 overflow-x-auto no-scrollbar">
          {/* Botón "Todo" con icono de menú */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "var(--radius)",
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 font-bold transition-all shrink-0 hover:opacity-90 shadow-2xs"
          >
            <Menu className="w-4 h-4" />
            <span>Todo</span>
          </button>

          {/* Enlaces directos a departamentos en Desktop (heredan color de secondary-foreground con alta legibilidad) */}
          <Link
            href="/catalogo?categoria=servicios-cyber"
            style={{ borderRadius: "var(--radius)" }}
            className="px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 font-bold"
          >
            Servicios del Cyber
          </Link>
          <Link
            href="/#tarifas"
            style={{ borderRadius: "var(--radius)" }}
            className="px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 opacity-85 hover:opacity-100"
          >
            Renta de PC ($7/hr)
          </Link>
          <Link
            href="/catalogo?categoria=teclados-y-mouse"
            style={{ borderRadius: "var(--radius)" }}
            className="px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 opacity-85 hover:opacity-100"
          >
            Teclados y Mouse
          </Link>
          <Link
            href="/catalogo?categoria=audifonos-y-diademas"
            style={{ borderRadius: "var(--radius)" }}
            className="px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 opacity-85 hover:opacity-100"
          >
            Audífonos
          </Link>
          <Link
            href="/catalogo?categoria=cables-y-cargadores"
            style={{ borderRadius: "var(--radius)" }}
            className="px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 opacity-85 hover:opacity-100"
          >
            Cables y Carga
          </Link>
          <Link
            href="/catalogo?categoria=memorias"
            style={{ borderRadius: "var(--radius)" }}
            className="px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 opacity-85 hover:opacity-100"
          >
            Memorias
          </Link>
          <Link
            href="/catalogo?categoria=papeleria"
            style={{ borderRadius: "var(--radius)" }}
            className="hidden lg:inline-block px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 opacity-85 hover:opacity-100"
          >
            Papelería
          </Link>
          <Link
            href="/catalogo?categoria=focos"
            style={{ borderRadius: "var(--radius)" }}
            className="hidden lg:inline-block px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 opacity-85 hover:opacity-100"
          >
            Iluminación
          </Link>
          <Link
            href="/#ubicacion"
            style={{ borderRadius: "var(--radius)" }}
            className="hidden xl:inline-block px-2.5 py-1.5 border border-current/25 hover:bg-current/10 transition-all shrink-0 font-medium"
          >
            Horarios y Sucursal
          </Link>
        </div>
      </div>

      {/* 3. Menú Hamburguesa Completo (Drawer Lateral para Celular y Desktop) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo oscuro traslúcido */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Menú lateral */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 text-slate-800 animate-in slide-in-from-left duration-200">
            {/* Encabezado del menú */}
            <div
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
              className="p-4 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg uppercase">{business.name}</span>
                <span className="text-xs font-bold opacity-75">menú</span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="hover:opacity-75 p-1 transition-opacity"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del menú Hamburguesa */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
              
              {/* Acceso Rápido a WhatsApp */}
              <div>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ borderRadius: "var(--radius)" }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: 449 402 2163</span>
                </a>
              </div>

              {/* Sección de Servicios del Cyber */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mb-2.5 uppercase tracking-wider text-xs">
                  <Monitor className="w-4 h-4 text-navy-800" />
                  <span>Servicios en Sucursal</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    <Link
                      href="/catalogo?categoria=servicios-cyber"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2.5 rounded hover:bg-navy-50 text-slate-700 font-semibold"
                    >
                      Todos los Servicios del Cyber
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#tarifas"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2.5 rounded hover:bg-navy-50 text-slate-700"
                    >
                      Renta de PC ($7/hr • Media hr: $4)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/item/impresiones-blanco-negro-y-color"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2.5 rounded hover:bg-navy-50 text-slate-700"
                    >
                      Impresiones B/N y Color / Copias
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/item/reparacion-y-mantenimiento-equipos-digitales"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2.5 rounded hover:bg-navy-50 text-slate-700"
                    >
                      Mantenimiento y Reparación de Equipos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/item/tramites-digitales-curp-actas-citas"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2.5 rounded hover:bg-navy-50 text-slate-700"
                    >
                      Trámites Digitales (CURP, Actas, CFE)
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Sección de Departamentos y Catálogo */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mb-2.5 uppercase tracking-wider text-xs">
                  <FolderOpen className="w-4 h-4 text-navy-800" />
                  <span>Catálogo de Productos</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    <Link
                      href="/catalogo"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2.5 rounded bg-navy-50 text-navy-900 font-bold"
                    >
                      Ver Todo el Catálogo
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/catalogo?categoria=${c.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="block py-1.5 px-2.5 rounded hover:bg-navy-50 text-slate-700"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Información de Sucursal y Horarios */}
              <div className="border-t border-slate-200 pt-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{business.branchName}</span>
                    <span className="text-[11px] leading-tight block text-slate-500">
                      {business.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Clock className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Horario Comercial:</span>
                    <span className="text-[11px] leading-tight block text-slate-500">
                      {business.schedule}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}
