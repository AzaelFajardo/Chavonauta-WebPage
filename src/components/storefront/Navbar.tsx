"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Search,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  SlidersHorizontal,
  Clock,
  Sparkles,
  MapPin,
  Laptop,
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
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappHref = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    `Hola ${business.name}, vi su página web y me gustaría consultar sobre un servicio o enviar archivos.`
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
      {/* 1. Franja de Anuncio Superior */}
      {business.announcementEnabled && business.announcementText && (
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-navy-100 text-xs py-1.5 px-4 text-center font-medium border-b border-navy-700/50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{business.announcementText}</span>
          </div>
        </div>
      )}

      {/* 2. Header Principal Estilo Amazon / Mercado Libre (navy-900) */}
      <div className="bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 md:gap-6">
          
          {/* Logo a la izquierda */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus:outline-none focus:ring-2 focus:ring-navy-400 rounded-md p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-navy-600 via-navy-500 to-accent flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-wider text-white flex items-center gap-1.5">
                CHAVONAUTA
              </span>
              <span className="text-[11px] font-medium text-navy-200 uppercase tracking-widest -mt-1">
                CIBERCAFÉ & CATÁLOGO
              </span>
            </div>
          </Link>

          {/* Barra de Búsqueda Central con Selector de Clases (Amazon / ML style) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center rounded-lg bg-white overflow-hidden shadow-sm border-2 border-transparent focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30 transition-all"
          >
            {/* Selector de Categorías / Clases integrado */}
            <div className="relative border-r border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent text-slate-700 text-xs font-medium pl-3 pr-8 py-2.5 cursor-pointer focus:outline-none"
                aria-label="Seleccionar categoría de búsqueda"
              >
                <option value="todas">Todos los departamentos</option>
                <option value="servicios-cyber">⚡ Servicios de Cyber</option>
                {categories
                  .filter((c) => c.slug !== "servicios-cyber")
                  .map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Input de texto */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, servicios, trámites, impresiones..."
              className="flex-1 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none"
            />

            {/* Botón de búsqueda (estilo Amazon / Mercado Libre) */}
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-5 py-2.5 font-semibold transition-colors flex items-center justify-center shrink-0"
              aria-label="Buscar en catálogo"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Accesos Rápidos a la Derecha */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* WhatsApp CTA Directo */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
              title="Envía tus archivos o cotiza trabajos por WhatsApp"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Acceso al Personalizador / Admin */}
            <Link
              href="/admin/personalizador"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-100 text-xs font-medium border border-navy-700 transition-colors"
              title="Ir al Personalizador Visual del Cliente"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-navy-300" />
              <span className="hidden lg:inline">Personalizar</span>
            </Link>

            {/* Botón menú móvil */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-navy-800 text-navy-100 border border-navy-700"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Buscador visible en móvil */}
        <div className="md:hidden px-4 pb-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center rounded-lg bg-white overflow-hidden shadow-inner border border-slate-300"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, trámites o servicios..."
              className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-amber-400 text-slate-900 px-3.5 py-2"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Sub-Navbar de Categorías (Navy-800 con selector desplegable) */}
      <div className="bg-navy-800 text-slate-200 border-b border-navy-700 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-11 overflow-x-auto no-scrollbar">
          
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Menú Desplegable "Todas las categorías" estilo Amazon */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCatMenuOpen(!catMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-navy-700 hover:bg-navy-600 text-white font-semibold transition-colors shrink-0"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Departamentos</span>
                <ChevronDown className="w-3 h-3 text-navy-300" />
              </button>

              {catMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCatMenuOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-lg bg-white text-slate-800 shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Categorías de Chavonauta
                    </div>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalogo?categoria=${cat.slug}`}
                        onClick={() => setCatMenuOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2 hover:bg-navy-50 hover:text-navy-900 font-medium transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400">→</span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 my-1 pt-1">
                      <Link
                        href="/catalogo"
                        onClick={() => setCatMenuOpen(false)}
                        className="block px-3.5 py-2 font-bold text-navy-800 hover:bg-navy-50"
                      >
                        Ver Catálogo Completo
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Accesos directos en barra secundaria */}
            <Link
              href="/catalogo?categoria=servicios-cyber"
              className="px-2.5 py-1.5 rounded hover:bg-navy-700/60 hover:text-white transition-colors shrink-0 text-amber-300 font-semibold"
            >
              ⚡ Servicios Cyber
            </Link>
            <Link
              href="/#tarifas"
              className="px-2.5 py-1.5 rounded hover:bg-navy-700/60 hover:text-white transition-colors shrink-0 flex items-center gap-1"
            >
              <Laptop className="w-3.5 h-3.5 text-navy-300" />
              <span>Renta PC ($7/hr)</span>
            </Link>
            <Link
              href="/catalogo?categoria=teclados-y-mouse"
              className="hidden lg:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 hover:text-white transition-colors shrink-0"
            >
              Teclados y Mouse
            </Link>
            <Link
              href="/catalogo?categoria=audifonos-y-diademas"
              className="hidden lg:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 hover:text-white transition-colors shrink-0"
            >
              Audífonos
            </Link>
            <Link
              href="/catalogo?categoria=cables-y-cargadores"
              className="hidden sm:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 hover:text-white transition-colors shrink-0"
            >
              Cables y Cargadores
            </Link>
            <Link
              href="/catalogo?categoria=memorias"
              className="hidden sm:inline-block px-2.5 py-1.5 rounded hover:bg-navy-700/60 hover:text-white transition-colors shrink-0"
            >
              Memorias
            </Link>
            <Link
              href="/catalogo?categoria=papeleria"
              className="px-2.5 py-1.5 rounded hover:bg-navy-700/60 hover:text-white transition-colors shrink-0"
            >
              Papelería
            </Link>
          </div>

          {/* Horario y Ubicación Breve a la derecha */}
          <div className="hidden xl:flex items-center gap-3 text-slate-300 text-[11px] shrink-0">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-navy-300" />
              <span>Lun-Sáb: 8:30am - 9:00pm</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-navy-300" />
              <span>{business.address}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-4 space-y-3 text-xs">
          <div className="font-bold text-amber-300 uppercase tracking-wider mb-1">
            Departamentos y Categorías
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalogo?categoria=${c.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-slate-800 hover:bg-navy-800 text-slate-200"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-lg bg-emerald-600 text-white font-semibold"
            >
              Contactar por WhatsApp
            </a>
            <Link
              href="/admin/personalizador"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
            >
              Abrir Personalizador
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
