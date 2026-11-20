import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getUploadsDirectory } from "@/lib/data/upload-cleanup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
};

/**
 * Sirve imágenes locales desde el directorio de uploads, incluidas las que se
 * agregan después del build (Next.js no las publica automáticamente en runtime).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeName = path.basename(filename);

  if (
    !safeName ||
    safeName !== filename ||
    safeName === "." ||
    safeName === ".." ||
    safeName === ".gitkeep"
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const extension = path.extname(safeName).toLowerCase();
  const contentType = MIME_BY_EXTENSION[extension];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  const uploadsDirectory = getUploadsDirectory();
  const filePath = path.resolve(uploadsDirectory, safeName);

  if (!filePath.startsWith(`${uploadsDirectory}${path.sep}`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
