"use client";

import Link from "next/link";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
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
    <footer
      style={{ backgroundColor: "var(--primary, #1a2f85)" }}
      className="text-white text-xs transition-colors duration-200"
    >
      {/* Botón Volver Arriba reactivo al tema secundario */}
      <button
        type="button"
        onClick={scrollToTop}
        style={{
          backgroundColor: "var(--secondary, #1c38a8)",
          color: "var(--secondary-foreground, #ffffff)",
        }}
        className="w-full hover:opacity-90 py-3.5 text-center text-xs font-semibold transition-opacity block border-t border-white/10"
      >
        Inicio de página
      </button>

      {/* Contenido Principal del Footer en 4 Columnas */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Columna 1: Conócenos */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Conócenos</h4>
          <ul className="space-y-2 text-slate-200">
            <li>
              <span className="font-semibold text-white">{business.name}</span>
            </li>
            <li>
              <span className="text-navy-100">{business.slogan}</span>
            </li>
            <li className="pt-2">
              <span className="text-navy-200 block font-semibold text-[11px] uppercase">
                Sucursal:
              </span>
              <span className="text-slate-300 leading-relaxed block">{business.address}</span>
            </li>
          </ul>
        </div>

        {/* Columna 2: Servicios Principales */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Servicios en Sucursal</h4>
          <ul className="space-y-2 text-slate-200">
            <li>
              <Link href="/#tarifas" className="hover:underline hover:text-white">
                Renta de PC e Internet ($7/hr)
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-cyber" className="hover:underline hover:text-white">
                Centro de Impresiones & Copias
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-cyber" className="hover:underline hover:text-white">
                Trámites Digitales por Internet
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-cyber" className="hover:underline hover:text-white">
                Reparación y Mantenimiento
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Departamentos */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Departamentos</h4>
          <ul className="space-y-2 text-slate-200">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/catalogo?categoria=${c.slug}`}
                  className="hover:underline hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalogo" className="hover:underline text-navy-200 font-semibold">
                Ver todos los departamentos →
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Atención al Cliente</h4>
          <div className="space-y-2 text-slate-300 mb-4">
            <p className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>WhatsApp: 449 402 2163</span>
            </p>
            {business.email && (
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-navy-300 shrink-0" />
                <a href={`mailto:${business.email}`} className="hover:underline">
                  {business.email}
                </a>
              </p>
            )}
            <p className="flex items-start gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-navy-300 shrink-0 mt-0.5" />
              <span className="text-[11px] text-navy-100">{business.schedule}</span>
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs border border-navy-700 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Directo</span>
          </a>
        </div>
      </div>

      {/* Franja Inferior */}
      <div className="border-t border-navy-950 bg-slate-950 py-8 px-4 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Logo sin sonrisa */}
          <div className="flex items-center">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="h-7 w-auto object-contain" />
            ) : (
              <span className="font-heading font-black text-xl tracking-tight text-white uppercase">
                {business.name}
              </span>
            )}
          </div>

          <div className="text-slate-400 text-[11px] max-w-xl">
            © {new Date().getFullYear()}, {business.name}. Catálogo digital y plataforma informativa. Precios y disponibilidad en mostrador.
          </div>

          <div className="pt-2">
            <Link
              href="/admin"
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
