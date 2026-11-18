import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as getTheme, POST as postTheme } from "@/app/api/theme/route";
import { GET as getCatalog } from "@/app/api/catalog/route";
import { POST as postUpload } from "@/app/api/upload/route";

describe("API Routes - Automated Tests", () => {
  it("GET /api/theme returns 200 with valid theme configuration", async () => {
    const response = await getTheme();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeDefined();
    expect(data.palette).toBeDefined();
    expect(data.business).toBeDefined();
    expect(Array.isArray(data.sections)).toBe(true);
  });

  it("POST /api/theme rejects invalid or incomplete theme payloads with 400", async () => {
    // Payload vacío o incompleto
    const invalidReq = new NextRequest("http://localhost:3000/api/theme", {
      method: "POST",
      body: JSON.stringify({ invalid: true }),
    });

    const response = await postTheme(invalidReq);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error).toBeTruthy();
  });

  it("GET /api/catalog returns 200 with categories and items array", async () => {
    const req = new NextRequest("http://localhost:3000/api/catalog");
    const response = await getCatalog(req);

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(Array.isArray(data.categories)).toBe(true);
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.categories.length).toBeGreaterThan(0);
    expect(data.items.length).toBeGreaterThan(0);
  });

  it("GET /api/catalog filters dynamically by category parameter", async () => {
    const testCategory = "servicios-cyber";
    const req = new NextRequest(`http://localhost:3000/api/catalog?category=${testCategory}`);
    const response = await getCatalog(req);

    expect(response.status).toBe(200);
    const data = await response.json();

    for (const item of data.items) {
      expect(item.categorySlug).toBe(testCategory);
    }
  });

  it("GET /api/catalog filters dynamically by search query", async () => {
    const searchTerm = "impresion";
    const req = new NextRequest(`http://localhost:3000/api/catalog?search=${searchTerm}`);
    const response = await getCatalog(req);

    expect(response.status).toBe(200);
    const data = await response.json();

    for (const item of data.items) {
      const match =
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.shortDescription.toLowerCase().includes(searchTerm) ||
        item.slug.toLowerCase().includes(searchTerm);
      expect(match).toBe(true);
    }
  });

  it("POST /api/upload rejects request when no file is provided with 400", async () => {
    const emptyFormData = new FormData();
    const req = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: emptyFormData,
    });

    const response = await postUpload(req);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error).toBeTruthy();
    expect(json.error).toContain("No se proporcionó ningún archivo");
  });
});
