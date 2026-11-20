import { NextRequest, NextResponse } from "next/server";
import {
  sqliteGetAdminWhitelist,
  sqliteAddAdminWhitelistEmail,
  sqliteRemoveAdminWhitelistEmail,
  sqliteGetAdminPasswordCredentials,
  sqliteSetAdminPassword,
  sqliteGetAdminSessionVersion,
} from "@/lib/data/sqlite-db";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/security";
import { requireAdminSession } from "@/lib/auth/require-session";

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  const whitelist = await sqliteGetAdminWhitelist();
  return NextResponse.json({
    whitelist,
    currentSessionEmail: auth.session.email,
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (!auth.session) return auth.response;

  const session = auth.session;

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "add_email") {
      const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
      if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "Correo electrónico no válido" }, { status: 400 });
      }

      const added = await sqliteAddAdminWhitelistEmail(email, session.email);
      if (!added) {
        return NextResponse.json(
          { error: "El correo ya se encuentra en la lista blanca o no es válido" },
          { status: 400 }
        );
      }

      const updatedList = await sqliteGetAdminWhitelist();
      return NextResponse.json({
        success: true,
        whitelist: updatedList,
        message: `Correo ${email} autorizado correctamente.`,
      });
    }

    if (action === "remove_email") {
      const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
      const currentList = await sqliteGetAdminWhitelist();

      if (currentList.length <= 1) {
        return NextResponse.json(
          { error: "No puedes eliminar el único correo autorizado de la lista blanca." },
          { status: 400 }
        );
      }

      const removed = await sqliteRemoveAdminWhitelistEmail(email);
      const updatedList = await sqliteGetAdminWhitelist();

      return NextResponse.json({
        success: removed,
        whitelist: updatedList,
        message: `Correo ${email} eliminado de la lista blanca.`,
      });
    }

    if (action === "change_password") {
      const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
      const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { error: "La nueva contraseña debe tener al menos 8 caracteres." },
          { status: 400 }
        );
      }

      // Validar contraseña actual
      const credentials = await sqliteGetAdminPasswordCredentials();
      if (!credentials) {
        return NextResponse.json({ error: "Credenciales de sistema no encontradas." }, { status: 500 });
      }

      const isCurrentValid = verifyPassword(
        currentPassword,
        credentials.hash,
        credentials.salt
      );

      if (!isCurrentValid) {
        return NextResponse.json(
          { error: "La contraseña actual es incorrecta." },
          { status: 400 }
        );
      }

      await sqliteSetAdminPassword(newPassword);

      const newVersion = await sqliteGetAdminSessionVersion();
      const refreshedToken = await createSessionToken(
        session.email,
        24 * 60 * 60,
        newVersion
      );

      const response = NextResponse.json({
        success: true,
        message: "Contraseña de administración actualizada exitosamente.",
      });
      response.cookies.set(SESSION_COOKIE_NAME, refreshedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json({ error: "Acción no reconocida." }, { status: 400 });
  } catch (error) {
    console.error("Error en configuración de seguridad:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la solicitud de seguridad." },
      { status: 500 }
    );
  }
}
