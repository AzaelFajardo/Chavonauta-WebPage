import type { AdminSessionPayload } from "@/lib/auth/token";
import {
  sqliteGetAdminSessionVersion,
  sqliteIsEmailInWhitelist,
} from "@/lib/data/sqlite-db";

/**
 * Determina si una sesión firmada sigue siendo válida según el estado actual
 * de la base de datos: la versión de sesión debe coincidir y el correo debe
 * continuar autorizado en la whitelist.
 */
export async function isSessionCurrent(
  session: AdminSessionPayload
): Promise<boolean> {
  const [currentVersion, emailAllowed] = await Promise.all([
    sqliteGetAdminSessionVersion(),
    sqliteIsEmailInWhitelist(session.email),
  ]);

  return session.sv === currentVersion && emailAllowed;
}
