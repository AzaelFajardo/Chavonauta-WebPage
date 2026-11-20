import { NextRequest, NextResponse } from "next/server";
import {
  sqliteCheckLoginRateLimit,
  sqliteRecordFailedLoginAttempt,
  sqliteResetFailedLoginAttempts,
  sqliteIsEmailInWhitelist,
  sqliteGetAdminPasswordCredentials,
  sqliteGetAdminSessionVersion,
} from "@/lib/data/sqlite-db";
import {
  verifyPassword,
  executeDummyPasswordVerification,
  createSessionToken,
} from "@/lib/auth/security";
import { getClientIp } from "@/lib/http/client-ip";

function getRetryAfterSeconds(lockedUntil?: number): string {
  const remaining = lockedUntil
    ? Math.max(1, lockedUntil - Math.floor(Date.now() / 1000))
    : 900;
  return String(remaining);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 1. Verificación de tasa de intentos (Rate Limiting anti-fuerza bruta)
    const rateLimit = await sqliteCheckLoginRateLimit(ip);
    if (rateLimit.locked) {
      const remainingSeconds = rateLimit.lockedUntil
        ? Math.max(0, rateLimit.lockedUntil - Math.floor(Date.now() / 1000))
        : 900;
      const minutes = Math.ceil(remainingSeconds / 60);

      return NextResponse.json(
        {
          error: `Demasiados intentos fallidos. Por seguridad, el acceso ha sido bloqueado temporalmente por ${minutes} minuto(s).`,
          locked: true,
          lockedUntil: rateLimit.lockedUntil,
        },
        {
          status: 429,
          headers: {
            "Retry-After": getRetryAfterSeconds(rateLimit.lockedUntil),
          },
        }
      );
    }

    // 2. Parseo de credenciales
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password || !email.includes("@")) {
      return NextResponse.json(
        { error: "Credenciales inválidas o correo no autorizado." },
        { status: 400 }
      );
    }

    // 3. Verificación de existencia en Whitelist
    const isInWhitelist = await sqliteIsEmailInWhitelist(email);
    const credentials = await sqliteGetAdminPasswordCredentials();

    // DEFENSA ANTI-ENUMERACIÓN Y TIMING ATTACK:
    // Si el correo NO está en la whitelist o no hay credenciales, ejecutamos un cálculo
    // criptográfico falso idéntico para que el tiempo de respuesta sea exactamente el mismo.
    if (!isInWhitelist || !credentials) {
      executeDummyPasswordVerification(password);
      const attempt = await sqliteRecordFailedLoginAttempt(ip);

      if (attempt.locked) {
        return NextResponse.json(
          {
            error:
              "Demasiados intentos fallidos. Por seguridad, el acceso ha sido bloqueado temporalmente por 15 minutos.",
            locked: true,
          },
          {
            status: 429,
            headers: {
              "Retry-After": getRetryAfterSeconds(attempt.lockedUntil),
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: "Contraseña incorrecta.",
          remainingAttempts: attempt.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Verificación de contraseña criptográfica
    const isPasswordValid = verifyPassword(password, credentials.hash, credentials.salt);

    if (!isPasswordValid) {
      const attempt = await sqliteRecordFailedLoginAttempt(ip);

      if (attempt.locked) {
        return NextResponse.json(
          {
            error:
              "Demasiados intentos fallidos. Por seguridad, el acceso ha sido bloqueado temporalmente por 15 minutos.",
            locked: true,
          },
          {
            status: 429,
            headers: {
              "Retry-After": getRetryAfterSeconds(attempt.lockedUntil),
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: "Contraseña incorrecta.",
          remainingAttempts: attempt.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 5. Autenticación exitosa: reiniciar contador de fallos y emitir sesión
    await sqliteResetFailedLoginAttempts(ip);
    const sessionVersion = await sqliteGetAdminSessionVersion();
    const token = await createSessionToken(email, 24 * 60 * 60, sessionVersion);

    const response = NextResponse.json({
      success: true,
      email,
      message: "Acceso concedido.",
    });

    response.cookies.set("chavonauta_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 horas
    });

    return response;
  } catch (error) {
    console.error("Error en endpoint de login:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el inicio de sesión." },
      { status: 500 }
    );
  }
}
