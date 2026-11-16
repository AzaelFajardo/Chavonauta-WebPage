import { NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
import { CatalogItem } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("all") === "true";

    const [categories, items] = await Promise.all([
      repository.getCategories(),
      includeAll ? repository.getAllCatalogItems() : repository.getCatalogItems(),
    ]);

    return NextResponse.json({ categories, items });
  } catch (error) {
    console.error("Error al obtener catálogo:", error);
    return NextResponse.json(
      { error: "Error interno al consultar el catálogo" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verificación de acción especial (ej. reset a semillas)
    if (body.action === "reset") {
      const items = await repository.resetCatalog();
      return NextResponse.json({ success: true, message: "Catálogo restaurado a valores iniciales", items });
    }

    const {
      name,
      type,
      categorySlug,
      priceLabel,
      referencePrice,
      shortDescription,
      description,
      imageUrl,
      slug,
      badges,
      featured,
      active,
      specs,
    } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "El nombre del producto o servicio es obligatorio." },
        { status: 400 }
      );
    }

    if (type !== "product" && type !== "service") {
      return NextResponse.json(
        { error: "El tipo debe ser 'product' o 'service'." },
        { status: 400 }
      );
    }

    if (!categorySlug || typeof categorySlug !== "string") {
      return NextResponse.json(
        { error: "La categoría es obligatoria." },
        { status: 400 }
      );
    }

    if (!priceLabel || typeof priceLabel !== "string") {
      return NextResponse.json(
        { error: "El precio o texto de tarifa es obligatorio." },
        { status: 400 }
      );
    }

    const newItemData: Omit<CatalogItem, "id"> & { id?: string } = {
      name: name.trim(),
      type,
      categorySlug: categorySlug.trim(),
      priceLabel: priceLabel.trim(),
      referencePrice: typeof referencePrice === "number" ? referencePrice : Number(referencePrice) || undefined,
      shortDescription: (shortDescription || "").trim(),
      description: (description || shortDescription || name).trim(),
      imageUrl: (imageUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80").trim(),
      slug: (slug || "").trim() || undefined,
      badges: Array.isArray(badges) ? badges : [],
      featured: Boolean(featured),
      active: active !== undefined ? Boolean(active) : true,
      specs: Array.isArray(specs) ? specs : [],
    };

    const created = await repository.createCatalogItem(newItemData);

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (error) {
    console.error("Error al crear artículo en catálogo:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear artículo" },
      { status: 500 }
    );
  }
}
