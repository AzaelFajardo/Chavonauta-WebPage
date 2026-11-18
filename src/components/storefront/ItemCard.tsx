import Link from "next/link";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { CatalogItem } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface ItemCardProps {
  item: CatalogItem;
  whatsappNumber?: string;
}

export function ItemCard({ item, whatsappNumber = "5215500000000" }: ItemCardProps) {
  const isService = item.type === "service";

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola Chavonauta, me interesa consultar la disponibilidad del artículo: ${item.name}`
  )}`;

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        borderRadius: "var(--radius)",
      }}
      className="group flex flex-col justify-between border overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <div>
        {/* Fotografía Grande y Elegante */}
        <Link
          href={`/item/${item.slug}`}
          className="relative block aspect-square w-full overflow-hidden bg-muted/30"
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {item.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              {item.badges.map((badge) => (
                <Badge key={badge} variant="accent">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </Link>

        {/* Información del Producto */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-medium uppercase tracking-wider opacity-60 mb-1.5">
            {item.categorySlug.replace(/-/g, " ")}
          </div>

          <Link href={`/item/${item.slug}`}>
            <h3
              className="font-heading font-semibold text-sm sm:text-base leading-snug line-clamp-2 transition-colors hover:underline"
              style={{ color: "var(--card-foreground)" }}
            >
              {item.name}
            </h3>
          </Link>

          <p className="mt-1.5 text-xs opacity-75 line-clamp-2 leading-relaxed">
            {item.shortDescription}
          </p>
        </div>
      </div>

      {/* Precio y Botón de Contacto */}
      <div className="p-4 sm:p-5 pt-0 border-t border-border/60 flex items-center justify-between gap-3 mt-2">
        <div>
          <span className="text-[11px] opacity-70 block font-normal">
            {isService ? "Tarifa:" : "Precio:"}
          </span>
          <span
            className="font-heading font-bold text-base sm:text-lg"
            style={{ color: "var(--card-foreground)" }}
          >
            {item.priceLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="p-2 border hover:bg-current/10 transition-colors"
            title="Consultar por WhatsApp"
            aria-label="Consultar por WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
          </a>

          <Link
            href={`/item/${item.slug}`}
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "var(--radius)",
            }}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
          >
            <span>Ver</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
