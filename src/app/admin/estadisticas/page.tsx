import React from "react";
import { repository } from "@/lib/data/repository";
import { AdminStatsManager } from "@/components/admin/AdminStatsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Estadísticas | Chavonauta Admin",
  description:
    "Métricas de interés, consultas de WhatsApp y búsquedas en el catálogo de Cybercafé Chavonauta.",
};

export default async function AdminStatsPage() {
  const stats = await repository.getAnalytics();

  return <AdminStatsManager initialStats={stats} />;
}
