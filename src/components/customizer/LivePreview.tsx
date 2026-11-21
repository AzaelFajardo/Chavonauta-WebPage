"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CatalogItem, Category, ThemeConfig } from "@/types";
import { resolveEffectiveTheme, themeToCssVars } from "@/lib/theme-engine";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Globe, Lock, Wifi, Battery } from "lucide-react";

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
  const effectiveTheme = useMemo(() => resolveEffectiveTheme(theme), [theme]);
  const cssVars = useMemo(() => themeToCssVars(effectiveTheme), [effectiveTheme]);

  const orderedSections = useMemo(() => {
    return [...effectiveTheme.sections].sort((a, b) => a.order - b.order);
  }, [effectiveTheme.sections]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupIframe = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // Inicializar documento base del iframe si aún no tiene el contenedor
        if (!doc.getElementById("preview-root")) {
          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html lang="es" class="h-full">
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=DM+Sans:wght@400;500;700&family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800&family=Orbitron:wght@500;700;900&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    min-height: 100%;
                    overflow-x: hidden;
                  }
                  body {
                    -webkit-font-smoothing: antialiased;
                  }
                  /* Scrollbar limpio y elegante para la vista previa */
                  ::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                  }
                  ::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  ::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.25);
                    border-radius: 9999px;
                  }
                  ::-webkit-scrollbar-thumb:hover {
                    background: rgba(100, 116, 139, 0.45);
                  }
                </style>
              </head>
              <body class="min-h-full antialiased flex flex-col bg-background text-foreground select-none">
                <div id="preview-root" class="min-h-full flex flex-col flex-1"></div>
              </body>
            </html>
          `);
          doc.close();
        }

        // Clonar y sincronizar todas las hojas de estilo del documento padre al iframe
        const syncStyles = () => {
          if (!doc.head) return;
          const existingClones = doc.head.querySelectorAll("[data-preview-style]");
          existingClones.forEach((el) => el.remove());

          const styles = document.querySelectorAll("link[rel='stylesheet'], style");
          styles.forEach((styleTag) => {
            try {
              const clone = styleTag.cloneNode(true) as HTMLElement;
              clone.setAttribute("data-preview-style", "true");
              doc.head.appendChild(clone);
            } catch {
              // Ignorar posibles excepciones de dominios restringidos
            }
          });
        };

        syncStyles();

        // Observar si el documento padre inyecta nuevos estilos (Tailwind, HMR, fuentes)
        const observer = new MutationObserver(() => syncStyles());
        observer.observe(document.head, { childList: true, subtree: true });

        const root = doc.getElementById("preview-root");
        setMountNode(root);

        return () => observer.disconnect();
      } catch (err) {
        console.error("Error al inicializar iframe de vista previa:", err);
      }
    };

    if (iframe.contentDocument?.readyState === "complete") {
      setupIframe();
    } else {
      iframe.addEventListener("load", setupIframe);
      return () => iframe.removeEventListener("load", setupIframe);
    }
  }, []);

  // Inyectar y actualizar variables CSS del tema directamente en el documento del iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc || !doc.documentElement) return;

    Object.entries(cssVars).forEach(([key, value]) => {
      doc.documentElement.style.setProperty(key, value);
    });

    if (doc.body) {
      doc.body.style.fontFamily = cssVars["--font-body"] || "var(--font-body)";
      doc.body.style.backgroundColor = "var(--background)";
      doc.body.style.color = "var(--foreground)";
    }
  }, [cssVars, mountNode]);

  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  return (
    <div className="flex-1 bg-slate-100/90 p-2 sm:p-4 flex flex-col items-center justify-center overflow-hidden h-full">
      {/* 
        Marco de Dispositivo:
        - Celular (Mobile): Ancho 390px fiel a iPhone 14/15 con bezel curvo y Dynamic Island.
        - Tablet: Ancho 768px con marco proporcionado.
        - Escritorio: Ancho completo con barra superior de navegador.
      */}
      <div
        className={`transition-all duration-300 flex flex-col overflow-hidden relative ${
          isMobile
            ? "w-[390px] h-[780px] max-h-full max-w-full rounded-[44px] border-[8px] border-slate-900 shadow-2xl bg-slate-900"
            : isTablet
            ? "w-[768px] h-full max-h-full max-w-full rounded-[24px] border-[6px] border-slate-800 shadow-2xl bg-slate-800"
            : "w-full max-w-full h-full rounded-2xl border border-slate-300 shadow-xl bg-white"
        }`}
      >
        {/* Cabecera del Marco */}
        {isMobile ? (
          /* Barra de Estado y Dynamic Island para Celular */
          <div className="bg-slate-900 pt-2 pb-1.5 px-6 flex items-center justify-between text-white shrink-0 z-20 select-none">
            <span className="font-semibold text-[11px] tracking-tight">9:41</span>
            {/* Dynamic Island */}
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 rounded-full bg-slate-900 mr-1.5" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
            </div>
            <div className="flex items-center gap-1.5 opacity-90">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : isTablet ? (
          /* Barra Superior para Tablet */
          <div className="bg-slate-800 py-1.5 px-4 flex items-center justify-between text-xs text-slate-300 shrink-0 z-20 select-none">
            <div className="w-2 h-2 rounded-full bg-slate-600 mx-auto" />
          </div>
        ) : (
          /* Barra de Navegador para Escritorio */
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
        )}

        {/* 
          Iframe aislado:
          Al tener su propia ventana (window.innerWidth = 390px en celular),
          los media queries de Tailwind (md:hidden, sm:flex, grid-cols-1, etc.)
          se ejecutan con fidelidad absoluta al 100%, idéntico a un teléfono real.
        */}
        <div className={`flex-1 relative overflow-hidden bg-background ${isMobile ? "rounded-[34px]" : ""}`}>
          <iframe
            ref={iframeRef}
            title="Vista previa en vivo del escaparate"
            className="w-full h-full border-0 block bg-background"
          />

          {/* Loader mientras se monta el iframe inicial */}
          {!mountNode && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-30">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Cargando vista previa...</span>
              </div>
            </div>
          )}
        </div>

        {/* Barra inferior Home Indicator para Celular */}
        {isMobile && (
          <div className="bg-slate-900 py-2 flex justify-center shrink-0 z-20 select-none">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        )}
      </div>

      {/* Portal de componentes React dentro del documento aislado del iframe */}
      {mountNode &&
        createPortal(
          <div
            style={{
              ...cssVars,
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              fontFamily: cssVars["--font-body"] || "var(--font-body)",
            } as React.CSSProperties}
            className="min-h-full bg-background text-foreground antialiased flex flex-col select-none"
          >
            {/* Barra de navegación del escaparate */}
            <div className="pointer-events-none">
              <Navbar
                business={theme.business}
                categories={categories}
                items={items}
              />
            </div>

            {/* Secciones Modulares Escrolleables de Arriba a Abajo */}
            <main className="flex-1 pointer-events-none">
              {orderedSections.map((section) => (
                <SectionRenderer
                  key={`${section.id}-${section.order}`}
                  section={section}
                  items={items}
                  categories={categories}
                  business={effectiveTheme.business}
                  themeName={effectiveTheme.name}
                  themePalette={effectiveTheme.palette}
                />
              ))}
            </main>

            {/* Pie de página del escaparate */}
            <div className="pointer-events-none">
              <Footer business={theme.business} categories={categories} />
            </div>
          </div>,
          mountNode
        )}
    </div>
  );
}
