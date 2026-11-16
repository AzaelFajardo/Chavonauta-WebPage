import Link from "next/link";
import { BusinessInfo, CatalogItem, Category, SectionBlock } from "@/types";
import { ItemCard } from "@/components/storefront/ItemCard";

interface SectionRendererProps {
  section: SectionBlock;
  items: CatalogItem[];
  categories: Category[];
  business: BusinessInfo;
}

export function SectionRenderer({
  section,
  items,
  categories,
  business,
}: SectionRendererProps) {
  if (!section.enabled) return null;

  switch (section.type) {
    case "hero":
      return (
        <section className="py-16 md:py-24 px-4 border-b border-border bg-gradient-to-b from-secondary/40 to-background">
          <div className="max-w-5xl mx-auto text-center">
            {Boolean(section.content.badgeText) && (
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-theme bg-secondary text-accent border border-border">
                {String(section.content.badgeText)}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
              {section.title}
            </h1>
            {section.subtitle && (
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {section.subtitle}
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={String(section.content.primaryCtaHref || "/catalogo")}
                className="px-6 py-3 rounded-theme bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                {String(section.content.primaryCtaText || "Ver Catálogo")}
              </Link>
              <Link
                href={String(section.content.secondaryCtaHref || "#tarifas")}
                className="px-6 py-3 rounded-theme bg-secondary text-secondary-foreground border border-border font-semibold hover:border-primary transition-colors"
              >
                {String(section.content.secondaryCtaText || "Conocer Más")}
              </Link>
            </div>
          </div>
        </section>
      );

    case "services":
      return (
        <section className="py-14 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold">{section.title}</h2>
            {section.subtitle && (
              <p className="text-muted-foreground mt-2">{section.subtitle}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.slug}`}
                className="p-5 rounded-theme border border-border bg-card hover:border-primary transition-colors"
              >
                <h3 className="font-heading font-semibold text-base text-primary">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>
      );

    case "featured_catalog":
      return (
        <section className="py-14 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">{section.title}</h2>
              {section.subtitle && (
                <p className="text-muted-foreground mt-1">{section.subtitle}</p>
              )}
            </div>
            <Link
              href="/catalogo"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver todo el catálogo →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items
              .filter((item) => item.featured)
              .slice(0, Number(section.content.maxItems) || 6)
              .map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
          </div>
        </section>
      );

    case "rates": {
      const plans =
        (section.content.plans as {
          name: string;
          price: string;
          features: string[];
        }[]) || [];
      return (
        <section id="tarifas" className="py-14 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold">{section.title}</h2>
            {section.subtitle && (
              <p className="text-muted-foreground mt-2">{section.subtitle}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="p-6 rounded-theme border border-border bg-card flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
                  <p className="text-2xl font-extrabold text-primary mt-2">{plan.price}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feat) => (
                      <li key={feat}>• {feat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "location":
      return (
        <section id="ubicacion" className="py-14 px-4 max-w-5xl mx-auto">
          <div className="p-8 rounded-theme border border-border bg-card text-center">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold">{section.title}</h2>
            {section.subtitle && (
              <p className="text-muted-foreground mt-2">{section.subtitle}</p>
            )}
            <div className="mt-6 space-y-2 text-sm">
              <p>
                <strong>Dirección:</strong> {business.address}
              </p>
              <p>
                <strong>Horarios:</strong> {business.schedule}
              </p>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
