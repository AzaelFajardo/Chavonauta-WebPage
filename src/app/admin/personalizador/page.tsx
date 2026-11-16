import React from "react";
import { repository } from "@/lib/data/repository";
import { AdminCustomizerManager } from "@/components/customizer/AdminCustomizerManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Personalizador Visual | Chavonauta Admin",
  description: "Personaliza la identidad, colores y bloques del escaparate digital.",
};

export default async function AdminCustomizerPage() {
  const [theme, items, categories] = await Promise.all([
    repository.getThemeConfig(),
    repository.getCatalogItems({ includeInactive: false }),
    repository.getCategories(),
  ]);

  return (
    <AdminCustomizerManager
      initialTheme={theme}
      items={items}
      categories={categories}
    />
  );
}
