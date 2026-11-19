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

  it("enforces rule 5: Computer rental rates configuration is valid and positive", async () => {
    const theme = await repository.getThemeConfig();
    const ratesSection = theme.sections.find((s) => s.type === "rates");

    expect(ratesSection).toBeDefined();

    const computerRates =
      (ratesSection?.content?.computerRates as { oneHour?: number; halfHour?: number } | undefined) ||
      theme.business.computerRates;

    expect(computerRates).toBeDefined();
    expect(computerRates?.oneHour).toBeGreaterThan(0);
    expect(computerRates?.halfHour).toBeGreaterThan(0);
    // La tarifa de 1 hora debe ser mayor que la de media hora
    expect(computerRates!.oneHour).toBeGreaterThan(computerRates!.halfHour!);
  });

  it("enforces rule 6: Navbar search bar has responsive department filter constraint and min-w-0", () => {
    const navbarFile = path.join(
      process.cwd(),
      "src",
      "components",
      "storefront",
      "Navbar.tsx"
    );
    expect(fs.existsSync(navbarFile)).toBe(true);

    const content = fs.readFileSync(navbarFile, "utf-8");

    // Verificar que el contenedor del filtro de departamentos tenga ancho controlado y shrink-0
    expect(content).toContain("shrink-0");
    expect(content).toMatch(/w-\[\d+px\]/);
    expect(content).toContain("truncate");

    // Verificar que el input tenga min-w-0 para evitar desbordes y cortes en tablets
    expect(content).toContain("min-w-0");

    // Verificar que el buscador use breakpoint consistente md:
    expect(content).toContain("hidden md:flex");
    expect(content).toContain("md:hidden");
  });

  it("enforces rule 7: Admin navigation places hamburger menu on the left and provides mobile view modes", () => {
    const adminNavFile = path.join(
      process.cwd(),
      "src",
      "components",
      "admin",
      "AdminNav.tsx"
    );
    expect(fs.existsSync(adminNavFile)).toBe(true);
    const navContent = fs.readFileSync(adminNavFile, "utf-8");

    // Verificar que el botón hamburguesa esté colocado antes de la marca/título en el header móvil
    const buttonIndex = navContent.indexOf("aria-label={mobileMenuOpen ? \"Cerrar menú\" : \"Abrir menú\"}");
    const titleIndex = navContent.indexOf("Panel de Control");
    expect(buttonIndex).toBeGreaterThan(-1);
    expect(titleIndex).toBeGreaterThan(-1);
    expect(buttonIndex).toBeLessThan(titleIndex);

    // Verificar que el Personalizador soporte vista móvil dedicada (Editor vs Preview)
    const customizerFile = path.join(
      process.cwd(),
      "src",
      "components",
      "customizer",
      "AdminCustomizerManager.tsx"
    );
    expect(fs.existsSync(customizerFile)).toBe(true);
    const customizerContent = fs.readFileSync(customizerFile, "utf-8");
    expect(customizerContent).toContain("mobileViewMode");

    // Verificar que el Catálogo proporcione representación de tarjetas móviles
    const catalogFile = path.join(
      process.cwd(),
      "src",
      "components",
      "admin",
      "AdminCatalogManager.tsx"
    );
    expect(fs.existsSync(catalogFile)).toBe(true);
    const catalogContent = fs.readFileSync(catalogFile, "utf-8");
    expect(catalogContent).toContain("md:hidden divide-y");

    // Verificar que Configuración tenga offset responsivo en su barra sticky para evitar colisión con AdminNav
    const settingsFile = path.join(
      process.cwd(),
      "src",
      "components",
      "admin",
      "AdminSettingsManager.tsx"
    );
    expect(fs.existsSync(settingsFile)).toBe(true);
    const settingsContent = fs.readFileSync(settingsFile, "utf-8");
    expect(settingsContent).toMatch(/sticky top-\[\d+px\]/);
  });

  it("enforces rule 8: Favicon assets exist across all standard sizes and are declared in root metadata", () => {
    const requiredPublicFiles = [
      "favicon.ico",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "apple-touch-icon.png",
      "android-chrome-192x192.png",
      "android-chrome-512x512.png",
      "site.webmanifest",
    ];

    for (const file of requiredPublicFiles) {
      const filePath = path.join(process.cwd(), "public", file);
      expect(fs.existsSync(filePath), `Archivo public/${file} debe existir`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size, `Archivo public/${file} no debe estar vacío`).toBeGreaterThan(100);
    }

    // Verificar que NO exista src/app/favicon.ico para evitar conflicto de rutas estáticas con public/favicon.ico
    expect(fs.existsSync(path.join(process.cwd(), "src", "app", "favicon.ico"))).toBe(false);

    // Root layout metadata declaration
    const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");
    expect(layoutContent).toContain("icons:");
    expect(layoutContent).toContain("manifest:");
  });
});
