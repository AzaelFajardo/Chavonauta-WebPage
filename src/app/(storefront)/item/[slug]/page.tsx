import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
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
    `Hola ${theme.business.name}, me interesa información sobre "${item.name}" que vi en su página web.`
  );
  const whatsappHref = `https://wa.me/${theme.business.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botón Volver */}
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al catálogo</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        {/* Imagen del Producto / Servicio */}
        <div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              <Badge variant={isService ? "accent" : "secondary"}>
                {isService ? "Servicio en Sucursal" : "Producto en Mostrador"}
              </Badge>
              {item.badges.map((b) => (
                <Badge
                  key={b}
                  variant={
                    b === "Oferta"
                      ? "danger"
                      : b === "Nuevo"
                      ? "success"
                      : b === "Popular"
                      ? "warning"
                      : "primary"
                  }
                >
                  {b}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantía y atención en sucursal</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-navy-600" />
              <span>{theme.business.schedule.split("|")[0]}</span>
            </span>
          </div>
        </div>

        {/* Detalles e Información */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-navy-700 bg-navy-50 px-2.5 py-1 rounded border border-navy-100 inline-block mb-2">
              {item.categorySlug.replace(/-/g, " ")}
            </span>

            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 leading-snug">
              {item.name}
            </h1>

            <div className="mt-4 pb-4 border-b border-slate-100">
              <span className="text-xs text-slate-400 block">
                {isService ? "Modalidad / Tarifa:" : "Precio de mostrador:"}
              </span>
              <span className="text-3xl font-heading font-black text-navy-800">
                {item.priceLabel}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>

            {/* Especificaciones / Puntos Clave */}
            {item.specs && item.specs.length > 0 && (
              <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-navy-600" />
                  <span>Detalles del servicio o producto</span>
                </h2>
                <dl className="space-y-2 text-xs">
                  {item.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between gap-4 py-1 border-b border-slate-200/60 last:border-0"
                    >
                      <dt className="text-slate-500 font-medium">{spec.label}</dt>
                      <dd className="font-bold text-slate-800 text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* CTA de Contacto Directo */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-sm transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {isService
                  ? "Consultar o Cotizar por WhatsApp"
                  : "Consultar Disponibilidad por WhatsApp"}
              </span>
            </a>

            <p className="text-[11px] text-center text-slate-400">
              Respuesta directa del equipo de Cybercafé Chavonauta sin intermediarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
