import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  ArrowRight,
  Check,
  MapPin,
  Clock,
  Printer,
  FileText,
  Wrench,
  Smartphone,
  Code2,
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
    // 1. HERO BANNER + GRID MULTI-TARJETAS ESTILO AMAZON
    // ----------------------------------------------------
    case "hero": {
      const waHero = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
        `Hola ${business.name}, deseo consultar la disponibilidad de un producto o servicio.`
      )}`;

      return (
        <section className="relative pb-10 bg-[#e3e6e6]">
          {/* Banner Hero Superior Estilo Amazon */}
          <div className="relative bg-gradient-to-r from-[#232f3e] via-[#1a3860] to-[#0d213a] text-white pt-10 pb-36 px-4 sm:px-8 overflow-hidden">
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl z-10">
                <span className="inline-block px-3 py-1 rounded bg-[#febd69] text-[#111] text-xs font-bold uppercase tracking-wider mb-3">
                  Catálogo Oficial y Servicios en Sucursal
                </span>
                <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                  Todo en tecnología y servicios digitales
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                  Renta de computadoras por hora ($7.00/hr y $4.00/media hr), centro de impresiones express, trámites digitales, reparación de equipos y catálogo de accesorios tecnológicos.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/catalogo"
                    className="px-6 py-3 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold text-sm shadow-sm transition-colors"
                  >
                    Ver Todo el Catálogo
                  </Link>
                  <a
                    href={waHero}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/30 backdrop-blur transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#febd69]" />
                    <span>Contactar por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Imagen / Arte lateral sutil */}
              <div className="hidden lg:block w-96 h-64 rounded-xl overflow-hidden border border-white/20 shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80"
                  alt="Chavonauta Cómputo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white bg-black/50 px-2.5 py-1 rounded">
                    Renta de PC: $7.00 / hora
                  </span>
                </div>
              </div>
            </div>

            {/* Degradado hacia el fondo gris de Amazon */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#e3e6e6] to-transparent pointer-events-none" />
          </div>

          {/* Cuadrícula de 4 Tarjetas Icónicas de Amazon (Solapadas en el Hero) */}
          <div className="max-w-[1440px] mx-auto px-4 -mt-24 sm:-mt-28 relative z-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Tarjeta 1: Renta de PC e Internet */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#0f1111] mb-3">
                    Renta de PC e Internet
                  </h2>
                  <div className="aspect-[4/3] rounded overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80"
                      alt="Renta de PC"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs text-[#565959] leading-relaxed">
                    Fibra óptica simétrica, paquetería Office e impresión directa desde tu estación de trabajo.
                  </p>
                  <div className="mt-2 text-sm font-bold text-[#0f1111]">
                    $7.00 / hr <span className="text-xs font-normal text-slate-500">(Media hr: $4.00)</span>
                  </div>
                </div>
                <Link
                  href="/#tarifas"
                  className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
                >
                  <span>Ver tarifas de computadoras</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta 2: Cuadrante 2x2 Impresiones y Servicios (Estilo Amazon 4-grid) */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#0f1111] mb-3">
                    Centro de Impresiones
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex flex-col">
                      <div className="aspect-square rounded overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=300&q=80"
                          alt="Impresión B/N"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-[#0f1111] font-medium truncate">
                        Impresión B/N
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="aspect-square rounded overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=300&q=80"
                          alt="Color & Foto"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-[#0f1111] font-medium truncate">
                        Color & Fotos
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="aspect-square rounded overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=300&q=80"
                          alt="Escaneos PDF"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-[#0f1111] font-medium truncate">
                        Escaneo a PDF
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="aspect-square rounded overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80"
                          alt="Enmicados"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-[#0f1111] font-medium truncate">
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
                  className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
                >
                  <span>Enviar archivos por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta 3: Cuadrante 2x2 Accesorios de Cómputo (Estilo Amazon 4-grid) */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#0f1111] mb-3">
                    Accesorios Tecnológicos
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Link href="/catalogo?categoria=teclados-y-mouse" className="flex flex-col group">
                      <div className="aspect-square rounded overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80"
                          alt="Teclados"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-[#0f1111] font-medium truncate group-hover:text-[#007185]">
                        Teclados y Mouse
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=cables-y-cargadores" className="flex flex-col group">
                      <div className="aspect-square rounded overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80"
                          alt="Cables"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-[#0f1111] font-medium truncate group-hover:text-[#007185]">
                        Cables y Carga
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=memorias" className="flex flex-col group">
                      <div className="aspect-square rounded overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=300&q=80"
                          alt="Memorias"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-[#0f1111] font-medium truncate group-hover:text-[#007185]">
                        Memorias USB
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=audifonos-y-diademas" className="flex flex-col group">
                      <div className="aspect-square rounded overflow-hidden bg-slate-100 mb-1">
                        <img
                          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80"
                          alt="Audífonos"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] text-[#0f1111] font-medium truncate group-hover:text-[#007185]">
                        Audífonos
                      </span>
                    </Link>
                  </div>
                </div>
                <Link
                  href="/catalogo"
                  className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
                >
                  <span>Explorar departamentos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta 4: Reparación y Soporte Técnico */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#0f1111] mb-3">
                    Reparación de Equipos
                  </h2>
                  <div className="aspect-[4/3] rounded overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80"
                      alt="Reparación Técnica"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs text-[#565959] leading-relaxed">
                    Mantenimiento preventivo, formateo, cambio de piezas y diagnóstico para PC, laptops, celulares y consolas.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Diagnóstico en sucursal
                  </span>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, tengo un equipo que requiere revisión técnica o reparación."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
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
    // 2. PRODUCTOS DESTACADOS (Carrusel horizontal estilo Amazon)
    // ----------------------------------------------------
    case "featured_catalog": {
      const products = items.filter((item) => item.type === "product");

      return (
        <section className="bg-[#e3e6e6] py-6 px-4">
          <div className="max-w-[1440px] mx-auto bg-white p-5 sm:p-6 rounded-sm shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#0f1111]">
                {section.title}
              </h2>
              <Link
                href="/catalogo"
                className="text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
              >
                <span>Ver todo el catálogo</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Fila de productos estilo estante Amazon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 8).map((product) => {
                const waLink = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                  `Hola Chavonauta, me interesa consultar disponibilidad del artículo: ${product.name}`
                )}`;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between border border-slate-200 rounded p-4 bg-white hover:shadow-md transition-shadow group"
                  >
                    <div>
                      {/* Imagen Grande */}
                      <Link
                        href={`/item/${product.slug}`}
                        className="relative block aspect-square w-full overflow-hidden bg-slate-50 mb-3"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badges.length > 0 && (
                          <span className="absolute top-2 left-2 bg-[#cc0c39] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            {product.badges[0]}
                          </span>
                        )}
                      </Link>

                      {/* Título estilo Amazon */}
                      <Link href={`/item/${product.slug}`}>
                        <h3 className="font-heading font-medium text-xs sm:text-sm text-[#0f1111] line-clamp-2 group-hover:text-[#007185] transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Precio estilo Amazon */}
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xs font-semibold text-[#0f1111]">$</span>
                        <span className="text-xl font-bold text-[#0f1111]">
                          {product.referencePrice || product.priceLabel.replace(/[^0-9.]/g, "")}
                        </span>
                        <span className="text-xs text-[#565959]">MXN</span>
                      </div>
                    </div>

                    {/* Botón WhatsApp estilo botón Amazon */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs font-bold shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
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
    // 3. SEGUNDA CUADRÍCULA DE SERVICIOS (Trámites, Recargas, Diseño, etc.)
    // ----------------------------------------------------
    case "services": {
      return (
        <section className="bg-[#e3e6e6] py-6 px-4">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Tarjeta: Trámites Digitales */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#0f1111] mb-2">
                    Trámites Digitales
                  </h3>
                  <div className="aspect-[4/3] rounded overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                      alt="Trámites Digitales"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#565959] leading-relaxed">
                    Consulta e impresión de CURP certificada, actas de nacimiento, recibos CFE y citas. (No RFC 1ra vez).
                  </p>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, necesito asesoría con un trámite digital."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
                >
                  <span>Consultar trámite por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta: Recargas Telefónicas */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#0f1111] mb-2">
                    Recargas Telefónicas
                  </h3>
                  <div className="aspect-[4/3] rounded overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"
                      alt="Recargas Telefónicas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#565959] leading-relaxed">
                    Saldo y paquetes de datos para Telcel, Movistar, AT&T, Bait y más compañías. En mostrador.
                  </p>
                </div>
                <Link
                  href="/#ubicacion"
                  className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
                >
                  <span>Ver horarios y sucursal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta: Diseño y Programación */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#0f1111] mb-2">
                    Diseño & Programación
                  </h3>
                  <div className="aspect-[4/3] rounded overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
                      alt="Diseño y Programación"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#565959] leading-relaxed">
                    Diseño de lonas, invitaciones, publicidad comercial y desarrollo de páginas web y aplicaciones a la medida.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, deseo cotizar un proyecto de diseño o programación."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
                >
                  <span>Cotizar proyecto por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta: Trabajos de Papelería */}
              <div className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#0f1111] mb-2">
                    Trabajos de Papelería
                  </h3>
                  <div className="aspect-[4/3] rounded overflow-hidden bg-slate-100 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
                      alt="Papelería"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#565959] leading-relaxed">
                    Forrado de libretas y libros, engargolados con arillo y pastas, preparación de carpetas escolares y de oficina.
                  </p>
                </div>
                <Link
                  href="/catalogo?categoria=papeleria"
                  className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
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
        <section id="tarifas" className="bg-[#e3e6e6] py-6 px-4">
          <div className="max-w-[1440px] mx-auto bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-slate-200">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-bold text-[#c7511f] uppercase tracking-wider">
                Tarifas de Renta de Equipos
              </span>
              <h2 className="font-heading font-bold text-2xl text-[#0f1111] mt-1">
                {section.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#565959] mt-1">
                {section.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded p-6 bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500 uppercase">Tarifa 1 Hora</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#0f1111]">$7.00</span>
                  <span className="text-xs font-bold text-slate-500">MXN / hora</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Conexión de fibra óptica simétrica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Paquetería completa Office (Word, Excel, PowerPoint, PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Puertos frontales para memorias y celulares</span>
                  </li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded p-6 bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500 uppercase">Tarifa Media Hora</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#0f1111]">$4.00</span>
                  <span className="text-xs font-bold text-slate-500">MXN / 30 minutos</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Uso rápido para consultas o descarga de formatos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Impresión directa desde la computadora</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
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
    // 5. UBICACIÓN Y HORARIOS DE TIENDA
    // ----------------------------------------------------
    case "location": {
      return (
        <section id="ubicacion" className="bg-[#e3e6e6] py-6 px-4">
          <div className="max-w-[1440px] mx-auto bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-slate-200">
            <h2 className="font-heading font-bold text-xl text-[#0f1111] mb-4">
              Ubicación y Horarios de Atención
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c7511f] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-[#0f1111] mb-1">Dirección:</strong>
                  <span>{business.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#007185] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-[#0f1111] mb-1">Horarios:</strong>
                  <span>{business.schedule}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-[#0f1111] mb-1">Contacto Directo:</strong>
                  <span>WhatsApp: +{business.whatsappNumber}</span>
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
