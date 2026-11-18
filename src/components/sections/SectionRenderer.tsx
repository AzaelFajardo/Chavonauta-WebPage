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
            style={{
              backgroundColor: "var(--primary, #1a2f85)",
              color: "var(--primary-foreground, #ffffff)",
            }}
            className="relative pt-10 pb-36 px-4 sm:px-8 overflow-hidden shadow-inner transition-colors duration-200"
          >
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl z-10">
                <span
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-foreground)",
                    borderRadius: "var(--radius)",
                  }}
                  className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs border border-white/20 transition-all"
                >
                  Catálogo Oficial y Servicios en Sucursal
                </span>

                {/* Título en Alto Contraste sobre Fondo Primario */}
                <h1
                  style={{ color: "var(--primary-foreground, #ffffff)" }}
                  className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight drop-shadow-xs"
                >
                  {section.title}
                </h1>

                {/* Subtítulo reactivo con alta legibilidad */}
                <p className="mt-4 text-base sm:text-lg opacity-90 leading-relaxed font-normal">
                  {section.subtitle}
                </p>

                {/* Botones de acción con alto contraste */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/catalogo"
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--accent-foreground)",
                      borderRadius: "var(--radius)",
                    }}
                    className="px-6 py-3 font-extrabold text-sm shadow-md transition-opacity hover:opacity-90"
                  >
                    Ver Todo el Catálogo
                  </Link>
                  <a
                    href={waHero}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ borderRadius: "var(--radius)" }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Contactar por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Imagen lateral */}
              <div
                style={{ borderRadius: "var(--radius)" }}
                className="hidden lg:block w-96 h-64 overflow-hidden border border-white/20 shadow-2xl relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80"
                  alt="Chavonauta Cómputo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      borderRadius: "var(--radius)",
                    }}
                    className="text-xs font-semibold border border-white/20 px-3 py-1 shadow-xs"
                  >
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
              <div
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="p-5 shadow-md border flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <h2 className="font-heading font-bold text-xl mb-3" style={{ color: "var(--card-foreground)" }}>
                    Renta de PC e Internet
                  </h2>
                  <div
                    style={{ borderRadius: "var(--radius)" }}
                    className="aspect-[4/3] overflow-hidden bg-slate-100 mb-3"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80"
                      alt="Renta de PC"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    Fibra óptica simétrica, paquetería Office e impresión directa desde tu estación de trabajo.
                  </p>
                  <div className="mt-2 text-sm font-bold" style={{ color: "var(--card-foreground)" }}>
                    $7.00 / hr <span className="text-xs font-normal opacity-70">(Media hr: $4.00)</span>
                  </div>
                </div>
                <Link
                  href="/#tarifas"
                  style={{ color: "var(--primary)" }}
                  className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
                >
                  <span>Ver tarifas de computadoras</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta 2: Cuadrante 2x2 Impresiones y Servicios */}
              <div
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="p-5 shadow-md border flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <h2 className="font-heading font-bold text-xl mb-3" style={{ color: "var(--card-foreground)" }}>
                    Centro de Impresiones
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex flex-col">
                      <div
                        style={{ borderRadius: "var(--radius)" }}
                        className="aspect-square overflow-hidden bg-slate-100 mb-1"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=300&q=80"
                          alt="Impresión B/N"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium truncate opacity-90">
                        Impresión B/N
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div
                        style={{ borderRadius: "var(--radius)" }}
                        className="aspect-square overflow-hidden bg-slate-100 mb-1"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=300&q=80"
                          alt="Color & Foto"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium truncate opacity-90">
                        Color & Fotos
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div
                        style={{ borderRadius: "var(--radius)" }}
                        className="aspect-square overflow-hidden bg-slate-100 mb-1"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=300&q=80"
                          alt="Escaneos PDF"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium truncate opacity-90">
                        Escaneo a PDF
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div
                        style={{ borderRadius: "var(--radius)" }}
                        className="aspect-square overflow-hidden bg-slate-100 mb-1"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80"
                          alt="Enmicados"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium truncate opacity-90">
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
                  style={{ color: "var(--primary)" }}
                  className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
                >
                  <span>Enviar archivos por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta 3: Cuadrante 2x2 Accesorios de Cómputo */}
              <div
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="p-5 shadow-md border flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <h2 className="font-heading font-bold text-xl mb-3" style={{ color: "var(--card-foreground)" }}>
                    Accesorios Tecnológicos
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Link href="/catalogo?categoria=teclados-y-mouse" className="flex flex-col group">
                      <div
                        style={{ borderRadius: "var(--radius)" }}
                        className="aspect-square overflow-hidden bg-slate-100 mb-1"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80"
                          alt="Teclados"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium truncate group-hover:underline opacity-90">
                        Teclados y Mouse
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=cables-y-cargadores" className="flex flex-col group">
                      <div
                        style={{ borderRadius: "var(--radius)" }}
                        className="aspect-square overflow-hidden bg-slate-100 mb-1"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80"
                          alt="Cables"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium truncate group-hover:underline opacity-90">
                        Cables y Carga
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=memorias" className="flex flex-col group">
                      <div
                        style={{ borderRadius: "var(--radius)" }}
                        className="aspect-square overflow-hidden bg-slate-100 mb-1"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=300&q=80"
                          alt="Memorias"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium truncate group-hover:underline opacity-90">
                        Memorias USB
                      </span>
                    </Link>
                    <Link href="/catalogo?categoria=audifonos-y-diademas" className="flex flex-col group">
                      <div
                        style={{ borderRadius: "var(--radius)" }}
                        className="aspect-square overflow-hidden bg-slate-100 mb-1"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80"
                          alt="Audífonos"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium truncate group-hover:underline opacity-90">
                        Audífonos
                      </span>
                    </Link>
                  </div>
                </div>
                <Link
                  href="/catalogo"
                  style={{ color: "var(--primary)" }}
                  className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
                >
                  <span>Explorar departamentos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta 4: Reparación y Soporte Técnico */}
              <div
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="p-5 shadow-md border flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <h2 className="font-heading font-bold text-xl mb-3" style={{ color: "var(--card-foreground)" }}>
                    Reparación de Equipos
                  </h2>
                  <div
                    style={{ borderRadius: "var(--radius)" }}
                    className="aspect-[4/3] overflow-hidden bg-slate-100 mb-3"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80"
                      alt="Reparación Técnica"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    Mantenimiento preventivo, formateo, cambio de piezas y diagnóstico para PC, laptops, celulares y consolas.
                  </p>
                  <span
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--secondary-foreground)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                    }}
                    className="inline-block mt-2 text-[11px] font-bold border px-2.5 py-0.5"
                  >
                    Diagnóstico en sucursal
                  </span>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, tengo un equipo que requiere revisión técnica o reparación."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--primary)" }}
                  className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
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
          <div
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="max-w-[1440px] mx-auto p-5 sm:p-6 shadow-sm border transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl sm:text-2xl" style={{ color: "var(--card-foreground)" }}>
                {section.title}
              </h2>
              <Link
                href="/catalogo"
                style={{ color: "var(--primary)" }}
                className="text-xs sm:text-sm font-bold hover:underline flex items-center gap-1"
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
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                    }}
                    className="flex flex-col justify-between border p-4 hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Imagen */}
                      <Link
                        href={`/item/${product.slug}`}
                        style={{ borderRadius: "var(--radius)" }}
                        className="relative block aspect-square w-full overflow-hidden bg-slate-50 mb-3"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badges.length > 0 && (
                          <span
                            style={{
                              backgroundColor: "var(--secondary)",
                              color: "var(--secondary-foreground)",
                              borderColor: "var(--border)",
                              borderRadius: "var(--radius)",
                            }}
                            className="absolute top-2 left-2 border text-[10px] font-bold px-2 py-0.5"
                          >
                            {product.badges[0]}
                          </span>
                        )}
                      </Link>

                      {/* Título */}
                      <Link href={`/item/${product.slug}`}>
                        <h3
                          className="font-heading font-medium text-xs sm:text-sm line-clamp-2 transition-colors leading-snug"
                          style={{ color: "var(--card-foreground)" }}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      {/* Precio */}
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xl font-bold" style={{ color: "var(--card-foreground)" }}>
                          {product.priceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Botón WhatsApp en primary reactivo */}
                    <div className="mt-4 pt-3 border-t border-black/5">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                          borderRadius: "var(--radius)",
                        }}
                        className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-bold shadow-xs transition-opacity hover:opacity-90"
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
              <div
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="p-5 shadow-sm border flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2" style={{ color: "var(--card-foreground)" }}>
                    Trámites Digitales
                  </h3>
                  <div
                    style={{ borderRadius: "var(--radius)" }}
                    className="aspect-[4/3] overflow-hidden bg-slate-100 mb-3"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                      alt="Trámites Digitales"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    Consulta e impresión de CURP certificada, actas de nacimiento, recibos CFE y citas. (No RFC 1ra vez).
                  </p>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, necesito asesoría con un trámite digital."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--primary)" }}
                  className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
                >
                  <span>Consultar trámite por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta: Recargas Telefónicas */}
              <div
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="p-5 shadow-sm border flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2" style={{ color: "var(--card-foreground)" }}>
                    Recargas Telefónicas
                  </h3>
                  <div
                    style={{ borderRadius: "var(--radius)" }}
                    className="aspect-[4/3] overflow-hidden bg-slate-100 mb-3"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"
                      alt="Recargas Telefónicas"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    Saldo y paquetes de datos para Telcel, Movistar, AT&T, Bait y más compañías. En mostrador.
                  </p>
                </div>
                <Link
                  href="/#ubicacion"
                  style={{ color: "var(--primary)" }}
                  className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
                >
                  <span>Ver horarios y sucursal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tarjeta: Diseño y Programación */}
              <div
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="p-5 shadow-sm border flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2" style={{ color: "var(--card-foreground)" }}>
                    Diseño & Programación
                  </h3>
                  <div
                    style={{ borderRadius: "var(--radius)" }}
                    className="aspect-[4/3] overflow-hidden bg-slate-100 mb-3"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
                      alt="Diseño y Programación"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    Diseño de lonas, invitaciones, publicidad comercial y desarrollo de páginas web y aplicaciones a la medida.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    "Hola Chavonauta, deseo cotizar un proyecto de diseño o programación."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--primary)" }}
                  className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
                >
                  <span>Cotizar proyecto por WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tarjeta: Trabajos de Papelería */}
              <div
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="p-5 shadow-sm border flex flex-col justify-between transition-colors overflow-hidden"
              >
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2" style={{ color: "var(--card-foreground)" }}>
                    Trabajos de Papelería
                  </h3>
                  <div
                    style={{ borderRadius: "var(--radius)" }}
                    className="aspect-[4/3] overflow-hidden bg-slate-100 mb-3"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80"
                      alt="Papelería"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    Forrado de libretas y libros, engargolados con arillo y pastas, preparación de carpetas escolares y de oficina.
                  </p>
                </div>
                <Link
                  href="/catalogo?categoria=papeleria"
                  style={{ color: "var(--primary)" }}
                  className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
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
          <div
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="max-w-[1440px] mx-auto p-6 sm:p-8 shadow-sm border transition-colors duration-200 overflow-hidden"
          >
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                Tarifas de Renta de Equipos
              </span>
              <h2 className="font-heading font-bold text-2xl mt-1" style={{ color: "var(--card-foreground)" }}>
                {section.title}
              </h2>
              <p className="text-xs sm:text-sm opacity-80 mt-1">
                {section.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="border p-6"
              >
                <span className="text-xs font-semibold opacity-70 uppercase">Tarifa 1 Hora</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ color: "var(--card-foreground)" }}>$7.00</span>
                  <span className="text-xs font-bold opacity-70">MXN / hora</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs opacity-90">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Conexión de fibra óptica simétrica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Paquetería completa Office (Word, Excel, PowerPoint, PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Puertos frontales para memorias y celulares</span>
                  </li>
                </ul>
              </div>

              <div
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="border p-6"
              >
                <span className="text-xs font-semibold opacity-70 uppercase">Tarifa Media Hora</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ color: "var(--card-foreground)" }}>$4.00</span>
                  <span className="text-xs font-bold opacity-70">MXN / 30 minutos</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs opacity-90">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Uso rápido para consultas o descarga de formatos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Impresión directa desde la computadora</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
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
          <div
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="max-w-[1440px] mx-auto p-6 sm:p-8 shadow-sm border transition-colors duration-200 overflow-hidden"
          >
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                Atención en Sucursal
              </span>
              <h2 className="font-heading font-bold text-2xl mt-1" style={{ color: "var(--card-foreground)" }}>
                Ubicación y Horarios de Atención
              </h2>
              <p className="text-xs sm:text-sm opacity-80 mt-1">
                {business.branchName ? `Sucursal ${business.branchName}` : "Sucursal Principal"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dirección y Contacto */}
              <div className="space-y-5 lg:col-span-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <div>
                    <strong className="block text-sm mb-1" style={{ color: "var(--card-foreground)" }}>Dirección:</strong>
                    <span className="text-xs opacity-80 leading-relaxed block">
                      {business.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm mb-1" style={{ color: "var(--card-foreground)" }}>WhatsApp de Atención:</strong>
                    <a
                      href={`https://wa.me/${business.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--primary)" }}
                      className="text-xs font-bold hover:underline"
                    >
                      449 402 2163
                    </a>
                  </div>
                </div>

                {business.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                    <div>
                      <strong className="block text-sm mb-1" style={{ color: "var(--card-foreground)" }}>Correo Electrónico:</strong>
                      <a
                        href={`mailto:${business.email}`}
                        style={{ color: "var(--primary)" }}
                        className="text-xs font-semibold hover:underline"
                      >
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Horario Comercial Completo */}
              <div
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="lg:col-span-2 border p-5"
              >
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/10">
                  <Clock className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-bold text-sm" style={{ color: "var(--card-foreground)" }}>
                    Horario Comercial (Abierto en horario específico)
                  </h3>
                </div>

                {business.scheduleDetails && business.scheduleDetails.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                    {business.scheduleDetails.map((item) => (
                      <div
                        key={item.day}
                        className="flex items-center justify-between py-1 border-b border-black/5"
                      >
                        <span className="font-semibold" style={{ color: "var(--card-foreground)" }}>{item.day}</span>
                        <span className="font-mono opacity-80">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs opacity-80">{business.schedule}</p>
                )}

                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs opacity-80">
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
