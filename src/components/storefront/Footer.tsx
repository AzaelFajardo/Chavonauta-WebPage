"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { BusinessInfo, Category } from "@/types";

interface FooterProps {
  business: BusinessInfo;
  categories: Category[];
}

export function Footer({ business, categories }: FooterProps) {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const whatsappHref = `https://wa.me/${business.whatsappNumber}`;

  return (
    <footer className="bg-[#232f3e] text-white text-xs">
      {/* Botón Volver Arriba estilo Amazon */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white py-3.5 text-center text-xs font-semibold transition-colors block"
      >
        Inicio de página
      </button>

      {/* Contenido Principal del Footer en 4 Columnas */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Columna 1: Conócenos */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Conócenos</h4>
          <ul className="space-y-2 text-[#DDD]">
            <li>
              <span className="font-semibold text-white">{business.name}</span>
            </li>
            <li>
              <span className="text-slate-300">{business.slogan}</span>
            </li>
            <li className="pt-2">
              <span className="text-slate-400 block font-semibold text-[11px] uppercase">
                Sucursal:
              </span>
              <span>{business.address}</span>
            </li>
          </ul>
        </div>

        {/* Columna 2: Servicios Principales */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Servicios en Sucursal</h4>
          <ul className="space-y-2 text-[#DDD]">
            <li>
              <Link href="/#tarifas" className="hover:underline">
                Renta de PC e Internet ($7/hr)
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-cyber" className="hover:underline">
                Centro de Impresiones & Copias
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-cyber" className="hover:underline">
                Trámites Digitales por Internet
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-cyber" className="hover:underline">
                Reparación y Mantenimiento
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Departamentos */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Departamentos</h4>
          <ul className="space-y-2 text-[#DDD]">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/catalogo?categoria=${c.slug}`}
                  className="hover:underline"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalogo" className="hover:underline text-[#febd69] font-semibold">
                Ver todos los departamentos →
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Atención al Cliente</h4>
          <p className="text-slate-300 mb-3 leading-relaxed">
            Envía tus archivos para imprimir o consulta disponibilidad de artículos.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold text-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Directo</span>
          </a>
          <div className="mt-3 text-[11px] text-slate-400">
            Horarios: {business.schedule}
          </div>
        </div>
      </div>

      {/* Franja Inferior estilo Amazon (#131921) */}
      <div className="border-t border-[#3a4553] bg-[#131921] py-8 px-4 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Logo estilo Amazon */}
          <div className="flex items-baseline">
            <span className="font-heading font-black text-xl tracking-tighter text-white">
              chavonauta
            </span>
            <span className="text-xs font-bold text-[#febd69] ml-0.5">.mx</span>
          </div>

          <div className="text-slate-400 text-[11px] max-w-xl">
            © {new Date().getFullYear()}, {business.name}. Catálogo digital y plataforma informativa. Precios y disponibilidad sujetos a mostrador.
          </div>

          <div className="pt-2">
            <Link
              href="/admin/personalizador"
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Acceso a Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
