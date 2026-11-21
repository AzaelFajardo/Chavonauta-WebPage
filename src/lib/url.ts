import { getSafeExternalUrl } from "@/lib/validation";

/**
 * Devuelve una URL segura para enlaces internos o externos.
 * Acepta rutas internas que empiezan con "/" y URLs http(s).
 */
export function getSafeHref(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  return getSafeExternalUrl(trimmed);
}
