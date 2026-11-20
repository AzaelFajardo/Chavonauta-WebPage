import { Category, SectionType, ThemeConfig, ThemePalette } from "@/types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_FONT = /^[a-zA-Z0-9\s,'"-]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_MODES: ThemeConfig["mode"][] = ["light", "dark"];
const ALLOWED_RADII: ThemeConfig["radius"][] = [
  "0rem",
  "0.5rem",
  "0.75rem",
  "1rem",
  "9999px",
];
const ALLOWED_SECTIONS: SectionType[] = [
  "hero",
  "services",
  "featured_catalog",
  "rates",
  "promo_banner",
  "location",
  "faq",
];
const ALLOWED_ICON_PACKS = [
  "auto",
  "space",
  "tech",
  "gaming",
  "christmas",
  "halloween",
  "romance",
  "autumn",
  "spring",
  "winter",
  "ocean",
  "coffee",
  "sparkles",
  "patrio",
];
const ALLOWED_DENSITIES = ["subtle", "balanced", "lively"];
const ALLOWED_SPEEDS = ["slow", "normal", "fast"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown, max: number, allowEmpty = true): boolean {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.length > 0);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegativeNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isOptionalUrl(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  return typeof value === "string" && isHttpUrl(value);
}

function isImageUrl(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return isHttpUrl(value);
}

function collectErrors(
  condition: boolean,
  message: string,
  errors: string[]
): void {
  if (!condition) errors.push(message);
}

function validatePalette(value: unknown, errors: string[], prefix: string): boolean {
  if (!isRecord(value)) {
    errors.push(`${prefix}: estructura de colores inválida`);
    return false;
  }

  const fields: Array<keyof ThemePalette> = [
    "background",
    "foreground",
    "primary",
    "primaryForeground",
    "secondary",
    "secondaryForeground",
    "accent",
    "accentForeground",
    "card",
    "cardForeground",
    "muted",
    "mutedForeground",
    "border",
  ];

  for (const field of fields) {
    const color = value[field];
    collectErrors(
      typeof color === "string" && HEX_COLOR.test(color),
      `${prefix}.${field}: color hexadecimal inválido`,
      errors
    );
  }

  return true;
}

function validateBusiness(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("business: estructura inválida");
    return;
  }

  collectErrors(isString(value.name, 120, false), "business.name: obligatorio (máx. 120)", errors);
  collectErrors(isString(value.slogan, 300), "business.slogan: texto demasiado largo", errors);
  collectErrors(
    value.branchName === undefined || isString(value.branchName, 120),
    "business.branchName: texto demasiado largo",
    errors
  );
  collectErrors(
    typeof value.whatsappNumber === "string" &&
      /^\+?[\d\s-]{10,20}$/.test(value.whatsappNumber) &&
      value.whatsappNumber.replace(/\D/g, "").length >= 10 &&
      value.whatsappNumber.replace(/\D/g, "").length <= 15,
    "business.whatsappNumber: debe contener entre 10 y 15 dígitos",
    errors
  );
  collectErrors(
    value.whatsappDisplay === undefined || isString(value.whatsappDisplay, 30),
    "business.whatsappDisplay: texto demasiado largo",
    errors
  );
  collectErrors(
    value.email === undefined ||
      (isString(value.email, 200) &&
        (value.email === "" || EMAIL.test(String(value.email)))),
    "business.email: correo inválido",
    errors
  );
  collectErrors(isString(value.address, 300), "business.address: texto demasiado largo", errors);
  collectErrors(isString(value.schedule, 300), "business.schedule: texto demasiado largo", errors);
  collectErrors(
    value.logoUrl === undefined || value.logoUrl === "" || isString(value.logoUrl, 500) && isImageUrl(value.logoUrl),
    "business.logoUrl: debe ser una ruta /uploads/ o una URL http(s) válida",
    errors
  );
  collectErrors(
    value.logoWidth === undefined ||
      (isFiniteNumber(value.logoWidth) && value.logoWidth >= 50 && value.logoWidth <= 300),
    "business.logoWidth: debe estar entre 50 y 300",
    errors
  );
  collectErrors(
    isOptionalUrl(value.googleMapsUrl),
    "business.googleMapsUrl: URL http(s) inválida",
    errors
  );
  collectErrors(
    value.announcementText === undefined || isString(value.announcementText, 300),
    "business.announcementText: texto demasiado largo",
    errors
  );
  collectErrors(
    value.announcementEnabled === undefined || typeof value.announcementEnabled === "boolean",
    "business.announcementEnabled: debe ser booleano",
    errors
  );

  if (value.computerRates !== undefined) {
    if (!isRecord(value.computerRates)) {
      errors.push("business.computerRates: estructura inválida");
    } else {
      collectErrors(
        isNonNegativeNumber(value.computerRates.oneHour),
        "business.computerRates.oneHour: importe inválido",
        errors
      );
      collectErrors(
        isNonNegativeNumber(value.computerRates.halfHour),
        "business.computerRates.halfHour: importe inválido",
        errors
      );
    }
  }

  if (value.scheduleDetails !== undefined) {
    if (!Array.isArray(value.scheduleDetails)) {
      errors.push("business.scheduleDetails: debe ser una lista");
    } else {
      collectErrors(
        value.scheduleDetails.length <= 14,
        "business.scheduleDetails: demasiados días",
        errors
      );
      value.scheduleDetails.forEach((item, index) => {
        if (!isRecord(item) || !isString(item.day, 60, false) || !isString(item.hours, 60)) {
          errors.push(`business.scheduleDetails[${index}]: día u horario inválido`);
        }
      });
    }
  }

  if (value.socialLinks !== undefined) {
    if (!isRecord(value.socialLinks)) {
      errors.push("business.socialLinks: estructura inválida");
    } else {
      for (const key of ["facebook", "instagram", "tiktok"] as const) {
        collectErrors(
          isOptionalUrl(value.socialLinks[key]),
          `business.socialLinks.${key}: URL http(s) inválida`,
          errors
        );
      }
    }
  }
}

function validateSections(value: unknown, errors: string[]): void {
  if (!Array.isArray(value)) {
    errors.push("sections: debe ser una lista");
    return;
  }

  collectErrors(value.length <= 30, "sections: demasiadas secciones", errors);

  const ids = new Set<string>();

  value.forEach((section, index) => {
    if (!isRecord(section)) {
      errors.push(`sections[${index}]: estructura inválida`);
      return;
    }

    const id = section.id;
    collectErrors(
      isString(id, 80, false),
      `sections[${index}].id: obligatorio (máx. 80)`,
      errors
    );

    if (typeof id === "string") {
      collectErrors(!ids.has(id), `sections[${index}].id: identificador duplicado`, errors);
      ids.add(id);
    }

    collectErrors(
      typeof section.type === "string" && ALLOWED_SECTIONS.includes(section.type as SectionType),
      `sections[${index}].type: tipo no permitido`,
      errors
    );
    collectErrors(isString(section.title, 200), `sections[${index}].title: inválido`, errors);
    collectErrors(
      section.subtitle === undefined || isString(section.subtitle, 500),
      `sections[${index}].subtitle: inválido`,
      errors
    );
    collectErrors(
      typeof section.enabled === "boolean",
      `sections[${index}].enabled: debe ser booleano`,
      errors
    );
    collectErrors(
      isFiniteNumber(section.order),
      `sections[${index}].order: debe ser numérico`,
      errors
    );
    collectErrors(
      isRecord(section.content),
      `sections[${index}].content: debe ser un objeto`,
      errors
    );

    if (section.type === "hero" && isRecord(section.content) && section.content.fallingIcons) {
      const falling = section.content.fallingIcons;
      if (!isRecord(falling)) {
        errors.push(`sections[${index}].content.fallingIcons: estructura inválida`);
      } else {
        collectErrors(
          falling.enabled === undefined || typeof falling.enabled === "boolean",
          `sections[${index}].content.fallingIcons.enabled: debe ser booleano`,
          errors
        );
        collectErrors(
          falling.pack === undefined ||
            (typeof falling.pack === "string" && ALLOWED_ICON_PACKS.includes(falling.pack)),
          `sections[${index}].content.fallingIcons.pack: valor no permitido`,
          errors
        );
        collectErrors(
          falling.density === undefined ||
            (typeof falling.density === "string" && ALLOWED_DENSITIES.includes(falling.density)),
          `sections[${index}].content.fallingIcons.density: valor no permitido`,
          errors
        );
        collectErrors(
          falling.speed === undefined ||
            (typeof falling.speed === "string" && ALLOWED_SPEEDS.includes(falling.speed)),
          `sections[${index}].content.fallingIcons.speed: valor no permitido`,
          errors
        );
      }
    }
  });
}

function validateCustomPresets(value: unknown, errors: string[]): void {
  if (value === undefined) return;

  if (!Array.isArray(value)) {
    errors.push("customPresets: debe ser una lista");
    return;
  }

  collectErrors(value.length <= 50, "customPresets: demasiadas paletas", errors);

  value.forEach((preset, index) => {
    if (!isRecord(preset)) {
      errors.push(`customPresets[${index}]: estructura inválida`);
      return;
    }

    collectErrors(
      isString(preset.id, 80, false),
      `customPresets[${index}].id: obligatorio`,
      errors
    );
    collectErrors(
      isString(preset.label, 50, false),
      `customPresets[${index}].label: obligatorio (máx. 50)`,
      errors
    );
    collectErrors(
      typeof preset.mode === "string" &&
        ALLOWED_MODES.includes(preset.mode as ThemeConfig["mode"]),
      `customPresets[${index}].mode: inválido`,
      errors
    );
    validatePalette(preset.palette, errors, `customPresets[${index}].palette`);

    if (preset.fallingIconsPack !== undefined) {
      collectErrors(
        typeof preset.fallingIconsPack === "string" &&
          ALLOWED_ICON_PACKS.includes(preset.fallingIconsPack),
        `customPresets[${index}].fallingIconsPack: valor no permitido`,
        errors
      );
    }
    collectErrors(
      preset.fallingIconsEnabled === undefined ||
        typeof preset.fallingIconsEnabled === "boolean",
      `customPresets[${index}].fallingIconsEnabled: debe ser booleano`,
      errors
    );
  });
}

export function validateThemeConfig(value: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { valid: false, errors: ["La configuración debe ser un objeto."] };
  }

  collectErrors(isString(value.id, 100, false), "id: obligatorio (máx. 100)", errors);
  collectErrors(isString(value.name, 100, false), "name: obligatorio (máx. 100)", errors);
  collectErrors(
    typeof value.mode === "string" && ALLOWED_MODES.includes(value.mode as ThemeConfig["mode"]),
    "mode: debe ser 'light' o 'dark'",
    errors
  );
  collectErrors(
    typeof value.radius === "string" &&
      ALLOWED_RADII.includes(value.radius as ThemeConfig["radius"]),
    "radius: valor no permitido",
    errors
  );

  validatePalette(value.palette, errors, "palette");

  if (!isRecord(value.fonts)) {
    errors.push("fonts: estructura inválida");
  } else {
    collectErrors(
      typeof value.fonts.heading === "string" &&
        value.fonts.heading.length > 0 &&
        value.fonts.heading.length <= 100 &&
        SAFE_FONT.test(value.fonts.heading),
      "fonts.heading: valor no permitido",
      errors
    );
    collectErrors(
      typeof value.fonts.body === "string" &&
        value.fonts.body.length > 0 &&
        value.fonts.body.length <= 100 &&
        SAFE_FONT.test(value.fonts.body),
      "fonts.body: valor no permitido",
      errors
    );
  }

  validateBusiness(value.business, errors);
  validateSections(value.sections, errors);
  validateCustomPresets(value.customPresets, errors);

  return { valid: errors.length === 0, errors: errors.slice(0, 12) };
}

export function validateCatalogItemInput(
  value: unknown,
  categories: Category[]
): ValidationResult {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { valid: false, errors: ["El producto debe ser un objeto."] };
  }

  collectErrors(
    value.id === undefined || isString(value.id, 100),
    "id: inválido",
    errors
  );
  collectErrors(isString(value.name, 200, false), "name: obligatorio (máx. 200)", errors);
  collectErrors(
    value.type === "product" || value.type === "service",
    "type: debe ser 'product' o 'service'",
    errors
  );
  collectErrors(
    typeof value.categorySlug === "string" &&
      value.categorySlug.length > 0 &&
      value.categorySlug.length <= 80 &&
      categories.some((category) => category.slug === value.categorySlug),
    "categorySlug: categoría inexistente",
    errors
  );
  collectErrors(
    value.slug === undefined ||
      (typeof value.slug === "string" &&
        value.slug.length > 0 &&
        value.slug.length <= 120 &&
        SAFE_SLUG.test(value.slug)),
    "slug: usa solo minúsculas, números y guiones",
    errors
  );
  collectErrors(
    value.shortDescription === undefined || isString(value.shortDescription, 300),
    "shortDescription: texto demasiado largo",
    errors
  );
  collectErrors(
    value.description === undefined || isString(value.description, 5000),
    "description: texto demasiado largo",
    errors
  );
  collectErrors(
    value.priceLabel === undefined || isString(value.priceLabel, 100),
    "priceLabel: inválido",
    errors
  );
  collectErrors(
    value.referencePrice === undefined || isNonNegativeNumber(value.referencePrice),
    "referencePrice: importe inválido",
    errors
  );
  collectErrors(
    value.promotionalPrice === undefined || isNonNegativeNumber(value.promotionalPrice),
    "promotionalPrice: importe inválido",
    errors
  );
  collectErrors(
    value.stockType === undefined ||
      value.stockType === "infinite" ||
      value.stockType === "limited",
    "stockType: valor no permitido",
    errors
  );
  collectErrors(
    value.stockQuantity === undefined ||
      (isFiniteNumber(value.stockQuantity) &&
        Number.isInteger(value.stockQuantity) &&
        value.stockQuantity >= 0),
    "stockQuantity: debe ser un entero no negativo",
    errors
  );
  collectErrors(
    value.imageUrl === undefined ||
      value.imageUrl === "" ||
      isImageUrl(value.imageUrl),
    "imageUrl: debe ser una ruta /uploads/ o una URL http(s) válida",
    errors
  );
  collectErrors(
    value.featured === undefined || typeof value.featured === "boolean",
    "featured: debe ser booleano",
    errors
  );
  collectErrors(
    value.active === undefined || typeof value.active === "boolean",
    "active: debe ser booleano",
    errors
  );

  if (value.badges !== undefined) {
    if (!Array.isArray(value.badges) || value.badges.length > 10) {
      errors.push("badges: máximo 10 etiquetas");
    } else if (!value.badges.every((badge) => isString(badge, 40, false))) {
      errors.push("badges: cada etiqueta debe ser texto de hasta 40 caracteres");
    }
  }

  if (value.specs !== undefined) {
    if (!Array.isArray(value.specs) || value.specs.length > 30) {
      errors.push("specs: máximo 30 especificaciones");
    } else {
      value.specs.forEach((spec, index) => {
        if (!isRecord(spec) || !isString(spec.label, 80, false) || !isString(spec.value, 300)) {
          errors.push(`specs[${index}]: especificación inválida`);
        }
      });
    }
  }

  return { valid: errors.length === 0, errors: errors.slice(0, 12) };
}

export function validateCategoryInput(value: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { valid: false, errors: ["La categoría debe ser un objeto."] };
  }

  collectErrors(isString(value.name, 100, false), "name: obligatorio (máx. 100)", errors);
  collectErrors(
    value.slug === undefined ||
      value.slug === "" ||
      (typeof value.slug === "string" && value.slug.length <= 120 && SAFE_SLUG.test(value.slug)),
    "slug: usa solo minúsculas, números y guiones",
    errors
  );
  collectErrors(
    value.description === undefined || isString(value.description, 300),
    "description: texto demasiado largo",
    errors
  );
  collectErrors(value.icon === undefined || isString(value.icon, 50), "icon: inválido", errors);
  collectErrors(value.id === undefined || isString(value.id, 100), "id: inválido", errors);

  return { valid: errors.length === 0, errors: errors.slice(0, 12) };
}

export function getSafeExternalUrl(value: string | undefined): string | null {
  if (!value) return null;
  return isHttpUrl(value) ? value : null;
}
