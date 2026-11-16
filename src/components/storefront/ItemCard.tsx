import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { CatalogItem } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface ItemCardProps {
  item: CatalogItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const isService = item.type === "service";

  return (
    <div className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-3 sm:p-4 text-slate-800 hover:border-navy-400 hover:shadow-lg transition-all duration-200">
      <div>
        {/* Contenedor de Imagen con Insignias */}
        <Link
          href={`/item/${item.slug}`}
          className="relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-100"
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges superiores estilo Tiendanube / Mercado Libre */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
            {isService ? (
              <Badge variant="accent">Servicio</Badge>
            ) : (
              <Badge variant="secondary">Producto</Badge>
            )}

            {item.badges.map((badge) => {
              if (badge === "Oferta") {
                return (
                  <Badge key={badge} variant="danger">
                    Oferta
                  </Badge>
                );
              }
              if (badge === "Nuevo") {
                return (
                  <Badge key={badge} variant="success">
                    Nuevo
                  </Badge>
                );
              }
              if (badge === "Popular") {
                return (
                  <Badge key={badge} variant="warning">
                    Popular
                  </Badge>
                );
              }
              return (
                <Badge key={badge} variant="primary">
                  {badge}
                </Badge>
              );
            })}
          </div>
        </Link>

        {/* Información del Artículo */}
        <div className="pt-3">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
            {item.categorySlug.replace(/-/g, " ")}
          </div>

          <Link href={`/item/${item.slug}`}>
            <h3 className="font-heading font-semibold text-sm sm:text-base text-slate-900 line-clamp-2 group-hover:text-navy-600 transition-colors">
              {item.name}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.shortDescription}
          </p>
        </div>
      </div>

      {/* Precio y Acción */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400">
            {isService ? "Modalidad:" : "Precio de mostrador:"}
          </span>
          <span
            className={`font-heading font-extrabold text-sm sm:text-base ${
              isService ? "text-navy-800" : "text-emerald-700"
            }`}
          >
            {item.priceLabel}
          </span>
        </div>

        <Link
          href={`/item/${item.slug}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-100 hover:bg-navy-800 hover:text-white text-slate-700 text-xs font-semibold transition-colors"
        >
          <span>Ver detalle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
