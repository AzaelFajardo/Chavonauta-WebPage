export const SESSION_COOKIE_NAME = "chavonauta_session";

const SESSION_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  "chavonauta-web-secure-hmac-secret-key-2026-production-salt-987654";

export interface AdminSessionPayload {
  email: string;
  role: "admin";
  iat: number;
  exp: number;
}

/**
 * Codifica una cadena a base64url de forma compatible tanto con Edge Runtime como Node.js.
 */
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Decodifica una cadena base64url a UTF-8 compatible con Edge Runtime y Node.js.
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Genera una firma HMAC-SHA256 usando la Web Crypto API global (soportada en Edge y Node 18+).
 */
async function generateHmacSignature(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const signatureBytes = new Uint8Array(signatureBuffer);
  let binary = "";
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    binary += String.fromCharCode(signatureBytes[i]);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Crea un token de sesión firmado con HMAC-SHA256 (24 horas de vigencia por defecto).
 */
export async function createSessionToken(
  email: string,
  expiresInSeconds: number = 24 * 60 * 60
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    email: email.toLowerCase().trim(),
    role: "admin",
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = await generateHmacSignature(dataToSign, SESSION_SECRET);
  return `${dataToSign}.${signature}`;
}

/**
 * Verifica y decodifica un token de sesión en Edge Runtime o Node.js sin dependencias nativas.
 */
export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToVerify = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = await generateHmacSignature(dataToVerify, SESSION_SECRET);
  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payloadStr = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadStr) as AdminSessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
    }

    if (payload.role !== "admin" || !payload.email) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
