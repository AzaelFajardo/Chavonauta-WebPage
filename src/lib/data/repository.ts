import {
  AnalyticsEvent,
  AnalyticsSummary,
  CatalogItem,
  Category,
  ThemeConfig,
} from "@/types";
import {
  DEFAULT_THEME_CONFIG,
  SEED_ANALYTICS,
  SEED_CATALOG_ITEMS,
  SEED_CATEGORIES,
} from "./seed";

interface LocalDatabase {
  theme: ThemeConfig;
  categories: Category[];
  items: CatalogItem[];
  analytics: AnalyticsSummary;
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
  getAnalytics(): Promise<AnalyticsSummary>;
  recordAnalyticsEvent(event: AnalyticsEvent): Promise<AnalyticsSummary>;
  resetAnalytics(): Promise<AnalyticsSummary>;
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
        if (!parsed.analytics) {
          parsed.analytics = JSON.parse(JSON.stringify(SEED_ANALYTICS));
        }
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
    analytics: JSON.parse(JSON.stringify(SEED_ANALYTICS)),
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

  async getAnalytics(): Promise<AnalyticsSummary> {
    const db = await loadDatabase();
    if (!db.analytics) {
      db.analytics = JSON.parse(JSON.stringify(SEED_ANALYTICS));
      await persistDatabase();
    }
    return db.analytics;
  },

  async recordAnalyticsEvent(event: AnalyticsEvent): Promise<AnalyticsSummary> {
    const db = await loadDatabase();
    if (!db.analytics) {
      db.analytics = JSON.parse(JSON.stringify(SEED_ANALYTICS));
    }
    const stats = db.analytics;
    const todayStr = new Date().toISOString().split("T")[0];

    // Asegurar que dailyActivity contenga el día de hoy
    let todayDaily = stats.dailyActivity.find((d) => d.date === todayStr);
    if (!todayDaily) {
      todayDaily = {
        date: todayStr,
        dayLabel: "Hoy",
        whatsappClicks: 0,
        searches: 0,
        views: 0,
      };
      stats.dailyActivity.push(todayDaily);
      if (stats.dailyActivity.length > 7) {
        stats.dailyActivity.shift();
      }
    }

    if (event.type === "whatsapp_click") {
      stats.totalWhatsappClicks += 1;
      todayDaily.whatsappClicks += 1;

      // Registrar ítem consultado si aplica
      if (event.itemId && event.itemTitle) {
        const existing = stats.topItems.find((i) => i.itemId === event.itemId);
        if (existing) {
          existing.whatsappClicks += 1;
        } else {
          stats.topItems.push({
            itemId: event.itemId,
            title: event.itemTitle,
            type: event.itemType || "product",
            categorySlug: event.categorySlug || "otros",
            whatsappClicks: 1,
            views: 1,
          });
        }
        stats.topItems.sort((a, b) => b.whatsappClicks - a.whatsappClicks);
      }

      // Registrar desglose de CTA si aplica
      if (event.location) {
        const ctaLabels: Record<string, string> = {
          catalog_card: "Botón de Tarjeta en Catálogo",
          floating_button: "Botón Flotante de WhatsApp",
          hero: "Hero Banner Principal",
          item_detail: "Ficha de Detalle de Producto",
          navbar: "Barra Superior / Menú",
          footer: "Pie de Página / Footer",
        };
        let cta = stats.ctaBreakdown.find((c) => c.location === event.location);
        if (!cta) {
          cta = {
            location: event.location,
            label: ctaLabels[event.location] || event.location,
            clicks: 0,
            percentage: 0,
          };
          stats.ctaBreakdown.push(cta);
        }
        cta.clicks += 1;
        const totalCta = stats.ctaBreakdown.reduce((sum, c) => sum + c.clicks, 0);
        stats.ctaBreakdown.forEach((c) => {
          c.percentage = Math.round((c.clicks / (totalCta || 1)) * 100);
        });
        stats.ctaBreakdown.sort((a, b) => b.clicks - a.clicks);
      }

      // Registrar categoría de interés
      if (event.categorySlug) {
        let cat = stats.categoryInterest.find((c) => c.categorySlug === event.categorySlug);
        if (!cat) {
          cat = {
            categorySlug: event.categorySlug,
            label: event.categorySlug,
            clicks: 0,
            percentage: 0,
          };
          stats.categoryInterest.push(cat);
        }
        cat.clicks += 1;
        const totalCat = stats.categoryInterest.reduce((sum, c) => sum + c.clicks, 0);
        stats.categoryInterest.forEach((c) => {
          c.percentage = Math.round((c.clicks / (totalCat || 1)) * 100);
        });
        stats.categoryInterest.sort((a, b) => b.clicks - a.clicks);
      }
    } else if (event.type === "search") {
      stats.totalSearches += 1;
      todayDaily.searches += 1;
      if (event.query && event.query.trim()) {
        const q = event.query.trim().toLowerCase();
        const existing = stats.topSearches.find((s) => s.query.toLowerCase() === q);
        if (existing) {
          existing.count += 1;
          if (typeof event.resultsCount === "number") {
            existing.resultsCount = event.resultsCount;
          }
          existing.lastSearchedAt = new Date().toISOString();
        } else {
          stats.topSearches.push({
            query: q,
            count: 1,
            resultsCount: typeof event.resultsCount === "number" ? event.resultsCount : 0,
            lastSearchedAt: new Date().toISOString(),
          });
        }
        stats.topSearches.sort((a, b) => b.count - a.count);
      }
    } else if (event.type === "location_click") {
      stats.totalLocationClicks += 1;
    } else if (event.type === "catalog_view" || event.type === "item_view") {
      stats.totalCatalogViews += 1;
      todayDaily.views += 1;
      if (event.type === "item_view" && event.itemId) {
        const existing = stats.topItems.find((i) => i.itemId === event.itemId);
        if (existing) {
          existing.views += 1;
        }
      }
    }

    stats.lastUpdated = new Date().toISOString();
    await persistDatabase();
    return stats;
  },

  async resetAnalytics(): Promise<AnalyticsSummary> {
    const db = await loadDatabase();
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const dailyActivity = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(Date.now() - 86400000 * (6 - i));
      const dayLabel = i === 6 ? "Hoy" : days[d.getDay()];
      return {
        date: d.toISOString().split("T")[0],
        dayLabel,
        whatsappClicks: 0,
        searches: 0,
        views: 0,
      };
    });

    db.analytics = {
      period: "all",
      totalWhatsappClicks: 0,
      totalSearches: 0,
      totalLocationClicks: 0,
      totalCatalogViews: 0,
      topItems: [],
      topSearches: [],
      categoryInterest: [],
      ctaBreakdown: [],
      dailyActivity,
      lastUpdated: new Date().toISOString(),
    };

    await persistDatabase();
    return db.analytics;
  },
};
