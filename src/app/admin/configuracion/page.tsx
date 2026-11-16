import React from "react";
import { repository } from "@/lib/data/repository";
import { AdminSettingsManager } from "@/components/admin/AdminSettingsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Configuración | Chavonauta Admin",
  description: "Configuración general de sucursal, horarios, redes sociales y contacto.",
};

export default async function AdminSettingsPage() {
  const theme = await repository.getThemeConfig();

  return <AdminSettingsManager initialTheme={theme} />;
}
