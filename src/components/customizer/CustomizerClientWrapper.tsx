"use client";

import React, { useState, useEffect } from "react";
import { AdminCustomizerManager } from "./AdminCustomizerManager";
import { CatalogItem, Category, ThemeConfig } from "@/types";

interface CustomizerClientWrapperProps {
  initialTheme: ThemeConfig;
  items: CatalogItem[];
  categories: Category[];
}

export function CustomizerClientWrapper({
  initialTheme,
  items,
  categories,
}: CustomizerClientWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-3 border-navy-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <p className="text-sm font-bold text-slate-800">
              Cargando Personalizador Visual...
            </p>
            <p className="text-xs text-slate-400">
              Preparando motor de temas y vista previa en vivo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminCustomizerManager
      initialTheme={initialTheme}
      items={items}
      categories={categories}
    />
  );
}
