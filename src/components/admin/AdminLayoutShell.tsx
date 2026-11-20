"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Si estamos en la pantalla de login, no renderizar barra lateral, menús ni contenedores del dashboard
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <AdminNav />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-2 sm:p-4 lg:p-5 max-w-[1750px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
