export type SectionType =
  | "hero"
  | "services"
  | "featured_catalog"
  | "rates"
  | "promo_banner"
  | "location"
  | "faq";

export interface SectionBlock {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  content: Record<string, unknown>;
}

export interface ThemePalette {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export interface BusinessInfo {
  name: string;
  slogan: string;
  logoUrl?: string;
  announcementText?: string;
  announcementEnabled: boolean;
  whatsappNumber: string;
  address: string;
  schedule: string;
  googleMapsUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface ThemeConfig {
  id: string;
  name: string;
  mode: "dark" | "light";
  palette: ThemePalette;
  radius: "0rem" | "0.5rem" | "0.75rem" | "1rem" | "9999px";
  fonts: {
    heading: string;
    body: string;
  };
  business: BusinessInfo;
  sections: SectionBlock[];
  updatedAt: string;
}

export type ItemCategorySlug =
  | "servicios-cyber"
  | "impresiones-papeleria"
  | "gaming-consolas"
  | "accesorios-computo"
  | "snacks-bebidas";

export interface Category {
  id: string;
  slug: ItemCategorySlug | string;
  name: string;
  description: string;
  icon: string;
}

export type ItemBadge = "Nuevo" | "Oferta" | "Popular" | "Destacado";

export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  type: "product" | "service";
  categorySlug: string;
  priceLabel: string;
  referencePrice?: number;
  imageUrl: string;
  badges: ItemBadge[];
  featured: boolean;
  active: boolean;
  specs?: { label: string; value: string }[];
}
