import { NextRequest, NextResponse } from "next/server";
import {
  verifySessionToken,
  SESSION_COOKIE_NAME,
  type AdminSessionPayload,
} from "@/lib/auth/token";
import { isSessionCurrent } from "@/lib/auth/session-policy";

export type AdminAuthResult =
  | { session: AdminSessionPayload; response: null }
  | { session: null; response: NextResponse };

/**
 * Valida la cookie de sesión de una petición administrativa.
 * Devuelve una respuesta 401 lista para retornar cuando no hay sesión válida.
 */
export async function requireAdminSession(
  request: NextRequest
): Promise<AdminAuthResult> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return {
      session: null,
      response: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }

  const session = await verifySessionToken(token);
  if (!session || !(await isSessionCurrent(session))) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Sesión inválida o expirada" },
        { status: 401 }
      ),
    };
  }

  return { session, response: null };
}
