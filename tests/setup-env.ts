import { afterAll } from "vitest";
import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

const runId = `${process.pid}-${crypto.randomBytes(6).toString("hex")}`;
const databasePath = path.join(os.tmpdir(), `chavonauta-vitest-${runId}.db`);
const uploadsDir = path.join(os.tmpdir(), `chavonauta-vitest-uploads-${runId}`);

process.env.DATABASE_PATH = databasePath;
process.env.UPLOADS_DIR = uploadsDir;
process.env.ADMIN_JWT_SECRET ??= "vitest-only-session-secret-with-32-plus-characters";
process.env.ADMIN_INITIAL_PASSWORD ??= "VitestOnlyAdminPassword2026!";
process.env.NODE_ENV = "test";

afterAll(async () => {
  const { closeDatabase } = await import("@/lib/data/sqlite-db");
  closeDatabase();

  for (const suffix of ["", "-wal", "-shm", "-journal"]) {
    try {
      fs.rmSync(`${databasePath}${suffix}`, { force: true });
    } catch {
      // Ignorar archivos bloqueados por el sistema operativo
    }
  }

  try {
    fs.rmSync(uploadsDir, { recursive: true, force: true });
  } catch {
    // Ignorar limpieza fallida del directorio temporal
  }
});
