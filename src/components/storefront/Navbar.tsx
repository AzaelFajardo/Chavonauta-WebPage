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
    router.push(`/catalogo?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 1. Header Principal (navy-900: #1a2f85) */}
      <div className="bg-navy-900 text-white">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 h-[60px] flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logotipo Personalizado (Sin sonrisa, si no hay logoUrl muestra el nombre limpio) */}
          <Link
            href="/"
            className="flex items-center px-2 py-1.5 rounded hover:ring-1 hover:ring-navy-300 transition-all shrink-0 group"
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

          {/* Sucursal Personalizable (se actualiza automáticamente según la configuración del cliente) */}
          <Link
            href="/#ubicacion"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:ring-1 hover:ring-navy-300 transition-all shrink-0 text-left"
          >
            <MapPin className="w-4 h-4 text-navy-200 shrink-0 mt-1" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-navy-100">Atención en</span>
              <span className="text-xs font-bold text-white max-w-[160px] truncate">
                {business.branchName || "Sucursal"}
              </span>
            </div>
          </Link>

          {/* Barra de Búsqueda Estructurada con Selector Integrado */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 max-w-3xl items-center h-10 rounded-lg focus-within:ring-2 focus-within:ring-navy-400 bg-white overflow-hidden shadow-inner border border-navy-700"
          >
            {/* Dropdown de departamentos */}
            <div className="relative h-full hidden sm:flex items-center bg-slate-50 hover:bg-slate-100 border-r border-slate-200 transition-colors">
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

            {/* Botón de búsqueda en navy-600 */}
            <button
              type="submit"
              className="h-full bg-navy-600 hover:bg-navy-700 text-white px-4 flex items-center justify-center transition-colors shrink-0"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Accesos a la Derecha */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Contacto WhatsApp en formato de 2 líneas */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col leading-tight px-2.5 py-1.5 rounded hover:ring-1 hover:ring-navy-300 transition-all text-left"
            >
              <span className="text-[11px] text-navy-100">Contacto</span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <span>WhatsApp</span>
                <ChevronDown className="w-3 h-3 text-navy-300" />
              </span>
            </a>

            {/* Tarifas / Renta PC de 2 líneas */}
            <Link
              href="/#tarifas"
              className="hidden lg:flex flex-col leading-tight px-2.5 py-1.5 rounded hover:ring-1 hover:ring-navy-300 transition-all text-left"
            >
              <span className="text-[11px] text-navy-100">Tarifas</span>
              <span className="text-xs font-bold text-white">Renta PC $7/hr</span>
            </Link>

            {/* Catálogo */}
            <Link
              href="/catalogo"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-navy-800 hover:bg-navy-700 transition-all text-xs font-bold text-white border border-navy-700"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Catálogo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navbar (navy-800: #1c38a8) */}
      <div className="bg-navy-800 text-white text-xs font-medium border-t border-navy-700/70">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 flex items-center gap-1 sm:gap-2 h-10 overflow-x-auto no-scrollbar">
          {/* Botón "Todo" con icono de menú */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-navy-700/80 hover:bg-navy-700 font-bold transition-all shrink-0 text-white"
          >
            <Menu className="w-4 h-4" />
            <span>Todo</span>
          </button>

          {/* Enlaces a departamentos */}
          <Link
            href="/catalogo?categoria=servicios-cyber"
            className="px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-navy-100 font-bold"
          >
            Servicios del Cyber
          </Link>
          <Link
            href="/#tarifas"
            className="px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-slate-100"
          >
            Renta de PC ($7/hr)
          </Link>
          <Link
            href="/catalogo?categoria=teclados-y-mouse"
            className="px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-slate-100"
          >
            Teclados y Mouse
          </Link>
          <Link
            href="/catalogo?categoria=audifonos-y-diademas"
            className="hidden sm:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-slate-100"
          >
            Audífonos
          </Link>
          <Link
            href="/catalogo?categoria=cables-y-cargadores"
            className="hidden md:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-slate-100"
          >
            Cables y Carga
          </Link>
          <Link
            href="/catalogo?categoria=memorias"
            className="hidden md:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-slate-100"
          >
            Memorias
          </Link>
          <Link
            href="/catalogo?categoria=papeleria"
            className="hidden lg:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-slate-100"
          >
            Papelería
          </Link>
          <Link
            href="/catalogo?categoria=focos"
            className="hidden lg:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-slate-100"
          >
            Iluminación
          </Link>
          <Link
            href="/#ubicacion"
            className="hidden xl:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 transition-all shrink-0 text-navy-200"
          >
            Horarios y Sucursal
          </Link>
        </div>
      </div>

      {/* 3. Panel Lateral Desplegable "Todo" */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo oscuro traslúcido */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Menú lateral */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 text-slate-800">
            {/* Encabezado del menú */}
            <div className="bg-navy-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg uppercase">{business.name}</span>
                <span className="text-xs font-bold text-navy-200">departamentos</span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-white hover:text-navy-200 p-1"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de categorías */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Servicios de la Sucursal
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/catalogo?categoria=servicios-cyber"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-navy-50 text-slate-700 font-medium"
                    >
                      Todos los Servicios del Cyber
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#tarifas"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-navy-50 text-slate-700"
                    >
                      Renta de Computadoras e Internet ($7/hr)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#ubicacion"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-navy-50 text-slate-700"
                    >
                      Horarios y Dirección de Tienda
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Catálogo de Productos
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/catalogo"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-navy-50 text-navy-900 font-bold"
                    >
                      Ver Todo el Catálogo
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/catalogo?categoria=${c.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="block py-2 px-2 rounded hover:bg-navy-50 text-slate-700"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Atención por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
