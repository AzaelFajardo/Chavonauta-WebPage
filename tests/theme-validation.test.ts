import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST as saveTheme } from "@/app/api/theme/route";
import { createSessionToken } from "@/lib/auth/security";
import { sqliteGetAdminSessionVersion } from "@/lib/data/sqlite-db";
import { DEFAULT_THEME_CONFIG } from "@/lib/data/seed";
import { ThemeConfig } from "@/types";

async function adminCookie(): Promise<string> {
  const version = await sqliteGetAdminSessionVersion();
  return `chavonauta_session=${await createSessionToken(
    "azachavonauta@gmail.com",
    3600,
    version
  )}`;
}

function cloneTheme(): ThemeConfig {
  return JSON.parse(JSON.stringify(DEFAULT_THEME_CONFIG)) as ThemeConfig;
}

function themeRequest(theme: unknown, cookie: string): NextRequest {
  return new NextRequest("http://localhost:3000/api/theme", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
    },
    body: JSON.stringify(theme),
  });
}

describe("Theme configuration validation", () => {
  it("accepts a complete valid theme", async () => {
    const response = await saveTheme(themeRequest(cloneTheme(), await adminCookie()));
    expect(response.status).toBe(200);
  });

  it("rejects invalid hexadecimal colors", async () => {
    const theme = cloneTheme();
    theme.palette.primary = "red";
    const response = await saveTheme(themeRequest(theme, await adminCookie()));
    expect(response.status).toBe(400);
  });

  it("rejects unsupported border radius values", async () => {
    const theme = cloneTheme();
    (theme as unknown as { radius: string }).radius = "huge";
    const response = await saveTheme(themeRequest(theme, await adminCookie()));
    expect(response.status).toBe(400);
  });

  it("rejects duplicate section identifiers", async () => {
    const theme = cloneTheme();
    theme.sections[1].id = theme.sections[0].id;
    const response = await saveTheme(themeRequest(theme, await adminCookie()));
    expect(response.status).toBe(400);
  });

  it("rejects invalid contact data", async () => {
    const theme = cloneTheme();
    theme.business.whatsappNumber = "no-es-un-numero";
    const response = await saveTheme(themeRequest(theme, await adminCookie()));
    expect(response.status).toBe(400);
  });

  it("rejects unsupported section types", async () => {
    const theme = cloneTheme();
    (theme.sections[0] as { type: string }).type = "unknown";
    const response = await saveTheme(themeRequest(theme, await adminCookie()));
    expect(response.status).toBe(400);
  });
});
