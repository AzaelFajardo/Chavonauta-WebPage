import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, ShieldCheck, Clock } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { Badge } from "@/components/ui/Badge";

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
    `Hola ${theme.business.name}, me gustaría consultar sobre el artículo "${item.name}" que vi en su catálogo web.`
  );
  const whatsappHref = `https://wa.me/${theme.business.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Botón Volver */}
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al catálogo</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-2xl border border-slate-200 p-6 sm:p-12">
        {/* Fotografía Grande */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.badges.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                {item.badges.map((b) => (
                  <Badge key={b} variant="accent">
                    {b}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Disponible en sucursal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{theme.business.schedule.split("|")[0]}</span>
            </span>
          </div>
        </div>

        {/* Información y Contacto */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-navy-800 bg-navy-50 px-2.5 py-1 rounded inline-block mb-3">
              {item.categorySlug.replace(/-/g, " ")}
            </span>

            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 leading-snug">
              {item.name}
            </h1>

            <div className="mt-5 pb-5 border-b border-slate-100">
              <span className="text-xs text-slate-400 block font-normal">
                {isService ? "Tarifa de referencia:" : "Precio en tienda:"}
              </span>
              <span className="text-3xl font-heading font-black text-slate-900">
                {item.priceLabel}
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>

            {/* Especificaciones */}
            {item.specs && item.specs.length > 0 && (
              <div className="mt-8 bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
                  Especificaciones
                </h2>
                <dl className="space-y-2 text-xs">
                  {item.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between gap-4 py-1.5 border-b border-slate-200/60 last:border-0"
                    >
                      <dt className="text-slate-500">{spec.label}</dt>
                      <dd className="font-semibold text-slate-800 text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Botón de Contacto Directo por WhatsApp */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Consultar Disponibilidad por WhatsApp</span>
            </a>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Atención directa y personalizada con el personal del cybercafé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
