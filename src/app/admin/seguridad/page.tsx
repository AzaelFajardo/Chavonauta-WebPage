import React from "react";
import { AdminSecurityManager } from "@/components/admin/AdminSecurityManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Seguridad y Acceso | Chavonauta Admin",
  description: "Administra la lista blanca de correos y la contraseña de acceso.",
};

export default function AdminSecurityPage() {
  return <AdminSecurityManager />;
}
