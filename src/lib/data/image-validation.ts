export interface DetectedImage {
  extension: string;
  mime: string;
}

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

/**
 * Valida que un SVG no contenga scripts, manejadores de eventos ni entidades
 * externas. Se permite SVG porque puede usarse para logotipos, pero se sirve
 * con una CSP sandbox para impedir ejecución si se abre directamente.
 */
export function isSafeSvg(svg: string): boolean {
  const lower = svg.toLowerCase();

  if (lower.includes("<script")) return false;
  if (lower.includes("javascript:")) return false;
  if (lower.includes("<foreignobject")) return false;
  if (lower.includes("data:text/html")) return false;
  if (lower.includes("<!doctype") || lower.includes("<!entity")) return false;
  if (/\son[a-z]+\s*=/.test(lower)) return false;

  return true;
}

/**
 * Detecta el tipo real de imagen a partir de su firma binaria.
 * Para SVG se valida el contenido antes de aceptarlo.
 */
export function detectImageType(
  buffer: Buffer,
  declaredMime: string,
  fileName: string
): DetectedImage | null {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    return { extension: "png", mime: "image/png" };
  }

  if (
    buffer.length >= 2 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8
  ) {
    return { extension: "jpg", mime: "image/jpeg" };
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { extension: "webp", mime: "image/webp" };
  }

  if (buffer.length >= 6) {
    const header = buffer.subarray(0, 6).toString("ascii");
    if (header === "GIF87a" || header === "GIF89a") {
      return { extension: "gif", mime: "image/gif" };
    }
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(4, 8).toString("ascii") === "ftyp"
  ) {
    const brand = buffer.subarray(8, 12).toString("ascii");
    if (brand === "avif" || brand === "avis") {
      return { extension: "avif", mime: "image/avif" };
    }
  }

  if (buffer.length >= 2 && buffer[0] === 0x42 && buffer[1] === 0x4d) {
    return { extension: "bmp", mime: "image/bmp" };
  }

  if (
    buffer.length >= 4 &&
    buffer[0] === 0x00 &&
    buffer[1] === 0x00 &&
    buffer[2] === 0x01 &&
    buffer[3] === 0x00
  ) {
    return { extension: "ico", mime: "image/x-icon" };
  }

  const looksLikeSvg =
    declaredMime === "image/svg+xml" || /\.svg$/i.test(fileName);

  if (looksLikeSvg) {
    const text = buffer.toString("utf8").trim();
    if (
      (text.startsWith("<svg") || text.startsWith("<?xml")) &&
      isSafeSvg(text)
    ) {
      return { extension: "svg", mime: "image/svg+xml" };
    }
  }

  return null;
}
