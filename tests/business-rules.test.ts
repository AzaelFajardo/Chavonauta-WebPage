import { describe, it, expect } from "vitest";
import { repository } from "@/lib/data/repository";
import { SectionType } from "@/types";
import fs from "fs";
import path from "path";

describe("Business Rules & AGENTS.md Compliance - Automated Tests", () => {
  it("enforces rule 1: No shopping cart, checkout, orders or quotation systems exist", () => {
    // Escaneo dinámico de rutas en src/app para asegurar que no se introduzcan rutas de ecommerce transaccional
    const appDir = path.join(process.cwd(), "src", "app");
    
    function findRoutes(dir: string): string[] {
      let results: string[] = [];
      if (!fs.existsSync(dir)) return results;
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results.push(file);
          results = results.concat(findRoutes(fullPath));
        }
      }
      return results;
    }

    const allRouteFolders = findRoutes(appDir).map((f) => f.toLowerCase());

    const forbiddenRouteNames = [
      "cart",
      "carrito",
      "checkout",
      "pagos",
      "payment",
      "ordenes",
      "orders",
      "cotizador",
    ];

    for (const forbidden of forbiddenRouteNames) {
      expect(
        allRouteFolders.includes(forbidden),
        `La ruta prohibida '${forbidden}' NO debe existir según las reglas de negocio de escaparate digital.`
      ).toBe(false);
    }
  });

  it("enforces rule 2: All catalog items have informative pricing and valid types", async () => {
    const items = await repository.getCatalogItems({ includeInactive: true });

    for (const item of items) {
      // Precio informativo no vacío
      expect(item.priceLabel, `El item ${item.slug} debe tener priceLabel informativo`).toBeTruthy();
      expect(item.priceLabel.trim().length).toBeGreaterThan(0);

      // Tipo estrictamente producto o servicio
      expect(["product", "service"]).toContain(item.type);

      // Badges permitidos
      const allowedBadges = ["Nuevo", "Oferta", "Popular", "Destacado"];
      for (const badge of item.badges) {
        expect(
          allowedBadges.includes(badge),
          `El badge '${badge}' en ${item.slug} debe ser uno de los permitidos.`
        ).toBe(true);
      }
    }
  });

  it("enforces rule 3: Sections are modular, well-ordered, and use allowed types", async () => {
    const theme = await repository.getThemeConfig();
    const allowedTypes: SectionType[] = [
      "hero",
      "services",
      "featured_catalog",
      "rates",
      "promo_banner",
      "location",
      "faq",
    ];

    expect(Array.isArray(theme.sections)).toBe(true);
    expect(theme.sections.length).toBeGreaterThan(0);

    const sectionIds = new Set<string>();

    for (const section of theme.sections) {
      expect(section.id, "Section id must be non-empty").toBeTruthy();
      expect(sectionIds.has(section.id), `Section id ${section.id} must be unique`).toBe(false);
      sectionIds.add(section.id);

      expect(allowedTypes).toContain(section.type);
      expect(typeof section.enabled).toBe("boolean");
      expect(typeof section.order).toBe("number");
      expect(section.title).toBeTruthy();
    }
  });

  it("enforces rule 4: Single logo and valid business contact information", async () => {
    const theme = await repository.getThemeConfig();
    const business = theme.business;

    expect(business.name).toBeTruthy();
    expect(typeof business.name).toBe("string");

    // Logotipo único: debe ser string o undefined, nunca un array de múltiples logos
    expect(typeof business.logoUrl === "string" || business.logoUrl === undefined).toBe(true);

    // WhatsApp para CTA de contacto directo válido
    expect(business.whatsappNumber).toBeTruthy();
    expect(business.whatsappNumber.replace(/\D/g, "").length).toBeGreaterThanOrEqual(10);

    // Si tiene logoWidth configurado, debe ser un número positivo coherente
    if (business.logoWidth !== undefined) {
      expect(business.logoWidth).toBeGreaterThanOrEqual(50);
      expect(business.logoWidth).toBeLessThanOrEqual(300);
    }
  });
});
