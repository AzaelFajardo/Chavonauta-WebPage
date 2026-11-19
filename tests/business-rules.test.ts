import { describe, it, expect } from "vitest";
import { repository } from "@/lib/data/repository";
import { SectionType } from "@/types";
import { resolveHeroIconPack, THEME_DEFAULT_ICON_PACK, PRESET_PALETTES } from "@/lib/theme-engine";
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

  it("enforces rule 9: Social media links in Footer render dynamically only when configured", () => {
    const footerPath = path.join(
      process.cwd(),
      "src",
      "components",
      "storefront",
      "Footer.tsx"
    );
    expect(fs.existsSync(footerPath)).toBe(true);
    const content = fs.readFileSync(footerPath, "utf-8");

    // Verificar que Footer verifique condicionalmente socialLinks
    expect(content).toContain("business.socialLinks?.facebook");
    expect(content).toContain("business.socialLinks?.instagram");
    expect(content).toContain("business.socialLinks?.tiktok");

    // Verificar atributos de seguridad y accesibilidad
    expect(content).toContain('target="_blank"');
    expect(content).toContain('rel="noopener noreferrer"');
    expect(content).toContain('aria-label="Facebook de Chavonauta"');
    expect(content).toContain('aria-label="Instagram de Chavonauta"');
    expect(content).toContain('aria-label="TikTok de Chavonauta"');
  });

  it("enforces rule 10: Customizer active selections use consistent blue styling instead of dark", () => {
    const paletteEditorPath = path.join(
      process.cwd(),
      "src",
      "components",
      "customizer",
      "ColorPaletteEditor.tsx"
    );
    expect(fs.existsSync(paletteEditorPath)).toBe(true);
    const content = fs.readFileSync(paletteEditorPath, "utf-8");

    // Verificar que la selección de radio/bordes use borde y fondo azul en lugar de bg-slate-900
    expect(content).toContain("border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/20 shadow-xs");

    // Verificar que la selección de tipografía use borde y fondo azul con check azul
    expect(content).toContain("border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 shadow-xs");
    expect(content).toContain("rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0");

    // Verificar que las categorías de filtros activas usen bg-blue-600
    expect(content).toContain("bg-blue-600 text-white font-bold shadow-2xs");
  });

  it("enforces rule 11: Hero falling icons feature is modular, minimal, clipped to hero, and configurable", () => {
    // 1. Verificar resolución alegórica automática según paletas oficiales
    expect(resolveHeroIconPack("auto", PRESET_PALETTES.navidad.palette, "Navidad")).toBe("christmas");
    expect(resolveHeroIconPack("auto", PRESET_PALETTES.halloween.palette, "Halloween")).toBe("halloween");
    expect(resolveHeroIconPack("auto", PRESET_PALETTES.chavonauta_dark.palette, "Espacial")).toBe("space");
    expect(resolveHeroIconPack("auto", PRESET_PALETTES.cyberpunk.palette, "Cyber")).toBe("gaming");
    expect(resolveHeroIconPack("auto", PRESET_PALETTES.oceano.palette, "Océano")).toBe("ocean");
    expect(resolveHeroIconPack("auto", PRESET_PALETTES.cafe.palette, "Moca")).toBe("coffee");
    expect(resolveHeroIconPack("auto", PRESET_PALETTES.glaciar.palette, "Glaciar")).toBe("winter");
    expect(resolveHeroIconPack("auto", PRESET_PALETTES.febrero.palette, "Romance")).toBe("romance");

    // 2. Verificar que selección manual tenga precedencia sobre automático
    expect(resolveHeroIconPack("space", PRESET_PALETTES.navidad.palette, "Navidad")).toBe("space");
    expect(resolveHeroIconPack("christmas", PRESET_PALETTES.chavonauta_navy.palette, "Oficial")).toBe("christmas");

    // 3. Verificar que el componente HeroFallingIcons existe y tiene estilos de contorno minimalistas
    const componentPath = path.join(
      process.cwd(),
      "src",
      "components",
      "sections",
      "HeroFallingIcons.tsx"
    );
    expect(fs.existsSync(componentPath)).toBe(true);
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    // SVG solo contorno y stroke minimalista
    expect(componentContent).toContain('fill: "none"');
    expect(componentContent).toContain('stroke: "currentColor"');
    expect(componentContent).toContain("overflow-hidden");

    // 4. Verificar que SectionRenderer contiene HeroFallingIcons y tiene overflow-hidden para cortar la cascada
    const sectionRendererPath = path.join(
      process.cwd(),
      "src",
      "components",
      "sections",
      "SectionRenderer.tsx"
    );
    const rendererContent = fs.readFileSync(sectionRendererPath, "utf-8");
    expect(rendererContent).toContain("<HeroFallingIcons");
    expect(rendererContent).toMatch(/overflow-hidden.*shadow-inner/);

    // 5. Verificar que la cascada sea opcional (solo se renderiza cuando enabled === true)
    expect(componentContent).toContain("config?.enabled === true");

    // 6. Verificar que SortableSectionItem expone el checkbox (check) de activación opcional y selector de paquetes
    const sortablePath = path.join(
      process.cwd(),
      "src",
      "components",
      "customizer",
      "SortableSectionItem.tsx"
    );
    const sortableContent = fs.readFileSync(sortablePath, "utf-8");
    expect(sortableContent).toContain('type="checkbox"');
    expect(sortableContent).toContain("Activar Cascada");
    expect(sortableContent).toContain("Paquete de Iconos Alegóricos");
    expect(sortableContent).toContain("christmas");
    expect(sortableContent).toContain("halloween");

    // 7. Verificar que ColorPaletteEditor incluye el check opcional y selector completo de cascada
    const paletteEditorPath = path.join(
      process.cwd(),
      "src",
      "components",
      "customizer",
      "ColorPaletteEditor.tsx"
    );
    const paletteEditorContent = fs.readFileSync(paletteEditorPath, "utf-8");
    expect(paletteEditorContent).toContain('type="checkbox"');
    expect(paletteEditorContent).toContain("Activar Cascada");
    expect(paletteEditorContent).toContain("Paquete de Iconos Alegóricos");
    expect(paletteEditorContent).toContain("Activar Cascada para este tema");
  });

  it("enforces rule 12: No emoji symbols in customizer/storefront UI, and custom theme presets support cascade packs", () => {
    // 1. Verificar que no existan emojis en componentes del personalizador
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;

    const customizerFiles = [
      "src/components/customizer/ColorPaletteEditor.tsx",
      "src/components/customizer/SortableSectionItem.tsx",
      "src/components/customizer/AdminCustomizerManager.tsx",
    ];

    for (const relPath of customizerFiles) {
      const fullPath = path.join(process.cwd(), relPath);
      const content = fs.readFileSync(fullPath, "utf-8");
      expect(emojiRegex.test(content), `El archivo ${relPath} no debe contener emojis`).toBe(false);
    }

    // 2. Verificar que CustomPreset en types soporte fallingIconsPack y fallingIconsEnabled
    const typesPath = path.join(process.cwd(), "src", "types", "index.ts");
    const typesContent = fs.readFileSync(typesPath, "utf-8");
    expect(typesContent).toContain("fallingIconsPack?: HeroIconPackKey;");
    expect(typesContent).toContain("fallingIconsEnabled?: boolean;");
  });
});
