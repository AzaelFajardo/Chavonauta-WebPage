import React from "react";
import Link from "next/link";
import {
  Monitor,
  Printer,
  FileText,
  Wrench,
  Smartphone,
  Code2,
  ArrowRight,
  MessageCircle,
  Clock,
  MapPin,
  Check,
} from "lucide-react";
import { BusinessInfo, CatalogItem, Category, SectionBlock } from "@/types";
import { ItemCard } from "@/components/storefront/ItemCard";

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
    // 1. BANNER PRINCIPAL (Minimalista, tecnológico, abundante espacio)
    // ----------------------------------------------------
    case "hero": {
      const whatsappHero = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
        `Hola ${business.name}, deseo consultar la disponibilidad de un producto del catálogo.`
      )}`;

      return (
        <section className="bg-white border-b border-slate-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {Boolean(section.content.badgeText) && (
              <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-wide text-navy-800 bg-navy-50 rounded-full border border-navy-200/60 mb-6">
                {String(section.content.badgeText)}
              </span>
            )}

            <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight">
              {section.title}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {section.subtitle}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/catalogo"
                className="px-6 py-3.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                Explorar Catálogo
              </Link>

              <a
                href={whatsappHero}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Contactar por WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 2. PRODUCTOS DESTACADOS (Fotografías grandes y tarjetas elegantes)
    // ----------------------------------------------------
    case "featured_catalog": {
      const products = items.filter((item) => item.type === "product");

      return (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-navy-700">
                Selección de Tienda
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                {section.title}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {section.subtitle}
              </p>
            </div>

            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-navy-900 transition-colors"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ItemCard
                key={product.id}
                item={product}
                whatsappNumber={business.whatsappNumber}
              />
            ))}
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 3. SERVICIOS DEL CYBER (Limpio y directo por WhatsApp)
    // ----------------------------------------------------
    case "services": {
      const servicesList = [
        {
          title: "Renta de Computadora e Internet",
          desc: "Navegación veloz, paquetería de oficina e impresión directa. Tarifa de $7.00/hora y $4.00/media hora.",
          icon: Monitor,
          actionText: "Ver tarifas",
          actionHref: "#tarifas",
        },
        {
          title: "Impresiones y Copias (B/N y Color)",
          desc: "Impresión de alta resolución en diversos tipos de papel. Recepción directa de archivos por WhatsApp.",
          icon: Printer,
          actionText: "Cotizar por WhatsApp",
          isWhatsapp: true,
          msg: "Hola Chavonauta, deseo cotizar impresiones o copias.",
        },
        {
          title: "Reparación y Mantenimiento Técnico",
          desc: "Mantenimiento preventivo y correctivo para computadoras, laptops, celulares, consolas y tablets.",
          icon: Wrench,
          actionText: "Consultar diagnóstico",
          isWhatsapp: true,
          msg: "Hola Chavonauta, requiero cotización para la reparación de un equipo.",
        },
        {
          title: "Trámites Digitales por Internet",
          desc: "Descarga e impresión de CURP certificada, actas, recibos CFE y citas (excepto RFC primera vez).",
          icon: FileText,
          actionText: "Consultar trámite",
          isWhatsapp: true,
          msg: "Hola Chavonauta, necesito asesoría con un trámite digital.",
        },
        {
          title: "Recargas Telefónicas",
          desc: "Recargas para todas las compañías móviles. (Aclaración: contamos con recargas, no pago de servicios).",
          icon: Smartphone,
          actionText: "Disponible en tienda",
          actionHref: "#ubicacion",
        },
        {
          title: "Diseño Gráfico y Desarrollo Web",
          desc: "Diseño para lonas, publicidad e invitaciones; creación de páginas web y aplicaciones a la medida.",
          icon: Code2,
          actionText: "Cotizar proyecto",
          isWhatsapp: true,
          msg: "Hola Chavonauta, me interesa cotizar un servicio de diseño o desarrollo web.",
        },
      ];

      return (
        <section className="bg-slate-50 border-y border-slate-200/80 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-semibold tracking-wider uppercase text-navy-700">
                Soluciones Integrales
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                {section.title}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {section.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesList.map((srv) => {
                const IconComp = srv.icon;
                const waLink = srv.isWhatsapp
                  ? `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                      srv.msg || "Hola Chavonauta, tengo una duda sobre un servicio."
                    )}`
                  : srv.actionHref || "#";

                return (
                  <div
                    key={srv.title}
                    className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900 mb-4">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-semibold text-slate-900 text-base">
                        {srv.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      {srv.isWhatsapp ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-navy-700"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{srv.actionText}</span>
                          <ArrowRight className="w-3 h-3 ml-0.5" />
                        </a>
                      ) : (
                        <Link
                          href={srv.actionHref || "#"}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-navy-900"
                        >
                          <span>{srv.actionText}</span>
                          <ArrowRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      )}
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
    // 4. TARIFAS DE RENTA DE EQUIPOS (Sobrio y minimalista)
    // ----------------------------------------------------
    case "rates": {
      return (
        <section id="tarifas" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-wider uppercase text-navy-700">
              Uso en Sucursal
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              {section.title}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {section.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Sesión Estándar
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                1 Hora de Internet y Cómputo
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">$7.00</span>
                <span className="text-xs font-semibold text-slate-500">MXN</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-navy-700 shrink-0" />
                  <span>Navegación de alta velocidad en fibra óptica</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-navy-700 shrink-0" />
                  <span>Paquetería de oficina completa y lector de PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-navy-700 shrink-0" />
                  <span>Conexión USB frontal para memorias o dispositivos</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Sesión Rápida
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                Media Hora de Internet y Cómputo
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">$4.00</span>
                <span className="text-xs font-semibold text-slate-500">MXN</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-navy-700 shrink-0" />
                  <span>Acceso completo por 30 minutos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-navy-700 shrink-0" />
                  <span>Impresión directa de boletos o formatos urgentes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-navy-700 shrink-0" />
                  <span>Opción a extender tiempo si lo necesitas</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 5. UBICACIÓN Y HORARIOS
    // ----------------------------------------------------
    case "location": {
      const whatsappLocation = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
        `Hola ${business.name}, deseo consultar la ubicación exacta o los horarios de atención.`
      )}`;

      return (
        <section id="ubicacion" className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 sm:p-12">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold tracking-wider uppercase text-navy-700">
                Información de Contacto
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                {section.title}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {section.subtitle}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 border-t border-slate-100 pt-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-navy-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-900">Dirección</span>
                    <span>{business.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-navy-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-900">Horarios</span>
                    <span>{business.schedule}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-start md:items-end gap-4">
                <div className="text-left md:text-right">
                  <span className="block font-semibold text-slate-900">Contacto Directo</span>
                  <span>WhatsApp: +{business.whatsappNumber}</span>
                </div>

                <a
                  href={whatsappLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Escribir por WhatsApp</span>
                </a>
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
