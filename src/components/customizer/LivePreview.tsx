"use client";

import React, { useMemo } from "react";
import { CatalogItem, Category, ThemeConfig } from "@/types";
import { themeToCssVars } from "@/lib/theme-engine";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Globe, Lock } from "lucide-react";

interface LivePreviewProps {
  theme: ThemeConfig;
  items: CatalogItem[];
  categories: Category[];
  viewport: "desktop" | "tablet" | "mobile";
}

export function LivePreview({
  theme,
  items,
  categories,
  viewport,
}: LivePreviewProps) {
  const cssVars = useMemo(() => themeToCssVars(theme), [theme]);

  const orderedSections = useMemo(() => {
    return [...theme.sections].sort((a, b) => a.order - b.order);
  }, [theme.sections]);

  const viewportWidthClass = {
    desktop: "w-full",
    tablet: "max-w-[768px] mx-auto shadow-2xl rounded-2xl border-4 border-slate-700",
    mobile: "max-w-[390px] mx-auto shadow-2xl rounded-3xl border-8 border-slate-800",
  }[viewport];

  return (
    <div className="flex-1 bg-slate-200/80 p-2 sm:p-4 overflow-y-auto flex flex-col items-center">
      {/* Marco de Dispositivo / Ventana */}
      <div
        className={`${viewportWidthClass} bg-white transition-all duration-300 overflow-hidden flex flex-col min-h-[700px] border border-slate-300 shadow-lg`}
      >
        {/* Barra de Navegador Falsa */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-md border border-slate-200 text-[11px] font-mono text-slate-600 max-w-xs truncate shadow-2xs">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>https://chavonauta.com</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vista Previa</span>
          </div>
        </div>

        {/* Contenido en Vivo con Variables CSS inyectadas */}
        <div
          style={cssVars as React.CSSProperties}
          className="flex-1 bg-background text-foreground antialiased flex flex-col font-body"
        >
          {/* Barra de navegación del escaparate */}
          <div className="pointer-events-none select-none">
            <Navbar business={theme.business} categories={categories} />
          </div>

          {/* Secciones Modulares */}
          <main className="flex-1">
            {orderedSections.map((section) => (
              <SectionRenderer
                key={`${section.id}-${section.order}`}
                section={section}
                items={items}
                categories={categories}
                business={theme.business}
              />
            ))}
          </main>

          {/* Pie de página del escaparate */}
          <div className="pointer-events-none select-none">
            <Footer business={theme.business} categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
