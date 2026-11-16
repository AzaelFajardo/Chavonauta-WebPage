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
      {/* 1. Header Principal Estilo Amazon (#131921) */}
      <div className="bg-[#131921] text-white">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 h-[60px] flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logotipo Estilo Amazon */}
          <Link
            href="/"
            className="flex items-center px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0 group"
          >
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="font-heading font-black text-xl sm:text-2xl tracking-tighter text-white">
                  chavonauta
                </span>
                <span className="text-xs font-bold text-[#febd69] ml-0.5">.mx</span>
              </div>
              {/* Línea curva estilo flecha de Amazon */}
              <div className="relative -mt-1 h-1.5 w-full">
                <svg
                  className="w-full h-full text-[#febd69] overflow-visible"
                  viewBox="0 0 100 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 5 2 Q 50 18 95 6"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 91 1 L 97 6 L 91 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Ubicación / Atención en Tienda (Estilo Amazon "Enviar a") */}
          <Link
            href="/#ubicacion"
            className="hidden xl:flex items-center gap-1.5 px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0 text-left"
          >
            <MapPin className="w-4 h-4 text-white shrink-0 mt-2" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-[#ccc]">Atención en</span>
              <span className="text-xs font-bold text-white">Sucursal Centro</span>
            </div>
          </Link>

          {/* Barra de Búsqueda Estilo Amazon (Con selector integrado) */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 max-w-3xl items-center h-10 rounded focus-within:ring-2 focus-within:ring-[#f3a847] bg-white overflow-hidden shadow-inner"
          >
            {/* Dropdown de categorías */}
            <div className="relative h-full hidden sm:flex items-center bg-[#f3f3f3] hover:bg-[#dadada] border-r border-[#cdcdcd] transition-colors">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none h-full bg-transparent text-[#0f1111] text-xs font-normal pl-3 pr-7 cursor-pointer focus:outline-none"
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
              <ChevronDown className="w-3 h-3 text-[#555] absolute right-2 pointer-events-none" />
            </div>

            {/* Input de texto */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en Chavonauta..."
              className="flex-1 h-full px-3 text-sm text-[#0f1111] placeholder-slate-500 bg-white focus:outline-none"
            />

            {/* Botón de búsqueda naranja icónico de Amazon */}
            <button
              type="submit"
              className="h-full bg-[#febd69] hover:bg-[#f3a847] text-[#111] px-4 flex items-center justify-center transition-colors shrink-0"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Accesos a la Derecha */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Contacto WhatsApp en formato Amazon de 2 líneas */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col leading-tight px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left"
            >
              <span className="text-[11px] text-[#ccc]">Contacto</span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <span>WhatsApp</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </span>
            </a>

            {/* Tarifas / Renta PC de 2 líneas */}
            <Link
              href="/#tarifas"
              className="hidden lg:flex flex-col leading-tight px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left"
            >
              <span className="text-[11px] text-[#ccc]">Tarifas</span>
              <span className="text-xs font-bold text-white">Renta PC $7/hr</span>
            </Link>

            {/* Catálogo */}
            <Link
              href="/catalogo"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:ring-1 hover:ring-white transition-all text-xs font-bold text-white"
            >
              <MessageCircle className="w-5 h-5 text-[#febd69]" />
              <span className="hidden sm:inline">Catálogo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navbar Estilo Amazon (#232f3e) */}
      <div className="bg-[#232f3e] text-white text-xs font-medium border-t border-[#3a4553]">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 flex items-center gap-1 sm:gap-2 h-10 overflow-x-auto no-scrollbar">
          {/* Botón "Todo" con icono de menú */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:ring-1 hover:ring-white font-bold transition-all shrink-0"
          >
            <Menu className="w-4 h-4" />
            <span>Todo</span>
          </button>

          {/* Enlaces rápidos a departamentos */}
          <Link
            href="/catalogo?categoria=servicios-cyber"
            className="px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0 text-[#febd69] font-bold"
          >
            Servicios del Cyber
          </Link>
          <Link
            href="/#tarifas"
            className="px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0"
          >
            Renta de PC
          </Link>
          <Link
            href="/catalogo?categoria=teclados-y-mouse"
            className="px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0"
          >
            Teclados y Mouse
          </Link>
          <Link
            href="/catalogo?categoria=audifonos-y-diademas"
            className="hidden sm:inline-block px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0"
          >
            Audífonos
          </Link>
          <Link
            href="/catalogo?categoria=cables-y-cargadores"
            className="hidden md:inline-block px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0"
          >
            Cables y Cargadores
          </Link>
          <Link
            href="/catalogo?categoria=memorias"
            className="hidden md:inline-block px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0"
          >
            Memorias
          </Link>
          <Link
            href="/catalogo?categoria=papeleria"
            className="hidden lg:inline-block px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0"
          >
            Papelería
          </Link>
          <Link
            href="/catalogo?categoria=focos"
            className="hidden lg:inline-block px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0"
          >
            Iluminación
          </Link>
          <Link
            href="/#ubicacion"
            className="hidden xl:inline-block px-2 py-1.5 rounded hover:ring-1 hover:ring-white transition-all shrink-0 text-slate-300"
          >
            Horarios y Sucursal
          </Link>
        </div>
      </div>

      {/* 3. Panel Lateral Desplegable "Todo" (Estilo Amazon Drawer) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo oscuro traslúcido */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Menú lateral */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 text-[#0f1111]">
            {/* Encabezado del menú */}
            <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg">chavonauta</span>
                <span className="text-xs font-bold text-[#febd69]">departamentos</span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-white hover:text-[#febd69] p-1"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de categorías */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-[#0f1111] text-base mb-2">
                  Servicios de la Sucursal
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/catalogo?categoria=servicios-cyber"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-slate-100 text-slate-700 font-medium"
                    >
                      Todos los Servicios del Cyber
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#tarifas"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-slate-100 text-slate-700"
                    >
                      Renta de Computadoras e Internet ($7/hr)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#ubicacion"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-slate-100 text-slate-700"
                    >
                      Horarios y Dirección de Tienda
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-bold text-[#0f1111] text-base mb-2">
                  Catálogo de Productos
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/catalogo"
                      onClick={() => setDrawerOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-slate-100 text-slate-900 font-bold"
                    >
                      Ver Todo el Catálogo
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/catalogo?categoria=${c.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="block py-2 px-2 rounded hover:bg-slate-100 text-slate-700"
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
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#febd69] hover:bg-[#f3a847] text-[#111] font-bold text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
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
