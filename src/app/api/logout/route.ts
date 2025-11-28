import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const AUTH_COOKIE = "bia_auth";

export async function POST(req: Request) {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(AUTH_COOKIE);

    try {
        const cookieHeader = req.headers.get("cookie") || "";
        const raw = cookieHeader
            .split(";")
            .find((c) => c.trim().startsWith(`${AUTH_COOKIE}=`));

        if (!raw) return res;

        const token = raw.split("=")[1];
        if (!token) return res;

        const secret = process.env.AUTH_SECRET;
        if (!secret) return res;

        const decoded = jwt.verify(token, secret) as { userId: string };
        const session = await prisma.userSession.findFirst({
            where: {
                userId: decoded.userId,
                logoutAt: null,
            },
            orderBy: {
                loginAt: "desc",
            },
        });

        if (session) {
            await prisma.userSession.update({
                where: { id: session.id },
                data: { logoutAt: new Date() },
            });
        }

    } catch (err) {
        console.error("Error registrando logout:", err);
    }

    return res;
}
