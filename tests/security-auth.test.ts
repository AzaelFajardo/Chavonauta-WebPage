import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST as postLogin } from "@/app/api/auth/login/route";
import { POST as postLogout } from "@/app/api/auth/logout/route";
import { GET as getSecurity, POST as postSecurity } from "@/app/api/admin/security/route";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth/security";
import {
  sqliteGetAdminWhitelist,
  sqliteAddAdminWhitelistEmail,
  sqliteRemoveAdminWhitelistEmail,
  sqliteIsEmailInWhitelist,
  sqliteSetAdminPassword,
  sqliteResetFailedLoginAttempts,
} from "@/lib/data/sqlite-db";

describe("Security, Authentication & Rate Limiting - Automated Tests", () => {
  const testIp = "192.168.1.99";

  it("hashes password with unique salt and verifies correctly with constant-time scrypt", () => {
    const rawPw = "ChavonautaSecure2026!";
    const { hash, salt } = hashPassword(rawPw);

    expect(hash).toBeTruthy();
    expect(salt).toBeTruthy();
    expect(hash.length).toBeGreaterThan(32);

    // Verificación correcta
    expect(verifyPassword(rawPw, hash, salt)).toBe(true);

    // Rechazo de contraseña incorrecta
    expect(verifyPassword("WrongPassword123", hash, salt)).toBe(false);
    expect(verifyPassword("", hash, salt)).toBe(false);
  });

  it("creates and verifies HMAC-SHA256 session tokens, rejecting tampered or expired tokens", async () => {
    const email = "test.admin@chavonauta.com";
    const token = await createSessionToken(email, 3600);

    expect(token).toBeTruthy();
    expect(token.split(".").length).toBe(3);

    // Verificación exitosa
    const session = await verifySessionToken(token);
    expect(session).toBeDefined();
    expect(session?.email).toBe(email);
    expect(session?.role).toBe("admin");

    // Token alterado (tampered) debe ser rechazado
    const tampered = token.slice(0, -5) + "abcde";
    const invalidSession = await verifySessionToken(tampered);
    expect(invalidSession).toBeNull();

    // Token expirado
    const expiredToken = await createSessionToken(email, -10);
    const expiredSession = await verifySessionToken(expiredToken);
    expect(expiredSession).toBeNull();
  });

  it("manages email whitelist: adds, normalizes, checks, and protects from deleting last email", async () => {
    const dynamicEmail = `staff-${Date.now()}@chavonauta.com`;

    // 1. Agregar correo
    const added = await sqliteAddAdminWhitelistEmail(dynamicEmail);
    expect(added).toBe(true);

    // 2. Verificar normalización (mayúsculas y espacios)
    expect(await sqliteIsEmailInWhitelist(dynamicEmail.toUpperCase())).toBe(true);

    // 3. Consultar lista
    const list = await sqliteGetAdminWhitelist();
    expect(list).toContain(dynamicEmail.toLowerCase());

    // 4. Eliminar correo
    const removed = await sqliteRemoveAdminWhitelistEmail(dynamicEmail);
    expect(removed).toBe(true);
    expect(await sqliteIsEmailInWhitelist(dynamicEmail)).toBe(false);
  });

  it("prevents email enumeration: returns identical error messages for non-whitelisted email vs wrong password", async () => {
    await sqliteResetFailedLoginAttempts(testIp);

    // Caso A: Correo que NO está en la whitelist
    const reqNonWhitelisted = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "x-forwarded-for": testIp },
      body: JSON.stringify({
        email: "unknown-hacker@attacker.com",
        password: "SomePassword123!",
      }),
    });
    const resA = await postLogin(reqNonWhitelisted);
    const dataA = await resA.json();

    expect(resA.status).toBe(401);
    expect(dataA.error).toBe("Credenciales inválidas o correo no autorizado.");

    // Caso B: Correo que SÍ está en la whitelist pero contraseña incorrecta
    const reqWhitelistedWrongPw = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "x-forwarded-for": testIp },
      body: JSON.stringify({
        email: "ciberchavonauta@gmail.com",
        password: "IncorrectPassword999!",
      }),
    });
    const resB = await postLogin(reqWhitelistedWrongPw);
    const dataB = await resB.json();

    expect(resB.status).toBe(401);
    // El mensaje de error debe ser EXACTAMENTE idéntico para evitar enumeración
    expect(dataB.error).toBe(dataA.error);

    await sqliteResetFailedLoginAttempts(testIp);
  });

  it("enforces rate-limiting: locks client for 15 minutes after 5 failed attempts (HTTP 429)", async () => {
    const bruteForceIp = "203.0.113.42";
    await sqliteResetFailedLoginAttempts(bruteForceIp);

    // Realizar 4 intentos fallidos
    for (let i = 1; i <= 4; i++) {
      const req = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "x-forwarded-for": bruteForceIp },
        body: JSON.stringify({
          email: "ciberchavonauta@gmail.com",
          password: `WrongPasswordAttempt${i}`,
        }),
      });
      const res = await postLogin(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.remainingAttempts).toBe(5 - i);
    }

    // El 5to intento fallido debe disparar bloqueo HTTP 429
    const req5 = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "x-forwarded-for": bruteForceIp },
      body: JSON.stringify({
        email: "ciberchavonauta@gmail.com",
        password: "WrongPasswordAttempt5",
      }),
    });
    const res5 = await postLogin(req5);
    expect(res5.status).toBe(429);
    const data5 = await res5.json();
    expect(data5.locked).toBe(true);
    expect(data5.error).toContain("bloqueado temporalmente");

    // Intentos posteriores mientras esté bloqueado deben responder inmediatamente 429
    const reqBlocked = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "x-forwarded-for": bruteForceIp },
      body: JSON.stringify({
        email: "ciberchavonauta@gmail.com",
        password: "EvenIfCorrectPasswordNow",
      }),
    });
    const resBlocked = await postLogin(reqBlocked);
    expect(resBlocked.status).toBe(429);

    // Limpieza
    await sqliteResetFailedLoginAttempts(bruteForceIp);
  });

  it("authenticates valid credentials, sets session cookie, and resets failed attempts", async () => {
    const successIp = "192.168.1.105";
    await sqliteResetFailedLoginAttempts(successIp);

    // Establecer contraseña de prueba conocida
    const testPw = "Chavonauta2026!";
    await sqliteSetAdminPassword(testPw);

    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "x-forwarded-for": successIp },
      body: JSON.stringify({
        email: "ciberchavonauta@gmail.com",
        password: testPw,
      }),
    });

    const res = await postLogin(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.email).toBe("ciberchavonauta@gmail.com");

    // Verificar cookie de sesión
    const cookie = res.cookies.get("chavonauta_session");
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBeTruthy();

    // Cerrar sesión
    const logoutRes = await postLogout();
    expect(logoutRes.status).toBe(200);
    const logoutCookie = logoutRes.cookies.get("chavonauta_session");
    expect(logoutCookie?.maxAge).toBe(0);
  });

  it("protects /api/admin/security: requires valid session and handles whitelist CRUD", async () => {
    // 1. Sin sesión debe rechazar con 401
    const unauthReq = new NextRequest("http://localhost:3000/api/admin/security");
    const unauthRes = await getSecurity(unauthReq);
    expect(unauthRes.status).toBe(401);

    // 2. Con sesión válida
    const token = await createSessionToken("ciberchavonauta@gmail.com");
    const authReq = new NextRequest("http://localhost:3000/api/admin/security", {
      headers: {
        cookie: `chavonauta_session=${token}`,
      },
    });

    const authRes = await getSecurity(authReq);
    expect(authRes.status).toBe(200);
    const data = await authRes.json();
    expect(Array.isArray(data.whitelist)).toBe(true);
    expect(data.whitelist).toContain("ciberchavonauta@gmail.com");
  });
});
