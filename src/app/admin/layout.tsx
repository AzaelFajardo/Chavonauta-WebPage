import React from "react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

export const metadata = {
  title: "Administración | Chavonauta",
  description: "Panel de autogestión de catálogo y diseño de Chavonauta.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
