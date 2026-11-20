import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { CatalogItem, Category, ThemeConfig } from "@/types";
import { DEFAULT_THEME_CONFIG, SEED_CATALOG_ITEMS, SEED_CATEGORIES } from "./seed";
import { isLocalUpload, safeDeleteUploadedFile } from "./upload-cleanup";

let dbInstance: Database.Database | null = null;

/**
 * Obtiene la ruta física del archivo de base de datos SQLite.
 * Permite personalización vía variable de entorno DATABASE_PATH para servidores dedicados.
 */
export function getDatabasePath(): string {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  return path.join(process.cwd(), "src", "lib", "data", "chavonauta.db");
}

/**
 * Cierra la instancia actual de la base de datos (útil para pruebas o reinicios).
 */
export function closeDatabase(): void {
  if (dbInstance) {
    try {
      dbInstance.close();
    } catch {
      // Ignorar si ya estaba cerrada
    }
    dbInstance = null;
  }
}

/**
 * Obtiene o inicializa la conexión singleton a la base de datos SQLite con WAL mode.
 */
export function getDatabase(): Database.Database {
  if (dbInstance) return dbInstance;

  const dbPath = getDatabasePath();

  // Si no es :memory:, asegurarse de que la carpeta contenedora exista
  if (dbPath !== ":memory:") {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new Database(dbPath);

  // Optimizaciones SQLite de alta concurrencia y durabilidad
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("foreign_keys = ON");

  initializeSchema(db);
  seedIfEmpty(db);

  dbInstance = db;
  return dbInstance;
}

/**
 * Crea las tablas e índices necesarios si no existen aún.
 */
function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS theme_config (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS catalog_items (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      short_description TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      price_label TEXT NOT NULL,
      reference_price REAL,
      promotional_price REAL,
      stock_type TEXT NOT NULL DEFAULT 'infinite',
      stock_quantity INTEGER,
      image_url TEXT NOT NULL,
      badges TEXT NOT NULL DEFAULT '[]',
      specs TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_items_category ON catalog_items(category_slug);
    CREATE INDEX IF NOT EXISTS idx_items_active ON catalog_items(active);
    CREATE INDEX IF NOT EXISTS idx_items_featured ON catalog_items(featured);
    CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index);
  `);
}

/**
 * Inicializa datos semilla si la BD está vacía.
 */
function seedIfEmpty(db: Database.Database): void {
  const countTheme = db
    .prepare("SELECT COUNT(*) as count FROM theme_config")
    .get() as { count: number };

  if (countTheme.count > 0) {
    return; // Ya contiene datos
  }

  const themeToSeed = DEFAULT_THEME_CONFIG;
  const categoriesToSeed = SEED_CATEGORIES;
  const itemsToSeed = SEED_CATALOG_ITEMS;

  const insertTransaction = db.transaction(() => {
    // 1. Guardar tema
    const insertTheme = db.prepare(
      "INSERT OR REPLACE INTO theme_config (id, data, updated_at) VALUES (?, ?, ?)"
    );
    insertTheme.run("default-theme", JSON.stringify(themeToSeed), new Date().toISOString());

    // 2. Guardar categorías
    const insertCat = db.prepare(
      "INSERT OR REPLACE INTO categories (id, slug, name, description, icon, order_index) VALUES (?, ?, ?, ?, ?, ?)"
    );
    categoriesToSeed.forEach((cat, index) => {
      insertCat.run(cat.id, cat.slug, cat.name, cat.description, cat.icon, index);
    });

    // 3. Guardar ítems de catálogo
    const insertItem = db.prepare(`
      INSERT OR REPLACE INTO catalog_items (
        id, slug, name, short_description, description, type, category_slug,
        price_label, reference_price, promotional_price, stock_type, stock_quantity,
        image_url, badges, specs, featured, active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    itemsToSeed.forEach((item) => {
      insertItem.run(
        item.id,
        item.slug,
        item.name,
        item.shortDescription || "",
        item.description || "",
        item.type,
        item.categorySlug,
        item.priceLabel,
        item.referencePrice ?? null,
        item.promotionalPrice ?? null,
        item.stockType || "infinite",
        item.stockQuantity ?? null,
        item.imageUrl,
        JSON.stringify(item.badges || []),
        JSON.stringify(item.specs || []),
        item.featured ? 1 : 0,
        item.active !== false ? 1 : 0,
        now,
        now
      );
    });
  });

  insertTransaction();
}

/**
 * Mapea una fila de catalog_items a la interfaz TypeScript CatalogItem.
 */
function rowToCatalogItem(row: any): CatalogItem {
  let badges: string[] = [];
  try {
    badges = row.badges ? JSON.parse(row.badges) : [];
  } catch {
    badges = [];
  }

  let specs: { label: string; value: string }[] = [];
  try {
    specs = row.specs ? JSON.parse(row.specs) : [];
  } catch {
    specs = [];
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description || "",
    description: row.description || "",
    type: row.type as "product" | "service",
    categorySlug: row.category_slug,
    priceLabel: row.price_label,
    referencePrice: row.reference_price !== null ? Number(row.reference_price) : undefined,
    promotionalPrice: row.promotional_price !== null ? Number(row.promotional_price) : undefined,
    stockType: row.stock_type === "limited" ? "limited" : "infinite",
    stockQuantity: row.stock_quantity !== null ? Number(row.stock_quantity) : undefined,
    imageUrl: row.image_url,
    badges,
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    specs,
  };
}

/**
 * Mapea una fila de categories a la interfaz Category.
 */
function rowToCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
  };
}

/**
 * Verifica si una URL de imagen sigue en uso en el catálogo o tema.
 */
export function isImageUrlInUse(imageUrl: string, excludeItemId?: string): boolean {
  if (!imageUrl) return false;
  const db = getDatabase();

  let query = "SELECT COUNT(*) as count FROM catalog_items WHERE image_url = ?";
  const params: unknown[] = [imageUrl];
  if (excludeItemId) {
    query += " AND id != ?";
    params.push(excludeItemId);
  }

  const row = db.prepare(query).get(...params) as { count: number } | undefined;
  if (row && row.count > 0) {
    return true;
  }

  const themeRow = db
    .prepare("SELECT data FROM theme_config WHERE id = 'default-theme' LIMIT 1")
    .get() as { data: string } | undefined;

  if (themeRow?.data && themeRow.data.includes(imageUrl)) {
    return true;
  }

  return false;
}

// -------------------------------------------------------------
// OPERACIONES DEL REPOSITORIO BASADAS EN SQLITE
// -------------------------------------------------------------

export async function sqliteGetThemeConfig(): Promise<ThemeConfig> {
  const db = getDatabase();
  const row = db
    .prepare("SELECT data FROM theme_config WHERE id = 'default-theme' LIMIT 1")
    .get() as { data: string } | undefined;

  if (!row) {
    return DEFAULT_THEME_CONFIG;
  }

  try {
    return JSON.parse(row.data) as ThemeConfig;
  } catch {
    return DEFAULT_THEME_CONFIG;
  }
}

export async function sqliteSaveThemeConfig(theme: ThemeConfig): Promise<ThemeConfig> {
  const db = getDatabase();
  const now = new Date().toISOString();

  // Obtener tema anterior para verificar si el logo cambió
  const oldTheme = await sqliteGetThemeConfig();

  const updatedTheme: ThemeConfig = {
    ...theme,
    updatedAt: now,
  };

  const stmt = db.prepare(
    "INSERT OR REPLACE INTO theme_config (id, data, updated_at) VALUES (?, ?, ?)"
  );
  stmt.run("default-theme", JSON.stringify(updatedTheme), now);

  // Limpieza de imagen residual de logotipo si se cambió o eliminó
  const oldLogo = oldTheme.business?.logoUrl;
  const newLogo = updatedTheme.business?.logoUrl;
  if (oldLogo && oldLogo !== newLogo && isLocalUpload(oldLogo)) {
    if (!isImageUrlInUse(oldLogo)) {
      await safeDeleteUploadedFile(oldLogo);
    }
  }

  return updatedTheme;
}

export async function sqliteGetCategories(): Promise<Category[]> {
  const db = getDatabase();
  const rows = db.prepare("SELECT * FROM categories ORDER BY order_index ASC").all();
  return rows.map(rowToCategory);
}

export async function sqliteSaveCategory(category: Category): Promise<Category> {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO categories (id, slug, name, description, icon, order_index)
    VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(order_index) + 1, 0) FROM categories))
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      description = excluded.description,
      icon = excluded.icon
  `);

  stmt.run(category.id, category.slug, category.name, category.description, category.icon);
  return category;
}

export async function sqliteGetCatalogItems(options?: {
  includeInactive?: boolean;
}): Promise<CatalogItem[]> {
  const db = getDatabase();
  let query = "SELECT * FROM catalog_items";
  if (!options?.includeInactive) {
    query += " WHERE active = 1";
  }
  query += " ORDER BY created_at DESC";

  const rows = db.prepare(query).all();
  return rows.map(rowToCatalogItem);
}

export async function sqliteGetCatalogItemBySlug(
  slug: string
): Promise<CatalogItem | undefined> {
  const db = getDatabase();
  const row = db
    .prepare("SELECT * FROM catalog_items WHERE slug = ? LIMIT 1")
    .get(slug);

  if (!row) return undefined;
  return rowToCatalogItem(row);
}

export async function sqliteGetCatalogItemById(
  id: string
): Promise<CatalogItem | undefined> {
  const db = getDatabase();
  const row = db
    .prepare("SELECT * FROM catalog_items WHERE id = ? LIMIT 1")
    .get(id);

  if (!row) return undefined;
  return rowToCatalogItem(row);
}

export async function sqliteSaveCatalogItem(item: CatalogItem): Promise<CatalogItem> {
  const db = getDatabase();
  const id = item.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // Buscar si existía previamente para detectar cambio de imagen
  const existing = await sqliteGetCatalogItemById(id);

  const stmt = db.prepare(`
    INSERT INTO catalog_items (
      id, slug, name, short_description, description, type, category_slug,
      price_label, reference_price, promotional_price, stock_type, stock_quantity,
      image_url, badges, specs, featured, active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      short_description = excluded.short_description,
      description = excluded.description,
      type = excluded.type,
      category_slug = excluded.category_slug,
      price_label = excluded.price_label,
      reference_price = excluded.reference_price,
      promotional_price = excluded.promotional_price,
      stock_type = excluded.stock_type,
      stock_quantity = excluded.stock_quantity,
      image_url = excluded.image_url,
      badges = excluded.badges,
      specs = excluded.specs,
      featured = excluded.featured,
      active = excluded.active,
      updated_at = excluded.updated_at
  `);

  stmt.run(
    id,
    item.slug,
    item.name,
    item.shortDescription || "",
    item.description || "",
    item.type,
    item.categorySlug,
    item.priceLabel,
    item.referencePrice ?? null,
    item.promotionalPrice ?? null,
    item.stockType || "infinite",
    item.stockQuantity ?? null,
    item.imageUrl,
    JSON.stringify(item.badges || []),
    JSON.stringify(item.specs || []),
    item.featured ? 1 : 0,
    item.active !== false ? 1 : 0,
    now,
    now
  );

  const savedItem: CatalogItem = {
    ...item,
    id,
  };

  // Limpieza de imagen residual si se actualizó la imagen de un producto existente
  if (existing && existing.imageUrl !== item.imageUrl && isLocalUpload(existing.imageUrl)) {
    if (!isImageUrlInUse(existing.imageUrl, id)) {
      await safeDeleteUploadedFile(existing.imageUrl);
    }
  }

  return savedItem;
}

export async function sqliteDeleteCatalogItem(id: string): Promise<boolean> {
  const db = getDatabase();
  const existing = await sqliteGetCatalogItemById(id);
  if (!existing) return false;

  const info = db.prepare("DELETE FROM catalog_items WHERE id = ?").run(id);
  const deleted = info.changes > 0;

  // Si se eliminó y tenía una imagen local, verificar si quedó huérfana y borrarla del disco
  if (deleted && existing.imageUrl && isLocalUpload(existing.imageUrl)) {
    if (!isImageUrlInUse(existing.imageUrl)) {
      await safeDeleteUploadedFile(existing.imageUrl);
    }
  }

  return deleted;
}

export async function sqliteDeleteCatalogItems(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const db = getDatabase();

  // Obtener ítems antes de eliminarlos para conocer sus imágenes
  const placeholders = ids.map(() => "?").join(",");
  const rows = db
    .prepare(`SELECT * FROM catalog_items WHERE id IN (${placeholders})`)
    .all(...ids);
  const itemsToDelete = rows.map(rowToCatalogItem);

  const info = db
    .prepare(`DELETE FROM catalog_items WHERE id IN (${placeholders})`)
    .run(...ids);
  const deletedCount = info.changes;

  // Limpieza de imágenes locales huérfanas
  for (const item of itemsToDelete) {
    if (item.imageUrl && isLocalUpload(item.imageUrl)) {
      if (!isImageUrlInUse(item.imageUrl)) {
        await safeDeleteUploadedFile(item.imageUrl);
      }
    }
  }

  return deletedCount;
}

export async function sqliteBulkUpdateCatalogItems(
  ids: string[],
  updates: Partial<CatalogItem>
): Promise<number> {
  if (ids.length === 0) return 0;
  const db = getDatabase();

  const setClauses: string[] = [];
  const params: unknown[] = [];

  if (updates.active !== undefined) {
    setClauses.push("active = ?");
    params.push(updates.active ? 1 : 0);
  }
  if (updates.featured !== undefined) {
    setClauses.push("featured = ?");
    params.push(updates.featured ? 1 : 0);
  }
  if (updates.categorySlug !== undefined) {
    setClauses.push("category_slug = ?");
    params.push(updates.categorySlug);
  }

  if (setClauses.length === 0) return 0;

  setClauses.push("updated_at = ?");
  params.push(new Date().toISOString());

  const placeholders = ids.map(() => "?").join(",");
  const query = `UPDATE catalog_items SET ${setClauses.join(", ")} WHERE id IN (${placeholders})`;

  const info = db.prepare(query).run(...params, ...ids);
  return info.changes;
}

export async function sqliteToggleCatalogItemActive(
  id: string
): Promise<CatalogItem | undefined> {
  const db = getDatabase();
  const existing = await sqliteGetCatalogItemById(id);
  if (!existing) return undefined;

  const newActive = !existing.active;
  db.prepare("UPDATE catalog_items SET active = ?, updated_at = ? WHERE id = ?").run(
    newActive ? 1 : 0,
    new Date().toISOString(),
    id
  );

  return {
    ...existing,
    active: newActive,
  };
}

export async function sqliteToggleCatalogItemFeatured(
  id: string
): Promise<CatalogItem | undefined> {
  const db = getDatabase();
  const existing = await sqliteGetCatalogItemById(id);
  if (!existing) return undefined;

  const newFeatured = !existing.featured;
  db.prepare("UPDATE catalog_items SET featured = ?, updated_at = ? WHERE id = ?").run(
    newFeatured ? 1 : 0,
    new Date().toISOString(),
    id
  );

  return {
    ...existing,
    featured: newFeatured,
  };
}
