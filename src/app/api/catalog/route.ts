import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
import { requireAdminSession } from "@/lib/auth/require-session";
import { isPayloadTooLarge } from "@/lib/http/request";
import { validateCatalogItemInput } from "@/lib/validation";
import { CatalogItem } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase().trim();

    const [categories, allItems] = await Promise.all([
      repository.getCategories(),
      repository.getCatalogItems({ includeInactive }),
    ]);

    let items = allItems;

    if (category) {
      items = items.filter((item) => item.categorySlug === category);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.shortDescription.toLowerCase().includes(search) ||
          item.slug.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ categories, items });
  } catch (error) {
    console.error("Error al obtener catálogo:", error);
    return NextResponse.json(
      { error: "Error al obtener catálogo" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  if (isPayloadTooLarge(request)) {
    return NextResponse.json(
      { error: "Los datos del producto son demasiado grandes." },
      { status: 413 }
    );
  }

  try {
    const body = await request.json().catch(() => null);

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Los datos del producto son inválidos." },
        { status: 400 }
      );
    }

    const categories = await repository.getCategories();
    const validation = validateCatalogItemInput(body, categories);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Producto o servicio inválido.",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const payload = body as Partial<CatalogItem>;

    const generatedSlug = payload.name
      ? payload.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : "";

    const slug = payload.slug?.trim() || generatedSlug || `item-${Date.now()}`;

    const itemToSave: CatalogItem = {
      id: payload.id || "",
      slug,
      name: payload.name!.trim(),
      shortDescription: payload.shortDescription?.trim() || "",
      description:
        payload.description?.trim() || payload.shortDescription?.trim() || "",
      type: payload.type!,
      categorySlug: payload.categorySlug!,
      priceLabel: payload.priceLabel?.trim() || "Consultar en mostrador",
      referencePrice:
        typeof payload.referencePrice === "number"
          ? payload.referencePrice
          : undefined,
      promotionalPrice:
        typeof payload.promotionalPrice === "number"
          ? payload.promotionalPrice
          : undefined,
      stockType: payload.stockType === "limited" ? "limited" : "infinite",
      stockQuantity:
        typeof payload.stockQuantity === "number"
          ? payload.stockQuantity
          : undefined,
      imageUrl:
        payload.imageUrl?.trim() ||
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      badges: Array.isArray(payload.badges) ? payload.badges : [],
      featured: Boolean(payload.featured),
      active: payload.active !== undefined ? Boolean(payload.active) : true,
      specs: Array.isArray(payload.specs) ? payload.specs : [],
    };

    const saved = await repository.saveCatalogItem(itemToSave);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    if (
      error instanceof Error &&
      /UNIQUE constraint failed: catalog_items\.slug/i.test(error.message)
    ) {
      return NextResponse.json(
        { error: "El slug ya está en uso. Elige otro identificador." },
        { status: 409 }
      );
    }

    console.error("Error al guardar ítem de catálogo:", error);
    return NextResponse.json(
      { error: "Error interno al guardar producto/servicio" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    let ids: string[] = [];

    try {
      const body = await request.json();
      if (Array.isArray(body?.ids)) {
        ids = body.ids;
      } else if (body?.id) {
        id = body.id;
      }
    } catch {
      // Ignorar si no hay cuerpo JSON
    }

    if (id && !ids.includes(id)) {
      ids.push(id);
    }

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Se requiere al menos un ID para eliminar" },
        { status: 400 }
      );
    }

    const deletedCount = await repository.deleteCatalogItems(ids);

    return NextResponse.json({ success: true, count: deletedCount, ids });
  } catch (error) {
    console.error("Error al eliminar ítem(s) de catálogo:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar el ítem" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  try {
    const body = await request.json();
    const { id, ids, action } = body;

    const targetIds: string[] = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targetIds.length === 0 || !action) {
      return NextResponse.json(
        { error: "Se requiere ID(s) y acción" },
        { status: 400 }
      );
    }

    if (action === "toggleActive") {
      const updated = await repository.toggleCatalogItemActive(targetIds[0]);
      return NextResponse.json(updated);
    } else if (action === "toggleFeatured") {
      const updated = await repository.toggleCatalogItemFeatured(targetIds[0]);
      return NextResponse.json(updated);
    } else if (action === "bulkPause") {
      const count = await repository.bulkUpdateCatalogItems(targetIds, { active: false });
      return NextResponse.json({ success: true, count });
    } else if (action === "bulkActivate") {
      const count = await repository.bulkUpdateCatalogItems(targetIds, { active: true });
      return NextResponse.json({ success: true, count });
    } else if (action === "bulkFeature") {
      const count = await repository.bulkUpdateCatalogItems(targetIds, { featured: true });
      return NextResponse.json({ success: true, count });
    } else if (action === "bulkUnfeature") {
      const count = await repository.bulkUpdateCatalogItems(targetIds, { featured: false });
      return NextResponse.json({ success: true, count });
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
  } catch (error) {
    console.error("Error al actualizar estado del ítem:", error);
    return NextResponse.json(
      { error: "Error al actualizar estado del ítem" },
      { status: 500 }
    );
  }
}
