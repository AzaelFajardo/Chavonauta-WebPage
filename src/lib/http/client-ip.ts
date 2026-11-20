import { NextRequest } from "next/server";

/**
 * Obtiene la IP del cliente solo cuando la petición proviene de Cloudflare.
 * Las cabeceras enviadas directamente por el cliente no se utilizan para
 * evitar que un atacante evada el limitador cambiando X-Forwarded-For.
 *
 * En despliegues locales (sin Cloudflare) todas las peticiones comparten la
 * clave "local"; el puerto debe permanecer escuchando solo en loopback.
 */
export function getClientIp(request: NextRequest): string {
  const cfRay = request.headers.get("cf-ray");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (cfRay && cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return "local";
}
