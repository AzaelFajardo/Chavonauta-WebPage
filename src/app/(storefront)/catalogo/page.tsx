import Link from "next/link";
import { repository } from "@/lib/data/repository";
import { ItemCard } from "@/components/storefront/ItemCard";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [items, categories] = await Promise.all([
    repository.getCatalogItems(),
    repository.getCategories(),
  ]);

  const filteredItems = categoria
    ? items.filter((item) => item.categorySlug === categoria)
    : items;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Catálogo de Productos y Servicios</h1>
        <p className="text-muted-foreground mt-1">
          Consulta todos los servicios y productos disponibles en sucursal.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/catalogo"
          className={`px-4 py-2 text-sm rounded-theme border transition-colors ${
            !categoria
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-card-foreground border-border hover:border-primary"
          }`}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalogo?categoria=${cat.slug}`}
            className={`px-4 py-2 text-sm rounded-theme border transition-colors ${
              categoria === cat.slug
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border hover:border-primary"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
