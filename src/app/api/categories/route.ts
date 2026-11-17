import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
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
  try {
    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la categoría es obligatorio" },
        { status: 400 }
      );
    }

    const slug =
      body.slug?.trim() ||
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newCategory: Category = {
      id: body.id || `cat-${Date.now()}`,
      name,
      slug,
      description:
        body.description?.trim() || `Productos y servicios de ${name}`,
      icon: body.icon || "Package",
    };

    const saved = await repository.saveCategory(newCategory);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Error al guardar categoría:", error);
    return NextResponse.json(
      { error: "Error al guardar categoría" },
      { status: 500 }
    );
  }
}

