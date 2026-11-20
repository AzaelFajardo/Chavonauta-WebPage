import { NextRequest, NextResponse } from "next/server";
import {
  sqliteCheckLoginRateLimit,
  sqliteRecordFailedLoginAttempt,
  sqliteIsEmailInWhitelist,
} from "@/lib/data/sqlite-db";

function getClientIp(request: NextRequest): string {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0];
    if (firstIp) return firstIp.trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 1. Verificar Rate Limiting
    const rateLimit = await sqliteCheckLoginRateLimit(ip);
    if (rateLimit.locked) {
      const remainingSeconds = rateLimit.lockedUntil
        ? Math.max(0, rateLimit.lockedUntil - Math.floor(Date.now() / 1000))
        : 900;
      const minutes = Math.ceil(remainingSeconds / 60);

      return NextResponse.json(
        {
          authorized: false,
          error: `Acceso temporalmente suspendido por múltiples intentos fallidos. Inténtalo en ${minutes} minuto(s).`,
          locked: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { authorized: false, error: "Ingresa un correo electrónico válido." },
        { status: 400 }
      );
    }

    // 2. Verificar existencia en la Whitelist
    const isInWhitelist = await sqliteIsEmailInWhitelist(email);

    if (!isInWhitelist) {
      // Registrar intento fallido para prevenir escaneo masivo de correos
      await sqliteRecordFailedLoginAttempt(ip);

      return NextResponse.json(
        {
          authorized: false,
          error: "Este correo no tiene permisos para acceder al panel.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authorized: true,
      email,
    });
  } catch (error) {
    console.error("Error al verificar correo:", error);
    return NextResponse.json(
      { authorized: false, error: "Error de servidor al verificar el correo." },
      { status: 500 }
    );
  }
}
