import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir la página de inicio de sesión sin autenticación
  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (sessionCookie) {
      const session = await verifySessionToken(sessionCookie);
      if (session) {
        return NextResponse.redirect(new URL("/admin/catalogo", request.url));
      }
    }
    return NextResponse.next();
  }

  // Proteger rutas de API administrativas (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const session = await verifySessionToken(sessionCookie);
    if (!session) {
      return NextResponse.json({ error: "Sesión inválida o expirada" }, { status: 401 });
    }

    return NextResponse.next();
  }

  // Proteger todas las rutas /admin/*
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifySessionToken(sessionCookie);
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
