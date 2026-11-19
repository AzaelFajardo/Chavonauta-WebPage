import { repository } from "@/lib/data/repository";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export default async function StorefrontHomePage() {
  const [theme, items, categories] = await Promise.all([
    repository.getThemeConfig(),
    repository.getCatalogItems(),
    repository.getCategories(),
  ]);

  const orderedSections = [...theme.sections].sort((a, b) => a.order - b.order);

  return (
    <div>
      {orderedSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          items={items}
          categories={categories}
          business={theme.business}
          themeName={theme.name}
          themePalette={theme.palette}
        />
      ))}
    </div>
  );
}
