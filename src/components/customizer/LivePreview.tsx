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
    desktop: "w-full max-w-full",
    tablet: "w-[768px] max-w-full",
    mobile: "w-[390px] max-w-full",
  }[viewport];

  return (
    <div className="flex-1 bg-slate-100/90 p-2 sm:p-4 flex flex-col items-center justify-start overflow-hidden h-full">
      {/* Marco de Dispositivo / Ventana del Navegador */}
      <div
        className={`${viewportWidthClass} bg-white transition-all duration-300 rounded-2xl border border-slate-300 shadow-xl flex flex-col h-full overflow-hidden`}
      >
        {/* Barra de Navegador Falsa (Fija arriba, no se desplaza con el scroll) */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 select-none shrink-0 z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-md border border-slate-200 text-[11px] font-mono text-slate-600 max-w-xs truncate shadow-2xs">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">https://chavonauta.com</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>En vivo</span>
            </span>
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>Vista Previa</span>
            </div>
          </div>
        </div>

        {/* Contenido en Vivo con Variables CSS inyectadas Y ESCROLLEABLE */}
        <div
          style={{
            ...cssVars,
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            fontFamily: cssVars["--font-body"] || "var(--font-body)",
          } as React.CSSProperties}
          className="flex-1 overflow-y-auto bg-background text-foreground antialiased flex flex-col scroll-smooth select-none"
        >
          {/* Barra de navegación del escaparate */}
          <div className="pointer-events-none">
            <Navbar business={theme.business} categories={categories} />
          </div>

          {/* Secciones Modulares Escrolleables de Arriba a Abajo */}
          <main className="flex-1 pointer-events-none">
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
          <div className="pointer-events-none">
            <Footer business={theme.business} categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
