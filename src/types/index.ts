export type SectionType =
  | "hero"
  | "services"
  | "featured_catalog"
  | "rates"
  | "promo_banner"
  | "location"
  | "faq";

export type HeroIconPackKey =
  | "auto"
  | "space"
  | "tech"
  | "gaming"
  | "christmas"
  | "halloween"
  | "romance"
  | "autumn"
  | "spring"
  | "winter"
  | "ocean"
  | "coffee"
  | "sparkles"
  | "patrio";

export interface HeroFallingIconsConfig {
  enabled: boolean;
  pack: HeroIconPackKey;
  density?: "subtle" | "balanced" | "lively";
  speed?: "slow" | "normal" | "fast";
}

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

export interface ScheduleItem {
  day: string;
  hours: string;
}

export interface ComputerRates {
  oneHour: number;
  halfHour: number;
}

export interface BusinessInfo {
  name: string;
  slogan: string;
  branchName?: string;
  logoUrl?: string;
  logoWidth?: number;
  computerRates?: ComputerRates;
  announcementText?: string;
  announcementEnabled?: boolean;
  whatsappNumber: string;
  email?: string;
  address: string;
  schedule: string;
  scheduleDetails?: ScheduleItem[];
  googleMapsUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface CustomPreset {
  id: string;
  label: string;
  mode: "dark" | "light";
  palette: ThemePalette;
  createdAt?: string;
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
  customPresets?: CustomPreset[];
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

export type ItemBadge = "Nuevo" | "Oferta" | "Popular" | "Destacado" | string;

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
  promotionalPrice?: number;
  stockType?: "infinite" | "limited";
  stockQuantity?: number;
  imageUrl: string;
  badges: string[];
  featured: boolean;
  active: boolean;
  specs?: { label: string; value: string }[];
}

// ----------------------------------------------------
// Métricas y Estadísticas del Escaparate
// ----------------------------------------------------
export interface SearchQueryStat {
  query: string;
  count: number;
  resultsCount: number;
  lastSearchedAt: string;
}

export interface ItemClickStat {
  itemId: string;
  title: string;
  type: "product" | "service";
  categorySlug: string;
  whatsappClicks: number;
  views: number;
}

export interface CategoryStat {
  categorySlug: string;
  label: string;
  clicks: number;
  percentage: number;
}

export interface CtaClickStat {
  location: "hero" | "floating_button" | "catalog_card" | "item_detail" | "footer" | "navbar";
  label: string;
  clicks: number;
  percentage: number;
}

export interface DailyActivityStat {
  date: string;
  dayLabel: string;
  whatsappClicks: number;
  searches: number;
  views: number;
}

export interface AnalyticsSummary {
  period: "7d" | "30d" | "all";
  totalWhatsappClicks: number;
  totalSearches: number;
  totalLocationClicks: number;
  totalCatalogViews: number;
  topItems: ItemClickStat[];
  topSearches: SearchQueryStat[];
  categoryInterest: CategoryStat[];
  ctaBreakdown: CtaClickStat[];
  dailyActivity: DailyActivityStat[];
  lastUpdated: string;
}

export type AnalyticsEventType =
  | "whatsapp_click"
  | "search"
  | "location_click"
  | "catalog_view"
  | "item_view";

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  itemId?: string;
  itemTitle?: string;
  itemType?: "product" | "service";
  categorySlug?: string;
  location?: "hero" | "floating_button" | "catalog_card" | "item_detail" | "footer" | "navbar";
  query?: string;
  resultsCount?: number;
  timestamp?: string;
}
