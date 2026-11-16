import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
import { ThemeConfig } from "@/types";

export async function GET() {
  try {
    const theme = await repository.getThemeConfig();
    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error al obtener tema:", error);
    return NextResponse.json(
      { error: "Error al obtener tema" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ThemeConfig;

    if (!body || !body.palette || !body.business || !Array.isArray(body.sections)) {
      return NextResponse.json(
        { error: "Estructura de configuración de tema inválida" },
        { status: 400 }
      );
    }

    const saved = await repository.saveThemeConfig(body);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    console.error("Error al guardar tema:", error);
    return NextResponse.json(
      { error: "Error interno al guardar la configuración del tema" },
      { status: 500 }
    );
  }
}
