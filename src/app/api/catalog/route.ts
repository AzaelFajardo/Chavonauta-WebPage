import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
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
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // Ignorar si no hay cuerpo JSON
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "El ID del ítem es requerido para eliminar" },
        { status: 400 }
      );
    }

    const success = await repository.deleteCatalogItem(id);
    if (!success) {
      return NextResponse.json(
        { error: "Ítem no encontrado o no se pudo eliminar" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error al eliminar ítem de catálogo:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar el ítem" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: "Se requiere ID y acción (toggleActive o toggleFeatured)" },
        { status: 400 }
      );
    }

    let updated: CatalogItem | undefined;

    if (action === "toggleActive") {
      updated = await repository.toggleCatalogItemActive(id);
    } else if (action === "toggleFeatured") {
      updated = await repository.toggleCatalogItemFeatured(id);
    } else {
      return NextResponse.json(
        { error: "Acción no válida. Use toggleActive o toggleFeatured" },
        { status: 400 }
      );
    }

    if (!updated) {
      return NextResponse.json({ error: "Ítem no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error al actualizar estado del ítem:", error);
    return NextResponse.json(
      { error: "Error al actualizar estado del ítem" },
      { status: 500 }
    );
  }
}
