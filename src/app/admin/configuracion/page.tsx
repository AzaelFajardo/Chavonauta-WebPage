import React from "react";
import { repository } from "@/lib/data/repository";
import { requireAdminPage } from "@/lib/auth/require-admin-page";
import { AdminSettingsManager } from "@/components/admin/AdminSettingsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Configuración | Chavonauta Admin",
  description: "Configuración general de sucursal, horarios, redes sociales y contacto.",
};

export default async function AdminSettingsPage() {
  await requireAdminPage("/admin/configuracion");

  const theme = await repository.getThemeConfig();

  return <AdminSettingsManager initialTheme={theme} />;
}
