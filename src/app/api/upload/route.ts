import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import {
  isLocalUpload,
  safeDeleteUploadedFile,
} from "@/lib/data/upload-cleanup";
import { isImageUrlInUse } from "@/lib/data/sqlite-db";
import { requireAdminSession } from "@/lib/auth/require-session";

// Formatos de imagen soportados ampliamente
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo de imagen" },
        { status: 400 }
      );
    }

    // Validar tipo MIME
    if (!file.type.startsWith("image/") && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "El formato no es válido. Sube un archivo de imagen válido (PNG, JPG, SVG, WEBP, GIF, AVIF, etc.).",
        },
        { status: 400 }
      );
    }

    // Validar tamaño máximo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "La imagen excede el límite de 10 MB." },
        { status: 400 }
      );
    }

    // Extraer extensión limpia o inferir del tipo MIME
    let extension = path.extname(file.name).toLowerCase();
    if (!extension) {
      const mimeMap: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/svg+xml": ".svg",
        "image/gif": ".gif",
        "image/avif": ".avif",
      };
      extension = mimeMap[file.type] || ".png";
    }

    // Generar nombre único para evitar colisiones
    const prefix = file.name
      .replace(extension, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .substring(0, 25);

    const filename = `${prefix || "img"}-${Date.now()}${extension}`;

    // Carpeta destino en public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Guardar buffer en disco
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
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
