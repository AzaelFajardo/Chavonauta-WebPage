import Link from "next/link";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { ItemCard } from "@/components/storefront/ItemCard";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const [items, categories] = await Promise.all([
    repository.getCatalogItems(),
    repository.getCategories(),
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Migas de pan e información */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-navy-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">
              {currentCategory ? currentCategory.name : "Catálogo y Servicios"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            {currentCategory ? currentCategory.name : "Catálogo y Servicios Chavonauta"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentCategory
              ? currentCategory.description
              : "Explora los servicios en sucursal y artículos de muestra para la demo."}
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm self-start sm:self-auto">
          Mostrando <strong className="text-slate-900">{filteredItems.length}</strong> resultados
          {queryClean && <span> para "{queryClean}"</span>}
        </div>
      </div>

      {/* Selector de Categorías (Píldoras estilo Mercado Libre) */}
      <div className="py-5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <Link
            href="/catalogo"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              !categoria || categoria === "todas"
                ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-navy-400 hover:bg-slate-50"
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
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  active
                    ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-navy-400 hover:bg-slate-50"
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>
      </div>

      {/* Resultados */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 max-w-md mx-auto my-6">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-slate-800">
            No se encontraron resultados
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Intenta con otra palabra clave o selecciona otra categoría.
          </p>
          <Link
            href="/catalogo"
            className="inline-block mt-4 text-xs font-bold text-navy-800 hover:underline"
          >
            Restablecer filtros
          </Link>
        </div>
      )}
    </div>
  );
}
