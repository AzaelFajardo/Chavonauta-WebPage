import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/data/repository";
import { AnalyticsEvent } from "@/types";

export async function GET() {
  try {
    const stats = await repository.getAnalytics();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error interno al obtener estadísticas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyticsEvent;

    if (!body || !body.type) {
      return NextResponse.json(
        { error: "El evento requiere un campo 'type' válido" },
        { status: 400 }
      );
    }

    const updated = await repository.recordAnalyticsEvent(body);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error al registrar evento analítico:", error);
    return NextResponse.json(
      { error: "Error interno al registrar métrica" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const reset = await repository.resetAnalytics();
    return NextResponse.json(reset, { status: 200 });
  } catch (error) {
    console.error("Error al reiniciar estadísticas:", error);
    return NextResponse.json(
      { error: "Error interno al reiniciar estadísticas" },
      { status: 500 }
    );
  }
}
