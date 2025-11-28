import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

const AUTH_COOKIE = "bia_auth";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get(AUTH_COOKIE)?.value;
        if (!token) {
            return NextResponse.json({ user: null });
        }

        const secret = process.env.AUTH_SECRET;
        if (!secret) {
            console.error("AUTH_SECRET no definido");
            return NextResponse.json({ user: null });
        }

        const payload = jwt.verify(token, secret) as {
            userId: string;
            name?: string | null;
            email?: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ user });
    } catch (err) {
        console.error("Error en /api/me:", err);
        return NextResponse.json({ user: null });
    }
}
