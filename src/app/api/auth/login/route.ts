// src/app/api/auth/login/route.ts
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";

const BCRYPT_PREFIXES = ["$2a$", "$2b$", "$2y$"];

function isBcryptHash(value: string) {
  return BCRYPT_PREFIXES.some((prefix) => value.startsWith(prefix));
}

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "Correo y contraseña son requeridos." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "Credenciales inválidas." },
      { status: 401 },
    );
  }

  const passwordMatches = await (async () => {
    if (isBcryptHash(user.passwordHash)) {
      return bcrypt.compare(password, user.passwordHash);
    }

    const matchesPlaintext = password === user.passwordHash;

    if (!matchesPlaintext) return false;

    const normalizedHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: normalizedHash },
    });

    return true;
  })();

  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Credenciales inválidas." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });

  return setSessionCookie(response, {
    userId: user.id,
    email: user.email,
  });
}
