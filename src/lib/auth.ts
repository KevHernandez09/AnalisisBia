// src/lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export type SessionPayload = {
  userId: string;
  email: string;
};

const SESSION_COOKIE = "bia_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

function getJwtSecret() {
  return process.env.JWT_SECRET ?? "change-me-in-production";
}

function signSession(payload: SessionPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_MAX_AGE_SECONDS });
}

export function verifySessionToken(token?: string) {
  try {
    if (!token) return null;
    return jwt.verify(token, getJwtSecret()) as SessionPayload;
  } catch (err) {
    console.error("Error verificando sesión", err);
    return null;
  }
}

export function setSessionCookie(response: NextResponse, payload: SessionPayload) {
  const token = signSession(payload);

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export function isAuthenticated(req: NextRequest) {
  return Boolean(getSessionFromRequest(req));
}

export async function requireApiSession() {
  const session = await getSessionFromCookies();

  if (!session) {
    return {
      session: null as SessionPayload | null,
      response: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    } as const;
  }

  return { session } as const;
}
