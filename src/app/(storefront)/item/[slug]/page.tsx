import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, MapPin, ShieldCheck, Check } from "lucide-react";
import { repository } from "@/lib/data/repository";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, theme] = await Promise.all([
    repository.getCatalogItemBySlug(slug),
    repository.getThemeConfig(),
  ]);

  if (!item) {
    notFound();
  }

  const isService = item.type === "service";

  const whatsappMessage = encodeURIComponent(
    `Hola ${theme.business.name}, me interesa información sobre "${item.name}" que vi en su catálogo web.`
  );
  const whatsappHref = `https://wa.me/${theme.business.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {/* Migas de pan */}
      <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-navy-900">
          Inicio
        </Link>
        <span>›</span>
        <Link href="/catalogo" className="hover:text-navy-900">
          Catálogo
        </Link>
        <span>›</span>
        <Link
          href={`/catalogo?categoria=${item.categorySlug}`}
          className="hover:text-navy-900"
        >
          {item.categorySlug.replace(/-/g, " ")}
        </Link>
        <span>›</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {item.name}
        </span>
      </div>

      {/* Contenedor Principal (3 columnas en desktop) */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Imagen Grande del Producto */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full aspect-square max-w-[480px] bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center p-4 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-3 text-center">
            Pasa el cursor sobre la imagen para ampliar
          </span>
        </div>

        {/* Columna Central: Información y Descripción */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="text-xs text-navy-800 font-semibold mb-1">
              Marca / Sucursal: {theme.business.name}
            </div>

            <h1 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 leading-snug">
              {item.name}
            </h1>

            <div className="mt-3 pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-500 block">
                {isService ? "Modalidad de cobro:" : "Precio en mostrador:"}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {item.priceLabel}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="font-bold text-sm text-slate-900 mb-2">
                Acerca de este artículo
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Tabla de especificaciones */}
            {item.specs && item.specs.length > 0 && (
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="font-bold text-xs text-slate-900 mb-2 uppercase tracking-wider">
                  Detalles técnicos
                </h3>
                <dl className="space-y-1.5 text-xs">
                  {item.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100"
                    >
                      <dt className="text-slate-500 font-semibold">{spec.label}</dt>
                      <dd className="col-span-2 text-slate-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Caja de Contacto */}
        <div className="lg:col-span-3">
          <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 shadow-xs">
            <div className="text-xl font-bold text-slate-900 mb-2">
              {item.priceLabel}
            </div>

            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 mb-3">
              <Check className="w-4 h-4" />
              <span>Disponible en mostrador</span>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 mb-4">
              <div>
                <span className="text-slate-400">Atención:</span>{" "}
                <span className="font-semibold text-slate-800">Directa en sucursal</span>
              </div>
              <div>
                <span className="text-slate-400">Vendido por:</span>{" "}
                <span className="font-semibold text-navy-800">{theme.business.name}</span>
              </div>
            </div>

            {/* Botón en navy-800 para Contactar por WhatsApp */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs shadow-sm transition-colors mb-2 text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Consultar por WhatsApp</span>
            </a>

            <div className="border-t border-slate-200 pt-3 mt-3 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Atención en horario de sucursal</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{theme.business.address}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
