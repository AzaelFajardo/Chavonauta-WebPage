import { CatalogItem, Category, ThemeConfig } from "@/types";
import { DEFAULT_THEME_CONFIG, SEED_CATALOG_ITEMS, SEED_CATEGORIES } from "./seed";

export interface StorefrontRepository {
  getThemeConfig(): Promise<ThemeConfig>;
  getCategories(): Promise<Category[]>;
  getCatalogItems(): Promise<CatalogItem[]>;
  getCatalogItemBySlug(slug: string): Promise<CatalogItem | undefined>;
}

export const repository: StorefrontRepository = {
  async getThemeConfig(): Promise<ThemeConfig> {
    return DEFAULT_THEME_CONFIG;
  },
  async getCategories(): Promise<Category[]> {
    return SEED_CATEGORIES;
  },
  async getCatalogItems(): Promise<CatalogItem[]> {
    return SEED_CATALOG_ITEMS.filter((item) => item.active);
  },
  async getCatalogItemBySlug(slug: string): Promise<CatalogItem | undefined> {
    return SEED_CATALOG_ITEMS.find((item) => item.slug === slug && item.active);
  },
};
