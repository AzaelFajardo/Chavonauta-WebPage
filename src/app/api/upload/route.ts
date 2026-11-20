import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import {
  getUploadsDirectory,
  isLocalUpload,
  safeDeleteUploadedFile,
} from "@/lib/data/upload-cleanup";
import { detectImageType } from "@/lib/data/image-validation";
import { isImageUrlInUse } from "@/lib/data/sqlite-db";
import { requireAdminSession } from "@/lib/auth/require-session";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 1024 * 1024; // margen para multipart
const DEFAULT_MAX_UPLOADS_BYTES = 1024 * 1024 * 1024; // 1 GB

function getMaxUploadsBytes(): number {
  const configured = Number(process.env.UPLOADS_MAX_BYTES);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_MAX_UPLOADS_BYTES;
}

async function getDirectorySize(directory: string): Promise<number> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    let total = 0;

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const stats = await fs.stat(path.join(directory, entry.name));
      total += stats.size;
    }

    return total;
  } catch {
    return 0;
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  try {
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: "La imagen excede el límite permitido." },
        { status: 413 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo de imagen" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "La imagen excede el límite de 10 MB." },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detected = detectImageType(buffer, file.type, file.name);

    if (!detected) {
      return NextResponse.json(
        {
          error:
            "El contenido no corresponde a una imagen válida (PNG, JPG, WEBP, GIF, AVIF, BMP, ICO o SVG seguro).",
        },
        { status: 400 }
      );
    }

    const uploadDir = getUploadsDirectory();
    await fs.mkdir(uploadDir, { recursive: true });

    const currentSize = await getDirectorySize(uploadDir);
    if (currentSize + buffer.length > getMaxUploadsBytes()) {
      return NextResponse.json(
        {
          error:
            "Se alcanzó el límite de almacenamiento de imágenes del servidor.",
        },
        { status: 413 }
      );
    }

    const prefix = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .substring(0, 25);

    const filename = `${prefix || "img"}-${crypto.randomUUID()}.${detected.extension}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: buffer.length,
      type: detected.mime,
    });
  } catch (error) {
    console.error("Error al procesar subida de archivo:", error);
    return NextResponse.json(
      { error: "Error interno al guardar la imagen en el servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    let url = searchParams.get("url");

    if (!url) {
      try {
        const body = await request.json();
        url = body?.url;
      } catch {
        // Ignorar si no hay cuerpo JSON
      }
    }

    if (!url || !isLocalUpload(url)) {
      return NextResponse.json(
        { error: "Se requiere una URL válida de archivo local en /uploads/" },
        { status: 400 }
      );
    }

    if (await isImageUrlInUse(url)) {
      return NextResponse.json(
        { error: "La imagen está en uso y no puede eliminarse." },
        { status: 409 }
      );
    }

    const deleted = await safeDeleteUploadedFile(url);
    return NextResponse.json({
      success: true,
      deleted,
      url,
    });
  } catch (error) {
    console.error("Error al eliminar archivo local:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar el archivo" },
      { status: 500 }
    );
  }
}
