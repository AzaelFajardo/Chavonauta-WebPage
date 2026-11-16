import { NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";

export async function GET() {
  try {
    const theme = await repository.getThemeConfig();
    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error al obtener configuración de tema:", error);
    return NextResponse.json(
      { error: "Error interno al consultar tema" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const currentTheme = await repository.getThemeConfig();

    const updatedTheme = {
      ...currentTheme,
      ...body,
      business: {
        ...currentTheme.business,
        ...(body.business || {}),
        socialLinks: {
          ...currentTheme.business.socialLinks,
          ...(body.business?.socialLinks || {}),
        },
      },
    };

    const saved = await repository.saveThemeConfig(updatedTheme);
    return NextResponse.json({ success: true, theme: saved });
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al guardar configuración" },
      { status: 500 }
    );
  }
}
