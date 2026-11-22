import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Search, MessageCircle } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { Badge } from "@/components/ui/Badge";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}): Promise<Metadata> {
  const { categoria, q } = await searchParams;
  const [theme, categories] = await Promise.all([
    repository.getThemeConfig(),
    repository.getCategories(),
  ]);
  const currentCategory = categories.find((category) => category.slug === categoria);
  const title = currentCategory
    ? `${currentCategory.name} | ${theme.business.name}`
    : `Catálogo | ${theme.business.name}`;
  const canonical = q
    ? "/catalogo"
    : currentCategory
      ? `/catalogo?categoria=${currentCategory.slug}`
      : "/catalogo";

  return {
    title,
    description: currentCategory
      ? currentCategory.description
      : `Catálogo de productos y servicios de ${theme.business.name}.`,
    alternates: { canonical },
  };
}

const ITEMS_PER_PAGE = 24;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string; page?: string }>;
}) {
  const { categoria, q, page: pageParam } = await searchParams;
  const [items, categories, theme] = await Promise.all([
    repository.getCatalogItems(),
    repository.getCategories(),
    repository.getThemeConfig(),
  ]);

  const queryClean = (q || "").trim().toLowerCase();

  let filteredItems = items;

  const isServicesCategory =
    categoria === "servicios-digitales" || categoria === "servicios-cyber";

  if (categoria && categoria !== "todas") {
    if (isServicesCategory) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.categorySlug === "servicios-digitales" ||
          item.categorySlug === "servicios-cyber" ||
          item.type === "service"
      );
    } else {
      filteredItems = filteredItems.filter(
        (item) => item.categorySlug === categoria
      );
    }
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

  const currentCategory = isServicesCategory
    ? categories.find(
        (c) => c.slug === "servicios-digitales" || c.slug === "servicios-cyber"
      ) || {
        id: "cat-servicios",
        slug: "servicios-digitales",
        name: "Servicios",
        description: "Impresiones, trámites, escaneo, enmicados y reparación de equipos.",
        icon: "Monitor",
      }
    : categories.find((c) => c.slug === categoria);

  // Ordenar categorías en la barra lateral poniendo Servicios primero y luego el resto
  const orderedCategories = [
    ...categories.filter(
      (c) => c.slug === "servicios-digitales" || c.slug === "servicios-cyber"
    ),
    ...categories.filter(
      (c) => c.slug !== "servicios-digitales" && c.slug !== "servicios-cyber"
    ),
  ];

  const requestedPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const buildPageHref = (page: number): string => {
    const params = new URLSearchParams();
    if (categoria && categoria !== "todas") params.set("categoria", categoria);
    if (queryClean) params.set("q", queryClean);
    if (page > 1) params.set("page", String(page));
    const queryString = params.toString();
    return `/catalogo${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
      {/* Barra superior compacta de resultados */}
      <div
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
          borderRadius: "var(--radius)",
        }}
        className="px-3.5 py-2.5 sm:p-4 border shadow-xs mb-2.5 sm:mb-4 flex items-center justify-between gap-2 text-xs transition-colors"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 opacity-80 min-w-0">
          <Link
            href="/"
            style={{ color: "var(--primary)" }}
            className="hover:underline flex items-center gap-1 font-semibold shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span
            className="font-bold opacity-100 truncate"
            style={{ color: "var(--card-foreground)" }}
          >
            {currentCategory ? currentCategory.name : "Catálogo"}
          </span>
        </div>

        <div className="opacity-80 font-medium shrink-0 text-[11px] sm:text-xs">
          <strong className="opacity-100" style={{ color: "var(--card-foreground)" }}>
            {totalItems}
          </strong>{" "}
          resultados
          {queryClean && <span className="hidden sm:inline"> para &quot;{queryClean}&quot;</span>}
        </div>
      </div>

      {/* Selector horizontal rápido de categorías en Celular y Tablet (oculta la lista vertical gigante) */}
      <div className="lg:hidden mb-3 -mx-3 px-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 pb-1">
          <Link
            href="/catalogo"
            style={
              !categoria || categoria === "todas"
                ? {
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    borderRadius: "var(--radius)",
                  }
                : {
                    backgroundColor: "var(--card)",
                    color: "var(--card-foreground)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                  }
            }
            className={`px-3 py-1.5 text-xs whitespace-nowrap shrink-0 transition-all ${
              !categoria || categoria === "todas"
                ? "font-bold shadow-xs"
                : "border opacity-85 hover:opacity-100"
            }`}
          >
            Todos
          </Link>

          {orderedCategories.map((cat) => {
            const isCatServices =
              cat.slug === "servicios-digitales" ||
              cat.slug === "servicios-cyber";
            const active = isCatServices
              ? isServicesCategory
              : categoria === cat.slug;
            const targetSlug = isCatServices ? "servicios-digitales" : cat.slug;
            const displayName = isCatServices ? "Servicios" : cat.name;

            return (
              <Link
                key={`mobile-pill-${cat.id}`}
                href={`/catalogo?categoria=${targetSlug}`}
                style={
                  active
                    ? {
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                        borderRadius: "var(--radius)",
                      }
                    : {
                        backgroundColor: "var(--card)",
                        color: "var(--card-foreground)",
                        borderColor: "var(--border)",
                        borderRadius: "var(--radius)",
                      }
                }
                className={`px-3 py-1.5 text-xs whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? "font-bold shadow-xs"
                    : "border opacity-85 hover:opacity-100"
                }`}
              >
                {displayName}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Barra lateral de departamentos (solo en Escritorio >= lg) */}
        <aside
          style={{
            backgroundColor: "var(--card)",
            color: "var(--card-foreground)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
          }}
          className="hidden lg:block lg:col-span-1 p-4 border shadow-sm h-fit transition-colors"
        >
          <h3
            style={{ borderColor: "var(--border)" }}
            className="font-bold text-sm mb-3 pb-2 border-b"
          >
            Departamentos
          </h3>
          <ul className="space-y-1 text-xs">
            <li>
              <Link
                href="/catalogo"
                style={{
                  backgroundColor:
                    !categoria || categoria === "todas"
                      ? "var(--primary)"
                      : "transparent",
                  color:
                    !categoria || categoria === "todas"
                      ? "var(--primary-foreground)"
                      : "inherit",
                  borderRadius: "var(--radius)",
                }}
                className={`block py-1.5 px-2.5 transition-colors ${!categoria || categoria === "todas"
                    ? "font-bold shadow-2xs"
                    : "opacity-80 hover:opacity-100 hover:bg-current/10"
                  }`}
              >
                Todos los productos
              </Link>
            </li>
            {orderedCategories.map((cat) => {
              const isCatServices =
                cat.slug === "servicios-digitales" ||
                cat.slug === "servicios-cyber";
              const active = isCatServices
                ? isServicesCategory
                : categoria === cat.slug;
              const targetSlug = isCatServices ? "servicios-digitales" : cat.slug;
              const displayName = isCatServices ? "Servicios" : cat.name;
              return (
                <li key={cat.id}>
                  <Link
                    href={`/catalogo?categoria=${targetSlug}`}
                    style={{
                      backgroundColor: active ? "var(--primary)" : "transparent",
                      color: active ? "var(--primary-foreground)" : "inherit",
                      borderRadius: "var(--radius)",
                    }}
                    className={`block py-1.5 px-2.5 transition-colors ${active
                        ? "font-bold shadow-2xs"
                        : "opacity-80 hover:opacity-100 hover:bg-current/10"
                      }`}
                  >
                    {displayName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Grilla de Productos: Tarjetas horizontales compactas tipo MercadoLibre/Amazon en celular y verticales en tablet/PC */}
        <main className="lg:col-span-4">
          {pagedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-4 xl:gap-5">
              {pagedItems.map((item) => {
                const waLink = `https://wa.me/${theme.business.whatsappNumber}?text=${encodeURIComponent(
                  `Hola Chavonauta, me interesa consultar el artículo: ${item.name}`
                )}`;
                const hasDiscount =
                  item.referencePrice !== undefined &&
                  item.promotionalPrice !== undefined &&
                  item.promotionalPrice > 0 &&
                  item.referencePrice > item.promotionalPrice;

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "var(--card)",
                      color: "var(--card-foreground)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                    }}
                    className="border p-3 sm:p-4 flex flex-row sm:flex-col justify-between gap-3.5 sm:gap-0 hover:shadow-md transition-all group overflow-hidden"
                  >
                    {/* Imagen: Miniatura cuadrada compacta a la izquierda en celular, cuadrada completa arriba en >= sm */}
                    <Link
                      href={`/item/${item.slug}`}
                      style={{ borderRadius: "var(--radius)" }}
                      className="relative block w-28 h-28 sm:w-full sm:h-auto sm:aspect-square shrink-0 overflow-hidden bg-muted/30 sm:mb-3 self-center sm:self-auto"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.badges.length > 0 && (
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                          <Badge variant="accent">
                            {item.badges[0]}
                          </Badge>
                        </div>
                      )}
                    </Link>

                    {/* Columna Derecha en celular / Cuerpo inferior en escritorio */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Categoría */}
                        <div className="text-[10px] opacity-60 uppercase tracking-wider mb-0.5 sm:mb-1 font-medium truncate">
                          {item.categorySlug === "servicios-digitales" ||
                          item.categorySlug === "servicios-cyber" ||
                          item.type === "service"
                            ? "Servicios"
                            : categories.find((c) => c.slug === item.categorySlug)?.name ||
                              item.categorySlug.replace(/-/g, " ")}
                        </div>

                        {/* Título */}
                        <Link href={`/item/${item.slug}`}>
                          <h2
                            style={{ color: "var(--card-foreground)" }}
                            className="font-heading font-semibold sm:font-medium text-xs sm:text-sm line-clamp-2 hover:underline transition-colors leading-snug"
                          >
                            {item.name}
                          </h2>
                        </Link>

                        {/* Descripción breve visible en celular estilo app de compras */}
                        {item.shortDescription && (
                          <p className="sm:hidden text-[11px] opacity-70 line-clamp-1 mt-0.5">
                            {item.shortDescription}
                          </p>
                        )}

                        {/* Precio */}
                        <div className="mt-1.5 sm:mt-2">
                          {hasDiscount && (
                            <span className="block text-[11px] line-through opacity-50 leading-none mb-0.5">
                              ${item.referencePrice?.toFixed(2)} MXN
                            </span>
                          )}
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span
                              style={{ color: "var(--card-foreground)" }}
                              className="text-base sm:text-xl font-bold leading-tight"
                            >
                              {item.priceLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botón WhatsApp */}
                      <div
                        style={{ borderColor: "var(--border)" }}
                        className="mt-2.5 sm:mt-4 sm:pt-3 sm:border-t flex flex-col gap-1.5"
                      >
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                            borderRadius: "var(--radius)",
                          }}
                          className="flex items-center justify-center gap-1.5 w-full py-1.5 sm:py-2 px-2.5 sm:px-3 text-[11px] sm:text-xs font-semibold shadow-2xs transition-opacity hover:opacity-90"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">Consultar por WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "var(--card)",
                color: "var(--card-foreground)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
              }}
              className="p-12 text-center border shadow-xs"
            >
              <Search className="w-10 h-10 opacity-40 mx-auto mb-3" />
              <h3 className="font-bold text-base">
                No se encontraron resultados
              </h3>
              <p className="text-xs opacity-75 mt-1">
                Verifica la ortografía o intenta buscar en otro departamento.
              </p>
              <Link
                href="/catalogo"
                style={{ color: "var(--primary)" }}
                className="inline-block mt-4 text-xs font-bold hover:underline"
              >
                Ver todos los productos
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              {currentPage > 1 && (
                <Link
                  href={buildPageHref(currentPage - 1)}
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--card-foreground)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                  className="px-3 py-2 border font-semibold hover:opacity-80 transition-opacity"
                >
                  Anterior
                </Link>
              )}

              <span
                style={{ color: "var(--card-foreground)" }}
                className="px-2 font-semibold"
              >
                Página {currentPage} de {totalPages}
              </span>

              {currentPage < totalPages && (
                <Link
                  href={buildPageHref(currentPage + 1)}
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    borderRadius: "var(--radius)",
                  }}
                  className="px-3 py-2 font-semibold hover:opacity-90 transition-opacity"
                >
                  Siguiente
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
