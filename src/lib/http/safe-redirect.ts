const DEFAULT_ADMIN_PATH = "/admin/catalogo";

/**
 * Acepta únicamente rutas internas como destino posterior al inicio de sesión.
 * Evita redirecciones a dominios externos o esquemas peligrosos.
 */
export function sanitizeAdminRedirect(
  value: string | null | undefined
): string {
  if (!value) return DEFAULT_ADMIN_PATH;
  if (!value.startsWith("/")) return DEFAULT_ADMIN_PATH;
  if (value.startsWith("//")) return DEFAULT_ADMIN_PATH;
  if (value.includes("\\")) return DEFAULT_ADMIN_PATH;

  return value;
}
