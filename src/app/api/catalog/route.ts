import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
import { requireAdminSession } from "@/lib/auth/require-session";
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

  try {
    const body = (await request.json()) as Partial<CatalogItem>;

    if (!body.name || !body.type || !body.categorySlug) {
      return NextResponse.json(
        { error: "Nombre, tipo y categoría son campos obligatorios" },
        { status: 400 }
      );
    }

    // Generar slug si no se proporcionó
    const slug =
      body.slug?.trim() ||
      body.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const itemToSave: CatalogItem = {
      id: body.id || "",
      slug,
      name: body.name.trim(),
      shortDescription: body.shortDescription?.trim() || "",
      description: body.description?.trim() || body.shortDescription?.trim() || "",
      type: body.type,
      categorySlug: body.categorySlug,
      priceLabel: body.priceLabel?.trim() || "Consultar en mostrador",
      referencePrice:
        typeof body.referencePrice === "number" ? body.referencePrice : undefined,
      promotionalPrice:
        typeof body.promotionalPrice === "number" ? body.promotionalPrice : undefined,
      stockType: body.stockType === "limited" ? "limited" : "infinite",
      stockQuantity:
        typeof body.stockQuantity === "number" ? body.stockQuantity : undefined,
      imageUrl:
        body.imageUrl?.trim() ||
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      badges: Array.isArray(body.badges) ? body.badges : [],
      featured: Boolean(body.featured),
      active: body.active !== undefined ? Boolean(body.active) : true,
      specs: Array.isArray(body.specs) ? body.specs : [],
    };

    const saved = await repository.saveCatalogItem(itemToSave);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
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
