import { NextRequest } from "next/server";

export const MAX_JSON_PAYLOAD_BYTES = 1024 * 1024;

/**
 * Comprueba el tamaño declarado de una petición JSON antes de parsearla.
 * Si el cliente no envía Content-Length, se deja pasar y el parseo normal
 * aplica sus propios límites.
 */
export function isPayloadTooLarge(
  request: NextRequest,
  maxBytes: number = MAX_JSON_PAYLOAD_BYTES
): boolean {
  const rawLength = request.headers.get("content-length");
  if (!rawLength) return false;

  const length = Number(rawLength);
  return Number.isFinite(length) && length > maxBytes;
}
