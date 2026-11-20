import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import {
  POST as createCatalogItem,
  DELETE as deleteCatalogItems,
} from "@/app/api/catalog/route";
import { POST as createCategory } from "@/app/api/categories/route";
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

function catalogRequest(body: unknown, cookie: string): NextRequest {
  return new NextRequest("http://localhost:3000/api/catalog", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify(body),
  });
}

describe("Catalog and category validation", () => {
  it("rejects unsupported item types", async () => {
    const response = await createCatalogItem(
      catalogRequest(
        {
          name: "Invalid type",
          type: "unknown",
          categorySlug: "papeleria",
        },
        await adminCookie()
      )
    );
    expect(response.status).toBe(400);
  });

  it("rejects negative prices", async () => {
    const response = await createCatalogItem(
      catalogRequest(
        {
          name: "Negative price",
          type: "product",
          categorySlug: "papeleria",
          referencePrice: -10,
        },
        await adminCookie()
      )
    );
    expect(response.status).toBe(400);
  });

  it("rejects unknown categories", async () => {
    const response = await createCatalogItem(
      catalogRequest(
        {
          name: "Unknown category",
          type: "product",
          categorySlug: "categoria-inexistente",
        },
        await adminCookie()
      )
    );
    expect(response.status).toBe(400);
  });

  it("returns 409 when a slug is duplicated", async () => {
    const cookie = await adminCookie();
    const suffix = Date.now();

    const first = await createCatalogItem(
      catalogRequest(
        {
          name: `Slug validation ${suffix}`,
          type: "product",
          categorySlug: "papeleria",
          slug: `slug-validation-${suffix}`,
        },
        cookie
      )
    );
    expect(first.status).toBe(200);
    const created = await first.json();

    const second = await createCatalogItem(
      catalogRequest(
        {
          name: `Slug validation duplicate ${suffix}`,
          type: "product",
          categorySlug: "papeleria",
          slug: `slug-validation-${suffix}`,
        },
        cookie
      )
    );
    expect(second.status).toBe(409);

    const remove = await deleteCatalogItems(
      new NextRequest(
        `http://localhost:3000/api/catalog?id=${encodeURIComponent(created.id)}`,
        { method: "DELETE", headers: { cookie } }
      )
    );
    expect(remove.status).toBe(200);
  });

  it("rejects invalid category names and accepts valid ones", async () => {
    const cookie = await adminCookie();

    const invalid = await createCategory(
      new NextRequest("http://localhost:3000/api/categories", {
        method: "POST",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({ name: "" }),
      })
    );
    expect(invalid.status).toBe(400);

    const valid = await createCategory(
      new NextRequest("http://localhost:3000/api/categories", {
        method: "POST",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({ name: `Categoría de prueba ${Date.now()}` }),
      })
    );
    expect(valid.status).toBe(201);
  });
});
