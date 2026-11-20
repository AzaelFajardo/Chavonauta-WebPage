import Database from "better-sqlite3";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const [emailArg, password] = process.argv.slice(2);
const email = emailArg?.toLowerCase().trim();
const databasePath =
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), "src", "lib", "data", "chavonauta.db");

if (!email || !email.includes("@") || !password || password.length < 12) {
  console.error(
    "Uso: npm run admin:recovery -- correo@dominio.com 'NuevaClaveDe12OMas'"
  );
  process.exit(1);
}

if (!fs.existsSync(databasePath)) {
  console.error(`No se encontró la base de datos en: ${databasePath}`);
  process.exit(1);
}

const db = new Database(databasePath);

try {
  const tables = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('admin_auth', 'admin_whitelist')"
    )
    .all();

  if (tables.length < 2) {
    console.error(
      "La base de datos aún no está inicializada. Arranca la aplicación una vez y vuelve a intentarlo."
    );
    process.exit(1);
  }

  const columns = db.prepare("PRAGMA table_info(admin_auth)").all();

  if (!columns.some((column) => column.name === "session_version")) {
    db.exec(
      "ALTER TABLE admin_auth ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0"
    );
  }

  const now = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  const transaction = db.transaction(() => {
    db.prepare(
      "INSERT OR IGNORE INTO admin_whitelist (id, email, created_at, added_by) VALUES (?, ?, ?, 'recovery')"
    ).run(`wl-recovery-${Date.now()}`, email, now);

    const current = db
      .prepare("SELECT session_version FROM admin_auth WHERE id = 'master'")
      .get();

    const nextVersion = (current?.session_version ?? 0) + 1;

    db.prepare(
      "INSERT OR REPLACE INTO admin_auth (id, password_hash, salt, updated_at, session_version) VALUES ('master', ?, ?, ?, ?)"
    ).run(hash, salt, now, nextVersion);
  });

  transaction();

  console.log(`Acceso restablecido para ${email}.`);
  console.log(
    "Inicia sesión y cambia la contraseña desde /admin/seguridad."
  );
} finally {
  db.close();
}
