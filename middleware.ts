// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "bia_demo_auth";
const PUBLIC_ROUTES = ["/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // permitir /login sin cookie
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const hasAuth = req.cookies.get(AUTH_COOKIE)?.value === "1";

  if (!hasAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/private/:path*", 
  ],
};
