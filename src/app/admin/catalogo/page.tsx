import React from "react";
import { repository } from "@/lib/data/repository";
import { requireAdminPage } from "@/lib/auth/require-admin-page";
import { AdminCatalogManager } from "@/components/admin/AdminCatalogManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Gestión de Catálogo | Chavonauta Admin",
  description: "Crea, edita y administra productos y servicios de Chavonauta.",
};

export default async function AdminCatalogPage() {
  await requireAdminPage("/admin/catalogo");

  const [categories, items] = await Promise.all([
    repository.getCategories(),
    repository.getCatalogItems({ includeInactive: true }),
  ]);

  return <AdminCatalogManager initialItems={items} categories={categories} />;
}
