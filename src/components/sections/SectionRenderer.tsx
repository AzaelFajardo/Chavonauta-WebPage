import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  ArrowRight,
  Check,
  MapPin,
  Clock,
  Mail,
  ChevronRight,
} from "lucide-react";
import { BusinessInfo, CatalogItem, Category, FaqItem, HeroFallingIconsConfig, SectionBlock, ShowcaseCard, ThemePalette } from "@/types";
import { getWhatsAppDisplay } from "@/lib/business";
import { getSafeExternalUrl } from "@/lib/validation";
import {
  DEFAULT_HERO_CARDS,
  DEFAULT_HERO_CONTENT,
  DEFAULT_SERVICES_CARDS,
} from "@/lib/content-defaults";
import { getSafeHref } from "@/lib/url";
import { getShowcaseGridConfig } from "@/lib/showcase-grid";
import { HeroFallingIcons } from "./HeroFallingIcons";
import { ShowcaseCardView } from "./ShowcaseCardView";

interface SectionRendererProps {
  section: SectionBlock;
  items: CatalogItem[];
  categories: Category[];
  business: BusinessInfo;
  themeName?: string;
  themePalette?: ThemePalette;
}

export function SectionRenderer({
  section,
  items,
  categories,
  business,
  themeName,
  themePalette,
}: SectionRendererProps) {
  if (!section.enabled) return null;

  switch (section.type) {
    // ----------------------------------------------------
    // 1. HERO BANNER + GRID MULTI-TARJETAS (Fondo navy-900 sólido con alto contraste)
    // ----------------------------------------------------
    case "hero": {
      const content = (section.content || {}) as Record<string, unknown>;
      const badgeText =
        typeof content.badgeText === "string" && content.badgeText.trim()
          ? content.badgeText.trim()
          : String(DEFAULT_HERO_CONTENT.badgeText ?? "");
      const primaryCtaText =
        typeof content.primaryCtaText === "string" &&
        content.primaryCtaText.trim()
          ? content.primaryCtaText.trim()
          : "Ver Todo el Catálogo";
      const primaryCtaHref = getSafeHref(content.primaryCtaHref) || "/catalogo";
      const secondaryCtaText =
        typeof content.secondaryCtaText === "string" &&
        content.secondaryCtaText.trim()
          ? content.secondaryCtaText.trim()
          : "Contactar por WhatsApp";
      const secondaryCtaHref = getSafeHref(content.secondaryCtaHref);
      const sideImageCandidate =
        typeof content.sideImageUrl === "string" &&
        content.sideImageUrl.trim()
          ? content.sideImageUrl.trim()
          : String(DEFAULT_HERO_CONTENT.sideImageUrl ?? "");
      const sideImageUrl = getSafeHref(sideImageCandidate);
      const sideImageBadge =
        typeof content.sideImageBadge === "string"
          ? content.sideImageBadge.trim()
          : "";
      const sideImageUseRate =
        content.sideImageUseRate === undefined
          ? true
          : Boolean(content.sideImageUseRate);
      const heroCards = Array.isArray(content.cards)
        ? (content.cards as ShowcaseCard[])
        : DEFAULT_HERO_CARDS;

      const showWhatsAppButton = content.showWhatsAppButton !== false;
      const customButtons = Array.isArray(content.customButtons) && content.customButtons.length > 0
        ? (content.customButtons as Array<{ id: string; label: string; destination: string; customUrl?: string }>)
        : null;

      const waHero = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
        `Hola ${business.name}, deseo consultar la disponibilidad de un producto o servicio.`
      )}`;
      const secondaryHref = secondaryCtaHref || waHero;
      const sideBadgeText = sideImageUseRate
        ? `Renta de PC: $${(business.computerRates?.oneHour ?? 7).toFixed(
            2
          )} / hora`
        : sideImageBadge;

      return (
        <section id={section.id || "sec-hero"} className="relative pb-10 bg-background text-foreground transition-colors duration-200">
          <div
            style={{
              backgroundColor: "var(--primary, #1a2f85)",
              color: "var(--primary-foreground, #ffffff)",
            }}
            className="relative pt-10 pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner transition-colors duration-200"
          >
            <HeroFallingIcons
              config={
                section.content?.fallingIcons as
                  | HeroFallingIconsConfig
                  | undefined
              }
              themeName={themeName}
              themePalette={themePalette}
            />

            <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16 relative z-10">
              <div className="flex-1 max-w-2xl xl:max-w-[720px] z-10">
                {badgeText && (
                  <span
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--accent-foreground)",
                      borderRadius: "var(--radius)",
                    }}
                    className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs border border-white/20 transition-all"
                  >
                    {badgeText}
                  </span>
                )}

                <h1
                  style={{ color: "var(--primary-foreground, #ffffff)" }}
                  className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight drop-shadow-xs"
                >
                  {section.title}
                </h1>

                <p className="mt-4 text-base sm:text-lg opacity-90 leading-relaxed font-normal">
                  {section.subtitle}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {customButtons ? (
                    customButtons.map((btn, bIdx) => {
                      const rawHref = btn.destination === "custom" ? (btn.customUrl || "/catalogo") : btn.destination;
                      const href = getSafeHref(rawHref) || "/catalogo";
                      const isInternal = href.startsWith("/") || href.startsWith("#");
                      const isFirst = bIdx === 0;

                      return (
                        <Link
                          key={btn.id || bIdx}
                          href={href}
                          {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                          style={{
                            backgroundColor: isFirst ? "var(--accent)" : "rgba(255, 255, 255, 0.15)",
                            color: isFirst ? "var(--accent-foreground)" : "#ffffff",
                            borderRadius: "var(--radius)",
                            border: isFirst ? "none" : "1px solid rgba(255, 255, 255, 0.35)",
                          }}
                          className={`px-6 py-3 font-extrabold text-sm shadow-md transition-all hover:opacity-90 ${
                            !isFirst ? "hover:bg-white/25" : ""
                          }`}
                        >
                          {btn.label || "Ver más"}
                        </Link>
                      );
                    })
                  ) : (
                    <Link
                      href={primaryCtaHref}
                      {...(primaryCtaHref.startsWith("/") || primaryCtaHref.startsWith("#")
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-foreground)",
                        borderRadius: "var(--radius)",
                      }}
                      className="px-6 py-3 font-extrabold text-sm shadow-md transition-opacity hover:opacity-90"
                    >
                      {primaryCtaText}
                    </Link>
                  )}

                  {showWhatsAppButton && (
                    <a
                      href={secondaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ borderRadius: "var(--radius)" }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span>{secondaryCtaText || "Contactar por WhatsApp"}</span>
                    </a>
                  )}
                </div>
              </div>

              {sideImageUrl && (
                <div
                  style={{ borderRadius: "var(--radius)" }}
                  className="hidden lg:block w-[380px] xl:w-[450px] 2xl:w-[500px] h-64 xl:h-72 2xl:h-80 shrink-0 overflow-hidden border border-white/20 shadow-2xl relative"
                >
                  <img
                    src={sideImageUrl}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                  {sideBadgeText && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <span
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                          borderRadius: "var(--radius)",
                        }}
                        className="text-xs font-semibold border border-white/20 px-3 py-1 shadow-xs"
                      >
                        {sideBadgeText}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {heroCards.length > 0 && (() => {
            const heroGrid = getShowcaseGridConfig(heroCards.length);
            return (
              <div className={`mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-20 ${heroGrid.containerClass}`}>
                <div className={heroGrid.gridClass}>
                  {heroCards.map((card, index) => (
                    <ShowcaseCardView
                      key={`${card.title}-${index}`}
                      card={card}
                      business={business}
                      variant="hero"
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </section>
      );
    }

    // ----------------------------------------------------
    // 2. PRODUCTOS DESTACADOS
    // ----------------------------------------------------
    case "featured_catalog": {
      const featuredProducts = items.filter(
        (item) => item.type === "product" && item.featured === true && item.active !== false
      );

      // Si no hay productos marcados como destacados, la sección se oculta por defecto en el escaparate
      if (featuredProducts.length === 0) {
        return null;
      }

      return (
        <section id={section.id || "sec-featured"} className="bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto p-5 sm:p-6 xl:p-8 shadow-sm border transition-colors duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl sm:text-2xl" style={{ color: "var(--card-foreground)" }}>
                {section.title}
              </h2>
              <Link
                href="/catalogo"
                style={{ color: "var(--primary)" }}
                className="text-xs sm:text-sm font-bold hover:underline flex items-center gap-1"
              >
                <span>Ver todo el catálogo</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Fila de productos (horizontal compacta tipo app en móvil, vertical en tablet/PC) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {featuredProducts.slice(0, 8).map((product) => {
                const waLink = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
                  `Hola Chavonauta, me interesa consultar disponibilidad del artículo: ${product.name}`
                )}`;

                return (
                  <div
                    key={product.id}
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                    }}
                    className="flex flex-row sm:flex-col justify-between gap-3.5 sm:gap-0 border p-3 sm:p-4 hover:shadow-md transition-all group"
                  >
                    {/* Imagen */}
                    <Link
                      href={`/item/${product.slug}`}
                      style={{ borderRadius: "var(--radius)" }}
                      className="relative block w-24 h-24 sm:w-full sm:h-auto sm:aspect-square shrink-0 overflow-hidden bg-slate-50 sm:mb-3 self-center sm:self-auto"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.badges.length > 0 && (
                        <span
                          style={{
                            backgroundColor: "var(--secondary)",
                            color: "var(--secondary-foreground)",
                            borderColor: "var(--border)",
                            borderRadius: "var(--radius)",
                          }}
                          className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 border text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5"
                        >
                          {product.badges[0]}
                        </span>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Título */}
                        <Link href={`/item/${product.slug}`}>
                          <h3
                            className="font-heading font-semibold sm:font-medium text-xs sm:text-sm line-clamp-2 transition-colors leading-snug"
                            style={{ color: "var(--card-foreground)" }}
                          >
                            {product.name}
                          </h3>
                        </Link>

                        {/* Precio */}
                        <div className="mt-1 sm:mt-2 flex items-baseline gap-1">
                          <span className="text-base sm:text-xl font-bold" style={{ color: "var(--card-foreground)" }}>
                            {product.priceLabel}
                          </span>
                        </div>
                      </div>

                      {/* Botón WhatsApp en primary reactivo */}
                      <div className="mt-2 sm:mt-4 sm:pt-3 sm:border-t border-black/5">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                            borderRadius: "var(--radius)",
                          }}
                          className="flex items-center justify-center gap-1.5 w-full py-1.5 sm:py-2 px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold shadow-xs transition-opacity hover:opacity-90"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">Consultar por WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 3. SEGUNDA CUADRÍCULA DE SERVICIOS
    // ----------------------------------------------------
    case "services": {
      const content = (section.content || {}) as Record<string, unknown>;
      const serviceCards = Array.isArray(content.cards)
        ? (content.cards as ShowcaseCard[])
        : DEFAULT_SERVICES_CARDS;
      const servicesGrid = getShowcaseGridConfig(serviceCards.length);

      return (
        <section id={section.id || "sec-services"} className="bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div className={`mx-auto ${servicesGrid.containerClass}`}>
            <div className={servicesGrid.gridClass}>
              {serviceCards.map((card, index) => (
                <ShowcaseCardView
                  key={`${card.title}-${index}`}
                  card={card}
                  business={business}
                  variant="services"
                />
              ))}
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 4. TARIFAS DE RENTA DE COMPUTADORAS ($7/hr y $4/media hr)
    // ----------------------------------------------------
    case "rates": {
      const computerRates =
        (section.content?.computerRates as { oneHour?: number; halfHour?: number } | undefined) ||
        business.computerRates || { oneHour: 7, halfHour: 4 };
      const oneHourRate = computerRates.oneHour ?? 7;
      const halfHourRate = computerRates.halfHour ?? 4;

      return (
        <section id={section.id || "sec-rates"} className="scroll-mt-32 bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div
            id="tarifas"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
              scrollMarginTop: "124px",
            }}
            className="scroll-mt-32 max-w-[1440px] 2xl:max-w-[1560px] mx-auto p-6 sm:p-8 shadow-sm border transition-colors duration-200 overflow-hidden"
          >
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                Tarifas de Renta de Equipos
              </span>
              <h2 className="font-heading font-bold text-2xl mt-1" style={{ color: "var(--card-foreground)" }}>
                {section.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="border p-6"
              >
                <span className="text-xs font-semibold opacity-70 uppercase">Tarifa 1 Hora</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ color: "var(--card-foreground)" }}>
                    ${oneHourRate.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold opacity-70">MXN / hora</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs opacity-90">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Conexión de fibra óptica simétrica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Paquetería completa Office (Word, Excel, PowerPoint, PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Puertos frontales para memorias y celulares</span>
                  </li>
                </ul>
              </div>

              <div
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="border p-6"
              >
                <span className="text-xs font-semibold opacity-70 uppercase">Tarifa Media Hora</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ color: "var(--card-foreground)" }}>
                    ${halfHourRate.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold opacity-70">MXN / 30 minutos</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs opacity-90">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Uso rápido para consultas o descarga de formatos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Impresión directa desde la computadora</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span>Posibilidad de extender a 1 hora</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 5. UBICACIÓN, HORARIOS Y DATOS OFICIALES DE SUCURSAL
    // ----------------------------------------------------
    case "location": {
      const mapsUrl =
        getSafeExternalUrl(business.googleMapsUrl) ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          business.address
        )}`;

      return (
        <section id={section.id || "sec-location"} className="scroll-mt-32 bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div
            id="ubicacion"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
              scrollMarginTop: "124px",
            }}
            className="scroll-mt-32 max-w-[1440px] 2xl:max-w-[1560px] mx-auto p-6 sm:p-8 shadow-sm border transition-colors duration-200 overflow-hidden"
          >
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                Atención en Sucursal
              </span>
              <h2 className="font-heading font-bold text-2xl mt-1" style={{ color: "var(--card-foreground)" }}>
                {section.title || "Ubicación y Horarios de Atención"}
              </h2>
              <p className="text-xs sm:text-sm opacity-80 mt-1">
                {business.branchName ? `Sucursal ${business.branchName}` : "Sucursal Principal"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dirección y Contacto */}
              <div className="space-y-5 lg:col-span-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                  <div>
                    <strong className="block text-sm mb-1" style={{ color: "var(--card-foreground)" }}>Dirección:</strong>
                    <span className="text-xs opacity-80 leading-relaxed block">
                      {business.address}
                    </span>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--primary)" }}
                      className="inline-flex items-center gap-1 text-xs font-bold hover:underline mt-2"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Cómo llegar</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm mb-1" style={{ color: "var(--card-foreground)" }}>WhatsApp de Atención:</strong>
                    <a
                      href={`https://wa.me/${business.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--primary)" }}
                      className="text-xs font-bold hover:underline"
                    >
                      {getWhatsAppDisplay(business)}
                    </a>
                  </div>
                </div>

                {business.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
                    <div>
                      <strong className="block text-sm mb-1" style={{ color: "var(--card-foreground)" }}>Correo Electrónico:</strong>
                      <a
                        href={`mailto:${business.email}`}
                        style={{ color: "var(--primary)" }}
                        className="text-xs font-semibold hover:underline"
                      >
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Horario Comercial Completo */}
              <div
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
                className="lg:col-span-2 border p-5"
              >
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/10">
                  <Clock className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-bold text-sm" style={{ color: "var(--card-foreground)" }}>
                    Horario Comercial (Abierto en horario específico)
                  </h3>
                </div>

                {business.scheduleDetails && business.scheduleDetails.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                    {business.scheduleDetails.map((item) => (
                      <div
                        key={item.day}
                        className="flex items-center justify-between py-1 border-b border-black/5"
                      >
                        <span className="font-semibold" style={{ color: "var(--card-foreground)" }}>{item.day}</span>
                        <span className="font-mono opacity-80">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs opacity-80">{business.schedule}</p>
                )}

                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs opacity-80">
                  <span>Te esperamos en Whatsapp!!!</span>
                  <a
                    href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent("Hola Chavonauta, deseo consultar si están abiertos en este momento.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Preguntar por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 6. PROMOCIONES Y AVISOS TEMPORALES
    // ----------------------------------------------------
    case "promo_banner": {
      const text =
        typeof section.content?.text === "string"
          ? section.content.text.trim()
          : "";
      const buttonLabel =
        typeof section.content?.buttonLabel === "string"
          ? section.content.buttonLabel.trim()
          : "";
      const buttonHref = getSafeHref(section.content?.buttonHref);
      const badge =
        typeof section.content?.badge === "string"
          ? section.content.badge.trim()
          : "";

      if (!text && !section.title) return null;

      return (
        <section id={section.id || "sec-promo-banner"} className="bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "var(--radius)",
            }}
            className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto p-6 sm:p-8 shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="max-w-3xl">
                {badge && (
                  <span
                    style={{
                      backgroundColor: "var(--accent)",
                      color: "var(--accent-foreground)",
                      borderRadius: "var(--radius)",
                    }}
                    className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2"
                  >
                    {badge}
                  </span>
                )}
                <h2 className="font-heading font-bold text-xl sm:text-2xl">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-xs sm:text-sm opacity-85 mt-1">
                    {section.subtitle}
                  </p>
                )}
                {text && (
                  <p className="text-sm mt-3 leading-relaxed whitespace-pre-line opacity-95">
                    {text}
                  </p>
                )}
              </div>

              {buttonLabel && buttonHref && (
                <a
                  href={buttonHref}
                  target={buttonHref.startsWith("/") ? undefined : "_blank"}
                  rel={
                    buttonHref.startsWith("/")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-foreground)",
                    borderRadius: "var(--radius)",
                  }}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-bold shadow-md hover:opacity-90 transition-opacity shrink-0"
                >
                  {buttonLabel}
                </a>
              )}
            </div>
          </div>
        </section>
      );
    }

    // ----------------------------------------------------
    // 7. PREGUNTAS FRECUENTES (ACORDEÓN ACCESIBLE)
    // ----------------------------------------------------
    case "faq": {
      const items = Array.isArray(section.content?.items)
        ? (section.content.items as FaqItem[]).filter(
            (item) =>
              item &&
              typeof item.question === "string" &&
              typeof item.answer === "string" &&
              item.question.trim() &&
              item.answer.trim()
          )
        : [];

      if (items.length === 0) return null;

      return (
        <section id={section.id || "sec-faq"} className="bg-background text-foreground py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto p-6 sm:p-8 border shadow-sm"
          >
            <h2 className="font-heading font-bold text-xl sm:text-2xl">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-xs sm:text-sm opacity-80 mt-1">
                {section.subtitle}
              </p>
            )}

            <div className="space-y-2 mt-4">
              {items.map((item, index) => (
                <details
                  key={`${index}-${item.question}`}
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    backgroundColor: "var(--muted)",
                  }}
                  className="border px-4 py-3"
                >
                  <summary className="cursor-pointer font-semibold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]">
                    {item.question}
                  </summary>
                  <p className="text-xs sm:text-sm opacity-85 leading-relaxed mt-2 whitespace-pre-line">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
