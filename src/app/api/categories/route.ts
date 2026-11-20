import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
import { requireAdminSession } from "@/lib/auth/require-session";
import { isPayloadTooLarge } from "@/lib/http/request";
import { validateCategoryInput } from "@/lib/validation";
import { Category } from "@/types";

export async function GET() {
  try {
    const categories = await repository.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  if (isPayloadTooLarge(request)) {
    return NextResponse.json(
      { error: "Los datos de la categoría son demasiado grandes." },
      { status: 413 }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const validation = validateCategoryInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Categoría inválida.", details: validation.errors },
        { status: 400 }
      );
    }

    const payload = body as Partial<Category>;
    const name = payload.name!.trim();

    const generatedSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const slug = payload.slug?.trim() || generatedSlug || `categoria-${Date.now()}`;

    const newCategory: Category = {
      id: payload.id || `cat-${Date.now()}`,
      name,
      slug,
      description:
        payload.description?.trim() || `Productos y servicios de ${name}`,
      icon: payload.icon || "Package",
    };

    const saved = await repository.saveCategory(newCategory);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      /UNIQUE constraint failed: categories\.slug/i.test(error.message)
    ) {
      return NextResponse.json(
        { error: "El slug de la categoría ya está en uso." },
        { status: 409 }
      );
    }

    console.error("Error al guardar categoría:", error);
    return NextResponse.json(
      { error: "Error al guardar categoría" },
      { status: 500 }
    );
  }
}

