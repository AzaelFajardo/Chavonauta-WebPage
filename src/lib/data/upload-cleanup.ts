import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";

/**
 * Directorio absoluto donde se guardan las imágenes subidas en el servidor.
 */
export function getUploadsDirectory(): string {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR);
  }
  return path.resolve(process.cwd(), "public", "uploads");
}

/**
 * Determina si una URL corresponde a un archivo subido localmente en /uploads/
 */
export function isLocalUpload(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const cleanUrl = url.trim().replace(/\\/g, "/");

  // No debe ser una URL externa con protocolo ni base64
  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://") ||
    cleanUrl.startsWith("data:") ||
    cleanUrl.startsWith("//")
  ) {
    return false;
  }

  return cleanUrl.startsWith("/uploads/") || cleanUrl.startsWith("uploads/");
}

/**
 * Resuelve la ruta absoluta en disco de una imagen local de forma segura,
 * previniendo ataques de Path Traversal (ej. ../../etc/passwd) y protegiendo .gitkeep.
 */
export function resolveUploadPath(url: string): string | null {
  if (!isLocalUpload(url)) return null;

  const uploadsDir = getUploadsDirectory();

  // Extraer únicamente el nombre base del archivo para evitar inyecciones de ruta
  let cleanUrl = url.trim().replace(/\\/g, "/");
  cleanUrl = cleanUrl.replace(/^\/+/, ""); // "uploads/..."
  if (cleanUrl === "uploads" || cleanUrl === "uploads/") {
    return null;
  }

  const filename = path.basename(cleanUrl);

  if (
    !filename ||
    filename === "." ||
    filename === ".." ||
    filename === "uploads" ||
    filename === ".gitkeep"
  ) {
    return null;
  }

  const resolvedPath = path.resolve(uploadsDir, filename);

  // Asegurar que la ruta resuelta permanezca estrictamente dentro de public/uploads
  if (!resolvedPath.startsWith(uploadsDir)) {
    return null;
  }

  return resolvedPath;
}

/**
 * Elimina físicamente un archivo de imagen en public/uploads/ si existe.
 * Retorna true si el archivo fue eliminado, o false si no existía o no era válido.
 */
export async function safeDeleteUploadedFile(url: string): Promise<boolean> {
  const filePath = resolveUploadPath(url);
  if (!filePath) return false;

  try {
    if (fs.existsSync(filePath)) {
      await fsp.unlink(filePath);
      return true;
    }
  } catch (error) {
    console.error(`Error al eliminar archivo local huérfano (${filePath}):`, error);
  }

  return false;
}

/**
 * Versión sincrónica de eliminación física para operaciones atómicas.
 */
export function safeDeleteUploadedFileSync(url: string): boolean {
  const filePath = resolveUploadPath(url);
  if (!filePath) return false;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    console.error(`Error al eliminar archivo local huérfano sincrónico (${filePath}):`, error);
  }

  return false;
}
