import { NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await repository.getCatalogItemById(id);

    if (!item) {
      return NextResponse.json(
        { error: `Artículo con ID "${id}" no encontrado.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error al obtener artículo:", error);
    return NextResponse.json(
      { error: "Error interno al consultar artículo" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await repository.getCatalogItemById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `Artículo con ID "${id}" no encontrado.` },
        { status: 404 }
      );
    }

    const updates = { ...body };
    delete updates.id; // Prevent overwriting ID

    if (updates.name && typeof updates.name === "string") {
      updates.name = updates.name.trim();
    }
    if (updates.priceLabel && typeof updates.priceLabel === "string") {
      updates.priceLabel = updates.priceLabel.trim();
    }
    if (updates.referencePrice !== undefined) {
      updates.referencePrice =
        typeof updates.referencePrice === "number"
          ? updates.referencePrice
          : Number(updates.referencePrice) || undefined;
    }

    const updated = await repository.updateCatalogItem(id, updates);
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Error al actualizar artículo:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al actualizar artículo" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await repository.getCatalogItemById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `Artículo con ID "${id}" no encontrado.` },
        { status: 404 }
      );
    }

    let updated;
    if (body.toggle === "active") {
      updated = await repository.toggleCatalogItemActive(id);
    } else {
      updated = await repository.updateCatalogItem(id, body);
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Error en PATCH de artículo:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al actualizar estado del artículo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await repository.deleteCatalogItem(id);

    if (!deleted) {
      return NextResponse.json(
        { error: `No se encontró el artículo con ID "${id}" para eliminar.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id, message: "Artículo eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar artículo:", error);
    return NextResponse.json(
      { error: "Error al eliminar artículo del catálogo" },
      { status: 500 }
    );
  }
}
