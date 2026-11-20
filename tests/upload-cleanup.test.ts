import { describe, it, expect, beforeAll, afterAll } from "vitest";
import path from "path";
import fs from "fs";
import {
  isLocalUpload,
  resolveUploadPath,
  safeDeleteUploadedFile,
  safeDeleteUploadedFileSync,
  getUploadsDirectory,
} from "@/lib/data/upload-cleanup";
import { repository } from "@/lib/data/repository";
import { isImageUrlInUse } from "@/lib/data/sqlite-db";
import { CatalogItem } from "@/types";
import { NextRequest } from "next/server";
import { DELETE as deleteUploadApi } from "@/app/api/upload/route";
import { GET as serveUploadApi } from "@/app/uploads/[filename]/route";
import { createSessionToken } from "@/lib/auth/security";

describe("Upload Cleanup & Image Lifecycle Management", () => {
  const uploadsDir = getUploadsDirectory();
  const testFile1 = path.join(uploadsDir, `test-cleanup-${Date.now()}-1.png`);
  const testFile2 = path.join(uploadsDir, `test-cleanup-${Date.now()}-2.png`);
  const testUrl1 = `/uploads/${path.basename(testFile1)}`;
  const testUrl2 = `/uploads/${path.basename(testFile2)}`;

  beforeAll(() => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(testFile1, "dummy-image-content-1");
    fs.writeFileSync(testFile2, "dummy-image-content-2");
  });

  afterAll(() => {
    // Limpieza de seguridad por si algún archivo quedó
    if (fs.existsSync(testFile1)) fs.unlinkSync(testFile1);
    if (fs.existsSync(testFile2)) fs.unlinkSync(testFile2);
  });

  it("correctly identifies local upload URLs vs external or invalid URLs", () => {
    expect(isLocalUpload("/uploads/foto.png")).toBe(true);
    expect(isLocalUpload("uploads/foto.jpg")).toBe(true);
    expect(isLocalUpload("/uploads/sub/foto.webp")).toBe(true);

    // No locales
    expect(isLocalUpload("https://images.unsplash.com/photo-123")).toBe(false);
    expect(isLocalUpload("http://example.com/img.png")).toBe(false);
    expect(isLocalUpload("data:image/png;base64,iVBORw0KGgo")).toBe(false);
    expect(isLocalUpload("")).toBe(false);
    expect(isLocalUpload(undefined)).toBe(false);
    expect(isLocalUpload(null)).toBe(false);
  });

  it("prevents path traversal attacks and protects system files like .gitkeep", () => {
    expect(resolveUploadPath("/uploads/../../etc/passwd")).toBe(path.join(uploadsDir, "passwd"));
    expect(resolveUploadPath("/uploads/.gitkeep")).toBeNull();
    expect(resolveUploadPath("/uploads/")).toBeNull();
    expect(resolveUploadPath("https://external.com/img.png")).toBeNull();
  });

  it("safely deletes existing uploaded file and handles non-existent gracefully", async () => {
    const tempFile = path.join(uploadsDir, `temp-${Date.now()}.png`);
    fs.writeFileSync(tempFile, "temp-test");
    const tempUrl = `/uploads/${path.basename(tempFile)}`;

    expect(fs.existsSync(tempFile)).toBe(true);

    const deleted = await safeDeleteUploadedFile(tempUrl);
    expect(deleted).toBe(true);
    expect(fs.existsSync(tempFile)).toBe(false);

    // Eliminar de nuevo no debe lanzar error sino retornar false
    const deletedAgain = await safeDeleteUploadedFile(tempUrl);
    expect(deletedAgain).toBe(false);
  });

  it("detects whether an image URL is in active use in catalog items or theme", async () => {
    const dummyItem: CatalogItem = {
      id: `item-use-${Date.now()}`,
      slug: `item-use-${Date.now()}`,
      name: "Producto con Imagen Activa",
      shortDescription: "Prueba de detección de uso",
      description: "Prueba",
      type: "product",
      categorySlug: "accesorios",
      priceLabel: "$100",
      imageUrl: testUrl1,
      badges: [],
      featured: false,
      active: true,
    };

    // Antes de guardar, la imagen no está en uso en BD
    expect(isImageUrlInUse(testUrl1)).toBe(false);

    // Guardar ítem con la imagen
    await repository.saveCatalogItem(dummyItem);
    expect(isImageUrlInUse(testUrl1)).toBe(true);

    // Excluyendo el propio ítem no está en uso
    expect(isImageUrlInUse(testUrl1, dummyItem.id)).toBe(false);

    // Limpieza
    await repository.deleteCatalogItem(dummyItem.id);
  });

  it("automatically deletes the old local image when a catalog item's image is updated", async () => {
    const updateTestFileOld = path.join(uploadsDir, `test-old-${Date.now()}.png`);
    const updateTestFileNew = path.join(uploadsDir, `test-new-${Date.now()}.png`);
    fs.writeFileSync(updateTestFileOld, "old-image");
    fs.writeFileSync(updateTestFileNew, "new-image");

    const oldUrl = `/uploads/${path.basename(updateTestFileOld)}`;
    const newUrl = `/uploads/${path.basename(updateTestFileNew)}`;

    const testItem: CatalogItem = {
      id: `item-update-img-${Date.now()}`,
      slug: `item-update-img-${Date.now()}`,
      name: "Producto para Actualizar Imagen",
      shortDescription: "Probando sustitución",
      description: "Probando que la vieja imagen se borre del disco",
      type: "product",
      categorySlug: "accesorios",
      priceLabel: "$150",
      imageUrl: oldUrl,
      badges: [],
      featured: false,
      active: true,
    };

    // 1. Guardar con imagen vieja
    await repository.saveCatalogItem(testItem);
    expect(fs.existsSync(updateTestFileOld)).toBe(true);

    // 2. Actualizar imagen a nueva
    await repository.saveCatalogItem({
      ...testItem,
      imageUrl: newUrl,
    });

    // 3. La imagen vieja debió ser eliminada automáticamente del disco
    expect(fs.existsSync(updateTestFileOld)).toBe(false);
    expect(fs.existsSync(updateTestFileNew)).toBe(true);

    // 4. Limpieza del ítem de prueba
    await repository.deleteCatalogItem(testItem.id);
    expect(fs.existsSync(updateTestFileNew)).toBe(false);
  });

  it("automatically deletes the local image when a catalog item is deleted", async () => {
    const deleteTestFile = path.join(uploadsDir, `test-del-${Date.now()}.png`);
    fs.writeFileSync(deleteTestFile, "delete-me");
    const deleteUrl = `/uploads/${path.basename(deleteTestFile)}`;

    const testItem: CatalogItem = {
      id: `item-del-img-${Date.now()}`,
      slug: `item-del-img-${Date.now()}`,
      name: "Producto para Eliminar",
      shortDescription: "Probando eliminación de residuo",
      description: "Probando que el archivo físico se elimine al borrar el ítem",
      type: "product",
      categorySlug: "accesorios",
      priceLabel: "$200",
      imageUrl: deleteUrl,
      badges: [],
      featured: false,
      active: true,
    };

    await repository.saveCatalogItem(testItem);
    expect(fs.existsSync(deleteTestFile)).toBe(true);

    // Eliminar producto
    const deleted = await repository.deleteCatalogItem(testItem.id);
    expect(deleted).toBe(true);

    // El archivo físico debe haber desaparecido
    expect(fs.existsSync(deleteTestFile)).toBe(false);
  });

  it("serves uploaded images at runtime through the dedicated handler", async () => {
    const servedFile = path.join(uploadsDir, `test-serving-${Date.now()}.png`);
    fs.writeFileSync(servedFile, Buffer.from([0x89, 0x50, 0x4e, 0x47]));

    const response = await serveUploadApi(
      new NextRequest(`http://localhost:3000/uploads/${path.basename(servedFile)}`),
      { params: Promise.resolve({ filename: path.basename(servedFile) }) }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");

    const traversal = await serveUploadApi(
      new NextRequest("http://localhost:3000/uploads/../secret.png"),
      { params: Promise.resolve({ filename: "../secret.png" }) }
    );
    expect(traversal.status).toBe(404);

    const disallowed = await serveUploadApi(
      new NextRequest("http://localhost:3000/uploads/document.html"),
      { params: Promise.resolve({ filename: "document.html" }) }
    );
    expect(disallowed.status).toBe(404);

    fs.unlinkSync(servedFile);
  });

  it("handles DELETE /api/upload endpoint securely", async () => {
    const apiTestFile = path.join(uploadsDir, `test-api-del-${Date.now()}.png`);
    fs.writeFileSync(apiTestFile, "api-delete-test");
    const apiDeleteUrl = `/uploads/${path.basename(apiTestFile)}`;

    expect(fs.existsSync(apiTestFile)).toBe(true);

    const token = await createSessionToken("azachavonauta@gmail.com");
    const req = new NextRequest(`http://localhost:3000/api/upload?url=${encodeURIComponent(apiDeleteUrl)}`, {
      method: "DELETE",
      headers: { cookie: `chavonauta_session=${token}` },
    });

    const res = await deleteUploadApi(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.deleted).toBe(true);
    expect(fs.existsSync(apiTestFile)).toBe(false);

    // Petición con URL no local o inválida
    const invalidReq = new NextRequest("http://localhost:3000/api/upload?url=https://external.com/pic.png", {
      method: "DELETE",
      headers: { cookie: `chavonauta_session=${token}` },
    });
    const invalidRes = await deleteUploadApi(invalidReq);
    expect(invalidRes.status).toBe(400);

    // Petición sin sesión
    const unauthenticatedReq = new NextRequest(
      "http://localhost:3000/api/upload?url=%2Fuploads%2Ftest.png",
      { method: "DELETE" }
    );
    const unauthenticatedRes = await deleteUploadApi(unauthenticatedReq);
    expect(unauthenticatedRes.status).toBe(401);
  });
});
