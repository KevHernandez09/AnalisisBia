// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";

const PUBLIC_ROUTES = ["/login", "/api/auth/login", "/api/auth/logout"];

function isPublicRoute(pathname: string) {
  return (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated(req)) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/(private)/(.*)",
    "/analisis-bia",
    "/estrategias-bia",
    "/lista",
    "/proceso-critico",
    "/continuidad",
    "/plan",
    "/api/:path*",
  ],
};
