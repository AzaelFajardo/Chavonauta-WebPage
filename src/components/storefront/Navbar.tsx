"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  MessageCircle,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Clock,
  Monitor,
  FolderOpen,
} from "lucide-react";
import { BusinessInfo, CatalogItem, Category } from "@/types";

interface NavbarProps {
  business: BusinessInfo;
  categories: Category[];
  items: CatalogItem[];
}

function NavbarSearchParamsSync({
  onCategoryChange,
}: {
  onCategoryChange: (category: string) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get("categoria") || "";
    onCategoryChange(cat);
  }, [searchParams, onCategoryChange]);
  return null;
}

export function Navbar({ business, categories, items }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [activeCategoryParam, setActiveCategoryParam] = useState("");
  const [activeHash, setActiveHash] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const oneHourRate = business.computerRates?.oneHour ?? 7;
  const halfHourRate = business.computerRates?.halfHour ?? 4;

  const handleCategoryParamChange = useCallback((cat: string) => {
    setActiveCategoryParam(cat);
    if (cat) {
      setSelectedCategory(cat === "servicios-cyber" ? "servicios-digitales" : cat);
    } else {
      setSelectedCategory("todas");
    }
  }, []);

  // Sincronizar hash activo (#tarifas, #ubicacion) cuando estamos en la página de inicio
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncHash = () => {
      setActiveHash(window.location.hash || "");
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  // Si estamos en una vista de detalle (/item/[slug]), detectar su categoría para marcarla en la barra
  const currentItemCategory = React.useMemo(() => {
    if (!pathname?.startsWith("/item/")) return "";
    const slug = pathname.replace("/item/", "").split("/")[0];
    const found = items.find((i) => i.slug === slug);
    if (!found) return "";
    if (found.type === "service" || found.categorySlug === "servicios-cyber") {
      return "servicios-digitales";
    }
    return found.categorySlug;
  }, [pathname, items]);

  const effectiveCategory =
    pathname === "/catalogo"
      ? activeCategoryParam === "servicios-cyber"
        ? "servicios-digitales"
        : activeCategoryParam
      : currentItemCategory;

  const isRentaPcActive = pathname === "/" && activeHash === "#tarifas";
  const isUbicacionActive = pathname === "/" && activeHash === "#ubicacion";
  const isServiciosActive = effectiveCategory === "servicios-digitales";

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
      <Suspense fallback={null}>
        <NavbarSearchParamsSync onCategoryChange={handleCategoryParamChange} />
      </Suspense>
      {/* 1. Header Principal reactivo al tema */}
      <div
        style={{
          backgroundColor: "var(--primary, #1a2f85)",
          color: "var(--primary-foreground, #ffffff)",
        }}
        className="transition-colors duration-200"
      >
        <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2">
            {/* Botón de Menú Hamburguesa visible en Móviles */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded hover:bg-current/10 focus:outline-none focus:ring-1 focus:ring-current/40"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logotipo Personalizado */}
            <Link
              href="/"
              onClick={() => setActiveHash("")}
              className="flex items-center px-1.5 py-1 rounded hover:ring-1 hover:ring-current/30 transition-all shrink-0"
            >
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  style={{
                    maxHeight: "46px",
                  }}
                  className="w-[125px] sm:w-[175px] h-auto max-h-8 sm:max-h-11 object-contain transition-all duration-200"
                />
              ) : (
                <span
                  style={{ color: "var(--primary-foreground, #ffffff)" }}
                  className="font-heading font-black text-xl sm:text-2xl tracking-tight uppercase"
                >
                  {business.name}
                </span>
              )}
            </Link>
          </div>

          {/* Sucursal (visible en desktop) */}
          <Link
            href="/#ubicacion"
            style={{ borderRadius: "var(--radius)" }}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-current/10 transition-all shrink-0 text-left"
          >
            <MapPin className="w-4 h-4 opacity-80 shrink-0 mt-1" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] opacity-75">Atención en</span>
              <span className="text-xs font-bold max-w-[160px] truncate">
                {business.branchName || "Sucursal"}
              </span>
            </div>
          </Link>

          {/* Barra de Búsqueda (Desktop & Tablet) */}
          <form
            onSubmit={handleSearch}
            style={{ borderRadius: "var(--radius)" }}
            className="hidden md:flex flex-1 max-w-3xl items-center h-10 bg-white overflow-hidden shadow-inner border border-black/10 focus-within:ring-2 focus-within:ring-white/40"
          >
            {/* Dropdown de departamentos */}
            <div className="relative h-full flex items-center bg-slate-50 hover:bg-slate-100 border-r border-slate-200 transition-colors shrink-0 w-[120px] lg:w-[160px] xl:w-[190px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full h-full bg-transparent text-slate-800 text-xs font-medium pl-2.5 sm:pl-3 pr-6 sm:pr-7 cursor-pointer focus:outline-none truncate"
                aria-label="Seleccionar categoría"
              >
                <option value="todas">Departamentos</option>
                <option value="servicios-digitales">Servicios</option>
                {categories
                  .filter(
                    (c) =>
                      c.slug !== "servicios-digitales" &&
                      c.slug !== "servicios-cyber"
                  )
                  .map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-1.5 sm:right-2 pointer-events-none shrink-0" />
            </div>

            {/* Input de texto */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en Chavonauta..."
              className="flex-1 min-w-0 h-full px-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-white focus:outline-none"
            />

            {/* Botón de búsqueda */}
            <button
              type="submit"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
              className="h-full px-3.5 sm:px-4 flex items-center justify-center transition-opacity hover:opacity-90 shrink-0 font-bold"
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
              className="flex items-center sm:flex-col leading-tight px-2.5 py-1.5 hover:bg-current/10 transition-all text-left"
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
              className="hidden lg:flex flex-col leading-tight px-2.5 py-1.5 hover:bg-current/10 transition-all text-left"
            >
              <span className="text-[11px] opacity-75">Tarifas</span>
              <span className="text-xs font-bold">Renta PC ${oneHourRate}/hr</span>
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
        <div className="md:hidden px-3 pb-3">
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
              className="flex-1 min-w-0 h-full px-3 text-xs text-slate-900 placeholder-slate-400 bg-white focus:outline-none"
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
        <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 h-10 overflow-x-auto no-scrollbar">
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

          {/* Enlaces directos a departamentos en Desktop (Primero Renta de PC, luego Servicios y después el resto) */}
          <Link
            href="/#tarifas"
            onClick={() => setActiveHash("#tarifas")}
            aria-current={isRentaPcActive ? "page" : undefined}
            style={
              isRentaPcActive
                ? {
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-foreground)",
                    borderRadius: "var(--radius)",
                  }
                : { borderRadius: "var(--radius)" }
            }
            className={`px-2.5 py-1.5 transition-all shrink-0 ${
              isRentaPcActive
                ? "font-bold shadow-xs ring-1 ring-black/10 opacity-100"
                : "hover:bg-current/10 opacity-85 hover:opacity-100"
            }`}
          >
            Renta de PC (${oneHourRate}/hr)
          </Link>

          <Link
            href="/catalogo?categoria=servicios-digitales"
            onClick={() => setActiveHash("")}
            aria-current={isServiciosActive ? "page" : undefined}
            style={
              isServiciosActive
                ? {
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-foreground)",
                    borderRadius: "var(--radius)",
                  }
                : { borderRadius: "var(--radius)" }
            }
            className={`px-2.5 py-1.5 transition-all shrink-0 ${
              isServiciosActive
                ? "font-bold shadow-xs ring-1 ring-black/10 opacity-100"
                : "font-bold hover:bg-current/10 opacity-90 hover:opacity-100"
            }`}
          >
            Servicios
          </Link>

          {[
            { slug: "teclados-y-mouse", label: "Teclados y Mouse", responsiveClass: "" },
            { slug: "audifonos-y-diademas", label: "Audífonos", responsiveClass: "" },
            { slug: "cables-y-cargadores", label: "Cables y Carga", responsiveClass: "" },
            { slug: "memorias", label: "Memorias", responsiveClass: "" },
            { slug: "papeleria", label: "Papelería", responsiveClass: "hidden lg:inline-block" },
            { slug: "focos", label: "Iluminación", responsiveClass: "hidden lg:inline-block" },
          ].map((navItem) => {
            const isActive = effectiveCategory === navItem.slug;
            return (
              <Link
                key={navItem.slug}
                href={`/catalogo?categoria=${navItem.slug}`}
                onClick={() => setActiveHash("")}
                aria-current={isActive ? "page" : undefined}
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-foreground)",
                        borderRadius: "var(--radius)",
                      }
                    : { borderRadius: "var(--radius)" }
                }
                className={`${navItem.responsiveClass} px-2.5 py-1.5 transition-all shrink-0 ${
                  isActive
                    ? "font-bold shadow-xs ring-1 ring-black/10 opacity-100"
                    : "hover:bg-current/10 opacity-85 hover:opacity-100"
                }`}
              >
                {navItem.label}
              </Link>
            );
          })}

          <Link
            href="/#ubicacion"
            onClick={() => setActiveHash("#ubicacion")}
            aria-current={isUbicacionActive ? "page" : undefined}
            style={
              isUbicacionActive
                ? {
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-foreground)",
                    borderRadius: "var(--radius)",
                  }
                : { borderRadius: "var(--radius)" }
            }
            className={`hidden xl:inline-block px-2.5 py-1.5 transition-all shrink-0 ${
              isUbicacionActive
                ? "font-bold shadow-xs ring-1 ring-black/10 opacity-100"
                : "border border-current/25 hover:bg-current/10 font-medium"
            }`}
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
          <div
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
            }}
            className="relative w-80 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 border-r animate-in slide-in-from-left duration-200 transition-colors"
          >
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
              {/* Sección de Servicios */}
              <div>
                <div
                  style={{ color: "var(--card-foreground)" }}
                  className="flex items-center gap-1.5 font-bold text-xs mb-2.5 uppercase tracking-wider"
                >
                  <Monitor className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  <span>Servicios</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    <Link
                      href="/#tarifas"
                      onClick={() => {
                        setActiveHash("#tarifas");
                        setDrawerOpen(false);
                      }}
                      className={`block py-2 px-2.5 rounded transition-colors ${
                        isRentaPcActive
                          ? "font-bold bg-current/10 opacity-100"
                          : "hover:bg-current/10 opacity-85 hover:opacity-100"
                      }`}
                    >
                      Renta de PC (${oneHourRate}/hr • Media hr: ${halfHourRate})
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/catalogo?categoria=servicios-digitales"
                      onClick={() => {
                        setActiveHash("");
                        setDrawerOpen(false);
                      }}
                      className={`block py-2 px-2.5 rounded font-semibold transition-colors ${
                        isServiciosActive
                          ? "bg-current/10 font-bold opacity-100"
                          : "hover:bg-current/10"
                      }`}
                    >
                      Todos los Servicios
                    </Link>
                  </li>
                  {items
                    .filter(
                      (item) =>
                        item.type === "service" ||
                        item.categorySlug === "servicios-digitales" ||
                        item.categorySlug === "servicios-cyber"
                    )
                    .slice(0, 5)
                    .map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/item/${item.slug}`}
                          onClick={() => setDrawerOpen(false)}
                          className="block py-2 px-2.5 rounded hover:bg-current/10 opacity-85 hover:opacity-100 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Sección de Departamentos y Catálogo */}
              <div
                style={{ borderColor: "var(--border)" }}
                className="border-t pt-4"
              >
                <div
                  style={{ color: "var(--card-foreground)" }}
                  className="flex items-center gap-1.5 font-bold text-xs mb-2.5 uppercase tracking-wider"
                >
                  <FolderOpen className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  <span>Catálogo de Productos</span>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    <Link
                      href="/catalogo"
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                        borderRadius: "var(--radius)",
                      }}
                      className="block py-2 px-2.5 font-bold shadow-2xs transition-opacity hover:opacity-90"
                    >
                      Ver Todo el Catálogo
                    </Link>
                  </li>
                  {categories
                    .filter(
                      (c) =>
                        c.slug !== "servicios-digitales" &&
                        c.slug !== "servicios-cyber"
                    )
                    .map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/catalogo?categoria=${c.slug}`}
                          onClick={() => setDrawerOpen(false)}
                          className={`block py-1.5 px-2.5 rounded transition-colors ${
                            effectiveCategory === c.slug
                              ? "bg-current/10 font-bold opacity-100"
                              : "hover:bg-current/10 opacity-85 hover:opacity-100"
                          }`}
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Información de Sucursal y Horarios */}
              <div
                style={{ borderColor: "var(--border)" }}
                className="border-t pt-4 text-xs space-y-2 opacity-85"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <div>
                    <span
                      style={{ color: "var(--card-foreground)" }}
                      className="font-bold block"
                    >
                      {business.branchName}
                    </span>
                    <span className="text-[11px] leading-tight block opacity-75">
                      {business.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <div>
                    <span
                      style={{ color: "var(--card-foreground)" }}
                      className="font-bold block"
                    >
                      Horario Comercial:
                    </span>
                    <span className="text-[11px] leading-tight block opacity-75">
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
