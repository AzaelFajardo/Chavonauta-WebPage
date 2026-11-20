import { NextResponse } from "next/server";
import fs from "fs/promises";
import { constants } from "fs";
import { getDatabase } from "@/lib/data/sqlite-db";
import { getUploadsDirectory } from "@/lib/data/upload-cleanup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Healthcheck mínimo para systemd, cron o un monitor externo.
 * Verifica que SQLite responda y que el directorio de uploads sea escribible.
 */
export async function GET() {
  try {
    getDatabase().prepare("SELECT 1").get();

    const uploadsDirectory = getUploadsDirectory();
    await fs.mkdir(uploadsDirectory, { recursive: true });
    await fs.access(uploadsDirectory, constants.W_OK);

    return NextResponse.json({
      status: "ok",
      checks: {
        database: "ok",
        uploads: "ok",
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        checks: {
          database: "error",
          uploads: "error",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
