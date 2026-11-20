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
      <div
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
          borderRadius: "var(--radius)",
        }}
        className="p-4 border shadow-sm mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
      >
        <div className="flex items-center gap-2 opacity-80">
          <Link
            href="/"
            style={{ color: "var(--primary)" }}
            className="hover:underline flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="font-bold opacity-100" style={{ color: "var(--card-foreground)" }}>
            {currentCategory ? currentCategory.name : "Catálogo y Departamentos"}
          </span>
        </div>

        <div className="opacity-80 font-medium">
          <strong className="opacity-100" style={{ color: "var(--card-foreground)" }}>
            {filteredItems.length}
          </strong>{" "}
          resultados
          {queryClean && <span> para "{queryClean}"</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Barra lateral de departamentos */}
        <aside
          style={{
            backgroundColor: "var(--card)",
            color: "var(--card-foreground)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
          }}
          className="lg:col-span-1 p-4 border shadow-sm h-fit transition-colors"
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
                className={`block py-1.5 px-2.5 transition-colors ${
                  !categoria || categoria === "todas"
                    ? "font-bold shadow-2xs"
                    : "opacity-80 hover:opacity-100 hover:bg-current/10"
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
                    style={{
                      backgroundColor: active ? "var(--primary)" : "transparent",
                      color: active ? "var(--primary-foreground)" : "inherit",
                      borderRadius: "var(--radius)",
                    }}
                    className={`block py-1.5 px-2.5 transition-colors ${
                      active
                        ? "font-bold shadow-2xs"
                        : "opacity-80 hover:opacity-100 hover:bg-current/10"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Grilla de Productos */}
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
                    style={{
                      backgroundColor: "var(--card)",
                      color: "var(--card-foreground)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                    }}
                    className="border p-4 flex flex-col justify-between hover:shadow-md transition-all group overflow-hidden"
                  >
                    <div>
                      {/* Imagen */}
                      <Link
                        href={`/item/${item.slug}`}
                        style={{ borderRadius: "var(--radius)" }}
                        className="relative block aspect-square w-full overflow-hidden bg-muted/30 mb-3"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.badges.length > 0 && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="accent">
                              {item.badges[0]}
                            </Badge>
                          </div>
                        )}
                      </Link>

                      {/* Categoría */}
                      <div className="text-[10px] opacity-60 uppercase tracking-wider mb-1 font-medium">
                        {item.categorySlug.replace(/-/g, " ")}
                      </div>

                      {/* Título */}
                      <Link href={`/item/${item.slug}`}>
                        <h2
                          style={{ color: "var(--card-foreground)" }}
                          className="font-heading font-medium text-xs sm:text-sm line-clamp-2 hover:underline transition-colors leading-snug"
                        >
                          {item.name}
                        </h2>
                      </Link>

                      {/* Precio */}
                      <div className="mt-2 flex items-baseline gap-1">
                        <span
                          style={{ color: "var(--card-foreground)" }}
                          className="text-base sm:text-xl font-bold"
                        >
                          {item.priceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Botón WhatsApp */}
                    <div
                      style={{ borderColor: "var(--border)" }}
                      className="mt-4 pt-3 border-t flex flex-col gap-1.5"
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
                        className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold shadow-2xs transition-opacity hover:opacity-90"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Consultar por WhatsApp</span>
                      </a>
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
        </main>
      </div>
    </div>
  );
}
