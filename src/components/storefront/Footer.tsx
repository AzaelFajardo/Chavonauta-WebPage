"use client";

import Link from "next/link";
import { MessageCircle, Mail, Clock } from "lucide-react";
import { BusinessInfo, Category } from "@/types";
import { getWhatsAppDisplay } from "@/lib/business";

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
                Renta de PC e Internet (${business.computerRates?.oneHour ?? 7}/hr)
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-digitales" className="hover:underline">
                Centro de Impresiones & Copias
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-digitales" className="hover:underline">
                Trámites Digitales por Internet
              </Link>
            </li>
            <li>
              <Link href="/catalogo?categoria=servicios-digitales" className="hover:underline">
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
              <span>WhatsApp: {getWhatsAppDisplay(business)}</span>
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

          {/* Redes Sociales Oficiales: Solo aparecen las que tengan URL configurada */}
          {(business.socialLinks?.facebook ||
            business.socialLinks?.instagram ||
            business.socialLinks?.tiktok) && (
            <div className="pt-4 border-t border-current/15 mt-4">
              <span className="block font-semibold text-[11px] uppercase tracking-wider opacity-75 mb-2.5">
                Síguenos en Redes
              </span>
              <div className="flex items-center gap-2">
                {business.socialLinks?.facebook && (
                  <a
                    href={business.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-current/10 hover:bg-current/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    aria-label="Facebook de Chavonauta"
                    title="Visítanos en Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}

                {business.socialLinks?.instagram && (
                  <a
                    href={business.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-current/10 hover:bg-current/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    aria-label="Instagram de Chavonauta"
                    title="Visítanos en Instagram"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}

                {business.socialLinks?.tiktok && (
                  <a
                    href={business.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-current/10 hover:bg-current/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    aria-label="TikTok de Chavonauta"
                    title="Visítanos en TikTok"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
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
              <img
                src={business.logoUrl}
                alt={business.name}
                style={{
                  maxHeight: "36px",
                }}
                className="w-[140px] sm:w-[175px] h-auto max-h-9 object-contain transition-all"
              />
            ) : (
              <span className="font-heading font-black text-xl tracking-tight uppercase">
                {business.name}
              </span>
            )}
          </div>

          <div className="opacity-75 text-[11px] max-w-xl">
            © {new Date().getFullYear()}, {business.name}. Catálogo digital y plataforma informativa. Precios y disponibilidad en mostrador.
          </div>
        </div>
      </div>
    </footer>
  );
}
