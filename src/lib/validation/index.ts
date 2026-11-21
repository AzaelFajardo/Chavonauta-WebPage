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
  "new_year",
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

function isSafeAppHref(value: unknown): boolean {
  if (value === undefined || value === "") return true;
  if (typeof value !== "string") return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (value.startsWith("#")) return true;
  return isHttpUrl(value);
}

function validateShowcaseCards(
  value: unknown,
  errors: string[],
  prefix: string
): void {
  if (value === undefined) return;

  if (!Array.isArray(value) || value.length > 8) {
    errors.push(`${prefix}: máximo 8 tarjetas`);
    return;
  }

  value.forEach((card, index) => {
    if (!isRecord(card)) {
      errors.push(`${prefix}[${index}]: estructura inválida`);
      return;
    }

    collectErrors(
      typeof card.title === "string" &&
        card.title.length > 0 &&
        card.title.length <= 150,
      `${prefix}[${index}].title: obligatorio (máx. 150)`,
      errors
    );
    collectErrors(
      card.description === undefined || isString(card.description, 500),
      `${prefix}[${index}].description: texto demasiado largo`,
      errors
    );
    collectErrors(
      card.imageUrl === undefined ||
        card.imageUrl === "" ||
        isImageUrl(card.imageUrl),
      `${prefix}[${index}].imageUrl: URL inválida`,
      errors
    );
    collectErrors(
      card.badge === undefined || isString(card.badge, 50),
      `${prefix}[${index}].badge: texto demasiado largo`,
      errors
    );
    collectErrors(
      card.linkLabel === undefined || isString(card.linkLabel, 80),
      `${prefix}[${index}].linkLabel: texto demasiado largo`,
      errors
    );
    collectErrors(
      isSafeAppHref(card.linkHref),
      `${prefix}[${index}].linkHref: enlace no permitido`,
      errors
    );
    collectErrors(
      card.linkWhatsappMessage === undefined ||
        isString(card.linkWhatsappMessage, 300),
      `${prefix}[${index}].linkWhatsappMessage: texto demasiado largo`,
      errors
    );
    collectErrors(
      card.imageLayout === undefined ||
        card.imageLayout === "single" ||
        card.imageLayout === "grid",
      `${prefix}[${index}].imageLayout: valor no permitido`,
      errors
    );
    collectErrors(
      card.showRentRates === undefined ||
        typeof card.showRentRates === "boolean",
      `${prefix}[${index}].showRentRates: debe ser booleano`,
      errors
    );

    if (card.gridItems !== undefined) {
      if (!Array.isArray(card.gridItems) || card.gridItems.length > 6) {
        errors.push(`${prefix}[${index}].gridItems: máximo 6 elementos`);
      } else {
        card.gridItems.forEach((item, itemIndex) => {
          if (
            !isRecord(item) ||
            !isString(item.label, 80, false) ||
            (item.imageUrl !== undefined &&
              item.imageUrl !== "" &&
              !isImageUrl(item.imageUrl)) ||
            !isSafeAppHref(item.href)
          ) {
            errors.push(
              `${prefix}[${index}].gridItems[${itemIndex}]: elemento inválido`
            );
          }
        });
      }
    }
  });
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
        collectErrors(
          falling.targetYear === undefined ||
            (isFiniteNumber(falling.targetYear) &&
              Number.isInteger(falling.targetYear) &&
              falling.targetYear >= 2020 &&
              falling.targetYear <= 2100),
          `sections[${index}].content.fallingIcons.targetYear: año inválido`,
          errors
        );
      }
    }

    if ((section.type === "hero" || section.type === "services") && isRecord(section.content)) {
      if (section.type === "hero") {
        collectErrors(
          section.content.badgeText === undefined ||
            isString(section.content.badgeText, 100),
          `sections[${index}].content.badgeText: inválido`,
          errors
        );
        collectErrors(
          section.content.primaryCtaText === undefined ||
            isString(section.content.primaryCtaText, 50),
          `sections[${index}].content.primaryCtaText: inválido`,
          errors
        );
        collectErrors(
          isSafeAppHref(section.content.primaryCtaHref),
          `sections[${index}].content.primaryCtaHref: enlace no permitido`,
          errors
        );
        collectErrors(
          section.content.secondaryCtaText === undefined ||
            isString(section.content.secondaryCtaText, 50),
          `sections[${index}].content.secondaryCtaText: inválido`,
          errors
        );
        collectErrors(
          isSafeAppHref(section.content.secondaryCtaHref),
          `sections[${index}].content.secondaryCtaHref: enlace no permitido`,
          errors
        );
        collectErrors(
          section.content.sideImageUrl === undefined ||
            section.content.sideImageUrl === "" ||
            isImageUrl(section.content.sideImageUrl),
          `sections[${index}].content.sideImageUrl: URL inválida`,
          errors
        );
        collectErrors(
          section.content.sideImageBadge === undefined ||
            isString(section.content.sideImageBadge, 100),
          `sections[${index}].content.sideImageBadge: inválido`,
          errors
        );
        collectErrors(
          section.content.sideImageUseRate === undefined ||
            typeof section.content.sideImageUseRate === "boolean",
          `sections[${index}].content.sideImageUseRate: debe ser booleano`,
          errors
        );
        collectErrors(
          section.content.showWhatsAppButton === undefined ||
            typeof section.content.showWhatsAppButton === "boolean",
          `sections[${index}].content.showWhatsAppButton: debe ser booleano`,
          errors
        );
        if (section.content.customButtons !== undefined) {
          if (!Array.isArray(section.content.customButtons)) {
            errors.push(`sections[${index}].content.customButtons: debe ser una lista`);
          } else {
            section.content.customButtons.forEach((btn, bIdx) => {
              if (!isRecord(btn)) {
                errors.push(`sections[${index}].content.customButtons[${bIdx}]: estructura inválida`);
              } else {
                collectErrors(
                  btn.label === undefined || isString(btn.label, 50),
                  `sections[${index}].content.customButtons[${bIdx}].label: inválido`,
                  errors
                );
                collectErrors(
                  btn.destination === undefined || isString(btn.destination, 200),
                  `sections[${index}].content.customButtons[${bIdx}].destination: inválido`,
                  errors
                );
                collectErrors(
                  isSafeAppHref(btn.customUrl),
                  `sections[${index}].content.customButtons[${bIdx}].customUrl: URL no permitida`,
                  errors
                );
              }
            });
          }
        }
      }

      validateShowcaseCards(
        section.content.cards,
        errors,
        `sections[${index}].content.cards`
      );
    }

    if (section.type === "promo_banner" && isRecord(section.content)) {
      const content = section.content;
      collectErrors(
        content.text === undefined ||
          (typeof content.text === "string" && content.text.length <= 1000),
        `sections[${index}].content.text: inválido`,
        errors
      );
      collectErrors(
        content.buttonLabel === undefined ||
          (typeof content.buttonLabel === "string" &&
            content.buttonLabel.length <= 50),
        `sections[${index}].content.buttonLabel: inválido`,
        errors
      );
      collectErrors(
        content.badge === undefined ||
          (typeof content.badge === "string" && content.badge.length <= 50),
        `sections[${index}].content.badge: inválido`,
        errors
      );
      collectErrors(
        content.buttonHref === undefined ||
          content.buttonHref === "" ||
          (typeof content.buttonHref === "string" &&
            ((content.buttonHref.startsWith("/") &&
              !content.buttonHref.startsWith("//")) ||
              isHttpUrl(content.buttonHref))),
        `sections[${index}].content.buttonHref: enlace no permitido`,
        errors
      );
    }

    if (section.type === "faq" && isRecord(section.content)) {
      const items = section.content.items;

      if (items !== undefined) {
        if (!Array.isArray(items) || items.length > 30) {
          errors.push(`sections[${index}].content.items: máximo 30 preguntas`);
        } else {
          items.forEach((item, itemIndex) => {
            if (
              !isRecord(item) ||
              typeof item.question !== "string" ||
              item.question.length > 500 ||
              typeof item.answer !== "string" ||
              item.answer.length > 2000
            ) {
              errors.push(
                `sections[${index}].content.items[${itemIndex}]: pregunta o respuesta inválida`
              );
            }
          });
        }
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
  validateAutoSchedule(value.autoSchedule, errors);

  return { valid: errors.length === 0, errors: errors.slice(0, 12) };
}

function validateDatePoint(
  value: unknown,
  pathLabel: string,
  errors: string[]
): void {
  if (!isRecord(value)) {
    errors.push(`${pathLabel}: estructura inválida`);
    return;
  }
  collectErrors(
    isFiniteNumber(value.month) &&
      Number.isInteger(value.month) &&
      value.month >= 1 &&
      value.month <= 12,
    `${pathLabel}.month: mes inválido (1-12)`,
    errors
  );
  collectErrors(
    isFiniteNumber(value.day) &&
      Number.isInteger(value.day) &&
      value.day >= 1 &&
      value.day <= 31,
    `${pathLabel}.day: día inválido (1-31)`,
    errors
  );
}

function validateAutoSchedule(value: unknown, errors: string[]): void {
  if (value === undefined) return;
  if (!isRecord(value)) {
    errors.push("autoSchedule: debe ser un objeto");
    return;
  }

  collectErrors(
    typeof value.enabled === "boolean",
    "autoSchedule.enabled: debe ser booleano",
    errors
  );
  collectErrors(
    isString(value.defaultPresetKey, 100, false),
    "autoSchedule.defaultPresetKey: obligatorio",
    errors
  );

  if (!Array.isArray(value.rules)) {
    errors.push("autoSchedule.rules: debe ser una lista");
    return;
  }

  collectErrors(
    value.rules.length <= 30,
    "autoSchedule.rules: máximo 30 reglas de temporada",
    errors
  );

  value.rules.forEach((rule, idx) => {
    if (!isRecord(rule)) {
      errors.push(`autoSchedule.rules[${idx}]: estructura inválida`);
      return;
    }
    collectErrors(
      isString(rule.id, 80, false),
      `autoSchedule.rules[${idx}].id: obligatorio`,
      errors
    );
    collectErrors(
      isString(rule.name, 80, false),
      `autoSchedule.rules[${idx}].name: obligatorio`,
      errors
    );
    collectErrors(
      isString(rule.presetKey, 100, false),
      `autoSchedule.rules[${idx}].presetKey: obligatorio`,
      errors
    );
    collectErrors(
      typeof rule.enabled === "boolean",
      `autoSchedule.rules[${idx}].enabled: debe ser booleano`,
      errors
    );
    validateDatePoint(
      rule.startDate,
      `autoSchedule.rules[${idx}].startDate`,
      errors
    );
    validateDatePoint(
      rule.endDate,
      `autoSchedule.rules[${idx}].endDate`,
      errors
    );

    if (rule.fallingIconsEnabled !== undefined) {
      collectErrors(
        typeof rule.fallingIconsEnabled === "boolean",
        `autoSchedule.rules[${idx}].fallingIconsEnabled: debe ser booleano`,
        errors
      );
    }
    if (rule.fallingIconsPack !== undefined) {
      collectErrors(
        typeof rule.fallingIconsPack === "string" &&
          ALLOWED_ICON_PACKS.includes(rule.fallingIconsPack),
        `autoSchedule.rules[${idx}].fallingIconsPack: paquete no permitido`,
        errors
      );
    }
    if (rule.heroBadgeTemplate !== undefined) {
      collectErrors(
        isString(rule.heroBadgeTemplate, 120),
        `autoSchedule.rules[${idx}].heroBadgeTemplate: demasiado largo`,
        errors
      );
    }
    if (rule.newYearMode !== undefined) {
      collectErrors(
        rule.newYearMode === "auto" || rule.newYearMode === "custom",
        `autoSchedule.rules[${idx}].newYearMode: inválido`,
        errors
      );
    }
    if (rule.customYear !== undefined) {
      collectErrors(
        isFiniteNumber(rule.customYear) &&
          Number.isInteger(rule.customYear) &&
          rule.customYear >= 2020 &&
          rule.customYear <= 2100,
        `autoSchedule.rules[${idx}].customYear: año fuera de rango (2020-2100)`,
        errors
      );
    }
  });
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
