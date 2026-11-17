import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = {
  title: "Administración | Cybercafé Chavonauta",
  description: "Panel de autogestión de catálogo y diseño del Cybercafé Chavonauta.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <AdminNav />
      {/* Contenedor principal con ancho completo al estar la barra lateral oculta por defecto */}
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
