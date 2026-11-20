import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
import { requireAdminSession } from "@/lib/auth/require-session";
import { isPayloadTooLarge } from "@/lib/http/request";
import { validateThemeConfig } from "@/lib/validation";
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
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  if (isPayloadTooLarge(request)) {
    return NextResponse.json(
      { error: "La configuración del tema es demasiado grande." },
      { status: 413 }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const validation = validateThemeConfig(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Configuración de tema inválida.",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const theme = body as ThemeConfig;
    const normalizedTheme: ThemeConfig = {
      ...theme,
      business: {
        ...theme.business,
        whatsappNumber: theme.business.whatsappNumber.replace(/\D/g, ""),
      },
    };

    const saved = await repository.saveThemeConfig(normalizedTheme);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    console.error("Error al guardar tema:", error);
    return NextResponse.json(
      { error: "Error interno al guardar la configuración del tema" },
      { status: 500 }
    );
  }
}
