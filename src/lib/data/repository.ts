import { CatalogItem, Category, ThemeConfig } from "@/types";
import { DEFAULT_THEME_CONFIG, SEED_CATALOG_ITEMS, SEED_CATEGORIES } from "./seed";

interface LocalDatabase {
  theme: ThemeConfig;
  categories: Category[];
  items: CatalogItem[];
}

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

// Cache en memoria para rendimiento instantáneo
let memoryDb: LocalDatabase | null = null;
let isWriting = false;

async function getStoragePath(): Promise<string | null> {
  if (typeof window !== "undefined") return null;
  try {
    const path = await import("path");
    return path.join(process.cwd(), "src", "lib", "data", "local-db.json");
  } catch {
    return null;
  }
}

async function loadDatabase(): Promise<LocalDatabase> {
  if (memoryDb) return memoryDb;

  const filePath = await getStoragePath();
  if (filePath) {
    try {
      const fs = await import("fs/promises");
      const data = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && parsed.items && parsed.categories && parsed.theme) {
        memoryDb = parsed;
        return memoryDb!;
      }
    } catch {
      // El archivo no existe o está corrupto, inicializamos con los datos semilla
    }
  }

  memoryDb = {
    theme: DEFAULT_THEME_CONFIG,
    categories: SEED_CATEGORIES,
    items: SEED_CATALOG_ITEMS,
  };

  await persistDatabase();
  return memoryDb!;
}

async function persistDatabase(): Promise<void> {
  if (!memoryDb || isWriting || typeof window !== "undefined") return;

  const filePath = await getStoragePath();
  if (!filePath) return;

  try {
    isWriting = true;
    const fs = await import("fs/promises");
    await fs.writeFile(filePath, JSON.stringify(memoryDb, null, 2), "utf-8");
  } catch (err) {
    console.error("Error al persistir la base de datos local:", err);
  } finally {
    isWriting = false;
  }
}

export const repository: StorefrontRepository = {
  async getThemeConfig(): Promise<ThemeConfig> {
    const db = await loadDatabase();
    return db.theme;
  },

  async saveThemeConfig(theme: ThemeConfig): Promise<ThemeConfig> {
    const db = await loadDatabase();
    db.theme = {
      ...theme,
      updatedAt: new Date().toISOString(),
    };
    await persistDatabase();
    return db.theme;
  },

  async getCategories(): Promise<Category[]> {
    const db = await loadDatabase();
    return db.categories;
  },

  async saveCategory(category: Category): Promise<Category> {
    const db = await loadDatabase();
    const index = db.categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      db.categories[index] = category;
    } else {
      db.categories.push(category);
    }
    await persistDatabase();
    return category;
  },

  async getCatalogItems(options?: { includeInactive?: boolean }): Promise<CatalogItem[]> {
    const db = await loadDatabase();
    if (options?.includeInactive) {
      return [...db.items];
    }
    return db.items.filter((item) => item.active);
  },

  async getCatalogItemBySlug(slug: string): Promise<CatalogItem | undefined> {
    const db = await loadDatabase();
    return db.items.find((item) => item.slug === slug);
  },

  async getCatalogItemById(id: string): Promise<CatalogItem | undefined> {
    const db = await loadDatabase();
    return db.items.find((item) => item.id === id);
  },

  async saveCatalogItem(item: CatalogItem): Promise<CatalogItem> {
    const db = await loadDatabase();
    const existingIndex = db.items.findIndex((i) => i.id === item.id);

    if (existingIndex >= 0) {
      db.items[existingIndex] = { ...item };
    } else {
      // Nuevo ítem: asegurar ID único
      const newItem = {
        ...item,
        id: item.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      db.items.unshift(newItem);
      item = newItem;
    }

    await persistDatabase();
    return item;
  },

  async deleteCatalogItem(id: string): Promise<boolean> {
    const db = await loadDatabase();
    const initialLength = db.items.length;
    db.items = db.items.filter((item) => item.id !== id);
    const deleted = db.items.length < initialLength;
    if (deleted) {
      await persistDatabase();
    }
    return deleted;
  },

  async deleteCatalogItems(ids: string[]): Promise<number> {
    const db = await loadDatabase();
    const initialLength = db.items.length;
    const idSet = new Set(ids);
    db.items = db.items.filter((item) => !idSet.has(item.id));
    const deletedCount = initialLength - db.items.length;
    if (deletedCount > 0) {
      await persistDatabase();
    }
    return deletedCount;
  },

  async bulkUpdateCatalogItems(
    ids: string[],
    updates: Partial<CatalogItem>
  ): Promise<number> {
    const db = await loadDatabase();
    const idSet = new Set(ids);
    let count = 0;
    for (const item of db.items) {
      if (idSet.has(item.id)) {
        Object.assign(item, updates);
        count++;
      }
    }
    if (count > 0) {
      await persistDatabase();
    }
    return count;
  },

  async toggleCatalogItemActive(id: string): Promise<CatalogItem | undefined> {
    const db = await loadDatabase();
    const item = db.items.find((i) => i.id === id);
    if (!item) return undefined;
    item.active = !item.active;
    await persistDatabase();
    return item;
  },

  async toggleCatalogItemFeatured(id: string): Promise<CatalogItem | undefined> {
    const db = await loadDatabase();
    const item = db.items.find((i) => i.id === id);
    if (!item) return undefined;
    item.featured = !item.featured;
    await persistDatabase();
    return item;
  },
};
