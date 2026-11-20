import React from "react";
import { requireAdminPage } from "@/lib/auth/require-admin-page";
import { AdminSecurityManager } from "@/components/admin/AdminSecurityManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Seguridad y Acceso | Chavonauta Admin",
  description: "Administra la lista blanca de correos y la contraseña de acceso.",
};

export default async function AdminSecurityPage() {
  await requireAdminPage("/admin/seguridad");

  return <AdminSecurityManager />;
}
