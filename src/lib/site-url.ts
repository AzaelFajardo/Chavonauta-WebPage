/**
 * URL pública del sitio para metadatos, canonical, sitemap y robots.
 * En producción debe configurarse SITE_URL.
 */
export function getSiteUrl(): URL {
  const configured = process.env.SITE_URL;

  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return url;
      }
    } catch {
      // Usar el valor por defecto de desarrollo
    }
  }

  return new URL("http://localhost:49152");
}
