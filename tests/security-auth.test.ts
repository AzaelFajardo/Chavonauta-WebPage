import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST as postCheckEmail } from "@/app/api/auth/check-email/route";
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
  sqliteGetAdminSessionVersion,
} from "@/lib/data/sqlite-db";

describe("Security, Authentication & Rate Limiting - Automated Tests", () => {
  const testIp = "192.168.1.99";

  it("hashes password with unique salt and verifies correctly with constant-time scrypt", () => {
    const rawPw = "ChavonautaSecure2026!";
    const { hash, salt } = hashPassword(rawPw);

    expect(hash).toBeTruthy();
    expect(salt).toBeTruthy();
    expect(hash.length).toBeGreaterThan(32);

    expect(verifyPassword(rawPw, hash, salt)).toBe(true);
    expect(verifyPassword("WrongPassword123", hash, salt)).toBe(false);
    expect(verifyPassword("", hash, salt)).toBe(false);
  });

  it("creates and verifies HMAC-SHA256 session tokens, rejecting tampered or expired tokens", async () => {
    const email = "test.admin@chavonauta.com";
    const token = await createSessionToken(email, 3600);

    expect(token).toBeTruthy();
    expect(token.split(".").length).toBe(3);

    const session = await verifySessionToken(token);
    expect(session).toBeDefined();
    expect(session?.email).toBe(email);
    expect(session?.role).toBe("admin");

    const tampered = token.slice(0, -5) + "abcde";
    const invalidSession = await verifySessionToken(tampered);
    expect(invalidSession).toBeNull();

    const expiredToken = await createSessionToken(email, -10);
    const expiredSession = await verifySessionToken(expiredToken);
    expect(expiredSession).toBeNull();
  });

  it("manages email whitelist: adds, normalizes, checks, and includes azachavonauta@gmail.com", async () => {
    const dynamicEmail = `staff-${Date.now()}@chavonauta.com`;

    const added = await sqliteAddAdminWhitelistEmail(dynamicEmail);
    expect(added).toBe(true);

    expect(await sqliteIsEmailInWhitelist(dynamicEmail.toUpperCase())).toBe(true);

    const list = await sqliteGetAdminWhitelist();
    expect(list).toContain(dynamicEmail.toLowerCase());
    expect(list).toContain("azachavonauta@gmail.com");

    const removed = await sqliteRemoveAdminWhitelistEmail(dynamicEmail);
    expect(removed).toBe(true);
    expect(await sqliteIsEmailInWhitelist(dynamicEmail)).toBe(false);
  });

  it("enforces two-step flow: check-email validates whitelist before password entry", async () => {
    await sqliteResetFailedLoginAttempts(testIp);

    // Correo autorizado (azachavonauta@gmail.com)
    const validReq = new NextRequest("http://localhost:3000/api/auth/check-email", {
      method: "POST",
      headers: { "cf-ray": "test-ray", "cf-connecting-ip": testIp },
      body: JSON.stringify({ email: "azachavonauta@gmail.com" }),
    });
    const validRes = await postCheckEmail(validReq);
    expect(validRes.status).toBe(200);
    const validData = await validRes.json();
    expect(validData.authorized).toBe(true);

    // Correo no autorizado
    const invalidReq = new NextRequest("http://localhost:3000/api/auth/check-email", {
      method: "POST",
      headers: { "cf-ray": "test-ray", "cf-connecting-ip": testIp },
      body: JSON.stringify({ email: "unauthorized-intruder@unknown.com" }),
    });
    const invalidRes = await postCheckEmail(invalidReq);
    expect(invalidRes.status).toBe(403);
    const invalidData = await invalidRes.json();
    expect(invalidData.authorized).toBe(false);
    expect(invalidData.error).toContain("no tiene permisos");

    await sqliteResetFailedLoginAttempts(testIp);
  });

  it("enforces rate-limiting: locks client for 15 minutes after 5 failed attempts (HTTP 429)", async () => {
    const bruteForceIp = "203.0.113.42";
    await sqliteResetFailedLoginAttempts(bruteForceIp);

    for (let i = 1; i <= 4; i++) {
      const req = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "cf-ray": "test-ray", "cf-connecting-ip": bruteForceIp },
        body: JSON.stringify({
          email: "azachavonauta@gmail.com",
          password: `WrongPasswordAttempt${i}`,
        }),
      });
      const res = await postLogin(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.remainingAttempts).toBe(5 - i);
    }

    const req5 = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "cf-ray": "test-ray", "cf-connecting-ip": bruteForceIp },
      body: JSON.stringify({
        email: "azachavonauta@gmail.com",
        password: "WrongPasswordAttempt5",
      }),
    });
    const res5 = await postLogin(req5);
    expect(res5.status).toBe(429);
    expect(res5.headers.get("retry-after")).toBeTruthy();
    const data5 = await res5.json();
    expect(data5.locked).toBe(true);
    expect(data5.error).toContain("temporalmente");

    await sqliteResetFailedLoginAttempts(bruteForceIp);
  });

  it("ignores spoofed X-Forwarded-For headers for rate limiting", async () => {
    await sqliteResetFailedLoginAttempts("local");

    for (let i = 1; i <= 6; i++) {
      const req = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "x-forwarded-for": `10.0.0.${i}` },
        body: JSON.stringify({
          email: "azachavonauta@gmail.com",
          password: "WrongPasswordWithSpoofedHeader",
        }),
      });

      const res = await postLogin(req);
      if (i < 5) {
        expect(res.status).toBe(401);
      } else {
        expect(res.status).toBe(429);
      }
    }

    await sqliteResetFailedLoginAttempts("local");
  });

  it("authenticates valid credentials, sets session cookie, and resets failed attempts", async () => {
    const successIp = "192.168.1.105";
    await sqliteResetFailedLoginAttempts(successIp);

    const testPw = "Chavonauta2026!";
    await sqliteSetAdminPassword(testPw);

    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "cf-ray": "test-ray", "cf-connecting-ip": successIp },
      body: JSON.stringify({
        email: "azachavonauta@gmail.com",
        password: testPw,
      }),
    });

    const res = await postLogin(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.email).toBe("azachavonauta@gmail.com");

    const cookie = res.cookies.get("chavonauta_session");
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBeTruthy();

    const logoutRes = await postLogout();
    expect(logoutRes.status).toBe(200);
    const logoutCookie = logoutRes.cookies.get("chavonauta_session");
    expect(logoutCookie?.maxAge).toBe(0);
  });

  it("invalidates active sessions when the password changes", async () => {
    const email = "azachavonauta@gmail.com";

    await sqliteSetAdminPassword("InitialPasswordForRevocation2026!");
    const oldVersion = await sqliteGetAdminSessionVersion();
    const oldToken = await createSessionToken(email, 3600, oldVersion);

    const initialReq = new NextRequest("http://localhost:3000/api/admin/security", {
      headers: { cookie: `chavonauta_session=${oldToken}` },
    });
    const initialRes = await getSecurity(initialReq);
    expect(initialRes.status).toBe(200);

    await sqliteSetAdminPassword("UpdatedPasswordForRevocation2026!");

    const rejectedReq = new NextRequest("http://localhost:3000/api/admin/security", {
      headers: { cookie: `chavonauta_session=${oldToken}` },
    });
    const rejectedRes = await getSecurity(rejectedReq);
    expect(rejectedRes.status).toBe(401);

    const newVersion = await sqliteGetAdminSessionVersion();
    const newToken = await createSessionToken(email, 3600, newVersion);
    const renewedReq = new NextRequest("http://localhost:3000/api/admin/security", {
      headers: { cookie: `chavonauta_session=${newToken}` },
    });
    const renewedRes = await getSecurity(renewedReq);
    expect(renewedRes.status).toBe(200);

    await sqliteSetAdminPassword("Chavonauta2026!");
  });

  it("rejects sessions for emails no longer included in the whitelist", async () => {
    const tempEmail = `revoked-${Date.now()}@chavonauta.com`;
    await sqliteAddAdminWhitelistEmail(tempEmail);

    const version = await sqliteGetAdminSessionVersion();
    const token = await createSessionToken(tempEmail, 3600, version);

    const allowedReq = new NextRequest("http://localhost:3000/api/admin/security", {
      headers: { cookie: `chavonauta_session=${token}` },
    });
    const allowedRes = await getSecurity(allowedReq);
    expect(allowedRes.status).toBe(200);

    await sqliteRemoveAdminWhitelistEmail(tempEmail);

    const revokedReq = new NextRequest("http://localhost:3000/api/admin/security", {
      headers: { cookie: `chavonauta_session=${token}` },
    });
    const revokedRes = await getSecurity(revokedReq);
    expect(revokedRes.status).toBe(401);
  });

  it("protects /api/admin/security: requires valid session and handles whitelist CRUD", async () => {
    const unauthReq = new NextRequest("http://localhost:3000/api/admin/security");
    const unauthRes = await getSecurity(unauthReq);
    expect(unauthRes.status).toBe(401);

    const token = await createSessionToken(
      "azachavonauta@gmail.com",
      24 * 60 * 60,
      await sqliteGetAdminSessionVersion()
    );
    const authReq = new NextRequest("http://localhost:3000/api/admin/security", {
      headers: {
        cookie: `chavonauta_session=${token}`,
      },
    });

    const authRes = await getSecurity(authReq);
    expect(authRes.status).toBe(200);
    const data = await authRes.json();
    expect(Array.isArray(data.whitelist)).toBe(true);
    expect(data.whitelist).toContain("azachavonauta@gmail.com");
  });
});
