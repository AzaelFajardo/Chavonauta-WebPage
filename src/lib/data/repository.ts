import { CatalogItem, Category, ThemeConfig } from "@/types";
import {
  sqliteGetThemeConfig,
  sqliteSaveThemeConfig,
  sqliteGetCategories,
  sqliteSaveCategory,
  sqliteGetCatalogItems,
  sqliteGetCatalogItemBySlug,
  sqliteGetCatalogItemById,
  sqliteSaveCatalogItem,
  sqliteDeleteCatalogItem,
  sqliteDeleteCatalogItems,
  sqliteBulkUpdateCatalogItems,
  sqliteToggleCatalogItemActive,
  sqliteToggleCatalogItemFeatured,
} from "./sqlite-db";

export interface StorefrontRepository {
  getThemeConfig(): Promise<ThemeConfig>;
  saveThemeConfig(theme: ThemeConfig): Promise<ThemeConfig>;
  getCategories(): Promise<Category[]>;
  saveCategory(category: Category): Promise<Category>;
  getCatalogItems(options?: { includeInactive?: boolean }): Promise<CatalogItem[]>;
  getCatalogItemBySlug(slug: string): Promise<CatalogItem | undefined>;
  getCatalogItemById(id: string): Promise<CatalogItem | undefined>;
  saveCatalogItem(item: CatalogItem): Promise<CatalogItem>;
  deleteCatalogItem(id: string): Promise<boolean>;
  deleteCatalogItems(ids: string[]): Promise<number>;
  bulkUpdateCatalogItems(ids: string[], updates: Partial<CatalogItem>): Promise<number>;
  toggleCatalogItemActive(id: string): Promise<CatalogItem | undefined>;
  toggleCatalogItemFeatured(id: string): Promise<CatalogItem | undefined>;
}

export const repository: StorefrontRepository = {
  getThemeConfig(): Promise<ThemeConfig> {
    return sqliteGetThemeConfig();
  },

  saveThemeConfig(theme: ThemeConfig): Promise<ThemeConfig> {
    return sqliteSaveThemeConfig(theme);
  },

  getCategories(): Promise<Category[]> {
    return sqliteGetCategories();
  },

  saveCategory(category: Category): Promise<Category> {
    return sqliteSaveCategory(category);
  },

  getCatalogItems(options?: { includeInactive?: boolean }): Promise<CatalogItem[]> {
    return sqliteGetCatalogItems(options);
  },

  getCatalogItemBySlug(slug: string): Promise<CatalogItem | undefined> {
    return sqliteGetCatalogItemBySlug(slug);
  },

  getCatalogItemById(id: string): Promise<CatalogItem | undefined> {
    return sqliteGetCatalogItemById(id);
  },

  saveCatalogItem(item: CatalogItem): Promise<CatalogItem> {
    return sqliteSaveCatalogItem(item);
  },

  deleteCatalogItem(id: string): Promise<boolean> {
    return sqliteDeleteCatalogItem(id);
  },

  deleteCatalogItems(ids: string[]): Promise<number> {
    return sqliteDeleteCatalogItems(ids);
  },

  bulkUpdateCatalogItems(
    ids: string[],
    updates: Partial<CatalogItem>
  ): Promise<number> {
    return sqliteBulkUpdateCatalogItems(ids, updates);
  },

  toggleCatalogItemActive(id: string): Promise<CatalogItem | undefined> {
    return sqliteToggleCatalogItemActive(id);
  },

  toggleCatalogItemFeatured(id: string): Promise<CatalogItem | undefined> {
    return sqliteToggleCatalogItemFeatured(id);
  },
};
