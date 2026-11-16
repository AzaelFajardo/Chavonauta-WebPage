import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { ItemCard } from "@/components/storefront/ItemCard";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const [items, categories, theme] = await Promise.all([
    repository.getCatalogItems(),
    repository.getCategories(),
    repository.getThemeConfig(),
  ]);

  const queryClean = (q || "").trim().toLowerCase();

  let filteredItems = items;

  if (categoria && categoria !== "todas") {
    filteredItems = filteredItems.filter(
      (item) => item.categorySlug === categoria
    );
  }

  if (queryClean) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(queryClean) ||
        item.shortDescription.toLowerCase().includes(queryClean) ||
        item.description.toLowerCase().includes(queryClean) ||
        item.categorySlug.toLowerCase().includes(queryClean)
    );
  }

  const currentCategory = categories.find((c) => c.slug === categoria);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Encabezado de página */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-800 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Catálogo</span>
          </div>

          <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
            {currentCategory ? currentCategory.name : "Todos los Productos y Servicios"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentCategory
              ? currentCategory.description
              : "Consulta nuestro catálogo en tienda. Contacta directo por WhatsApp para disponibilidad."}
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 self-start sm:self-auto">
          {filteredItems.length} {filteredItems.length === 1 ? "artículo" : "artículos"}
          {queryClean && <span> para "{queryClean}"</span>}
        </div>
      </div>

      {/* Píldoras de categoría minimalistas */}
      <div className="py-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <Link
            href="/catalogo"
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              !categoria || categoria === "todas"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Todos ({items.length})
          </Link>

          {categories.map((cat) => {
            const count = items.filter((i) => i.categorySlug === cat.slug).length;
            const active = categoria === cat.slug;

            return (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.slug}`}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid de Artículos */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              whatsappNumber={theme.business.whatsappNumber}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 p-8 max-w-md mx-auto my-8">
          <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-base text-slate-800">
            No se encontraron artículos
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Intenta con otra palabra clave o restablece los filtros.
          </p>
          <Link
            href="/catalogo"
            className="inline-block mt-4 text-xs font-semibold text-navy-800 hover:underline"
          >
            Ver todos los productos
          </Link>
        </div>
      )}
    </div>
  );
}
