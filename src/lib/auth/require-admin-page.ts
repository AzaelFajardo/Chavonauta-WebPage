import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  verifySessionToken,
  SESSION_COOKIE_NAME,
  type AdminSessionPayload,
} from "@/lib/auth/token";
import { isSessionCurrent } from "@/lib/auth/session-policy";

/**
 * Protege una página del panel verificando la sesión del lado del servidor.
 * El middleware ya filtra el acceso, pero esta comprobación añade una capa
 * adicional independiente de la configuración del middleware.
 */
export async function requireAdminPage(from: string): Promise<AdminSessionPayload> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session || !(await isSessionCurrent(session))) {
    redirect(`/admin/login?from=${encodeURIComponent(from)}`);
  }

  return session;
}
