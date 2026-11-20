import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import {
  GET as getCatalog,
  POST as createCatalogItem,
  DELETE as deleteCatalogItems,
  PATCH as patchCatalogItems,
} from "@/app/api/catalog/route";
import { POST as saveTheme } from "@/app/api/theme/route";
import { POST as createCategory } from "@/app/api/categories/route";
import { POST as uploadFile, DELETE as deleteFile } from "@/app/api/upload/route";
import { createSessionToken } from "@/lib/auth/security";

function jsonRequest(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body: unknown,
  cookie?: string
): NextRequest {
  return new NextRequest(url, {
    method,
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function adminCookie(): Promise<string> {
  return `chavonauta_session=${await createSessionToken("azachavonauta@gmail.com")}`;
}

describe("Authorization on administrative endpoints", () => {
  it("rejects catalog mutations without a session", async () => {
    const create = await createCatalogItem(
      jsonRequest("http://localhost:3000/api/catalog", "POST", {
        name: "Unauthorized item",
        type: "product",
        categorySlug: "papeleria",
      })
    );
    expect(create.status).toBe(401);

    const remove = await deleteCatalogItems(
      new NextRequest("http://localhost:3000/api/catalog?id=none", {
        method: "DELETE",
      })
    );
    expect(remove.status).toBe(401);

    const patch = await patchCatalogItems(
      jsonRequest("http://localhost:3000/api/catalog", "PATCH", {
        id: "none",
        action: "toggleActive",
      })
    );
    expect(patch.status).toBe(401);
  });

  it("rejects theme, category and upload mutations without a session", async () => {
    const theme = await saveTheme(
      jsonRequest("http://localhost:3000/api/theme", "POST", {
        palette: {},
        business: {},
        sections: [],
      })
    );
    expect(theme.status).toBe(401);

    const category = await createCategory(
      jsonRequest("http://localhost:3000/api/categories", "POST", {
        name: "Unauthorized category",
      })
    );
    expect(category.status).toBe(401);

    const upload = await uploadFile(
      new NextRequest("http://localhost:3000/api/upload", { method: "POST" })
    );
    expect(upload.status).toBe(401);

    const remove = await deleteFile(
      new NextRequest(
        "http://localhost:3000/api/upload?url=%2Fuploads%2Ftest.png",
        { method: "DELETE" }
      )
    );
    expect(remove.status).toBe(401);
  });

  it("keeps public GET endpoints available without a session", async () => {
    const response = await getCatalog(
      new NextRequest("http://localhost:3000/api/catalog")
    );
    expect(response.status).toBe(200);
  });

  it("requires a session to list inactive catalog items", async () => {
    const publicResponse = await getCatalog(
      new NextRequest("http://localhost:3000/api/catalog?includeInactive=true")
    );
    expect(publicResponse.status).toBe(401);

    const adminResponse = await getCatalog(
      new NextRequest("http://localhost:3000/api/catalog?includeInactive=true", {
        headers: { cookie: await adminCookie() },
      })
    );
    expect(adminResponse.status).toBe(200);
  });

  it("allows an authenticated inventory round-trip", async () => {
    const cookie = await adminCookie();
    const suffix = Date.now();

    const create = await createCatalogItem(
      jsonRequest(
        "http://localhost:3000/api/catalog",
        "POST",
        {
          name: `Authorization Product ${suffix}`,
          type: "product",
          categorySlug: "papeleria",
          priceLabel: "$1",
          slug: `auth-product-${suffix}`,
          active: false,
        },
        cookie
      )
    );
    expect(create.status).toBe(200);

    const created = await create.json();
    expect(created.id).toBeTruthy();
    expect(created.active).toBe(false);

    const remove = await deleteCatalogItems(
      new NextRequest(
        `http://localhost:3000/api/catalog?id=${encodeURIComponent(created.id)}`,
        {
          method: "DELETE",
          headers: { cookie },
        }
      )
    );
    expect(remove.status).toBe(200);
  });
});
