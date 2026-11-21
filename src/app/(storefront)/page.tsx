import type { Metadata } from "next";
import { repository } from "@/lib/data/repository";
import { resolveEffectiveTheme } from "@/lib/theme-engine";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function StorefrontHomePage() {
  const [rawTheme, items, categories] = await Promise.all([
    repository.getThemeConfig(),
    repository.getCatalogItems(),
    repository.getCategories(),
  ]);

  const theme = resolveEffectiveTheme(rawTheme);
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
