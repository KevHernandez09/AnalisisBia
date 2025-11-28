import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AUTH_COOKIE = "bia_auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ ok: false, error: "Credenciales inválidas." }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ ok: false, error: "Credenciales inválidas." }, { status: 401 });
        }

        const secret = process.env.AUTH_SECRET;
        if (!secret) throw new Error("AUTH_SECRET no definido");

        await prisma.userSession.create({
            data: {
                userId: user.id,
                ip: req.headers.get("x-forwarded-for") ?? null,
                userAgent: req.headers.get("user-agent") ?? null,
            },
        });

        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: "1d",
        });

        const res = NextResponse.json({ ok: true });
        // Guarda cookie HTTPOnly
        res.cookies.set(AUTH_COOKIE, token, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 día
        });

        return res;

    } catch (err) {
        console.error("Error en login:", err);
        return NextResponse.json({ ok: false, error: "Error interno." }, { status: 500 });
    }
}
