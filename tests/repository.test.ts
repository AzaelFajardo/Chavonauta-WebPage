import { describe, it, expect } from "vitest";
import { repository } from "@/lib/data/repository";
import { CatalogItem } from "@/types";

describe("Data Repository - Automated Tests", () => {
  it("retrieves valid theme configuration", async () => {
    const theme = await repository.getThemeConfig();

    expect(theme).toBeDefined();
    expect(theme.id).toBeTruthy();
    expect(["dark", "light"]).toContain(theme.mode);
    expect(theme.palette).toBeDefined();
    expect(theme.fonts).toBeDefined();
    expect(theme.business).toBeDefined();
    expect(theme.business.name).toBeTruthy();
    expect(theme.business.whatsappNumber).toBeTruthy();
    expect(Array.isArray(theme.sections)).toBe(true);
    expect(theme.sections.length).toBeGreaterThan(0);
  });

  it("retrieves valid categories with unique slugs", async () => {
    const categories = await repository.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);

    const slugSet = new Set<string>();
    const idSet = new Set<string>();

    for (const cat of categories) {
      expect(cat.id, "Category must have an id").toBeTruthy();
      expect(cat.slug, "Category must have a slug").toBeTruthy();
      expect(cat.name, "Category must have a name").toBeTruthy();
      expect(cat.icon, "Category must have an icon name").toBeTruthy();

      expect(idSet.has(cat.id), `Category id ${cat.id} must be unique`).toBe(false);
      expect(slugSet.has(cat.slug), `Category slug ${cat.slug} must be unique`).toBe(false);

      idSet.add(cat.id);
      slugSet.add(cat.slug);
    }
  });

  it("retrieves catalog items and enforces item contract", async () => {
    const items = await repository.getCatalogItems();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      expect(item.id).toBeTruthy();
      expect(item.slug).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(["product", "service"]).toContain(item.type);
      expect(item.priceLabel).toBeTruthy();
      expect(item.categorySlug).toBeTruthy();
      expect(typeof item.featured).toBe("boolean");
      expect(item.active).toBe(true); // getCatalogItems() por defecto solo retorna activos

      if (item.referencePrice !== undefined) {
        expect(item.referencePrice).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("retrieves all items including inactive when requested", async () => {
    const activeItems = await repository.getCatalogItems({ includeInactive: false });
    const allItems = await repository.getCatalogItems({ includeInactive: true });

    expect(allItems.length).toBeGreaterThanOrEqual(activeItems.length);
    for (const item of activeItems) {
      expect(item.active).toBe(true);
    }
  });

  it("finds item by slug correctly and returns undefined for unknown slug", async () => {
    const items = await repository.getCatalogItems();
    const target = items[0];

    const found = await repository.getCatalogItemBySlug(target.slug);
    expect(found).toBeDefined();
    expect(found?.id).toBe(target.id);
    expect(found?.slug).toBe(target.slug);

    const notFound = await repository.getCatalogItemBySlug("slug-inexistente-12345-xyz");
    expect(notFound).toBeUndefined();
  });

  it("performs dynamic CRUD, status toggling, and cleanup without regressions", async () => {
    const dynamicSlug = `test-item-${Date.now()}`;
    const testItem: CatalogItem = {
      id: `test-${Date.now()}`,
      slug: dynamicSlug,
      name: "Producto de Prueba Dinámica",
      shortDescription: "Descripción breve para pruebas automatizadas",
      description: "Descripción completa para pruebas de persistencia",
      type: "product",
      categorySlug: "accesorios-computo",
      priceLabel: "$99",
      referencePrice: 99,
      imageUrl: "/placeholder.png",
      badges: ["Nuevo"],
      featured: false,
      active: true,
    };

    // 1. Guardar nuevo ítem
    const saved = await repository.saveCatalogItem(testItem);
    expect(saved.id).toBe(testItem.id);

    // 2. Recuperar por ID
    const retrieved = await repository.getCatalogItemById(testItem.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.slug).toBe(dynamicSlug);

    // 3. Alternar estado activo
    const toggledActive = await repository.toggleCatalogItemActive(testItem.id);
    expect(toggledActive).toBeDefined();
    expect(toggledActive?.active).toBe(false);

    // Al estar inactivo, getCatalogItems() por defecto no debe incluirlo
    const defaultItems = await repository.getCatalogItems();
    expect(defaultItems.some((i) => i.id === testItem.id)).toBe(false);

    // Al pedir inactivos, sí debe aparecer
    const withInactive = await repository.getCatalogItems({ includeInactive: true });
    expect(withInactive.some((i) => i.id === testItem.id)).toBe(true);

    // 4. Alternar estado destacado
    const toggledFeatured = await repository.toggleCatalogItemFeatured(testItem.id);
    expect(toggledFeatured).toBeDefined();
    expect(toggledFeatured?.featured).toBe(true);

    // 5. Eliminar y verificar limpieza
    const deleted = await repository.deleteCatalogItem(testItem.id);
    expect(deleted).toBe(true);

    const postDelete = await repository.getCatalogItemById(testItem.id);
    expect(postDelete).toBeUndefined();
  });
});
