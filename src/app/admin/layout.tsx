import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 font-sans">
      <AdminHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Chavonauta — Panel de Autogestión (Catálogo y Personalización)
          </p>
          <p className="text-slate-400">
            Versión 1.0 • Cambios reflejados al instante en el escaparate
          </p>
        </div>
      </footer>
    </div>
  );
}
