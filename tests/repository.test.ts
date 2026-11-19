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

  it("retrieves and records analytics metrics properly", async () => {
    // 1. Obtener analíticas iniciales
    const stats = await repository.getAnalytics();
    expect(stats).toBeDefined();
    expect(typeof stats.totalWhatsappClicks).toBe("number");
    expect(typeof stats.totalSearches).toBe("number");
    expect(typeof stats.totalLocationClicks).toBe("number");
    expect(typeof stats.totalCatalogViews).toBe("number");
    expect(Array.isArray(stats.topItems)).toBe(true);
    expect(Array.isArray(stats.topSearches)).toBe(true);
    expect(Array.isArray(stats.categoryInterest)).toBe(true);
    expect(Array.isArray(stats.ctaBreakdown)).toBe(true);
    expect(Array.isArray(stats.dailyActivity)).toBe(true);
    expect(stats.dailyActivity.length).toBe(7);

    const prevWaClicks = stats.totalWhatsappClicks;
    const prevSearches = stats.totalSearches;

    // 2. Registrar evento de WhatsApp
    const updatedWithWa = await repository.recordAnalyticsEvent({
      type: "whatsapp_click",
      location: "catalog_card",
      itemId: "test-item-metrics",
      itemTitle: "Ítem de Prueba Métrica",
      itemType: "service",
      categorySlug: "servicios-cyber",
    });

    expect(updatedWithWa.totalWhatsappClicks).toBe(prevWaClicks + 1);
    const recordedItem = updatedWithWa.topItems.find((i) => i.itemId === "test-item-metrics");
    expect(recordedItem).toBeDefined();
    expect(recordedItem?.whatsappClicks).toBeGreaterThanOrEqual(1);

    // 3. Registrar búsqueda
    const updatedWithSearch = await repository.recordAnalyticsEvent({
      type: "search",
      query: "termino-test-especial",
      resultsCount: 3,
    });

    expect(updatedWithSearch.totalSearches).toBe(prevSearches + 1);
    const recordedSearch = updatedWithSearch.topSearches.find((s) => s.query === "termino-test-especial");
    expect(recordedSearch).toBeDefined();
    expect(recordedSearch?.resultsCount).toBe(3);

    // 4. Reinicio de analíticas
    const resetStats = await repository.resetAnalytics();
    expect(resetStats.totalWhatsappClicks).toBe(0);
    expect(resetStats.totalSearches).toBe(0);
    expect(resetStats.totalLocationClicks).toBe(0);
    expect(resetStats.totalCatalogViews).toBe(0);
    expect(resetStats.topItems.length).toBe(0);
    expect(resetStats.topSearches.length).toBe(0);

    // Restaurar datos semilla para pruebas y demo
    const { SEED_ANALYTICS } = await import("@/lib/data/seed");
    Object.assign(resetStats, JSON.parse(JSON.stringify(SEED_ANALYTICS)));
    await repository.recordAnalyticsEvent({ type: "catalog_view" });
  });
});
