import crypto from "crypto";

export {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
  type AdminSessionPayload,
} from "./token";

// Salt y hash simulados para ejecutar en tiempo constante si el correo no existe en la whitelist
const DUMMY_SALT = "a1b2c3d4e5f678901234567890abcdef";
const DUMMY_HASH = crypto.scryptSync("dummy-password-timing-defense", DUMMY_SALT, 64).toString("hex");

/**
 * Genera un hash criptográfico seguro para una contraseña usando scrypt y salt aleatorio.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

/**
 * Verifica una contraseña contra su hash y salt en tiempo constante para evitar ataques de temporización.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedHash, "hex");

    if (computedHash.length !== storedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedHash, storedBuffer);
  } catch {
    return false;
  }
}

/**
 * Ejecuta un cálculo de hash falso con la misma latencia cuando el correo NO está en la whitelist.
 * Esto evita que un atacante descubra qué correos están registrados midiendo el tiempo de respuesta.
 */
export function executeDummyPasswordVerification(password: string): void {
  try {
    const computed = crypto.scryptSync(password, DUMMY_SALT, 64);
    const dummyBuffer = Buffer.from(DUMMY_HASH, "hex");
    crypto.timingSafeEqual(computed, dummyBuffer);
  } catch {
    // Silencioso
  }
}
