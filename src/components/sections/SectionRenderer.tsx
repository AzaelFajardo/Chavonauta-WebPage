import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  ArrowRight,
  Check,
  MapPin,
  Clock,
  Mail,
  ChevronRight,
} from "lucide-react";
import { BusinessInfo, CatalogItem, Category, SectionBlock } from "@/types";

interface SectionRendererProps {
  section: SectionBlock;
  items: CatalogItem[];
  categories: Category[];
  business: BusinessInfo;
}

export function SectionRenderer({
  section,
  items,
  categories,
  business,
}: SectionRendererProps) {
  if (!section.enabled) return null;

  switch (section.type) {
    // ----------------------------------------------------
    // 1. HERO BANNER + GRID MULTI-TARJETAS (Fondo navy-900 sólido con alto contraste)
    // ----------------------------------------------------
    case "hero": {
      const waHero = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
        `Hola ${business.name}, deseo consultar la disponibilidad de un producto o servicio.`
      )}`;

      return (
        <section className="relative pb-10 bg-background text-foreground transition-colors duration-200">
          {/* Banner Hero Superior: Fondo reactivo a la paleta del tema */}
          <div
            style={{ backgroundColor: "var(--primary, #1a2f85)" }}
            className="relative text-white pt-10 pb-36 px-4 sm:px-8 overflow-hidden shadow-inner transition-colors duration-200"
          >
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl z-10">
                <span className="inline-block px-3 py-1 rounded bg-navy-800 text-white border border-navy-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
                  Catálogo Oficial y Servicios en Sucursal
                </span>

                {/* Título en Blanco Nítido sobre Fondo Navy */}
                <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight drop-shadow-xs">
                  {section.title}
                </h1>

                {/* Subtítulo en Navy-100 de alta legibilidad */}
                <p className="mt-4 text-base sm:text-lg text-navy-100 leading-relaxed font-normal">
                  {section.subtitle}
                </p>

                {/* Botones de acción con alto contraste */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/catalogo"
                    className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-navy-900 font-extrabold text-sm shadow-md transition-colors"
                  >
                    Ver Todo el Catálogo
                  </Link>
                  <a
                    href={waHero}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Contactar por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Imagen lateral */}
              <div className="hidden lg:block w-96 h-64 rounded-xl overflow-hidden border border-white/20 shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80"
                  alt="Chavonauta Cómputo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-semibold text-white bg-navy-900/90 border border-navy-700 px-3 py-1 rounded-md">
                    Renta de PC: $7.00 / hora
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cuadrícula de 4 Tarjetas Solapadas en el Hero */}
          <div className="max-w-[1440px] mx-auto px-4 -mt-20 sm:-mt-24 relative z-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

              {/* Tarjeta 1: Renta de PC e Internet */}
              <div className="bg-white p-5 rounded-lg shadow-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900 mb-3">
                    Renta de PC e Internet
                  </h2>
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80"
                      alt="Renta de PC"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fibra óptica simétrica, paquetería Office e impresión directa desde tu estación de trabajo.
                  </p>
                  <div className="mt-2 text-sm font-bold text-slate-900">
                    $7.00 / hr <span className="text-xs font-normal text-slate-500">(Media hr: $4.00)</span>
                  </div>
                </div>
                <Link
                  href="/#tarifas"
                  className="mt-4 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
                >
                  <span>Ver tarifas de computadoras</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta 2: Cuadrante 2x2 Impresiones y Servicios */}
              <div className="bg-white p-5 rounded-lg shadow-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900 mb-3">
                    Centro de Impresiones
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex flex-col">
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=300&q=80"
                          alt="Impresión B/N"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-800 font-medium truncate">
                        Impresión B/N
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=300&q=80"
                          alt="Color & Foto"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-800 font-medium truncate">
                        Color & Fotos
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=300&q=80"
                          alt="Escaneos PDF"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-800 font-medium truncate">
                        Escaneo a PDF
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80"
                          alt="Enmicados"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-800 font-medium truncate">
                        Enmicado térmico
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, deseo enviar archivos para imprimir o cotizar copias."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
                >
                  <span>Enviar archivos por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta 3: Cuadrante 2x2 Accesorios de Cómputo */}
              <div className="bg-white p-5 rounded-lg shadow-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900 mb-3">
                    Accesorios Tecnológicos
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Link href="/catalogo?categoria=teclados-y-mouse" className="flex flex-col group">
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80"
                          alt="Teclados"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-800 font-medium truncate group-hover:text-navy-700">
                        Teclados y Mouse
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=cables-y-cargadores" className="flex flex-col group">
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80"
                          alt="Cables"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-800 font-medium truncate group-hover:text-navy-700">
                        Cables y Carga
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=memorias" className="flex flex-col group">
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=300&q=80"
                          alt="Memorias"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-800 font-medium truncate group-hover:text-navy-700">
                        Memorias USB
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=audifonos-y-diademas" className="flex flex-col group">
                      <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80"
                          alt="Audífonos"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-slate-800 font-medium truncate group-hover:text-navy-700">
                        Audífonos
                      </span>
                    </Link>
                  </div>
                </div>
                <Link
                  href="/catalogo"
                  className="mt-4 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
                >
                  <span>Explorar departamentos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta 4: Reparación y Soporte Técnico */}
              <div className="bg-white p-5 rounded-lg shadow-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-slate-900 mb-3">
                    Reparación de Equipos
                  </h2>
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80"
                      alt="Reparación Técnica"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mantenimiento preventivo, formateo, cambio de piezas y diagnóstico para PC, laptops, celulares y consolas.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-navy-900 bg-navy-50 border border-navy-200 px-2.5 py-0.5 rounded">
                    Diagnóstico en sucursal
                  </span>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, tengo un equipo que requiere revisión técnica o reparación."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
                >
                  <span>Consultar diagnóstico por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 2. PRODUCTOS DESTACADOS
    // ----------------------------------------------------
    case "featured_catalog": {
      const products = items.filter((item) => item.type === "product");

      return (
        <section className="bg-background text-foreground py-6 px-4 transition-colors duration-200">
          <div className="max-w-[1440px] mx-auto bg-card text-card-foreground p-5 sm:p-6 rounded-lg shadow-sm border border-border transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
                {section.title}
              </h2>
              <Link
                href="/catalogo"
                className="text-xs sm:text-sm font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
              >
                <span>Ver todo el catálogo</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Fila de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 8).map((product) => {
                const waLink = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                  `Hola Chavonauta, me interesa consultar disponibilidad del artículo: ${product.name}`
                )}`;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between border border-slate-200 rounded-lg p-4 bg-white hover:border-navy-300 hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Imagen */}
                      <Link
                        href={`/item/${product.slug}`}
                        className="relative block aspect-square w-full overflow-hidden bg-slate-50 rounded-md mb-3"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badges.length > 0 && (
                          <span className="absolute top-2 left-2 bg-navy-100 text-navy-900 border border-navy-200 text-[10px] font-bold px-2 py-0.5 rounded">
                            {product.badges[0]}
                          </span>
                        )}
                      </Link>

                      {/* Título */}
                      <Link href={`/item/${product.slug}`}>
                        <h3 className="font-heading font-medium text-xs sm:text-sm text-slate-900 line-clamp-2 group-hover:text-navy-700 transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Precio */}
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-900">
                          {product.priceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Botón WhatsApp en navy-800 */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Consultar por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 3. SEGUNDA CUADRÍCULA DE SERVICIOS
    // ----------------------------------------------------
    case "services": {
      return (
        <section className="bg-background text-foreground py-6 px-4 transition-colors duration-200">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

              {/* Tarjeta: Trámites Digitales */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                    Trámites Digitales
                  </h3>
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                      alt="Trámites Digitales"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Consulta e impresión de CURP certificada, actas de nacimiento, recibos CFE y citas. (No RFC 1ra vez).
                  </p>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, necesito asesoría con un trámite digital."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
                >
                  <span>Consultar trámite por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta: Recargas Telefónicas */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                    Recargas Telefónicas
                  </h3>
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"
                      alt="Recargas Telefónicas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Saldo y paquetes de datos para Telcel, Movistar, AT&T, Bait y más compañías. En mostrador.
                  </p>
                </div>
                <Link
                  href="/#ubicacion"
                  className="mt-4 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
                >
                  <span>Ver horarios y sucursal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta: Diseño y Programación */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                    Diseño & Programación
                  </h3>
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
                      alt="Diseño y Programación"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Diseño de lonas, invitaciones, publicidad comercial y desarrollo de páginas web y aplicaciones a la medida.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, deseo cotizar un proyecto de diseño o programación."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
                >
                  <span>Cotizar proyecto por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta: Trabajos de Papelería */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                    Trabajos de Papelería
                  </h3>
                  <div className="aspect-[4/3] rounded-md overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
                      alt="Papelería"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Forrado de libretas y libros, engargolados con arillo y pastas, preparación de carpetas escolares y de oficina.
                  </p>
                </div>
                <Link
                  href="/catalogo?categoria=papeleria"
                  className="mt-4 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline flex items-center gap-1"
                >
                  <span>Ver artículos de papelería</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 4. TARIFAS DE RENTA DE COMPUTADORAS ($7/hr y $4/media hr)
    // ----------------------------------------------------
    case "rates": {
      return (
        <section id="tarifas" className="bg-background text-foreground py-6 px-4 transition-colors duration-200">
          <div className="max-w-[1440px] mx-auto bg-card text-card-foreground p-6 sm:p-8 rounded-lg shadow-sm border border-border transition-colors duration-200">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-bold text-navy-800 uppercase tracking-wider">
                Tarifas de Renta de Equipos
              </span>
              <h2 className="font-heading font-bold text-2xl text-slate-900 mt-1">
                {section.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {section.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                <span className="text-xs font-semibold text-slate-500 uppercase">Tarifa 1 Hora</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">$7.00</span>
                  <span className="text-xs font-bold text-slate-500">MXN / hora</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-700 shrink-0" />
                    <span>Conexión de fibra óptica simétrica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-700 shrink-0" />
                    <span>Paquetería completa Office (Word, Excel, PowerPoint, PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-700 shrink-0" />
                    <span>Puertos frontales para memorias y celulares</span>
                  </li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                <span className="text-xs font-semibold text-slate-500 uppercase">Tarifa Media Hora</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">$4.00</span>
                  <span className="text-xs font-bold text-slate-500">MXN / 30 minutos</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-700 shrink-0" />
                    <span>Uso rápido para consultas o descarga de formatos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-700 shrink-0" />
                    <span>Impresión directa desde la computadora</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-navy-700 shrink-0" />
                    <span>Posibilidad de extender a 1 hora</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 5. UBICACIÓN, HORARIOS Y DATOS OFICIALES DE SUCURSAL
    // ----------------------------------------------------
    case "location": {
      return (
        <section id="ubicacion" className="bg-background text-foreground py-6 px-4 transition-colors duration-200">
          <div className="max-w-[1440px] mx-auto bg-card text-card-foreground p-6 sm:p-8 rounded-lg shadow-sm border border-border transition-colors duration-200">
            <div className="mb-6">
              <span className="text-xs font-bold text-navy-800 uppercase tracking-wider">
                Atención en Sucursal
              </span>
              <h2 className="font-heading font-bold text-2xl text-slate-900 mt-1">
                Ubicación y Horarios de Atención
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {business.branchName ? `Sucursal ${business.branchName}` : "Sucursal Principal"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dirección y Contacto */}
              <div className="space-y-5 lg:col-span-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-navy-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-slate-900 mb-1">Dirección:</strong>
                    <span className="text-xs text-slate-700 leading-relaxed block">
                      {business.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-slate-900 mb-1">WhatsApp de Atención:</strong>
                    <a
                      href={`https://wa.me/${business.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-navy-800 font-bold hover:underline"
                    >
                      449 402 2163
                    </a>
                  </div>
                </div>

                {business.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-navy-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm text-slate-900 mb-1">Correo Electrónico:</strong>
                      <a
                        href={`mailto:${business.email}`}
                        className="text-xs text-navy-800 font-semibold hover:underline"
                      >
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Horario Comercial Completo */}
              <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                  <Clock className="w-4 h-4 text-navy-800" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Horario Comercial (Abierto en horario específico)
                  </h3>
                </div>

                {business.scheduleDetails && business.scheduleDetails.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                    {business.scheduleDetails.map((item) => (
                      <div
                        key={item.day}
                        className="flex items-center justify-between py-1 border-b border-slate-200/60"
                      >
                        <span className="font-semibold text-slate-800">{item.day}</span>
                        <span className="font-mono text-slate-700">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-700">{business.schedule}</p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Te esperamos en Whatsapp!!!</span>
                  <a
                    href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent("Hola Chavonauta, deseo consultar si están abiertos en este momento.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Preguntar por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
