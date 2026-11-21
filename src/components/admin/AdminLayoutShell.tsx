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
        <main className="flex-1 p-3 sm:p-5 lg:py-6 lg:pl-24 lg:pr-8 xl:px-24 2xl:px-16 max-w-[1760px] 2xl:max-w-[1880px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
