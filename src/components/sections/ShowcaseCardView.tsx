import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";
import { BusinessInfo, ShowcaseCard, ShowcaseGridItem } from "@/types";
import { getSafeHref } from "@/lib/url";

interface ShowcaseCardViewProps {
  card: ShowcaseCard;
  business: BusinessInfo;
  variant: "hero" | "services";
}

function buildWhatsAppHref(business: BusinessInfo, message: string): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

function resolveCardLink(
  card: ShowcaseCard,
  business: BusinessInfo
): { href: string; external: boolean; label: string; whatsapp: boolean } | null {
  if (card.linkWhatsappMessage) {
    return {
      href: buildWhatsAppHref(business, card.linkWhatsappMessage),
      external: true,
      label: card.linkLabel || "Consultar por WhatsApp",
      whatsapp: true,
    };
  }

  const href = getSafeHref(card.linkHref);
  if (!href) return null;

  return {
    href,
    external: !href.startsWith("/") && !href.startsWith("#"),
    label: card.linkLabel || "Ver más",
    whatsapp: false,
  };
}

function GridItem({ item }: { item: ShowcaseGridItem }) {
  const href = getSafeHref(item.href);

  const content = (
    <>
      <div
        style={{ borderRadius: "var(--radius)" }}
        className="aspect-square overflow-hidden bg-slate-100 mb-1"
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.label}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : null}
      </div>
      <span className="text-[11px] font-medium truncate opacity-90 group-hover:underline">
        {item.label}
      </span>
    </>
  );

  if (!href) {
    return <div className="flex flex-col">{content}</div>;
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className="flex flex-col group">
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col group"
    >
      {content}
    </a>
  );
}

export function ShowcaseCardView({
  card,
  business,
  variant,
}: ShowcaseCardViewProps) {
  const link = resolveCardLink(card, business);
  const isService = variant === "services";
  const Heading = (isService ? "h3" : "h2") as "h2" | "h3";
  const rates = business.computerRates || { oneHour: 7, halfHour: 4 };
  const gridItems = card.gridItems || [];

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        color: "var(--card-foreground)",
        borderColor: "var(--border)",
        borderRadius: "var(--radius)",
      }}
      className={`${isService ? "p-5 shadow-sm" : "p-5 shadow-md"
        } border flex flex-col justify-between transition-colors overflow-hidden h-full`}
    >
      <div>
        <Heading
          className="font-heading font-bold text-xl mb-3"
          style={{ color: "var(--card-foreground)" }}
        >
          {card.title}
        </Heading>

        {card.imageLayout === "grid" && gridItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {gridItems.map((item, index) => (
              <GridItem key={`${item.label}-${index}`} item={item} />
            ))}
          </div>
        ) : card.imageUrl ? (
          <div
            style={{ borderRadius: "var(--radius)" }}
            className="aspect-[4/3] overflow-hidden bg-slate-100 mb-3"
          >
            <img
              src={card.imageUrl}
              alt={card.title}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : null}

        {card.description && (
          <p className="text-xs leading-relaxed opacity-80">
            {card.description}
          </p>
        )}

        {card.showRentRates && (
          <div
            className="mt-2 text-sm font-bold"
            style={{ color: "var(--card-foreground)" }}
          >
            ${rates.oneHour.toFixed(2)} / hr{" "}
            <span className="text-xs font-normal opacity-70">
              (Media hr: ${rates.halfHour.toFixed(2)})
            </span>
          </div>
        )}

        {card.badge && (
          <span
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="inline-block mt-2 text-[11px] font-bold border px-2.5 py-0.5"
          >
            {card.badge}
          </span>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          {...(link.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          style={{ color: "var(--primary)" }}
          className="mt-4 text-xs font-bold hover:underline flex items-center gap-1"
        >
          {link.whatsapp && (
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span>{link.label}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
