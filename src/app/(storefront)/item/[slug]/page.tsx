import Link from "next/link";
import { notFound } from "next/navigation";
import { repository } from "@/lib/data/repository";
import { Badge } from "@/components/ui/Badge";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await repository.getCatalogItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/catalogo"
        className="text-sm text-primary hover:underline inline-block mb-6"
      >
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-theme border border-border bg-card p-6 sm:p-8">
        <div className="aspect-video md:aspect-square rounded-theme overflow-hidden bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">
                {item.type === "service" ? "Servicio en Sucursal" : "Producto en Sucursal"}
              </Badge>
              {item.badges.map((badge) => (
                <Badge key={badge} variant="accent">
                  {badge}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold">{item.name}</h1>
            <p className="text-2xl font-extrabold text-primary mt-3">{item.priceLabel}</p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {item.description}
            </p>

            {item.specs && item.specs.length > 0 && (
              <div className="mt-6 border-t border-border pt-4">
                <h2 className="text-sm font-semibold mb-3">Detalles e Información:</h2>
                <dl className="space-y-2 text-sm">
                  {item.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{spec.label}</dt>
                      <dd className="font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
