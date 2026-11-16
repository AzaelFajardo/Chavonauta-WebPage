import Link from "next/link";
import { CatalogItem } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface ItemCardProps {
  item: CatalogItem;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      href={`/item/${item.slug}`}
      className="group block rounded-theme border border-border bg-card text-card-foreground overflow-hidden hover:border-primary transition-all"
    >
      <div className="aspect-video w-full bg-muted relative overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {item.badges.map((badge) => (
              <Badge key={badge} variant="accent">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {item.type === "service" ? "Servicio" : "Producto"}
          </span>
          <span className="text-sm font-bold text-primary">{item.priceLabel}</span>
        </div>
        <h3 className="font-heading font-semibold text-base group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {item.shortDescription}
        </p>
      </div>
    </Link>
  );
}
