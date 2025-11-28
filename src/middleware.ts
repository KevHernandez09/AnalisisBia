// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "bia_auth";

const PUBLIC_PAGES = ["/", "/login"];
const PUBLIC_API_ROUTES = ["/api/login"];


function isStaticAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js|txt|webmanifest)$/i)) {
    return true;
  }
  return false;
}

function isPublicPage(pathname: string): boolean {
  return PUBLIC_PAGES.includes(pathname);
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

// Solo revisa si hay cookie
function enforceAuth(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value || null;

  console.log("[MW] enforceAuth → token?", !!token);

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    console.log("[MW] -> redirect /login (no token)");
    return NextResponse.redirect(loginUrl);
  }

  console.log("[MW] token presente → dejar pasar");
  return NextResponse.next();
}

function maybeRedirectIfAuthenticated(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value || null;

  if (!token) return null;

  console.log("[MW] ya autenticado (hay cookie) → redirect /analisis-bia");
  return NextResponse.redirect(new URL("/analisis-bia", req.url));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("[MW] pathname:", pathname);


  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api");


  if (isApiRoute) {
    if (isPublicApi(pathname)) {
      return NextResponse.next();
    }
    return enforceAuth(req);
  }

  if (pathname === "/login") {
    const redirect = maybeRedirectIfAuthenticated(req);
    return redirect ?? NextResponse.next();
  }

  if (isPublicPage(pathname)) {
    return NextResponse.next();
  }
  return enforceAuth(req);
}

export const config = {
  matcher: ["/:path*"],
};
