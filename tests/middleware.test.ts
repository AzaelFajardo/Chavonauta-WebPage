import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { createSessionToken } from "@/lib/auth/security";
import { sqliteGetAdminSessionVersion } from "@/lib/data/sqlite-db";

async function adminCookie(): Promise<string> {
  const version = await sqliteGetAdminSessionVersion();
  return `chavonauta_session=${await createSessionToken(
    "azachavonauta@gmail.com",
    3600,
    version
  )}`;
}

describe("Admin middleware", () => {
  it("allows the login page without a session", async () => {
    const response = await middleware(
      new NextRequest("http://localhost:3000/admin/login")
    );
    expect(response.status).toBe(200);
  });

  it("allows the login page even with an existing session", async () => {
    const response = await middleware(
      new NextRequest("http://localhost:3000/admin/login", {
        headers: { cookie: await adminCookie() },
      })
    );
    expect(response.status).toBe(200);
  });

  it("redirects unauthenticated admin pages to login", async () => {
    const response = await middleware(
      new NextRequest("http://localhost:3000/admin/catalogo")
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/admin/login");
  });

  it("rejects unauthenticated admin APIs", async () => {
    const response = await middleware(
      new NextRequest("http://localhost:3000/api/admin/security")
    );
    expect(response.status).toBe(401);
  });

  it("allows authenticated admin pages", async () => {
    const response = await middleware(
      new NextRequest("http://localhost:3000/admin/catalogo", {
        headers: { cookie: await adminCookie() },
      })
    );
    expect(response.status).toBe(200);
  });

  it("clears an invalid session cookie", async () => {
    const response = await middleware(
      new NextRequest("http://localhost:3000/admin/catalogo", {
        headers: { cookie: "chavonauta_session=invalid-token" },
      })
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("set-cookie")).toContain("chavonauta_session=");
  });
});
