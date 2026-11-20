import { describe, it, expect } from "vitest";
import { sanitizeAdminRedirect } from "@/lib/http/safe-redirect";

describe("Admin redirect sanitization", () => {
  it("accepts internal admin paths", () => {
    expect(sanitizeAdminRedirect("/admin/catalogo")).toBe("/admin/catalogo");
    expect(sanitizeAdminRedirect("/admin/personalizador?tab=colors")).toBe(
      "/admin/personalizador?tab=colors"
    );
  });

  it("falls back to the default path for external or unsafe values", () => {
    expect(sanitizeAdminRedirect(null)).toBe("/admin/catalogo");
    expect(sanitizeAdminRedirect("")).toBe("/admin/catalogo");
    expect(sanitizeAdminRedirect("https://evil.example")).toBe(
      "/admin/catalogo"
    );
    expect(sanitizeAdminRedirect("//evil.example")).toBe("/admin/catalogo");
    expect(sanitizeAdminRedirect("/\\evil.example")).toBe("/admin/catalogo");
    expect(sanitizeAdminRedirect("javascript:alert(1)")).toBe(
      "/admin/catalogo"
    );
  });
});
