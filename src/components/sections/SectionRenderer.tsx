import React from "react";
import Link from "next/link";
import {
  Monitor,
  Printer,
  FileCheck,
  Wrench,
  Smartphone,
  FolderOpen,
  Palette,
  Code2,
  Music,
  ArrowRight,
  MessageCircle,
  Clock,
  MapPin,
  Laptop,
  CheckCircle2,
  Sparkles,
  Zap,
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
    // 1. HERO BANNER (Estilo Mercado Libre / Amazon + Chavonauta)
    // ----------------------------------------------------
    case "hero": {
      const whatsappHero = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
        `Hola ${business.name}, vi su página y quiero cotizar impresiones o consultar disponibilidad.`
      )}`;

      return (
        <section className="bg-gradient-to-b from-navy-900 via-navy-800 to-slate-100 pt-6 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
          <div className="max-w-7xl mx-auto">
            {/* Banner Principal de Anuncio */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 border border-navy-700/80 p-6 sm:p-10 text-white shadow-2xl">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-bold uppercase tracking-wider mb-4 shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tu mejor opción en el Cybercafé</span>
                </div>

                <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight leading-tight text-white">
                  Chavonauta CiberCafé
                </h1>

                <p className="mt-3 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                  Renta de computadoras ($7/hr y $4/media hr), centro de impresiones B/N y color, copias, escaneos, trámites por internet, mantenimiento y reparación de equipos digitales, diseño, desarrollo web y catálogo de accesorios.
                </p>

                {/* Tarjetas resumen en el Hero */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700 backdrop-blur">
                    <span className="text-[11px] text-navy-200 block">Renta de PC</span>
                    <span className="font-extrabold text-amber-300 text-base sm:text-lg">
                      $7.00 / hr
                    </span>
                    <span className="text-[10px] text-slate-300 block">Media hr: $4.00</span>
                  </div>
                  <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700 backdrop-blur">
                    <span className="text-[11px] text-navy-200 block">Impresiones</span>
                    <span className="font-extrabold text-white text-base sm:text-lg">
                      B/N & Color
                    </span>
                    <span className="text-[10px] text-emerald-300 block">Envía por WhatsApp</span>
                  </div>
                  <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700 backdrop-blur">
                    <span className="text-[11px] text-navy-200 block">Servicio Técnico</span>
                    <span className="font-extrabold text-white text-base sm:text-lg">
                      Reparación
                    </span>
                    <span className="text-[10px] text-slate-300 block">Todo equipo digital</span>
                  </div>
                  <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700 backdrop-blur">
                    <span className="text-[11px] text-navy-200 block">Telefonía</span>
                    <span className="font-extrabold text-amber-300 text-base sm:text-lg">
                      Recargas
                    </span>
                    <span className="text-[10px] text-slate-300 block">Todas las compañías</span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/catalogo"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-sm transition-all shadow-md"
                  >
                    <span>Explorar Catálogo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={whatsappHero}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-sm transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Cotizar por WhatsApp</span>
                  </a>

                  <Link
                    href="#tarifas"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-navy-800/90 hover:bg-navy-700 text-slate-200 text-sm font-medium border border-navy-600 transition-colors"
                  >
                    <Laptop className="w-4 h-4 text-navy-300" />
                    <span>Ver Tarifas</span>
                  </Link>
                </div>
              </div>

              {/* Decoración geométrica sutil de fondo */}
              <div className="absolute right-0 top-0 -bottom-10 w-1/3 bg-gradient-to-l from-navy-700/20 to-transparent pointer-events-none hidden lg:block" />
            </div>

            {/* Carrusel / Barra de Categorías Estilo Mercado Libre */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Explorar por Categoría (Departamentos)
                </h2>
                <Link
                  href="/catalogo"
                  className="text-xs font-semibold text-navy-700 hover:underline"
                >
                  Ver todas →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalogo?categoria=${cat.slug}`}
                    className="group flex flex-col p-3 rounded-xl bg-white border border-slate-200 hover:border-navy-400 hover:shadow-md transition-all text-left"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-navy-700 transition-colors truncate">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {cat.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 2. SERVICIOS DEL CYBERCAFÉ (Datos reales exactos)
    // ----------------------------------------------------
    case "services": {
      const cyberServices = [
        {
          title: "Renta de Computadora e Internet",
          badge: "$7.00 / hr",
          subBadge: "Media hr: $4.00",
          icon: Monitor,
          description:
            "Equipos rápidos para tareas, navegación, Office e impresión directa. Precios ajustables desde el panel.",
          actionText: "Ver Tarifas",
          actionHref: "#tarifas",
        },
        {
          title: "Impresiones B/N y a Color & Copias",
          badge: "Servicio Express",
          subBadge: "WhatsApp / USB",
          icon: Printer,
          description:
            "Impresión láser y de alta calidad en papel bond, opalina o fotográfico. Manda tus archivos antes de llegar.",
          actionText: "Consultar por WhatsApp",
          isWhatsapp: true,
          waMsg: "Hola Chavonauta, quiero consultar precios de impresiones/copias o mandar archivos.",
        },
        {
          title: "Escaneos y Enmicados",
          badge: "Mica Térmica",
          subBadge: "PDF / Imagen",
          icon: FileCheck,
          description:
            "Digitalización en alta resolución de tus documentos a PDF. Enmicado protector para credenciales y hojas carta/oficio.",
          actionText: "Consultar por WhatsApp",
          isWhatsapp: true,
          waMsg: "Hola Chavonauta, me gustaría consultar sobre escaneo o enmicado de documentos.",
        },
        {
          title: "Trámites Digitales por Internet",
          badge: "Atención Inmediata",
          subBadge: "Todo tipo (excepto RFC 1ra vez)",
          icon: CheckCircle2,
          description:
            "CURP certificada, actas de nacimiento, recibos CFE, citas y formatos oficiales. Aclaración: no se hace RFC por primera vez.",
          actionText: "Consultar por WhatsApp",
          isWhatsapp: true,
          waMsg: "Hola Chavonauta, necesito apoyo con un trámite digital.",
        },
        {
          title: "Reparación y Mantenimiento Técnico",
          badge: "Diagnóstico",
          subBadge: "Todo equipo digital",
          icon: Wrench,
          description:
            "Mantenimiento, limpieza y reparación de computadoras, laptops, celulares, consolas, tablets e impresoras (no electrodomésticos).",
          actionText: "Cotizar por WhatsApp",
          isWhatsapp: true,
          waMsg: "Hola Chavonauta, tengo un equipo que requiere mantenimiento o reparación.",
        },
        {
          title: "Recargas Telefónicas Multicompañía",
          badge: "Al Instante",
          subBadge: "Telcel, Movistar, AT&T, Bait",
          icon: Smartphone,
          description:
            "Recargas de saldo y paquetes de datos para todas las compañías. *Aclaración: contamos con recargas, no con pago de servicios.*",
          actionText: "Consultar en mostrador",
          actionHref: "#ubicacion",
        },
        {
          title: "Trabajos de Papelería de Todo Tipo",
          badge: "Escolar y Oficina",
          subBadge: "Forrados y Engargolados",
          icon: FolderOpen,
          description:
            "Forrado profesional de libretas y libros, engargolados con pasta, preparación de carpetas y proyectos escolares.",
          actionText: "Consultar por WhatsApp",
          isWhatsapp: true,
          waMsg: "Hola Chavonauta, quiero cotizar un trabajo de papelería / engargolado.",
        },
        {
          title: "Trabajos de Diseño Digital",
          badge: "A la Medida",
          subBadge: "Lonas, Invitaciones, Folletos",
          icon: Palette,
          description:
            "Diseño gráfico personalizado para lonas, invitaciones de eventos, publicidad, logotipos y volantes comerciales.",
          actionText: "Cotizar por WhatsApp",
          isWhatsapp: true,
          waMsg: "Hola Chavonauta, me interesa cotizar un trabajo de diseño gráfico digital.",
        },
        {
          title: "Programación y Sitios Web / Apps",
          badge: "Desarrollo",
          subBadge: "Páginas y Sistemas a la Medida",
          icon: Code2,
          description:
            "Desarrollamos la página web, catálogo digital o aplicación que tu negocio necesita con diseño profesional.",
          actionText: "Cotizar por WhatsApp",
          isWhatsapp: true,
          waMsg: "Hola Chavonauta, quiero cotizar el desarrollo de una página web o sistema a la medida.",
        },
        {
          title: "Descarga de Música y Canciones",
          badge: "Música en USB",
          subBadge: "Álbumes y Listas",
          icon: Music,
          description:
            "Descarga tus canciones y álbumes favoritos en tu memoria USB o celular para escuchar donde quieras.",
          actionText: "Consultar por WhatsApp",
          isWhatsapp: true,
          waMsg: "Hola Chavonauta, me gustaría consultar por la descarga de canciones en memoria.",
        },
      ];

      return (
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-navy-100 text-navy-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-navy-700" />
                <span>Nuestros Servicios en Sucursal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                {section.title}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {section.subtitle ||
                  "Atención directa en sucursal o cotiza tus trabajos de forma inmediata por WhatsApp."}
              </p>
            </div>
            <a
              href={`https://wa.me/${business.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Preguntar por cualquier otro servicio →</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cyberServices.map((srv) => {
              const IconComp = srv.icon;
              const waLink = srv.isWhatsapp
                ? `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                    srv.waMsg || "Hola Chavonauta, tengo una consulta."
                  )}`
                : srv.actionHref || "#";

              return (
                <div
                  key={srv.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 hover:border-navy-400 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-800">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2 py-0.5 rounded bg-navy-100 text-navy-900 text-[11px] font-bold">
                          {srv.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {srv.subBadge}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900">
                      {srv.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    {srv.isWhatsapp ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{srv.actionText}</span>
                      </a>
                    ) : (
                      <Link
                        href={srv.actionHref || "/catalogo"}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-navy-800 hover:text-white text-slate-800 font-semibold text-xs transition-colors"
                      >
                        <span>{srv.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 3. MOCKS DE PRODUCTOS DESTACADOS
    // ----------------------------------------------------
    case "featured_catalog": {
      const featuredProducts = items.filter((item) => item.type === "product");

      return (
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Mocks para la Demostración
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-1">
                {section.title}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {section.subtitle ||
                  "Productos de muestra basados en las categorías del cyber. El cliente los gestionará desde el panel."}
              </p>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1 text-sm font-bold text-navy-800 hover:text-navy-600 hover:underline"
            >
              <span>Ver todo el catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 8).map((product) => (
              <ItemCard key={product.id} item={product} />
            ))}
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 4. TARIFAS DE RENTA DE EQUIPOS ($7/hr y $4/media hr)
    // ----------------------------------------------------
    case "rates": {
      return (
        <section id="tarifas" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-700 bg-navy-100 px-3 py-1 rounded-full">
              Tarifas Transparentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-2">
              {section.title}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {section.subtitle ||
                "Equipos listos para trabajar, estudiar, navegar o imprimir. Personalizable desde el panel de administración."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Tarifa 1 Hora */}
            <div className="rounded-2xl border-2 border-navy-600 bg-white p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-navy-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-lg">
                Tarifa Estándar
              </div>
              <h3 className="font-heading font-black text-xl text-slate-900">
                1 Hora de Internet / PC
              </h3>
              <p className="text-slate-500 text-xs mt-1">Uso continuo de equipo en sucursal</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-navy-800">$7.00</span>
                <span className="text-slate-500 text-sm font-semibold">MXN / hora</span>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Navegación de alta velocidad en fibra óptica</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Paquetería de oficina completa (Word, Excel, PowerPoint, PDF)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Puertos USB frontales para conectar memorias y celulares</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Impresión directa desde la computadora</span>
                </li>
              </ul>
            </div>

            {/* Tarifa Media Hora */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Para consultas rápidas
              </span>
              <h3 className="font-heading font-bold text-xl text-slate-900 mt-1">
                Media Hora de Internet / PC
              </h3>
              <p className="text-slate-500 text-xs mt-1">Ideal para imprimir un archivo o trámite rápido</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">$4.00</span>
                <span className="text-slate-500 text-sm font-semibold">MXN / 30 mins</span>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Acceso completo por 30 minutos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Descarga rápida de formatos y boletos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Envío directo de documentos a impresión</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Opción a extender tu tiempo por hora</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            * El dueño del cybercafé puede ajustar estas tarifas en cualquier momento desde el panel de configuración sin tocar código.
          </p>
        </section>
      );
    }

    // ----------------------------------------------------
    // 5. UBICACIÓN Y CONTACTO
    // ----------------------------------------------------
    case "location": {
      const whatsappLocation = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
        `Hola ${business.name}, quiero saber cómo llegar a la sucursal o consultar un horario.`
      )}`;

      return (
        <section id="ubicacion" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-navy-700 bg-navy-100 px-3 py-1 rounded-full">
                  Visítanos en Sucursal
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-3">
                  {section.title}
                </h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {section.subtitle ||
                    "Estamos a tu disposición para imprimir tus tareas, realizar trámites o brindarte soporte técnico."}
                </p>

                <div className="mt-6 space-y-4 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Dirección:</strong>
                      <span>{business.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-navy-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Horarios de Atención:</strong>
                      <span>{business.schedule}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Contacto Directo:</strong>
                      <span>WhatsApp: +{business.whatsappNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={whatsappLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Escribir por WhatsApp</span>
                  </a>

                  {business.googleMapsUrl && (
                    <a
                      href={business.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-300"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Ver en Google Maps</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Tarjeta de Aviso para Envío de Archivos */}
              <div className="rounded-xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 p-6 sm:p-8 text-white border border-navy-700 shadow-xl">
                <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">
                  Tip Chavonauta 🚀
                </span>
                <h3 className="text-xl font-heading font-black mt-2">
                  ¿Llevas prisa? Envía tus archivos antes
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Para no esperar en la fila, puedes mandarnos tu documento por WhatsApp especificando cuántas copias, si es a color o blanco y negro, y pasar a recogerlo listo.
                </p>
                <div className="mt-5 pt-4 border-t border-navy-700/80 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Formatos: PDF, Word, JPG, PNG</span>
                  <span className="text-emerald-400 font-bold">Respuesta rápida</span>
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
