"use client";

import Link from "next/link";
import { MessageCircle, Mail, Clock } from "lucide-react";
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
      style={{
        backgroundColor: "var(--primary, #1a2f85)",
        color: "var(--primary-foreground, #ffffff)",
      }}
      className="text-xs transition-colors duration-200"
    >
      {/* Botón Volver Arriba reactivo al tema secundario */}
      <button
        type="button"
        onClick={scrollToTop}
        style={{
          backgroundColor: "var(--secondary, #1c38a8)",
          color: "var(--secondary-foreground, #ffffff)",
        }}
        className="w-full hover:opacity-90 py-3.5 text-center text-xs font-semibold transition-opacity block border-t border-black/10"
      >
        Inicio de página
      </button>

      {/* Contenido Principal del Footer en 4 Columnas */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Columna 1: Conócenos */}
        <div>
          <h4 className="font-bold text-sm mb-3">Conócenos</h4>
          <ul className="space-y-2 opacity-90">
            <li>
              <span className="font-semibold">{business.name}</span>
            </li>
            <li>
              <span className="opacity-80">{business.slogan}</span>
            </li>
            <li className="pt-2">
              <span className="block font-semibold text-[11px] uppercase opacity-75">
                Sucursal:
              </span>
              <span className="opacity-85 leading-relaxed block">{business.address}</span>
            </li>
          </ul>
        </div>

        {/* Columna 2: Servicios Principales */}
        <div>
          <h4 className="font-bold text-sm mb-3">Servicios en Sucursal</h4>
          <ul className="space-y-2 opacity-90">
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
          <h4 className="font-bold text-sm mb-3">Departamentos</h4>
          <ul className="space-y-2 opacity-90">
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
              <Link
                href="/catalogo"
                style={{ color: "var(--accent)" }}
                className="hover:underline font-bold"
              >
                Ver todos los departamentos →
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div>
          <h4 className="font-bold text-sm mb-3">Atención al Cliente</h4>
          <div className="space-y-2 opacity-90 mb-4">
            <p className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>WhatsApp: 449 402 2163</span>
            </p>
            {business.email && (
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 opacity-80 shrink-0" />
                <a href={`mailto:${business.email}`} className="hover:underline">
                  {business.email}
                </a>
              </p>
            )}
            <p className="flex items-start gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 opacity-80 shrink-0 mt-0.5" />
              <span className="text-[11px] opacity-80">{business.schedule}</span>
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
              borderRadius: "var(--radius)",
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs transition-opacity hover:opacity-90 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Directo</span>
          </a>
        </div>
      </div>

      {/* Franja Inferior reactiva al color primario oscurecido */}
      <div
        style={{
          backgroundColor: "color-mix(in srgb, var(--primary) 65%, black 35%)",
          borderColor: "color-mix(in srgb, var(--primary) 50%, black 50%)",
        }}
        className="border-t py-8 px-4 text-center transition-colors duration-200"
      >
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Logo sin sonrisa */}
          <div className="flex items-center">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="h-7 w-auto object-contain" />
            ) : (
              <span className="font-heading font-black text-xl tracking-tight uppercase">
                {business.name}
              </span>
            )}
          </div>

          <div className="opacity-75 text-[11px] max-w-xl">
            © {new Date().getFullYear()}, {business.name}. Catálogo digital y plataforma informativa. Precios y disponibilidad en mostrador.
          </div>

          <div className="pt-2">
            <Link
              href="/admin"
              className="text-[11px] opacity-60 hover:opacity-100 transition-opacity"
            >
              Acceso a Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
