import fs from "fs/promises";
import path from "path";
import { CatalogItem, Category, ThemeConfig } from "@/types";
import { DEFAULT_THEME_CONFIG, SEED_CATALOG_ITEMS, SEED_CATEGORIES } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const CATALOG_FILE = path.join(DATA_DIR, "catalog.json");
const THEME_FILE = path.join(DATA_DIR, "theme.json");

async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}

  try {
    await fs.access(CATALOG_FILE);
  } catch {
    await fs.writeFile(CATALOG_FILE, JSON.stringify(SEED_CATALOG_ITEMS, null, 2), "utf8");
  }

  try {
    await fs.access(THEME_FILE);
  } catch {
    await fs.writeFile(THEME_FILE, JSON.stringify(DEFAULT_THEME_CONFIG, null, 2), "utf8");
  }
}

export interface StorefrontRepository {
  getThemeConfig(): Promise<ThemeConfig>;
  saveThemeConfig(theme: ThemeConfig): Promise<ThemeConfig>;
  getCategories(): Promise<Category[]>;
  getCatalogItems(): Promise<CatalogItem[]>;
  getAllCatalogItems(): Promise<CatalogItem[]>;
  getCatalogItemBySlug(slug: string): Promise<CatalogItem | undefined>;
  getCatalogItemById(id: string): Promise<CatalogItem | undefined>;
  createCatalogItem(item: Omit<CatalogItem, "id"> & { id?: string }): Promise<CatalogItem>;
  updateCatalogItem(id: string, updates: Partial<CatalogItem>): Promise<CatalogItem>;
  deleteCatalogItem(id: string): Promise<boolean>;
  toggleCatalogItemActive(id: string): Promise<CatalogItem>;
  resetCatalog(): Promise<CatalogItem[]>;
}

export const repository: StorefrontRepository = {
  async getThemeConfig(): Promise<ThemeConfig> {
    await ensureDataFiles();
    try {
      const data = await fs.readFile(THEME_FILE, "utf8");
      return JSON.parse(data);
    } catch {
      return DEFAULT_THEME_CONFIG;
    }
  },

  async saveThemeConfig(theme: ThemeConfig): Promise<ThemeConfig> {
    await ensureDataFiles();
    const updated = { ...theme, updatedAt: new Date().toISOString() };
    await fs.writeFile(THEME_FILE, JSON.stringify(updated, null, 2), "utf8");
    return updated;
  },

  async getCategories(): Promise<Category[]> {
    return SEED_CATEGORIES;
  },

  async getAllCatalogItems(): Promise<CatalogItem[]> {
    await ensureDataFiles();
    try {
      const data = await fs.readFile(CATALOG_FILE, "utf8");
      return JSON.parse(data);
    } catch {
      return SEED_CATALOG_ITEMS;
    }
  },

  async getCatalogItems(): Promise<CatalogItem[]> {
    const all = await this.getAllCatalogItems();
    return all.filter((item) => item.active);
  },

  async getCatalogItemBySlug(slug: string): Promise<CatalogItem | undefined> {
    const all = await this.getAllCatalogItems();
    return all.find((item) => item.slug === slug && item.active);
  },

  async getCatalogItemById(id: string): Promise<CatalogItem | undefined> {
    const all = await this.getAllCatalogItems();
    return all.find((item) => item.id === id);
  },

  async createCatalogItem(itemData: Omit<CatalogItem, "id"> & { id?: string }): Promise<CatalogItem> {
    await ensureDataFiles();
    const items = await this.getAllCatalogItems();

    const newItem: CatalogItem = {
      ...itemData,
      id: itemData.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      slug:
        itemData.slug ||
        itemData.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      badges: itemData.badges || [],
      featured: Boolean(itemData.featured),
      active: itemData.active ?? true,
      specs: itemData.specs || [],
    };

    items.unshift(newItem);
    await fs.writeFile(CATALOG_FILE, JSON.stringify(items, null, 2), "utf8");
    return newItem;
  },

  async updateCatalogItem(id: string, updates: Partial<CatalogItem>): Promise<CatalogItem> {
    await ensureDataFiles();
    const items = await this.getAllCatalogItems();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Artículo con ID ${id} no encontrado.`);
    }

    const updatedItem: CatalogItem = {
      ...items[index],
      ...updates,
    };

    items[index] = updatedItem;
    await fs.writeFile(CATALOG_FILE, JSON.stringify(items, null, 2), "utf8");
    return updatedItem;
  },

  async deleteCatalogItem(id: string): Promise<boolean> {
    await ensureDataFiles();
    const items = await this.getAllCatalogItems();
    const filtered = items.filter((item) => item.id !== id);

    if (filtered.length === items.length) {
      return false;
    }

    await fs.writeFile(CATALOG_FILE, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  },

  async toggleCatalogItemActive(id: string): Promise<CatalogItem> {
    const item = await this.getCatalogItemById(id);
    if (!item) {
      throw new Error(`Artículo con ID ${id} no encontrado.`);
    }
    return this.updateCatalogItem(id, { active: !item.active });
  },

  async resetCatalog(): Promise<CatalogItem[]> {
    await ensureDataFiles();
    await fs.writeFile(CATALOG_FILE, JSON.stringify(SEED_CATALOG_ITEMS, null, 2), "utf8");
    return SEED_CATALOG_ITEMS;
  },
};
