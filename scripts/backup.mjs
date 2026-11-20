import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const databasePath =
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), "src", "lib", "data", "chavonauta.db");
const uploadsDirectory =
  process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");
const backupDirectory =
  process.env.BACKUP_DIR || path.join(process.cwd(), "backups");
const keep = Math.max(1, Number(process.env.BACKUP_KEEP) || 14);

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

if (!fs.existsSync(databasePath)) {
  console.error(`No se encontró la base de datos en: ${databasePath}`);
  process.exit(1);
}

fs.mkdirSync(backupDirectory, { recursive: true });
const stamp = timestamp();
const databaseBackupPath = path.join(backupDirectory, `chavonauta-${stamp}.db`);

const db = new Database(databasePath);
try {
  await db.backup(databaseBackupPath);
} finally {
  db.close();
}

if (fs.existsSync(uploadsDirectory)) {
  fs.cpSync(
    uploadsDirectory,
    path.join(backupDirectory, `uploads-${stamp}`),
    { recursive: true }
  );
}

function pruneOldBackups() {
  const entries = fs
    .readdirSync(backupDirectory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory()
          ? entry.name.startsWith("uploads-")
          : entry.name.startsWith("chavonauta-") && entry.name.endsWith(".db")
    )
    .map((entry) => {
      const fullPath = path.join(backupDirectory, entry.name);
      return { fullPath, mtime: fs.statSync(fullPath).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  for (const entry of entries.slice(keep)) {
    fs.rmSync(entry.fullPath, { recursive: true, force: true });
  }
}

pruneOldBackups();

console.log(`Respaldo de base de datos: ${databaseBackupPath}`);
if (fs.existsSync(uploadsDirectory)) {
  console.log(`Respaldo de imágenes: ${path.join(backupDirectory, `uploads-${stamp}`)}`);
}
console.log(`Respaldos conservados: ${keep}`);
