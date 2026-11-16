"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageCircle,
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappHref = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    `Hola ${business.name}, deseo consultar sobre un producto o servicio.`
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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* 1. Franja informativa sutil (sin emojis ni gradientes estridentes) */}
      {business.announcementEnabled && business.announcementText && (
        <div className="bg-slate-50 border-b border-slate-200/80 text-slate-600 text-xs py-2 px-4 text-center font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>{business.announcementText}</span>
          </div>
        </div>
      )}

      {/* 2. Barra de Navegación Principal (Fondo blanco, diseño minimalista) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Logotipo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-navy-600 rounded-md py-1 shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-white font-black text-lg tracking-wider">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-xl tracking-tight text-slate-900 leading-none">
              CHAVONAUTA
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
              Catálogo Digital
            </span>
          </div>
        </Link>

        {/* Buscador Central Minimalista con Selector de Categorías */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl items-center rounded-lg border border-slate-300 bg-slate-50/70 focus-within:bg-white focus-within:border-navy-600 focus-within:ring-1 focus-within:ring-navy-600 transition-all overflow-hidden"
        >
          {/* Selector de Clases/Categorías */}
          <div className="relative border-r border-slate-200 bg-white">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-transparent text-slate-700 text-xs font-medium pl-3 pr-8 py-2.5 cursor-pointer focus:outline-none"
              aria-label="Seleccionar categoría"
            >
              <option value="todas">Todos los departamentos</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Campo de búsqueda */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos, accesorios o servicios..."
            className="flex-1 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />

          {/* Botón de búsqueda sobrio */}
          <button
            type="submit"
            className="px-4 py-2.5 text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Contacto por WhatsApp a la derecha */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Contactar por WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>

          {/* Botón de menú móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Buscador en versión móvil */}
      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center rounded-lg border border-slate-300 bg-slate-50 overflow-hidden"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en el catálogo..."
            className="flex-1 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 text-slate-600 hover:text-navy-900"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Menú de Categorías (Limpio, espacioso y moderno) */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-medium text-slate-600">
            <Link
              href="/catalogo"
              className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 font-semibold text-slate-900"
            >
              Todos los productos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.slug}`}
                className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Categorías
          </div>
          <div className="flex flex-col space-y-1">
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-slate-100 text-sm font-semibold text-slate-900"
            >
              Ver todo el catálogo
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalogo?categoria=${c.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-md hover:bg-slate-100 text-sm text-slate-700"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
