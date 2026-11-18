import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = {
  title: "Administración | Chavonauta",
  description: "Panel de autogestión de catálogo y diseño de Chavonauta.",
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
        <main className="flex-1 p-2 sm:p-4 lg:p-5 max-w-[1750px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
