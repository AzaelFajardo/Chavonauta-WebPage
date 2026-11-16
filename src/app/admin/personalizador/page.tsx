import React from "react";
import dynamic from "next/dynamic";
import { repository } from "@/lib/data/repository";

export const revalidate = 0;

export const metadata = {
  title: "Personalizador Visual | Chavonauta Admin",
  description: "Personaliza la identidad, colores y bloques del escaparate digital.",
};

const AdminCustomizerManager = dynamic(
  () =>
    import("@/components/customizer/AdminCustomizerManager").then(
      (mod) => mod.AdminCustomizerManager
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-3 border-navy-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <p className="text-sm font-bold text-slate-800">
              Cargando Personalizador Visual...
            </p>
            <p className="text-xs text-slate-400">
              Preparando motor de temas y vista previa en vivo
            </p>
          </div>
        </div>
      </div>
    ),
  }
);

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
