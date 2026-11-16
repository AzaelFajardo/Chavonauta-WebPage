import Link from "next/link";
import { ArrowLeft, Search, MessageCircle } from "lucide-react";
import { repository } from "@/lib/data/repository";

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
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {/* Barra superior de resultados */}
      <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <Link href="/" className="hover:text-[#c7511f] flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#0f1111] font-bold">
            {currentCategory ? currentCategory.name : "Catálogo y Departamentos"}
          </span>
        </div>

        <div className="text-slate-600 font-medium">
          <strong className="text-[#0f1111]">{filteredItems.length}</strong> resultados
          {queryClean && <span> para "{queryClean}"</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Barra lateral de departamentos (Estilo Amazon Sidebar) */}
        <aside className="lg:col-span-1 bg-white p-4 rounded-sm border border-slate-200 shadow-sm h-fit">
          <h3 className="font-bold text-sm text-[#0f1111] mb-3 pb-2 border-b border-slate-200">
            Departamentos
          </h3>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link
                href="/catalogo"
                className={`block py-1 hover:text-[#c7511f] ${
                  !categoria || categoria === "todas"
                    ? "font-bold text-[#c7511f]"
                    : "text-slate-700"
                }`}
              >
                Todos los productos
              </Link>
            </li>
            {categories.map((cat) => {
              const active = categoria === cat.slug;
              return (
                <li key={cat.id}>
                  <Link
                    href={`/catalogo?categoria=${cat.slug}`}
                    className={`block py-1 hover:text-[#c7511f] ${
                      active ? "font-bold text-[#c7511f]" : "text-slate-700"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Grilla de Productos estilo Amazon */}
        <main className="lg:col-span-4">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const waLink = `https://wa.me/${theme.business.whatsappNumber}?text=${encodeURIComponent(
                  `Hola Chavonauta, me interesa consultar el artículo: ${item.name}`
                )}`;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <div>
                      {/* Imagen */}
                      <Link
                        href={`/item/${item.slug}`}
                        className="relative block aspect-square w-full overflow-hidden bg-slate-50 mb-3"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.badges.length > 0 && (
                          <span className="absolute top-2 left-2 bg-[#cc0c39] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            {item.badges[0]}
                          </span>
                        )}
                      </Link>

                      {/* Categoría */}
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                        {item.categorySlug.replace(/-/g, " ")}
                      </div>

                      {/* Título */}
                      <Link href={`/item/${item.slug}`}>
                        <h2 className="font-heading font-medium text-xs sm:text-sm text-[#0f1111] line-clamp-2 group-hover:text-[#007185] transition-colors leading-snug">
                          {item.name}
                        </h2>
                      </Link>

                      {/* Precio */}
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-base sm:text-xl font-bold text-[#0f1111]">
                          {item.priceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Botón WhatsApp estilo Amazon */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Consultar por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded p-12 text-center border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-[#0f1111] text-base">
                No se encontraron resultados
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verifica la ortografía o intenta buscar en otro departamento.
              </p>
              <Link
                href="/catalogo"
                className="inline-block mt-4 text-xs font-bold text-[#007185] hover:underline"
              >
                Ver todos los productos
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
