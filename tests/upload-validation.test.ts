import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { POST as uploadApi } from "@/app/api/upload/route";
import { createSessionToken } from "@/lib/auth/security";
import { getUploadsDirectory } from "@/lib/data/upload-cleanup";
import { sqliteGetAdminSessionVersion } from "@/lib/data/sqlite-db";

const PNG_BYTES = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x00,
]);

async function adminCookie(): Promise<string> {
  const version = await sqliteGetAdminSessionVersion();
  return `chavonauta_session=${await createSessionToken(
    "azachavonauta@gmail.com",
    3600,
    version
  )}`;
}

function buildRequest(
  file: File,
  cookie: string,
  contentLength?: string
): NextRequest {
  const formData = new FormData();
  formData.append("file", file);

  return new NextRequest("http://localhost:3000/api/upload", {
    method: "POST",
    headers: {
      cookie,
      ...(contentLength ? { "content-length": contentLength } : {}),
    },
    body: formData,
  });
}

function removeUploaded(url: string): void {
  const filename = path.basename(url);
  const filePath = path.join(getUploadsDirectory(), filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

describe("Upload content validation", () => {
  it("accepts a real PNG and derives its extension from the content", async () => {
    const cookie = await adminCookie();
    const file = new File([PNG_BYTES], "photo.png", { type: "image/png" });
    const response = await uploadApi(buildRequest(file, cookie));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toMatch(/^\/uploads\/photo-[a-f0-9-]+\.png$/);
    expect(data.type).toBe("image/png");
    expect(fs.existsSync(path.join(getUploadsDirectory(), data.filename))).toBe(true);

    removeUploaded(data.url);
  });

  it("rejects HTML content disguised as an image", async () => {
    const cookie = await adminCookie();
    const file = new File(
      [Buffer.from("<html><script>alert(1)</script></html>")],
      "disguised.png",
      { type: "image/png" }
    );
    const response = await uploadApi(buildRequest(file, cookie));

    expect(response.status).toBe(400);
  });

  it("rejects SVG files that contain scripts", async () => {
    const cookie = await adminCookie();
    const file = new File(
      [
        Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
        ),
      ],
      "logo.svg",
      { type: "image/svg+xml" }
    );
    const response = await uploadApi(buildRequest(file, cookie));

    expect(response.status).toBe(400);
  });

  it("accepts a simple SVG without active content", async () => {
    const cookie = await adminCookie();
    const file = new File(
      [
        Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="red"/></svg>'
        ),
      ],
      "logo.svg",
      { type: "image/svg+xml" }
    );
    const response = await uploadApi(buildRequest(file, cookie));

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toMatch(/\.svg$/);
    expect(data.type).toBe("image/svg+xml");

    removeUploaded(data.url);
  });

  it("rejects requests whose declared size exceeds the allowed limit", async () => {
    const cookie = await adminCookie();
    const file = new File([PNG_BYTES], "large.png", { type: "image/png" });
    const response = await uploadApi(
      buildRequest(file, cookie, String(20 * 1024 * 1024))
    );

    expect(response.status).toBe(413);
  });
});
